import express from "express";
import { createServer, Server } from "node:http";

const app = express();
const server = createServer(app);
const socket = new Server(server);

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

socket.on("connection", (stream) => {
  console.log("a brand new connection");
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
