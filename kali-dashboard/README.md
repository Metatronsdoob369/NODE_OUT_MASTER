# Kali Linux Control Panel Dashboard

A professional, production-ready React application that provides a comprehensive control panel interface for Kali Linux penetration testing tools. Built with React 18, Tailwind CSS 3.4+, and featuring a dark cyberpunk theme with Kali green accents.

![Kali Dashboard](https://img.shields.io/badge/Kali-Dashboard-00ff41?style=for-the-badge&logo=kalilinux&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38b2ac?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.1.0-646cff?style=for-the-badge&logo=vite&logoColor=white)

## 🚀 Features

### Core Modules
- **📊 Dashboard Overview**: Real-time system metrics, activity timeline, vulnerability heatmap
- **🔍 Nmap Scanner**: Interactive network scanning with progress tracking and results export
- **💥 Metasploit Console**: Full exploit framework interface with module search and session management
- **💻 Terminal Emulator**: Mock bash terminal with command history and tab completion

### Design & UX
- **🌙 Dark Cyberpunk Theme**: Professional Kali Linux aesthetic with green/cyan accents
- **📱 Responsive Design**: Mobile-first approach with collapsible sidebar
- **⚡ Real-time Updates**: Live progress tracking and notifications
- **🎨 Custom Animations**: Glow effects, scanning animations, terminal cursor blinking
- **♿ Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Technical Features
- **🔄 State Management**: Centralized state with React Context + useReducer
- **🛡️ Security**: Input validation, XSS prevention, AbortController for async operations
- **📦 Zero External Dependencies**: Pure React + Tailwind implementation
- **🎯 Mock APIs**: Realistic data simulation for all security tools
- **📊 Data Visualization**: SVG-based charts and progress indicators

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd kali-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Commands

```bash
# Development server with hot reload
npm run dev

# Type checking and linting
npm run lint

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

## 🏗️ Architecture

### Project Structure
```
kali-dashboard/
├── public/
│   ├── kali-icon.svg          # Custom Kali Linux icon
│   └── index.html             # HTML template
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Auth/             # Authentication components
│   │   ├── Dashboard/        # Dashboard-specific components
│   │   └── Layout/           # Layout components (Header, Sidebar, Footer)
│   ├── contexts/             # React Context providers
│   │   └── AppContext.jsx    # Global state management
│   ├── pages/                # Main page components
│   │   ├── Dashboard.jsx     # Overview dashboard
│   │   ├── NmapScanner.jsx   # Network scanning interface
│   │   ├── MetasploitConsole.jsx # Exploit framework console
│   │   └── Terminal.jsx      # Terminal emulator
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles and Tailwind imports
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.js            # Vite build configuration
└── package.json              # Project dependencies and scripts
```

### State Management
The application uses React Context with useReducer for centralized state management:

- **User State**: Authentication, preferences, theme
- **System State**: Active scans, sessions, notifications
- **UI State**: Sidebar collapse, modal states, loading states

### Component Architecture
- **Functional Components**: All components use React hooks
- **Custom Hooks**: Reusable logic extraction
- **Context Providers**: Global state access
- **Error Boundaries**: Graceful error handling

## 🎨 Customization

### Theme Configuration
The Tailwind configuration includes custom Kali Linux colors:

```javascript
// tailwind.config.js
colors: {
  'kali-green': '#00ff41',
  'kali-cyan': '#00ffff',
  'kali-dark': '#0a0a0a',
  'kali-gray': {
    // Custom gray scale
  }
}
```

### Adding New Tools
To add a new security tool:

1. Create a new page component in `src/pages/`
2. Add routing in `src/App.jsx`
3. Update sidebar navigation in `src/components/Layout/Sidebar.jsx`
4. Implement mock API calls and state management

### Custom Animations
The application includes custom CSS animations:

- `animate-glow`: Pulsing glow effect
- `animate-scan`: Scanning line animation  
- `animate-terminal-blink`: Terminal cursor blinking

## 🔧 Configuration

### Environment Variables
Create a `.env` file for environment-specific configuration:

```env
VITE_APP_TITLE=Kali Dashboard
VITE_API_BASE_URL=http://localhost:3001
VITE_ENABLE_MOCK_DATA=true
```

### Build Configuration
The Vite configuration supports:

- Hot module replacement in development
- Optimized production builds
- Source maps for debugging
- Asset optimization and compression

## 🚀 Deployment

### Production Build
```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deployment Options

#### Static Hosting (Netlify, Vercel)
```bash
# Build the project
npm run build

# Deploy the dist/ directory
```

#### Docker Deployment
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Server Deployment
```bash
# Install serve globally
npm install -g serve

# Serve the built application
serve -s dist -l 3000
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] All navigation links work correctly
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Dark theme consistency across all components
- [ ] Form validation and error handling
- [ ] Mock API responses and loading states
- [ ] Keyboard navigation and accessibility
- [ ] Terminal command execution and history
- [ ] Scan progress simulation and results display

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

### Development Guidelines
1. Follow React best practices and hooks patterns
2. Use Tailwind CSS classes for styling (no custom CSS)
3. Implement proper error handling and loading states
4. Add TypeScript types for better development experience
5. Write descriptive commit messages

### Code Style
- Use functional components with hooks
- Implement proper prop validation
- Follow consistent naming conventions
- Add comments for complex logic
- Use semantic HTML elements

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Kali Linux Team**: For the amazing penetration testing distribution
- **React Team**: For the excellent frontend framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Vite**: For the fast build tool and development server

## 📞 Support

For support, questions, or feature requests:

1. Check the [Issues](../../issues) page for existing discussions
2. Create a new issue with detailed information
3. Follow the issue template for bug reports or feature requests

---

**Built with ❤️ for the cybersecurity community**
