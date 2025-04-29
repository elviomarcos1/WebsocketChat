const WebSocket = require('ws');

function global(wss, from, message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ 
        type: 'global', 
        from, 
        message 
      }));
    }
  });
}

function private(wss, from, to, message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.nick === to) {
      client.send(JSON.stringify({ 
        type: 'private', 
        from, 
        message 
      }));
    }
  });
}

function userJoined(wss, nick) {
  global(wss, 'Sistema', `${nick} entrou no chat!`);
}

function userLeft(wss, nick) {
  global(wss, 'Sistema', `${nick} saiu do chat.`);
}

module.exports = { 
  global, 
  private, 
  userJoined, 
  userLeft 
};