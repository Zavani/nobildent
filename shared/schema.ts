import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const appointmentStatusEnum = pgEnum('appointment_status', ['pending', 'confirmed', 'rescheduled', 'completed', 'cancelled']);

export const programari = pgTable("programari", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nume: varchar("nume", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull(),
  telefon: varchar("telefon", { length: 20 }).notNull(),
  dataProgramare: timestamp("data_programare").notNull(),
  mesaj: text("mesaj"),
  status: appointmentStatusEnum("status").default('pending').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProgramareSchema = createInsertSchema(programari).omit({
  id: true,
  createdAt: true,
  status: true,
}).extend({
  dataProgramare: z.string().datetime(),
});

export const selectProgramareSchema = createSelectSchema(programari);

export type InsertProgramare = z.infer<typeof insertProgramareSchema>;
export type Programare = typeof programari.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
