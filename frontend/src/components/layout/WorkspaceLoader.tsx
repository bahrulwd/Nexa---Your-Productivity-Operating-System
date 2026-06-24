import React, { useEffect, useState } from 'react';

export const WorkspaceLoader: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Move the glow subtly towards the mouse for an organic feel
      const moveX = (e.clientX - window.innerWidth / 2) / 15;
      const moveY = (e.clientY - window.innerHeight / 2) / 15;
      setMousePos({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#F8F9FB] flex items-center justify-center selection:bg-[#7C3AED] selection:text-white font-['Nunito_Sans',sans-serif] overflow-hidden z-[9999]">
      {/* Subtle Background Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="loader-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-60 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px))`
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center animate-fade-in-up">
        {/* Animated Brand Shape */}
        <div className="relative mb-8">
          {/* Pulsing Outer Ring */}
          <div className="absolute -inset-4 bg-[#7C3AED]/10 rounded-full blur-xl animate-pulse" />
          
          {/* Core Brand Geometric Pill */}
          <div className="w-24 h-24 bg-[#7C3AED] flex items-center justify-center animate-premium-pulse shadow-[0_20px_50px_rgba(124,58,237,0.3)]">
            {/* Inner Brand Symbol */}
            <img 
              src="/images/Logo.png" 
              alt="Nexa Logo" 
              className="w-14 h-14 object-contain" 
            />
          </div>
        </div>

        {/* Typography Section */}
        <div className="text-center space-y-3">
          <h1 className="font-['Nunito_Sans',sans-serif] text-4xl text-[#15113d] tracking-[0.4em] translate-x-[0.2em] uppercase font-black">
            Nexa
          </h1>
          <div className="flex items-center justify-center space-x-2 py-2">
            {/* Loading Progress Indicator (Visual only for loading state) */}
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce" />
            </div>
            <p className="font-['Nunito_Sans',sans-serif] text-sm text-[#9CA3AF] font-bold">
              Preparing your workspace...
            </p>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 opacity-30">
        <p className="font-['Nunito_Sans',sans-serif] text-xs text-[#47464e] tracking-widest uppercase font-semibold">
          Efficiency Redefined
        </p>
      </div>
    </div>
  );
};

export default WorkspaceLoader;
