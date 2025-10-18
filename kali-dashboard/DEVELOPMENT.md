# 🚀 Development Setup Guide

## Hot-Reload Development Environment

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Quick Start

```bash
# Navigate to the Kali Dashboard
cd kali-dashboard

# Install dependencies
npm install

# Start development server with hot-reload
npm run dev

# Open in browser
open http://localhost:5173
```

### 🔥 Hot-Reload Features

The development server includes:
- **Instant Updates**: Changes reflect immediately in browser
- **Component Hot Reload**: React components update without losing state
- **CSS Hot Reload**: Style changes apply instantly
- **Error Overlay**: Development errors shown in browser
- **Fast Refresh**: Preserves component state during edits

### 🛠️ Development Commands

```bash
# Development server (hot-reload enabled)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking (if using TypeScript)
npm run type-check
```

### 📁 Project Structure

```
kali-dashboard/
├── src/
│   ├── components/           # Reusable components
│   │   ├── ProxyControl.jsx     # 🚫 Proxy blocking interface
│   │   ├── QuickScanTools.jsx   # ⚡ Network scanning tools
│   │   └── SecurityMonitoring.jsx # 🛡️ Real-time threat detection
│   ├── pages/
│   │   ├── SecurityCenter.jsx   # 🔒 Main security dashboard
│   │   ├── Dashboard.jsx        # 📊 Overview dashboard
│   │   ├── NmapScanner.jsx      # 🔍 Network scanner
│   │   ├── MetasploitConsole.jsx # 💥 Exploit framework
│   │   └── Terminal.jsx         # 💻 Terminal emulator
│   ├── contexts/            # React Context providers
│   └── App.jsx             # Main application
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

### 🎯 New Security Features Added

#### 1. **Proxy Control Center** (`/security` → Proxy Control tab)
- **Block/Unblock Proxy**: Control network proxy access
- **Emergency Lockdown**: Instant network isolation
- **Real-time Status**: Live proxy monitoring
- **Activity Logs**: Track all proxy actions

#### 2. **Quick Scan Tools** (`/security` → Quick Scan Tools tab)
- **Port Scanning**: TCP port discovery
- **Vulnerability Detection**: CVE scanning
- **Network Discovery**: Host enumeration  
- **Service Detection**: Running service identification
- **Progress Tracking**: Real-time scan progress
- **Results Export**: Detailed scan reports

#### 3. **Security Monitoring** (`/security` → Security Monitoring tab)
- **Real-time Threat Detection**: Live security alerts
- **Threat Classification**: Critical/High/Medium/Low severity
- **Automated Response**: Block/ignore threats
- **Alert Dashboard**: Centralized security notifications
- **System Status**: Overall security posture

### 🔧 Adding New Features

#### Adding a New Security Tool

1. **Create Component**:
```bash
# Create new component file
touch src/components/MySecurityTool.jsx
```

2. **Component Template**:
```jsx
import { useState, useEffect } from 'react';

const MySecurityTool = () => {
  const [status, setStatus] = useState('idle');
  
  const handleAction = async () => {
    setStatus('running');
    // Your security tool logic here
    setTimeout(() => setStatus('completed'), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-kali-green mb-4">
        🔧 My Security Tool
      </h2>
      
      <button
        onClick={handleAction}
        disabled={status === 'running'}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg"
      >
        {status === 'running' ? 'Running...' : 'Start Tool'}
      </button>
    </div>
  );
};

export default MySecurityTool;
```

3. **Add to Security Center**:
```jsx
// In src/pages/SecurityCenter.jsx
import MySecurityTool from '../components/MySecurityTool';

// Add to tabs array
{
  id: 'mytool',
  name: 'My Tool',
  icon: '🔧',
  component: MySecurityTool
}
```

### 🎨 Styling Guidelines

- **Colors**: Use Kali Linux theme colors
  - `text-kali-green`: Primary green (#00ff41)
  - `bg-gray-900`: Dark backgrounds
  - `border-gray-700`: Subtle borders
  - `text-red-400`: Error/critical states
  - `text-yellow-400`: Warning states

- **Components**: Follow existing patterns
  - Rounded corners: `rounded-lg`
  - Padding: `p-4` or `p-6`
  - Spacing: `space-y-4` or `space-x-4`
  - Transitions: `transition-all duration-200`

### 🔄 Hot-Reload Workflow

1. **Start Development Server**:
```bash
npm run dev
```

2. **Make Changes**: Edit any file in `src/`

3. **See Instant Updates**: Browser automatically refreshes

4. **Debug**: Use browser dev tools + React DevTools

### 🚀 Production Build

```bash
# Build optimized production bundle
npm run build

# Serve production build locally
npm run preview

# Deploy dist/ folder to your server
```

### 🐛 Troubleshooting

#### Hot-Reload Not Working
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3001
```

#### Build Errors
```bash
# Check for linting issues
npm run lint

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### 📦 Adding Dependencies

```bash
# Add new package
npm install package-name

# Add dev dependency
npm install -D package-name

# Update package.json and restart dev server
npm run dev
```

### 🔐 Security Best Practices

- **Input Validation**: Always validate user inputs
- **XSS Prevention**: Use React's built-in XSS protection
- **API Security**: Implement proper authentication
- **Error Handling**: Don't expose sensitive information
- **HTTPS**: Use HTTPS in production

---

**Happy Coding! 🎉** Your secure dashboard is ready for development with instant hot-reload capabilities!
