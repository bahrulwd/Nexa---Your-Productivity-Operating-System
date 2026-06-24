import React, { useState } from 'react';
import { Task } from '../../types';
import { cn } from '../../lib/utils';
import { getDashboardCategories, getTaskCategory, getUserRole } from '../../lib/categories';

interface TaskListProps {
  tasks: Task[];
  selectedTaskId?: string;
  onSelectTask: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  onToggleComplete,
  onDeleteTask,
}) => {
  const [pendingDeleteTask, setPendingDeleteTask] = useState<Task | null>(null);

  // A clean and consistent score calculator for display only
  const getDisplayScore = (task: Task): number => {
    const importance = task.importance || 3;
    const complexity = task.complexity || 3;
    const effort = task.effort || 3;
    const baseScore = (importance * 4) + ((6 - effort) * 2.5) + (complexity * 1.5);

    let dateBonus = 0;
    if (task.dueDate) {
      const today = new Date().toISOString().split('T')[0];
      if (task.dueDate === today) {
        dateBonus = 8;
      } else if (task.dueDate < today) {
        dateBonus = 12;
      }
    }
    const priorityBonus = task.priority === 'high' ? 5 : task.priority === 'medium' ? 2 : 0;
    return baseScore + dateBonus + priorityBonus;
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-[#7e5620]';
    if (score >= 65) return 'text-[#79521b]';
    if (score >= 45) return 'text-[#ae905b]';
    return 'text-[#9CA3AF]';
  };

  const userRole = getUserRole();
  const categories = getDashboardCategories(userRole);

  const getCategory = (task: Task) => {
    return getTaskCategory(task.title, categories);
  };

  return (
    <>
      <div className="flex flex-col gap-4 overflow-y-auto pr-1 max-h-[calc(100vh-14rem)] custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="bg-white border border-[#F3F4F6] rounded-2xl p-12 text-center text-[#9CA3AF] font-bold text-sm">
            No tasks found matching this criteria.
          </div>
        ) : (
          tasks.map((task) => {
            const isSelected = selectedTaskId === task.id;
            const isCompleted = task.status === 'completed';
            const score = Math.round(getDisplayScore(task));
            const category = getCategory(task);

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className={cn(
                  "bg-white p-4 rounded-2xl flex items-center justify-between group cursor-pointer transition-all duration-300",
                  isSelected
                    ? "border-2 border-[#c5c1f7] shadow-md shadow-[#c5c1f7]/10 bg-white"
                    : "border border-[#F3F4F6] hover:border-[#15113d] hover:bg-[#fcf8fd] shadow-sm"
                )}
              >
                {/* Left Group */}
                <div className="flex items-center gap-4 flex-1 min-w-0 mr-4">
                  {/* Status Toggle Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(task);
                    }}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 select-none",
                      isCompleted
                        ? "bg-[#e3dfff] text-[#15113d]"
                        : "bg-[#F8F9FB] text-[#9CA3AF] border border-[#F3F4F6] hover:border-[#7C3AED] hover:bg-white"
                    )}
                    title={isCompleted ? "Mark as Active" : "Mark as Completed"}
                  >
                    {isCompleted ? (
                      <i className="fa-solid fa-circle-check text-lg"></i>
                    ) : (
                      <i className="fa-regular fa-circle text-lg"></i>
                    )}
                  </button>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        "font-sans font-bold text-[#1E1E24] text-[15px] transition-colors leading-snug truncate",
                        isCompleted ? "line-through text-[#9CA3AF] font-semibold" : "group-hover:text-[#7C3AED]"
                      )}
                    >
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                      {task.dueDate && (
                        <span className="text-xs text-[#9CA3AF] flex items-center gap-1 font-semibold">
                          <i className="fa-solid fa-calendar text-[11px] text-[#9CA3AF]"></i>
                          {task.dueDate}
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-[#F8F9FB] border border-[#F3F4F6] rounded text-[10px] font-bold text-[#9CA3AF]">
                        {category}
                      </span>
                      {task.subtasks.length > 0 && (
                        <span className="text-[10px] font-bold text-[#7C3AED] bg-[#7C3AED]/5 px-2 py-0.5 rounded">
                          {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Subtasks
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Group: Score and Quick Actions */}
                <div className="flex items-center gap-5">
                  {/* Quick Delete (visible on hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteTask(task);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer shrink-0"
                    title="Delete task"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>

                  {/* Priority Score Display */}
                  <div className="text-right shrink-0 select-none min-w-[70px]">
                    <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider leading-none mb-1">
                      Priority Score
                    </div>
                    <div className={cn("text-xl font-black font-sans leading-none", getScoreColorClass(score))}>
                      {isCompleted ? '-' : score}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {pendingDeleteTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#15113d]/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-7 shadow-2xl flex flex-col items-center gap-5 animate-slide-up border border-[#F3F4F6]">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
              <i className="fa-solid fa-trash-can text-red-500 text-xl"></i>
            </div>
            <div className="text-center space-y-1.5 select-none">
              <h3 className="font-sans font-black text-[18px] text-[#1E1E24]">Hapus Tugas?</h3>
              <p className="text-xs font-semibold text-[#9CA3AF] leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Tugas{' '}
                <span className="font-bold text-[#1E1E24]">"{pendingDeleteTask.title.replace(/^\[[^\]]+\]\s*/, '')}"</span>{' '}
                akan dihapus permanen.
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setPendingDeleteTask(null)}
                className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#1E1E24] hover:bg-[#F8F9FB] transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteTask(pendingDeleteTask.id);
                  setPendingDeleteTask(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-500/20"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default TaskList;
