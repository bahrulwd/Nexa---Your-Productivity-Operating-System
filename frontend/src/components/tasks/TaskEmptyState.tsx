import React from 'react';

interface TaskEmptyStateProps {
  onAddTaskClick: () => void;
}

export const TaskEmptyState: React.FC<TaskEmptyStateProps> = ({ 
  onAddTaskClick
}) => {
  return (
    <div className="flex-grow flex items-center justify-center p-6">
      {/* Premium Bento Card with Glassmorphic design and subtle gradients */}
      <div className="nexa-glass empty-state-card w-full max-w-3xl rounded-3xl border border-white/50 p-12 md:p-18 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(42,39,83,0.03)] select-none transition-all duration-500 hover:shadow-[0_25px_60px_rgba(42,39,83,0.06)] hover:border-white/80 animate-fade-in relative overflow-hidden group/card">
        
        {/* Subtle decorative glow in background of card */}
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-[#7C3AED]/5 rounded-full blur-3xl group-hover/card:bg-[#7C3AED]/8 transition-colors duration-500 pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-[#fec886]/5 rounded-full blur-3xl group-hover/card:bg-[#fec886]/8 transition-colors duration-500 pointer-events-none" />

        {/* Graphic Element with floating animations */}
        <div className="w-28 h-28 empty-state-icon-container flex items-center justify-center mb-8 relative animate-float">
          {/* Animated Glow Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED]/20 to-[#fec886]/20 rounded-full blur-xl scale-125 opacity-70 group-hover/card:scale-135 transition-transform duration-500" />
          
          {/* Layered Glassmorphic Card Badge */}
          <div className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-md border border-white/60 relative rotate-[6deg] group-hover/card:rotate-0 transition-all duration-500">
            <i className="fa-solid fa-clipboard-check text-[#7C3AED] text-4xl"></i>
          </div>
          
          {/* Floating Accents */}
          <div className="absolute -top-1 -right-1 animate-pulse">
            <i className="fa-solid fa-star text-amber-400 text-xl"></i>
          </div>
          <div className="absolute -bottom-1.5 -left-1.5 opacity-60">
            <i className="fa-solid fa-star text-indigo-400 text-base"></i>
          </div>
        </div>

        {/* Content */}
        <h2 className="font-sans font-bold text-2xl md:text-3xl empty-state-title text-[#15113d] mb-3 tracking-tight leading-snug">
          Belum ada tugas yang dijadwalkan.
        </h2>
        <p className="font-sans text-sm md:text-base empty-state-desc text-[#9CA3AF] max-w-[460px] mb-8 leading-relaxed font-semibold">
          Mulai tambahkan pekerjaan Anda agar Smart Priority Score dapat membantu menyusun urutan kerja terbaik hari ini.
        </p>

        {/* CTA Button */}
        <button 
          onClick={onAddTaskClick}
          className="bg-gradient-to-r empty-state-cta from-[#7C3AED] to-[#6C5DD3] hover:from-[#6B32CD] hover:to-[#5B4EBE] text-white px-9 py-4 rounded-2xl font-sans font-bold text-sm flex items-center gap-2.5 transition-all transform hover:scale-[1.03] active:scale-95 shadow-md shadow-[#7C3AED]/15 hover:shadow-[#7C3AED]/35 cursor-pointer group animate-pulse"
        >
          <i className="fa-solid fa-plus text-sm transition-transform duration-300 group-hover:rotate-90" />
          <span>Create First Task</span>
        </button>

      </div>
    </div>
  );
};

export default TaskEmptyState;
