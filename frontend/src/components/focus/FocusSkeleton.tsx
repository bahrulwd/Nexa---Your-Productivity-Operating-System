import React from 'react';

export const FocusSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8">
      
      {/* Modes Bar Selector Skeleton */}
      <div className="flex justify-center select-none animate-pulse">
        <div className="h-11 w-80 bg-white border border-[#F3F4F6] rounded-2xl flex items-center p-1 gap-2">
          <div className="h-full flex-1 bg-gray-200/50 rounded-xl" />
          <div className="h-full flex-1 bg-transparent rounded-xl" />
          <div className="h-full flex-1 bg-transparent rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Focus Timer Skeleton (7/12) */}
        <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#F3F4F6] p-8 flex flex-col items-center justify-center text-center gap-6 shadow-sm min-h-[480px] animate-pulse">
          {/* Project Tag */}
          <div className="h-6 w-36 bg-gray-200/50 rounded-full" />

          {/* Task Info */}
          <div className="space-y-2 flex flex-col items-center">
            <div className="h-7 w-64 bg-gray-200/80 rounded-lg" />
            <div className="h-3 w-40 bg-gray-200/45 rounded" />
          </div>

          {/* Countdown Ring Mock */}
          <div className="w-64 h-64 rounded-full border-8 border-gray-100 flex items-center justify-center shrink-0 my-4 relative">
            <div className="h-16 w-32 bg-gray-200/60 rounded-xl" />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-gray-200/50" />
            <div className="w-20 h-20 rounded-full bg-gray-200" />
            <div className="w-12 h-12 rounded-full bg-gray-200/50" />
          </div>
        </div>

        {/* Right Column: Reflection Form Skeleton (5/12) */}
        <div className="lg:col-span-5 flex flex-col animate-pulse">
          <div className="bg-white rounded-[24px] border border-[#F3F4F6] p-6 shadow-sm flex flex-col flex-grow relative min-h-[480px] gap-4">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-36 bg-gray-200/60 rounded-lg" />
                <div className="w-5 h-5 bg-gray-200/30 rounded" />
              </div>
              <div className="h-6 w-16 bg-gray-200/40 rounded-lg" />
            </div>

            {/* Input blocks */}
            <div className="flex-grow flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-28 bg-gray-200/65 rounded" />
                  <div className="w-full h-[72px] bg-gray-100/60 border border-gray-100 rounded-xl" />
                </div>
              ))}
            </div>

            {/* Button */}
            <div className="h-12 w-full bg-gray-200/80 rounded-xl mt-4" />
          </div>
        </div>

      </div>

    </div>
  );
};

export default FocusSkeleton;
