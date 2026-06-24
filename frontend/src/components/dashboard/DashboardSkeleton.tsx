import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Row 1: Hero Banner & Workload Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hero Card Skeleton */}
        <div className="lg:col-span-2 bg-[#FFF4E5] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[240px] border border-gray-100">
          <div className="animate-pulse flex flex-col gap-4 justify-center h-full">
            <div className="h-8 w-3/4 bg-gray-300/40 rounded-xl" />
            <div className="h-6 w-1/2 bg-gray-300/30 rounded-lg mb-4" />
            <div className="h-10 w-44 bg-gray-300/40 rounded-xl" />
          </div>
          {/* Decorative shapes */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-gray-300/5 rounded-full" />
        </div>

        {/* Workload Card Skeleton */}
        <div className="bg-white border border-[#F3F4F6] rounded-2xl p-6 flex flex-col justify-between h-[240px]">
          <div className="animate-pulse flex flex-col justify-between h-full gap-4">
            <div className="flex justify-between items-center">
              <div className="h-5 w-32 bg-gray-200 rounded-lg" />
              <div className="w-5 h-5 rounded bg-gray-200" />
            </div>
            
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded-xl" />
            </div>

            <div className="space-y-2">
              <div className="h-8 w-full bg-gray-100 rounded-xl" />
              <div className="h-3 w-40 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Metrics Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#F3F4F6] rounded-2xl p-4 flex flex-col gap-3 h-[120px] justify-between"
          >
            <div className="animate-pulse flex flex-col gap-3 justify-between h-full">
              <div className="w-10 h-10 rounded-xl bg-gray-200/80" />
              <div className="space-y-2">
                <div className="h-3 w-14 bg-gray-200 rounded" />
                <div className="h-5 w-20 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 3: Upcoming Tasks & Donut Progress Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming Tasks Skeleton */}
        <div className="bg-white border border-[#F3F4F6] rounded-2xl p-6 min-h-[300px] flex flex-col gap-6">
          <div className="animate-pulse flex flex-col gap-6 h-full justify-between">
            <div className="flex justify-between items-center mb-2">
              <div className="h-6 w-32 bg-gray-200 rounded-lg" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-2">
                  <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-grow space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="h-3 w-1/4 bg-gray-200 rounded" />
                  </div>
                  <div className="w-12 h-6 rounded-full bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Statistics Skeleton */}
        <div className="bg-[#2a2753] rounded-2xl p-6 min-h-[300px] flex flex-col justify-between text-white relative overflow-hidden">
          <div className="animate-pulse flex flex-col justify-between h-full gap-6">
            <div className="flex justify-between items-center">
              <div className="h-6 w-40 bg-white/10 rounded-lg" />
              <div className="h-9 w-9 bg-white/10 rounded-xl" />
            </div>

            <div className="flex items-center gap-8 justify-center py-4 flex-wrap">
              {/* Circular Progress Ring Mock */}
              <div className="w-28 h-28 rounded-full border-[10px] border-white/15 flex items-center justify-center shrink-0 relative">
                <div className="w-10 h-6 bg-white/10 rounded-lg" />
              </div>
              
              <div className="space-y-4 flex-grow max-w-[160px]">
                <div className="space-y-1">
                  <div className="h-5 w-12 bg-white/20 rounded" />
                  <div className="h-3 w-28 bg-white/10 rounded" />
                </div>
                <div className="h-[1px] w-full bg-white/10" />
                <div className="space-y-1">
                  <div className="h-5 w-8 bg-white/20 rounded" />
                  <div className="h-3 w-20 bg-white/10 rounded" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-4 text-xs opacity-60">
              <div className="h-3 w-32 bg-white/10 rounded" />
              <div className="h-3 w-16 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
export default DashboardSkeleton;
