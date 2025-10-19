import React, { useState, useEffect, useRef } from 'react'
import { Bot, Send, Lightbulb, Shield, AlertTriangle, CheckCircle, X, Minimize2, Maximize2 } from 'lucide-react'

const AIAssistant = ({ isOpen, onClose, darkMode, addNotification }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial AI greeting
      setTimeout(() => {
        setMessages([{
          id: 1,
          type: 'ai',
          content: 'Hello! I\'m your AI Security Assistant. I can help you with threat analysis, vulnerability assessment, and security recommendations. How can I assist you today?',
          timestamp: new Date()
        }])
      }, 500)
    }
  }, [isOpen])

  const aiResponses = {
    'scan': 'I recommend starting with an Nmap scan to identify open ports and services. Based on the results, we can proceed with targeted vulnerability assessments.',
    'vulnerability': 'I\'ve detected several potential vulnerabilities. Let me prioritize them by severity: Critical (2), High (5), Medium (12). Shall I provide detailed remediation steps?',
    'threat': 'Current threat level: MODERATE. I\'ve identified suspicious network activity. Recommend immediate investigation using Wireshark for packet analysis.',
    'help': 'I can assist with: 🔍 Network scanning, 🛡️ Vulnerability assessment, 🚨 Threat detection, 📊 Security analysis, 💡 Best practices recommendations',
    'status': 'System Status: ✅ All security tools operational. Last scan: 2 minutes ago. No critical threats detected.',
    'default': 'I understand you\'re asking about security matters. Could you be more specific? I can help with scanning, vulnerability assessment, threat analysis, or general security guidance.'
  }

  const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('scan') || lowerMessage.includes('nmap')) {
      return aiResponses.scan
    } else if (lowerMessage.includes('vulnerability') || lowerMessage.includes('vuln')) {
      return aiResponses.vulnerability
    } else if (lowerMessage.includes('threat') || lowerMessage.includes('attack')) {
      return aiResponses.threat
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return aiResponses.help
    } else if (lowerMessage.includes('status') || lowerMessage.includes('report')) {
      return aiResponses.status
    } else {
      return aiResponses.default
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)

      // Add notification for important AI insights
      if (inputMessage.toLowerCase().includes('threat') || inputMessage.toLowerCase().includes('vulnerability')) {
        addNotification({
          type: 'warning',
          title: 'AI Security Alert',
          message: 'New security insights available in AI Assistant'
        })
      }
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    { icon: Shield, text: 'Security Scan', action: () => setInputMessage('Run a comprehensive security scan') },
    { icon: AlertTriangle, text: 'Threat Analysis', action: () => setInputMessage('Analyze current threats') },
    { icon: CheckCircle, text: 'System Status', action: () => setInputMessage('Show system status report') },
    { icon: Lightbulb, text: 'Recommendations', action: () => setInputMessage('Give me security recommendations') }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-2xl h-[600px] ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl rounded-2xl shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col transition-all duration-300 ${isMinimized ? 'h-16' : ''}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="w-8 h-8 text-green-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>AI Security Assistant</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isTyping ? 'Analyzing...' : 'Ready to help'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-green-500 text-white'
                      : darkMode
                      ? 'bg-gray-800 text-gray-100'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 opacity-70`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="p-4 border-t border-gray-700">
                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quick Actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                        darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <action.icon className="w-4 h-4" />
                      {action.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about security analysis, threats, or recommendations..."
                  className={`flex-1 p-3 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AIAssistant
