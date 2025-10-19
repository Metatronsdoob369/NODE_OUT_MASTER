import BaseAIBackend from './BaseAIBackend.js';
import { generateContextPrompt, formatResponse } from '../prompts/SecurityPrompts.js';

/**
 * OpenAI GPT-4 Backend Implementation
 * Handles communication with OpenAI API for AI-powered cybersecurity assistance
 */
class OpenAIBackend extends BaseAIBackend {
  constructor(config = {}) {
    super(config);
    this.name = 'OpenAI GPT-4';
    this.type = 'cloud';
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    this.baseURL = config.baseURL || 'https://api.openai.com/v1';
    this.model = config.model || 'gpt-4';
    this.maxRetries = config.maxRetries || 3;
    this.timeout = config.timeout || 30000;
    this.conversationHistory = new Map(); // Store conversation history by session
  }

  /**
   * Initialize the OpenAI backend
   */
  async initialize() {
    try {
      if (!this.apiKey) {
        console.warn('OpenAI API key not provided');
        return false;
      }

      // Test API connection
      const isAvailable = await this.checkAvailability();
      this.isAvailable = isAvailable;
      
      if (isAvailable) {
        console.log('OpenAI backend initialized successfully');
      }
      
      return isAvailable;
    } catch (error) {
      console.error('Failed to initialize OpenAI backend:', error);
      this.isAvailable = false;
      return false;
    }
  }

  /**
   * Check if OpenAI API is available
   */
  async checkAvailability() {
    if (!this.apiKey) {
      return false;
    }

    try {
      const response = await this.makeAPIRequest('/models', {
        method: 'GET'
      });

      return response.ok;
    } catch (error) {
      console.error('OpenAI availability check failed:', error);
      return false;
    }
  }

  /**
   * Send message to OpenAI API
   */
  async sendMessage(message, context = {}, options = {}) {
    if (!this.isAvailable) {
      throw new Error('OpenAI backend is not available');
    }

    try {
      const sessionId = context.sessionId || 'default';
      const systemPrompt = generateContextPrompt(
        context.tool || 'general',
        context.subContext || 'general',
        context.data || {}
      );

      // Get or create conversation history
      if (!this.conversationHistory.has(sessionId)) {
        this.conversationHistory.set(sessionId, []);
      }
      const history = this.conversationHistory.get(sessionId);

      // Prepare messages for API
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message }
      ];

      // Limit conversation history to prevent token overflow
      const maxHistoryLength = options.maxHistory || 10;
      if (messages.length > maxHistoryLength + 1) { // +1 for system message
        messages.splice(1, messages.length - maxHistoryLength - 1);
      }

      const requestBody = {
        model: options.model || this.model,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0
      };

      const response = await this.makeAPIRequest('/chat/completions', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'No response generated';

      // Update conversation history
      history.push(
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      );

      // Limit history size
      if (history.length > maxHistoryLength * 2) {
        history.splice(0, 2); // Remove oldest user-assistant pair
      }

      return {
        message: aiResponse,
        metadata: {
          model: data.model,
          usage: data.usage,
          finishReason: data.choices[0]?.finish_reason,
          timestamp: new Date(),
          sessionId: sessionId,
          context: context
        },
        suggestions: this.extractSuggestions(aiResponse, context),
        commands: this.extractCommands(aiResponse)
      };

    } catch (error) {
      console.error('OpenAI sendMessage error:', error);
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
  }

  /**
   * Make HTTP request to OpenAI API
   */
  async makeAPIRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Extract actionable suggestions from AI response
   */
  extractSuggestions(response, context) {
    const suggestions = [];
    
    // Look for command blocks
    const commandRegex = /```(?:bash|shell)?\n(.*?)\n```/gs;
    let match;
    
    while ((match = commandRegex.exec(response)) !== null) {
      const command = match[1].trim();
      if (command && !command.includes('example') && !command.includes('placeholder')) {
        suggestions.push({
          type: 'command',
          text: `Execute: ${command}`,
          command: command,
          context: context.tool || 'general'
        });
      }
    }

    // Look for specific recommendations
    const recommendationRegex = /(?:recommend|suggest|try|use):\s*([^\n]+)/gi;
    while ((match = recommendationRegex.exec(response)) !== null) {
      const recommendation = match[1].trim();
      if (recommendation.length > 10 && recommendation.length < 100) {
        suggestions.push({
          type: 'recommendation',
          text: recommendation,
          context: context.tool || 'general'
        });
      }
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  /**
   * Extract executable commands from AI response
   */
  extractCommands(response) {
    const commands = [];
    const commandRegex = /```(?:bash|shell)?\n(.*?)\n```/gs;
    let match;
    
    while ((match = commandRegex.exec(response)) !== null) {
      const command = match[1].trim();
      if (command && this.isValidCommand(command)) {
        commands.push({
          command: command,
          type: this.getCommandType(command),
          riskLevel: this.assessCommandRisk(command)
        });
      }
    }

    return commands;
  }

  /**
   * Validate if a command is safe and executable
   */
  isValidCommand(command) {
    // Basic validation - extend as needed
    const dangerousPatterns = [
      /rm\s+-rf\s+\//, // Dangerous rm commands
      /dd\s+if=/, // Disk operations
      /mkfs/, // Format commands
      /shutdown/, // System shutdown
      /reboot/, // System reboot
      /passwd/, // Password changes
      /su\s+/, // User switching
      /sudo\s+su/, // Privilege escalation
    ];

    return !dangerousPatterns.some(pattern => pattern.test(command));
  }

  /**
   * Determine command type
   */
  getCommandType(command) {
    if (command.startsWith('nmap')) return 'nmap';
    if (command.includes('msfconsole') || command.includes('msfvenom')) return 'metasploit';
    if (command.startsWith('curl') || command.startsWith('wget')) return 'web';
    if (command.includes('grep') || command.includes('awk') || command.includes('sed')) return 'analysis';
    return 'general';
  }

  /**
   * Assess command risk level
   */
  assessCommandRisk(command) {
    if (command.includes('-A') || command.includes('--script')) return 'medium';
    if (command.includes('exploit') || command.includes('payload')) return 'high';
    if (command.includes('-sS') || command.includes('-sT')) return 'low';
    return 'low';
  }

  /**
   * Get backend capabilities
   */
  getCapabilities() {
    return {
      streaming: false,
      toolIntegration: true,
      contextMemory: true,
      fileAnalysis: true,
      codeGeneration: true,
      maxTokens: 8192,
      supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      specialties: ['cybersecurity', 'penetration-testing', 'network-analysis', 'vulnerability-assessment']
    };
  }

  /**
   * Clear conversation history for a session
   */
  clearHistory(sessionId = 'default') {
    this.conversationHistory.delete(sessionId);
  }

  /**
   * Get conversation history for a session
   */
  getHistory(sessionId = 'default') {
    return this.conversationHistory.get(sessionId) || [];
  }

  /**
   * Clean up resources
   */
  async cleanup() {
    this.conversationHistory.clear();
  }
}

export default OpenAIBackend;
