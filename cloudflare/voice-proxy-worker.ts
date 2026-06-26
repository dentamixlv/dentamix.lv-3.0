// Cloudflare Worker: WebSocket Proxy for Gemini Live API
export interface Env {
  GOOGLE_AI_STUDIO_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    if (!upgradeHeader || upgradeHeader !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const apiKey = env.GOOGLE_AI_STUDIO_API_KEY;
    if (!apiKey) {
      return new Response("Worker configuration missing: GOOGLE_AI_STUDIO_API_KEY", { status: 500 });
    }

    // 1. Create a WebSocketPair for the client connection
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    // 2. Establish connection to the official Google AI Studio Live API
    const googleUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
    const googleSocket = new WebSocket(googleUrl);

    // 3. Accept the server side of the WebSocketPair to begin piping
    server.accept();

    // 4. Pipe Client Browser -> Google AI Studio
    server.addEventListener("message", (event) => {
      if (googleSocket.readyState === WebSocket.OPEN) {
        googleSocket.send(event.data);
      }
    });

    server.addEventListener("close", (event) => {
      googleSocket.close(event.code, event.reason);
    });

    // 5. Pipe Google AI Studio -> Client Browser
    googleSocket.addEventListener("message", (event) => {
      if (server.readyState === WebSocket.OPEN) {
        server.send(event.data);
      }
    });

    googleSocket.addEventListener("open", () => {
      console.log("Successfully connected to Gemini Live API");
    });

    googleSocket.addEventListener("close", (event) => {
      server.close(event.code, event.reason);
    });

    googleSocket.addEventListener("error", (err) => {
      console.error("Gemini WebSocket error in proxy:", err);
      server.close(1011, "Gemini WebSocket connection error");
    });

    // 6. Return the client socket of the pair to the browser (HTTP 101 Switching Protocols)
    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  },
};
