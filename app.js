const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', (ws) => {
    console.log('Novo cliente conectado');
    clients.add(ws);

    ws.on('message', (message) => {
        console.log(`Mensagem recebida: ${message}`);
        
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
        clients.delete(ws);
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor WebSocket rodando na porta ${PORT}`);
});