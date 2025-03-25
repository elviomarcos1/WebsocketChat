const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Conectado ao servidor');
  ws.username = 'Leonardo';

  ws.send(`O usuario ${ws.username} se conectou ao chat`);

  process.stdin.on('data', (data) => {
    ws.send(data.toString().trim());
  });
});

ws.on('message', (message) => {
  console.log(`${ws.username}: ${message}`);
});

ws.on('error', (error) => {
  console.error('Erro:', error);
});

ws.on('close', () => {
  console.log('Conexão fechada');
  process.exit();
});