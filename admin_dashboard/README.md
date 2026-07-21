# Royal Transportation System — Admin Dashboard

An admin-only web dashboard for managing the Royal Transportation School Bus
system: users, drivers, students, routes, and push notifications.

## Tech Stack

- React 18 + Vite 5 + TypeScript
- React Router v6
- Firebase Auth (email/password login)
- Axios (API client)
- TanStack Query (data fetching/caching)
- React Hook Form (forms + validation)
- Recharts (dashboard charts)
- Tailwind CSS (styling)
- Vitest + Testing Library (unit tests)

## Getting Started

```bash
npm install
cp .env.example .env   # then fill in your Firebase project credentials
npm run dev
```

The app expects the Royal Transportation backend API to be running at
`http://localhost:3000/api/v1` (configurable via `VITE_API_BASE_URL`).

## Scripts

| Command            | Description                              |
| ------------------- | ----------------------------------------- |
| `npm run dev`        | Start the Vite dev server                 |
| `npm run build`       | Type-check and build for production       |
| `npm run preview`     | Preview the production build locally      |
| `npm run lint`        | Lint the `src` directory with ESLint      |
| `npm test`            | Run the unit test suite with Vitest       |
| `npm run test:ui`      | Run Vitest with the interactive UI        |

## Authentication

Admins sign in with Firebase Auth email/password. After sign-in, the app
fetches the user's profile from the backend (`GET /users/:uid`) and verifies
`role === 'admin'`. Non-admin accounts see an "Access Denied" screen instead
of the dashboard.

## Project Structure

See `src/` for components, pages, services, hooks, contexts, types, and
utilities. Every API call goes through the shared Axios instance in
`src/services/api.ts`, which attaches the current Firebase ID token to every
request and redirects to `/login` on a 401 response.

## Docker

A multi-stage `Dockerfile` is included that builds the app and serves the
static output with nginx (with SPA fallback routing configured).

```bash
docker build -t royal-transportation-admin .
docker run -p 8080:80 royal-transportation-admin
```
