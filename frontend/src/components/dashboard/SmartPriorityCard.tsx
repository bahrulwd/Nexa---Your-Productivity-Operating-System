import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartPriority } from '../../hooks/use-smart-priority';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const SmartPriorityCard: React.FC = () => {
  const navigate = useNavigate();
  const { topPriorityTask } = useSmartPriority();

  if (!topPriorityTask) {
    return (
      <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm flex flex-col items-center justify-center text-center h-[260px]">
        <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600 mb-3 border border-emerald-500/20">
          <i className="fa-regular fa-circle-check text-4xl"></i>
        </div>
        <h3 className="font-display font-extrabold text-lg text-nexa-indigo">All Done for Today!</h3>
        <p className="text-xs text-nexa-indigo/60 max-w-xs mt-1 leading-relaxed">
          No pending tasks left. Enjoy your day or add a new task to get ahead!
        </p>
      </div>
    );
  }

  const totalSubtasks = topPriorityTask.subtasks.length;
  const completedSubtasks = topPriorityTask.subtasks.filter((s) => s.completed).length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleStartFocus = () => {
    navigate('/focus', { state: { taskTitle: topPriorityTask.title } });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-nexa-indigo to-nexa-navy rounded-3xl p-7 text-white shadow-xl flex flex-col justify-between h-[260px] group border border-white/10">
      {/* Glow effects */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-nexa-purple/20 blur-3xl group-hover:bg-nexa-purple/35 transition-all duration-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-36 h-36 rounded-full bg-nexa-accent-pink/15 blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-nexa-accent-pink/20 text-nexa-accent-pink border border-nexa-accent-pink/35 animate-pulse">
            <i className="fa-solid fa-fire text-sm"></i>
          </div>
          <span className="text-xs font-bold tracking-wider text-nexa-peach-light uppercase">Today's Smart Priority</span>
        </div>
        <Badge variant={topPriorityTask.priority === 'high' ? 'error' : topPriorityTask.priority === 'medium' ? 'warning' : 'info'}>
          {topPriorityTask.priority}
        </Badge>
      </div>

      {/* Task Details */}
      <div className="my-3 z-10">
        <h3 className="font-display font-black text-xl md:text-2xl text-white tracking-tight leading-tight group-hover:text-nexa-peach-light transition-colors line-clamp-1">
          {topPriorityTask.title}
        </h3>
        <p className="text-xs text-white/60 mt-2.5 line-clamp-2 max-w-md leading-relaxed">
          {topPriorityTask.description || "No description provided. Click below to dive in or focus on it using the Pomodoro timer."}
        </p>
      </div>

      {/* Progress & Actions */}
      <div className="flex items-center justify-between gap-6 z-10 pt-3 border-t border-white/10">
        {/* Progress Bar */}
        <div className="flex-1 max-w-[200px]">
          <div className="flex justify-between items-center mb-1.5 text-[10px] font-bold text-white/50">
            <span>SUBTASKS</span>
            <span>{completedSubtasks}/{totalSubtasks} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-nexa-purple to-nexa-accent-pink transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Start Focus Button */}
        <Button
          onClick={handleStartFocus}
          variant="secondary"
          size="sm"
          className="flex items-center gap-1.5 hover:shadow-lg hover:shadow-white/5 active:scale-95 duration-150 shrink-0 font-bold"
        >
          <i className="fa-solid fa-play text-[10px]"></i>
          <span>Focus Now</span>
          <i className="fa-solid fa-arrow-right text-[10px]"></i>
        </Button>
      </div>
    </div>
  );
};
export default SmartPriorityCard;
