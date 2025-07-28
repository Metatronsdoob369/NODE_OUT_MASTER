import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, onSnapshot, setDoc, query, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { ArrowRight, ShieldCheck, ShieldAlert, ShieldX, Cpu, GitBranch, PlusCircle, Users, Layers, AlertTriangle, CheckCircle, XCircle, Bot, UploadCloud, Bell, Sparkles, CheckSquare, FileText, Lightbulb, ChevronsUpDown } from 'lucide-react';

// --- DIGITAL FOREST STYLING SYSTEM ---
const DIGITAL_FOREST_STYLES = `
/* ==============================================
   GUARDIAN DIGITAL FOREST TYPOGRAPHY SYSTEM
   ============================================== */

/* Font Imports - Modern Geometric Sans */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* Digital Forest Color Palette */
:root {
  --forest-deep: #0a1a0f;
  --forest-canopy: #1a2f20;
  --forest-moss: #2d4a35;
  --forest-emerald: #3d6b4a;
  --forest-sage: #5a8a67;
  --guardian-mint: #7bc299;
  --phosphor-lime: #a8f5c4;
  --bio-spark: #d4ffdc;
  --forest-gradient: linear-gradient(135deg, var(--forest-deep) 0%, var(--forest-emerald) 50%, var(--guardian-mint) 100%);
}

/* ==============================================
   TYPOGRAPHY HIERARCHY
   ============================================== */

/* Main Headers - Forest Authority */
.guardian-title {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 800;
  font-size: 2rem;
  color: white;
  text-shadow: 0 0 20px rgba(124, 194, 153, 0.3);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

/* System Core Headers - Organic Edge-Lighting */
.guardian-core-header {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--bio-spark);
  text-shadow: 
    0 0 10px rgba(212, 255, 220, 0.4),
    0 0 20px rgba(124, 194, 153, 0.2);
  letter-spacing: -0.01em;
  transition: all 0.4s ease;
}

.guardian-core-header:hover {
  text-shadow: 
    0 0 15px rgba(212, 255, 220, 0.6),
    0 0 30px rgba(124, 194, 153, 0.3);
}

/* Subsection Headers - Sage Sophistication */
.guardian-section-header {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--phosphor-lime);
  text-shadow: 0 0 8px rgba(168, 245, 196, 0.3);
  letter-spacing: -0.005em;
}

/* Data Values - Living Numbers */
.guardian-data-value {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--guardian-mint);
  filter: drop-shadow(0 0 12px rgba(124, 194, 153, 0.5));
  transition: all 0.3s ease;
}

/* Status Text - Breathing Life */
.guardian-status {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.25rem;
  animation: gentle-pulse 4s ease-in-out infinite;
}

.guardian-status.healthy {
  color: var(--phosphor-lime);
  text-shadow: 0 0 12px rgba(168, 245, 196, 0.4);
}

.guardian-status.caution {
  color: #fbbf24;
  text-shadow: 0 0 12px rgba(251, 191, 36, 0.4);
}

.guardian-status.blocked {
  color: #f87171;
  text-shadow: 0 0 12px rgba(248, 113, 113, 0.4);
}

/* AI Response Text - Conversational Flow */
.guardian-ai-text {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #d1d5db;
  text-shadow: 0 0 6px rgba(124, 194, 153, 0.1);
}

.guardian-ai-text.italic {
  font-style: italic;
  color: var(--forest-sage);
  text-shadow: 0 0 8px rgba(90, 138, 103, 0.2);
}

/* Metadata - Subtle Forest Whispers */
.guardian-metadata {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 0.875rem;
  color: var(--forest-sage);
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.guardian-metadata:hover {
  opacity: 1;
  color: var(--guardian-mint);
}

/* ==============================================
   INTERACTIVE ELEMENTS
   ============================================== */

/* Button Enhancement - Forest to Lime Flow */
.guardian-button {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  background: linear-gradient(135deg, var(--forest-emerald) 0%, var(--guardian-mint) 100%);
  border: 1px solid rgba(124, 194, 153, 0.3);
  color: white;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.guardian-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(168, 245, 196, 0.2), transparent);
  transition: left 0.6s ease;
}

.guardian-button:hover::before {
  left: 100%;
}

.guardian-button:hover {
  background: linear-gradient(135deg, var(--guardian-mint) 0%, var(--phosphor-lime) 100%);
  box-shadow: 
    0 0 20px rgba(124, 194, 153, 0.4),
    0 4px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.guardian-button:active {
  transform: scale(0.98) translateY(0);
}

/* Secondary Buttons - Moss Undertone */
.guardian-button-secondary {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  background: rgba(45, 74, 53, 0.6);
  border: 1px solid rgba(90, 138, 103, 0.4);
  color: var(--guardian-mint);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.guardian-button-secondary:hover {
  background: rgba(90, 138, 103, 0.3);
  border-color: var(--guardian-mint);
  color: var(--phosphor-lime);
  text-shadow: 0 0 8px rgba(168, 245, 196, 0.3);
}

/* ==============================================
   BIOLUMINESCENT EFFECTS
   ============================================== */

/* Gentle Breathing Animation */
@keyframes gentle-pulse {
  0%, 100% { 
    opacity: 0.9;
    text-shadow: 0 0 8px rgba(124, 194, 153, 0.3);
  }
  50% { 
    opacity: 1;
    text-shadow: 0 0 16px rgba(168, 245, 196, 0.5);
  }
}

/* Organic Glow for Icons */
.guardian-icon-glow {
  filter: drop-shadow(0 0 8px currentColor);
  transition: filter 0.3s ease;
}

.guardian-icon-glow:hover {
  filter: drop-shadow(0 0 16px currentColor);
}

/* Data Loading Shimmer */
@keyframes forest-shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.guardian-loading-shimmer {
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(124, 194, 153, 0.1) 50%, 
    transparent 100%);
  background-size: 200px 100%;
  animation: forest-shimmer 2s infinite;
}

/* ==============================================
   ENHANCED CONTAINERS
   ============================================== */

/* Bento Box Enhancement - Living Borders */
.guardian-bento-enhanced {
  background: linear-gradient(135deg, 
    rgba(22, 27, 34, 0.9) 0%, 
    rgba(26, 47, 32, 0.7) 100%);
  border: 1px solid rgba(124, 194, 153, 0.15);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.guardian-bento-enhanced::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(124, 194, 153, 0.05) 0%, 
    transparent 50%, 
    rgba(168, 245, 196, 0.03) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.guardian-bento-enhanced:hover {
  border-color: rgba(124, 194, 153, 0.4);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(124, 194, 153, 0.1);
  transform: translateY(-2px);
}

.guardian-bento-enhanced:hover::before {
  opacity: 1;
}

/* ==============================================
   PROGRESS & STATUS INDICATORS
   ============================================== */

/* Enhanced Progress Bar */
.guardian-progress-bar {
  background: var(--forest-moss);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.guardian-progress-fill {
  background: linear-gradient(90deg, 
    var(--guardian-mint) 0%, 
    var(--phosphor-lime) 100%);
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(124, 194, 153, 0.3);
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.guardian-progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.2) 50%, 
    transparent 100%);
  animation: progress-shimmer 2s infinite;
}

@keyframes progress-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* ==============================================
   COMPONENT-SPECIFIC ENHANCEMENTS
   ============================================== */

/* Header Logo Glow */
.guardian-logo {
  filter: drop-shadow(0 0 12px rgba(124, 194, 153, 0.4));
  transition: filter 0.3s ease;
}

.guardian-logo:hover {
  filter: drop-shadow(0 0 20px rgba(168, 245, 196, 0.6));
}

/* Modal Enhancement */
.guardian-modal-enhanced {
  background: linear-gradient(135deg, 
    rgba(22, 27, 34, 0.95) 0%, 
    rgba(26, 47, 32, 0.9) 100%);
  border: 1px solid rgba(124, 194, 153, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(124, 194, 153, 0.1);
}

/* Footer Enhancement */
.guardian-footer {
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  color: var(--forest-sage);
  text-shadow: 0 0 6px rgba(90, 138, 103, 0.2);
}

/* ==============================================
   UTILITY CLASSES
   ============================================== */

.forest-text-glow { text-shadow: 0 0 10px rgba(124, 194, 153, 0.4); }
.forest-border-glow { border: 1px solid rgba(124, 194, 153, 0.3); }
.forest-box-glow { box-shadow: 0 0 20px rgba(124, 194, 153, 0.15); }
.forest-bg-subtle { background: rgba(26, 47, 32, 0.3); }

/* Responsive Typography */
@media (max-width: 768px) {
  .guardian-title { font-size: 1.75rem; }
  .guardian-core-header { font-size: 1.125rem; }
  .guardian-data-value { font-size: 1.25rem; }
}
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = DIGITAL_FOREST_STYLES;
    document.head.appendChild(styleSheet);
}

// --- Helper Components ---

const IconWrapper = ({ icon: Icon, className }) => <Icon className={className} />;

const STATUS_CONFIG = {
    healthy: { icon: ShieldCheck, color: 'text-emerald-400', label: 'Healthy' },
    caution: { icon: ShieldAlert, color: 'text-yellow-400', label: 'Caution' },
    blocked: { icon: ShieldX, color: 'text-red-400', label: 'Blocked' },
};

// --- Firebase Configuration ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-guardian-dashboard';

// --- Main App Component ---

export default function App() {
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const [allCores, setAllCores] = useState([]);
    const [activeCoreId, setActiveCoreId] = useState(null);
    const [activeCore, setActiveCore] = useState(null);
    const [modules, setModules] = useState([]);

    const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
    const [estimateResult, setEstimateResult] = useState(null);
    
    const [impactReport, setImpactReport] = useState(null);
    const [newProjectData, setNewProjectData] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [generatedTasks, setGeneratedTasks] = useState([]);
    
    const [isLoading, setIsLoading] = useState(false);

    // --- Firebase Initialization and Auth ---
    useEffect(() => {
        try {
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const authInstance = getAuth(app);
            setDb(firestore);
            setAuth(authInstance);

            const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    try {
                        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                            await signInWithCustomToken(authInstance, __initial_auth_token);
                        } else {
                            await signInAnonymously(authInstance);
                        }
                    } catch (authError) {
                        console.error("Authentication failed:", authError);
                    }
                }
                setIsAuthReady(true);
            });
            return () => unsubscribe();
        } catch (e) {
            console.error("Error initializing Firebase:", e);
        }
    }, []);

    // --- Firestore Data Syncing ---
    useEffect(() => {
        if (!isAuthReady || !db) return;
        const coresCollectionPath = `/artifacts/${appId}/public/data/cores`;
        const q = query(collection(db, coresCollectionPath));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const coresData = [];
            querySnapshot.forEach((doc) => {
                coresData.push({ id: doc.id, ...doc.data() });
            });
            setAllCores(coresData);
            if (!activeCoreId && coresData.length > 0) {
                setActiveCoreId(coresData[0].id);
            } else if (coresData.length === 0) {
                const createDefaultCore = async () => {
                    const defaultCore = {
                        name: 'Default System Core',
                        phase: 'Operational',
                        completion: 100,
                        status: 'healthy',
                        vision: 'Awaiting project import for analysis.'
                    };
                    try {
                        const docRef = await addDoc(collection(db, coresCollectionPath), defaultCore);
                        setActiveCoreId(docRef.id);
                    } catch (e) { console.error("Error creating default core:", e); }
                };
                createDefaultCore();
            }
        });
        return () => unsubscribe();
    }, [isAuthReady, db, activeCoreId]);

    useEffect(() => {
        if (!activeCoreId || !db) return;
        const coreDocPath = `/artifacts/${appId}/public/data/cores/${activeCoreId}`;
        const unsubCore = onSnapshot(doc(db, coreDocPath), (doc) => {
            if (doc.exists()) setActiveCore({ id: doc.id, ...doc.data() });
        });
        const modulesCollectionPath = `/artifacts/${appId}/public/data/cores/${activeCoreId}/modules`;
        const q = query(collection(db, modulesCollectionPath));
        const unsubModules = onSnapshot(q, (querySnapshot) => {
            const modulesData = [];
            querySnapshot.forEach((doc) => {
                modulesData.push({ id: doc.id, ...doc.data() });
            });
            setModules(modulesData);
        });
        return () => { unsubCore(); unsubModules(); };
    }, [activeCoreId, db]);


    // --- AI Analysis Functions ---
    const callGeminiAPI = async (prompt, generationConfig = {}) => {
        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory, generationConfig };
        const apiKey = ""; // Injected by environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`API call failed: ${response.status}`);
        const result = await response.json();
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            return result.candidates[0].content.parts[0].text;
        }
        throw new Error("Invalid response structure from API.");
    };

    const runPredictiveAnalysis = async (proposalData) => {
        setIsLoading(true);
        setNewProjectData(proposalData);
        
        let riskScore = 0;
        if (proposalData.integrationPoints.toLowerCase().includes('auth')) riskScore += 3;
        if (proposalData.techStack.split(',').length > 3) riskScore += 1;
        if (proposalData.dataModel.toLowerCase().includes('alter')) riskScore += 3;
        if (proposalData.userContext.toLowerCase().includes('write')) riskScore += 2;

        let riskLevel = 'Go';
        if (riskScore > 4) riskLevel = 'Block';
        else if (riskScore > 1) riskLevel = 'Caution';

        const prompt = `As a senior software architect, analyze the following new module integration proposal for the "${activeCore.name}" project. Provide a "Why" Explanation and a "Memorable Analogy" for the determined risk level: ${riskLevel}.`;
        
        try {
            const text = await callGeminiAPI(prompt);
            const whyMatch = text.match(/Explanation:\*\* (.*?)\n/s);
            const analogyMatch = text.match(/Analogy:\*\* (.*)/s);
            setImpactReport({ recommendation: riskLevel, explanation: whyMatch ? whyMatch[1].trim() : "Could not determine the reason.", analogy: analogyMatch ? analogyMatch[1].trim() : "Analysis incomplete." });
        } catch (error) {
            console.error("Gemini API error:", error);
            setImpactReport({ recommendation: 'Caution', explanation: "Error during automated analysis.", analogy: "An unexpected error occurred." });
        } finally {
            setIsLoading(false);
            setIsProposalModalOpen(false);
            setIsReportModalOpen(true);
        }
    };

    const analyzeRepositoryUrl = async (gitUrl) => {
        setIsLoading(true);
        const repoNameMatch = gitUrl.match(/[\/]([^\/]+?)(?:\.git)?$/);
        if (!repoNameMatch) { alert("Could not parse repository name from URL."); setIsLoading(false); return; }
        const repoName = repoNameMatch[1];

        const prompt = `You are an expert software architect analyzing a Git repository by its name. Generate a JSON object with: "projectName", "predictedVision", "keyTechnologies" (array), and "status" ('healthy' or 'caution'). The repository name is "${repoName}". Output only raw JSON.`;

        try {
            const jsonString = await callGeminiAPI(prompt, { responseMimeType: "application/json" });
            const analysis = JSON.parse(jsonString);
            const newCore = { ...analysis, phase: 'Operational', completion: 100 };
            const coresCollectionPath = `/artifacts/${appId}/public/data/cores`;
            const docRef = await addDoc(collection(db, coresCollectionPath), newCore);
            setActiveCoreId(docRef.id);
            setIsImportModalOpen(false);
        } catch (error) {
            console.error("Error analyzing repository:", error);
            alert("Failed to analyze the repository.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleQuickEstimate = async (idea) => {
        setIsLoading(true);
        setEstimateResult(null);
        const prompt = `As an intelligent realist project manager for "${activeCore.name}", a user has an idea. Give a quick, two-part assessment. **Idea:** "${idea}". Format as a JSON object with keys "feasibility" and "gotcha".`;
        const schema = { type: "OBJECT", properties: { "feasibility": { "type": "STRING" }, "gotcha": { "type": "STRING" } }, required: ["feasibility", "gotcha"] };
        try {
            const jsonString = await callGeminiAPI(prompt, { responseMimeType: "application/json", responseSchema: schema });
            setEstimateResult(JSON.parse(jsonString));
        } catch (error) {
            console.error("Error getting quick estimate:", error);
            setEstimateResult({ feasibility: "Could not complete the estimate.", gotcha: "The AI realist is on a coffee break." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateTasks = async (module) => {
        setSelectedModule(module);
        setIsTaskModalOpen(true);
        setIsLoading(true);
        setGeneratedTasks([]);
        const prompt = `As an expert project manager, break down the following project goal into a checklist of specific, actionable technical tasks. Project Goal: "${module.goal}". Generate a JSON object with a single key "tasks", which is an array of objects. Each object should have "text" (string) and "completed" (boolean, default false).`;
        const schema = { type: "OBJECT", properties: { "tasks": { type: "ARRAY", items: { type: "OBJECT", properties: { "text": { "type": "STRING" }, "completed": { "type": "BOOLEAN" } }, required: ["text", "completed"] } } }, required: ["tasks"] };
        try {
            const jsonString = await callGeminiAPI(prompt, { responseMimeType: "application/json", responseSchema: schema });
            setGeneratedTasks(JSON.parse(jsonString).tasks || []);
        } catch (error) {
            console.error("Error generating tasks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTasksToModule = async () => {
        if (!selectedModule || generatedTasks.length === 0 || !activeCoreId) return;
        const moduleDocRef = doc(db, `/artifacts/${appId}/public/data/cores/${activeCoreId}/modules`, selectedModule.id);
        try {
            await updateDoc(moduleDocRef, { tasks: generatedTasks });
            setIsTaskModalOpen(false);
            setSelectedModule(null);
            setGeneratedTasks([]);
        } catch (error) { console.error("Error adding tasks to module:", error); }
    };

    const handleApproveProject = async () => {
        if (!db || !newProjectData || !activeCoreId) return;
        const newModule = { ...newProjectData, status: 'healthy', completion: 0, phase: 'Phase 1: Planning', createdAt: new Date().toISOString() };
        try {
            const modulesCollectionPath = `/artifacts/${appId}/public/data/cores/${activeCoreId}/modules`;
            await addDoc(collection(db, modulesCollectionPath), newModule);
            setIsReportModalOpen(false);
            setNewProjectData(null);
            setImpactReport(null);
        } catch (error) { console.error("Error adding module to Firestore:", error); }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#101010] text-gray-300 font-sans overflow-hidden">
            <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-[#101010] via-[#0D1117] to-[#101010]"></div>
            
            <div className="relative z-10 p-4 sm:p-6 lg:p-8 animate-fade-in">
                <div className="max-w-7xl mx-auto">
                    <Header allCores={allCores} activeCoreId={activeCoreId} onCoreChange={setActiveCoreId} />
                    <main className="mt-8">
                       {activeCore ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="lg:col-span-4">
                                    <SystemCoreView core={activeCore} />
                                </div>
                                <div className="lg:col-span-2">
                                     <ModulesView projects={modules} onGenerateTasks={handleGenerateTasks} />
                                </div>
                                <div className="lg:col-span-1">
                                    <CoreStatusCard core={activeCore} />
                                </div>
                                <div className="lg:col-span-1">
                                    <AIToolsCard onQuickEstimate={() => setIsEstimateModalOpen(true)} onNewProposal={() => setIsProposalModalOpen(true)} />
                                </div>
                            </div>
                       ) : ( <div className="text-center py-20 text-gray-500">Loading Guardian Core...</div> )}
                    </main>
                </div>
                 {/* Modals */}
                <IntegrationProposalModal isOpen={isProposalModalOpen} onClose={() => setIsProposalModalOpen(false)} onSubmit={runPredictiveAnalysis} isLoading={isLoading} />
                <ImportProjectModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onSubmit={analyzeRepositoryUrl} isLoading={isLoading} />
                <ImpactReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} onApprove={handleApproveProject} report={impactReport} project={newProjectData} />
                <TaskGenerationModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} module={selectedModule} tasks={generatedTasks} isLoading={isLoading} onApprove={handleAddTasksToModule} />
                <QuickEstimateModal isOpen={isEstimateModalOpen} onClose={() => { setIsEstimateModalOpen(false); setEstimateResult(null); }} onSubmit={handleQuickEstimate} isLoading={isLoading} result={estimateResult} />
                 <footer className="text-center mt-12 guardian-footer">
                    <p>Guardian Dashboard | Where creativity never gets out of hand.</p>
                    {userId && <p className="mt-1 text-xs opacity-70">Operator ID: {userId}</p>}
                </footer>
            </div>
        </div>
    );
}

// --- Bento Box Base Component ---
const BentoBox = ({ children, className = '' }) => (
    <div className={`bg-[#161B22] rounded-xl p-6 border border-white/10 shadow-lg shadow-black/40 ${className}`}>
        {children}
    </div>
);

// --- Sub-Components ---

function Header({ allCores, activeCoreId, onCoreChange }) {
    return (
        <header className="flex flex-wrap justify-between items-center pb-4 mb-4 border-b border-white/10 gap-4">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-900/50 flex items-center justify-center rounded-lg border border-emerald-400/20">
                    <IconWrapper icon={Cpu} className="w-6 h-6 text-emerald-400 guardian-logo guardian-icon-glow" />
                </div>
                <div>
                    <h1 className="guardian-title">Guardian Dashboard</h1>
                    <div className="relative">
                        <select value={activeCoreId || ''} onChange={(e) => onCoreChange(e.target.value)} className="bg-transparent guardian-metadata font-semibold pl-1 pr-6 py-0.5 appearance-none focus:outline-none cursor-pointer">
                            {allCores.map(core => <option key={core.id} value={core.id} className="bg-gray-800 text-white">{core.name}</option>)}
                        </select>
                        <ChevronsUpDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>
        </header>
    );
}

function SystemCoreView({ core }) {
    return (
        <BentoBox className="guardian-bento-enhanced">
            <h2 className="guardian-core-header mb-1">System Core: {core.name}</h2>
            <p className="guardian-metadata text-sm">Guardian's primary objective is to protect this asset.</p>
            <div className="relative z-10 mt-4 pt-4 border-t border-white/10">
                <p className="guardian-metadata mb-2">Guardian's Predicted Vision</p>
                <p className="guardian-ai-text italic text-md">"{core.vision || 'Awaiting project import for analysis.'}"</p>
            </div>
        </BentoBox>
    );
}

function CoreStatusCard({ core }) {
    const Status = STATUS_CONFIG[core.status];
    return (
        <BentoBox className="flex flex-col justify-between guardian-bento-enhanced">
            <div>
                <h3 className="guardian-section-header">Core Integrity</h3>
                <p className="guardian-metadata">Real-time health status</p>
            </div>
            <div className="flex items-center justify-center gap-4 my-4">
                 <div className={`p-4 rounded-full bg-emerald-500/10`}>
                     <Status.icon className={`w-8 h-8 ${Status.color} guardian-icon-glow`} />
                 </div>
                 <span className={`guardian-status ${core.status}`}>{Status.label}</span>
            </div>
        </BentoBox>
    );
}

function AIToolsCard({ onQuickEstimate, onNewProposal }) {
    return (
        <BentoBox className="flex flex-col justify-between guardian-bento-enhanced">
            <div>
                <h3 className="guardian-section-header">AI Toolkit</h3>
                <p className="guardian-metadata">Engage with Guardian</p>
            </div>
            <div className="flex flex-col gap-3 mt-4">
                <button onClick={onQuickEstimate} className="w-full text-left flex items-center gap-3 p-3 rounded-lg guardian-button-secondary transition-all duration-150 ease-in-out active:scale-[0.98]">
                    <Lightbulb className="text-emerald-400 guardian-icon-glow" /> 
                    <span className="guardian-ai-text font-medium">Quick Estimate</span>
                </button>
                <button onClick={onNewProposal} className="w-full text-left flex items-center gap-3 p-3 rounded-lg guardian-button-secondary transition-all duration-150 ease-in-out active:scale-[0.98]">
                    <FileText className="text-emerald-400 guardian-icon-glow" /> 
                    <span className="guardian-ai-text font-medium">New Proposal</span>
                </button>
            </div>
        </BentoBox>
    );
}


function ModulesView({ projects, onGenerateTasks }) {
    return (
        <BentoBox className="guardian-bento-enhanced">
            <h3 className="guardian-section-header mb-5 flex items-center gap-3">
                <GitBranch className="text-emerald-400/70 guardian-icon-glow" />
                Active Modules
            </h3>
            {projects.length === 0 ? (
                <div className="text-center py-10">
                    <Layers size={40} className="mx-auto text-gray-600" />
                    <h4 className="mt-4 guardian-ai-text font-semibold">No Active Modules</h4>
                    <p className="mt-1 guardian-metadata">Submit a proposal to begin your next experiment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map(p => <ModuleCard key={p.id} project={p} onGenerateTasks={() => onGenerateTasks(p)} />)}
                </div>
            )}
        </BentoBox>
    );
}

function ModuleCard({ project, onGenerateTasks }) {
    const Status = STATUS_CONFIG[project.status];
    const totalTasks = project.tasks?.length || 0;
    const completedTasks = project.tasks?.filter(t => t.completed).length || 0;

    return (
        <div className="guardian-bento-enhanced rounded-lg p-4 border border-white/10 group transition-all duration-300 hover:border-emerald-400/50 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <h4 className="guardian-ai-text font-bold text-white pr-2">{project.name}</h4>
                    <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity" title={Status.label}>
                        <Status.icon className={`w-5 h-5 ${Status.color} guardian-icon-glow`} />
                    </div>
                </div>
                <p className="guardian-metadata mb-1 line-clamp-2">Goal: {project.goal}</p>
            </div>
            <div className="mt-4">
                {totalTasks > 0 && (
                     <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                            <span className="guardian-metadata flex items-center gap-1.5">
                                <CheckSquare size={14}/> Tasks
                            </span>
                            <span className="guardian-data-value text-xs">{completedTasks} / {totalTasks}</span>
                        </div>
                        <div className="guardian-progress-bar h-1.5">
                            <div className="guardian-progress-fill h-1.5 transition-all duration-500" style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                )}
                <button onClick={onGenerateTasks} className="w-full mt-4 flex items-center justify-center gap-2 guardian-button text-xs font-bold py-2 px-3 rounded-lg transition-all duration-150 ease-in-out active:scale-[0.98]">
                    <Sparkles size={14} className="guardian-icon-glow" />
                    <span>Gen Tasks</span>
                </button>
            </div>
        </div>
    );
}

// --- Modals ---
function Modal({ isOpen, onClose, children, maxWidth = 'max-w-2xl' }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in-fast" onClick={onClose}>
            <div className={`guardian-modal-enhanced rounded-2xl shadow-2xl w-full ${maxWidth} relative animate-slide-up`} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

const inputStyles = "w-full bg-[#0D1117] border border-white/10 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors";
const buttonStyles = "py-2 px-5 guardian-button rounded-lg text-white font-bold flex items-center gap-2 disabled:bg-gray-500 transition-all duration-150 ease-in-out active:scale-[0.98]";
const cancelButtonStyles = "py-2 px-4 guardian-button-secondary rounded-lg text-white font-semibold transition-all duration-150 ease-in-out active:scale-[0.98]";

function IntegrationProposalModal({ isOpen, onClose, onSubmit, isLoading }) {
    const [proposal, setProposal] = useState({ name: '', goal: '', integrationPoints: '', techStack: '', dataModel: '', userContext: '' });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProposal(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(proposal);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-8 max-h-[90vh] overflow-y-auto">
                <h2 className="guardian-core-header mb-2">New Module Integration Proposal</h2>
                <p className="guardian-metadata mb-6">This design document will be reviewed by Guardian to assess its impact on the System Core.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block guardian-ai-text font-medium mb-1">Module Name</label>
                            <input type="text" name="name" value={proposal.name} onChange={handleChange} className={inputStyles} placeholder="e.g., Real-time Analytics Engine" required />
                        </div>
                        <div>
                            <label className="block guardian-ai-text font-medium mb-1">Primary Goal</label>
                            <input type="text" name="goal" value={proposal.goal} onChange={handleChange} className={inputStyles} placeholder="e.g., To process and visualize user data" required />
                        </div>
                    </div>
                    <div>
                        <label className="block guardian-ai-text font-medium mb-1">Architectural Integration Points</label>
                        <textarea name="integrationPoints" value={proposal.integrationPoints} onChange={handleChange} rows="3" className={inputStyles} placeholder="e.g., Hooks into the `onUserLogin` event..." required />
                        <p className="guardian-metadata mt-1">Describe how this module connects to the System Core.</p>
                    </div>
                    <div>
                        <label className="block guardian-ai-text font-medium mb-1">Technology Stack & Rationale</label>
                        <textarea name="techStack" value={proposal.techStack} onChange={handleChange} rows="2" className={inputStyles} placeholder="e.g., d3.js (for complex data visualization)..." />
                        <p className="guardian-metadata mt-1">List any new libraries and briefly explain why they are needed.</p>
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className={cancelButtonStyles}>Cancel</button>
                        <button type="submit" disabled={isLoading} className={buttonStyles}>
                            {isLoading ? 'Analyzing...' : 'Submit for Analysis'}
                            {isLoading && <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

function QuickEstimateModal({ isOpen, onClose, onSubmit, isLoading, result }) {
    const [idea, setIdea] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); onSubmit(idea); };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
            <div className="p-8">
                <h2 className="guardian-core-header mb-2">Quick Module Estimate</h2>
                <p className="guardian-metadata mb-6">Pitch an idea to your intelligent realist for a quick gut-check.</p>
                
                {!result && !isLoading && (
                    <form onSubmit={handleSubmit}>
                        <textarea name="idea" value={idea} onChange={(e) => setIdea(e.target.value)} rows="3" className={inputStyles} placeholder="e.g., What if we used AI to generate a unique color scheme for each user?" required />
                        <div className="mt-8 flex justify-end gap-4">
                            <button type="button" onClick={onClose} className={cancelButtonStyles}>Cancel</button>
                            <button type="submit" disabled={isLoading} className={buttonStyles}>Get Estimate</button>
                        </div>
                    </form>
                )}
                {result && !isLoading && (
                    <div className="animate-fade-in space-y-4">
                        <div>
                            <h4 className="guardian-section-header text-md">Feasibility Estimate:</h4>
                            <p className="guardian-ai-text italic">"{result.feasibility}"</p>
                        </div>
                        <div>
                            <h4 className="guardian-section-header text-yellow-400 text-md">Potential Gotcha:</h4>
                            <p className="guardian-ai-text italic">"{result.gotcha}"</p>
                        </div>
                        <div className="mt-8 flex justify-end">
                             <button type="button" onClick={onClose} className={cancelButtonStyles}>Close</button>
                        </div>
                    </div>
                )}
                 {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full guardian-ai-text py-10">
                        <div className="w-8 h-8 border-4 border-t-transparent border-emerald-500 rounded-full animate-spin"></div>
                        <p className="mt-4">Consulting the realist...</p>
                    </div>
                )}
            </div>
        </Modal>
    );
}

function TaskGenerationModal({ isOpen, onClose, module, tasks, isLoading, onApprove }) {
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-8">
                <div className="flex items-start gap-4">
                    <Sparkles size={40} className="text-emerald-400 flex-shrink-0 mt-1 guardian-icon-glow" />
                    <div>
                        <h2 className="guardian-core-header">✨ AI Task Generation</h2>
                        <p className="guardian-metadata">Guardian is generating tasks for: <span className="font-semibold text-gray-300">{module?.name}</span></p>
                    </div>
                </div>
                <div className="mt-6 min-h-[200px] max-h-[40vh] overflow-y-auto pr-2">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full guardian-ai-text">
                            <div className="w-8 h-8 border-4 border-t-transparent border-emerald-500 rounded-full animate-spin"></div>
                            <p className="mt-4">Analyzing goal and breaking it down...</p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {tasks.map((task, index) => (
                                <li key={index} className="flex items-center gap-3 bg-white/5 p-3 rounded-md">
                                    <CheckSquare className="text-emerald-400 guardian-icon-glow" size={20}/>
                                    <span className="guardian-ai-text">{task.text}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end items-center gap-4">
                    <button type="button" onClick={onClose} className={cancelButtonStyles}>Cancel</button>
                    <button onClick={onApprove} disabled={isLoading || tasks.length === 0} className={buttonStyles}>
                       Add Tasks to Module
                    </button>
                </div>
            </div>
        </Modal>
    );
}

function ImportProjectModal({ isOpen, onClose, onSubmit, isLoading }) {
    const [url, setUrl] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); onSubmit(url); };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-8">
                <h2 className="guardian-core-header mb-2">Import New System Core</h2>
                <p className="guardian-metadata mb-6">Enter a public Git repository URL. Guardian will create and analyze a new core project.</p>
                <form onSubmit={handleSubmit}>
                    <input type="url" id="git-url" value={url} onChange={(e) => setUrl(e.target.value)} className={inputStyles} placeholder="https://github.com/user/repository.git" required />
                    <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className={cancelButtonStyles}>Cancel</button>
                        <button type="submit" disabled={isLoading} className={buttonStyles}>
                            {isLoading ? 'Analyzing...' : 'Create & Analyze Core'}
                            {isLoading && <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

function ImpactReportModal({ isOpen, onClose, onApprove, report, project }) {
    if (!isOpen || !report) return null;

    const RECOMMENDATION_CONFIG = {
        Go: { icon: CheckCircle, color: 'text-emerald-400', title: 'Recommendation: Go', buttonClass: 'guardian-button' },
        Caution: { icon: AlertTriangle, color: 'text-yellow-400', title: 'Proceed with Caution', buttonClass: 'bg-yellow-500 hover:bg-yellow-600 shadow-[0_0_20px_-5px_theme(colors.yellow.500)]' },
        Block: { icon: XCircle, color: 'text-red-400', title: 'Recommendation: Blocked', buttonClass: 'bg-red-500 hover:bg-red-600 shadow-[0_0_20px_-5px_theme(colors.red.500)]' },
    };
    const config = RECOMMENDATION_CONFIG[report.recommendation];

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-8">
                <div className="flex items-start gap-4">
                    <Bot size={40} className="text-emerald-400 flex-shrink-0 mt-1 guardian-icon-glow" />
                    <div>
                        <h2 className="guardian-core-header">Guardian Impact Report</h2>
                        <p className="guardian-metadata">Analysis for module: <span className="font-semibold text-gray-300">{project?.name}</span></p>
                    </div>
                </div>
                <div className={`mt-6 p-4 rounded-lg border flex items-center gap-4 bg-black/20 border-${config.color.replace('text-', '')}-500/30`}>
                    <config.icon className={`w-10 h-10 flex-shrink-0 ${config.color} guardian-icon-glow`} />
                    <div>
                        <h3 className={`guardian-section-header ${config.color}`}>{config.title}</h3>
                    </div>
                </div>
                <div className="mt-6 space-y-5 guardian-ai-text">
                    <div>
                        <h4 className="guardian-section-header text-md">The "Why" Explanation:</h4>
                        <p className="italic opacity-90">"{report.explanation}"</p>
                    </div>
                    <div>
                        <h4 className="guardian-section-header text-md">Guardian's Analogy:</h4>
                        <p className="italic opacity-90">"{report.analogy}"</p>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end items-center gap-4">
                    <button type="button" onClick={onClose} className={cancelButtonStyles}>Review Plan</button>
                    {report.recommendation !== 'Block' && (
                        <button onClick={onApprove} className={`py-2 px-6 rounded-lg text-white font-bold flex items-center gap-2 ${config.buttonClass}`}>
                           Approve & Launch Module
                        </button>
                    )}
                     {report.recommendation === 'Block' && (
                        <p className="text-red-400 font-semibold">Project is blocked. Please revise your plan.</p>
                     )}
                </div>
            </div>
        </Modal>
    );
}