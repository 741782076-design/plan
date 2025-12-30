import React, { useState, useEffect } from 'react';
import { INITIAL_RULES, INITIAL_STAFF, INITIAL_FRIDAY_CONFIG, MONTH_NAMES } from './constants';
import { ScheduleDay } from './types';
import { generateSchedule } from './services/geminiService';
import { CalendarGrid } from './components/CalendarGrid';
import { EditorModal } from './components/EditorModal';

const App: React.FC = () => {
  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Inputs
  const [rules, setRules] = useState(INITIAL_RULES);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [fridayConfig, setFridayConfig] = useState(INITIAL_FRIDAY_CONFIG);

  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Handlers
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedSchedule = await generateSchedule(rules, staffList, fridayConfig, year, month);
      setSchedule(generatedSchedule);
    } catch (err) {
      setError("排班生成失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSchedule([]); 
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSchedule([]);
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleSaveDay = (updatedDay: ScheduleDay) => {
    setSchedule(prev => {
      const existing = prev.findIndex(p => p.day === updatedDay.day);
      if (existing >= 0) {
        const newSched = [...prev];
        newSched[existing] = updatedDay;
        return newSched;
      } else {
        return [...prev, updatedDay];
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col xl:flex-row h-screen overflow-hidden font-sans">
      
      {/* LEFT PANEL: Controls & Rules */}
      <aside className="w-full xl:w-[420px] flex flex-col border-r border-slate-800 bg-slate-900 z-10 shadow-xl overflow-hidden shrink-0">
        <div className="p-4 flex flex-col h-full gap-4">
          
          {/* Header */}
          <div className="">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              直播智能排班
            </h1>
          </div>

          {/* Month Control */}
          <div className="flex items-center justify-between bg-slate-800 rounded-lg p-1.5 border border-slate-700 shrink-0">
            <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="font-bold text-base text-white w-32 text-center">
              {year}年 {MONTH_NAMES[month]}
            </span>
            <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-700 rounded-md transition-colors text-slate-400 hover:text-white">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Configuration Sections (Scrollable) */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar min-h-0">
            
            {/* 1. Basic Rules */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 基础排班规则
              </label>
              <textarea 
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 resize-y focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono leading-relaxed"
                placeholder="输入基础规则..."
              />
            </div>

            {/* 2. Staff Pool */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> 人员名单 (PS/PT)
              </label>
              <textarea 
                value={staffList}
                onChange={(e) => setStaffList(e.target.value)}
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 resize-y focus:ring-1 focus:ring-purple-500 outline-none transition-all font-mono leading-relaxed"
                placeholder="PS部门: 张三...\nPT部门: 李四..."
              />
            </div>

            {/* 3. Friday Config */}
            <div className="flex flex-col gap-1.5">
               <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> 周五特殊配置
              </label>
              <textarea 
                value={fridayConfig}
                onChange={(e) => setFridayConfig(e.target.value)}
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 resize-y focus:ring-1 focus:ring-orange-500 outline-none transition-all font-mono leading-relaxed"
                placeholder="配置周五的上下半场规则..."
              />
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-2 border-t border-slate-800 shrink-0">
             {error && (
                <div className="text-red-400 text-xs bg-red-900/20 p-2 rounded border border-red-900/50 mb-2">
                  {error}
                </div>
             )}
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`
                w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg text-sm
                flex items-center justify-center gap-2 transition-all transform active:scale-95
                ${loading 
                  ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/25'
                }
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  智能生成中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  生成排班表
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL: Calendar */}
      <main className="flex-1 p-4 xl:p-6 h-full overflow-hidden flex flex-col bg-slate-950 relative">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 gap-2 shrink-0">
           <div>
             <h2 className="text-2xl font-bold text-white">月度排班概览</h2>
             <p className="text-slate-400 text-sm">点击日历格子可进行精细化调整</p>
           </div>
           
           <div className="flex flex-wrap gap-2 text-xs">
              <div className="px-2 py-1 rounded bg-green-900/40 border border-green-700 text-green-200">联播</div>
              <div className="px-2 py-1 rounded bg-purple-900/40 border border-purple-700 text-purple-200">游戏</div>
              <div className="px-2 py-1 rounded bg-orange-900/40 border border-orange-700 text-orange-200">打印</div>
              <div className="px-2 py-1 rounded bg-blue-900/40 border border-blue-700 text-blue-200">电脑</div>
           </div>
        </div>
        
        <div className="flex-1 min-h-0 relative">
          <CalendarGrid 
            year={year} 
            month={month} 
            schedule={schedule}
            loading={loading}
            onDayClick={handleDayClick}
          />
        </div>
      </main>

      {/* MODAL */}
      <EditorModal 
        isOpen={isModalOpen} 
        day={selectedDay} 
        currentData={selectedDay ? schedule.find(s => s.day === selectedDay) : undefined}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDay}
      />
    </div>
  );
};

export default App;
