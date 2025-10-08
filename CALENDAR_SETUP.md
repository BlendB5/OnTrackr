# OnTrackr Calendar Module Setup

This document provides setup instructions for the new calendar module in OnTrackr, which includes events, tasks, and reminders functionality.

## Features Added

### 🗓️ Calendar Views
- **Month View**: Full month calendar with event indicators
- **Week View**: 7-day week view with detailed event/task display
- **Day View**: Single day view with event and task panels

### 📅 Events Management
- Create, read, update, delete events
- Event descriptions and date/time scheduling
- Visual indicators on calendar views

### ✅ Task Management
- Create tasks with due dates
- Mark tasks as pending/done
- Optional reminder scheduling
- Task status indicators

### 🔔 Reminder System
- Browser notifications for upcoming reminders
- Visual notification panel
- Reminder scheduling for events and tasks

## Database Setup

### Prisma Models Added
- `Event`: Calendar events with title, description, date, and user relation
- `Task`: Tasks with title, status, due date, reminder, and user relation  
- `Reminder`: Reminders linked to events or tasks with notification timing

### Migration
The database migration has been applied with:
```bash
npx prisma migrate dev --name add_calendar_models
```

## Backend API Routes

### Events API (`/api/events`)
- `GET /` - Get all user events
- `GET /range?startDate&endDate` - Get events by date range
- `POST /` - Create new event
- `PUT /:id` - Update event
- `DELETE /:id` - Delete event

### Tasks API (`/api/tasks`)
- `GET /?status&dueDate` - Get tasks with optional filters
- `POST /` - Create new task
- `PUT /:id` - Update task
- `PATCH /:id/toggle` - Toggle task status
- `DELETE /:id` - Delete task

### Reminders API (`/api/reminders`)
- `GET /?upcoming` - Get all or upcoming reminders
- `GET /upcoming` - Get upcoming reminders (next 24 hours)
- `POST /` - Create reminder
- `PUT /:id` - Update reminder
- `DELETE /:id` - Delete reminder

## Frontend Components

### Calendar Page (`/app/calendar`)
- Full-featured calendar with month/week/day views
- Event and task creation forms
- Interactive calendar navigation
- Real-time data loading

### Reminder Notifications
- Browser notification system
- Visual notification panel
- Automatic reminder checking

### API Services (`/services/calendarApi.ts`)
- TypeScript interfaces for all data types
- Complete API client functions
- Error handling and authentication

## Setup Instructions

### 1. Database Configuration
Ensure your PostgreSQL database is running and the connection string in `backend/.env` is correct:
```
DATABASE_URL="postgresql://postgres:Admin1@localhost:5433/ontrackr?schema=public"
```

### 2. Backend Dependencies
The following packages have been installed:
- `express-validator` - Input validation
- `@types/express-validator` - TypeScript types

### 3. Frontend Dependencies
No additional frontend dependencies required - uses existing UI components.

### 4. Browser Notifications
The reminder system uses browser notifications. Users will be prompted to allow notifications when first accessing the calendar.

## Usage

### Creating Events
1. Navigate to Calendar page
2. Click "Add Event" button
3. Fill in title, description, and date/time
4. Event appears on calendar views

### Managing Tasks
1. Click "Add Task" button
2. Enter task title and due date
3. Optionally set reminder time
4. Tasks appear on calendar and can be toggled complete

### Setting Reminders
- Reminders can be set when creating tasks
- Browser notifications appear at scheduled times
- Visual notification panel shows upcoming reminders

## Optional: FullCalendar Integration

For more advanced calendar features, you can install FullCalendar:

```bash
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```

This would provide:
- Drag-and-drop event creation
- More calendar view options
- Advanced event editing
- Better mobile responsiveness

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running on correct port (5433)
- Check database credentials in `backend/.env`
- Ensure `ontrackr` database exists

### API Errors
- Check backend server is running on port 5000
- Verify authentication tokens are valid
- Check browser console for detailed error messages

### Notification Issues
- Ensure browser notifications are enabled
- Check if user has granted notification permission
- Verify reminder times are in the future

## Next Steps

The calendar module is now fully functional with:
- ✅ Database schema and migrations
- ✅ Backend API routes with validation
- ✅ Frontend calendar interface
- ✅ Task management system
- ✅ Reminder notifications
- ✅ Responsive design

The system is ready for production use and can be extended with additional features as needed.


