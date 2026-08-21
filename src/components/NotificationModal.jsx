import React, { useState } from 'react';
import { 
  Send, 
  Share2, 
  Check, 
  X, 
  AlertTriangle, 
  Sparkles, 
  Trash2,
  Bell,
  Radio,
  Eye,
  Clock,
  Building2,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NotificationModal({ isOpen, onClose }) {
  const { broadcastNotice, notices, deleteNotice, schools } = useAuth();
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('All Parents');
  const [isUrgent, setIsUrgent] = useState(false);
  const [sentStatus, setSentStatus] = useState('');

  if (!isOpen) return null;

  const smartTemplates = [
    {
      label: '🚦 Route Traffic Delay (15 Mins)',
      title: 'Morning Route Traffic Delay Notice (10-15 Mins)',
      body: 'Dear Parents, due to morning traffic congestion on Gangapur & College Road, morning school pickup is running approximately 10-15 minutes behind schedule. All children are safely seated under verified attendant supervision.',
      urgent: true
    },
    {
      label: '📅 Phase 2 (Term 2) Fee Reminder',
      title: 'Phase 2 (Term 2) School Bus Transport Fee Due Notice',
      body: 'Dear Parents, Phase 2 transportation fee cycle (Nov 2026 – Mar 2027) is active. Kindly clear pending Phase 2 balances online via UPI (8767948553@upi) or offline cash to download verified official receipts from your Parent Portal.',
      urgent: false
    },
    {
      label: '💰 General Fee Reminder',
      title: 'Reminder: Term School Bus Transportation Fee Due',
      body: 'Dear Parents, kindly clear any pending term transport fees by this weekend. Offline cash handover and UPI to 8767948553@upi are verified and updated with instant paper receipts.',
      urgent: false
    },
    {
      label: '🌧️ Monsoon / Weather Caution',
      title: 'Monsoon Transit Advisory: Safe Slow Commute',
      body: 'Dear Parents, due to continuous heavy rainfall in Nashik, all school buses are operating under strict safety speed limiters with extra caution. Minor delays of 10 minutes may occur during evening drop.',
      urgent: true
    },
    {
      label: '📅 School Holiday Notice',
      title: 'School Transport Holiday Notice',
      body: 'Dear Parents, please note that school bus transport services will remain closed tomorrow for the official holiday. Normal schedule resumes the next school working day.',
      urgent: false
    },
    {
      label: '🚌 Vehicle Route Update',
      title: 'Transport Fleet Route & Attendant Update',
      body: 'Dear Parents, designated bus routes and trained attendants are active for all school routes. For any sudden address or stop change requests, please contact Mr. Siddharth directly.',
      urgent: false
    }
  ];

  const handleApplyTemplate = (tmpl) => {
    setTitle(tmpl.title);
    setMessage(tmpl.body);
    setIsUrgent(tmpl.urgent);
    setSentStatus('');
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    broadcastNotice({
      title: title.trim(),
      content: message.trim(),
      target: targetAudience,
      urgent: isUrgent
    });

    setSentStatus('Notice published live to the top ticker & parent portal!');
    setTitle('');
    setMessage('');
    setIsUrgent(false);

    setTimeout(() => {
      setSentStatus('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 text-left font-sans">
      <div className="bg-white border border-zinc-200 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative max-h-[92vh] flex flex-col text-zinc-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#D97B29] flex items-center justify-center flex-shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 leading-tight">
                Live Broadcast Dispatcher
              </h2>
              <p className="text-xs text-zinc-500">
                Publish instant announcements to the website header ticker &amp; Parent Portal
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          
          {/* Quick Smart Templates */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D97B29]" />
              <span>1-Click Smart Presets</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {smartTemplates.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-50 hover:bg-amber-50 hover:border-amber-300 text-zinc-700 hover:text-[#231A12] border border-zinc-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Broadcast Form */}
          <form onSubmit={handlePublish} className="space-y-3 text-xs">
            
            {/* Target Audience Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 outline-none"
                >
                  <option value="All Parents">All Enrolled Parents (Universal)</option>
                  {schools.map(s => (
                    <option key={s.id} value={`${s.name} Parents`}>Only {s.name} Parents</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">
                  Priority Level
                </label>
                <div className="flex items-center gap-3 pt-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-red-700 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Mark as URGENT (Red Pulse)</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Headline */}
            <div>
              <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">
                Announcement Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bus #2 Morning Route 15-Min Delay Notice"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs font-bold text-zinc-900 focus:bg-white focus:border-amber-600 outline-none"
              />
            </div>

            {/* Detailed Body */}
            <div>
              <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">
                Announcement Message *
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter complete message for parents..."
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 text-xs text-zinc-900 focus:bg-white focus:border-amber-600 outline-none leading-relaxed"
              />
            </div>

            {/* Live Ticker Preview */}
            {title && (
              <div className="bg-zinc-900 text-zinc-200 p-3 rounded-xl space-y-1 text-xs border border-zinc-800">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-zinc-400">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Eye className="w-3 h-3" />
                    <span>Live Parent Ticker Preview:</span>
                  </span>
                  <span>{targetAudience}</span>
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${isUrgent ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                    {isUrgent ? 'URGENT' : 'NOTICE'}
                  </span>
                  <span className="font-bold text-white truncate">{title}:</span>
                  <span className="text-zinc-300 truncate">{message}</span>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-[11px] text-zinc-500">
                Visible instantly on all parent devices upon publish.
              </span>

              <button
                type="submit"
                disabled={!title.trim() || !message.trim()}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#D97B29] hover:bg-[#C4621C] text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer uppercase tracking-wider"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Now</span>
              </button>
            </div>

          </form>

          {/* Success Status */}
          {sentStatus && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{sentStatus}</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
