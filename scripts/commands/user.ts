import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, account } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import type { ArgumentsCamelCase } from "yargs";

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message: string) {
  log(`Error: ${message}`, "red");
}

function success(message: string) {
  log(`${message}`, "green");
}

function info(message: string) {
  log(`${message}`, "cyan");
}

function warning(message: string) {
  log(`Warning: ${message}`, "yellow");
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password requirements
function isValidPassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" };
  }
  if (password.length > 128) {
    return { valid: false, error: "Password must be less than 128 characters" };
  }
  return { valid: true };
}

// Prompt for input if not provided
async function promptIfMissing(
  rl: readline.Interface,
  value: string | undefined,
  prompt: string,
  validate?: (v: string) => { valid: boolean; error?: string }
): Promise<string> {
  if (value) {
    if (validate) {
      const result = validate(value);
      if (!result.valid) {
        throw new Error(result.error);
      }
    }
    return value;
  }

  const answer = await rl.question(prompt);
  if (!answer.trim()) {
    throw new Error(`${prompt.replace(/:\s*$/, "")} is required`);
  }

  if (validate) {
    const result = validate(answer);
    if (!result.valid) {
      throw new Error(result.error);
    }
  }

  return answer.trim();
}

// User create command types
export interface CreateArgs {
  name?: string;
  email?: string;
  password?: string;
  verified?: boolean;
}

// User list command types
export interface ListArgs {
  json?: boolean;
}

// User update command types
export interface UpdateArgs {
  email: string;
  name?: string;
  newEmail?: string;
  verified?: boolean;
  unverified?: boolean;
}

// User set-password command types
export interface SetPasswordArgs {
  email: string;
  password?: string;
}

// User delete command types
export interface DeleteArgs {
  email: string;
  force?: boolean;
}

/**
 * Create a new user
 */
export async function createUser(argv: ArgumentsCamelCase<CreateArgs>): Promise<void> {
  let rl: readline.Interface | null = null;

  try {
    let name = argv.name;
    let email = argv.email;
    let password = argv.password;
    const shouldVerify = argv.verified ?? false;

    // If any required fields are missing, prompt for them
    if (!name || !email || !password) {
      rl = readline.createInterface({ input, output });

      log("\nCreate New User", "bright");
      log("=" + "=".repeat(49), "bright");
      console.log();

      name = await promptIfMissing(rl, name, "Name: ");
      email = await promptIfMissing(rl, email, "Email: ", (v) =>
        isValidEmail(v) ? { valid: true } : { valid: false, error: "Invalid email format" }
      );
      password = await promptIfMissing(rl, password, "Password (min 8 chars): ", isValidPassword);

      rl.close();
      rl = null;
    } else {
      // Validate provided values
      if (!isValidEmail(email)) {
        throw new Error("Invalid email format");
      }
      const passwordValidation = isValidPassword(password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.error);
      }
    }

    info("Checking if user already exists...");

    // Check if user already exists
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email.toLowerCase().trim()),
    });

    if (existingUser) {
      throw new Error(`User with email ${email} already exists`);
    }

    info("Creating user with Better Auth...");

    // Use Better Auth's API to create the user
    const request = new Request("http://localhost:3000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password: password,
        name: name.trim(),
      }),
    });

    const response = await auth.handler(request);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to create user: ${result.error || "Unknown error"}`);
    }

    // Get the created user to show details
    const createdUser = await db.query.user.findFirst({
      where: eq(user.email, email.toLowerCase().trim()),
    });

    if (!createdUser) {
      throw new Error("User was created but could not be retrieved");
    }

    // Update email verification status if requested
    if (shouldVerify && !createdUser.emailVerified) {
      await db
        .update(user)
        .set({ emailVerified: true })
        .where(eq(user.id, createdUser.id));
    }

    console.log();
    success("User created successfully!");
    console.log();
    log("User Details:", "bright");
    log(`  ID:             ${createdUser.id}`);
    log(`  Name:           ${createdUser.name}`);
    log(`  Email:          ${createdUser.email}`);
    log(`  Email Verified: ${shouldVerify ? "Yes" : "No"}`);
    log(`  Created At:     ${createdUser.createdAt.toISOString()}`);
    console.log();
  } catch (err) {
    if (rl) rl.close();
    error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

/**
 * List all users
 */
export async function listUsers(argv: ArgumentsCamelCase<ListArgs>): Promise<void> {
  try {
    const users = await db.query.user.findMany({
      orderBy: (user, { desc }) => [desc(user.createdAt)],
    });

    if (users.length === 0) {
      info("No users found.");
      return;
    }

    if (argv.json) {
      console.log(JSON.stringify(users, null, 2));
      return;
    }

    // Table format output
    console.log();
    log("Users", "bright");
    log("=" + "=".repeat(99), "bright");
    console.log();

    // Header
    const header = [
      "ID".padEnd(24),
      "Name".padEnd(20),
      "Email".padEnd(30),
      "Verified".padEnd(10),
      "Created At".padEnd(24),
    ].join(" | ");
    console.log(header);
    console.log("-".repeat(header.length));

    // Rows
    for (const u of users) {
      const row = [
        u.id.padEnd(24),
        (u.name || "-").substring(0, 18).padEnd(20),
        u.email.substring(0, 28).padEnd(30),
        (u.emailVerified ? "Yes" : "No").padEnd(10),
        u.createdAt.toISOString().substring(0, 19).padEnd(24),
      ].join(" | ");
      console.log(row);
    }

    console.log();
    info(`Total: ${users.length} user(s)`);
    console.log();
  } catch (err) {
    error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

/**
 * Update a user
 */
export async function updateUser(argv: ArgumentsCamelCase<UpdateArgs>): Promise<void> {
  try {
    const email = argv.email.toLowerCase().trim();

    // Find the user
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!existingUser) {
      throw new Error(`User with email ${email} not found`);
    }

    // Build update object
    const updates: Partial<{ name: string; email: string; emailVerified: boolean }> = {};

    if (argv.name) {
      updates.name = argv.name.trim();
    }

    if (argv.newEmail) {
      const newEmail = argv.newEmail.toLowerCase().trim();
      if (!isValidEmail(newEmail)) {
        throw new Error("Invalid new email format");
      }
      // Check if new email is already taken
      if (newEmail !== email) {
        const emailTaken = await db.query.user.findFirst({
          where: eq(user.email, newEmail),
        });
        if (emailTaken) {
          throw new Error(`Email ${newEmail} is already taken`);
        }
      }
      updates.email = newEmail;
    }

    if (argv.verified) {
      updates.emailVerified = true;
    } else if (argv.unverified) {
      updates.emailVerified = false;
    }

    if (Object.keys(updates).length === 0) {
      warning("No updates specified. Use --name, --email, --verified, or --unverified flags.");
      return;
    }

    info(`Updating user ${email}...`);

    await db
      .update(user)
      .set(updates)
      .where(eq(user.id, existingUser.id));

    // Fetch updated user
    const updatedUser = await db.query.user.findFirst({
      where: eq(user.id, existingUser.id),
    });

    console.log();
    success("User updated successfully!");
    console.log();
    log("Updated User Details:", "bright");
    log(`  ID:             ${updatedUser!.id}`);
    log(`  Name:           ${updatedUser!.name}`);
    log(`  Email:          ${updatedUser!.email}`);
    log(`  Email Verified: ${updatedUser!.emailVerified ? "Yes" : "No"}`);
    log(`  Updated At:     ${updatedUser!.updatedAt.toISOString()}`);
    console.log();
  } catch (err) {
    error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

/**
 * Set a user's password
 */
export async function setPassword(argv: ArgumentsCamelCase<SetPasswordArgs>): Promise<void> {
  let rl: readline.Interface | null = null;

  try {
    const email = argv.email.toLowerCase().trim();
    let password = argv.password;

    // Find the user
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!existingUser) {
      throw new Error(`User with email ${email} not found`);
    }

    // Prompt for password if not provided
    if (!password) {
      rl = readline.createInterface({ input, output });
      password = await promptIfMissing(rl, password, "New Password (min 8 chars): ", isValidPassword);
      rl.close();
      rl = null;
    } else {
      const passwordValidation = isValidPassword(password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.error);
      }
    }

    info(`Setting password for user ${email}...`);

    // Find the user's credential account (password is stored in the account table)
    const existingAccount = await db.query.account.findFirst({
      where: eq(account.userId, existingUser.id),
    });

    if (!existingAccount) {
      throw new Error(`No credential account found for user ${email}`);
    }

    // Use Better Auth's hashPassword function
    // Better Auth uses bcrypt for password hashing internally
    const hashedPassword = await hashPassword(password);

    // Update the password in the account table
    await db
      .update(account)
      .set({ password: hashedPassword })
      .where(eq(account.id, existingAccount.id));

    console.log();
    success(`Password updated successfully for user ${email}!`);
    console.log();
  } catch (err) {
    if (rl) rl.close();
    error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

/**
 * Delete a user
 */
export async function deleteUser(argv: ArgumentsCamelCase<DeleteArgs>): Promise<void> {
  let rl: readline.Interface | null = null;

  try {
    const email = argv.email.toLowerCase().trim();

    // Find the user
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!existingUser) {
      throw new Error(`User with email ${email} not found`);
    }

    // Confirm deletion if not forced
    if (!argv.force) {
      rl = readline.createInterface({ input, output });
      const confirm = await rl.question(
        `Are you sure you want to delete user "${existingUser.name}" (${existingUser.email})? [y/N]: `
      );
      rl.close();
      rl = null;

      if (confirm.toLowerCase() !== "y") {
        info("Deletion cancelled.");
        return;
      }
    }

    info(`Deleting user ${email}...`);

    // Delete the user (sessions and accounts will cascade delete)
    await db.delete(user).where(eq(user.id, existingUser.id));

    console.log();
    success(`User ${email} deleted successfully!`);
    console.log();
  } catch (err) {
    if (rl) rl.close();
    error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}
