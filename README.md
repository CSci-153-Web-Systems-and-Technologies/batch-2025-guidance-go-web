# GuidanceGo

Fast & secure counseling scheduler for students and counselors.

## Overview
- Role‑aware experience: students book and manage sessions; counselors approve/cancel and view schedules.
- Home behavior: unauthenticated users see Login/Sign Up; signed‑in students auto‑redirect to Student Dashboard; counselors use their dashboard route.
- Clean, responsive UI with Tailwind; Supabase Auth and Postgres backend.

## Features
- Student: book sessions (in‑person or virtual), view stacked details, reschedule/cancel.
- Counselor: pending approvals list, schedule calendar, multi‑appointment drawer, per‑button loading states.
- Mode/status normalization: UI shows “virtual” while DB stores `online`; statuses use `Pending`, `Confirmed`, `Cancelled`.

## Tech Stack
- Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- Supabase (Postgres, Auth, RLS), optional realtime updates
- Turbopack dev server; ESLint/Prettier; Vercel‑ready

## Data Model Notes
- `appointments.mode`: `in-person` or `online` (displayed as “virtual”).
- `appointments.status`: exactly `Pending`, `Confirmed`, `Cancelled` (DB check constraint).
- `students` and `counselors` linked via `auth_user_id`.

## Project Structure
```
app/
 ├─ page.tsx (auth landing + student redirect)
 ├─ student-dashboard/
 ├─ studentbookappointmentpage/
 ├─ studentappointmentdetailspage/
 ├─ counselor-dashboard/
 ├─ aboutpage/ servicespage/ contactpage/
components/
 ├─ student-dashboard/
 ├─ counselor-dashboard/
 ├─ ui/
lib/
 └─ supabase/
```

## Setup
1) Install dependencies
```bash
npm install
```
2) Environment (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```
3) Run
```bash
npm run dev
```
4) Build + start
```bash
npm run build
npm start
```

## Deployment
- Set env vars on Vercel (URL, anon key).
- Ensure RLS policies match production.
- Use `/oauth-callback` for Supabase auth redirect flow.

## Troubleshooting
- Status constraint errors: match exact strings; map UI “virtual” → DB `online`.
- Multiple lockfiles warning: if using npm, delete `C:\Users\Admin\yarn.lock`.
- OAuth callback: `useSearchParams()` is wrapped in `<Suspense>`.

## License
MIT
