import React from 'react';
import { IndianRupee, CheckCircle2, AlertCircle, Calendar, CreditCard, Download, Clock } from 'lucide-react';

export default function FeeStatusCard({
  total = 32000,
  paid = 16000,
  due = 16000,
  status = "PARTIAL",
  lastPaymentDate = "2026-06-15",
  nextDueDate = "2026-10-15",
  lastReceiptNo = "REC-2026-0891",
  onPayOnline,
  onDownloadReceipt
}) {
  const percentage = Math.round((paid / (total || 1)) * 100);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white border-2 border-[#B08D57] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-left">
      
      {/* Top Header with Status Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F5E8D3]">
        <div className="space-y-1">
          <div className="text-xs font-black uppercase tracking-wider text-[#7A6A5C]">
            Academic Session 2026 - 2027
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#231A12] font-heading">
            Annual Transportation Fee Overview
          </h3>
        </div>

        {/* Status Badges */}
        <div>
          {status === 'PAID' ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EAF2EC] text-[#2F4F35] border border-[#6B8F71] text-xs font-black uppercase tracking-wider shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#6B8F71]" />
              <span>Full Fee Cleared</span>
            </span>
          ) : status === 'DUE' ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-50 text-red-800 border border-red-300 text-xs font-black uppercase tracking-wider animate-pulse">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Payment Pending</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFF4E8] text-[#8C4A15] border border-[#D97B29] text-xs font-black uppercase tracking-wider">
              <Clock className="w-4 h-4 text-[#D97B29]" />
              <span>Partial Paid ({percentage}%)</span>
            </span>
          )}
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Fee */}
        <div className="bg-[#FBF3E7]/70 p-5 rounded-2xl border border-[#B08D57]/40 space-y-1">
          <div className="text-[11px] font-black text-[#7A6A5C] uppercase tracking-wider">
            Total Annual Fee
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#231A12] font-heading">
            {formatCurrency(total)}
          </div>
          <div className="text-[11px] text-[#7A6A5C] font-medium">
            Standard Term Schedule
          </div>
        </div>

        {/* Amount Paid */}
        <div className="bg-[#EAF2EC] p-5 rounded-2xl border border-[#6B8F71] space-y-1">
          <div className="text-[11px] font-black text-[#2F4F35] uppercase tracking-wider">
            Amount Paid
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2F4F35] font-heading">
            {formatCurrency(paid)}
          </div>
          <div className="text-[11px] text-[#6B8F71] font-bold">
            {percentage}% Cleared
          </div>
        </div>

        {/* Outstanding Due */}
        <div className={`p-5 rounded-2xl border space-y-1 ${due > 0 ? 'bg-red-50/70 border-red-200' : 'bg-[#FBF3E7]/70 border-[#B08D57]/40'}`}>
          <div className="text-[11px] font-black text-[#7A6A5C] uppercase tracking-wider">
            Outstanding Due
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-heading ${due > 0 ? 'text-red-700' : 'text-[#6B8F71]'}`}>
            {formatCurrency(due)}
          </div>
          <div className="text-[11px] text-[#7A6A5C] font-medium">
            {due > 0 ? `Next Due: ${nextDueDate}` : 'No Pending Dues'}
          </div>
        </div>

      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-[#7A6A5C]">
          <span>Settlement Progress</span>
          <span className="font-mono text-[#231A12]">{percentage}% Complete</span>
        </div>
        <div className="w-full h-3 bg-[#F5E8D3] rounded-full overflow-hidden border border-[#B08D57]/30">
          <div 
            className="h-full bg-gradient-to-r from-[#6B8F71] to-[#D97B29] transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#7A6A5C]">
          Last Receipt: <strong className="font-mono text-[#231A12]">{lastReceiptNo}</strong> ({lastPaymentDate})
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {due > 0 && onPayOnline && (
            <button
              onClick={onPayOnline}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D97B29] to-[#C4621C] hover:from-[#C4621C] hover:to-[#B55515] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#D97B29]/30 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Balance (₹{due})</span>
            </button>
          )}

          {onDownloadReceipt && (
            <button
              onClick={onDownloadReceipt}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-[#FBF3E7] text-[#231A12] border-2 border-[#B08D57] font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4 text-[#D97B29]" />
              <span>View / Print Receipt</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
