document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const messageInput = document.getElementById('message-input');
  const usernameInput = document.getElementById('username');
  const sendButton = document.getElementById('send-button');
  const connectionStatus = document.getElementById('connection-status');

  let ws;
  let username = '';
  let isConnected = false;

  // Conectar ao WebSocket
  function connectWebSocket() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      ws = new WebSocket(`${protocol}//${host}`);

      ws.onopen = () => {
          isConnected = true;
          updateConnectionStatus('Conectado', '#4CAF50');
          if (username) {
              setUsername(username);
          }
      };

      ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          displayMessage(data);
      };

      ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          updateConnectionStatus('Erro na conexão', '#F44336');
      };

      ws.onclose = () => {
          isConnected = false;
          updateConnectionStatus('Desconectado', '#FF9800');
          setTimeout(connectWebSocket, 3000); // Tentar reconectar após 3 segundos
      };
  }

  // Atualizar status da conexão
  function updateConnectionStatus(text, color) {
      connectionStatus.textContent = text;
      connectionStatus.style.color = color;
  }

// Remova as linhas relacionadas ao usernameInput original
const modal = document.getElementById('username-modal');
const modalUsername = document.getElementById('modal-username');
const modalSubmit = document.getElementById('modal-submit');

// Mostrar modal ao carregar
modal.style.display = 'flex';

// Enviar username do modal
modalSubmit.addEventListener('click', () => {
  const name = modalUsername.value.trim();
  if (name) {
    username = name;
    modal.style.display = 'none';
    setUsername(name);
    messageInput.focus();
  }
});

// Permitir submit com Enter
modalUsername.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    modalSubmit.click();
  }
});

// Modifique a função setUsername para:
function setUsername(name) {
  if (isConnected && name.trim()) {
    username = name.trim();
    localStorage.setItem('chat_username', username);
    ws.send(JSON.stringify({
      type: 'set_username',
      username: username
    }));
    
    // Mostrar mensagem de boas-vindas
    displayMessage({
      type: 'system',
      message: `Bem-vindo, ${username}!`
    });
  }
}

// No connectWebSocket(), modifique o onopen:
ws.onopen = () => {
  isConnected = true;
  updateConnectionStatus('Conectado', '#4CAF50');
  
  // Se já tiver username salvo, definir automaticamente
  if (localStorage.getItem('chat_username')) {
    username = localStorage.getItem('chat_username');
    setUsername(username);
  }
};

  // Definir nome de usuário
  function setUsername(name) {
      if (isConnected && name.trim()) {
          username = name.trim();
          ws.send(JSON.stringify({
              type: 'set_username',
              username: username
          }));
      }
  }

  // Enviar mensagem
  function sendMessage() {
      const message = messageInput.value.trim();
      const currentUsername = usernameInput.value.trim();

      if (message && isConnected) {
          // Definir nome se ainda não foi definido
          if (currentUsername && currentUsername !== username) {
              setUsername(currentUsername);
          }

          ws.send(JSON.stringify({
              type: 'chat',
              message: message
          }));

          messageInput.value = '';
      }
  }

  // Exibir mensagem no chat
  function displayMessage(data) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message');

      if (data.type === 'system') {
          messageDiv.classList.add('system');
          messageDiv.textContent = data.message;
      } else {
          const messageInfo = document.createElement('div');
          messageInfo.classList.add('message-info');
          messageInfo.innerHTML = `
              <span>${data.username}</span>
              <span>${data.timestamp}</span>
          `;

          const messageContent = document.createElement('div');
          messageContent.textContent = data.message;

          messageDiv.appendChild(messageInfo);
          messageDiv.appendChild(messageContent);

          // Destacar mensagens próprias
          if (data.username === username) {
              messageDiv.classList.add('sent');
          }
      }

      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Event Listeners
  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          sendMessage();
      }
  });

  usernameInput.addEventListener('change', (e) => {
      if (e.target.value.trim() && e.target.value.trim() !== username) {
          setUsername(e.target.value.trim());
      }
  });

  // Iniciar conexão
  connectWebSocket();
});