# Fatou Fofana Portfolio — Agent Instructions

## Project

Personal portfolio website of Fatou Fofana, a UI/UX designer.

The project contains:
- a public portfolio
- a private admin dashboard / CMS
- a REST API
- PostgreSQL
- Cloudinary media storage
- cookie/session authentication

The goal is to let the portfolio owner manage editable content without modifying source code.

## Read first

Before significant changes, read:
1. AGENTS.md
2. PROJECT_CONTEXT.md
3. ARCHITECTURE.md
4. DEVELOPMENT_RULES.md

The actual repository code is the final source of truth if documentation differs.

## Stack

Frontend:
- React
- Vite
- TypeScript
- React Router
- Tailwind CSS v4
- Motion

Use Motion as:
```ts
import { motion } from "motion/react";
```

Do not use framer-motion.

Backend:
- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma
- Cloudinary
- Cookie/session authentication

Deployment:
- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL
- Media: Cloudinary

## Rules

- TypeScript everywhere.
- Avoid `any`.
- Prefer explicit types/interfaces.
- Reuse existing components, hooks, services and types.
- Do not duplicate business logic.
- Do not rewrite working architecture without a concrete reason.
- Do not add dependencies unnecessarily.
- Inspect actual files and usages before modifying them.
- Make the smallest coherent change required.
- Verify builds/tests after changes.

## API

Use `VITE_API_URL` on the frontend.

Local:
`http://localhost:3000/api`

Production:
`https://fatou-portfolio-api.onrender.com/api`

Never hardcode API URLs in React components.

Authenticated requests must use:
```ts
credentials: "include"
```

## Authentication

Authentication is cookie/session based.

Do not replace it with localStorage tokens unless explicitly requested.

Protected admin routes must remain protected.

## CMS

The CMS manages:
- profile
- hero
- about
- skills
- experience
- projects
- project sections
- project gallery
- images
- publication
- featured projects

Do not reintroduce hardcoded mock data as the source of truth.

## Images

Images are stored in Cloudinary.

Preserve URL and public ID when available.

Respect existing Cloudinary cleanup behavior.

Never expose Cloudinary secrets in frontend code.

## Projects

Backend project IDs are numeric.

Project slugs are unique strings.

The historical `src/data/projects.ts` mock data is no longer used by the application.

Do not reintroduce it as the content source.

Project updates must not create duplicate sections or gallery images.

## Styling

Public site direction:
- premium
- minimal
- editorial
- modern
- strong typography
- large imagery
- generous spacing
- smooth motion
- dark visual identity

Admin UI can be more functional.

## Routing

Important routes:
- `/`
- `/projects`
- `/projects/:slug`
- `/admin/login`
- `/admin`
- `/admin/profile`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/:id`

The frontend is a SPA deployed on Vercel. Direct client-side routes must work through the Vercel SPA rewrite.

## Security

Never expose:
- DATABASE_URL
- CLOUDINARY_URL
- ADMIN_PASSWORD

to the browser.

Never commit real secrets.

## Verification

Frontend:
```bash
npm run build
```

Backend:
```bash
npm run build
```

Do not claim something works if it was not reasonably verified.
