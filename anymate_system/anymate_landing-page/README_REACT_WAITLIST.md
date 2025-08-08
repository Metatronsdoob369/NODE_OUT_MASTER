# ANYM8 — React Waitlist Patch

This adds a **/waitlist** route and a **Netlify serverless function** that saves signups to **Firebase Firestore**.

## Files included
- `pages/Waitlist.tsx` — drop into your `src/pages/` folder.
- `App.withWaitlist.tsx` — replace your `src/App.tsx` with this (or merge the new route).
- `react_netlify/functions/subscribe.js` — Netlify function.
- `netlify.react.toml` — Netlify config (SPA fallback + API route).
- `package.react.json` — add `firebase-admin` to your project (Netlify uses this for the functions build).

## Setup
1. Move `pages/Waitlist.tsx` into `src/pages/Waitlist.tsx`.
2. Replace your `src/App.tsx` with `App.withWaitlist.tsx` (or add the route manually).
3. Copy `react_netlify` and `netlify.react.toml` to your project root. If you already have a `netlify.toml`, merge the **redirects** and **functions** paths.
4. In Netlify → **Site settings → Environment variables**, add:
   - `FIREBASE_SERVICE_ACCOUNT` = paste the **full JSON** of a service account with Firestore write access.
5. Deploy. The form posts to `/api/subscribe` and writes to the `waitlist` collection.

If the API fails, the component falls back to local CSV so no leads are lost.
