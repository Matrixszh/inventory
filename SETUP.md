# Inventory Management System Setup Guide

This guide explains how to set up and run the Inventory Management System locally.

## Overview

This project uses:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase Auth, Firestore, and Storage
- OpenAI API (`gpt-4o`)
- Zustand
- React Hook Form + Zod
- Recharts

## Prerequisites

Before starting, make sure you have:

- Node.js 20 or later
- npm installed
- A Firebase project
- An OpenAI API key

## 1. Install Dependencies

From the project root, run:

```bash
npm install
```

## 2. Create Environment File

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

If you are on Windows PowerShell:

```powershell
Copy-Item .env.local.example .env.local
```

Then fill in these values in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
OPENAI_API_KEY=
```

## 3. Configure Firebase

Create a Firebase project in the Firebase Console, then enable the following services.

### Authentication

Enable:

- Email/Password sign-in method

### Firestore Database

Create a Firestore database in production or test mode.

The app expects these collections:

- `/users`
- `/categories`
- `/suppliers`
- `/inventory`
- `/stockMovements`
- `/auditLogs`

### Storage

Enable Firebase Storage because inventory item images are uploaded there.

## 4. Get Firebase Web App Config

In Firebase Console:

1. Open Project Settings
2. Create or select a Web App
3. Copy the Firebase config values
4. Paste them into `.env.local`

## 5. Create the First Admin User

This app uses Firebase Auth for login and Firestore for role-based access.

That means a user must exist in:

- Firebase Authentication
- Firestore `/users/{uid}`

### Step A: Create the user in Firebase Auth

In Firebase Console:

1. Go to Authentication
2. Create a user with email and password

### Step B: Create the Firestore user profile

Create a document in `/users` with the document ID set to the same Firebase Auth user `uid`.

Use this shape:

```json
{
  "name": "System Admin",
  "email": "admin@example.com",
  "role": "ADMIN",
  "createdAt": "2026-06-14T00:00:00.000Z",
  "isActive": true
}
```

Valid roles are:

- `ADMIN`
- `MANAGER`
- `VIEWER`

Without this Firestore user document, login will fail role checks.

## 6. Recommended Firestore Seed Data

Before using the app fully, create at least:

- 1 category
- 1 supplier
- 1 inventory item

You can do this through the UI after logging in as an admin, or directly in Firestore.

## 7. Firestore Query Indexes

Some Firestore queries in this project use filtering plus ordering. Firestore may ask you to create composite indexes the first time those routes are used.

If that happens:

1. Open the error link shown in the browser or terminal
2. Create the suggested index in Firebase
3. Wait for the index to finish building

This is expected for some filtered inventory, audit, or stock movement views.

## 8. OpenAI Setup

Set your OpenAI key in `.env.local`:

```env
OPENAI_API_KEY=your_key_here
```

This key is used only on the server for:

- `/api/chat`
- `/api/predictions`

If the key is missing:

- chat will fail
- predictions will fall back only where supported by the current code path

## 9. Run the App

Start the development server:

```bash
npm run dev
```

Open:

- [http://localhost:3000](http://localhost:3000)

You should be redirected to:

- `/login`

After signing in successfully, you will be sent to:

- `/dashboard`

## 10. Validation Commands

Run linting:

```bash
npm run lint
```

Run type checks:

```bash
npm run typecheck
```

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

## 11. Main Project Scripts

Available scripts from `package.json`:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit"
}
```

## 12. Access Model

The route and UI access model is:

- `ADMIN`: full access
- `MANAGER`: inventory and operational updates, but no user administration
- `VIEWER`: read-only access with chatbot access

Protected routes redirect unauthenticated users to `/login`.

## 13. Troubleshooting

### Login succeeds in Firebase but app still blocks access

Make sure the Firestore `/users/{uid}` document exists and contains:

- `role`
- `isActive`
- `name`
- `email`

### Image upload fails

Check:

- Firebase Storage is enabled
- Storage rules allow authenticated uploads
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is correct

### Inventory or analytics pages fail with Firestore index errors

Create the requested Firestore composite index from the Firebase error link.

### Chat or predictions fail

Check:

- `OPENAI_API_KEY` is set
- the key is valid
- the `gpt-4o` model is available to your account

### Middleware redirects unexpectedly

Check that:

- the user is logged in
- the Firestore role is valid
- the Firestore user profile has `isActive: true`

## 14. Suggested Next Steps

After setup, it is recommended to:

1. Create your first admin account
2. Add categories and suppliers
3. Add inventory items
4. Record stock movements
5. Test predictions and chatbot responses
6. Verify export endpoints

## 15. Important Notes

- The OpenAI API key must never be exposed client-side
- Firebase data mutations are routed through the shared Firestore helper layer
- The app depends on both Firebase Auth and Firestore role documents
- This project currently runs on the installed workspace version of Next.js in this repository
