const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const chatController = require('./controllers/chatController');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Configurações
app.use(express.static(path.join(__dirname, '..', 'public')));

// WebSocket
wss.on('connection', (ws) => {
  chatController.handleConnection(ws, wss);
});

server.listen(8080, () => {
  console.log('Servidor rodando em http://localhost:8080');
});