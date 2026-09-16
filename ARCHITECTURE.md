# Architecture

## Repository

```text
fatou-portfolio/
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       ├── types/
│       ├── router.tsx
│       ├── App.tsx
│       ├── index.css
│       └── main.tsx
├── backend/
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── prisma/
│       ├── db.ts
│       ├── app.ts
│       └── server.ts
├── AGENTS.md
├── PROJECT_CONTEXT.md
├── ARCHITECTURE.md
└── DEVELOPMENT_RULES.md
```

## Frontend

Reusable UI belongs in:
`frontend/src/components/`

Pages compose components and handle route-level concerns.

API calls belong in:
`frontend/src/services/`

Reusable client data/state behavior belongs in:
`frontend/src/hooks/`

Domain types belong in:
`frontend/src/types/`

Important types:
- Profile
- Skill
- Experience
- Project
- ProjectSection
- ProjectImage

## Authentication flow

```text
AdminLogin
 ↓
auth.service.login()
 ↓
POST /api/auth/login
 ↓
backend validates credentials
 ↓
session created
 ↓
HTTP-only cookie
 ↓
AuthContext
 ↓
ProtectedRoute
```

## Public projects

```text
/projects
 ↓
getProjects()
 ↓
GET /api/projects
 ↓
ProjectCard
```

```text
/projects/:slug
 ↓
getProjectBySlug(slug)
 ↓
GET /api/projects/slug/:slug
 ↓
ProjectDetail
```

## Admin projects

```text
AdminProjects
 ↓
API
 ↓
AdminProjectEdit
 ↓
create/update
 ↓
backend
 ↓
PostgreSQL
```

Project sections and images must be synchronized without creating duplicates.

When replacing images, obsolete Cloudinary assets should be cleaned up according to the existing backend behavior.

## Upload flow

```text
Admin UI
 ↓
upload service
 ↓
POST /api/uploads/image
 ↓
Express + Multer
 ↓
Cloudinary
 ↓
{ url, publicId }
 ↓
save URL + publicId
```

## Backend

`app.ts`:
- Express setup
- CORS
- JSON parsing
- cookie parsing
- health endpoint
- route registration

`server.ts`:
- starts HTTP server

`routes/`:
- HTTP endpoints

`middleware/`:
- request-level concerns such as authentication

`services/`:
- reusable backend logic

`prisma/`:
- current Prisma contract and migration workflow

Do not replace the current database layer without explicit instruction.

## Deployment

```text
Browser
   │
   ▼
Vercel
React + Vite
   │
   │ HTTPS + credentials
   ▼
Render
Express API
   │
   ├── Neon PostgreSQL
   └── Cloudinary
```

Frontend environment:
`VITE_API_URL`

Backend environment:
- DATABASE_URL
- CLOUDINARY_URL
- FRONTEND_URL
- ADMIN_EMAIL
- ADMIN_PASSWORD
- NODE_ENV
- PORT

Backend secrets must never be bundled into the frontend.
