# Running and hosting the hotel management system

## Local setup
1. Install Node.js 20+ and create a MongoDB Atlas cluster and database user.
2. In Atlas Network Access, allow your current IP address.
3. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`, `MONGODB_DATABASE`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Use the Atlas Drivers connection string and URL-encode special characters in the database user's password.
4. Install dependencies from the project root: `npm install`, `npm --prefix server install`, and `npm --prefix client install`.
5. Run `npm run dev`; the Vite site runs on port 5173 and Express on port 5000.

## Data storage
Room inventory and reservations are stored in MongoDB Atlas. On first connection, local data in `server/data/rooms.json` and `server/data/bookings.json` is imported only if the corresponding Atlas collection is empty. The seed command resets Atlas to the sample rooms and clears all bookings: `npm --prefix server run seed`.

## Deployment
On Render, create two services:

- **Frontend (Static Site):** use the repository root as the Root Directory, `npm install && npm run build` as the Build Command, and `client/dist` as the Publish Directory. Set `VITE_API_URL` to the backend's public URL ending in `/api`.
- **Backend (Web Service):** set Root Directory to `server`, Build Command to `npm install`, and Start Command to `npm start`. Set `MONGODB_URI`, `MONGODB_DATABASE`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CLIENT_ORIGIN` in Render's environment settings. `CLIENT_ORIGIN` should be the frontend's public URL.

Keep credentials in the host's environment settings, never in source control. Allow the API host's outbound IP address in Atlas Network Access.

## Check after deployment
Open `/api/health` and verify it reports `status: ok`, `storage: mongodb`, and `database: connected`. Then try room search, a booking, staff sign-in, status changes, and room create/edit/delete.
