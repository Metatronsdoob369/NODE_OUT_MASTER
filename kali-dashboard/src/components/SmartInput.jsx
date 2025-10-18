import { useState, useEffect } from 'react';

const SmartInput = ({ 
  label, 
  value, 
  onChange, 
  context, 
  placeholder, 
  type = 'text',
  suggestions = [],
  className = '',
  ...props 
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [contextualHelp, setContextualHelp] = useState('');
  const [smartSuggestions, setSmartSuggestions] = useState([]);

  // AI-powered contextual help based on input context
  const contextHelp = {
    'nmap-target': {
      help: "Enter IP address, hostname, or network range (e.g., 192.168.1.0/24)",
      examples: ["192.168.1.1", "example.com", "10.0.0.0/8", "192.168.1.1-100"],
      validation: /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$|^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^(\d{1,3}\.){3}\d{1,3}-\d{1,3}$/
    },
    'nmap-ports': {
      help: "Specify ports to scan (e.g., 80,443,22 or 1-1000)",
      examples: ["80,443,22", "1-1000", "1-65535", "80,443,8080-8090"],
      validation: /^(\d+(-\d+)?)(,\d+(-\d+)?)*$/
    },
    'metasploit-search': {
      help: "Search for exploits, payloads, or modules",
      examples: ["apache", "windows smb", "type:exploit platform:linux", "cve:2021"],
      validation: /.+/
    },
    'ip-address': {
      help: "Enter a valid IPv4 address",
      examples: ["192.168.1.1", "10.0.0.1", "172.16.0.1"],
      validation: /^(\d{1,3}\.){3}\d{1,3}$/
    },
    'port-number': {
      help: "Enter port number (1-65535)",
      examples: ["80", "443", "22", "3389"],
      validation: /^([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
    },
    'url': {
      help: "Enter a valid URL with protocol",
      examples: ["https://example.com", "http://192.168.1.1:8080", "ftp://files.example.com"],
      validation: /^https?:\/\/.+/
    }
  };

  // Generate smart suggestions based on current input and context
  useEffect(() => {
    if (value && context && contextHelp[context]) {
      generateSmartSuggestions(value, context);
    }
  }, [value, context]);

  const generateSmartSuggestions = (input, ctx) => {
    const suggestions = [];
    
    switch (ctx) {
      case 'nmap-target':
        if (input.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
          suggestions.push(`${input}.1`, `${input}.0/24`);
        } else if (input.match(/^\d{1,3}\.\d{1,3}$/)) {
          suggestions.push(`${input}.1.1`, `${input}.0.0/16`);
        }
        break;
        
      case 'nmap-ports':
        if (input === '80') {
          suggestions.push('80,443', '80,443,22', '80,443,8080');
        } else if (input === '22') {
          suggestions.push('22,80,443', '22,23,80');
        }
        break;
        
      case 'metasploit-search':
        if (input.toLowerCase().includes('apache')) {
          suggestions.push('apache type:exploit', 'apache cve:2021', 'apache struts');
        } else if (input.toLowerCase().includes('windows')) {
          suggestions.push('windows smb', 'windows rdp', 'windows type:exploit');
        }
        break;
    }
    
    setSmartSuggestions(suggestions);
  };

  const getValidationStatus = () => {
    if (!value || !context || !contextHelp[context]) return null;
    
    const { validation } = contextHelp[context];
    return validation.test(value) ? 'valid' : 'invalid';
  };

  const getHelpContent = () => {
    if (!context || !contextHelp[context]) return null;
    
    const { help, examples } = contextHelp[context];
    return { help, examples };
  };

  const applySuggestion = (suggestion) => {
    onChange({ target: { value: suggestion } });
    setShowSuggestions(false);
  };

  const validationStatus = getValidationStatus();
  const helpContent = getHelpContent();

  return (
    <div className="relative">
      {/* Label with help icon */}
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
        {helpContent && (
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="text-kali-green hover:text-kali-green/80 transition-colors"
            title="Show contextual help"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>

      {/* Input field with validation styling */}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
            validationStatus === 'valid' 
              ? 'border-green-500 focus:ring-green-500/20' 
              : validationStatus === 'invalid'
              ? 'border-red-500 focus:ring-red-500/20'
              : 'border-gray-600 focus:border-kali-green focus:ring-kali-green/20'
          } ${className}`}
          {...props}
        />
        
        {/* Validation indicator */}
        {validationStatus && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {validationStatus === 'valid' ? (
              <span className="text-green-500">✓</span>
            ) : (
              <span className="text-red-500">✗</span>
            )}
          </div>
        )}
      </div>

      {/* Contextual help panel */}
      {showHelp && helpContent && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl">
          <div className="text-sm text-gray-300 mb-3">
            💡 {helpContent.help}
          </div>
          
          <div className="text-xs text-gray-400 mb-2">Examples:</div>
          <div className="space-y-1">
            {helpContent.examples.map((example, index) => (
              <button
                key={index}
                onClick={() => applySuggestion(example)}
                className="block w-full text-left text-xs bg-gray-800 hover:bg-gray-700 text-kali-green px-2 py-1 rounded transition-colors duration-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Smart suggestions dropdown */}
      {showSuggestions && (smartSuggestions.length > 0 || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 z-40 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {/* Smart AI suggestions */}
          {smartSuggestions.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs text-kali-green border-b border-gray-700">
                🤖 Smart Suggestions
              </div>
              {smartSuggestions.map((suggestion, index) => (
                <button
                  key={`smart-${index}`}
                  onClick={() => applySuggestion(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </>
          )}
          
          {/* Regular suggestions */}
          {suggestions.length > 0 && (
            <>
              {smartSuggestions.length > 0 && (
                <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">
                  Suggestions
                </div>
              )}
              {suggestions.map((suggestion, index) => (
                <button
                  key={`regular-${index}`}
                  onClick={() => applySuggestion(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Validation message */}
      {validationStatus === 'invalid' && value && (
        <div className="mt-1 text-xs text-red-400">
          Invalid format. {helpContent?.help}
        </div>
      )}
    </div>
  );
};

export default SmartInput;
