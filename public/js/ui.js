const UI = {
    displayMessage(msg) {
      const chatBox = document.getElementById('chat');
      chatBox.innerHTML += `<p><strong>${msg.from || 'Sistema'}:</strong> ${msg.message}</p>`;
    }
  };