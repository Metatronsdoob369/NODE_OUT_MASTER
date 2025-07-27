// BLACK OPS MULTI-AGENT CHAT SERVER
// Real-time communication for Claude + Gemini + ChatGPT coordination

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname + '/public'));

// Agent tracking
const connectedAgents = {
  claude: { connected: false, socket: null },
  gemini: { connected: false, socket: null }, 
  chatgpt: { connected: false, socket: null },
  humans: []
};

io.on('connection', (socket) => {
  console.log('🔗 Agent connected:', socket.id);

  // Agent identification
  socket.on('identifyAgent', (agentData) => {
    const { agentType, agentName } = agentData;
    
    if (agentType === 'ai_agent') {
      if (connectedAgents[agentName]) {
        connectedAgents[agentName].connected = true;
        connectedAgents[agentName].socket = socket;
        socket.agentName = agentName;
        
        console.log(`🤖 ${agentName.toUpperCase()} AGENT ONLINE`);
        
        // Broadcast agent status update
        io.emit('agentStatusUpdate', {
          agent: agentName,
          status: 'ONLINE',
          timestamp: new Date().toISOString()
        });
      }
    } else {
      connectedAgents.humans.push(socket.id);
      socket.agentType = 'human';
      console.log('👤 Human user connected');
    }
    
    // Send current agent status to new connection
    socket.emit('currentAgentStatus', {
      claude: connectedAgents.claude.connected,
      gemini: connectedAgents.gemini.connected,
      chatgpt: connectedAgents.chatgpt.connected,
      humans: connectedAgents.humans.length
    });
  });

  // Listen for chat messages
  socket.on('chatMessage', (msgData) => {
    const message = {
      id: Date.now(),
      sender: msgData.sender || socket.agentName || 'Unknown',
      content: msgData.content || msgData,
      timestamp: new Date().toISOString(),
      agentType: socket.agentName ? 'ai_agent' : 'human'
    };
    
    console.log(`💬 [${message.sender}]: ${message.content}`);
    
    // Broadcast message to all connected clients
    io.emit('chatMessage', message);
  });

  // Mission coordination
  socket.on('missionUpdate', (missionData) => {
    console.log(`🎯 Mission Update from ${socket.agentName}:`, missionData);
    
    io.emit('missionUpdate', {
      ...missionData,
      from: socket.agentName,
      timestamp: new Date().toISOString()
    });
  });

  // Agent handshake protocol
  socket.on('agentHandshake', (handshakeData) => {
    console.log(`🤝 Handshake initiated by ${socket.agentName}`);
    
    io.emit('agentHandshake', {
      ...handshakeData,
      initiator: socket.agentName,
      timestamp: new Date().toISOString()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 Agent disconnected:', socket.id);
    
    if (socket.agentName && connectedAgents[socket.agentName]) {
      connectedAgents[socket.agentName].connected = false;
      connectedAgents[socket.agentName].socket = null;
      
      console.log(`❌ ${socket.agentName.toUpperCase()} AGENT OFFLINE`);
      
      // Broadcast agent offline status
      io.emit('agentStatusUpdate', {
        agent: socket.agentName,
        status: 'OFFLINE',
        timestamp: new Date().toISOString()
      });
    } else if (socket.agentType === 'human') {
      const index = connectedAgents.humans.indexOf(socket.id);
      if (index > -1) {
        connectedAgents.humans.splice(index, 1);
      }
    }
  });
});

const PORT = process.env.PORT || 3002; // Use port 3002 to avoid conflicts
server.listen(PORT, () => {
  console.log(`🚀 BLACK OPS CHAT SERVER running on port ${PORT}`);
  console.log(`🎯 Multi-Agent Coordination Center ACTIVE`);
});