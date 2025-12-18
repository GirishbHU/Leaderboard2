# i2u.ai Preview Mode

## Overview

Preview Mode allows you to experience the full i2u.ai platform with simulated payments and mock data. This is designed for testing and demonstration purposes.

## Demo Credentials

- **Email:** admin@example.com
- **Password:** AdminTest123!

This admin account has full access to all features including the Admin dashboard.

## Features in Preview Mode

### What Works
- User authentication (login/logout)
- Dashboard access
- Leaderboard viewing
- Activity tracking
- Wallet and transaction views
- Referral system display
- Admin dashboard (for admin users)

### Simulated Features
- **Payments:** All payments are simulated (mock mode). No real charges are made.
- **Data:** Some data is seeded/mock data for demonstration purposes.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PAYMENTS_MODE` | `mock` | Payment processing mode: `mock`, `sandbox`, or `live` |
| `SESSION_SECRET` | (auto-generated) | Secret for session encryption |

## Payment Modes

1. **mock** (default): All payments succeed instantly with fake transaction IDs
2. **sandbox**: Uses payment provider sandbox environments (future)
3. **live**: Real payment processing (future)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout current session
- `GET /api/auth/me` - Get current user info

### Preview
- `POST /api/preview/checkout` - Simulate payment checkout
- `GET /api/preview/status` - Get current payment mode

### Admin (requires admin role)
- `GET /api/admin/stats` - Get platform statistics

## Security Notes

- Preview mode uses session-based authentication
- Passwords are hashed with bcrypt
- Session data is stored in memory (resets on server restart)
- For production, configure proper session storage (PostgreSQL, Redis)

## Getting Started

1. Start the application: `npm run dev`
2. Navigate to `/login`
3. Enter demo credentials
4. Explore the platform!

## Preview Banner

When logged in with an active preview subscription, you'll see an amber banner at the top of the page indicating you're in Preview Mode.
