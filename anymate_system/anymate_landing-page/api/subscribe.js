// /api/subscribe - Vercel serverless function
const admin = require("firebase-admin");

let appInitialized = false;
function initAdmin() {
  if (appInitialized) return;
  const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!svc) throw new Error("FIREBASE_SERVICE_ACCOUNT env var not set");
  const creds = JSON.parse(svc);
  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(creds) });
  }
  appInitialized = true;
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    initAdmin();
    const db = admin.firestore();
    const data = req.body || {};

    const email = String(data.email || "").trim().toLowerCase();
    const name = String(data.name || "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const doc = {
      name,
      email,
      role: data.role || "Unknown",
      first_use: data.first_use || "",
      ts: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("waitlist").add(doc);

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}