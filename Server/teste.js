const WebSocket = require('ws');
const readline = require('readline');

const ws = new WebSocket('ws://localhost:8080');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let username = 'Ricardo';

ws.on('open', () => {
    console.log('Conectado ao servidor. Digite seu nome:');
    
    rl.on('line', (input) => {
        if (!username && input.trim()) {
            username = input.trim();
            ws.send(`/nome ${username}`);
        } else {
            ws.send(input);
        }
    });
});

ws.on('message', (message) => {
    console.log(message);
});

ws.on('close', () => {
    console.log('Conexão fechada');
    rl.close();
    process.exit();
});