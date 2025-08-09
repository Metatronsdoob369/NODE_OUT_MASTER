// /api/admin-leads - Vercel serverless function
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
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    initAdmin();
    const db = admin.firestore();
    
    // Fetch all leads from waitlist collection
    const snapshot = await db.collection("waitlist").orderBy("ts", "desc").get();
    const leads = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      leads.push({
        id: doc.id,
        name: data.name || "",
        email: data.email || "",
        role: data.role || "Unknown",
        first_use: data.first_use || "",
        ts: data.ts ? data.ts.toDate().toISOString() : new Date().toISOString()
      });
    });

    return res.status(200).json({ 
      leads,
      count: leads.length 
    });
  } catch (err) {
    console.error("Admin leads error:", err);
    return res.status(500).json({ 
      error: "Failed to fetch leads",
      leads: []
    });
  }
}