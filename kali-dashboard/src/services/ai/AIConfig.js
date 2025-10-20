/**
 * AI Configuration Management
 * Handles configuration for AI backends and routing
 */

// Default configuration for AI backends
export const DEFAULT_CONFIG = {
  // AI Router configuration
  router: {
    defaultBackend: 'openai',
    fallbackOrder: ['openai', 'local', 'clay-i'],
    routingRules: {
      'nmap': 'openai',           // Complex analysis
      'metasploit': 'openai',     // Exploit guidance
      'monitoring': 'local',      // Privacy-sensitive
      'general': 'openai'         // Default
    },
    healthCheckInterval: 60000,   // 1 minute
    retryAttempts: 3,
    timeout: 30000               // 30 seconds
  },

  // OpenAI backend configuration
  openai: {
    enabled: true,
    apiKey: null,                // Set via environment or user input
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
    timeout: 30000,
    maxRetries: 3,
    models: [
      { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model for complex analysis' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Faster GPT-4 with larger context' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient for simple tasks' }
    ]
  },

  // Local LLM configuration (Ollama)
  local: {
    enabled: false,              // Will be enabled in Phase 3
    baseURL: 'http://localhost:11434',
    model: 'llama2',
    timeout: 60000,              // Local models can be slower
    maxRetries: 2,
    models: [
      { id: 'llama2', name: 'Llama 2', description: 'General purpose local model' },
      { id: 'codellama', name: 'Code Llama', description: 'Specialized for code analysis' },
      { id: 'mistral', name: 'Mistral', description: 'Fast and efficient local model' }
    ]
  },

  // Clay-I backend configuration
  clayI: {
    enabled: false,              // Will be enabled in Phase 5
    baseURL: null,               // To be configured
    apiKey: null,
    timeout: 30000,
    maxRetries: 3
  },

  // Security settings
  security: {
    validateCommands: true,      // Validate AI-suggested commands
    allowDangerousCommands: false,
    commandWhitelist: [
      'nmap', 'masscan', 'nikto', 'dirb', 'gobuster',
      'curl', 'wget', 'ping', 'traceroute', 'dig', 'nslookup',
      'grep', 'awk', 'sed', 'cat', 'head', 'tail'
    ],
    commandBlacklist: [
      'rm -rf /', 'dd if=', 'mkfs', 'shutdown', 'reboot',
      'passwd', 'su ', 'sudo su', 'chmod 777', 'chown root'
    ]
  },

  // UI preferences
  ui: {
    showBackendInfo: true,       // Show which backend is being used
    showRoutingInfo: false,      // Show routing decisions (debug mode)
    autoSuggestions: true,       // Show AI suggestions automatically
    maxSuggestions: 5,           // Maximum number of suggestions to show
    conversationHistory: 10,     // Number of messages to keep in history
    theme: 'dark'                // UI theme
  }
};

/**
 * Configuration manager class
 */
class AIConfig {
  constructor(initialConfig = {}) {
    this.config = this.mergeConfig(DEFAULT_CONFIG, initialConfig);
    this.listeners = new Set();
  }

  /**
   * Deep merge configuration objects
   */
  mergeConfig(defaultConfig, userConfig) {
    const merged = { ...defaultConfig };
    
    for (const key in userConfig) {
      if (userConfig[key] && typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key])) {
        merged[key] = this.mergeConfig(defaultConfig[key] || {}, userConfig[key]);
      } else {
        merged[key] = userConfig[key];
      }
    }
    
    return merged;
  }

  /**
   * Get configuration value by path
   */
  get(path) {
    const keys = path.split('.');
    let value = this.config;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  /**
   * Set configuration value by path
   */
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = this.config;
    
    // Navigate to the parent object
    for (const key of keys) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      target = target[key];
    }
    
    // Set the value
    const oldValue = target[lastKey];
    target[lastKey] = value;
    
    // Notify listeners
    this.notifyListeners(path, value, oldValue);
    
    return true;
  }

  /**
   * Get full configuration
   */
  getAll() {
    return { ...this.config };
  }

  /**
   * Update multiple configuration values
   */
  update(updates) {
    const changes = [];
    
    for (const [path, value] of Object.entries(updates)) {
      const oldValue = this.get(path);
      this.set(path, value);
      changes.push({ path, value, oldValue });
    }
    
    return changes;
  }

  /**
   * Reset configuration to defaults
   */
  reset() {
    this.config = { ...DEFAULT_CONFIG };
    this.notifyListeners('*', this.config, null);
  }

  /**
   * Load configuration from localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('kali-dashboard-ai-config');
      if (stored) {
        const parsedConfig = JSON.parse(stored);
        this.config = this.mergeConfig(DEFAULT_CONFIG, parsedConfig);
        this.notifyListeners('*', this.config, null);
        return true;
      }
    } catch (error) {
      console.error('Failed to load AI config from storage:', error);
    }
    return false;
  }

  /**
   * Save configuration to localStorage
   */
  saveToStorage() {
    try {
      // Don't save sensitive data like API keys
      const configToSave = this.sanitizeForStorage(this.config);
      localStorage.setItem('kali-dashboard-ai-config', JSON.stringify(configToSave));
      return true;
    } catch (error) {
      console.error('Failed to save AI config to storage:', error);
      return false;
    }
  }

  /**
   * Remove sensitive data before saving
   */
  sanitizeForStorage(config) {
    const sanitized = { ...config };
    
    // Remove API keys and sensitive data
    if (sanitized.openai) {
      sanitized.openai = { ...sanitized.openai };
      delete sanitized.openai.apiKey;
    }
    
    if (sanitized.clayI) {
      sanitized.clayI = { ...sanitized.clayI };
      delete sanitized.clayI.apiKey;
    }
    
    return sanitized;
  }

  /**
   * Validate configuration
   */
  validate() {
    const errors = [];
    
    // Validate router config
    if (!this.config.router.defaultBackend) {
      errors.push('Default backend not specified');
    }
    
    if (!Array.isArray(this.config.router.fallbackOrder)) {
      errors.push('Fallback order must be an array');
    }
    
    // Validate OpenAI config if enabled
    if (this.config.openai.enabled) {
      if (!this.config.openai.apiKey && !process.env.OPENAI_API_KEY) {
        errors.push('OpenAI API key required when OpenAI backend is enabled');
      }
      
      if (!this.config.openai.model) {
        errors.push('OpenAI model not specified');
      }
    }
    
    // Validate security settings
    if (!Array.isArray(this.config.security.commandWhitelist)) {
      errors.push('Command whitelist must be an array');
    }
    
    if (!Array.isArray(this.config.security.commandBlacklist)) {
      errors.push('Command blacklist must be an array');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Add configuration change listener
   */
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of configuration changes
   */
  notifyListeners(path, newValue, oldValue) {
    for (const listener of this.listeners) {
      try {
        listener(path, newValue, oldValue);
      } catch (error) {
        console.error('Error in config listener:', error);
      }
    }
  }

  /**
   * Get backend-specific configuration
   */
  getBackendConfig(backendName) {
    return this.get(backendName) || {};
  }

  /**
   * Check if a backend is enabled
   */
  isBackendEnabled(backendName) {
    return this.get(`${backendName}.enabled`) !== false;
  }

  /**
   * Get available models for a backend
   */
  getAvailableModels(backendName) {
    return this.get(`${backendName}.models`) || [];
  }

  /**
   * Export configuration (for backup/sharing)
   */
  export() {
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      config: this.sanitizeForStorage(this.config)
    };
  }

  /**
   * Import configuration (from backup/sharing)
   */
  import(exportedConfig) {
    try {
      if (exportedConfig.version && exportedConfig.config) {
        this.config = this.mergeConfig(DEFAULT_CONFIG, exportedConfig.config);
        this.notifyListeners('*', this.config, null);
        return true;
      }
    } catch (error) {
      console.error('Failed to import config:', error);
    }
    return false;
  }
}

// Create and export singleton instance
const aiConfig = new AIConfig();

// Load from storage on initialization
aiConfig.loadFromStorage();

export { AIConfig };
export default aiConfig;
