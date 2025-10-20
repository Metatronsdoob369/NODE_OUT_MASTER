import { useState, useEffect, useRef } from 'react';
import AIRouter from '../services/ai/AIRouter.js';
import aiConfig from '../services/ai/AIConfig.js';

const AIAssistant = ({ context, data, onSuggestionApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [aiRouter, setAiRouter] = useState(null);
  const [backendStatus, setBackendStatus] = useState({});
  const [currentBackend, setCurrentBackend] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const sessionId = useRef(`session-${Date.now()}`);

  // Initialize AI Router
  useEffect(() => {
    const initializeAI = async () => {
      try {
        setError(null);
        
        // Get API key from config or localStorage
        const storedApiKey = localStorage.getItem('openai-api-key');
        if (storedApiKey) {
          setApiKey(storedApiKey);
        }

        // Configure AI Router
        const routerConfig = {
          ...aiConfig.getAll(),
          openai: {
            ...aiConfig.get('openai'),
            apiKey: storedApiKey || process.env.REACT_APP_OPENAI_API_KEY
          }
        };

        const router = new AIRouter(routerConfig);
        const initialized = await router.initialize();
        
        if (initialized) {
          setAiRouter(router);
          setBackendStatus(router.getBackendStatus());
          setIsInitialized(true);
          console.log('AI Assistant initialized successfully');
        } else {
          setError('Failed to initialize AI backends. Please check your API key.');
        }
      } catch (err) {
        console.error('AI initialization error:', err);
        setError(`Initialization failed: ${err.message}`);
      }
    };

    initializeAI();

    // Cleanup on unmount
    return () => {
      if (aiRouter) {
        aiRouter.cleanup();
      }
    };
  }, []);

  // Update backend status periodically
  useEffect(() => {
    if (!aiRouter) return;

    const updateStatus = async () => {
      try {
        const health = await aiRouter.healthCheck();
        setBackendStatus(health);
      } catch (err) {
        console.error('Health check failed:', err);
      }
    };

    const interval = setInterval(updateStatus, 60000); // Every minute
    return () => clearInterval(interval);
  }, [aiRouter]);

  // Handle context changes
  useEffect(() => {
    if (context && aiRouter && isInitialized) {
      generateContextualSuggestions();
    }
  }, [context, data, aiRouter, isInitialized]);

  const generateContextualSuggestions = async () => {
    if (!aiRouter || !context) return;

    try {
      setIsThinking(true);
      
      const contextMessage = `I'm working with ${context}${data ? ` on ${JSON.stringify(data)}` : ''}. What are some quick suggestions or best practices I should consider?`;
      
      const response = await aiRouter.sendMessage(contextMessage, {
        tool: context,
        data: data,
        sessionId: sessionId.current,
        complexity: 'low' // Quick suggestions
      }, {
        maxTokens: 500,
        temperature: 0.3 // More focused responses
      });

      setSuggestions(response.suggestions || []);
      setExplanation(response.message.split('\n')[0]); // First line as explanation
      
    } catch (err) {
      console.error('Failed to generate suggestions:', err);
      setError(`Suggestion generation failed: ${err.message}`);
    } finally {
      setIsThinking(false);
    }
  };

  const handleUserQuestion = async (question) => {
    if (!question.trim() || !aiRouter) return;
    
    // Add user message to chat
    const userMessage = {
      type: 'user',
      message: question,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, userMessage]);
    setUserInput('');
    setIsThinking(true);
    setError(null);

    try {
      const response = await aiRouter.sendMessage(question, {
        tool: context || 'general',
        data: data,
        sessionId: sessionId.current,
        complexity: 'medium'
      });

      // Add AI response to chat
      const aiMessage = {
        type: 'ai',
        message: response.message,
        backend: response.backend,
        suggestions: response.suggestions,
        commands: response.commands,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiMessage]);

      // Update current backend info
      setCurrentBackend(response.backend);

    } catch (err) {
      console.error('AI response error:', err);
      const errorMessage = {
        type: 'error',
        message: `Sorry, I encountered an error: ${err.message}`,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
      setError(err.message);
    } finally {
      setIsThinking(false);
    }
  };

  const applySuggestion = (suggestion) => {
    if (onSuggestionApply) {
      onSuggestionApply(suggestion);
    }
    
    // Add to chat history
    const appliedMessage = {
      type: 'applied',
      message: `Applied suggestion: ${suggestion.text}`,
      command: suggestion.command,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, appliedMessage]);
  };

  const handleApiKeyUpdate = async (newApiKey) => {
    try {
      setApiKey(newApiKey);
      localStorage.setItem('openai-api-key', newApiKey);
      
      // Update AI config
      aiConfig.set('openai.apiKey', newApiKey);
      
      // Reinitialize router with new API key
      if (aiRouter) {
        await aiRouter.updateBackendConfig('openai', { apiKey: newApiKey });
        const health = await aiRouter.healthCheck();
        setBackendStatus(health);
      }
      
      setError(null);
      setShowSettings(false);
    } catch (err) {
      setError(`Failed to update API key: ${err.message}`);
    }
  };

  const clearHistory = () => {
    setChatHistory([]);
    if (aiRouter) {
      const backend = aiRouter.getBackend(currentBackend);
      if (backend && backend.clearHistory) {
        backend.clearHistory(sessionId.current);
      }
    }
  };

  const getStatusColor = (backend) => {
    const status = backendStatus[backend];
    if (!status) return 'text-gray-500';
    return status.available ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = (backend) => {
    const status = backendStatus[backend];
    if (!status) return '⚪';
    return status.available ? '🟢' : '🔴';
  };

  return (
    <>
      {/* AI Assistant Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-kali-green text-black' 
            : 'bg-gray-800 text-kali-green hover:bg-gray-700'
        } border-2 border-kali-green flex items-center justify-center`}
      >
        {isThinking ? (
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent"></div>
        ) : error ? (
          <span className="text-xl text-red-400">⚠️</span>
        ) : isInitialized ? (
          <span className="text-xl">🤖</span>
        ) : (
          <span className="text-xl">⏳</span>
        )}
      </button>

      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-96 bg-gray-900 rounded-lg border border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🤖</span>
              <div>
                <span className="font-semibold text-kali-green">AI Security Assistant</span>
                {isInitialized && (
                  <div className="text-xs text-gray-400">
                    {getStatusIcon(currentBackend)} {currentBackend}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-400 hover:text-white text-sm"
                title="Settings"
              >
                ⚙️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-3 bg-gray-800 border-b border-gray-700">
              <div className="space-y-2">
                <div className="text-xs text-gray-400">OpenAI API Key:</div>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="flex-1 bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600 focus:border-kali-green focus:outline-none"
                  />
                  <button
                    onClick={() => handleApiKeyUpdate(apiKey)}
                    className="bg-kali-green text-black px-2 py-1 rounded text-xs font-semibold"
                  >
                    Save
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  Backend Status: {Object.entries(backendStatus).map(([name, status]) => (
                    <span key={name} className={`ml-1 ${getStatusColor(name)}`}>
                      {name}({status.available ? 'OK' : 'Error'})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-900/20 border-b border-red-500/30">
              <div className="text-xs text-red-300">
                ⚠️ {error}
              </div>
            </div>
          )}

          {/* Context Info */}
          <div className="p-3 bg-gray-800 border-b border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Current Context:</div>
            <div className="text-sm text-kali-green font-mono">{context || 'general'}</div>
            {!isInitialized && (
              <div className="text-xs text-yellow-400 mt-1">
                ⏳ Initializing AI backends...
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="h-48 overflow-y-auto p-3 space-y-2">
            {explanation && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-2 text-sm text-blue-200">
                💡 {explanation}
              </div>
            )}
            
            {chatHistory.map((msg, index) => (
              <div key={index} className={`text-sm ${
                msg.type === 'user' ? 'text-right' : 'text-left'
              }`}>
                <div className={`inline-block max-w-xs p-2 rounded ${
                  msg.type === 'user' 
                    ? 'bg-kali-green text-black' 
                    : msg.type === 'applied'
                    ? 'bg-green-900/30 text-green-300 border border-green-500/30'
                    : msg.type === 'error'
                    ? 'bg-red-900/30 text-red-300 border border-red-500/30'
                    : 'bg-gray-800 text-white'
                }`}>
                  {msg.message}
                  {msg.backend && (
                    <div className="text-xs opacity-75 mt-1">
                      via {msg.backend}
                    </div>
                  )}
                  {msg.command && (
                    <div className="mt-1 font-mono text-xs opacity-75">
                      {msg.command}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            
            {isThinking && (
              <div className="text-left">
                <div className="inline-block bg-gray-800 text-white p-2 rounded">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse">🤔</div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3 border-t border-gray-700">
              <div className="text-xs text-gray-400 mb-2">AI Suggestions:</div>
              <div className="space-y-1">
                {suggestions.slice(0, 2).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => applySuggestion(suggestion)}
                    className="w-full text-left text-xs bg-gray-800 hover:bg-gray-700 text-kali-green p-2 rounded transition-colors duration-200"
                    title={suggestion.explanation}
                  >
                    ⚡ {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUserQuestion(userInput)}
                placeholder={isInitialized ? "Ask me anything about security..." : "Initializing..."}
                disabled={!isInitialized || isThinking}
                className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:border-kali-green focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={() => handleUserQuestion(userInput)}
                disabled={!userInput.trim() || !isInitialized || isThinking}
                className="bg-kali-green text-black px-3 py-2 rounded text-sm font-semibold disabled:bg-gray-600 disabled:text-gray-400"
              >
                Ask
              </button>
            </div>
            <div className="flex justify-between mt-2">
              <button
                onClick={clearHistory}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear History
              </button>
              <div className="text-xs text-gray-500">
                {chatHistory.length} messages
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;

