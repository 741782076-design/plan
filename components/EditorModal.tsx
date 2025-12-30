import React, { useState, useEffect } from 'react';
import { ScheduleDay, ScheduleEvent } from '../types';

interface EditorModalProps {
  isOpen: boolean;
  day: number | null;
  currentData?: ScheduleDay;
  onClose: () => void;
  onSave: (data: ScheduleDay) => void;
}

const EMPTY_EVENT: ScheduleEvent = {
  id: '', 
  timeSlot: '15:30-17:30',
  activityType: '联播',
  hosts: '',
  backstage: '',
  venue: '3F Lab',
  platform: '视频号/小红书'
};

export const EditorModal: React.FC<EditorModalProps> = ({ isOpen, day, currentData, onClose, onSave }) => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);

  useEffect(() => {
    if (isOpen && day) {
      if (currentData && currentData.events) {
        setEvents(currentData.events.map(e => ({...e, id: e.id || Math.random().toString()})));
      } else {
        setEvents([]);
      }
    }
  }, [isOpen, day, currentData]);

  if (!isOpen || day === null) return null;

  const handleEventChange = (index: number, field: keyof ScheduleEvent, value: string) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setEvents(newEvents);
  };

  const handleAddEvent = () => {
    setEvents([...events, { ...EMPTY_EVENT, id: Math.random().toString() }]);
  };

  const handleDeleteEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      day,
      events
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-600 w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-700 shrink-0">
          <h3 className="text-xl font-bold text-white">排班编辑: {day}号</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
           {events.length === 0 ? (
             <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
                暂无排班，点击下方按钮添加
             </div>
           ) : (
             <div className="space-y-6">
                {events.map((evt, index) => (
                  <div key={evt.id} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 relative group">
                    <button 
                      type="button"
                      onClick={() => handleDeleteEvent(index)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">时间段</label>
                          <input 
                            type="text" 
                            value={evt.timeSlot}
                            onChange={(e) => handleEventChange(index, 'timeSlot', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-white focus:border-purple-500 outline-none"
                            placeholder="如: 15:30-17:30"
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">直播类型</label>
                          <select 
                             value={evt.activityType}
                             onChange={(e) => handleEventChange(index, 'activityType', e.target.value)}
                             className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-white focus:border-purple-500 outline-none"
                          >
                             <option value="联播">联播</option>
                             <option value="游戏">游戏</option>
                             <option value="打印">打印</option>
                             <option value="电脑专场">电脑专场</option>
                             <option value="其他">其他</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">主播人员</label>
                          <input 
                            type="text" 
                            value={evt.hosts}
                            onChange={(e) => handleEventChange(index, 'hosts', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-white focus:border-purple-500 outline-none"
                            placeholder="如: 张三/李四"
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">后台导播</label>
                          <input 
                            type="text" 
                            value={evt.backstage}
                            onChange={(e) => handleEventChange(index, 'backstage', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-white focus:border-purple-500 outline-none"
                            placeholder="如: 王五"
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">场地</label>
                          <input 
                            type="text" 
                            value={evt.venue}
                            onChange={(e) => handleEventChange(index, 'venue', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-white focus:border-purple-500 outline-none"
                            placeholder="如: 3F Lab"
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">平台</label>
                          <input 
                            type="text" 
                            value={evt.platform}
                            onChange={(e) => handleEventChange(index, 'platform', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-white focus:border-purple-500 outline-none"
                            placeholder="如: 视频号/小红书"
                          />
                       </div>
                    </div>
                  </div>
                ))}
             </div>
           )}
           
           <button 
              type="button" 
              onClick={handleAddEvent}
              className="mt-4 w-full py-2 border-2 border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-700/30 rounded-lg transition-all flex items-center justify-center gap-2"
           >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              添加新的直播场次
           </button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex gap-3 bg-slate-900 shrink-0">
           <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
           >
              取消
           </button>
           <button 
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-900/50 transition-all transform hover:scale-[1.02]"
           >
              保存修改
           </button>
        </div>
      </div>
    </div>
  );
};
