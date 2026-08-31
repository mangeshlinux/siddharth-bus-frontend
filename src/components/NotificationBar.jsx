import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  X, 
  ChevronLeft, 
  ChevronRight,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ReceiptModal from './ReceiptModal';

export default function NotificationBar() {
  const { notices } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [activeReceiptNotice, setActiveReceiptNotice] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const activeNotices = notices || [];

  // When notices array updates (e.g. fresh broadcast), bring it to front and open
  useEffect(() => {
    if (notices && notices.length > 0) {
      setCurrentIndex(0);
      setIsOpen(true);
    }
  }, [notices?.length]);

  // Auto-cycle through notifications every 6 seconds (pauses on hover)
  useEffect(() => {
    if (!isOpen || activeNotices.length <= 1 || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeNotices.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isOpen, activeNotices.length, isHovered, currentIndex]);

  if (activeNotices.length === 0) {
    return null;
  }

  const currentNotice = activeNotices[currentIndex] || activeNotices[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? activeNotices.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeNotices.length);
  };

  const handleNoticeClick = (notice) => {
    if (notice.isPaymentReceipt && notice.receiptData) {
      setActiveReceiptNotice(notice);
    } else {
      setSelectedNotice(notice);
    }
  };

  return (
    <>
      {/* 1. ULTRA-SLEEK IN-FLOW HEADER TICKER BAR (NO FLOATING OVERLAY OCCLUSION) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`w-full border-b transition-colors ${
              currentNotice.isPaymentReceipt
                ? 'bg-[#0E2818] border-emerald-800 text-emerald-100'
                : currentNotice.urgent
                  ? 'bg-[#2A0E0E] border-red-900 text-red-100'
                  : 'bg-[#26150C] border-[#B08D57]/40 text-amber-100'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center justify-between gap-3 text-xs">
                
                {/* Left: Indicator Badge */}
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  {currentNotice.isPaymentReceipt ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                      <FileText className="w-3 h-3" />
                      <span>Receipt Verified</span>
                    </span>
                  ) : currentNotice.urgent ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-black uppercase tracking-wider animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Urgent Notice</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
                      <Bell className="w-3 h-3" />
                      <span>Official Notice</span>
                    </span>
                  )}
                  <span className="hidden md:inline font-mono text-[11px] text-zinc-400">
                    {currentNotice.date}
                  </span>
                </div>

                {/* Center: Headline & Snippet (Clickable Ticker) */}
                <div 
                  onClick={() => handleNoticeClick(currentNotice)}
                  className="flex-1 min-w-0 cursor-pointer text-left group flex items-center gap-2 overflow-hidden"
                >
                  <span className="font-bold text-white group-hover:underline truncate max-w-[200px] sm:max-w-md lg:max-w-xl">
                    {currentNotice.title}:
                  </span>
                  <span className="hidden sm:inline text-zinc-300 truncate max-w-[300px] lg:max-w-xl">
                    {currentNotice.content}
                  </span>
                  <span className="text-[#D97B29] group-hover:text-amber-300 text-[11px] font-bold inline-flex items-center gap-0.5 flex-shrink-0">
                    {currentNotice.isPaymentReceipt ? 'View Receipt' : 'Read'} ➔
                  </span>
                </div>

                {/* Right: Controls & Pagination */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {activeNotices.length > 1 && (
                    <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                      <button
                        onClick={handlePrev}
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        title="Previous Notice"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-white font-bold">{currentIndex + 1}/{activeNotices.length}</span>
                      <button
                        onClick={handleNext}
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        title="Next Notice"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer ml-1"
                    title="Dismiss Notification Bar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. NOTICE DETAIL MODAL (WHEN CLICKED) */}
      <AnimatePresence>
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs text-left animate-in fade-in duration-150">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-zinc-200 max-w-lg w-full p-6 shadow-2xl relative text-zinc-900 rounded-2xl font-sans"
            >
              <button 
                onClick={() => setSelectedNotice(null)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                {selectedNotice.urgent ? (
                  <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    URGENT ALERT
                  </span>
                ) : (
                  <span className="bg-[#D97B29] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    OFFICIAL NOTICE
                  </span>
                )}
                <span className="text-xs text-zinc-500 font-mono">
                  {selectedNotice.date} {selectedNotice.time ? `• ${selectedNotice.time}` : ''}
                </span>
              </div>

              <h3 className="text-lg font-bold text-zinc-900 mb-3">
                {selectedNotice.title}
              </h3>

              <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-xl mb-4 text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {selectedNotice.content}
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-100">
                <span>Issued by: <strong className="text-zinc-900">Siddharth Travels Nashik</strong></span>
                <button 
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. DIRECT AUTHENTIC PAPER RECEIPT MODAL OPENED FROM NOTIFICATION */}
      {activeReceiptNotice && (
        <ReceiptModal
          isOpen={!!activeReceiptNotice}
          onClose={() => setActiveReceiptNotice(null)}
          student={activeReceiptNotice.receiptData?.student}
          receipt={activeReceiptNotice.receiptData}
        />
      )}
    </>
  );
}
