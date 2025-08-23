import type { Express } from "express";
import { createServer, type Server } from "http";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { insertProgramareSchema } from "@shared/schema";
import { z } from "zod";
import xlsx from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

const adminLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Appointment routes
  app.post('/api/appointments', async (req, res) => {
    try {
      const validatedData = insertProgramareSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.json(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Validation error', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create appointment' });
      }
    }
  });

  app.get('/api/appointments', async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Failed to fetch appointments' });
    }
  });

  app.patch('/api/appointments/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['pending', 'confirmed', 'rescheduled', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const updated = await storage.updateAppointmentStatus(id, status);
      if (!updated) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ message: 'Failed to update appointment' });
    }
  });

  app.delete('/api/appointments/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAppointment(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ message: 'Failed to delete appointment' });
    }
  });

  // Admin authentication
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);
      
      // Simple hardcoded authentication as per requirements
      if (username === 'Razvan' && password === '1234') {
        const token = jwt.sign({ username }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid request data' });
    }
  });

  app.post('/api/admin/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logout successful' });
  });

  app.get('/api/admin/verify', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      res.json({ success: true, message: 'Authenticated' });
    } catch (error) {
      res.status(401).json({ success: false, message: 'Invalid token' });
    }
  });

  // Dashboard statistics
  app.get('/api/admin/stats', async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const [todayAppointments, weekAppointments, monthAppointments] = await Promise.all([
        storage.getAppointmentsByDateRange(today, tomorrow),
        storage.getAppointmentsByDateRange(startOfWeek, endOfWeek),
        storage.getAppointmentsByDateRange(startOfMonth, endOfMonth),
      ]);

      res.json({
        today: todayAppointments.length,
        week: weekAppointments.length,
        month: monthAppointments.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Failed to fetch statistics' });
    }
  });

  // Export route for fetching data
  app.get('/api/export', async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      let appointments = await storage.getAppointments();

      if (startDate && endDate) {
        const start = new Date(startDate as string);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        appointments = appointments.filter(apt => {
          const aptDate = new Date(apt.dataProgramare);
          return aptDate >= start && aptDate <= end;
        });
      }
      
      res.json(appointments);
    } catch (error) {
      console.error('Error exporting data:', error);
      res.status(500).json({ message: 'Failed to export data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
