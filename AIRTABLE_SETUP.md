# Airtable CRM Setup Guide

This guide documents the Airtable setup required for the `Customers` page in this project.

## What This Integration Expects

The application reads records from a single Airtable base named `CRM` and a table named `Customer Orders`.

The required columns are:

- `Customer name`
- `Customer contact number`
- `Order identifier`
- `Ordered product details`

## 1. Create The Airtable Base

1. Sign in to Airtable.
2. Create a new base.
3. Name the base `CRM`.
4. Create a table named `Customer Orders`.

## 2. Create The Required Columns

Configure these columns in `Customer Orders`:

| Column | Recommended type | Notes |
|---|---|---|
| `Customer name` | Single line text | Required |
| `Customer contact number` | Phone number | Required |
| `Order identifier` | Single line text | Required |
| `Ordered product details` | Single line text or multiple select | Required |

Notes:

- If you use `multiple select` for `Ordered product details`, this project joins the selected values into a comma-separated string before rendering.
- Do not rename the columns unless you also update the server-side Airtable mapping in `lib/airtable.ts`.

## 3. Add Sample Test Data

Add at least 5 records for development validation:

| Customer name | Customer contact number | Order identifier | Ordered product details |
|---|---|---|---|
| Ava Wilson | +1 202-555-0148 | ORD-1001 | Stainless Bottle, Lunch Box |
| Noah Patel | +1 202-555-0182 | ORD-1002 | Coffee Beans |
| Mia Johnson | +1 202-555-0174 | ORD-1003 | Standing Desk Mat |
| Liam Brown | +1 202-555-0133 | ORD-1004 | Wireless Mouse, Keyboard |
| Sophia Davis | +1 202-555-0109 | ORD-1005 | Notebook Set |

## 4. Create An Airtable Token

Important:

- Airtable now uses a Personal Access Token instead of legacy API keys.
- If a workflow says "API key", use a Personal Access Token.

Create the token:

1. Open Airtable token management at `https://airtable.com/create/tokens`.
2. Create a new token with a name like `inventory-sys-crm-read`.
3. Grant the `data.records:read` scope.
4. Restrict the token to the `CRM` base only.
5. Copy the token immediately and store it in a secure password manager.

Use that token as the value for:

```env
AIRTABLE_API_KEY=your_airtable_personal_access_token
```

## 5. Find The Base ID

You need the Airtable base ID for API access.

Ways to find it:

1. Open the API docs from within Airtable for the `CRM` base.
2. Copy the base ID that starts with `app`.

Store it in:

```env
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

If your table name is different, set:

```env
AIRTABLE_TABLE_NAME=Your Table Name
```

Otherwise, the app defaults to:

```env
AIRTABLE_TABLE_NAME=Customer Orders
```

## 6. Add Environment Variables

Add these to `.env.local`:

```env
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
AIRTABLE_TABLE_NAME=Customer Orders
```

These values are read only on the server through the internal `/api/customers` route, so the Airtable token is not exposed to the browser.

## 7. Restrict Access Properly

To keep access limited to authorized application users:

1. Do not create a public share link for the base.
2. Only invite Airtable collaborators who actually need direct base access.
3. Use a token scoped only to the `CRM` base.
4. Grant only `data.records:read` unless you intentionally need write access.
5. Keep the token only in server-side environment variables and never in client code.

## 8. Verify API Connectivity

Once `.env.local` is configured, start the app:

```bash
npm run dev
```

Open:

- `http://localhost:3000/customers`

Expected result:

- loading state appears first
- customer rows render in the table
- sorting works by clicking table headers
- filtering works from the 4 filter inputs

You can also test the internal route directly:

```bash
curl http://localhost:3000/api/customers
```

If Airtable is configured correctly, the route returns:

```json
{
  "customers": [
    {
      "id": "rec...",
      "createdTime": "2026-06-17T00:00:00.000Z",
      "customerName": "Ava Wilson",
      "customerContactNumber": "+1 202-555-0148",
      "orderIdentifier": "ORD-1001",
      "orderedProductDetails": "Stainless Bottle, Lunch Box"
    }
  ]
}
```

## 9. Troubleshooting

### `Missing AIRTABLE_API_KEY.`

- Add `AIRTABLE_API_KEY` to `.env.local`
- Restart the dev server after editing env vars

### `Missing AIRTABLE_BASE_ID.`

- Copy the correct base ID from Airtable
- Make sure it starts with `app`

### `Airtable request failed with status 401.`

- The token is invalid, expired, or missing access to the `CRM` base
- Regenerate the token and confirm the base scope

### `Airtable request failed with status 403.`

- The token exists but does not have permission to read records
- Confirm `data.records:read` is enabled

### `Airtable request failed with status 404.`

- The base ID or table name is wrong
- Confirm `AIRTABLE_BASE_ID` and `AIRTABLE_TABLE_NAME`

### `Airtable CRM data does not match the expected customer order schema.`

- One or more required columns are missing or renamed
- Ensure the exact field names exist:
  - `Customer name`
  - `Customer contact number`
  - `Order identifier`
  - `Ordered product details`

### Table shows no rows

- Check whether the Airtable table actually contains records
- Check whether fields are empty; Airtable may omit empty fields from API responses

## 10. Maintenance Notes

For future replication:

1. Duplicate the `CRM` base structure
2. Recreate the `Customer Orders` table with the same 4 field names
3. Create a new read-only token scoped to the new base
4. Update `.env.local` with the new base ID and token

## What Was Implemented In This Project

The app now includes:

- a protected `Customers` page at `/customers`
- a secure server-side Airtable integration in `lib/airtable.ts`
- a typed internal API route at `/api/customers`
- column filtering and sorting in the UI
- loading and error states
- responsive rendering for desktop and mobile

## Important Limitation

The code and documentation are implemented in this repository, but actual Airtable account actions must still be completed in your Airtable workspace:

- creating the real base
- generating the real token
- copying the real base ID
- entering the credentials into `.env.local` or your deployment environment
