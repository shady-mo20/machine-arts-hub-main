## Machine Arts Hub – Technical Overview

This document provides an engineering-focused overview of the Machine Arts Hub codebase, architecture, and security model.

### High-Level Architecture

- **Frontend**
  - React SPA built with Vite and TypeScript.
  - React Router for client-side routing.
  - Tailwind CSS and shadcn-ui for UI primitives and layout.
  - React Query for asynchronous state and caching.
- **Backend**
  - Node.js with Express, running from `server.mjs`.
  - SQLite (via `sqlite3`) as the persistence layer for admin users.
  - HTTP-only cookie-based authentication using signed JWTs.

The public marketing site remains a static SPA that can be served from any static host. The admin API runs as a separate Node.js service and is accessed via `/api/*` routes (proxied in development by Vite).

### Application Structure

- `src/main.tsx` – SPA entry point.
- `src/App.tsx` – Route definitions for public pages and admin dashboard.
- `src/pages/*` – Public pages (home, machines, gallery, etc.).
- `src/components/*` – Shared visual components, layout, and utilities.
- `src/components/ui/*` – shadcn-ui primitives.
- `src/data/machines.ts` – Static machine catalogue used on the public site and read-only admin views.
- `src/i18n/*` – Language context and translation dictionaries (English and Arabic).
- `src/auth/*` – Frontend authentication context and route protection.
- `src/admin/*` – Admin dashboard layout and modules.
- `server.mjs` – Express application, database bootstrap, authentication, and user management API.

### Authentication Flow

1. **Login**
   - The admin login page (`/admin/login`) posts credentials to `POST /api/auth/login`.
   - The backend looks up the user by email in the `users` table, verifies the bcrypt-hashed password, and checks that `status = 'active'`.
   - On success, the server issues a signed JWT containing a minimal subset of user fields (`id`, `email`, `role`, `fullName`) and stores it in an HTTP-only cookie named `admin_token`.
2. **Session handling**
   - The frontend `AuthProvider` calls `GET /api/auth/me` on mount with `credentials: 'include'`.
   - The backend middleware validates the `admin_token` cookie, verifies the JWT, and fetches the latest user record from the database.
   - The user record is returned to the client and stored in the auth context.
3. **Protected routes**
   - The `ProtectedRoute` component reads the current user from the auth context.
   - If no user is present, it redirects to `/admin/login`, preserving the intended destination in `location.state.from`.
   - If roles are specified, access is denied (HTTP 403 from API, redirect in UI) when the user’s `role` is not allowed.
4. **Logout**
   - The admin topbar “Logout” action calls `POST /api/auth/logout`.
   - The backend clears the `admin_token` cookie and the frontend clears the user state.

### User Roles and Permissions

Defined roles:

- **admin**
  - Full dashboard access.
  - Can list, create, update, deactivate, and reset passwords for users.
  - Has access to all admin sections.
- **developer**
  - Limited dashboard access.
  - Can view dashboard home, machines, gallery, inquiries placeholder, and settings.
  - Cannot manage users (user management endpoints are guarded by `admin` role).

Role enforcement happens in two places:

- **Backend** – Middleware `requireRole(["admin"])` protects admin-only endpoints such as `/api/admin/users`.
- **Frontend** – `ProtectedRoute` restricts navigation to certain views (e.g. `/admin/users`) based on `user.role`.

### Password Hashing Approach

- Library: `bcryptjs`.
- Passwords are hashed using `bcrypt.hash(password, 12)` before storage.
- Plain text passwords are never written to the database.
- Password validation uses `bcrypt.compare(candidate, password_hash)`.
- Minimum length validation (8 characters) is enforced in the API for both user creation and password reset.

### Database Schema Overview

SQLite database path is configurable via `ADMIN_DB_PATH` (defaults to `./data/admin.sqlite`).

Current tables:

- `users`
  - `id` – integer primary key, autoincrement.
  - `full_name` – text, required.
  - `email` – text, required, unique.
  - `password_hash` – text, required.
  - `role` – text, one of `admin` / `developer`.
  - `status` – text, typically `active` or `inactive`.
  - `created_at` – ISO 8601 timestamp, text.
  - `updated_at` – ISO 8601 timestamp, text.

Additional tables (e.g. `machines`, `gallery_items`, `inquiries`) can be added alongside this structure without touching the public SPA.

### Backend Route Map and Protection Strategy

All routes are served from `server.mjs`:

- `GET /api/health`
  - Unprotected health check endpoint.
- `POST /api/auth/login`
  - Public endpoint for obtaining a session.
  - Validates `email` and `password`, checks `status`, and sets the `admin_token` cookie.
- `POST /api/auth/logout`
  - Clears the `admin_token` cookie.
- `GET /api/auth/me`
  - Protected by `requireAuth`.
  - Returns the mapped user record for the current session.
- `GET /api/admin/stats`
  - Protected by `requireAuth`.
  - Returns aggregated counts (users and placeholders for other modules).
- `GET /api/admin/users`
  - Protected by `requireAuth` and `requireRole(["admin"])`.
  - Returns a list of admin and developer users.
- `POST /api/admin/users`
  - Protected by `requireAuth` and `requireRole(["admin"])`.
  - Creates a new user with a hashed password.
- `PUT /api/admin/users/:id`
  - Protected by `requireAuth` and `requireRole(["admin"])`.
  - Updates user profile fields and role/status.
- `PATCH /api/admin/users/:id/status`
  - Protected by `requireAuth` and `requireRole(["admin"])`.
  - Activates or deactivates a user.
- `PATCH /api/admin/users/:id/password`
  - Protected by `requireAuth` and `requireRole(["admin"])`.
  - Resets or updates a user’s password with hashing.

Authentication middleware:

- `requireAuth` – validates the JWT in the `admin_token` cookie and attaches `req.user`.
- `requireRole(roles)` – checks `req.user.role` is within the allowed roles, otherwise returns HTTP 403.

### Admin Dashboard Structure

Admin UI components live under `src/admin`:

- `AdminLayout` – Sidebar + topbar shell with responsive layout, branded for the machinery domain.
- `DashboardHome` – Overview metrics (machines, users, inquiries, gallery placeholders).
- `UsersPage` – Full CRUD for users with search, role selection, status toggling, and password reset flow.
- `MachinesPage` – Read-only view of the current machines catalogue (backed by `src/data/machines.ts`).
- `GalleryPage` – Gallery/media overview based on the machine imagery used on the public site.
- `InquiriesPage` – Placeholder module prepared for future persistence of contact form submissions.
- `SettingsPage` – Profile overview and text-based system configuration notes.
- `AdminLoginPage` – Branded login form for admin/developer sessions.

Routing integration:

- `/admin/login` – Public login page.
- `/admin` – Protected layout; accessible to `admin` and `developer`.
- `/admin/users` – Restricted to `admin`.
- `/admin/machines`, `/admin/gallery`, `/admin/inquiries`, `/admin/settings` – Accessible to both roles, with some modules read-only in the current iteration.

### Seeding the First Admin User

The backend supports a simple environment-driven seeding flow:

1. Ensure the `users` table is empty (this is the default for a new database).
2. Set environment variables before starting the server:

   - `INITIAL_ADMIN_EMAIL` – email for the first admin user.
   - `INITIAL_ADMIN_PASSWORD` – strong initial password.
   - `INITIAL_ADMIN_NAME` – optional display name (defaults to `"Initial Admin"`).

3. Start the server:

```sh
INITIAL_ADMIN_EMAIL="admin@example.com" \
INITIAL_ADMIN_PASSWORD="a-very-strong-password" \
INITIAL_ADMIN_NAME="GlassTech Admin" \
JWT_SECRET="replace-with-a-long-random-secret" \
npm run server
```

4. On first boot, if no users exist, the server will insert the initial admin and log a message confirming the seed.
5. After the first admin is created, you can remove the `INITIAL_ADMIN_*` variables from your runtime configuration.

### Environment Variables

- `PORT` – Optional; port for the Express server (defaults to `4000`).
- `JWT_SECRET` – Required in production; long, random string used to sign JWTs.
- `ADMIN_DB_PATH` – Optional; filesystem path for the SQLite database file.
- `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD`, `INITIAL_ADMIN_NAME` – Optional; seeding parameters used only when no users exist.
- `NODE_ENV` – Should be `production` in production environments to enable secure cookies.

### Production and Security Notes

- Always set a strong `JWT_SECRET` in production.
- Run the Node.js process behind HTTPS and ensure secure cookies:
  - Use `NODE_ENV=production` so cookies are marked `secure`.
  - Terminate TLS at a reverse proxy or platform load balancer.
- Ensure the `data` directory (or wherever `ADMIN_DB_PATH` points) is stored on a persistent, access-controlled volume.
- Limit network access to `/api` endpoints to only the trusted frontend origin(s) at the proxy layer where possible.
- Regularly rotate admin passwords and consider adding:
  - Rate limiting or IP-based throttling on `POST /api/auth/login`.
  - Audit logging for sensitive admin actions.
  - Optional MFA or TOTP-based second factor for `admin` accounts.

### Development Workflow

- Run backend:

```sh
JWT_SECRET="dev-secret-change-me" npm run server
```

- Run frontend:

```sh
npm run dev
```

- Access public site: `http://localhost:8080/`
- Access admin login: `http://localhost:8080/admin/login`

The Vite dev server proxies `/api/*` requests to the backend at `http://localhost:4000`.

### Extensibility and Future Backend Growth

The current backend is intentionally minimal and focused on secure admin identity:

- Additional tables (machines, gallery_items, inquiries, activities) can be added by extending the SQLite schema in `server.mjs`.
- New modules should follow the same pattern:
  - Define tables and migration logic in the initialization phase.
  - Expose REST endpoints under `/api/admin/*`.
  - Protect endpoints with `requireAuth` and `requireRole`.
  - Consume endpoints via React Query in an appropriate admin page.

As the project grows, you can:

- Extract the Express app into a dedicated `src/server` directory written in TypeScript.
- Introduce a migration tool (e.g. Knex or Prisma) to manage schema changes.
- Replace SQLite with Postgres or another RDBMS by swapping the data access layer.

