class User {
    constructor(ws) {
      this.ws = ws;
      this.nick = null;
    }
  
    setNickname(nick, wss) {
      const nickInUse = Array.from(wss.clients).some((client) => {
        return client !== this.ws && client.nick === nick;
      });
    
      if (nickInUse) {
        this.ws.send(JSON.stringify({ type: 'error', message: 'Nick em uso' }));
      } else {
        this.nick = nick;
        this.ws.nick = nick; // Adiciona o nick ao socket para referência
        this.ws.send(JSON.stringify({ type: 'nicknameSet', nick }));
        const broadcast = require('../utils/broadcast');
        broadcast.userJoined(wss, nick);
      }
    }
    
  }
  
  module.exports = User;