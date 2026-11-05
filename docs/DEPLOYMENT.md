# Running and hosting the no-database version

## Local setup
1. Install Node.js 20+.
2. For local use, the sample staff credentials work without a `.env` file. For deployment, copy `server/.env.example` to `server/.env` and set a private JWT secret plus staff login details.
3. Install dependencies from the project root: `npm install`, `npm --prefix server install`, and `npm --prefix client install`.
4. Run `npm run dev`; the Vite site runs on port 5173 and Express on port 5000.

## Data storage
The backend writes to `server/data/rooms.json` and `server/data/bookings.json`. Keep these files in place to preserve reservations. To reload sample rooms and clear all bookings, run `npm --prefix server run seed`.

## Deployment
Deploy `server` as a Node service and `client` as a static Vite site. Configure `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_ORIGIN` for the API and `VITE_API_URL` for the frontend (ending in `/api`). Use a host with persistent disk storage mounted for the server's `data` directory; on an ephemeral filesystem, edits and bookings may be lost when the service restarts or redeploys. This version intentionally does not use MongoDB, Atlas, or a database service.

## Check after deployment
Open `/api/health`, verify it reports `status: ok` and `storage: local-json-files`, then try room search, a booking, staff sign-in, status changes, and room create/edit/delete. Ensure frontend and API URLs are public and the frontend origin matches `CLIENT_ORIGIN`.

