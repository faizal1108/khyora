# Khyora API

Express + PostgreSQL backend for health scan images (Base64 in Postgres). Firebase Auth verifies `Authorization: Bearer <ID token>`.

## Setup

```bash
cd server
cp .env.example .env
npm install
npm run migrate
npm run dev
```

## Environment

- `DATABASE_URL` — PostgreSQL connection string
- `FIREBASE_PROJECT_ID` — Firebase project ID
- `GOOGLE_APPLICATION_CREDENTIALS` — path to Firebase service account JSON (required for token verification)
- `PORT` — default `3000`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/scans` | Upload image + run analysis |
| GET | `/api/scans` | List scan metadata (no images) |
| GET | `/api/scans/:scanId` | Scan detail with `data:` image URI |

Mobile app: set `EXPO_PUBLIC_API_URL` (use `http://10.0.2.2:3000` for Android emulator).
