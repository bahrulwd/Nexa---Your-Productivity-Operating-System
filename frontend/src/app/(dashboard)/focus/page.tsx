import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFocusTimer } from '../../../hooks/use-focus-timer';
import { api } from '../../../lib/api';
import FocusSkeleton from '../../../components/focus/FocusSkeleton';
import { startAlarmLoop, stopAlarmLoop } from '../../../lib/audio';

export const FocusPage: React.FC = () => {
  const location = useLocation();
  const preloadedTask = location.state?.taskTitle || '';
  const preloadedTaskId = location.state?.taskId || '';

  // Clean bracketed category prefixes (e.g. "[Rencana & Strategi] Task" -> "Task")
  const [focusTask] = useState(
    (preloadedTask || 'General Deep Work').replace(/^\[[^\]]+\]\s*/, '')
  );
  const [isLoading, setIsLoading] = useState(true);
  
  // Reflection fields (mockup Indonesian labels)
  const [achieved, setAchieved] = useState('');
  const [blockers, setBlockers] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  
  const [reflections, setReflections] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Alarm States
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  const {
    mode,
    secondsLeft,
    isActive,
    totalDuration,
    setMode,
    toggleTimer,
    resetTimer,
    formattedTime,
  } = useFocusTimer();

  // Circular progress math (mockup SVG styling viewbox 0 0 100 100)
  const radius = 48;
  const circumference = 2 * Math.PI * radius; // 301.59
  const progress = (secondsLeft / totalDuration) * circumference;
  const strokeDashoffset = circumference - progress;

  // Load reflections from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nexa_reflections');
    if (saved) {
      setReflections(JSON.parse(saved));
    }
    
    // Simulate loading for the loading skeleton mockup
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Trigger Alarm when Focus Session ends (secondsLeft === 0)
  useEffect(() => {
    if (secondsLeft === 0 && !isActive && mode === 'focus') {
      if (!alarmTriggered) {
        setShowAlarmModal(true);
        setAlarmTriggered(true);
      }
    } else {
      // Reset trigger flag when timer is started or reset
      setAlarmTriggered(false);
    }
  }, [secondsLeft, isActive, mode, alarmTriggered]);

  // Audio and browser tab title flashing side-effects
  useEffect(() => {
    if (showAlarmModal) {
      const originalTitle = document.title;
      let isChimeTitle = false;
      
      // Start dynamic audio loop
      startAlarmLoop();
      
      const interval = setInterval(() => {
        document.title = isChimeTitle ? originalTitle : '⏰ Sesi Fokus Selesai!';
        isChimeTitle = !isChimeTitle;
      }, 1000);

      return () => {
        stopAlarmLoop();
        clearInterval(interval);
        document.title = originalTitle;
      };
    }
  }, [showAlarmModal]);

  const handleSkip = () => {
    if (mode === 'focus') {
      setMode('short_break');
    } else if (mode === 'short_break') {
      setMode('long_break');
    } else {
      setMode('focus');
    }
  };

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achieved.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const log = `[${timeStr}] Task: ${focusTask} | Hasil: ${achieved.trim()} ${blockers.trim() ? `| Kendala: ${blockers.trim()}` : ''} ${nextSteps.trim() ? `| Next: ${nextSteps.trim()}` : ''}`;
    
    const updatedLogs = [log, ...reflections];
    setReflections(updatedLogs);
    localStorage.setItem('nexa_reflections', JSON.stringify(updatedLogs));

    // Mark task as completed if it exists
    if (preloadedTaskId) {
      try {
        const tasks = await api.getTasks();
        const target = tasks.find(t => t.id === preloadedTaskId);
        if (target) {
          target.status = 'completed';
          await api.updateTask(target);
        }
      } catch (err) {
        console.error('Failed to complete focus task:', err);
      }
    }

    // Reset Form
    setAchieved('');
    setBlockers('');
    setNextSteps('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const getSessionLabel = () => {
    if (mode === 'focus') return 'Focus Mode: Deep Work';
    if (mode === 'short_break') return 'Short Break: Relax and Recharge';
    return 'Long Break: Walk and Meditate';
  };

  if (isLoading) {
    return <FocusSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-up pb-8">
      
      {/* Modes Bar Selector */}
      <div className="flex justify-center select-none">
        <div className="flex gap-2 p-1 bg-[#F8F9FB] border border-[#F3F4F6] rounded-2xl bg-white shadow-sm">
          {(['focus', 'short_break', 'long_break'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === m
                  ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/15'
                  : 'text-[#9CA3AF] hover:text-[#1E1E24] hover:bg-[#F8F9FB]'
              }`}
            >
              {m === 'focus' ? 'Focus Mode' : m === 'short_break' ? 'Short Break' : 'Long Break'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Focus Timer (Bento Card - lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#F3F4F6] p-8 flex flex-col items-center justify-center text-center gap-6 shadow-sm min-h-[480px]">

          {/* Task Info */}
          <div className="space-y-1">
            <h2 className="font-sans font-black text-2xl text-[#1E1E24]">
              {focusTask}
            </h2>
            <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider">
              {getSessionLabel()}
            </p>
          </div>

          {/* Massive Countdown Timer */}
          <div className="relative flex items-center justify-center w-72 h-72 select-none shrink-0 my-4">
            <div className="font-sans text-[84px] font-black text-[#15113d] tabular-nums tracking-tighter z-10 leading-none">
              {formattedTime}
            </div>

            {/* Circular Progress Indicator */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                fill="none"
                r={radius}
                stroke="#F3F4F6"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                fill="none"
                r={radius}
                stroke="#7C3AED"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="2"
                className="transition-all duration-300 ease-linear"
              />
            </svg>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 select-none">
            {/* Stop/Reset */}
            <button
              onClick={resetTimer}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-[#F3F4F6] text-[#9CA3AF] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all active:scale-90 cursor-pointer"
              title="Stop session"
            >
              <i className="fa-solid fa-stop text-sm"></i>
            </button>

            {/* Play/Pause */}
            <button
              onClick={toggleTimer}
              className={`w-20 h-20 flex items-center justify-center rounded-full text-white shadow-lg hover:brightness-110 transition-all active:scale-95 cursor-pointer ${
                isActive ? 'bg-[#15113d]' : 'bg-[#7C3AED]'
              }`}
              id="play-pause-btn"
              title={isActive ? 'Pause timer' : 'Start focus timer'}
            >
              {isActive ? (
                <i className="fa-solid fa-pause text-3xl"></i>
              ) : (
                <i className="fa-solid fa-play text-3xl translate-x-0.5"></i>
              )}
            </button>

            {/* Skip */}
            <button
              onClick={handleSkip}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-[#F3F4F6] text-[#9CA3AF] hover:text-[#1E1E24] hover:bg-[#F8F9FB] transition-all active:scale-90 cursor-pointer"
              title="Skip segment"
            >
              <i className="fa-solid fa-forward text-base"></i>
            </button>
          </div>
        </div>

        {/* Right Column: Reflection Form (Bento Card - lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white rounded-[24px] border border-[#F3F4F6] p-6 shadow-sm flex flex-col flex-grow relative min-h-[480px]">
            
            {/* Card Header */}
            <div className="flex justify-between items-center mb-6 select-none">
              <div className="flex items-center gap-2">
                <h3 className="font-sans font-black text-lg text-[#1E1E24]">Progress Reflection</h3>
                <i className="fa-regular fa-file-lines text-[#9CA3AF] text-sm"></i>
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-1.5 text-[#9CA3AF] hover:text-[#1E1E24] hover:bg-[#F8F9FB] rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                title="Toggle reflection history logs"
              >
                <i className="fa-solid fa-clock-rotate-left text-xs"></i>
                <span>History</span>
              </button>
            </div>

            {showHistory ? (
              /* Reflections History Log List */
              <div className="flex flex-col gap-3 flex-grow overflow-y-auto max-h-[360px] pr-1">
                <h4 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider select-none mb-1">Past Reflection Notes</h4>
                {reflections.map((log, index) => (
                  <div key={index} className="p-3 bg-[#F8F9FB] border border-[#F3F4F6] rounded-xl text-xs text-[#1E1E24] leading-relaxed font-semibold">
                    {log}
                  </div>
                ))}
                {reflections.length === 0 && (
                  <div className="text-[11px] text-[#9CA3AF] italic text-center py-12 select-none font-medium">
                    No reflection entries found. Complete a focus session and save notes.
                  </div>
                )}
              </div>
            ) : (
              /* Reflection Form */
              <form onSubmit={handleSaveReflection} className="flex flex-col gap-4 flex-grow h-full justify-between">
                
                {/* Result Achieved */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#47464e] select-none">Hasil yang dicapai</label>
                  <textarea
                    required
                    value={achieved}
                    onChange={(e) => setAchieved(e.target.value)}
                    placeholder="What did you achieve in this session?"
                    className="w-full bg-[#F3F4F6] border-none rounded-xl p-4 font-sans text-xs text-[#1E1E24] placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none resize-none min-h-[80px]"
                  />
                </div>

                {/* Blockers Distractions */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#47464e] select-none">Kendala yang dihadapi</label>
                  <textarea
                    value={blockers}
                    onChange={(e) => setBlockers(e.target.value)}
                    placeholder="Any blockers or distractions?"
                    className="w-full bg-[#F3F4F6] border-none rounded-xl p-4 font-sans text-xs text-[#1E1E24] placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none resize-none min-h-[80px]"
                  />
                </div>

                {/* Next Steps */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#47464e] select-none">Langkah selanjutnya</label>
                  <textarea
                    value={nextSteps}
                    onChange={(e) => setNextSteps(e.target.value)}
                    placeholder="What's the immediate next step?"
                    className="w-full bg-[#F3F4F6] border-none rounded-xl p-4 font-sans text-xs text-[#1E1E24] placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none resize-none min-h-[80px]"
                  />
                </div>

                {/* Success Indicator feedback */}
                {successMsg && (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-fade-in select-none">
                    <i className="fa-regular fa-circle-check text-xs"></i> Reflection saved and synced successfully!
                  </span>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="mt-auto w-full bg-[#7C3AED] hover:brightness-110 text-white py-3.5 rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-[#7C3AED]/10 select-none"
                >
                  <i className="fa-regular fa-circle-check text-sm"></i>
                  Save Reflection & Mark as Done
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

      {/* Alarm Modal Overlay */}
      {showAlarmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#15113d]/45 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white/80 border border-white/60 backdrop-blur-xl rounded-[32px] max-w-sm w-full p-8 text-center shadow-2xl flex flex-col items-center gap-6 animate-slide-up">
            
            {/* Pulsing Ring & Wobbling Bell */}
            <div className="relative w-24 h-24 flex items-center justify-center select-none">
              {/* Outer soft glowing rings */}
              <div className="absolute inset-0 bg-[#7C3AED]/20 rounded-full animate-ping pointer-events-none"></div>
              <div className="absolute inset-2 bg-[#FF75A0]/20 rounded-full animate-pulse pointer-events-none"></div>
              
              {/* Inner solid purple bell container */}
              <div className="relative w-16 h-16 bg-[#7C3AED] rounded-full flex items-center justify-center text-white text-3xl shadow-lg shadow-[#7C3AED]/30 animate-bell-ring">
                <i className="fa-solid fa-bell animate-wiggle"></i>
              </div>
            </div>

            {/* Modal Heading & Text */}
            <div className="space-y-2 select-none">
              <h3 className="font-sans font-black text-2xl text-[#1E1E24]">
                Sesi Fokus Selesai!
              </h3>
              <p className="text-xs font-semibold text-[#9CA3AF] leading-relaxed">
                Luar biasa! Anda telah menyelesaikan sesi fokus Anda. Sekarang saatnya mengistirahatkan pikiran sejenak.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-3 select-none">
              <button
                onClick={() => {
                  setMode('short_break');
                  setShowAlarmModal(false);
                }}
                className="w-full bg-[#7C3AED] hover:brightness-110 text-white py-3.5 rounded-2xl font-sans text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#7C3AED]/15 transition-all active:scale-[0.98] cursor-pointer"
              >
                <i className="fa-solid fa-coffee"></i>
                Mulai Istirahat (5 Menit)
              </button>
              
              <button
                onClick={() => {
                  setMode('focus');
                  setShowAlarmModal(false);
                }}
                className="w-full bg-[#F8F9FB] hover:bg-[#F3F4F6] text-[#1E1E24] py-3.5 rounded-2xl font-sans text-xs font-bold flex items-center justify-center gap-2 border border-[#E5E7EB] transition-all active:scale-[0.98] cursor-pointer"
              >
                <i className="fa-solid fa-arrow-rotate-right"></i>
                Mulai Fokus Baru
              </button>

              <button
                onClick={() => setShowAlarmModal(false)}
                className="w-full text-[#9CA3AF] hover:text-[#1E1E24] text-[11px] font-bold transition-all py-1 cursor-pointer"
              >
                Tutup Peringatan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default FocusPage;
