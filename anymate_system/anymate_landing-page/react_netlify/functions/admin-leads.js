// /.netlify/functions/admin-leads
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

exports.handler = async function (event) {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        leads,
        count: leads.length 
      })
    };
  } catch (err) {
    console.error("Admin leads error:", err);
    return { 
      statusCode: 500, 
      headers,
      body: JSON.stringify({ 
        error: "Failed to fetch leads",
        leads: []
      })
    };
  }
};