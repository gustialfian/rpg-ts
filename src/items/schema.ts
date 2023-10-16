import { jsonb, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const items = pgTable('items', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    attributes: jsonb('attributes'),
})

export type Items = typeof items.$inferSelect
export type NewItems = typeof items.$inferInsert
