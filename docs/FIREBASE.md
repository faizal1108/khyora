# Firebase setup for Khyora

This document explains **what Firebase is used for in Khyora**, what changed around **Firebase Storage**, and **what you should configure in the Firebase Console**.

---

## What Firebase does in this app

| Feature | Firebase product | Where data lives |
|--------|------------------|------------------|
| Login / signup / logout / password reset | **Authentication** (Email + Password) | Firebase Auth |
| User profile, onboarding, character | **Firestore** | `users/{uid}` |
| Period cycles | **Firestore** | `users/{uid}/cycles/{cycleId}` |
| Health scan **images** | **Not Firebase** | PostgreSQL via [Khyora API](../server/README.md) |
| Health scan **results** (flow, risk, etc.) | **Not Firestore** (for new scans) | PostgreSQL `health_scans` table |

**Firebase Authentication** is the only identity layer. The mobile app sends a Firebase **ID token** to your backend; the API stores scans in **PostgreSQL**.

---

## Firebase Storage — what we changed

### Before (removed)

- Pad scan photos were uploaded with the Firebase Storage SDK (`uploadScanImage` in `src/services/firebase/storage.ts`).
- Scan metadata could also live under Firestore `users/{uid}/scans`.
- Firebase Storage security rules lived in `firebase/storage.rules`.

### Now (current)

- **Firebase Storage is not used** for scan images.
- The file `src/services/firebase/storage.ts` was **removed**.
- `getFirebaseStorage()` was **removed** from the app Firebase config.
- `firebase/storage.rules` was **removed**; Storage was **removed** from `firebase.json`.
- New scans: **camera/gallery → Base64 → `POST /api/scans` → PostgreSQL**.

### What you can ignore in Firebase Console

You **do not need** to:

- Enable **Firebase Storage** for Khyora scan uploads
- Deploy Storage security rules for scans
- Pay for or configure Storage buckets for pad images

If Storage was enabled earlier only for this app, you can leave the bucket unused or disable it in Console — the app will not call it.

### `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` in `.env`

The Firebase **web config** still includes a `storageBucket` field in many projects. Khyora may keep it in `.env` because it is part of the standard Firebase config object, but **the app does not upload scan images to that bucket**.

---

## What you **should** do in Firebase Console

### 1. Authentication

1. Open [Firebase Console](https://console.firebase.google.com/) → your project (e.g. `echo-41a49`).
2. **Build → Authentication → Sign-in method**
3. Enable **Email/Password** only (Google Sign-In is **not** used in this app).
4. Optionally configure **Email templates** (password reset) under Authentication → Templates.

### 2. Firestore Database

1. **Build → Firestore Database** → Create database (if not created).
2. Deploy security rules from the repo:

   [`firebase/firestore.rules`](../firebase/firestore.rules)

   Users may only read/write their own data:

   - `users/{userId}`
   - `users/{userId}/cycles/{cycleId}`
   - `users/{userId}/scans/{scanId}` (legacy; new scans use PostgreSQL)

   Deploy:

   ```bash
   firebase deploy --only firestore:rules
   ```

### 3. Register apps (Android / optional iOS)

- **Android:** package name must match [`app.json`](../app.json) → `expo.android.package` (currently `com.khyora`).
- Place [`google-services.json`](../google-services.json) in the project root (already wired via `android.googleServicesFile` in `app.json`).
- **iOS:** set `bundleIdentifier` in `app.json` if you ship iOS.

### 4. Web app config → `.env`

From **Project settings → Your apps → Web app**, copy values into [`.env`](../.env):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Restart Expo after changing `.env`.

### 5. Backend token verification (for scans API)

The **Node API** (`server/`) verifies Firebase ID tokens with **Firebase Admin SDK**.

In Console:

1. **Project settings → Service accounts**
2. **Generate new private key** → save JSON securely (never commit to git).
3. On the server, set in `server/.env`:

   ```env
   GOOGLE_APPLICATION_CREDENTIALS=./path-to-serviceAccount.json
   FIREBASE_PROJECT_ID=your-project-id
   ```

This is required for `POST /api/scans` and scan listing — not for Firebase Storage.

---

## Architecture (auth vs images)

```text
Mobile app
    │
    ├─ Email/Password ──────────► Firebase Authentication
    │                                      │
    │                                      ▼
    ├─ Profile, cycles ─────────► Firestore (users/{uid}, cycles)
    │
    └─ Scan image + analysis ───► Khyora API (Bearer: Firebase ID token)
                                           │
                                           ▼
                                    PostgreSQL (health_scans.image_data)
```

---

## Checklist

| Task | Required? |
|------|-----------|
| Enable Email/Password auth | Yes |
| Create Firestore + deploy rules | Yes |
| Add `google-services.json` for Android | Yes (native builds) |
| Fill `.env` Firebase web config | Yes |
| Enable Firebase Storage | **No** (not used for scans) |
| Deploy Storage rules | **No** |
| Service account for API | Yes (for scan upload API) |
| `EXPO_PUBLIC_API_URL` in app `.env` | Yes (for scans) |

---

## Related docs

- [Main README](../README.md) — run the app
- [server/README.md](../server/README.md) — PostgreSQL API, migrations, scan endpoints
