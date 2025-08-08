import { useEffect } from 'react';

type Props = { open: boolean; onClose: () => void; };

export default function ActivatePanel({ open, onClose }: Props){
  useEffect(() => {
    function onKey(e: KeyboardEvent){ 
      if (e.key === 'Escape') onClose(); 
    }
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);
  
  if (!open) return null;
  
  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-label="Activation panel"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl h-full max-h-[90vh] bg-gradient-to-br from-slate-900 to-slate-800 border border-white/20 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          aria-label="Close"
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border border-white/20 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        >
          Close
        </button>
        
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-emerald-400/30 rounded-full animate-spin">
              <div className="w-full h-full border-4 border-transparent border-t-emerald-400 rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white">PATHsassin 3D</h2>
            <p className="text-slate-300 max-w-md mx-auto">
              3D visualization loading... This is where your PATHsassin3DMermaid component would render the interactive 3D scene.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}