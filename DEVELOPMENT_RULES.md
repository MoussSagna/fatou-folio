# Development Rules

## General

Work incrementally.

Preserve the existing architecture unless a change is technically justified.

Do not perform unrelated refactors during a feature task.

## TypeScript

Use strict TypeScript.

Avoid `any`.

Prefer explicit domain types and interfaces.

## React

Use functional components.

Reuse existing components and hooks.

Keep API calls in services.

Keep presentation separate from business/data access logic.

## Motion

Use:
```ts
import { motion } from "motion/react";
```

Do not introduce Framer Motion.

Animations should be subtle, intentional and performant.

## Styling

Use Tailwind CSS v4.

Do not introduce another CSS framework.

Keep the public visual identity consistent.

## API

Use the existing service layer.

Authenticated requests require:
```ts
credentials: "include"
```

Do not hardcode production API URLs in components.

## Authentication

Authentication is cookie/session based.

Do not move session tokens into localStorage.

Do not bypass ProtectedRoute.

## CMS

CMS changes must persist through the API/database.

Do not solve CMS requirements with hardcoded content.

## Projects

Database IDs are numeric.

Slugs are unique strings.

Do not invent fake IDs in the frontend.

Do not reintroduce old mock project data as the source of truth.

## Images

Keep URL and Cloudinary public ID when available.

When replacing an image:
1. Upload replacement.
2. Save new URL/public ID.
3. Remove old Cloudinary asset when no longer referenced.

Never expose Cloudinary credentials in frontend code.

## Database

Do not casually change the production schema.

If schema changes are required:
1. inspect current schema
2. understand the existing migration/contract workflow
3. prepare the migration
4. verify the migration plan
5. avoid destructive changes unless explicitly required

## Environment

Never commit real secrets.

Do not expose backend environment variables to the browser.

## Git

Keep commits focused.

Preferred style:
```text
feat: add project gallery management
fix: prevent duplicate project sections
refactor: simplify profile service
chore: update production configuration
```

## Before editing

Always:
1. Read the file.
2. Check imports.
3. Check usages.
4. Check related types.
5. Check related API/services.
6. Make the smallest necessary change.

## Verification

Frontend:
```bash
npm run build
```

Backend:
```bash
npm run build
```

For runtime changes, test the relevant endpoint/page when possible.

## Error handling

Do not silently swallow errors.

Admin operations should clearly expose:
- loading
- saving
- uploading
- deleting
- errors

## Accessibility

Use semantic HTML.

Interactive controls must be keyboard accessible.

Images need meaningful alt text.

Use buttons for actions and links for navigation.

## Responsive

Test mobile, tablet and desktop behavior.

## Performance

Avoid unnecessary:
- dependencies
- API calls
- re-renders
- expensive animations
- oversized images

Do not hide build warnings without addressing the underlying issue.

## Completion

A task is complete only after:
1. code changes are implemented
2. relevant types/builds/tests are checked
3. regressions are addressed
4. unnecessary changes are avoided

Final report:

```text
Changed:
- ...

Verified:
- ...

Remaining:
- ...
```
