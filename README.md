# Clinic Admin Dashboard

Standalone Next.js admin project for clinic operations (separate from `clinic-app`).

## Features
- Admin overview with operational KPIs and activity.
- Full appointment management:
  - Monthly calendar view with appointment counts per day.
  - Create, update status, and delete appointments.
- Message center:
  - Capture inbound patient messages.
  - Search and triage with status workflow (`new`, `in_progress`, `resolved`).
- CMS management:
  - Create/edit website pages.
  - Draft/publish states and updated timestamp tracking.
- Doctor management:
  - Add/remove doctors.
  - Toggle active/inactive status.
  - Per-doctor appointment visibility.
- Settings:
  - Clinic profile fields.
  - Automation toggles (email/SMS/WhatsApp reminders and follow-ups).

## Run Locally
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks
```bash
npm run lint
npm run build
```
