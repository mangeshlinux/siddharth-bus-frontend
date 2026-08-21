import React, { useState } from 'react';
import { Bell, ChevronRight, AlertTriangle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopTicker() {
  const { notices } = useAuth();
  const [selectedNotice, setSelectedNotice] = useState(null);

  const activeNotices = notices.slice(0, 5);

  return (
    <>
      <div className="bg-amber-50/90 border-b border-amber-200/80 text-xs text-slate-800 overflow-hidden relative z-40 select-none shadow-xs">
        <div className="max-w-7xl mx-auto flex items-stretch">
          {/* High-visibility NOTIFICATIONS badge (GATE Portal Style) */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black px-3.5 py-1.5 flex items-center gap-1.5 flex-shrink-0 tracking-wider shadow-sm z-10 uppercase text-[11px]">
            <Bell className="w-3.5 h-3.5 fill-white animate-bounce" />
            <span>NOTIFICATIONS</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </div>

          {/* Marquee Container */}
          <div className="relative flex-1 overflow-hidden py-1.5 flex items-center">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-8 cursor-pointer">
              {[...activeNotices, ...activeNotices].map((notice, idx) => (
                <div 
                  key={`${notice.id}-${idx}`}
                  onClick={() => setSelectedNotice(notice)}
                  className="inline-flex items-center gap-2 hover:text-amber-700 transition-colors group"
                >
                  {notice.urgent ? (
                    <span className="bg-red-100 text-red-700 border border-red-200 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" /> URGENT
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                  <span className="font-semibold text-slate-800 group-hover:text-amber-700">
                    {notice.title}
                  </span>
                  <span className="text-slate-300">|</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Emergency Contact Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 bg-white text-slate-700 flex-shrink-0 border-l border-amber-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-medium">Control Room: <strong className="text-amber-700 font-mono font-bold">8767948553</strong></span>
          </div>
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left">
            <button 
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              {selectedNotice.urgent ? (
                <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> URGENT NOTICE
                </span>
              ) : (
                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> OFFICIAL BROADCAST
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium">
                {selectedNotice.date} • {selectedNotice.time}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-3">
              {selectedNotice.title}
            </h3>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {selectedNotice.content}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Target: <strong className="text-amber-700">{selectedNotice.target}</strong></span>
              <button 
                onClick={() => setSelectedNotice(null)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
