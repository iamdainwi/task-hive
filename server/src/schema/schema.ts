import { boolean, date, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    created_at: timestamp("created_at").defaultNow(),
});

export const tasksTable = pgTable("tasks", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    status: boolean("status").notNull().default(false),
    due_date: date("due_date"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
});
