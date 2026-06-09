<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint (flat config, `eslint.config.mjs`) |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma db push` | Push schema to DB |
| `npx prisma migrate dev` | Create/apply migrations |

No test, typecheck, or format scripts exist. No pre-commit hooks, no CI.

## Architecture

- **App Router** under `src/app/` with route groups `(auth)` and `(front)`. Path alias `@/*` → `src/*`.
- **Prisma v7** with `@prisma/adapter-mariadb` (driver adapter, not binary engine). Client output to `../generated/prisma`. Datasource is `mysql` in schema.
- **better-auth** (not NextAuth). Split: `src/lib/auth.ts` (server, Prisma adapter) / `src/lib/auth-client.ts` (browser). API route at `src/app/api/auth/[...all]/route.ts`. Email/password enabled, no email verification required.
- **Tailwind v4**: CSS-based config via `@import "tailwindcss"` in `src/app/globals.css`. No `tailwind.config.js`.
- **shadcn/ui** `radix-luma` style (not default). Config in `components.json`. Icon library: remixicon.
- **Zustand v5** with persist middleware for cart state (`src/lib/cart-store.ts`).
- **Zod v4** validation. `react-hook-form` + `@hookform/resolvers` for forms.
- **Next.js v16 feature**: `cacheComponents: true` in `next.config.ts`.

## Prisma

```bash
npx prisma generate
npx prisma db push
npx prisma migrate dev
```

Prisma is a MariaDB client (despite `provider = "mysql"` in schema). Generated code lands in `generated/prisma/` (not `node_modules/.prisma`). Migrations in `prisma/migrations/`. Requires `DATABASE_URL` env var.

## Environment

- `DATABASE_URL` — MariaDB connection string (required for Prisma)
- Configure in `.env` or via platform env vars

## Docker

`Dockerfile` exists for containerized deployment.

## ข้อกำหนดในการเขียนโค๊ด

- แยก TypeScript Type ทุกอย่าง ออกไปไว้ที่โฟลเดอร์ scr/types
- การตั้งชื่อไฟล์ Typescript (.ts) ให้ตั้งตามตัวอย่างนี้คือ course-service.ts
- ห้ามใช้คำสั่ง npx prisma db push