import { initializeApp, cert } from "https://esm.sh/firebase-admin/app";
import { getFirestore } from "https://esm.sh/firebase-admin/firestore";

// حط بيانات JSON هنا 👇
const serviceAccount = {
  // الصق محتوى ملف firebase-key.json هنا
};

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export default {
  async fetch(req) {
    const url = new URL(req.url);

    // Test
    if (url.pathname === "/") {
      return new Response("API is running 🚀");
    }

    // License Check
    if (url.pathname === "/check-license" && req.method === "POST") {
      try {
        const body = await req.json();
        const key = body.key;

        const doc = await db.collection("licenses").doc(key).get();

        if (!doc.exists) {
          return Response.json({ valid: false, reason: "not_found" });
        }

        const data = doc.data();

        const now = new Date();
        const expiry = data.expiry_date.toDate();

        if (data.status !== "active") {
          return Response.json({ valid: false, reason: "inactive" });
        }

        if (expiry < now) {
          return Response.json({ valid: false, reason: "expired" });
        }

        return Response.json({ valid: true });

      } catch (err) {
        return Response.json({ valid: false, error: err.message });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};
