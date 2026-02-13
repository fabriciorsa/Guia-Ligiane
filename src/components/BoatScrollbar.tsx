import { useEffect, useState, useRef, useCallback } from 'react';
import { Sailboat } from 'lucide-react';

const BoatScrollbar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
      setIsVisible(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  // Handle drag move
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientY: number) => {
      if (!trackRef.current) return;

      const track = trackRef.current;
      const rect = track.getBoundingClientRect();
      const trackHeight = rect.height;
      const relativeY = clientY - rect.top;
      const newProgress = Math.min(Math.max(relativeY / trackHeight, 0), 1);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: newProgress * docHeight,
        behavior: 'auto'
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0].clientY);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  // Click on track to jump
  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    if (e.target === trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const newProgress = clickY / rect.height;

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: newProgress * docHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  const thumbPosition = scrollProgress * 100;

  return (
    <div
      ref={containerRef}
      className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
    >
      {/* Track */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative w-1 h-[80vh] bg-[#2C2416]/10 rounded-full cursor-pointer"
      >

        {/* Boat Thumb */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`absolute left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing transition-transform duration-100 ${isDragging ? 'scale-110' : 'hover:scale-105'
            }`}
          style={{ top: `calc(${thumbPosition}% - 20px)` }}
        >
          {/* Boat Icon */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-[#365A38]/20 rounded-full blur-md scale-150" />

            {/* White circle background */}
            <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Sailboat className="w-6 h-6 text-[#8B6F4E] fill-[#8B6F4E]/20" />
            </div>

            {/* Tooltip - Only visible on drag/hover */}
            <div className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-300 ${isDragging ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
              }`}>
              <span className="bg-[#2C2416] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoatScrollbar;
