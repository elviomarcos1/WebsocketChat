const ws = new WebSocket('ws://localhost:8080');
let currentNick = '';

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);

  if (msg.type === 'nicknameSet') {
    currentNick = msg.nick;

    // Habilita o botão após definir o nick
    document.getElementById('messageInput').disabled = false;
    document.getElementById('nickInput').disabled = true;

    UI.displayMessage({ from: 'Sistema', message: `Nickname definido como ${msg.nick}` });
  } else if (msg.type === 'error') {
    alert(msg.message);
  } else {
    UI.displayMessage(msg);
  }
};

document.getElementById('sendButton').addEventListener('click', () => {
  const nick = document.getElementById('nickInput').value;
  const message = document.getElementById('messageInput').value;

  if (!currentNick && nick) {
    ws.send(JSON.stringify({ type: 'setNick', nick }));
    currentNick = nick;
  } else if (message) {
    ws.send(JSON.stringify({ type: 'global', message }));
    document.getElementById('messageInput').value = '';
  }
});

document.getElementById('messageInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    document.getElementById('sendButton').click();
    event.preventDefault();
  }
});