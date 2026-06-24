import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, SubTask } from '../../types';
import { getDashboardCategories, getTaskCategory, getUserRole } from '../../lib/categories';

interface TaskDetailPanelProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onClose: () => void;
}

export const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({
  task,
  onUpdateTask,
  onDeleteTask,
  onClose,
}) => {
  const navigate = useNavigate();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleFieldChange = (key: keyof Task, value: any) => {
    onUpdateTask({
      ...task,
      [key]: value,
    });
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    handleFieldChange('subtasks', updatedSubtasks);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSub: SubTask = {
      id: 'sub-' + Math.random().toString(36).substr(2, 9),
      title: newSubtaskTitle.trim(),
      completed: false,
    };

    handleFieldChange('subtasks', [...task.subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const filteredSubtasks = task.subtasks.filter((st) => st.id !== subtaskId);
    handleFieldChange('subtasks', filteredSubtasks);
  };

  const handleStartFocus = () => {
    navigate('/focus', { state: { taskTitle: task.title, taskId: task.id } });
  };

  // Score calculations
  const calculateScore = (): number => {
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
    return Math.round(baseScore + dateBonus + priorityBonus);
  };

  const score = calculateScore();

  // Evaluate Priority Label and colors
  const getPriorityDetails = (scoreVal: number) => {
    if (scoreVal >= 80) {
      return {
        label: 'Sangat Prioritas',
        color: '#7e5620',
        bg: '#FDF5EC',
        border: '#FEE2C7',
        desc: 'Task ini memiliki dampak tinggi pada timeline proyek Nexa. Selesaikan sebelum EOD.'
      };
    }
    if (scoreVal >= 65) {
      return {
        label: 'Prioritas Tinggi',
        color: '#79521b',
        bg: '#fbf8f3',
        border: '#f6ebd9',
        desc: 'Task penting untuk diselesaikan hari ini guna mencegah tumpukan tugas di sprint.'
      };
    }
    if (scoreVal >= 45) {
      return {
        label: 'Prioritas Sedang',
        color: '#ae905b',
        bg: '#fcfbfa',
        border: '#f5f0e6',
        desc: 'Task ini berkontribusi pada progress mingguan Anda. Selesaikan dalam rentang terdekat.'
      };
    }
    return {
      label: 'Prioritas Rendah',
      color: '#9CA3AF',
      bg: '#F8F9FB',
      border: '#F3F4F6',
      desc: 'Task ini memiliki prioritas rendah. Selesaikan setelah tugas penting di atas selesai.'
    };
  };

  const priorityMeta = getPriorityDetails(score);

  // Time calculations
  const daysAgo = Math.max(0, Math.floor((Date.now() - new Date(task.createdAt).getTime()) / 86400000));
  const createdStr = daysAgo === 0 ? 'Created today' : daysAgo === 1 ? 'Created yesterday' : `Created ${daysAgo} days ago`;

  // Subtasks progress
  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const percentCompleted = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // SVG dash offset calculation
  const radius = 28;
  const circumference = 2 * Math.PI * radius;

  // Score gauge dash offset
  const scorePercent = Math.min(100, Math.max(0, score));
  const scoreDashoffset = circumference - (scorePercent / 100) * circumference;

  const userRole = getUserRole();
  const categories = getDashboardCategories(userRole);

  // Category determination
  const getCategory = () => {
    return getTaskCategory(task.title, categories);
  };

  return (
    <div className="flex flex-col bg-white rounded-[24px] border border-[#F3F4F6] p-6 shadow-sm h-full max-h-[calc(100vh-14rem)] overflow-y-auto custom-scrollbar relative">
      
      {/* Detail Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2 py-0.5 bg-[#e3dfff] text-[#191541] text-[10px] font-extrabold rounded uppercase tracking-widest">
              {getCategory()}
            </span>
            <span className="text-[11px] font-semibold text-[#9CA3AF]">
              {createdStr}
            </span>
          </div>
        </div>
        
        {/* Actions Menu */}
        <div className="flex items-center gap-1.5 shrink-0 relative">
          <button
            onClick={() => setShowMoreActions(!showMoreActions)}
            className="p-1.5 text-[#9CA3AF] hover:bg-[#F8F9FB] rounded-full transition-all cursor-pointer flex items-center justify-center"
          >
            <i className="fa-solid fa-ellipsis-vertical text-sm"></i>
          </button>
          
          {showMoreActions && (
            <div className="absolute right-0 top-8 bg-white border border-[#F3F4F6] rounded-xl shadow-lg py-1.5 z-30 min-w-[120px] animate-fade-in">
              <button
                onClick={() => {
                  setShowDeleteConfirm(true);
                  setShowMoreActions(false);
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-trash-can"></i>
                Delete Task
              </button>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#15113d]/40 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white rounded-[24px] max-w-sm w-full p-7 shadow-2xl flex flex-col items-center gap-5 animate-slide-up border border-[#F3F4F6]">
                <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                  <i className="fa-solid fa-trash-can text-red-500 text-xl"></i>
                </div>
                <div className="text-center space-y-1.5 select-none">
                  <h3 className="font-sans font-black text-[18px] text-[#1E1E24]">Hapus Tugas?</h3>
                  <p className="text-xs font-semibold text-[#9CA3AF] leading-relaxed">
                    Tindakan ini tidak dapat dibatalkan. Tugas <span className="font-bold text-[#1E1E24]">"{task.title.replace(/^\[[^\]]+\]\s*/, '')}"</span> akan dihapus permanen.
                  </p>
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#1E1E24] hover:bg-[#F8F9FB] transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      onDeleteTask(task.id);
                      setShowDeleteConfirm(false);
                    }}
                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-500/20"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="text-xs font-bold text-[#9CA3AF] hover:text-[#1E1E24] px-2 py-1 hover:bg-[#F8F9FB] rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Editable Notion-like Title */}
      <div className="mb-4">
        <input
          type="text"
          value={task.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          className="w-full text-xl font-black text-[#1E1E24] bg-transparent border-b border-transparent hover:border-[#F3F4F6] focus:border-[#7C3AED] focus:outline-none py-1 transition-all leading-tight font-sans"
          placeholder="Task title"
        />
      </div>

      {/* Priority Hero Card */}
      <div
        className="rounded-xl p-4 flex items-center gap-4 border mb-6 select-none"
        style={{
          backgroundColor: priorityMeta.bg,
          borderColor: priorityMeta.border
        }}
      >
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
          <svg className="w-full h-full rotate-[-90deg]">
            <circle cx="32" cy="32" fill="none" r={28} stroke="#F3F4F6" strokeWidth="6"></circle>
            <circle
              cx="32"
              cy="32"
              fill="none"
              r={28}
              stroke={priorityMeta.color}
              strokeDasharray={175}
              strokeDashoffset={scoreDashoffset}
              strokeLinecap="round"
              strokeWidth="6"
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute font-black text-lg" style={{ color: priorityMeta.color }}>
            {score}
          </span>
        </div>
        <div>
          <h4 className="font-bold text-sm" style={{ color: priorityMeta.color }}>
            {priorityMeta.label}
          </h4>
          <p className="text-[#9CA3AF] text-[11px] leading-relaxed mt-0.5 font-medium">
            {priorityMeta.desc}
          </p>
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <label className="text-xs font-bold text-[#1E1E24] block mb-1.5">Description</label>
        <textarea
          value={task.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="Complete the high-fidelity UI implementation. Ensure all hover transitions and responsive behaviors are set..."
          className="w-full min-h-[90px] p-3 text-xs bg-[#F8F9FB] border border-[#F3F4F6] rounded-xl text-[#9CA3AF] leading-relaxed focus:outline-none focus:border-[#7C3AED] focus:bg-white focus:text-[#1E1E24] transition-all resize-none"
        />
      </div>

      {/* Subtasks Progress */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center select-none">
          <h4 className="text-xs font-bold text-[#1E1E24]">Subtasks ({completedSubtasks}/{totalSubtasks})</h4>
          <span className="text-xs font-bold text-[#7C3AED]">{percentCompleted}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#F8F9FB] border border-[#F3F4F6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#15113d] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentCompleted}%` }}
          />
        </div>

        {/* Subtasks List */}
        <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
          {task.subtasks.map((st) => (
            <label
              key={st.id}
              className="flex items-center justify-between p-2 hover:bg-[#F8F9FB] rounded-xl cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() => handleToggleSubtask(st.id)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => handleToggleSubtask(st.id)}
                  className="shrink-0 flex items-center justify-center"
                >
                  {st.completed ? (
                    <i className="fa-solid fa-circle-check text-base text-[#15113d]"></i>
                  ) : (
                    <i className="fa-regular fa-circle text-base text-[#9CA3AF] hover:text-[#7C3AED]"></i>
                  )}
                </button>
                <span
                  className={`text-xs font-medium truncate ${
                    st.completed ? 'line-through text-[#9CA3AF]' : 'text-[#1E1E24]'
                  }`}
                >
                  {st.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteSubtask(st.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </label>
          ))}
          
          {task.subtasks.length === 0 && (
            <div className="text-[11px] text-[#9CA3AF] italic text-center py-4 font-medium">
              No subtasks defined yet.
            </div>
          )}
        </div>

        {/* Add Subtask Form */}
        <form onSubmit={handleAddSubtask} className="flex gap-2">
          <input
            type="text"
            placeholder="Add subtask step..."
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#F8F9FB] border border-[#F3F4F6] rounded-xl text-xs outline-none focus:bg-white focus:border-[#7C3AED] placeholder:text-[#9CA3AF]"
          />
          <button
            type="submit"
            className="px-3 bg-[#15113d] text-white hover:bg-opacity-90 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <i className="fa-solid fa-plus text-xs"></i>
          </button>
        </form>
      </div>

      {/* Accordion Smart Settings */}
      <div className="border-t border-[#F3F4F6] pt-4 mb-4">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between text-xs font-bold text-[#1E1E24] hover:text-[#7C3AED] transition-colors cursor-pointer py-1 select-none"
        >
          <span>TASK ATTRIBUTES & WEIGHTS</span>
          {showSettings ? <i className="fa-solid fa-chevron-up text-xs"></i> : <i className="fa-solid fa-chevron-down text-xs"></i>}
        </button>

        {showSettings && (
          <div className="mt-4 flex flex-col gap-4 animate-slide-down">
            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#9CA3AF] block mb-1">Status</label>
                <select
                  value={task.status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F9FB] border border-[#F3F4F6] rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#7C3AED]"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#9CA3AF] block mb-1">Priority</label>
                <select
                  value={task.priority}
                  onChange={(e) => handleFieldChange('priority', e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F9FB] border border-[#F3F4F6] rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#7C3AED]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-[11px] font-bold text-[#9CA3AF] block mb-1 flex items-center gap-1.5">
                <i className="fa-solid fa-calendar text-[10px]"></i> Due Date
              </label>
              <input
                type="date"
                value={task.dueDate || ''}
                onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F9FB] border border-[#F3F4F6] rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#7C3AED]"
              />
            </div>

            {/* Smart Weights sliders */}
            <div className="bg-[#F8F9FB] rounded-xl p-3 border border-[#F3F4F6] flex flex-col gap-3">
              <h5 className="text-[10px] font-extrabold text-[#15113d] uppercase tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-star text-[#7C3AED]"></i> Smart Score Modifiers
              </h5>

              {/* Importance */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-bold text-[#9CA3AF]">
                  <span className="flex items-center gap-1"><i className="fa-solid fa-award text-xs"></i> Importance</span>
                  <span>{task.importance || 3}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={task.importance || 3}
                  onChange={(e) => handleFieldChange('importance', parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
                />
              </div>

              {/* Effort */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-bold text-[#9CA3AF]">
                  <span className="flex items-center gap-1"><i className="fa-solid fa-clock text-xs"></i> Effort</span>
                  <span>{task.effort || 3}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={task.effort || 3}
                  onChange={(e) => handleFieldChange('effort', parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
                />
              </div>

              {/* Complexity */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-bold text-[#9CA3AF]">
                  <span className="flex items-center gap-1"><i className="fa-solid fa-gauge-high text-xs"></i> Complexity</span>
                  <span>{task.complexity || 3}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={task.complexity || 3}
                  onChange={(e) => handleFieldChange('complexity', parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-auto pt-4 border-t border-[#F3F4F6] flex gap-3">
        <button
          onClick={handleStartFocus}
          className="flex-1 bg-[#15113d] hover:bg-opacity-95 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all text-xs cursor-pointer shadow-md shadow-[#15113d]/10"
        >
          <i className="fa-solid fa-play text-xs"></i>
          Start Focus Mode
        </button>
        <button
          onClick={() => alert('Sharing features coming soon!')}
          className="w-12 h-12 border border-[#F3F4F6] text-[#9CA3AF] hover:text-[#1E1E24] hover:bg-[#F8F9FB] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0"
          title="Share task"
        >
          <i className="fa-solid fa-share-nodes text-sm"></i>
        </button>
      </div>

    </div>
  );
};
export default TaskDetailPanel;
