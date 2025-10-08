# OnTrackr - Time Tracking & Scheduling App

A modern time-tracking and scheduling web application for offices. Employees can clock in/out, track breaks, and view schedules, while admins can manage schedules and monitor attendance.

## Tech Stack

- **Frontend**: Next.js + TypeScript + Tailwind CSS + Shadcn/UI
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Authentication**: JWT-based (email + password)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Configure your PostgreSQL database URL and JWT secret

4. Run database migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

5. Start the development servers:
   ```bash
   npm run dev
   ```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
ontrackr-app/
├── frontend/          # Next.js application
├── backend/           # Express.js API server
├── package.json       # Root package.json with workspace scripts
└── README.md
```

## Development Phases

- ✅ Phase 1: Initialization & Auth
- 🔄 Phase 2: Dashboard & Clock In/Out
- ⏳ Phase 3: Break Tracking
- ⏳ Phase 4: Schedule Management
- ⏳ Phase 5: Admin Dashboard & Reporting
- ⏳ Phase 6: UI Polish & Usability


