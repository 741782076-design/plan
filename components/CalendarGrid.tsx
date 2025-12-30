import React from 'react';
import { ScheduleDay } from '../types';
import { WEEKDAYS, EVENT_TYPE_COLORS, DEFAULT_EVENT_COLOR } from '../constants';

interface CalendarGridProps {
  year: number;
  month: number;
  schedule: ScheduleDay[];
  loading: boolean;
  onDayClick: (day: number) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  year, 
  month, 
  schedule, 
  loading,
  onDayClick
}) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const emptySlots = Array.from({ length: firstDayOfMonth });
  const daySlots = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getDayData = (day: number) => schedule.find(s => s.day === day);

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 bg-slate-900 border-b border-slate-700">
        {WEEKDAYS.map(day => (
          <div key={day} className="py-3 text-center text-slate-400 font-semibold text-sm tracking-wider bg-slate-900 z-10">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr relative overflow-y-auto">
        {loading && (
          <div className="absolute inset-0 z-20 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center h-full">
             <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <p className="text-purple-300 animate-pulse font-medium">AI 正在为您智能排班...</p>
             </div>
          </div>
        )}

        {emptySlots.map((_, i) => (
          <div key={`empty-${i}`} className="bg-slate-800/50 border-r border-b border-slate-700/50 min-h-[150px]" />
        ))}

        {daySlots.map(day => {
          const dayData = getDayData(day);
          const events = dayData?.events || [];
          const hasEvents = events.length > 0;

          return (
            <div 
              key={day} 
              onClick={() => onDayClick(day)}
              className={`
                min-h-[180px] border-r border-b border-slate-700/50 cursor-pointer transition-all duration-200
                hover:bg-slate-700/50 group flex flex-col relative overflow-hidden
                ${hasEvents ? 'bg-slate-800' : 'bg-slate-800/30'}
              `}
            >
              {/* Day Number */}
              <div className="p-2 flex justify-between items-center sticky top-0 bg-inherit z-0">
                 <span className={`text-sm font-bold ${hasEvents ? 'text-white' : 'text-slate-600'}`}>
                    {day}
                 </span>
                 {hasEvents && (
                   <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">
                     {events.length}场
                   </span>
                 )}
              </div>
              
              {/* Events List */}
              <div className="flex-1 px-1 pb-1 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
                {events.map((evt, idx) => {
                  const colorClass = EVENT_TYPE_COLORS[evt.activityType] || DEFAULT_EVENT_COLOR;
                  return (
                    <div key={idx} className={`rounded-md border p-1.5 text-[10px] shadow-sm flex flex-col gap-0.5 ${colorClass}`}>
                       {/* Header: Time & Type */}
                       <div className="flex justify-between items-center font-bold border-b border-current/20 pb-1 mb-0.5">
                         <span className="truncate max-w-[50%]">{evt.activityType}</span>
                         <span className="opacity-90">{evt.timeSlot.split('-')[0]}</span>
                       </div>
                       
                       {/* Details Grid */}
                       <div className="space-y-0.5 opacity-90 leading-tight">
                         <div className="flex gap-1">
                           <span className="opacity-60 min-w-[24px]">主播:</span>
                           <span className="font-medium truncate">{evt.hosts}</span>
                         </div>
                         <div className="flex gap-1">
                           <span className="opacity-60 min-w-[24px]">后台:</span>
                           <span className="truncate">{evt.backstage}</span>
                         </div>
                         <div className="flex gap-1">
                           <span className="opacity-60 min-w-[24px]">地点:</span>
                           <span className="truncate">{evt.venue}</span>
                         </div>
                         <div className="flex gap-1">
                            <span className="opacity-60 min-w-[24px]">平台:</span>
                            <span className="truncate">{evt.platform}</span>
                         </div>
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {/* Fill remaining cells */}
        {Array.from({ length: 42 - (emptySlots.length + daySlots.length) }).map((_, i) => (
             <div key={`end-${i}`} className="bg-slate-800/30 border-r border-b border-slate-700/30 min-h-[150px]" />
        ))}
      </div>
    </div>
  );
};
