// Chat NOVA
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    const messagesContainer = document.getElementById('chat-messages');
    const typingEl = document.createElement('div');
    typingEl.className = 'message message-bot';
    typingEl.innerHTML = '<div class="message-avatar">🤖</div><div class="message-bubble">NOVA est en train d\'écrire...</div>';
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Get NOVA response
    try {
        const response = await nova.chat(message);
        typingEl.remove();
        addChatMessage(response, 'bot');
    } catch (error) {
        typingEl.remove();
        addChatMessage('Désolée, je n\'arrive pas à répondre. Réessayez plus tard.', 'bot');
    }
}

function addChatMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${sender}`;
    
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    if (sender === 'bot') {
        messageEl.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-bubble">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
    } else {
        messageEl.innerHTML = `
            <div class="message-bubble">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function openNovaInfo() {
    alert(`NOVA - Assistante Nutritionnelle\n\n${nova.getWhoCreatedMe()}\n\nJe suis disponible pour vous aider avec:\n- Conseils nutritionnels\n- Analyse de vos repas\n- Plans alimentaires\n- Questions sur la nutrition`);
}

window.sendChatMessage = sendChatMessage;
window.addChatMessage = addChatMessage;
window.openNovaInfo = openNovaInfo;