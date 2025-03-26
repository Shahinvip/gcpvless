const express = require("express");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 8080;

const wss = new WebSocket.Server({ noServer: true });

app.use("/", (req, res) => {
  res.send("VMess WebSocket Proxy Running");
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("upgrade", (request, socket, head) => {
  const target = "wss://xui.noorproxy.xyz"; // Your VPS WebSocket URL

  const ws = new WebSocket(target, {
    headers: {
      "Host": "xui.noorproxy.xyz", // Your VPS domain
      "User-Agent": "Mozilla/5.0"
    },
  });

  ws.on("open", () => {
    wss.handleUpgrade(request, socket, head, (client) => {
      wss.emit("connection", client, request);
    });
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
    socket.destroy();
  });
});
