
import {
  compare,
  hash,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../lib/auth";
import {
  StaffCreateInput,
  Staff,
  StaffRole,
  StaffWithoutSecrets,
  StaffLoginInput,
  StaffLoginResult,
  StaffUpdateInput,
  StaffUpdatePasswordInput,
  StaffGetQuery,
  PaginatedData
  
} from "@jimmodel/shared";
import ConstraintViolationError from "../lib/errors/constraint-violation-error";
import AuthenticationError from "../lib/errors/authentication-error";
import { buildPaginatedData } from "../lib/paginated-data";
import NotFoundError from "../lib/errors/not-found-error";
import pgk from "@prisma/client";
import { prisma } from "../prisma";
import { JWTPayload } from "../types/jwt";

export interface IStaffService {
  create(staff: StaffCreateInput): Promise<StaffWithoutSecrets>;
  login(loginInput: StaffLoginInput): Promise<StaffLoginResult>;
  refreshToken(token: string): Promise<StaffLoginResult>;
  logout(id: string): Promise<void>;
  updateById(id: string, staff: StaffUpdateInput): Promise<StaffWithoutSecrets>;
  updatePasswordById(
    id: string,
    staff: StaffUpdatePasswordInput
  ): Promise<void>;
  getById(id: string): Promise<StaffWithoutSecrets>;
  getAll(query: StaffGetQuery): Promise<PaginatedData<StaffWithoutSecrets>>;
}

const selectWithoutSecrets = pgk.Prisma.validator<pgk.Prisma.StaffSelect>()({
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  username: true,
  password: false,
  role: true,
  logout: false,
  createdAt: true,
  updatedAt: true,
  color: true
});

function whereEmailOrUsername(
  email: string,
  username: string
): pgk.Prisma.StaffWhereInput {
  return {
    OR: [
      {
        email,
      },
      {
        username,
      },
    ],
  };
}

function removeSecrets(staff: Staff): StaffWithoutSecrets {
  const { password, logout, ...rest } = staff;
  return rest;
}

async function create(
  inputStaff: StaffCreateInput
): Promise<StaffWithoutSecrets> {
  const staff = await prisma.staff.findFirst({
    where: whereEmailOrUsername(inputStaff.email, inputStaff.username),
    select: selectWithoutSecrets,
  });

  if (inputStaff.role === StaffRole.ROOT) {
    const rootStaff = await prisma.staff.findFirst({
      where: {
        role: StaffRole.ROOT,
      },
    });
    if (rootStaff !== null) {
      throw new ConstraintViolationError("Root staff already exists");
    }
  }

  if (staff !== null) {
    throw new ConstraintViolationError(
      "Staff with this email or username already exists"
    );
  }


  const hashedPassword = await hash(inputStaff.password);
  inputStaff.password = hashedPassword;
  const createdStaff = prisma.staff.create({
    data: { ...inputStaff, role: inputStaff.role ?? StaffRole.GENERAL },
    select: selectWithoutSecrets,
  });

  return createdStaff;
}

async function login(loginInput: StaffLoginInput): Promise<StaffLoginResult> {
  const staff = await prisma.staff.findFirst({
    where: whereEmailOrUsername(
      loginInput.usernameOrEmail,
      loginInput.usernameOrEmail
    ),
  });

  if (staff === null) {
    throw new AuthenticationError("Invalid username/email or password");
  }

  const matched = await compare(loginInput.password, staff.password);

  if (!matched) {
    throw new AuthenticationError("Invalid username/email or password");
  }

  const jwtPayload: JWTPayload = { id: staff.id, role: staff.role };
  const accessToken = signAccessToken(jwtPayload);
  const refreshToken = signRefreshToken(jwtPayload);

  const staffWithoutSecrets = removeSecrets(staff);

  const loginResult: StaffLoginResult = {
    accessToken,
    refreshToken,
    staff: staffWithoutSecrets,
  };
  return loginResult;
}

async function refreshToken(token: string): Promise<StaffLoginResult> {
  const payload = verifyRefreshToken(token);
  const staff = await prisma.staff.findUnique({
    where: { id: payload.id },
    select: selectWithoutSecrets,
  });
  if (staff === null) {
    throw new AuthenticationError("Invalid token");
  }

  const newPayload = { id: staff.id, role: staff.role };

  const accessToken = signAccessToken(newPayload);
  const refreshToken = signRefreshToken(newPayload);

  const loginResult: StaffLoginResult = {
    accessToken,
    refreshToken,
    staff: staff,
  };

  return loginResult;
}

async function logout(id: string): Promise<void> {
  const staff = await prisma.staff.findUnique({ where: { id: id } });

  if (staff === null) {
    throw new NotFoundError("Invalid token");
  }

  await prisma.staff.update({
    where: { id },
    data: {
      logout: true,
    },
  });
}

async function updateById(
  id: string,
  staffInput: StaffUpdateInput
): Promise<StaffWithoutSecrets> {
  const staff = await prisma.staff.findUnique({ where: { id } });

  if (staff === null) {
    throw new NotFoundError("Staff not found");
  }

  if (
    staff.role === StaffRole.ROOT &&
    staffInput.role !== StaffRole.ROOT && staffInput.role !== undefined
  ) {
    throw new ConstraintViolationError("Cannot change root staff role");
  }

  if (staff.role !== StaffRole.ROOT && staffInput.role === StaffRole.ROOT) {
    throw new ConstraintViolationError("Cannot change staff role to root");
  }

  const updatedStaff = await prisma.staff.update({
    where: { id },
    data: staffInput,
    select: selectWithoutSecrets,
  });

  return updatedStaff;
}

async function updatePasswordById(
  id: string,
  staffInput: StaffUpdatePasswordInput
): Promise<void> {
  const staff = await prisma.staff.findUnique({ where: { id } });

  if (staff === null) {
    throw new NotFoundError("Staff not found");
  }

  const hashedPassword = await hash(staffInput.newPassword);

  console.log(staffInput.newPassword, hashedPassword)

  await prisma.staff.update({
    where: { id },
    data: {
      password: hashedPassword,
    },
  });
}

async function getById(id: string): Promise<StaffWithoutSecrets> {
  const staff = await prisma.staff.findUnique({
    where: { id },
    select: selectWithoutSecrets,
  });
  if (staff === null) {
    throw new NotFoundError("Staff not found");
  }
  return staff;
}

async function getAll(
  query: StaffGetQuery
): Promise<PaginatedData<StaffWithoutSecrets>> {
  const where: pgk.Prisma.StaffWhereInput = {};

  if (query.q !== undefined) {
    where.OR = [
      {
        firstName: {
          startsWith: query.q,
          mode: "insensitive",
        },
      },
      {
        lastName: {
          startsWith: query.q,
          mode: "insensitive",
        },
      },
      {
        username: {
          startsWith: query.q,
          mode: "insensitive",
        },
      },
      {
        email: {
          startsWith: query.q,
          mode: "insensitive",
        },
      },
    ];
  }

  if (query.roles && query.roles.length > 0) {
    where.role = {
      in: query.roles,
    };
  }

  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;

  const [staffs, total] = await Promise.all([
    prisma.staff.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [query.orderBy ?? pgk.Prisma.StaffScalarFieldEnum.updatedAt]:
          query.orderDir ?? "desc",
      },
      select: selectWithoutSecrets,
    }),
    prisma.staff.count({ where }),
  ]);

  const paginatedStaff = buildPaginatedData(staffs, page, pageSize, total);

  return paginatedStaff;
}

const staffService: IStaffService = {
  create,
  login,
  refreshToken,
  logout,
  updateById,
  updatePasswordById,
  getById,
  getAll,
};

export default staffService;
