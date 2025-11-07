# UTS-PAWM — Virtual Lab (Frontend + Simple Backend)

This repository contains a static frontend (HTML/CSS/JS) and a small Node.js backend which serves product data from a SQLite database.

Overview
- Frontend: static files in project root (index.html, product.html, scripts/, styles.css). Can be hosted on Netlify, GitHub Pages, or any static host.
- Backend: minimal Express server in `backend/` which reads products from `backend/db/products.db` (SQLite) and exposes `/api/products` and `/api/products/:id`.

Quickstart (local)
1. Install Node (>=14) and npm.
2. In a terminal, install backend deps:

```powershell
cd "c:\Users\faras\OneDrive\ITB\SEM 5\PAWM\UTS\UTS-PAWM\backend"
npm install
```

3. Initialize the SQLite database (creates `backend/db/products.db`):

```powershell
npm run init-db
```

4. Start the backend API:

```powershell
npm start
```

The API will listen on http://localhost:3000 by default. The frontend is already configured (in `index.html`) to use `window.API_BASE = 'http://localhost:3000'` for local development. When you deploy frontend separately, change `window.API_BASE` to your backend URL.

What I added
- `backend/server.js` — Express API with endpoints `/api/products` and `/api/products/:id`.
- `backend/package.json` — backend dependencies and scripts.
- `backend/db/init_db.js` — script to create an SQLite DB and seed sample products from `backend/db/seed.json`.
- `backend/db/seed.json` — sample product data.
- Frontend changes: `index.html` sets `window.API_BASE` by default; `scripts/main.js` and `scripts/product.js` will fetch data from the API when `API_BASE` is set, otherwise fall back to the mock file `scripts/products.mock.js`.

Hosting recommendations
- Frontend: Netlify / GitHub Pages / Vercel (static). Deploy the repo `index.html` and `scripts/` as static site. Ensure `window.API_BASE` in `index.html` points to the deployed backend.
- Backend: VM or serverless options
  - VM: Host Node server (Express) on a VM (DigitalOcean, Azure VM, AWS EC2) and open port 3000 (or use reverse proxy). Upload `backend/db/products.db` or run `npm run init-db` on the server.
  - Serverless: For true serverless, port SQLite file is not ideal — use a managed DB (Cloud SQL, Cosmos DB, DynamoDB) and adapt `server.js` accordingly. Alternatively, use a container (Cloud Run) with the SQLite DB file built into the image.

 Security & CORS
 - The backend enables CORS to allow separate hosting of frontend and backend. In production, restrict CORS to your frontend origin.

 Authentication & user state (recommended approaches)
 - Demo approach included: simple token-based auth stored in `users` table. Good for local demos but NOT production-ready.
 - Production-ready options:
   - Firebase Authentication + Firestore/Realtime Database:
     - Use Firebase Auth on frontend (sign-in with email/password, Google, etc.) to obtain an ID token.
     - Backend verifies ID tokens using the Firebase Admin SDK and maps users to server-side records.
     - Use Firestore (or Cloud SQL) to store per-user cart and preferences.
   - OAuth2 / OpenID Connect (Auth0, Google, Azure AD):
     - Frontend obtains an access token and/or ID token via OAuth flows.
     - Backend verifies tokens and uses the user identity to persist state in a DB.
   - Custom email/password with sessions: implement secure password hashing (bcrypt), session management or JWTs, and store user data in managed DB.

 Database choices for storing user state:
 - SQLite (demo): easy for development, single-file DB included with the app. Not suitable for multi-instance serverless.
 - Managed SQL (Cloud SQL, Amazon RDS): robust for relational data and multi-instance apps.
 - NoSQL (Firestore, DynamoDB): good for serverless scaling and flexible schemas.

 Hosting guidance
 - Frontend: host as static site (Netlify, GitHub Pages, Vercel). Configure `window.API_BASE` to point to backend domain.
 - Backend (recommended patterns):
   - Small app / VM: Deploy Node app on VM (DigitalOcean droplet, AWS EC2, Azure VM) with the SQLite DB file persisted to disk.
   - Container: Dockerize backend and deploy to Cloud Run / Azure Container Instances / Render (easier to replicate DB as included file or mount volume).
   - Serverless (Cloud Function / AWS Lambda): avoid SQLite file; instead use managed DB (Firestore, Cloud SQL, DynamoDB). Move DB init/seed to cloud DB.

 Implementation process (how I implemented the Virtual Lab)
 1. Frontend
    - Built with HTML5, CSS3, and vanilla JavaScript.
    - Product grid and product detail pages are rendered client-side from an in-memory dataset (`scripts/products.mock.js`) for fast iteration.
    - Implemented Virtual Lab features (image zoom, pan, rotate, UV filter, flashlight) using DOM APIs and CSS transforms.
    - Implemented drag-and-drop using native Drag & Drop APIs and added robust fallbacks for browsers with limited DataTransfer support.
    - Implemented cart UI and localStorage-backed cart helpers (`scripts/utils.js`) to maintain a single source of truth on the client.

 2. Backend
    - Implemented a minimal Express server (`backend/server.js`) to serve product data from SQLite.
    - Added a DB init script (`backend/db/init_db.js`) to create tables for `products`, `users`, and `carts` and seed product data.
    - Implemented simple token-based authentication endpoints and per-user cart persistence endpoints. These demonstrate how client state can be moved server-side.

 3. Integration
    - Frontend uses `window.API_BASE` as the API root. On load, the frontend attempts to fetch `/api/products` from the backend; if the backend is unreachable, it falls back to the mock data.
    - Product detail page attempts to fetch product details from backend if `API_BASE` defined; otherwise falls back to client mock.

 4. Testing & verification
    - Local testing: start backend (`npm run init-db`, `npm start`) and serve frontend with a static server (e.g. Python http.server). Verify endpoints with curl or browser.
    - Cross-tab sync and localStorage normalization implemented for cart UI.

### Supabase integration (optional)
If you prefer using Supabase (Postgres + auth + storage), here's how to connect the project to Supabase and make the backend use it for products.

1) Create a Supabase project
  - Sign in to https://app.supabase.com and create a new project.
  - In the project dashboard, open the SQL editor and run the SQL in `backend/db/supabase_migration.sql` to create the `products` table and seed sample rows.

2) Get API keys
  - In the Supabase dashboard, open Settings → API and copy the Project URL (SUPABASE_URL) and the anon/public API key (SUPABASE_KEY).

3) Configure backend to use Supabase
  - On the server where you run the backend, set environment variables:

```powershell
setx SUPABASE_URL "https://your-project.supabase.co"
setx SUPABASE_KEY "your-anon-key"
```

  - Or on Linux/macOS:

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_KEY="your-anon-key"
```

  - Restart the backend (`npm start`). The server will detect the env vars and use Supabase for product queries. The backend still uses SQLite for simple demo auth/cart, but you can extend it to use Supabase tables for users and carts.

4) Frontend options
  - Direct client-side: you can call Supabase directly from the frontend using `@supabase/supabase-js`. Keep in mind exposing anon key is acceptable for read-only public data, but for writes or user-specific data prefer server-side proxy or proper RLS policies.

Example frontend snippet (build-time env for Netlify/Vercel or embed URL/key carefully):

```html
<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
  const supabase = createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
  const { data } = await supabase.from('products').select('*');
  window.allProducts = data;
  // then call renderProducts();
</script>
```

Or keep frontend unchanged and let the backend proxy product requests to Supabase (safer for keys and to centralize logic).
 Notes on production hardening
 - Replace demo token auth with Firebase Auth or OAuth for secure identity management.
 - Move DB to managed service for production and scale.
 - Add input validation, rate limiting, HTTPS, helmet, and environment-based CORS restrictions.

Next steps (optional)
- Add endpoints to mutate cart and persist server-side.
- Replace SQLite with managed DB for serverless deployments.
- Add authentication for user carts and orders.
