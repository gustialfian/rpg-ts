import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username').notNull(),
    password: varchar('password').notNull(),
})

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);