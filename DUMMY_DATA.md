# Dummy Data Seeding

This project includes a large Firestore seed utility so you can test the inventory system with realistic sample data.

## What Gets Created

- 1 seed system admin profile used for audit attribution
- 12 extra sample user documents for the `/users` table
- 14 categories
- 24 suppliers
- 240 inventory items
- Thousands of stock movements spread across recent and older dates
- Matching audit log records for every seeded write

All seeded document IDs use a predictable `seed-...` prefix so they can be cleared safely later.

## Before You Run It

Make sure your Firebase client environment variables are available in `.env.local`:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Seed Large Dummy Data

Run:

```bash
npm run seed:dummy
```

This will:

1. remove any previously seeded dummy documents
2. generate a fresh large dataset
3. write it into your Firebase project

## Clear Only The Seeded Data

Run:

```bash
npm run seed:dummy:clear
```

This removes only documents created by the seed utility:

- `users`
- `categories`
- `suppliers`
- `inventory`
- `stockMovements`
- `auditLogs`

## Notes

- Seeded inventory items include placeholder image URLs from `picsum.photos`.
- Seed user documents are for table/testing visibility. They are not Firebase Auth accounts.
- Use your real Firebase Auth admin account to log in and explore the seeded dataset.
