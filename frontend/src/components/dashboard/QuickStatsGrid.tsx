import React from 'react';
import { Task } from '../../types';

interface QuickStatsGridProps {
  tasks: Task[];
}

export const QuickStatsGrid: React.FC<QuickStatsGridProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const avgComplexity = total > 0 
    ? (tasks.reduce((sum, t) => sum + t.complexity, 0) / total).toFixed(1)
    : '0.0';

  const stats = [
    {
      title: 'Completion Rate',
      value: `${rate}%`,
      subtitle: `${completed} of ${total} finished`,
      icon: 'fa-solid fa-trophy',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Active Workload',
      value: pending.toString(),
      subtitle: 'Tasks to do or in-progress',
      icon: 'fa-regular fa-clock',
      color: 'text-nexa-purple bg-nexa-purple/10 border-nexa-purple/20',
    },
    {
      title: 'Avg Complexity',
      value: `${avgComplexity}/5.0`,
      subtitle: 'Cognitive load index',
      icon: 'fa-solid fa-chart-simple',
      color: 'text-nexa-accent-cyan bg-nexa-accent-cyan/10 border-nexa-accent-cyan/20',
    },
    {
      title: 'Completed Tasks',
      value: completed.toString(),
      subtitle: 'Milestones achieved',
      icon: 'fa-regular fa-circle-check',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        return (
          <div
            key={i}
            className="bg-white/45 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm flex flex-col justify-between hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-nexa-indigo/50 uppercase tracking-wider">
                {stat.title}
              </span>
              <div className={`w-8 h-8 flex items-center justify-center rounded-xl border ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                <i className={`${stat.icon} text-sm`}></i>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-display font-black text-3xl text-nexa-indigo tracking-tight">
                {stat.value}
              </h4>
              <p className="text-xs text-nexa-indigo/60 font-medium mt-1 leading-none">
                {stat.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default QuickStatsGrid;
