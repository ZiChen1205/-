
import React from 'react';

export const NewsSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-white border border-[#dfe1e6] overflow-hidden flex flex-col h-full">
      <div className="p-8 flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className="h-6 w-24 bg-slate-100"></div>
          <div className="h-4 w-20 bg-slate-50"></div>
        </div>
        <div className="h-8 bg-slate-100 w-full mb-3"></div>
        <div className="h-8 bg-slate-100 w-3/4 mb-6"></div>
        
        <div className="h-4 w-16 bg-slate-50 mb-8"></div>
        
        <div className="space-y-4">
          <div className="h-4 w-32 bg-slate-100 mb-4"></div>
          <div className="h-4 bg-slate-50 w-full"></div>
          <div className="h-4 bg-slate-50 w-full"></div>
          <div className="h-4 bg-slate-50 w-full"></div>
        </div>

        <div className="mt-8 h-24 bg-blue-50/30 border-l-2 border-blue-100"></div>
      </div>
      <div className="px-8 pb-8 pt-0 mt-auto">
        <div className="h-10 bg-slate-100 w-full"></div>
      </div>
    </div>
  );
};
