
import React, { useState, useEffect, useCallback } from 'react';
import { NewsState, NewsItem } from './types';
import { fetchNewsFromGemini } from './services/geminiService';
import { NewsCard } from './components/NewsCard';
import { NewsSkeleton } from './components/NewsSkeleton';

const App: React.FC = () => {
  const [state, setState] = useState<NewsState>({
    items: [],
    loading: true,
    error: null,
    lastUpdated: new Date().toLocaleString('zh-TW', { hour12: false }),
  });

  const loadNews = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchNewsFromGemini();
      setState({
        items: data,
        loading: false,
        error: null,
        lastUpdated: new Date().toLocaleString('zh-TW', { hour12: false }),
      });
    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: "目前無法取得驗證通過的原文報導。AI 正在嚴格過濾資訊品質，請稍後再試。",
      }));
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#dfe1e6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#0052cc] rounded flex items-center justify-center shadow-lg shadow-blue-100">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-black text-[#172b4d] tracking-tight">
                EcoPulse <span className="text-[#0052cc] font-bold">Global</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline text-[11px] font-black text-[#0052cc] bg-[#e6f0ff] px-3 py-1 rounded tracking-widest border border-blue-100 uppercase">
                Enterprise Sync
              </span>
              <button 
                onClick={loadNews}
                disabled={state.loading}
                className={`flex items-center space-x-2 px-5 py-2 rounded font-bold transition-all text-sm ${
                  state.loading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-[#0052cc] text-white hover:bg-[#0047b3] active:translate-y-px shadow-md shadow-blue-200'
                }`}
              >
                <svg className={`w-4 h-4 ${state.loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{state.loading ? '正在同步數據...' : '重新整理'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-14">
          <div className="inline-flex items-center space-x-2 text-[#0052cc] text-xs font-black uppercase tracking-[0.2em] mb-4">
            <span className="flex h-2 w-2 rounded-full bg-[#0052cc]"></span>
            <span>Verified Energy Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#172b4d] mb-6 leading-[1.1]">
            全球新能源<br />
            <span className="text-[#0052cc]">權威情報掃描</span>
          </h2>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-l-4 border-[#0052cc] pl-8 py-2">
            <p className="max-w-2xl text-[#6b778c] text-lg font-medium leading-relaxed">
              僅收錄具備「確切原文詳細報導」之高品質資訊。所有內容皆經過連結有效性驗證，確保您能直達核心數據源。
            </p>
            <div className="flex items-center space-x-3 bg-slate-50 border border-[#dfe1e6] px-4 py-2 rounded shadow-sm">
              <div className="text-right">
                <div className="text-[10px] text-[#6b778c] font-black uppercase mb-0.5">Last Sync</div>
                <div className="text-sm font-mono font-bold text-[#172b4d]">
                  {state.lastUpdated}
                </div>
              </div>
            </div>
          </div>
        </div>

        {state.error && (
          <div className="mb-12 p-6 bg-red-50 border border-red-100 rounded flex items-start space-x-4 text-red-800 shadow-sm">
            <div className="mt-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-black text-base mb-1">系統過濾機制運作中</p>
              <p className="text-sm font-medium opacity-80">{state.error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {state.loading ? (
            Array.from({ length: 9 }).map((_, idx) => (
              <NewsSkeleton key={idx} />
            ))
          ) : (
            state.items.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))
          )}
        </div>

        {!state.loading && state.items.length === 0 && !state.error && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[#172b4d] font-bold text-lg">今日暫無符合嚴格驗證標準的新聞</p>
            <p className="text-[#6b778c] text-sm mt-2">請點擊重新整理，或稍後再回來查看。</p>
          </div>
        )}
      </main>

      <footer className="bg-[#172b4d] text-[#6b778c] py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 border-b border-slate-700 pb-12 mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">EcoPulse Global</span>
            </div>
            <p className="max-w-md text-sm font-medium leading-relaxed">
              我們的 AI 系統會自動剔除無法直接追蹤至原始深度報導的消息，僅保留具備確切出處的資訊。
            </p>
          </div>
          <div className="text-center text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
            &copy; {new Date().getFullYear()} ECOPULSE INTELLIGENCE SYSTEM. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
