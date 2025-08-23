import { programari, users, type Programare, type InsertProgramare, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte, lte, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Appointment operations
  createAppointment(appointment: InsertProgramare): Promise<Programare>;
  getAppointments(): Promise<Programare[]>;
  getAppointmentById(id: string): Promise<Programare | undefined>;
  updateAppointmentStatus(id: string, status: 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled'): Promise<Programare | undefined>;
  deleteAppointment(id: string): Promise<boolean>;
  getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Programare[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createAppointment(appointment: InsertProgramare): Promise<Programare> {
    const [programare] = await db
      .insert(programari)
      .values({
        ...appointment,
        dataProgramare: new Date(appointment.dataProgramare),
      })
      .returning();
    return programare;
  }

  async getAppointments(): Promise<Programare[]> {
    const appointments = await db.select().from(programari).orderBy(desc(programari.dataProgramare));
    console.log('Appointments fetched from DB:', appointments);
    return appointments;
  }

  async getAppointmentById(id: string): Promise<Programare | undefined> {
    const [appointment] = await db.select().from(programari).where(eq(programari.id, id));
    return appointment;
  }

  async updateAppointmentStatus(id: string, status: 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled'): Promise<Programare | undefined> {
    const [updated] = await db
      .update(programari)
      .set({ status })
      .where(eq(programari.id, id))
      .returning();
    return updated;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const result = await db.delete(programari).where(eq(programari.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Programare[]> {
    return await db
      .select()
      .from(programari)
      .where(
        and(
          gte(programari.dataProgramare, startDate),
          lte(programari.dataProgramare, endDate)
        )
      )
      .orderBy(desc(programari.dataProgramare));
  }
}

export const storage = new DatabaseStorage();
