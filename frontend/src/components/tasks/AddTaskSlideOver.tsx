import React, { useState } from 'react';
import { SlideOver } from '../ui/SlideOver';
import { Task } from '../../types';
import { getDashboardCategories, getUserRole } from '../../lib/categories';

interface AddTaskSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const AddTaskSlideOver: React.FC<AddTaskSlideOverProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const userRole = getUserRole();
  const categories = getDashboardCategories(userRole);
  const [category, setCategory] = useState<string>(categories[0].name);
  const [dueDate, setDueDate] = useState('');
  
  // Smart Priority Parameter States
  const [duration, setDuration] = useState<number>(45);
  const [urgency, setUrgency] = useState<number>(3);
  const [impact, setImpact] = useState<number>(4);
  const [difficulty, setDifficulty] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Smart Mapping: Category tagging in title
    const finalTitle = `[${category}] ${title.trim()}`;

    // Smart Mapping: Estimated Duration to Effort weight (1-5)
    // Less duration = less effort required
    let effort = 3;
    if (duration <= 15) effort = 1;
    else if (duration <= 30) effort = 2;
    else if (duration <= 60) effort = 3;
    else if (duration <= 120) effort = 4;
    else effort = 5;

    // Smart Mapping: Urgency level to priority tag
    let priority: 'low' | 'medium' | 'high' = 'medium';
    if (urgency >= 4) priority = 'high';
    else if (urgency <= 2) priority = 'low';

    // Submit
    onAddTask({
      title: finalTitle,
      description: description.trim() || undefined,
      status: 'todo',
      priority,
      dueDate: dueDate || undefined,
      importance: impact, // Impact maps to importance weight
      effort,
      complexity: difficulty, // Difficulty maps to complexity weight
      subtasks: [],
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setCategory(categories[0].name);
    setDueDate('');
    setDuration(45);
    setUrgency(3);
    setImpact(4);
    setDifficulty(1);
    onClose();
  };

  return (
    <SlideOver isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between gap-5 font-sans select-none">
        
        {/* Scrollable Form Body */}
        <div className="flex-1 space-y-5 overflow-y-auto pr-1 custom-scrollbar">
          
          {/* Task Title */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#47464e]">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Design Landing Page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-[#F3F4F6] rounded-xl text-xs font-semibold text-[#1E1E24] outline-none focus:ring-2 focus:ring-[#15113d]/10 focus:border-[#15113d] placeholder:text-[#9CA3AF] transition-all"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#47464e]">Description</label>
            <textarea
              placeholder="Add some details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-[#F3F4F6] rounded-xl text-xs font-semibold text-[#1E1E24] outline-none focus:ring-2 focus:ring-[#15113d]/10 focus:border-[#15113d] placeholder:text-[#9CA3AF] resize-none transition-all"
            />
          </div>

          {/* Classification grid (2-column) */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Category dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#47464e]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border border-[#F3F4F6] rounded-xl text-xs font-semibold text-[#1E1E24] outline-none focus:ring-2 focus:ring-[#15113d]/10 focus:border-[#15113d]"
              >
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
                <option value="Umum">Umum</option>
              </select>
            </div>

            {/* Deadline date */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#47464e]">Deadline</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#F3F4F6] rounded-xl text-xs font-semibold text-[#1E1E24] outline-none focus:ring-2 focus:ring-[#15113d]/10 focus:border-[#15113d]"
              />
            </div>

          </div>

          {/* Smart Priority Parameters Bento Section */}
          <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-[#F3F4F6] space-y-4">
            
            {/* Bento header */}
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-bolt text-[#15113d]"></i>
              <h3 className="text-[10px] font-extrabold text-[#15113d] uppercase tracking-wider">Priority Parameters</h3>
            </div>

            {/* Estimated Duration */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#47464e]">Estimated Duration</label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  placeholder="45"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 pr-16 border border-[#F3F4F6] bg-white rounded-xl text-xs font-semibold text-[#1E1E24] outline-none focus:ring-2 focus:ring-[#15113d]/10 focus:border-[#15113d]"
                />
                <span className="absolute right-4 text-[#9CA3AF] text-[10px] font-extrabold uppercase select-none">minutes</span>
              </div>
            </div>

            {/* Urgency Level */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-[#9CA3AF]">
                <label className="text-xs font-bold text-[#47464e]">Urgency Level</label>
                <div className="flex gap-2">
                  <span>1 (Low)</span>
                  <span>•</span>
                  <span>5 (High)</span>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isActive = urgency === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setUrgency(val)}
                      className={`flex-1 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#15113d] text-white border-[#15113d]'
                          : 'bg-white border-[#F3F4F6] text-[#1E1E24] hover:border-[#15113d]'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Impact Level */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-[#9CA3AF]">
                <label className="text-xs font-bold text-[#47464e]">Impact Level</label>
                <div className="flex gap-2">
                  <span>1 (Low)</span>
                  <span>•</span>
                  <span>5 (High)</span>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isActive = impact === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setImpact(val)}
                      className={`flex-1 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#15113d] text-white border-[#15113d]'
                          : 'bg-white border-[#F3F4F6] text-[#1E1E24] hover:border-[#15113d]'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-[#9CA3AF]">
                <label className="text-xs font-bold text-[#47464e]">Difficulty</label>
                <div className="flex gap-2">
                  <span>1 (Low)</span>
                  <span>•</span>
                  <span>5 (High)</span>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isActive = difficulty === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDifficulty(val)}
                      className={`flex-1 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#15113d] text-white border-[#15113d]'
                          : 'bg-white border-[#F3F4F6] text-[#1E1E24] hover:border-[#15113d]'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Fixed Footer */}
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-[#F3F4F6] mt-4 shrink-0 select-none">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-sans text-xs font-bold text-[#9CA3AF] hover:text-[#15113d] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#15113d] text-white hover:bg-opacity-95 font-sans text-xs font-bold rounded-full shadow-lg shadow-[#15113d]/15 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Create Task</span>
            <i className="fa-solid fa-square-check"></i>
          </button>
        </div>

      </form>
    </SlideOver>
  );
};
export default AddTaskSlideOver;
