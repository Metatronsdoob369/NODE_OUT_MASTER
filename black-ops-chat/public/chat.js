// BLACK OPS MULTI-AGENT CHAT CLIENT
const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const userTypeSelect = document.getElementById('userTypeSelect');
const connectBtn = document.getElementById('connectBtn');
const sendBtn = document.getElementById('sendBtn');

let connected = false;
let currentUser = null;

// Connect as selected agent/user type
connectBtn.addEventListener('click', () => {
  const selectedType = userTypeSelect.value;
  
  if (selectedType === 'human') {
    socket.emit('identifyAgent', {
      agentType: 'human',
      agentName: 'human_operator'
    });
    currentUser = 'Human Operator';
  } else {
    socket.emit('identifyAgent', {
      agentType: 'ai_agent', 
      agentName: selectedType
    });
    currentUser = selectedType.toUpperCase();
  }
  
  connected = true;
  input.disabled = false;
  sendBtn.disabled = false;
  connectBtn.disabled = true;
  userTypeSelect.disabled = true;
  
  addSystemMessage(`🔗 Connected as ${currentUser}`);
});

// Send message
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (input.value && connected) {
    socket.emit('chatMessage', {
      sender: currentUser,
      content: input.value
    });
    input.value = '';
  }
});

// Display incoming messages
socket.on('chatMessage', (message) => {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${message.sender.toLowerCase().replace(' ', '')}`;
  
  const timestamp = new Date(message.timestamp).toLocaleTimeString();
  
  messageDiv.innerHTML = `
    <div class="message-header">[${timestamp}] ${message.sender}:</div>
    <div>${message.content}</div>
  `;
  
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
});

// Update agent status indicators
socket.on('agentStatusUpdate', (statusData) => {
  const { agent, status } = statusData;
  const statusElement = document.getElementById(`${agent}-status`);
  
  if (statusElement) {
    const statusText = statusElement.querySelector('div:last-child');
    statusText.textContent = status;
    
    if (status === 'ONLINE') {
      statusElement.className = 'agent-indicator agent-online';
    } else {
      statusElement.className = 'agent-indicator agent-offline';
    }
  }
  
  addSystemMessage(`🤖 ${agent.toUpperCase()} is now ${status}`);
});

// Handle current agent status
socket.on('currentAgentStatus', (statusData) => {
  updateAgentStatus('claude', statusData.claude);
  updateAgentStatus('gemini', statusData.gemini);
  updateAgentStatus('chatgpt', statusData.chatgpt);
  
  const humanCount = document.getElementById('human-count');
  humanCount.textContent = statusData.humans;
});

// Mission updates
socket.on('missionUpdate', (missionData) => {
  addSystemMessage(`🎯 Mission Update from ${missionData.from}: ${missionData.status || 'Update received'}`);
});

// Agent handshake events
socket.on('agentHandshake', (handshakeData) => {
  addSystemMessage(`🤝 Agent Handshake initiated by ${handshakeData.initiator}`);
});

function updateAgentStatus(agent, isOnline) {
  const statusElement = document.getElementById(`${agent}-status`);
  const statusText = statusElement.querySelector('div:last-child');
  
  if (isOnline) {
    statusElement.className = 'agent-indicator agent-online';
    statusText.textContent = 'ONLINE';
  } else {
    statusElement.className = 'agent-indicator agent-offline';
    statusText.textContent = 'OFFLINE';
  }
}

function addSystemMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message system';
  messageDiv.style.background = 'rgba(255, 255, 0, 0.1)';
  messageDiv.style.borderLeft = '3px solid #ffff00';
  messageDiv.style.color = '#ffff00';
  
  const timestamp = new Date().toLocaleTimeString();
  messageDiv.innerHTML = `
    <div class="message-header">[${timestamp}] SYSTEM:</div>
    <div>${message}</div>
  `;
  
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}

// Special commands
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    // Ctrl+Enter for mission update
    if (input.value.startsWith('/mission')) {
      const missionData = {
        status: input.value.replace('/mission', '').trim(),
        agent: currentUser
      };
      socket.emit('missionUpdate', missionData);
      input.value = '';
      e.preventDefault();
    }
  }
});