export default {
  async fetch(req) {
    const url = new URL(req.url);

    // Test route
    if (url.pathname === "/") {
      return new Response("API is running 🚀");
    }

    // License check
    if (url.pathname === "/check-license" && req.method === "POST") {
      const body = await req.json();

      if (body.key === "FADY-123") {
        return Response.json({ valid: true });
      }

      return Response.json({ valid: false });
    }

    return new Response("Not Found", { status: 404 });
  }
};
