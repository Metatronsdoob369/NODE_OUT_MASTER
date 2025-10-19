import OpenAIBackend from './backends/OpenAIBackend.js';

/**
 * AI Router - Manages multiple AI backends and routes requests intelligently
 * Handles backend selection, fallback mechanisms, and request routing
 */
class AIRouter {
  constructor(config = {}) {
    this.config = config;
    this.backends = new Map();
    this.defaultBackend = config.defaultBackend || 'openai';
    this.fallbackOrder = config.fallbackOrder || ['openai', 'local', 'clay-i'];
    this.initialized = false;
    this.routingRules = config.routingRules || {};
  }

  /**
   * Initialize the AI router and all backends
   */
  async initialize() {
    try {
      console.log('Initializing AI Router...');

      // Initialize OpenAI backend
      if (this.config.openai?.enabled !== false) {
        const openaiBackend = new OpenAIBackend(this.config.openai || {});
        await openaiBackend.initialize();
        this.backends.set('openai', openaiBackend);
        console.log('OpenAI backend registered');
      }

      // TODO: Initialize other backends
      // Local LLM backend will be added in Phase 3
      // Clay-I backend will be added in Phase 5

      this.initialized = true;
      console.log('AI Router initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize AI Router:', error);
      return false;
    }
  }

  /**
   * Route a message to the appropriate AI backend
   */
  async sendMessage(message, context = {}, options = {}) {
    if (!this.initialized) {
      throw new Error('AI Router not initialized');
    }

    const selectedBackend = this.selectBackend(context, options);
    
    try {
      const backend = this.backends.get(selectedBackend);
      if (!backend || !backend.isAvailable) {
        throw new Error(`Backend ${selectedBackend} not available`);
      }

      console.log(`Routing message to ${selectedBackend} backend`);
      const response = await backend.sendMessage(message, context, options);
      
      return {
        ...response,
        backend: selectedBackend,
        routingInfo: {
          selectedBackend,
          availableBackends: this.getAvailableBackends(),
          routingReason: this.getRoutingReason(context, options)
        }
      };
    } catch (error) {
      console.error(`Error with ${selectedBackend} backend:`, error);
      
      // Try fallback backends
      return await this.tryFallbackBackends(message, context, options, selectedBackend);
    }
  }

  /**
   * Select the best backend for the request
   */
  selectBackend(context = {}, options = {}) {
    // User-specified backend takes priority
    if (options.backend && this.backends.has(options.backend)) {
      const backend = this.backends.get(options.backend);
      if (backend.isAvailable) {
        return options.backend;
      }
    }

    // Apply routing rules based on context
    const ruleBasedBackend = this.applyRoutingRules(context);
    if (ruleBasedBackend) {
      return ruleBasedBackend;
    }

    // Use default backend if available
    if (this.backends.has(this.defaultBackend)) {
      const backend = this.backends.get(this.defaultBackend);
      if (backend.isAvailable) {
        return this.defaultBackend;
      }
    }

    // Find first available backend
    for (const [name, backend] of this.backends) {
      if (backend.isAvailable) {
        return name;
      }
    }

    throw new Error('No available AI backends');
  }

  /**
   * Apply routing rules based on context
   */
  applyRoutingRules(context) {
    const { tool, privacy, complexity, speed } = context;

    // Privacy-focused requests go to local backends
    if (privacy === 'high' && this.backends.has('local')) {
      const localBackend = this.backends.get('local');
      if (localBackend?.isAvailable) {
        return 'local';
      }
    }

    // Complex analysis goes to most capable backend
    if (complexity === 'high' && this.backends.has('openai')) {
      const openaiBackend = this.backends.get('openai');
      if (openaiBackend?.isAvailable) {
        return 'openai';
      }
    }

    // Memory-intensive tasks go to Clay-I
    if (context.requiresMemory && this.backends.has('clay-i')) {
      const clayiBackend = this.backends.get('clay-i');
      if (clayiBackend?.isAvailable) {
        return 'clay-i';
      }
    }

    // Tool-specific routing
    if (tool) {
      const toolBackend = this.routingRules[tool];
      if (toolBackend && this.backends.has(toolBackend)) {
        const backend = this.backends.get(toolBackend);
        if (backend?.isAvailable) {
          return toolBackend;
        }
      }
    }

    return null;
  }

  /**
   * Try fallback backends when primary fails
   */
  async tryFallbackBackends(message, context, options, failedBackend) {
    const availableBackends = this.fallbackOrder.filter(name => 
      name !== failedBackend && 
      this.backends.has(name) && 
      this.backends.get(name).isAvailable
    );

    for (const backendName of availableBackends) {
      try {
        console.log(`Trying fallback backend: ${backendName}`);
        const backend = this.backends.get(backendName);
        const response = await backend.sendMessage(message, context, options);
        
        return {
          ...response,
          backend: backendName,
          routingInfo: {
            selectedBackend: backendName,
            failedBackend: failedBackend,
            availableBackends: this.getAvailableBackends(),
            routingReason: 'fallback'
          }
        };
      } catch (error) {
        console.error(`Fallback backend ${backendName} also failed:`, error);
        continue;
      }
    }

    throw new Error('All AI backends failed');
  }

  /**
   * Get list of available backends
   */
  getAvailableBackends() {
    const available = [];
    for (const [name, backend] of this.backends) {
      if (backend.isAvailable) {
        available.push({
          name: name,
          type: backend.type,
          capabilities: backend.getCapabilities()
        });
      }
    }
    return available;
  }

  /**
   * Get backend status information
   */
  getBackendStatus() {
    const status = {};
    for (const [name, backend] of this.backends) {
      status[name] = backend.getStatus();
    }
    return status;
  }

  /**
   * Get routing reason for debugging
   */
  getRoutingReason(context, options) {
    if (options.backend) return `User specified: ${options.backend}`;
    if (context.privacy === 'high') return 'Privacy requirements';
    if (context.complexity === 'high') return 'High complexity task';
    if (context.requiresMemory) return 'Memory requirements';
    if (context.tool) return `Tool-specific: ${context.tool}`;
    return 'Default routing';
  }

  /**
   * Add a new backend
   */
  async addBackend(name, backend) {
    try {
      await backend.initialize();
      this.backends.set(name, backend);
      console.log(`Backend ${name} added successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to add backend ${name}:`, error);
      return false;
    }
  }

  /**
   * Remove a backend
   */
  async removeBackend(name) {
    const backend = this.backends.get(name);
    if (backend) {
      await backend.cleanup();
      this.backends.delete(name);
      console.log(`Backend ${name} removed`);
      return true;
    }
    return false;
  }

  /**
   * Update backend configuration
   */
  async updateBackendConfig(name, config) {
    const backend = this.backends.get(name);
    if (backend) {
      backend.config = { ...backend.config, ...config };
      await backend.initialize(); // Re-initialize with new config
      return true;
    }
    return false;
  }

  /**
   * Check health of all backends
   */
  async healthCheck() {
    const health = {};
    
    for (const [name, backend] of this.backends) {
      try {
        const isAvailable = await backend.checkAvailability();
        health[name] = {
          available: isAvailable,
          status: backend.getStatus(),
          lastCheck: new Date()
        };
      } catch (error) {
        health[name] = {
          available: false,
          error: error.message,
          lastCheck: new Date()
        };
      }
    }

    return health;
  }

  /**
   * Get backend by name
   */
  getBackend(name) {
    return this.backends.get(name);
  }

  /**
   * Set default backend
   */
  setDefaultBackend(name) {
    if (this.backends.has(name)) {
      this.defaultBackend = name;
      return true;
    }
    return false;
  }

  /**
   * Clean up all backends
   */
  async cleanup() {
    for (const [name, backend] of this.backends) {
      try {
        await backend.cleanup();
      } catch (error) {
        console.error(`Error cleaning up backend ${name}:`, error);
      }
    }
    this.backends.clear();
    this.initialized = false;
  }
}

export default AIRouter;
