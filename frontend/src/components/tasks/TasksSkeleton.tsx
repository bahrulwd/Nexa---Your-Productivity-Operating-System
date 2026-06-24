import React from 'react';

export const TasksSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full">
      {/* Page Header Skeleton */}
      <div className="flex justify-between items-center select-none animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-8 w-40 bg-gray-300/40 rounded-xl" />
          <div className="h-5 w-20 bg-gray-200/40 rounded-full" />
        </div>
        <div className="h-10 w-28 bg-gray-300/40 rounded-xl" />
      </div>

      {/* Filters Row Skeleton */}
      <div className="flex flex-wrap justify-between items-center gap-4 select-none animate-pulse">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-16 bg-gray-200/40 rounded-full" />
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="h-5 w-28 bg-gray-200/30 rounded" />
          <div className="h-5 w-28 bg-gray-200/30 rounded" />
          <div className="h-5 w-24 bg-gray-200/30 rounded" />
        </div>
      </div>

      {/* Layout Grid Skeleton */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch flex-1 min-h-[480px]">
        {/* Left Column: TaskList Skeleton (58%) */}
        <div className="w-full lg:w-[58%] flex flex-col gap-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#F3F4F6] rounded-2xl p-4 flex items-center justify-between gap-4 h-18"
            >
              <div className="flex items-center gap-3 flex-grow">
                <div className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0" />
                <div className="space-y-2 flex-grow">
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  <div className="flex gap-2">
                    <div className="h-3 w-16 bg-gray-100 rounded" />
                    <div className="h-3 w-20 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
              <div className="w-10 h-6 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>

        {/* Right Column: DetailPanel Skeleton (42%) */}
        <div className="w-full lg:w-[42%] bg-white rounded-[24px] border border-[#F3F4F6] p-6 flex flex-col gap-6 animate-pulse min-h-[400px]">
          {/* Header area */}
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-grow">
              <div className="h-6 w-3/4 bg-gray-300/40 rounded-lg" />
              <div className="h-3 w-1/4 bg-gray-200/40 rounded" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-gray-200" />
          </div>

          {/* Description block */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200/40 rounded" />
            <div className="h-3 w-5/6 bg-gray-200/40 rounded" />
          </div>

          {/* Parameters block */}
          <div className="space-y-4 py-4 border-t border-b border-[#F3F4F6]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-40 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>

          {/* Subtasks area */}
          <div className="space-y-3 flex-grow">
            <div className="h-4 w-20 bg-gray-300/40 rounded" />
            <div className="space-y-2.5">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded border border-gray-200" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksSkeleton;
