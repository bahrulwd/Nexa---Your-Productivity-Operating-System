import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import WorkloadSkeleton from '../../../components/workload/WorkloadSkeleton';
import { api } from '../../../lib/api';
import { Task } from '../../../types';

export const WorkloadPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isRescheduled, setIsRescheduled] = useState(false);
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(8);
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load workload tasks:', err);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const init = async () => {
      await loadTasks();
      setIsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const loadLimit = () => {
      const saved = localStorage.getItem('nexa_settings');
      if (saved) {
        setDailyLimit(JSON.parse(saved).dailyLimit || 8);
      }
    };
    loadLimit();
    window.addEventListener('nexa_settings_updated', loadLimit);
    return () => window.removeEventListener('nexa_settings_updated', loadLimit);
  }, []);

  // Calculate the days of the current week (Monday to Sunday)
  const weekDays = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, ...
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);

    const days = [];
    const indonesianMonths = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${date}`;
      
      const dayNamesIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const dayNamesShortIndo = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      
      days.push({
        dateStr,
        dayIndo: dayNamesIndo[d.getDay()],
        dayShortIndo: dayNamesShortIndo[d.getDay()],
        dateIndo: `${d.getDate()} ${indonesianMonths[d.getMonth()]}`,
        dayIndex: d.getDay()
      });
    }
    return days;
  }, []);

  // Compute workloads dynamically
  const computedWorkloads = useMemo(() => {
    return weekDays.map((day) => {
      const dayTasks = tasks.filter((task) => {
        if (task.dueDate) {
          return task.dueDate === day.dateStr;
        } else {
          return day.dayShortIndo === 'Rab'; // undated tasks on Wednesday
        }
      });

      const hours = dayTasks.reduce((sum, task) => sum + (task.effort || 3), 0);

      let status: 'Normal' | 'Padat' | 'Over' = 'Normal';
      let color = '#10B981';
      if (hours > dailyLimit) {
        status = 'Over';
        color = '#EF4444';
      } else if (hours >= dailyLimit * 0.6) {
        status = 'Padat';
        color = '#F59E0B';
      }

      return {
        ...day,
        hours,
        status,
        color,
        tasks: dayTasks
      };
    });
  }, [weekDays, tasks, dailyLimit]);

  const chartData = useMemo(() => {
    return computedWorkloads.map(d => ({
      name: d.dayShortIndo,
      hours: d.hours,
      color: d.color,
      status: d.status
    }));
  }, [computedWorkloads]);

  const upcomingDays = useMemo(() => {
    return computedWorkloads.slice(0, 4).map(d => ({
      dayIndo: d.dayIndo,
      dateIndo: d.dateIndo,
      hours: d.hours,
      status: d.status,
      colorClass: d.color,
      percent: Math.round((d.hours / dailyLimit) * 100),
      isHighlighted: d.status === 'Over'
    }));
  }, [computedWorkloads, dailyLimit]);

  // Find overloaded day & task to reschedule
  const recommendation = useMemo(() => {
    const overloaded = computedWorkloads.find(d => d.status === 'Over');
    if (!overloaded) return { hasRecommendation: false };

    const task = overloaded.tasks.find(t => t.status !== 'completed');
    if (!task) return { hasRecommendation: false };

    // Find the day with the lowest workload that is not overloaded
    const target = [...computedWorkloads]
      .filter(d => d.status !== 'Over')
      .sort((a, b) => a.hours - b.hours)[0];

    if (!target) return { hasRecommendation: false };

    return {
      hasRecommendation: true,
      task,
      fromDay: overloaded,
      toDay: target
    };
  }, [computedWorkloads]);

  const handleAutoReschedule = async () => {
    if (recommendation.hasRecommendation && recommendation.task && recommendation.toDay) {
      setRescheduleSuccess(true);
      setIsRescheduled(true);

      const taskToUpdate = recommendation.task;
      const targetDate = recommendation.toDay.dateStr;

      try {
        const updatedTask: Task = {
          ...taskToUpdate,
          dueDate: targetDate
        };
        await api.updateTask(updatedTask);
        await loadTasks();
      } catch (err) {
        console.error('Failed to reschedule task:', err);
      }

      setTimeout(() => {
        setRescheduleSuccess(false);
        setIsRescheduled(false);
      }, 4000);
    }
  };

  const totalHours = useMemo(() => {
    return computedWorkloads.reduce((sum, d) => sum + d.hours, 0);
  }, [computedWorkloads]);

  const totalHoursStr = useMemo(() => {
    return `${Math.floor(totalHours)}h ${Math.round((totalHours % 1) * 60)}m`;
  }, [totalHours]);

  if (isLoading) {
    return <WorkloadSkeleton />;
  }

  return (
    <div className="flex flex-col gap-5 animate-slide-up pb-6">
      
      {/* Row 1: Bento Summary & AI Recommendations */}
      <div className="grid grid-cols-12 gap-5 items-stretch">
        
        {/* Weekly Summary Card */}
        <section className="col-span-12 md:col-span-5 bg-white border border-[#F3F4F6] rounded-3xl p-5 flex flex-col justify-between min-h-[180px] shadow-sm">
          <div>
            <p className="text-[#9CA3AF] text-[10px] font-extrabold uppercase tracking-wider mb-2">Total Beban Kerja Minggu Ini</p>
            <div className="flex items-center gap-3.5 flex-wrap">
              <h2 className="text-[#15113d] font-black text-4xl sm:text-5xl tracking-tight">{totalHoursStr}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                computedWorkloads.some(d => d.status === 'Over')
                  ? 'bg-red-50 text-red-600 border-red-100'
                  : computedWorkloads.some(d => d.status === 'Padat')
                  ? 'bg-amber-50 text-amber-600 border-amber-100'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}>
                Overall: {
                  computedWorkloads.some(d => d.status === 'Over')
                    ? 'Overload'
                    : computedWorkloads.some(d => d.status === 'Padat')
                    ? 'Padat'
                    : 'Normal'
                }
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#10B981] font-bold text-xs mt-3">
            <i className="fa-solid fa-circle-check text-sm"></i>
            <p className="text-[#47464e] font-semibold text-[11px]">{tasks.length} total tasks scheduled</p>
          </div>
        </section>

        {/* AI Recommendation Card */}
        <section className={`col-span-12 md:col-span-7 rounded-3xl p-5 flex flex-col justify-between min-h-[180px] shadow-sm relative overflow-hidden border transition-all duration-500 ${
          isRescheduled 
            ? 'bg-gradient-to-br from-emerald-50/40 via-[#FDFDFD] to-white border-emerald-100 shadow-emerald-500/5' 
            : 'bg-gradient-to-br from-[#FFF4E5] via-[#FFF9F2] to-white border-[#FDE6C7] shadow-amber-500/5'
        }`}>
          
          {rescheduleSuccess && (
            <div className="absolute inset-0 bg-emerald-50/95 border border-emerald-200 rounded-3xl p-5 flex flex-col items-center justify-center text-center z-20 animate-fade-in gap-1.5">
              <i className="fa-solid fa-circle-check text-emerald-500 text-2xl animate-bounce"></i>
              <h4 className="font-bold text-emerald-800 text-sm">Reschedule Sukses!</h4>
              <p className="text-emerald-700 text-xs max-w-sm">Tugas '{recommendation.task?.title}' berhasil didistribusikan secara otomatis ke hari {recommendation.toDay?.dayIndo}.</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {recommendation.hasRecommendation && !isRescheduled ? (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 bg-[#FF9800]/20 rounded-xl flex items-center justify-center">
                    <i className="fa-solid fa-triangle-exclamation text-[#E65100] text-base animate-pulse"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#79521b]">Hari {recommendation.fromDay?.dayIndo} Overload</h3>
                    <p className="text-[9px] text-[#A05C00]/80 font-extrabold uppercase tracking-wider">AI Recommendation</p>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl sm:text-4xl font-black text-red-600 tracking-tight animate-pulse">
                    {recommendation.fromDay?.hours.toFixed(1).replace('.', ',')} jam
                  </span>
                  <span className="text-[10px] font-extrabold text-[#79521b] uppercase tracking-widest">
                    beban kerja terdeteksi
                  </span>
                </div>
                
                <p className="text-[#633f09] text-[11px] font-semibold leading-relaxed mt-1">
                  Kami menyarankan untuk memindahkan <span className="font-extrabold underline decoration-[#FF9800] decoration-2">{recommendation.task?.title}</span> ke hari {recommendation.toDay?.dayIndo} agar beban kerja Anda lebih seimbang.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-base"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-emerald-800">Distribusi Optimal</h3>
                    <p className="text-[9px] text-emerald-700/85 font-extrabold uppercase tracking-wider">AI Recommendation</p>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                    {computedWorkloads.length > 0 ? Math.max(...computedWorkloads.map(d => d.hours)).toFixed(1).replace('.', ',') : '0'} jam
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">
                    beban kerja maksimal harian
                  </span>
                </div>
                
                <p className="text-emerald-800 text-[11px] font-semibold leading-relaxed mt-1">
                  Semua hari kerja memiliki alokasi beban yang merata dan aman. Rencana kerja Anda dalam kondisi prima!
                </p>
              </>
            )}
          </div>

          <div className="flex gap-2.5 mt-3">
            {recommendation.hasRecommendation ? (
              isRescheduled ? (
                <button
                  disabled
                  className="bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-default shadow-sm shadow-emerald-500/10"
                >
                  <i className="fa-solid fa-circle-check text-sm"></i>
                  Rescheduled
                </button>
              ) : (
                <button
                  onClick={handleAutoReschedule}
                  className="bg-[#2A2753] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-[#1f1c3f] active:scale-95 transition-all cursor-pointer shadow-sm hover:shadow-[#2A2753]/20"
                >
                  Auto-Reschedule
                </button>
              )
            ) : (
              <button
                disabled
                className="bg-gray-200 text-gray-400 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-not-allowed border border-gray-300/30"
              >
                No Action Needed
              </button>
            )}
            <button
              onClick={() => navigate('/tasks')}
              className="border border-[#2A2753]/15 text-[#2A2753] bg-transparent px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-white active:scale-95 transition-all cursor-pointer"
            >
              Review Tasks
            </button>
          </div>
        </section>
      </div>

      {/* Row 2: Workload Analysis Chart */}
      <section className="bg-white border border-[#F3F4F6] rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h3 className="font-bold text-base text-[#15113d]">Workload Analysis (Mon - Sun)</h3>
          
          <div className="flex items-center gap-3.5 flex-wrap text-[10px] font-bold text-[#9CA3AF]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span>Normal (&lt; 5h)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
              <span>Padat (5-8h)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
              <span>Over (8h+)</span>
            </div>
          </div>
        </div>

        {/* Chart Container - height slightly reduced to 240px to fit on smaller viewport */}
        <div className="h-[240px] w-full text-[11px] font-bold relative">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(42, 39, 83, 0.04)" />
                <XAxis dataKey="name" stroke="#2A2753" fontSize={11} tickLine={false} />
                <YAxis stroke="#2A2753" fontSize={11} tickLine={false} domain={[0, Math.max(12, dailyLimit + 2)]} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(42, 39, 83, 0.08)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <ReferenceLine y={dailyLimit} stroke="#EF4444" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: `${dailyLimit}h LIMIT`, fill: '#EF4444', fontSize: 9, fontWeight: 'bold', position: 'right' }} />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* Row 3: Upcoming Day Grid (Exactly 4 cards matching the mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-4">
        {upcomingDays.map((alloc) => {
          return (
            <div
              key={alloc.dayIndo}
              className={`relative overflow-hidden rounded-3xl p-5 space-y-4 shadow-sm transition-all duration-300 border ${
                alloc.isHighlighted
                  ? 'border-red-200 bg-gradient-to-br from-red-50/40 via-white to-white shadow-[0_12px_30px_rgba(239,68,68,0.08)] scale-[1.02] ring-1 ring-red-500/20'
                  : 'bg-white border-[#F3F4F6] hover:shadow-md hover:border-gray-200'
              }`}
            >
              {/* Left Accent Bar for Overload Card */}
              {alloc.isHighlighted && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 to-rose-600 rounded-r-lg" />
              )}
              
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-[#1E1E24]">{alloc.dayIndo}</h4>
                  <p className="text-[10px] text-[#9CA3AF] font-bold">{alloc.dateIndo}</p>
                </div>
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                  alloc.status === 'Over' 
                    ? 'bg-red-50 text-red-600 border-red-100 animate-pulse'
                    : alloc.status === 'Padat'
                    ? 'bg-amber-50 text-amber-600 border-amber-100'
                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                  {alloc.status === 'Over' && (
                    <span className="relative flex h-1.5 w-1.5 mr-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                    </span>
                  )}
                  {alloc.status}
                </span>
              </div>

              {/* Big Hours Value Display */}
              <div className="flex items-baseline gap-1 mt-1">
                <span className={`font-black text-3xl tracking-tight ${alloc.status === 'Over' ? 'text-red-600 animate-pulse' : 'text-[#15113d]'}`}>
                  {alloc.hours.toFixed(1).replace('.', ',')}
                </span>
                <span className="text-[9px] font-extrabold text-[#9CA3AF] uppercase tracking-wider">
                  jam dialokasikan
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#F8F9FB] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${Math.min(alloc.percent, 100)}%`,
                    backgroundColor: alloc.colorClass
                  }} 
                />
              </div>

              {/* Overload Alert Warning Text */}
              {alloc.status === 'Over' && (
                <div className="flex items-center gap-1 text-[9px] font-bold text-red-500">
                  <i className="fa-solid fa-triangle-exclamation text-xs animate-bounce"></i>
                  <span>Melebihi batas aman harian</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkloadPage;
