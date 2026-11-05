# Harborlight Hotel Management System

A full-stack hotel booking and operations app built with React, Express, and MongoDB Atlas.

## Features
- Room catalogue, date-based availability, and reservation requests.
- Reservation overlap prevention and hotel staff management.
- JWT-protected room and booking administration.
- MongoDB Atlas persistence for rooms and bookings, with local JSON data imported into empty collections on first connection.

## Run locally
Requirements: Node.js 20+ and a MongoDB Atlas database.

1. Copy `server/.env.example` to `server/.env`. Set `MONGODB_URI`, `MONGODB_DATABASE`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Keep `.env` private. In Atlas, allow your current IP and create a database user.
2. From the project folder, install dependencies:
   ```bash
   npm install
   npm --prefix server install
   npm --prefix client install
   ```
3. Start the app with `npm run dev` and open `http://localhost:5173`.
4. The API runs at `http://localhost:5000/api`; `/api/health` reports the MongoDB connection.
5. On first connection, the server imports local rooms and bookings only if the matching Atlas collection is empty. To reset Atlas with sample rooms and clear bookings, run `npm --prefix server run seed`.

## API overview
- `GET /api/health`
- Rooms: `GET /api/rooms`, `GET /api/rooms/:id`, `POST /api/rooms/availability`, admin `POST/PUT/DELETE /api/rooms`
- Bookings: `POST /api/bookings`, admin `GET /api/bookings`, `PATCH /api/bookings/:id/status`, admin `DELETE /api/bookings/:id`
- Admin: `POST /api/auth/login`

## Submission checklist
Fill in the actual team details and URLs in `docs/TEAM_SUBMISSION.md`; capture screenshots from the running app for the presentation.
