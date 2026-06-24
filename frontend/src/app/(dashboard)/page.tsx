import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Task } from '../../types';
import { useSmartPriority } from '../../hooks/use-smart-priority';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import { getDashboardCategories, getTaskCategory, getUserRole } from '../../lib/categories';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { topPriorityTask, calculateScore } = useSmartPriority(tasks);

  useEffect(() => {
    const load = async () => {
      try {
        const [fetchedTasks, fetchedUser] = await Promise.all([
          api.getTasks(),
          api.getCurrentUser(),
        ]);
        setTasks(fetchedTasks);
        setUser(fetchedUser);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);


  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Determine greeting
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';

  // Calculate workloads
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;

  const completedPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const inProgressPct = totalTasks > 0 ? Math.round((inProgressCount / totalTasks) * 100) : 0;
  const todoPct = totalTasks > 0 ? 100 - completedPct - inProgressPct : 0;

  const userRole = getUserRole();
  const categories = getDashboardCategories(userRole);

  const cat1Count = tasks.filter((t) => 
    getTaskCategory(t.title, categories) === categories[0].name
  ).length;

  const cat2Count = tasks.filter((t) => 
    getTaskCategory(t.title, categories) === categories[1].name
  ).length;

  const cat3Count = tasks.filter((t) => 
    getTaskCategory(t.title, categories) === categories[2].name
  ).length;

  // Upcoming tasks logic
  const upcomingTasks = tasks
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    })
    .slice(0, 3);

  const getCategoryDetails = (t: Task) => {
    const catName = getTaskCategory(t.title, categories);
    
    // Check Category 1
    if (catName === categories[0].name) {
      return {
        category: categories[0].name,
        label: categories[0].name,
        icon: categories[0].icon,
        bg: '#e3dfff', // pastel purple
        color: '#15113d',
      };
    }
    
    // Check Category 2
    if (catName === categories[1].name) {
      return {
        category: categories[1].name,
        label: categories[1].name,
        icon: categories[1].icon,
        bg: '#e0f2fe', // pastel blue
        color: '#0369a1',
      };
    }
    
    // Check Category 3
    if (catName === categories[2].name) {
      return {
        category: categories[2].name,
        label: categories[2].name,
        icon: categories[2].icon,
        bg: '#fef3c7', // pastel yellow
        color: '#b45309',
      };
    }
    
    // Fallback/Personal
    return {
      category: 'Umum',
      label: 'Umum',
      icon: 'fa-regular fa-file-lines',
      bg: '#f3f4f6',
      color: '#4b5563',
    };
  };

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return 'Tanpa tenggat';
    
    const today = new Date().toISOString().split('T')[0];
    
    const tomorrowObj = new Date();
    tomorrowObj.setDate(tomorrowObj.getDate() + 1);
    const tomorrow = tomorrowObj.toISOString().split('T')[0];
    
    if (dateStr === today) return 'Hari ini';
    if (dateStr === tomorrow) return 'Besok';
    
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  };

  // Donut chart calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339.3
  const strokeDashoffset = circumference - (circumference * completedPct) / 100;

  const handleStartFocus = () => {
    if (topPriorityTask) {
      navigate('/focus', { state: { taskTitle: topPriorityTask.title } });
    } else {
      navigate('/focus');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      
      {/* Row 1: Hero Card and Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hero Card */}
        <div className="lg:col-span-2 bg-[#fec886] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[240px] hover:translate-y-[-2px] transition-transform duration-200 shadow-sm border border-white/20">
          <div className="z-10">
            <h1 className="font-display font-extrabold text-[28px] leading-[36px] text-[#15113d] mb-2">
              {greeting}, {user?.name || 'Muhammad Bahrul Widad'}!
            </h1>
            {topPriorityTask ? (
              <p className="font-sans text-[16px] leading-[24px] text-[#15113d]/80 max-w-xl">
                Fokus utama Anda hari ini: <span className="font-bold">{topPriorityTask.title.replace(/^\[[^\]]+\]\s*/, '')}</span>. 
                <br />Skor Prioritas:{' '}
                <span className="bg-[#15113d] text-white px-2.5 py-0.5 rounded-full text-xs font-bold ml-1.5">
                  {calculateScore(topPriorityTask).toFixed(0)}
                </span>
              </p>
            ) : (
              <p className="font-sans text-[16px] leading-[24px] text-[#15113d]/80 max-w-xl">
                Semua tugas selesai untuk hari ini! Nikmati waktu santai Anda atau tambahkan tugas baru.
              </p>
            )}
          </div>
          
          <div className="mt-4 z-10">
            {topPriorityTask ? (
              <button
                onClick={handleStartFocus}
                className="bg-[#15113d] text-white px-6 py-2.5 rounded-xl font-sans font-semibold text-[14px] flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-[#15113d]/20 active:scale-95 duration-100"
              >
                <i className="fa-solid fa-play text-[14px]"></i>
                <span>Mulai Focus Mode</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/tasks')}
                className="bg-[#15113d] text-white px-6 py-2.5 rounded-xl font-sans font-semibold text-[14px] flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-[#15113d]/20 active:scale-95 duration-100"
              >
                <i className="fa-solid fa-plus text-[14px]"></i>
                <span>Tambah Tugas Baru</span>
              </button>
            )}
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#15113d]/5 rounded-full" />
        </div>

        {/* Workload Monitoring Card */}
        <div className="bg-white border border-[#F3F4F6] rounded-2xl p-6 flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-200 shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-[20px] text-[#15113d]">Workload Monitoring</h3>
              <i className="fa-solid fa-ellipsis text-[#9CA3AF] cursor-pointer text-lg"></i>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#fec886]"></div>
              <span className="font-sans font-bold text-[14px] text-[#7e5620]">
                Normal ({totalTasks - completedCount} tugas aktif)
              </span>
            </div>
            
            {/* Segments progress bar */}
            <div className="w-full h-12 bg-[#F8F9FB] rounded-xl flex items-center px-1 gap-1 overflow-hidden border border-[#F3F4F6]">
              {completedPct > 0 && (
                <div
                  className="h-8 bg-[#15113d] rounded-lg transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold"
                  style={{ width: `${completedPct}%` }}
                  title="Completed"
                />
              )}
              {inProgressPct > 0 && (
                <div
                  className="h-8 bg-[#fec886] rounded-lg transition-all duration-500"
                  style={{ width: `${inProgressPct}%` }}
                  title="In Progress"
                />
              )}
              {todoPct > 0 && (
                <div
                  className="h-8 bg-[#E5E7EB] rounded-lg transition-all duration-500"
                  style={{ width: `${todoPct}%` }}
                  title="To Do"
                />
              )}
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-1.5 font-sans text-[12.5px] text-[#9CA3AF] font-bold flex-wrap">
            <span>You've completed</span>
            <span className="text-[15px] font-black text-[#15113d] bg-[#15113d]/5 px-2 py-0.5 rounded-lg transition-all duration-300">
              {completedPct}%
            </span>
            <span>of your capacity. Keep going!</span>
          </div>
        </div>
      </div>

      {/* Row 2: Task Metrics Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white border border-[#F3F4F6] rounded-2xl p-4 flex flex-col gap-3 hover:translate-y-[-2px] transition-transform duration-200 shadow-sm">
          <div className={`w-10 h-10 rounded-xl ${categories[0].bgColor} flex items-center justify-center ${categories[0].textColor}`}>
            <i className={`${categories[0].icon} text-lg`}></i>
          </div>
          <div>
            <p className="font-sans text-[12px] text-[#9CA3AF] font-semibold">{categories[0].name}</p>
            <h4 className="font-display font-bold text-[20px] text-[#15113d]">{cat1Count} tasks</h4>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#F3F4F6] rounded-2xl p-4 flex flex-col gap-3 hover:translate-y-[-2px] transition-transform duration-200 shadow-sm">
          <div className={`w-10 h-10 rounded-xl ${categories[1].bgColor} flex items-center justify-center ${categories[1].textColor}`}>
            <i className={`${categories[1].icon} text-lg`}></i>
          </div>
          <div>
            <p className="font-sans text-[12px] text-[#9CA3AF] font-semibold">{categories[1].name}</p>
            <h4 className="font-display font-bold text-[20px] text-[#15113d]">{cat2Count} tasks</h4>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#F3F4F6] rounded-2xl p-4 flex flex-col gap-3 hover:translate-y-[-2px] transition-transform duration-200 shadow-sm">
          <div className={`w-10 h-10 rounded-xl ${categories[2].bgColor} flex items-center justify-center ${categories[2].textColor}`}>
            <i className={`${categories[2].icon} text-lg`}></i>
          </div>
          <div>
            <p className="font-sans text-[12px] text-[#9CA3AF] font-semibold">{categories[2].name}</p>
            <h4 className="font-display font-bold text-[20px] text-[#15113d]">{cat3Count} tasks</h4>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#F3F4F6] rounded-2xl p-4 flex flex-col gap-3 hover:translate-y-[-2px] transition-transform duration-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
            <i className="fa-regular fa-circle-check text-lg"></i>
          </div>
          <div>
            <p className="font-sans text-[12px] text-[#9CA3AF] font-semibold">Completed</p>
            <h4 className="font-display font-bold text-[20px] text-[#15113d]">{completedCount} tasks</h4>
          </div>
        </div>
      </div>

      {/* Row 3: Upcoming Tasks and Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks List */}
        <div className="bg-white border border-[#F3F4F6] rounded-2xl p-6 hover:translate-y-[-2px] transition-transform duration-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-[20px] text-[#15113d]">Upcoming Tasks</h3>
              <button
                onClick={() => navigate('/tasks')}
                className="text-[#7C3AED] font-sans font-semibold text-[14px] hover:underline underline-offset-4 cursor-pointer"
              >
                View All
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {upcomingTasks.map((t) => {
                const catDetails = getCategoryDetails(t);
                const isHigh = t.priority === 'high';
                const isMed = t.priority === 'medium';
                const pillStyles = isHigh
                  ? 'bg-red-50 text-red-600 border-red-100'
                  : isMed
                  ? 'bg-amber-50 text-amber-600 border-amber-100'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-100';

                return (
                  <div key={t.id} className="flex items-center gap-4 p-3 hover:bg-[#F8F9FB] rounded-xl transition-colors group border border-transparent hover:border-[#F3F4F6] cursor-pointer" onClick={() => navigate('/tasks')}>
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: catDetails.bg, color: catDetails.color }}
                    >
                      <i className={`${catDetails.icon} text-lg`}></i>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h5 className="font-sans font-bold text-[14px] text-[#15113d] truncate">{t.title.replace(/^\[[^\]]+\]\s*/, '')}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-sans text-[12px] text-[#9CA3AF] font-semibold">{formatDueDate(t.dueDate)}</p>
                        <span
                          className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border"
                          style={{
                            backgroundColor: catDetails.bg,
                            color: catDetails.color,
                            borderColor: catDetails.color + '33',
                          }}
                        >
                          {catDetails.label}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${pillStyles}`}>
                      {t.priority}
                    </span>
                  </div>
                );
              })}
              {upcomingTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center bg-gradient-to-br from-[#7C3AED]/5 to-transparent rounded-2xl border border-[#7C3AED]/10 select-none shadow-sm relative overflow-hidden group hover:shadow-md hover:border-[#7C3AED]/20 transition-all duration-300">
                  {/* Decorative glowing gradient blob behind */}
                  <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-[#7C3AED]/5 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Beautiful icon container */}
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[#7C3AED]/10 shadow-sm flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
                    <i className="fa-regular fa-circle-check text-[#7C3AED] text-[22px] animate-pulse"></i>
                  </div>
                  
                  <h4 className="font-display font-black text-[#15113d] text-[15px] mb-1">
                    Semua Tugas Selesai
                  </h4>
                  <p className="text-[#9CA3AF] text-[11px] max-w-[240px] font-medium leading-relaxed font-semibold">
                    Tidak ada tugas mendatang. Nikmati waktu luang Anda atau buat tugas baru di halaman Tasks!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Statistics Card */}
        <div className="bg-[#2a2753] text-white rounded-2xl p-6 hover:translate-y-[-2px] transition-transform duration-200 shadow-sm flex flex-col justify-between min-h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-[20px]">Progress Statistics</h3>
            <button className="bg-white/10 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors cursor-pointer">
              <i className="fa-regular fa-calendar text-base"></i>
            </button>
          </div>
          
          <div className="flex-grow flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            {/* Donut Chart */}
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" fill="transparent" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                <circle
                  cx="64"
                  cy="64"
                  fill="transparent"
                  r={radius}
                  stroke="#F9C382"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{completedPct}%</span>
                <span className="text-[10px] opacity-60 uppercase tracking-widest font-semibold">Global</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[#fec886] font-display font-extrabold text-[20px] leading-tight">{completedCount}</p>
                <p className="text-[12px] opacity-60 font-semibold font-bold">Tasks Completed</p>
              </div>
              <div className="h-[1px] w-full bg-white/10" />
              <div>
                <p className="text-white font-display font-extrabold text-[20px] leading-tight">{tasks.length - completedCount}</p>
                <p className="text-[12px] opacity-60 font-semibold font-bold">Active Tasks Remaining</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between text-xs opacity-60 border-t border-white/10 pt-4 font-semibold">
            <span>Last updated: 5 mins ago</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Data
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
export default DashboardPage;
