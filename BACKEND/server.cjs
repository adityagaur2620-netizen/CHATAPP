
const http = require("http");
const WebSocket = require("ws");


const PORT = process.env.PORT || 4000;
const clients = new Set();

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("✅ Client connected");
  clients.add(ws);

  ws.on("message", (data) => {
    let msg;

    try {
      msg = JSON.parse(data.toString());
      console.log("📩", msg);
    } catch (err) {
      console.log("Invalid JSON received:", data.toString());
      return;
    }

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
    clients.delete(ws);
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
});
