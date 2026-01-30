
import React from 'react';
import { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <div className="bg-white border border-[#dfe1e6] hover:border-[#0052cc] hover:shadow-2xl hover:shadow-blue-50 transition-all duration-400 flex flex-col h-full group">
      <div className="p-8 flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            {news.sourceType === 'Authority' ? (
              <span className="bg-[#e6f0ff] text-[#0052cc] px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                {news.source}
              </span>
            ) : (
              <span className="bg-slate-100 text-[#172b4d] px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                {news.source}
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#6b778c] font-bold font-mono tracking-tighter">{news.date}</span>
        </div>

        <h3 className="text-xl font-black text-[#172b4d] mb-4 leading-tight group-hover:text-[#0052cc] transition-colors">
          {news.title}
        </h3>

        <div className="mb-6">
          <span className="inline-block bg-[#f4f5f7] text-[#6b778c] text-[10px] font-black px-2 py-0.5 rounded-sm border border-[#dfe1e6] uppercase tracking-wider">
            {news.category}
          </span>
        </div>

        <div className="space-y-4 mb-8">
          <h4 className="text-[10px] font-black text-[#0052cc] uppercase tracking-[0.2em] flex items-center border-b border-blue-50 pb-2">
            Analysis Summary
          </h4>
          <ul className="space-y-3">
            {news.keyPoints.map((point, idx) => (
              <li key={idx} className="text-sm text-[#172b4d] leading-relaxed flex items-start font-medium">
                <span className="mt-1.5 mr-3 w-1.5 h-1.5 bg-[#0052cc] flex-shrink-0"></span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#e6f0ff]/40 p-5 border-l-2 border-[#0052cc] relative mt-6">
          <h5 className="text-[10px] font-black text-[#0052cc] uppercase mb-2">Expert Perspective</h5>
          <p className="text-sm text-[#172b4d] leading-relaxed italic font-medium">
            "{news.expertPerspective}"
          </p>
        </div>
      </div>

      <div className="px-8 pb-8 pt-0 mt-auto">
        <a 
          href={news.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full inline-flex justify-center items-center px-4 py-3 bg-[#0052cc] text-white text-xs font-black uppercase tracking-widest hover:bg-[#0047b3] transition-all duration-200 shadow-md shadow-blue-100"
        >
          View Full Report
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    </div>
  );
};
