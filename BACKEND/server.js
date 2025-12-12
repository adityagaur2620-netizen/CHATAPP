import http from "http";
import express from "express";
import { WebSocketServer } from "ws";

const app = express();

// simple health check
app.get("/", (req, res) => {
  res.send("Backend running");
});

const server = http.createServer(app);

// ⚠️ attach WebSocket to SAME server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("✅ WebSocket connected");

  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());
    ws.send(msg.toString()); // echo
  });

  ws.on("close", () => {
    console.log("❌ WebSocket closed");
  });
});

// Railway requires process.env.PORT
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
