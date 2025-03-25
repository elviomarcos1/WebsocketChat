const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Erro ao carregar o arquivo');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  }
  else if (req.url.match(/\.(css|js)$/)) {
    const filePath = path.join(__dirname, 'public', req.url);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Arquivo não encontrado');
      } else {
        const contentType = req.url.endsWith('.css') ? 'text/css' : 'application/javascript';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  }
});

const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', (ws) => {
  console.log('Novo cliente conectado');
  
  ws.username = 'Anônimo';
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'set_username') {
        ws.username = data.username;
        clients.set(ws, data.username);
        ws.send(JSON.stringify({
          type: 'system',
          message: `Você está conectado como: ${data.username}`
        }));
        return;
      }
      
      broadcast({
        type: 'chat',
        username: ws.username,
        message: data.message,
        timestamp: new Date().toLocaleTimeString()
      });
      
    } catch (e) {
      console.error('Erro ao processar mensagem:', e);
    }
  });
  
  ws.on('close', () => {
    console.log(`${ws.username} desconectou`);
    clients.delete(ws);
  });
});

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em:
  - Local: http://localhost:${PORT}
  - Rede: http://${getLocalIpAddress()}:${PORT}`);
});

function getLocalIpAddress() {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}