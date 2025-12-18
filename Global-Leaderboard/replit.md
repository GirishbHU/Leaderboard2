# i2u.ai Global Leaderboard & Registration System

## Overview

This is a full-stack web application for a global startup ecosystem leaderboard and registration system. The platform enables startups, investors, and ecosystem participants to register, get ranked on a global leaderboard, track activities, manage referrals, and handle wallet/earnings. The application serves the i2u.ai platform with the tagline "Ideas to Unicorns through AI."

Key features include:
- Multi-step user registration with role selection and payment integration
- **8 Stakeholder Types**: Startups, Mentors, Enablers, Influencers, Facilitators, Investors, Job Seekers, Professionals
- **Dynamic Tiered Pricing**: Registration fees scale based on signup count (6 price brackets per category)
  - Ecosystem partners (Startups, Mentors, etc.): ₹999-₹9,999 / $14.99-$149.99
  - Professionals (Job Seekers): ₹99-₹999 / $1.49-$14.99
- **Pending Payment Workflow**: Users can register without immediate payment, with manual verification
- **Payment-Gated Referral Bonuses**: Referral bonuses only activate after payment completion
- **Payment Glitch Flagging System**: 
  - Users can flag payment issues and earn bonus credits for delays
  - 20% bonus for flagging an issue
  - +20% bonus for each additional 24 hours of delay from our side
  - **Genuine Payment Efforts Bonus**: Starts at 30%, reduces by 5% every 24 hours (incentivizes quick payment)
- **Multiple Payment Options**: PayPal (USD), Cashfree (INR), UPI, Bank Transfer
- **Payment Methods**: PayPal (USD), Cashfree (INR), Manual UPI/Bank transfer with transaction ID tracking
- Global leaderboard with filtering by country and sector
- Activity time tracking system
- Referral Bonus program (20%) with dual-currency earnings (INR/USD)
- **Suggestions & Ideas System**:
  - Users can submit opinions, ideas, and suggestions
  - Community voting on suggestions
  - Best Suggestion recognition: Hour, Day, Week, Month, Quarter, Half Year, Year
  - Rewards credited to wallet for top suggestions
  - Admin management of suggestion status and awards
- **Interactive Referral Calculator**: Popup with custom input fields for modeling earnings across all price tiers
- Wallet management for referral earnings
- Admin dashboard for system oversight and pending payment verification
- **Interactive Value Calculator** with glassmorphism design
- 6 Subscription tiers (Free, ₹16K-₹1L / $240-$1,500)
- Contest offer (60+ days, Assessment $99 FREE for first 1K or until 25th Dec 2025)
- Comprehensive footer with organized navigation links

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
- **Structure**: Single server entry point with route registration pattern

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (Replit's native PostgreSQL integration via DATABASE_URL)
- **Schema Location**: `shared/schema.ts` - shared between frontend and backend
- **Migrations**: Drizzle Kit for database migrations (`drizzle-kit push`)

### Key Design Decisions

1. **Monorepo Structure**: Client code in `client/`, server in `server/`, shared types in `shared/`
   - Enables type sharing between frontend and backend
   - Single deployment unit simplifies hosting

2. **Schema-First Approach**: Database schema defined with Drizzle, then Zod schemas generated via drizzle-zod for validation
   - Single source of truth for data types
   - Automatic type inference across the stack

3. **Dual Currency Support**: System handles both INR and USD for international users
   - Separate wallet balances per currency
   - Payment integration designed for Stripe (USD) and Cashfree (INR)

4. **Privacy Controls**: Users can control how their data appears on leaderboards
   - Display preferences: real_name, username, anonymous, fancy_username
   - Activity privacy: private, anonymous_aggregate, public_leaderboard

5. **Theme System**: Light/dark mode with CSS variables
   - Primary teal color (#218089) for brand consistency
   - System-level theme switching via root class

6. **Subscription Status & Access Control**
   - Active statuses (full access): `active`, `active_preview`, `active_sandbox`, `pending_payment`
   - Restricted statuses (blocked): `inactive`, null
   - `requireActiveSubscription` middleware uses whitelist approach
   - Users can register with `pending_payment` status when payment fails - full access granted
   - Dashboard shows payment pending banner as a reminder to complete payment

7. **Blog Auto-Seeding**
   - 224 articles from Girish Hukkeri's LinkedIn Newsletter automatically seeded on startup
   - Seeding only runs when blog table is empty (preserves existing data)
   - Each article has unique leader image from `/article-images/image{N}.{ext}`

8. **Visual Design System**: Category-based visual elements for blog and content
   - Category images at `/client/public/blog-images/` (ai.png, technology.png, leadership.png, business-strategy.png)
   - **Article images at `/client/public/article-images/`** (224 images extracted from LinkedIn Word document)
     - Each article has its own unique leader image (article-0.jpeg through article-223.png)
     - Images extracted using mammoth library from the LinkedIn newsletter export
     - Database `blogArticles.imageUrl` stores path to each article's image
   - Reusable components: `CategorySection`, `CategoryBackdrop`, `CategoryHeader`, `RotatingExcerpt`, `RotatingExcerptGrid`, `CompositeBackground`
   - Rotating excerpts: `useRotatingExcerpts` hook + `RotatingExcerpt` component with circular leader avatar display
   - **Global Composite Background**: 4 category images (AI, Technology, Leadership, Business Strategy) in 2x2 grid
     - Located in `Layout` component for site-wide visibility on all pages including account pages
     - 12% opacity (88% transparency)
     - Tripled size (300% width/height with -100% positioning for coverage)
     - Fixed position with `-z-10` z-index to stay behind all content
   - Category backdrops: 10% opacity (90% transparency)
   - 20vh max-height constraint on backdrop layers (decorative elements only)
   - Database: `imageUrl` field in `blogArticles` table stores article-specific leader images

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connected via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage in PostgreSQL

### Payment Processing (Planned)
- **Stripe**: USD payment processing (test mode integration ready)
- **Cashfree**: INR payment processing for Indian users (test mode integration ready)

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **framer-motion**: Animation library
- **react-hook-form + zod**: Form handling with validation
- **date-fns**: Date manipulation
- **lucide-react**: Icon library

### Build & Development
- **Vite**: Development server and production bundler
- **esbuild**: Server-side bundling for production
- **tsx**: TypeScript execution for development

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling
- Custom meta images plugin for OpenGraph/Twitter cards with Replit deployment URLs