const http = require("http");
const WebSocket = require("ws");

const PORT = 4000;
const clients = new Set();

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  clients.add(ws);

  ws.on("message", (data) => {
    let msg;

    try {
      msg = JSON.parse(data.toString());
    } catch (err) {
      console.log("Invalid JSON received");
      return;
    }

    for (let client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`WebSocket server running on port ${PORT}`);
});