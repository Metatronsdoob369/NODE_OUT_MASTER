import { useState, useEffect, useRef, ReactNode } from 'react';

interface CarouselProps {
  children: ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  itemsPerView?: number;
}

export default function Carousel({
  children,
  autoPlay = true,
  autoPlayInterval = 4000,
  showDots = true,
  showArrows = true,
  className = '',
  itemsPerView = 3
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = Math.max(1, children.length - itemsPerView + 1);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || !autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlay, autoPlayInterval, totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case ' ':
        case 'Enter':
          event.preventDefault();
          pauseAutoPlay();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    pauseAutoPlay();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    pauseAutoPlay();
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => prev === 0 ? totalSlides - 1 : prev - 1);
    pauseAutoPlay();
  };

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative focus-within:outline-none ${className}`}
      tabIndex={0}
      role="region"
      aria-label="Carousel"
    >
      {/* Navigation arrows */}
      {showArrows && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full border border-white/20 bg-black/50 backdrop-blur text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous slide"
          >
            ←
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full border border-white/20 bg-black/50 backdrop-blur text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next slide"
          >
            →
          </button>
        </>
      )}

      {/* Carousel content with scroll-snap */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out gap-4 scroll-smooth"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            scrollSnapType: 'x mandatory'
          }}
        >
          {children.map((child, index) => (
            <div 
              key={index} 
              className="flex-shrink-0"
              style={{ 
                width: `${100 / itemsPerView}%`,
                scrollSnapAlign: 'start'
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {showDots && totalSlides > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: totalSlides }, (_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full ${
                i === currentIndex 
                  ? 'w-6 h-2 bg-[var(--fire-2)]' 
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play progress indicator */}
      {isAutoPlaying && autoPlay && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden">
          <div 
            className="h-full bg-[var(--fire-2)]"
            style={{ 
              animation: `progress ${autoPlayInterval}ms linear infinite`,
              background: 'linear-gradient(90deg, var(--fire-1), var(--fire-2), var(--fire-3))'
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}