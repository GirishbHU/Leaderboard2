# i2u.ai Global Leaderboard & Registration System

## Overview

This is a full-stack web application for a global startup ecosystem leaderboard and registration system. The platform enables startups, investors, and ecosystem participants to register, get ranked on a global leaderboard, and connect with each other.

Key features include:
- Multi-step user registration with role selection and payment integration
- Global leaderboard with filtering by country and sector
- Activity time tracking system
- Referral program with dual-currency earnings (INR/USD)
- Wallet management for referral earnings
- Admin dashboard for system oversight
- Preview mode for simulated payments and testing
- Blog/content management system (224 LinkedIn Newsletter articles)
- Suggestions & Ideas system with reactions, comments, voting, and rewards

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with custom plugins for meta images and Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript compiled with tsx
- **API Pattern**: REST API with JSON responses
- **Session Management**: express-session with MemoryStore (configurable for production)
- **Authentication**: Custom session-based auth with bcrypt password hashing
- **Structure**: Single server entry point with route registration pattern

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (connected via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` - shared between frontend and backend
- **Migrations**: Drizzle Kit for database migrations (`drizzle-kit push`)

### Key Design Decisions

1. **Monorepo Structure**: Client code in `client/`, server in `server/`, shared types in `shared/`
   - Enables type sharing between frontend and backend
   - Single deployment unit simplifies hosting

2. **Schema-First Approach**: Database schema defined with Drizzle, then Zod schemas generated via drizzle-zod for validation
   - Single source of truth for data types
   - Automatic type inference across the stack

3. **Payment Modes**: Configurable payment processing via PAYMENTS_MODE environment variable
   - `mock`: Simulated payments for testing/preview (default)
   - `sandbox`: Payment provider sandbox environments
   - `live`: Real payment processing

4. **Role-Based Access Control**: Three middleware functions for route protection
   - `requireAuth`: Basic authentication check
   - `requireAdmin`: Admin-only routes
   - `requireActiveSubscription`: Subscription-gated features

5. **Dual Currency Support**: Platform supports both INR and USD
   - Separate wallet balances for each currency
   - Different payment providers per currency (Cashfree for INR, PayPal for USD)

## External Dependencies

### Payment Providers
- **Cashfree** (`cashfree-pg`): Indian payment gateway for INR transactions
  - Environment variables: `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`
  - Supports sandbox and production modes

- **PayPal** (`@paypal/paypal-server-sdk`): International payments for USD
  - Environment variables: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
  - Supports sandbox and production modes

### Database
- **PostgreSQL**: Primary database via `pg` driver
  - Connection string: `DATABASE_URL` environment variable
  - Uses Drizzle ORM for queries and schema management

### Session Storage
- **MemoryStore** (`memorystore`): In-memory session storage for development
  - For production, can be swapped to `connect-pg-simple` for PostgreSQL-backed sessions

### Environment Variables Required
| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Session encryption key | Recommended |
| `PAYMENTS_MODE` | Payment mode (mock/sandbox/live) | No (defaults to mock) |
| `CASHFREE_APP_ID` | Cashfree API credentials | For INR payments |
| `CASHFREE_SECRET_KEY` | Cashfree API credentials | For INR payments |
| `PAYPAL_CLIENT_ID` | PayPal API credentials | For USD payments |
| `PAYPAL_CLIENT_SECRET` | PayPal API credentials | For USD payments |