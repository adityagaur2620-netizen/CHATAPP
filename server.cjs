const http = require("http");
const WebSocket = require("ws");

const PORT = 4000;
const server = http.createServer();
const wss = new WebSocket.Server({ server });

let clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);

  ws.on("message", (data) => {
    let msg;
    try {
      msg = JSON.parse(data.toString());
    } catch (e) {
      console.log("Invalid JSON");
      return;
    }

    // sab clients ko broadcast
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

server.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
