// src/App.tsx
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

async function loadLessons() {
  const lessonsCol = collection(db, "lessons");
  const snapshot = await getDocs(lessonsCol);
  // …process your lesson documents…
}

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://8xwrsp-5173.csb.app",
      changeOrigin: true,
      secure: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  );
};
