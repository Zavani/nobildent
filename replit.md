# Overview

This is a modern dental clinic website built as a full-stack application with a React frontend and Express.js backend. The application features a one-page presentation website for the clinic and a separate admin panel for managing patient appointments. The design emphasizes modern aesthetics with glass morphism effects, parallax scrolling, and smooth animations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript and Vite for development
- **Styling**: Tailwind CSS with a dark theme featuring neon accents (blue/purple color scheme)
- **UI Components**: Comprehensive shadcn/ui component library with Radix UI primitives
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL
- **API Design**: RESTful API endpoints for appointment management
- **Development**: Hot module replacement with Vite integration

## Database Schema
The application uses two main tables:
- **programari**: Stores appointment data including patient information, appointment datetime, selected service, status, and optional messages
- **users**: Admin user authentication system

Key features:
- Appointment status tracking (pending, confirmed, rescheduled, completed, cancelled)
- Service selection for each appointment (Tratamente Generale, Estetica Dentară, Implantologie, etc.)
- UUID primary keys for all entities
- Timestamp tracking for created dates

## Authentication & Authorization
- Simple username/password authentication for admin access
- Session-based authentication (infrastructure present via connect-pg-simple)
- Admin-only access to appointment management features

## UI/UX Design Patterns
- **Glass Morphism**: Transparent cards and modals with blur effects
- **Parallax Scrolling**: Background images with depth sensation
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Modern Animations**: Fade-in effects, hover transitions, and micro-interactions
- **Accessibility**: Screen reader support and keyboard navigation

## Business Logic
- Appointment booking system with 30-minute time slots (9:00-17:00)
- Admin dashboard for appointment management including status updates
- Direct phone dialing functionality from admin panel
- One-click appointment confirmation with visual feedback
- Admin panel appointment booking capability
- Export functionality for appointment data

# External Dependencies

## Core Technologies
- **React 18**: Frontend framework with TypeScript support
- **Express.js**: Backend web framework
- **Vite**: Development server and build tool
- **Node.js**: Runtime environment

## Database & ORM
- **PostgreSQL**: Primary database (via Neon serverless)
- **Drizzle ORM**: Type-safe database operations and migrations
- **@neondatabase/serverless**: Serverless PostgreSQL connection

## UI Framework & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives (@radix-ui/*)
- **Lucide React**: Icon library
- **shadcn/ui**: Pre-built component library

## Form & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation library
- **@hookform/resolvers**: React Hook Form Zod integration

## State Management & Data Fetching
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight routing library

## Development Tools
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production
- **tsx**: TypeScript execution for development
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Fonts & Assets
- **Google Fonts**: Inter font family for modern typography
- **PostCSS**: CSS processing with Autoprefixer