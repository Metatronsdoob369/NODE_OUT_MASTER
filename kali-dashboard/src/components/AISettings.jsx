import { useState, useEffect } from 'react';
import aiConfig from '../services/ai/AIConfig.js';

const AISettings = ({ isOpen, onClose, onSave }) => {
  const [config, setConfig] = useState({});
  const [apiKey, setApiKey] = useState('');
  const [selectedBackend, setSelectedBackend] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load current configuration
      const currentConfig = aiConfig.getAll();
      setConfig(currentConfig);
      setSelectedBackend(currentConfig.router.defaultBackend);
      setSelectedModel(currentConfig.openai.model);
      setTemperature(currentConfig.openai.temperature);
      setMaxTokens(currentConfig.openai.maxTokens);
      
      // Load API key from localStorage
      const storedApiKey = localStorage.getItem('openai-api-key');
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    // Update configuration
    const updates = {
      'router.defaultBackend': selectedBackend,
      'openai.model': selectedModel,
      'openai.temperature': temperature,
      'openai.maxTokens': maxTokens
    };

    aiConfig.update(updates);
    aiConfig.saveToStorage();

    // Save API key separately
    if (apiKey) {
      localStorage.setItem('openai-api-key', apiKey);
    }

    if (onSave) {
      onSave(updates);
    }

    onClose();
  };

  const handleReset = () => {
    aiConfig.reset();
    setConfig(aiConfig.getAll());
    setApiKey('');
    localStorage.removeItem('openai-api-key');
  };

  const availableModels = aiConfig.getAvailableModels('openai');
  const backendStatus = config.router ? Object.keys(config).filter(key => 
    ['openai', 'local', 'clayI'].includes(key)
  ) : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg border border-gray-700 w-96 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-kali-green">AI Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-kali-green focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your API key is stored locally and never sent to our servers
            </p>
          </div>

          {/* Backend Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Default Backend
            </label>
            <select
              value={selectedBackend}
              onChange={(e) => setSelectedBackend(e.target.value)}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-kali-green focus:outline-none"
            >
              <option value="openai">OpenAI GPT-4</option>
              <option value="local" disabled>Local LLM (Coming Soon)</option>
              <option value="clay-i" disabled>Clay-I (Coming Soon)</option>
            </select>
          </div>

          {/* Model Selection */}
          {selectedBackend === 'openai' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                OpenAI Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-kali-green focus:outline-none"
              >
                {availableModels.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.description}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Advanced Settings Toggle */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-kali-green hover:text-green-300 flex items-center"
            >
              {showAdvanced ? '▼' : '▶'} Advanced Settings
            </button>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="space-y-3 pl-4 border-l border-gray-700">
              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Temperature: {temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Higher values make output more creative, lower values more focused
                </p>
              </div>

              {/* Max Tokens */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Tokens
                </label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-kali-green focus:outline-none"
                />
                <p className="text-xs text-gray-500">
                  Maximum length of AI responses
                </p>
              </div>
            </div>
          )}

          {/* Backend Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Backend Status
            </label>
            <div className="space-y-1">
              {backendStatus.map(backend => {
                const isEnabled = aiConfig.isBackendEnabled(backend);
                return (
                  <div key={backend} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300 capitalize">{backend}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      isEnabled ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700">
          <button
            onClick={handleReset}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Reset to Defaults
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-kali-green text-black rounded text-sm font-semibold hover:bg-green-400"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettings;
