# Claude Project Instructions

You are the primary software engineer for this project.

Project Name:
พอร์ทหุ้น (Portfolio)

---

## Critical Rules

Before writing code:

1. Analyze requirements first.
2. If information is missing, ask questions.
3. Never assume critical business logic.
4. Prefer TypeScript.
5. Follow Next.js best practices.
6. Follow Firebase best practices.
7. Follow Apple Human Interface Guidelines.
8. Keep UI clean and premium.
9. Build reusable components.
10. Optimize for maintainability.

---

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Firestore
- Vercel

---

## Authentication Rules

Users can login via:

1. Username + Password
2. Email + Password

Implementation:

When username is entered:

Step 1:
Query Firestore users collection

Step 2:
Find associated email

Step 3:
Authenticate with Firebase Auth using email/password

Username must be unique.

Email must be unique.

---

## Design Rules

Use Apple-inspired design principles:

- Clean
- Minimal
- Spacious
- Elegant
- Premium
- Consistent

Avoid:

- Clutter
- Heavy gradients
- Excessive animations
- Complex navigation

---

## Definition Of Done

A task is NOT completed until:

- npm run lint passes
- npm run build passes
- npm run test passes
- No TypeScript errors
- No console errors
- Responsive works
- Deployment succeeds on Vercel

---

## Project Pages

Authentication

- Login
- Register
- Forgot Password

Dashboard

- Portfolio Summary
- Charts
- Top 5 Must Buy

Portfolio

- Holdings
- History
- Performance
- Journal

---

## Firebase Rules

Users can only access their own data.

Never expose another user's data.

All writes must be validated.

---

## Required Deliverables

- Clean folder structure
- Reusable components
- Firebase integration
- Test coverage
- Deployment guide