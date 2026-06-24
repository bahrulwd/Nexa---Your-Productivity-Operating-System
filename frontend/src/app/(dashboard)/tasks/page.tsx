import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Task } from '../../../types';
import { useSmartPriority } from '../../../hooks/use-smart-priority';
import TaskList from '../../../components/tasks/TaskList';
import TaskDetailPanel from '../../../components/tasks/TaskDetailPanel';
import AddTaskSlideOver from '../../../components/tasks/AddTaskSlideOver';
import TaskEmptyState from '../../../components/tasks/TaskEmptyState';
import TasksSkeleton from '../../../components/tasks/TasksSkeleton';
import { getDashboardCategories, getTaskCategory, getUserRole } from '../../../lib/categories';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'smart' | 'dueDate'>('smart');

  // Dropdown open states
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);

  const { calculateScore } = useSmartPriority(tasks);

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadTasks();
      setIsLoading(false);
    };
    init();
  }, []);


  // Update selected task when tasks change
  useEffect(() => {
    if (selectedTask) {
      const refreshed = tasks.find((t) => t.id === selectedTask.id);
      if (refreshed) {
        setSelectedTask(refreshed);
      }
    } else if (tasks.length > 0) {
      // Auto-select first task if none is selected
      setSelectedTask(tasks[0]);
    }
  }, [tasks]);

  if (isLoading) {
    return <TasksSkeleton />;
  }

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const created = await api.addTask(taskData);
      await loadTasks();
      setSelectedTask(created);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleUpdateTask = async (updated: Task) => {
    try {
      await api.updateTask(updated);
      await loadTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);
      if (selectedTask?.id === id) {
        setSelectedTask(null);
      }
      await loadTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    const updated: Task = {
      ...task,
      status: task.status === 'completed' ? 'todo' : 'completed',
    };
    try {
      await api.updateTask(updated);
      await loadTasks();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };


  const userRole = getUserRole();
  const categories = getDashboardCategories(userRole);

  const getCategory = (t: Task) => {
    return getTaskCategory(t.title, categories);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    // Status
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;

    // Category
    if (categoryFilter !== 'all') {
      const cat = getCategory(t);
      if (cat !== categoryFilter) return false;
    }

    // Priority
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;

    return true;
  });

  // Sort Tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'smart') {
      return calculateScore(b) - calculateScore(a);
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  const activeTasksCount = tasks.filter(t => t.status !== 'completed').length;

  return (
    <div className="flex flex-col gap-6 animate-slide-up h-full">

      {/* Page Header */}
      <div className="flex justify-between items-center select-none">
        <div className="flex items-center gap-3">
          <h1 className="text-[28px] font-black text-[#1E1E24] leading-none font-sans">My Tasks</h1>
          <span className="bg-[#e3dfff] text-[#191541] text-[12px] font-black px-2.5 py-0.5 rounded-full">
            {activeTasksCount} Active
          </span>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#7C3AED] hover:bg-opacity-95 text-white px-5 py-2.5 rounded-xl font-sans text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#7C3AED]/15 active:scale-95 transition-all cursor-pointer"
        >
          <i className="fa-solid fa-plus text-xs"></i>
          New Task
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap justify-between items-center gap-4 select-none">

        {/* Left Side Status Pills */}
        <div className="flex items-center gap-2">
          {([
            { id: 'all', label: 'All' },
            { id: 'todo', label: 'To Do' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Done' }
          ] as const).map((pill) => {
            const isActive = statusFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setStatusFilter(pill.id)}
                className={`px-4 py-2 rounded-full font-sans text-xs font-bold transition-all duration-200 cursor-pointer ${isActive
                  ? 'bg-[#15113d] text-white shadow-sm'
                  : 'bg-white border border-[#F3F4F6] text-[#9CA3AF] hover:border-[#15113d] hover:text-[#15113d]'
                  }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Right Side Dropdown Selectors */}
        <div className="flex items-center gap-4 relative z-20">

          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCategoryMenu(!showCategoryMenu);
                setShowPriorityMenu(false);
                setShowSortMenu(false);
              }}
              className="flex items-center gap-1 text-xs font-bold text-[#9CA3AF] hover:text-[#1E1E24] cursor-pointer py-1"
            >
              <span>Category: {categoryFilter === 'all' ? 'All' : categoryFilter}</span>
              <i className="fa-solid fa-chevron-down text-[10px]"></i>
            </button>
            {showCategoryMenu && (
              <div className="absolute right-0 top-7 bg-white border border-[#F3F4F6] rounded-xl shadow-lg py-1.5 min-w-[120px] animate-fade-in">
                {['all', ...categories.map((c) => c.name), 'Umum'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryFilter(cat);
                      setShowCategoryMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#F8F9FB] text-[#1E1E24] flex items-center justify-between"
                  >
                    <span>{cat === 'all' ? 'All Categories' : cat}</span>
                    {categoryFilter === cat && <i className="fa-solid fa-check text-[10px] text-[#7C3AED]"></i>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPriorityMenu(!showPriorityMenu);
                setShowCategoryMenu(false);
                setShowSortMenu(false);
              }}
              className="flex items-center gap-1 text-xs font-bold text-[#9CA3AF] hover:text-[#1E1E24] cursor-pointer py-1"
            >
              <span>Priority: {priorityFilter === 'all' ? 'All' : priorityFilter}</span>
              <i className="fa-solid fa-chevron-down text-[10px]"></i>
            </button>
            {showPriorityMenu && (
              <div className="absolute right-0 top-7 bg-white border border-[#F3F4F6] rounded-xl shadow-lg py-1.5 min-w-[120px] animate-fade-in">
                {['all', 'high', 'medium', 'low'].map((prio) => (
                  <button
                    key={prio}
                    onClick={() => {
                      setPriorityFilter(prio as any);
                      setShowPriorityMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#F8F9FB] text-[#1E1E24] flex items-center justify-between capitalize"
                  >
                    <span>{prio === 'all' ? 'All Priorities' : prio}</span>
                    {priorityFilter === prio && <i className="fa-solid fa-check text-[10px] text-[#7C3AED]"></i>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-4 w-[1px] bg-[#F3F4F6]" />

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSortMenu(!showSortMenu);
                setShowCategoryMenu(false);
                setShowPriorityMenu(false);
              }}
              className="flex items-center gap-1 text-xs font-bold text-[#9CA3AF] hover:text-[#1E1E24] cursor-pointer py-1"
            >
              <span>Sort: {sortBy === 'smart' ? 'Smart Score' : 'Due Date'}</span>
              <i className="fa-solid fa-chevron-down text-[10px]"></i>
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-7 bg-white border border-[#F3F4F6] rounded-xl shadow-lg py-1.5 min-w-[120px] animate-fade-in">
                {([
                  { id: 'smart', label: 'Smart Score' },
                  { id: 'dueDate', label: 'Due Date' }
                ] as const).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSortBy(opt.id);
                      setShowSortMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#F8F9FB] text-[#1E1E24] flex items-center justify-between"
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.id && <i className="fa-solid fa-check text-[10px] text-[#7C3AED]"></i>}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Tasks Layout Grid */}
      {tasks.length === 0 ? (
        <TaskEmptyState 
          onAddTaskClick={() => setIsAddOpen(true)} 
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-stretch flex-1 overflow-hidden">

          {/* Left Column: Tasks List (60%) */}
          <div className="w-full lg:w-[58%] flex flex-col h-full">
            <TaskList
              tasks={sortedTasks}
              selectedTaskId={selectedTask?.id}
              onSelectTask={setSelectedTask}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
            />
          </div>

          {/* Right Column: Details Panel (42%) */}
          <div className="w-full lg:w-[42%] h-full min-h-[500px]">
            {selectedTask ? (
              <TaskDetailPanel
                task={selectedTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onClose={() => setSelectedTask(null)}
              />
            ) : (
              <div className="relative flex flex-col items-center justify-center bg-white rounded-[24px] border border-[#F3F4F6] p-10 text-center h-full min-h-[400px] overflow-hidden select-none shadow-sm">

                {/* Decorative background blobs */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#7C3AED]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#FF75A0]/5 rounded-full blur-2xl pointer-events-none" />

                {/* Icon cluster */}
                <div className="relative mb-6">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 bg-[#7C3AED]/10 rounded-full blur-xl scale-150 pointer-events-none" />
                  {/* Main icon container */}
                  <div className="relative w-20 h-20 bg-gradient-to-br from-[#7C3AED]/10 to-[#FF75A0]/10 rounded-2xl border border-[#7C3AED]/15 flex items-center justify-center shadow-sm">
                    <i className="fa-regular fa-rectangle-list text-[#7C3AED] text-3xl"></i>
                  </div>
                  {/* Floating badge top-right */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#7C3AED] rounded-full flex items-center justify-center shadow-md shadow-[#7C3AED]/30">
                    <i className="fa-solid fa-arrow-pointer text-white text-[10px]"></i>
                  </div>
                </div>

                {/* Text */}
                <h3 className="font-display font-black text-[#15113d] text-[18px] mb-2">
                  Pilih Tugas untuk Mulai
                </h3>
                <p className="text-[#9CA3AF] text-xs font-semibold leading-relaxed max-w-[220px] mb-7">
                  Klik salah satu tugas di sebelah kiri untuk melihat detail, mengedit, dan mengelolanya.
                </p>

                {/* Quick tips */}
                <div className="w-full flex flex-col gap-2 max-w-[260px]">
                  {[
                    { icon: 'fa-solid fa-circle-check', text: 'Tandai tugas selesai' },
                    { icon: 'fa-solid fa-sliders', text: 'Atur prioritas & deadline' },
                    { icon: 'fa-solid fa-rocket', text: 'Mulai Focus Mode langsung' },
                  ].map((tip) => (
                    <div key={tip.text} className="flex items-center gap-3 px-3 py-2 bg-[#F8F9FB] rounded-xl border border-[#F3F4F6]">
                      <div className="w-6 h-6 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
                        <i className={`${tip.icon} text-[#7C3AED] text-[10px]`}></i>
                      </div>
                      <span className="text-[11px] font-bold text-[#47464e]">{tip.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Add Task Drawer */}
      <AddTaskSlideOver
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddTask={handleAddTask}
      />

    </div>
  );
};
export default TasksPage;
