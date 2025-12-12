import http from "http";
import express from "express";
import { WebSocketServer } from "ws";

const app = express();


app.get("/", (req, res) => {
  res.send("Backend running");
});

const server = http.createServer(app);


const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("✅ WebSocket connected");

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString());

      // Broadcast to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify(msg));
        }
      });
    } catch (err) {
      console.error("Invalid JSON message");
    }
  });

  ws.on("close", () => {
    console.log("❌ WebSocket closed");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
