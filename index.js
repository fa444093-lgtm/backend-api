import { initializeApp, cert } from "https://esm.sh/firebase-admin/app";
import { getFirestore } from "https://esm.sh/firebase-admin/firestore";
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
// حط بيانات JSON هنا 👇
const serviceAccount = {
  {
    "type": "service_account",
    "project_id": "industrial-ai-product-selector",
    "private_key_id": "59b8403ece0145d54b110861ec55d5f7a70b8ed2",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCzJxAJwKlkaedn\nFanoqFvgOlIVBghDCHLKp2JQK4IYXEtX1OI0ua162B1ykW+Sx5AIUH8DX8/Uvc9j\ncaoiwRoHZGULbEafPSlXHznMt4tNOhROtI36dRdv6cs+MgnlKraZ6dnPJPizpovT\n53pLZimEXRt+QwMsQX3O2+Fosb4xw2b/U/IV83thK7W+bB38DAPw/spXzpPci/YI\nne0EcPR0Ugqlrk3E4rnKCKZTt5AhwFPIKo1DIK+cPuATZ9by6rOfjDam3W1Hz32R\n+xCnLpraMeUzzNUrfRt+b3LEzdHCkk8F6gG/LuCOw237s6tsVYLt9jx3SEJ56JkH\nZLdOdjp7AgMBAAECggEADIaAoo3rye91lEl5daC/u6+YKYwga79ddzm4r+46zEU3\np05k+la5AEu301jDujlloo8uMigyuacDpuo9gOyLS1UDk4bgcSWvjD3Mprl2bdHP\ntaj9/DLPjq2D3jdVZcZUufIVnlvxX24XfJtEe50K7gwsbel1gVSa3SmWWuGCcKwg\nwjUIPyocuB+GbjjQaF75SBaV9DWsViT8Pnc35sNRO0hejCNO7niDPiGI49m0zvfj\nhEaQ3iEEn5x6WiPOFS4jRhJUjCfb1cwXTbbMZn+T8kpnNexXUZehnoSsUYH8fMY4\njjZJ6EsJDfRpA7PT+9uWXGiQGW9sgXKW5qr0o80LwQKBgQDeDB1aXi6xqoeg4C3m\ngwT8N5twohaaU6Gw/2K+vdWtzm6gq2cKVQH5kBqx9Fm/XnSgAPUOWbjvR1nMs37d\nq+CBjYj3GOH4Zw0V9VenKqdH27E+cOYBpvRANPnBX4K0r2Yn/0WpbShUtGPhMnOn\nBcGTjfsCo5kXJlk1RG6JsVL7EQKBgQDOi90si/IpWeG7YJNwuuC44xM6toWMfDbn\nF5BrSarO8HE5Ot+B6bUTcBSr/5IS4E9AOmjx2uKgAM25RsJpE2cjpNz/f+FPPYJQ\ntzolI86XKfNTfuBGnYL6dFooY+98WRVIaZkNa8kDXHhqBzg2en3o5Ob457ZvjUTz\nR37D3S7kywKBgDebGQ60X0Umy2hCO7xqOyleU5LVRIvJPcixa+0QZR5tf87Enb08\npI32xHikFIWUBei71KKPXXyuhZJ5sN+aV1KaOx6GILCwPdqt4hF+4P1hyvU0GKV5\nRdl+ar0+SeEtu4twpeVT7LGpqwmONOAy1NM6zw1OItxlQhnQ1U2uFnXBAoGACMiT\n4EgXRUDoQ5Ko0ntwAQzPDYkjhsTlhNBQuO9KD0DUX82sIZcxtyDmECZvLNRTKnUR\nb2+SgaFnHkDvFY7YrQBe0ZK7nyYLe6k/FMNADtee3Gch3H7oSgRWrS8KySv0pr6u\n3o493yG4kTG7Zz2wSw4o8F7SOE42p23b6zJlwx8CgYAms0R4nODOY6nftOitqJHN\nEvE5RGbL51mLWmYVYO/eY+e1y6it6PRK61z08oTAeOqXkS+oX6bO09RhFCULPApf\nfoVBH/63OD9CUwiqnVgxFBGe3/4N1QJtoXCEN6FmiDc1EzBtNby+fg1qeVSrySju\nsPFJjOZ60te4n5IbBdfPOw==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fbsvc@industrial-ai-product-selector.iam.gserviceaccount.com",
    "client_id": "108739099645183430357",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40industrial-ai-product-selector.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  };

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
