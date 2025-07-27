import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import { checkServerStatus, triggerNodeExperience, playNodeDemo } from '../lib/nodeApi';
// Animated 3D Clay-I Visualization Component
function ClayICore() {
    const meshRef = useRef(null);
    const [hovered, setHovered] = useState(false);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
            meshRef.current.rotation.y += 0.01;
        }
    });
    return (_jsx(Sphere, { ref: meshRef, args: [1, 64, 64], scale: hovered ? 1.1 : 1, onPointerOver: () => setHovered(true), onPointerOut: () => setHovered(false), children: _jsx(MeshDistortMaterial, { color: hovered ? "#e2e8f0" : "#64748b", attach: "material", distort: 0.4, speed: 2, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.6 }) }));
}
function GlassPanel({ title, description, icon, position, delay }) {
    const [isHovered, setIsHovered] = useState(false);
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 50, rotateX: -15 }, animate: { opacity: 1, y: 0, rotateX: 0 }, transition: { duration: 0.8, delay }, style: {
            position: 'absolute',
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: `translateZ(${position.z}px)`,
        }, className: `
        relative w-72 h-48 p-6 rounded-2xl cursor-pointer
        backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5
        border border-white/20 shadow-2xl
        transition-all duration-500 ease-out
        ${isHovered
            ? 'scale-105 shadow-slate-400/25 border-slate-300/40 bg-gradient-to-br from-slate-600/20 to-slate-700/10'
            : 'hover:scale-102 hover:shadow-white/20'}
      `, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [_jsx("div", { className: `
        absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500
        ${isHovered ? 'opacity-100' : ''}
        bg-gradient-to-r from-slate-500/10 via-slate-600/10 to-slate-500/10
        blur-xl
      ` }), _jsxs("div", { className: "relative z-10 flex flex-col h-full", children: [_jsx("div", { className: `
          w-12 h-12 mb-4 rounded-xl flex items-center justify-center
          transition-all duration-300
          ${isHovered
                            ? 'bg-slate-600/30 shadow-slate-400/50 shadow-lg'
                            : 'bg-white/10'}
        `, children: icon }), _jsx("h3", { className: `
          text-xl font-bold mb-2 transition-colors duration-300
          ${isHovered ? 'text-slate-200' : 'text-white'}
        `, children: title }), _jsx("p", { className: "text-gray-300 text-sm leading-relaxed flex-1", children: description }), _jsxs("div", { className: "flex justify-between items-center mt-4", children: [_jsx("div", { className: `
            px-3 py-1 rounded-full text-xs font-medium
            transition-all duration-300
            ${isHovered
                                    ? 'bg-slate-600/20 text-slate-300 border border-slate-400/30'
                                    : 'bg-white/10 text-gray-400'}
          `, children: "Enterprise Grade" }), _jsx(motion.div, { animate: { rotate: isHovered ? 360 : 0 }, transition: { duration: 0.5 }, className: `
              w-8 h-8 rounded-full border-2 flex items-center justify-center
              transition-colors duration-300
              ${isHovered
                                    ? 'border-slate-400 text-slate-300'
                                    : 'border-white/30 text-white/50'}
            `, children: "\u2192" })] })] })] }));
}
// Main Landing Page Component
export default function NodeLanding() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [serverStatus, setServerStatus] = useState('checking');
    const [isPlayingDemo, setIsPlayingDemo] = useState(false);
    const [apiError, setApiError] = useState(null);
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    // Check Clay-I server status on component mount
    useEffect(() => {
        const checkStatus = async () => {
            const result = await checkServerStatus();
            setServerStatus(result.success ? 'online' : 'offline');
            if (!result.success) {
                setApiError(result.error || 'Server unavailable');
            }
        };
        checkStatus();
        // Check status every 30 seconds
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, []);
    // Handle NODE Experience Demo
    const handleExperienceDemo = async () => {
        if (isPlayingDemo)
            return;
        setIsPlayingDemo(true);
        setApiError(null);
        try {
            const result = await triggerNodeExperience();
            if (!result.success) {
                throw new Error(result.error);
            }
        }
        catch (error) {
            setApiError(error instanceof Error ? error.message : 'Demo failed');
        }
        finally {
            setIsPlayingDemo(false);
        }
    };
    // Handle Book Demo (Quick NODE demo)
    const handleBookDemo = async () => {
        if (isPlayingDemo)
            return;
        setIsPlayingDemo(true);
        setApiError(null);
        try {
            const result = await playNodeDemo();
            if (!result.success) {
                throw new Error(result.error);
            }
        }
        catch (error) {
            setApiError(error instanceof Error ? error.message : 'Demo failed');
        }
        finally {
            setIsPlayingDemo(false);
        }
    };
    const panels = [
        {
            title: "Voice Intelligence",
            description: "ElevenLabs-powered voice agents with sophisticated conversation flows for seamless client interactions.",
            icon: _jsx("div", { className: "w-6 h-6 border border-white/30 rounded" }),
            position: { x: 15, y: 25, z: 50 },
            delay: 0.2
        },
        {
            title: "Automation Engine",
            description: "n8n workflows orchestrating complex business processes with zero human intervention required.",
            icon: _jsx("div", { className: "w-6 h-6 border border-white/30 rounded-full" }),
            position: { x: 70, y: 20, z: 30 },
            delay: 0.4
        },
        {
            title: "Real Estate Integration",
            description: "Direct pipeline to real estate agents with intelligent lead qualification and priority routing.",
            icon: _jsx("div", { className: "w-6 h-6 border border-white/30 rounded-sm" }),
            position: { x: 20, y: 65, z: 40 },
            delay: 0.6
        },
        {
            title: "Intelligence Network",
            description: "Clay-I powered multi-agent system with advanced pattern recognition and predictive analytics.",
            icon: _jsx("div", { className: "w-6 h-6 border-2 border-white/30 rounded" }),
            position: { x: 65, y: 70, z: 20 },
            delay: 0.8
        }
    ];
    return (_jsxs("div", { className: "relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900", children: [_jsx("div", { className: "absolute inset-0 opacity-30", style: {
                    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(148, 163, 184, 0.15) 0%, transparent 50%)`
                } }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-800/10 via-transparent to-slate-700/10" }), _jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-600/5 via-transparent to-transparent" }), _jsxs("div", { className: "relative z-10 min-h-screen flex flex-col", children: [_jsx(motion.header, { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1 }, className: "relative p-6", children: _jsxs("nav", { className: "max-w-7xl mx-auto flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center font-bold text-white text-xl", children: "N" }), _jsx("div", { className: "text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent", children: "NODE OUT" })] }), _jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: handleBookDemo, disabled: isPlayingDemo || serverStatus === 'offline', className: `
                px-6 py-3 rounded-2xl font-medium shadow-lg transition-all duration-300
                ${isPlayingDemo || serverStatus === 'offline'
                                        ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-slate-500/25 hover:shadow-slate-500/40'}
              `, children: isPlayingDemo ? 'Playing Demo...' : 'Book Demo' })] }) }), _jsxs("main", { className: "flex-1 relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("div", { className: "w-96 h-96 relative", children: [_jsxs(Canvas, { camera: { position: [0, 0, 5], fov: 45 }, children: [_jsx("ambientLight", { intensity: 0.5 }), _jsx("pointLight", { position: [10, 10, 10], intensity: 1, color: "#e2e8f0" }), _jsx("pointLight", { position: [-10, -10, -10], intensity: 0.5, color: "#64748b" }), _jsx(ClayICore, {}), _jsx(OrbitControls, { enableZoom: false, autoRotate: true, autoRotateSpeed: 0.5 })] }), _jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1, delay: 1 }, className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: _jsxs("div", { className: "text-center backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10", children: [_jsx("h1", { className: "text-6xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4", children: "NODE OUT" }), _jsxs("p", { className: "text-xl text-gray-300 max-w-md mx-auto leading-relaxed", children: ["Luxury White Glove SaaS", _jsx("br", {}), _jsx("span", { className: "text-slate-300", children: "Enterprise AI Automation" }), _jsx("br", {}), "for Roofing Professionals"] })] }) })] }) }), _jsx("div", { className: "absolute inset-0 pointer-events-none", children: panels.map((panel, index) => (_jsx("div", { className: "pointer-events-auto", children: _jsx(GlassPanel, { ...panel }) }, index))) }), _jsx(motion.div, { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: 1.2 }, className: "absolute bottom-8 left-1/2 transform -translate-x-1/2", children: _jsxs("div", { className: "flex items-center space-x-4 backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10", children: [_jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: handleExperienceDemo, disabled: isPlayingDemo || serverStatus === 'offline', className: `
                  px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300
                  ${isPlayingDemo || serverStatus === 'offline'
                                                ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-slate-500/25 hover:shadow-slate-500/40'}
                `, children: isPlayingDemo ? 'Generating Experience...' : 'Experience NODE OUT' }), _jsxs("div", { className: "text-gray-400 text-sm", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("div", { className: `w-2 h-2 rounded-full ${serverStatus === 'online' ? 'bg-green-400' :
                                                                serverStatus === 'offline' ? 'bg-red-400' : 'bg-yellow-400'}` }), _jsxs("span", { children: ["Clay-I ", serverStatus === 'checking' ? 'Connecting...' : serverStatus] })] }), "Enterprise-grade AI automation", _jsx("br", {}), _jsx("span", { className: "text-slate-300", children: serverStatus === 'online' ? 'Ready in minutes' : 'Connecting to services...' }), apiError && (_jsx("div", { className: "text-red-400 text-xs mt-1", children: apiError }))] })] }) })] })] })] }));
}
