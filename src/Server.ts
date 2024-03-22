import express from "express";
import http from "http";
import path from "path";

import { WebSocketServer } from "./WebSocketServer";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer(server);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Error handling for server
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') throw error;
  if (error.code === 'EADDRINUSE') {
    console.error('Port 8080 is already in use.');
    process.exit(1);
  } else {
    throw error;
  }
});

// Start server
server.listen(8080, () => {
  console.log("Server listening on port 8080. Connect to play.");
  require('dns').lookup(require('os').hostname(), function (err: NodeJS.ErrnoException | null, address: string, family: number) {
    console.log('Play with anyone on your network: ' + address + ':8080');
  })
});
