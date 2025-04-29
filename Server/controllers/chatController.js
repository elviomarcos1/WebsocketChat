const User = require('../models/User');
const broadcast = require('../utils/broadcast');

function handleConnection(ws, wss) {
  let user = new User(ws);

  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());

    if (msg.type === 'setNick') {
      user.setNickname(msg.nick, wss);
    } else if (msg.type === 'global') {
      broadcast.global(wss, user.nick, msg.message);
    } else if (msg.type === 'private') {
      broadcast.private(wss, user.nick, msg.to, msg.message);
    }
  });

  ws.on('close', () => {
    if (user.nick) {
      broadcast.userLeft(wss, user.nick);
    }
  });
}

module.exports = { handleConnection };
