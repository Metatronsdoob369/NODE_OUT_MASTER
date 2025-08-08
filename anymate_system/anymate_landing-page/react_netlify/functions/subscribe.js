// /.netlify/functions/subscribe
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
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    initAdmin();
    const db = admin.firestore();
    const data = JSON.parse(event.body || "{}");

    const email = String(data.email || "").trim().toLowerCase();
    const name = String(data.name || "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, body: "Invalid email" };
    }

    const doc = {
      name,
      email,
      role: data.role || "Unknown",
      first_use: data.first_use || "",
      ts: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("waitlist").add(doc);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server error" };
  }
};
