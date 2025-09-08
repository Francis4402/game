import { pgTable, pgEnum, timestamp, varchar, uuid } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum('user_role', ['User', 'Admin']);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password" , { length: 255 }),
  role: userRoleEnum('role').notNull().default('User'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});