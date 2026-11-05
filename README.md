# Harborlight Hotel Management System

A full-stack hotel booking and operations app built with React, Express, and MongoDB.

## Features
- Room catalogue, date-based availability, and reservation requests.
- Reservation overlap prevention and hotel staff management.
- JWT-protected room and booking administration.
- MongoDB persistence through Mongoose.

## Run locally
Requirements: Node.js 20+ and a local MongoDB server or MongoDB Atlas database.

1. Copy `server/.env.example` to `server/.env`. Set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Keep `.env` private.
2. From the project folder, install dependencies:
   ```bash
   npm install
   npm --prefix server install
   npm --prefix client install
   ```
3. Start the app with `npm run dev` and open `http://localhost:5173`.
4. The API runs at `http://localhost:5000/api`; `/api/health` reports MongoDB connection status.
5. On first connection to an empty database, the server adds the four sample rooms. To reset the sample rooms and clear all bookings, run `npm --prefix server run seed`.

## API overview
- `GET /api/health`
- Rooms: `GET /api/rooms`, `GET /api/rooms/:id`, `POST /api/rooms/availability`, admin `POST/PUT/DELETE /api/rooms`
- Bookings: `POST /api/bookings`, admin `GET /api/bookings`, `PATCH /api/bookings/:id/status`, admin `DELETE /api/bookings/:id`
- Admin: `POST /api/auth/login`

## Submission checklist
Fill in the actual team details and URLs in `docs/TEAM_SUBMISSION.md`; capture screenshots from the running app for the presentation.
