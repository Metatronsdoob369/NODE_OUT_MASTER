/**
 * Base AI Backend Interface
 * Abstract class that all AI backends must implement
 */
class BaseAIBackend {
  constructor(config = {}) {
    this.config = config;
    this.isAvailable = false;
    this.name = 'base';
    this.type = 'unknown';
  }

  /**
   * Initialize the backend
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    throw new Error('initialize() must be implemented by subclass');
  }

  /**
   * Check if the backend is available and ready
   * @returns {Promise<boolean>} Availability status
   */
  async checkAvailability() {
    throw new Error('checkAvailability() must be implemented by subclass');
  }

  /**
   * Send a message to the AI backend
   * @param {string} message - The user message
   * @param {Object} context - Context information (tool, data, history)
   * @param {Object} options - Additional options (temperature, max_tokens, etc.)
   * @returns {Promise<Object>} Response object with message, metadata, etc.
   */
  async sendMessage(message, context = {}, options = {}) {
    throw new Error('sendMessage() must be implemented by subclass');
  }

  /**
   * Get backend capabilities
   * @returns {Object} Capabilities object
   */
  getCapabilities() {
    return {
      streaming: false,
      toolIntegration: false,
      contextMemory: false,
      fileAnalysis: false,
      codeGeneration: false,
      maxTokens: 4096,
      supportedLanguages: ['en']
    };
  }

  /**
   * Get backend status and health
   * @returns {Object} Status object
   */
  getStatus() {
    return {
      name: this.name,
      type: this.type,
      available: this.isAvailable,
      lastCheck: new Date(),
      config: this.getPublicConfig()
    };
  }

  /**
   * Get public configuration (without sensitive data)
   * @returns {Object} Public config
   */
  getPublicConfig() {
    const { apiKey, ...publicConfig } = this.config;
    return {
      ...publicConfig,
      hasApiKey: !!apiKey
    };
  }

  /**
   * Clean up resources
   */
  async cleanup() {
    // Override in subclasses if needed
  }
}

export default BaseAIBackend;
