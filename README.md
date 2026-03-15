## Machine Arts Hub – Glass Machinery Platform

Machine Arts Hub is a modern, bilingual marketing site and admin platform for premium industrial glass machinery.  
It showcases machines, applications, and reference projects, and includes a secure, role-based admin dashboard for managing content and internal operations.

### Public Website Overview

- **Home**: Hero section, value proposition, featured machines, and calls to action.
- **Machines**: Structured listing of glass machinery with rich cards and detail pages.
- **How It Works**: Process-focused content explaining technology and workflows.
- **Applications**: Use-cases and industries that benefit from the machinery.
- **Gallery**: Visual showcase of projects and machinery in action.
- **About**: Company story, positioning, and credibility content.
- **Contact**: Inquiry form and key contact details for sales and support.

The public site uses a dark, industrial visual language to match high-end glass equipment branding and is fully responsive.

### Admin System Overview

- **Secure authentication** with hashed passwords (no plain text storage).
- **Role-based access control** for `admin` and `developer` users.
- **Admin dashboard** with overview metrics and navigation.
- **User management** for creating, editing, deactivating, and updating admin users.
- **Extensible modules** prepared for machines, gallery/media, inquiries, and system settings.

The admin area is intentionally separated from public pages to avoid any accidental impact on the marketing site.

### Tech Stack

- **Frontend**: React, React Router, TypeScript, Vite.
- **UI**: Tailwind CSS, shadcn-ui components, Lucide icons.
- **State/Data**: React Query for async data and caching.
- **Backend**: Node.js with Express and SQLite (via `sqlite3`) for admin-only data.

### Folder Overview

- `src/pages`: Public-facing pages (home, machines, gallery, etc.).
- `src/components`: Shared layout, navigation, and UI utilities for the public site.
- `src/components/ui`: shadcn-ui primitive components.
- `src/data`: Static machine data used on the public site.
- `src/i18n`: Language context and translations.
- `src/admin` (added): Admin dashboard layout and pages.
- `src/auth` (added): Frontend authentication context and helpers.
- `server.mjs` (added): Express + SQLite backend for admin users and auth.

### Running the Project Locally

**Prerequisites**

- Node.js 18+ and npm.

**Install dependencies**

```sh
npm install
```

**Start the backend API (auth + admin data)**

```sh
# In one terminal
JWT_SECRET="replace-with-a-long-random-secret" npm run server
```

This starts the Express server on port `4000` by default.

**Start the frontend**

```sh
# In another terminal
npm run dev
```

Vite will serve the frontend on port `8080` and proxy `/api` requests to the backend.

### Environment Setup Summary

The backend reads configuration from environment variables:

- `JWT_SECRET` – required; long random string used to sign auth tokens.
- `ADMIN_DB_PATH` – optional; path to the SQLite file (defaults to `./data/admin.sqlite`).
- `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD`, `INITIAL_ADMIN_NAME` – optional; used once to seed the first admin user if the database is empty.

See the technical README for detailed configuration and security notes.

### Authentication Overview

- Admin users authenticate via email and password.
- Passwords are hashed with a modern password hashing algorithm before storage.
- A signed token is issued on successful login and stored in an HTTP-only cookie.
- Protected admin routes verify the token on each request.
- Admin users can manage other users; developer users have limited access.

### Build and Run Commands

- `npm run dev` – start the Vite dev server.
- `npm run build` – build the production frontend bundle.
- `npm run preview` – preview the built frontend.
- `npm run lint` – run ESLint.
- `npm run test` / `npm run test:watch` – run frontend tests.
- `npm run server` – start the Express admin backend.

### Deployment Notes

- Frontend can be built (`npm run build`) and served by any static host or a Node.js server.
- Backend should be deployed as a Node.js service with:
  - A persistent volume for the SQLite database file.
  - Environment variables configured for `JWT_SECRET` and optional DB path.
  - HTTPS termination and secure cookie settings in production.
- In production, route `/api/*` traffic from your reverse proxy (e.g. Nginx, cloud load balancer) to the Node.js backend.

### Future Improvements

- Fully editable machines and gallery modules backed by the database.
- Persisted inquiries submitted from the public contact form.
- Activity log for admin actions.
- Multi-factor authentication for privileged users.
- Fine-grained permissions beyond the `admin` / `developer` roles.

For a deeper technical overview, including schema details and route protection, see `README_TECHNICAL.md`.
