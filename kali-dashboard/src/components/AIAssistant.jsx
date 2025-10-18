import { useState, useEffect } from 'react';

const AIAssistant = ({ context, data, onSuggestionApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');

  // AI Knowledge Base for different contexts
  const aiKnowledge = {
    'nmap-scan': {
      suggestions: [
        { 
          text: "Add -sV for version detection", 
          command: "-sV",
          explanation: "Version detection helps identify specific software versions running on open ports, crucial for finding known vulnerabilities."
        },
        { 
          text: "Use -A for aggressive scan", 
          command: "-A",
          explanation: "Aggressive scan combines OS detection, version detection, script scanning, and traceroute for comprehensive reconnaissance."
        },
        { 
          text: "Try --script vuln for vulnerability detection", 
          command: "--script vuln",
          explanation: "NSE vulnerability scripts can automatically detect common security issues like CVEs on discovered services."
        },
        { 
          text: "Add -O for OS fingerprinting", 
          command: "-O",
          explanation: "OS detection helps identify the target's operating system, useful for selecting appropriate exploits."
        }
      ],
      contextHelp: "Nmap is your reconnaissance Swiss Army knife. Start with basic port scans, then layer on version detection and vulnerability scanning based on what you discover."
    },
    'metasploit': {
      suggestions: [
        { 
          text: "Search for exploits by service", 
          command: "search type:exploit",
          explanation: "Use 'search' with filters to find relevant exploits. Try 'search apache' or 'search windows smb' for targeted results."
        },
        { 
          text: "Check exploit requirements", 
          command: "info [exploit_name]",
          explanation: "Always check exploit info for required options, target compatibility, and reliability ranking before use."
        },
        { 
          text: "Set up multi/handler for reverse shells", 
          command: "use exploit/multi/handler",
          explanation: "Multi/handler is essential for catching reverse shells from various payloads and maintaining persistent access."
        },
        { 
          text: "Generate custom payloads", 
          command: "msfvenom -p [payload] LHOST=[ip] LPORT=[port]",
          explanation: "Msfvenom creates standalone payloads for situations where direct Metasploit exploitation isn't possible."
        }
      ],
      contextHelp: "Metasploit excels at exploitation and post-exploitation. Always verify target compatibility and set proper options before launching exploits."
    },
    'security-monitoring': {
      suggestions: [
        { 
          text: "Analyze threat patterns", 
          command: "pattern_analysis",
          explanation: "Look for recurring IP addresses, timing patterns, or attack signatures to identify coordinated threats."
        },
        { 
          text: "Set up automated blocking rules", 
          command: "auto_block_rules",
          explanation: "Create rules to automatically block IPs showing malicious behavior patterns like brute force attempts."
        },
        { 
          text: "Export threat intelligence", 
          command: "export_iocs",
          explanation: "Export Indicators of Compromise (IOCs) to share with other security tools or threat intelligence platforms."
        }
      ],
      contextHelp: "Effective security monitoring requires understanding normal baseline behavior to identify anomalies and potential threats."
    },
    'proxy-control': {
      suggestions: [
        { 
          text: "Create IP whitelist for trusted sources", 
          command: "whitelist_add",
          explanation: "Maintain a whitelist of trusted IP ranges to ensure legitimate traffic isn't blocked during security incidents."
        },
        { 
          text: "Set up geographic blocking", 
          command: "geo_block",
          explanation: "Block traffic from specific countries or regions known for hosting malicious infrastructure."
        },
        { 
          text: "Enable deep packet inspection", 
          command: "dpi_enable",
          explanation: "Deep packet inspection can detect malicious payloads hidden in seemingly legitimate traffic."
        }
      ],
      contextHelp: "Proxy control is your first line of defense. Balance security with usability - overly restrictive rules can impact legitimate operations."
    }
  };

  // Simulate AI analysis based on context and data
  useEffect(() => {
    if (context && aiKnowledge[context]) {
      const contextData = aiKnowledge[context];
      setSuggestions(contextData.suggestions);
      setExplanation(contextData.contextHelp);
      
      // Add context-specific analysis
      if (data) {
        analyzeContextData(context, data);
      }
    }
  }, [context, data]);

  const analyzeContextData = (ctx, contextData) => {
    setIsThinking(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      let analysis = '';
      
      switch (ctx) {
        case 'nmap-scan':
          if (contextData.target) {
            analysis = `🎯 Analyzing target: ${contextData.target}\n\n`;
            if (contextData.target.includes('/24')) {
              analysis += "📡 Network scan detected. Recommend starting with -sn for host discovery, then targeted port scans on active hosts.";
            } else if (contextData.target.match(/^\d+\.\d+\.\d+\.\d+$/)) {
              analysis += "🎯 Single host target. Suggest comprehensive scan with -A flag for full reconnaissance.";
            }
          }
          break;
          
        case 'security-monitoring':
          if (contextData.threats && contextData.threats.length > 0) {
            const criticalThreats = contextData.threats.filter(t => t.severity === 'critical').length;
            const highThreats = contextData.threats.filter(t => t.severity === 'high').length;
            
            analysis = `🚨 Threat Analysis:\n\n`;
            analysis += `Critical: ${criticalThreats} | High: ${highThreats}\n\n`;
            
            if (criticalThreats > 0) {
              analysis += "⚠️ IMMEDIATE ACTION REQUIRED: Critical threats detected. Consider emergency lockdown.";
            } else if (highThreats > 2) {
              analysis += "📈 Elevated threat level. Monitor closely and prepare defensive measures.";
            } else {
              analysis += "✅ Threat level manageable. Continue monitoring and apply standard responses.";
            }
          }
          break;
          
        case 'metasploit':
          if (contextData.service) {
            analysis = `🔍 Service Analysis: ${contextData.service}\n\n`;
            analysis += "Searching exploit database for relevant modules...";
          }
          break;
      }
      
      if (analysis) {
        setChatHistory(prev => [...prev, {
          type: 'ai',
          message: analysis,
          timestamp: new Date()
        }]);
      }
      
      setIsThinking(false);
    }, 1500);
  };

  const handleUserQuestion = async (question) => {
    if (!question.trim()) return;
    
    // Add user message to chat
    setChatHistory(prev => [...prev, {
      type: 'user',
      message: question,
      timestamp: new Date()
    }]);
    
    setUserInput('');
    setIsThinking(true);
    
    // Simulate AI response based on context and question
    setTimeout(() => {
      const response = generateAIResponse(question, context);
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: response,
        timestamp: new Date()
      }]);
      setIsThinking(false);
    }, 2000);
  };

  const generateAIResponse = (question, ctx) => {
    const lowerQuestion = question.toLowerCase();
    
    // Context-aware responses
    if (lowerQuestion.includes('port') && lowerQuestion.includes('scan')) {
      return "🔍 For port scanning, I recommend:\n\n1. Start with -sS (SYN scan) for stealth\n2. Add -sV for version detection\n3. Use --top-ports 1000 for common ports\n4. Consider -T4 for faster scanning\n\nExample: nmap -sS -sV --top-ports 1000 -T4 [target]";
    }
    
    if (lowerQuestion.includes('exploit') || lowerQuestion.includes('metasploit')) {
      return "💥 Metasploit exploitation workflow:\n\n1. search [service/vulnerability]\n2. use [exploit_path]\n3. show options\n4. set RHOSTS [target]\n5. set LHOST [your_ip]\n6. exploit\n\nAlways check exploit reliability and test in controlled environment first!";
    }
    
    if (lowerQuestion.includes('threat') || lowerQuestion.includes('security')) {
      return "🛡️ Threat analysis best practices:\n\n1. Establish baseline behavior\n2. Monitor for anomalies\n3. Correlate multiple indicators\n4. Prioritize by severity and impact\n5. Document and share IOCs\n\nRemember: False positives are better than missed threats!";
    }
    
    if (lowerQuestion.includes('proxy') || lowerQuestion.includes('block')) {
      return "🚫 Proxy control strategies:\n\n1. Implement layered blocking (IP, geo, behavioral)\n2. Maintain whitelists for critical services\n3. Use rate limiting before full blocks\n4. Monitor for evasion attempts\n5. Have emergency bypass procedures\n\nBalance security with operational needs!";
    }
    
    // Generic helpful response
    return `🤖 I understand you're asking about "${question}". Based on the current ${ctx} context, here are some general recommendations:\n\n• Always verify your targets and permissions\n• Start with passive reconnaissance\n• Document your findings\n• Follow responsible disclosure practices\n• Keep your tools updated\n\nNeed more specific guidance? Ask me about particular tools or techniques!`;
  };

  const applySuggestion = (suggestion) => {
    if (onSuggestionApply) {
      onSuggestionApply(suggestion);
    }
    
    // Add to chat history
    setChatHistory(prev => [...prev, {
      type: 'applied',
      message: `Applied suggestion: ${suggestion.text}`,
      command: suggestion.command,
      timestamp: new Date()
    }]);
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
        ) : (
          <span className="text-xl">🤖</span>
        )}
      </button>

      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-96 bg-gray-900 rounded-lg border border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🤖</span>
              <span className="font-semibold text-kali-green">AI Security Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Context Info */}
          <div className="p-3 bg-gray-800 border-b border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Current Context:</div>
            <div className="text-sm text-kali-green font-mono">{context || 'general'}</div>
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
                    : 'bg-gray-800 text-white'
                }`}>
                  {msg.message}
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
                    <span>Analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3 border-t border-gray-700">
              <div className="text-xs text-gray-400 mb-2">Quick Suggestions:</div>
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
                placeholder="Ask me anything about security..."
                className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:border-kali-green focus:outline-none"
              />
              <button
                onClick={() => handleUserQuestion(userInput)}
                disabled={!userInput.trim() || isThinking}
                className="bg-kali-green text-black px-3 py-2 rounded text-sm font-semibold disabled:bg-gray-600 disabled:text-gray-400"
              >
                Ask
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
