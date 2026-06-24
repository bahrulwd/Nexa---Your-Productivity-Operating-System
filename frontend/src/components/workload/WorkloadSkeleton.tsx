import React from 'react';

export const WorkloadSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8">
      
      {/* Row 1: Bento 40/60 Skeletons */}
      <div className="grid grid-cols-12 gap-6 animate-pulse">
        {/* Total Workload Card Skeleton (col-span-5) */}
        <div className="col-span-12 md:col-span-5 bg-white border border-[#F3F4F6] rounded-3xl p-6 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-4">
            <div className="h-3 w-48 bg-gray-200/60 rounded" />
            <div className="flex items-center gap-3">
              <div className="h-12 w-32 bg-gray-300/40 rounded-xl" />
              <div className="h-6 w-28 bg-gray-200/50 rounded-full" />
            </div>
          </div>
          <div className="h-4 w-52 bg-gray-200/30 rounded mt-4" />
        </div>

        {/* AI Recommendation Skeleton (col-span-7) */}
        <div className="col-span-12 md:col-span-7 bg-[#FFF4E5]/60 border border-[#FDE6C7]/50 rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-300/20 rounded-lg" />
            <div className="h-6 w-44 bg-orange-300/35 rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="h-3.5 w-full bg-orange-300/20 rounded" />
            <div className="h-3.5 w-5/6 bg-orange-300/20 rounded" />
          </div>
          <div className="flex gap-3 mt-auto pt-2">
            <div className="h-9 w-32 bg-orange-300/30 rounded-lg" />
            <div className="h-9 w-28 bg-orange-300/10 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Row 2: Full-width Analysis Skeleton */}
      <div className="bg-white border border-[#F3F4F6] rounded-3xl p-6 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-56 bg-gray-300/40 rounded-lg" />
          <div className="flex gap-4">
            <div className="h-4 w-20 bg-gray-200/40 rounded-full" />
            <div className="h-4 w-20 bg-gray-200/40 rounded-full" />
            <div className="h-4 w-20 bg-gray-200/40 rounded-full" />
          </div>
        </div>
        {/* Chart placeholder */}
        <div className="h-[280px] w-full bg-gray-100/50 rounded-2xl flex items-end justify-around p-4">
          {[50, 75, 45, 90, 60, 30, 20].map((h, idx) => (
            <div
              key={idx}
              className="w-10 bg-gray-200/40 rounded-t-lg"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Row 3: Upcoming Day Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-[#F3F4F6] rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-5 w-16 bg-gray-200/70 rounded" />
                <div className="h-3.5 w-12 bg-gray-200/40 rounded" />
              </div>
              <div className="h-5 w-12 bg-gray-100 rounded-full" />
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full" />
            <div className="h-3.5 w-28 bg-gray-200/45 rounded" />
          </div>
        ))}
      </div>

    </div>
  );
};

export default WorkloadSkeleton;
