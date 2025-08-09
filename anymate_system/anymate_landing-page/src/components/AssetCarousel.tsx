import { useState, useEffect } from 'react';

type Item = { title: string; tag: string; price?: string; };
const items: Item[] = [
  { title: 'ArchViz: Interior Kit v1', tag: 'LP sections', price: '$39' },
  { title: 'Sci‑Fi Door Pack', tag: 'Kitbash', price: '$29' },
  { title: 'Parametric Stair Generator', tag: 'Blueprint', price: '$49' },
  { title: 'PBR Metals (12)', tag: 'Textures', price: '$19' },
  { title: 'Low‑Poly Props (30)', tag: 'Game', price: '$25' },
  { title: 'Facade Variants', tag: 'ArchViz', price: '$35' },
  { title: 'Greebles v2', tag: 'Kitbash', price: '$19' },
  { title: 'Lighting Rigs', tag: 'Tooling', price: '$15' },
  { title: 'Modular Stairs Pro', tag: 'Blueprint', price: '$42' },
  { title: 'Urban Props Pack', tag: 'Game', price: '$28' },
];

function ThumbSVG({ index }: { index: number }) {
  // Different gradient variations for visual variety
  const gradients = [
    'linear-gradient(135deg, var(--fire-1), var(--fire-2))',
    'linear-gradient(45deg, var(--fire-2), var(--fire-3))',
    'linear-gradient(225deg, var(--fire-1), var(--fire-3))',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <div 
      className="w-full h-40 rounded-lg border border-white/10 relative overflow-hidden group-hover:border-white/30 transition-all duration-300"
      style={{ background: gradient }}
    >
      <div className="absolute inset-4 bg-black/45 rounded-lg">
        <div className="absolute inset-0 flex items-center justify-center opacity-80">
          <div className="w-8 h-8 rounded-full" style={{ background: gradient }} />
          <div className="ml-3">
            <div className="w-20 h-2 mb-2 rounded" style={{ background: gradient }} />
            <div className="w-16 h-2 rounded" style={{ background: gradient, opacity: 0.7 }} />
          </div>
        </div>
      </div>
      {/* Hover fire effect */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--fire-1),var(--fire-2),var(--fire-3))] opacity-0 group-hover:opacity-20 animate-flame transition-opacity duration-300" />
    </div>
  );
}

export default function AssetCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, items.length - 2));
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const visibleItems = items.slice(currentIndex, currentIndex + 3);
  
  // Pad with items from beginning if needed
  while (visibleItems.length < 3 && items.length > 0) {
    visibleItems.push(items[visibleItems.length % items.length]);
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, items.length - 2));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => prev === 0 ? Math.max(0, items.length - 3) : prev - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="mt-12 md:mt-16">
      <div className="flex items-baseline justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg md:text-xl font-semibold text-white/90">Featured assets</h2>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.max(1, items.length - 2) }, (_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex 
                    ? 'bg-[var(--fire-2)] w-6' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
        <a href="/waitlist" className="text-sm text-sky-300 hover:underline" data-evt="cta_waitlist_carousel">
          Join the drop →
        </a>
      </div>

      <div className="relative">
        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full border border-white/20 bg-black/50 backdrop-blur text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
          aria-label="Previous assets"
        >
          ←
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full border border-white/20 bg-black/50 backdrop-blur text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
          aria-label="Next assets"
        >
          →
        </button>

        {/* Carousel content */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out gap-4"
            style={{ transform: `translateX(0%)` }}
          >
            {visibleItems.map((item, i) => (
              <div key={`${currentIndex}-${i}`} className="w-full md:w-1/3 shrink-0">
                <div className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur p-3 hover:border-white/20 hover:bg-white/8 transition-all duration-300 hover:transform hover:scale-[1.02]">
                  <ThumbSVG index={currentIndex + i} />
                  <div className="mt-3">
                    <div className="text-white/90 font-medium group-hover:text-white transition-colors">
                      {item.title}
                    </div>
                    <div className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                      {item.tag}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-white/80 font-medium">{item.price}</span>
                    <button 
                      className="text-sm px-3 py-1 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                      data-evt="preview_asset_carousel"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-play indicator */}
        {isAutoPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-[var(--fire-2)] animate-pulse"
              style={{ 
                animation: 'progress 4s linear infinite',
                background: 'linear-gradient(90deg, var(--fire-1), var(--fire-2), var(--fire-3))'
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
}