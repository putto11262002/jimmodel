import { Table } from "drizzle-orm";

export type ColumnNames<T extends Table> = keyof T["_"]["columns"];
