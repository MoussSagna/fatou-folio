# Project Context

## Product

Professional portfolio website of Fatou Fofana, a UI/UX designer.

Public sections:
- Hero
- Selected Work
- About
- Skills
- Experience
- Contact
- Footer

A private CMS manages editable content.

## Main objective

The portfolio owner should be able to update the website without editing source code.

Intended data flow:

```text
CMS
 ↓
API
 ↓
React frontend
```

## Editable profile

Profile:
- name
- title
- biography
- profile image
- location
- contact email
- Instagram
- LinkedIn
- Behance
- Dribbble
- CV URL

Hero:
- availability text
- CTA text

About:
- section label
- secondary text
- CTA

Skills:
- number
- title
- description
- order

Experience:
- period
- company
- role
- location
- description
- order

Contact:
- section label
- heading
- availability text
- CTA

Footer:
- availability text
- social/contact information

## Projects

A project contains:
- title
- slug
- description
- client
- role
- year
- category
- cover image
- cover public ID
- tools
- deliverables
- published
- featured
- order
- sections
- gallery images

Project sections:
- number
- title
- content
- order

Project gallery images:
- URL
- Cloudinary public ID
- alt text
- order

## Admin

Current admin areas:
- `/admin`
- `/admin/profile`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/:id`

Admin should allow:
- editing profile content
- managing skills
- managing experience
- creating projects
- editing projects
- deleting projects
- managing sections
- managing gallery images
- uploading images
- replacing images
- deleting images
- publishing/unpublishing projects
- marking projects as featured

## API

Main endpoints:

```text
/api/health

/api/auth/login
/api/auth/logout
/api/auth/me

/api/profile

/api/projects
/api/projects/:id
/api/projects/slug/:slug

/api/skills
/api/skills/:id

/api/experiences
/api/experiences/:id

/api/uploads/image
```

## Production

Frontend:
`https://fatou-folio.vercel.app`

Backend:
`https://fatou-portfolio-api.onrender.com`

Production API:
`https://fatou-portfolio-api.onrender.com/api`

Health:
`https://fatou-portfolio-api.onrender.com/api/health`

## Database

Main models:
- Profile
- Project
- ProjectSection
- ProjectImage
- Skill
- Experience
- User
- Session

Project relationship:

```text
Project
 ├── ProjectSection[]
 └── ProjectImage[]
```

## Authentication

Admin authentication uses:
- email
- password
- server-side session
- HTTP-only cookie

Authenticated browser requests send credentials.

## Media

Upload flow:

```text
Admin UI
 ↓
frontend upload service
 ↓
POST /api/uploads/image
 ↓
Express + Multer
 ↓
Cloudinary
 ↓
{ url, publicId }
 ↓
CMS save
```

## Status

Implemented:
- React/Vite frontend
- TypeScript
- Tailwind CSS v4
- React Router
- Motion animations
- public project pages
- project detail pages
- admin authentication
- profile CMS
- skills CMS
- experience CMS
- projects CMS
- project sections
- project gallery
- Cloudinary uploads
- Neon PostgreSQL
- Render backend deployment
- Vercel frontend deployment

Production areas to validate:
- SPA routing
- Vercel → Render communication
- CORS
- cookie/session behavior
- CMS/public content consistency
- responsive polish
- performance
- SEO
- security hardening
