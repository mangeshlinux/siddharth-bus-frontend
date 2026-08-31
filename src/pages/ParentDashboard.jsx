import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  PhoneCall, 
  Download, 
  Receipt, 
  ShieldCheck, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Clock, 
  Bus,
  Info,
  Check,
  History,
  Lock,
  CreditCard,
  QrCode,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';
import { useAuth, calculateFeeBreakdown } from '../context/AuthContext';
import ReceiptModal from '../components/ReceiptModal';

export default function ParentDashboard() {
  const { user, students, notices } = useAuth();
  
  // Find all children linked to this parent's phone number
  const activeStudentList = students.filter(s => s.parentPhone === user?.phone);
  const parentName = activeStudentList[0]?.parentName || 'Parent';

  // Selected child tab for multi-child parents (defaults to first child or 'ALL')
  const [selectedChildId, setSelectedChildId] = useState(() => activeStudentList[0]?.id || null);

  // Sync selected child if list changes
  useEffect(() => {
    if (activeStudentList.length > 0 && !activeStudentList.some(s => s.id === selectedChildId)) {
      setSelectedChildId(activeStudentList[0].id);
    }
  }, [activeStudentList, selectedChildId]);

  // Track downloaded receipts to enforce 1-time download policy
  const [downloadedReceipts, setDownloadedReceipts] = useState(() => {
    try {
      const saved = localStorage.getItem(`downloaded_receipts_${user?.phone}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user?.phone) {
      localStorage.setItem(`downloaded_receipts_${user?.phone}`, JSON.stringify(downloadedReceipts));
    }
  }, [downloadedReceipts, user?.phone]);

  const markReceiptAsDownloaded = (receiptNo) => {
    if (receiptNo && !downloadedReceipts.includes(receiptNo)) {
      setDownloadedReceipts(prev => [...prev, receiptNo]);
    }
  };

  // Modals
  const [selectedReceiptData, setSelectedReceiptData] = useState({ 
    isOpen: false, 
    student: null, 
    receipt: null,
    isDownloaded: false
  });

  // UPI Online Pay Modal State
  const [payModalData, setPayModalData] = useState({
    isOpen: false,
    student: null,
    targetPhase: 'Phase 2 (Term 2)',
    suggestedAmount: 0
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Aggregated household stats
  const totalHouseholdAnnual = activeStudentList.reduce((sum, s) => {
    const b = calculateFeeBreakdown(s);
    return sum + b.totalAnnualFee;
  }, 0);

  const totalHouseholdMonthly = activeStudentList.reduce((sum, s) => {
    const b = calculateFeeBreakdown(s);
    return sum + b.monthlyFee;
  }, 0);

  const totalHouseholdPaid = activeStudentList.reduce((sum, s) => {
    const b = calculateFeeBreakdown(s);
    return sum + b.paidAmount;
  }, 0);

  const totalHouseholdDue = activeStudentList.reduce((sum, s) => {
    const b = calculateFeeBreakdown(s);
    return sum + b.dueAmount;
  }, 0);

  const totalHouseholdMonthlyDue = activeStudentList.reduce((sum, s) => {
    const b = calculateFeeBreakdown(s);
    return sum + b.monthlyDue;
  }, 0);

  const isHouseholdCleared = totalHouseholdDue === 0;

  if (activeStudentList.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#FAF7F2]">
        <div className="bg-white border border-[#E5DAC6] p-8 rounded-2xl max-w-md w-full text-center shadow-xs space-y-3">
          <AlertCircle className="w-10 h-10 text-[#D97B29] mx-auto" />
          <h2 className="text-lg font-bold text-[#231A12]">No Linked Records Found</h2>
          <p className="text-xs text-[#7A6A5C]">
            No student profile found linked to mobile number <strong className="font-mono text-[#231A12]">+91 {user?.phone}</strong>.
          </p>
          <div className="pt-2">
            <a 
              href="tel:8446391127" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D97B29] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Mobile No.: 8446391127</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Active student object when focused on a child
  const currentFocusedStudent = activeStudentList.find(s => s.id === selectedChildId) || activeStudentList[0];
  const focusedBreakdown = calculateFeeBreakdown(currentFocusedStudent);

  return (
    <div className="min-h-screen py-6 bg-[#FAF7F2] text-[#231A12] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
        
        {/* 1. SINGLE-LINE CLEAN WELCOME & SUPPORT HEADER */}
        <div className="bg-white border border-[#E5DAC6] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Welcome Line */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <span className="text-base sm:text-lg font-black text-[#231A12] font-heading">
                Welcome, {parentName}
              </span>
              <span className="text-zinc-300 hidden sm:inline">•</span>
              <span className="text-[#7A6A5C]">
                Registered Mobile: <strong className="font-mono text-[#231A12]">+91 {user?.phone}</strong>
              </span>
              <span className="text-zinc-300 hidden sm:inline">•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E5DAC6] text-[#D97B29] font-bold text-[11px]">
                {activeStudentList.length} {activeStudentList.length === 1 ? 'Child Enrolled' : 'Children Enrolled'}
              </span>
            </div>

            {/* Support Helpline Link */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <a
                href="tel:8446391127"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F0] hover:bg-white text-[#231A12] hover:text-[#D97B29] border border-[#E5DAC6] text-xs font-bold transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#D97B29]" />
                <span>Mobile No.: <strong className="font-mono">8446391127</strong></span>
              </a>

              <a
                href={`https://wa.me/918446391127?text=${encodeURIComponent(`Hello Mr. Siddharth Kailas Shardul, regards from ${parentName} (Parent) regarding school bus transportation fee settlement.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>WhatsApp</span>
              </a>
            </div>

          </div>
        </div>

        {/* 2. DUAL MONTHLY & PHASE 2 HOUSEHOLD SUMMARY STRIP */}
        <div className="bg-white border border-[#E5DAC6] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#F5E8D3]">
            
            {/* Metric 1: Monthly Transport Rate */}
            <div className="p-2 sm:px-3">
              <span className="text-[10px] font-bold text-[#7A6A5C] uppercase tracking-wider block">
                Monthly Rate
              </span>
              <div className="text-lg sm:text-2xl font-black text-[#231A12] font-mono mt-0.5">
                {formatCurrency(totalHouseholdMonthly)} <span className="text-xs font-bold text-[#7A6A5C]">/ mo</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#7A6A5C] mt-0.5">
                Full Year: <strong>{formatCurrency(totalHouseholdAnnual)}</strong>
              </div>
            </div>

            {/* Metric 2: Total Paid Amount */}
            <div className="p-2 sm:px-3">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Total Fees Paid
              </span>
              <div className="text-lg sm:text-2xl font-black font-mono mt-0.5 text-emerald-700">
                {formatCurrency(totalHouseholdAnnual - totalHouseholdDue)}
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-800 font-bold mt-0.5">
                {isHouseholdCleared ? '✓ 100% Fully Settled' : 'Installments Approved'}
              </div>
            </div>

            {/* Metric 3: Pending Balance Due */}
            <div className="p-2 sm:px-3 pt-3 sm:pt-2">
              <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">
                Pending Balance Due
              </span>
              <div className={`text-lg sm:text-2xl font-black font-mono mt-0.5 ${totalHouseholdDue > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                {totalHouseholdDue > 0 ? formatCurrency(totalHouseholdDue) : '₹0 (Cleared)'}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#7A6A5C] font-medium mt-0.5">
                {totalHouseholdDue > 0 ? 'Next Due: 10th of Month' : '✓ No Balance Due'}
              </div>
            </div>

            {/* Metric 4: Quick Action */}
            <div className="p-2 sm:px-3 pt-3 sm:pt-2 flex flex-col justify-center">
              {totalHouseholdDue > 0 ? (
                <button
                  onClick={() => setPayModalData({
                    isOpen: true,
                    student: currentFocusedStudent,
                    suggestedAmount: focusedBreakdown.dueAmount > 0 ? focusedBreakdown.dueAmount : focusedBreakdown.monthlyFee
                  })}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#D97B29] hover:bg-[#C4621C] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Pay Balance Online</span>
                </button>
              ) : (
                <div className="text-center p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>All Dues Cleared</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 3. MULTI-CHILD SELECTION TABS (IF > 1 CHILD) */}
        {activeStudentList.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-[#7A6A5C] uppercase tracking-wider mr-1">
              Select Child:
            </span>
            {activeStudentList.map((stu) => {
              const b = calculateFeeBreakdown(stu);
              const isSelected = stu.id === selectedChildId;
              return (
                <button
                  key={stu.id}
                  onClick={() => setSelectedChildId(stu.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-[#3B2314] text-white border-[#3B2314] shadow-xs'
                      : 'bg-white hover:bg-[#FAF7F0] text-[#231A12] border-[#E5DAC6]'
                  }`}
                >
                  <span>{stu.studentName}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    b.dueAmount === 0 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {b.dueAmount === 0 ? '✓ Paid' : `Due: ₹${b.dueAmount}`}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 4. MAIN ENROLLED CHILD SPOTLIGHT & UNIFIED FEE OVERVIEW */}
        <section className="bg-white border border-[#E5DAC6] rounded-2xl p-5 sm:p-6 shadow-xs space-y-6 text-left">
          
          {/* Child Profile Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F5E8D3]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B2314] to-[#231A12] text-[#D97B29] font-black font-heading text-xl flex items-center justify-center flex-shrink-0 shadow-2xs">
                {currentFocusedStudent.studentName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-[#231A12] leading-tight">
                    {currentFocusedStudent.studentName}
                  </h2>
                </div>
                <p className="text-xs text-[#7A6A5C] mt-0.5">
                  <strong className="text-[#231A12]">{currentFocusedStudent.schoolName}</strong> • 🚌 {currentFocusedStudent.busNo || 'Bus #1'} ({currentFocusedStudent.routeName || 'Bus Route'})
                </p>
              </div>
            </div>

            {/* Monthly Fee Pill & Online Pay Button */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <div className="bg-[#FAF7F0] border border-[#E5DAC6] px-3.5 py-1.5 rounded-xl text-right">
                <span className="text-[10px] font-bold uppercase text-[#7A6A5C] block">
                  Monthly Fee
                </span>
                <span className="text-base font-mono font-black text-[#231A12]">
                  ₹{focusedBreakdown.monthlyFee.toLocaleString('en-IN')}<span className="text-xs font-normal text-[#7A6A5C]">/mo</span>
                </span>
              </div>

              {focusedBreakdown.dueAmount > 0 ? (
                <button
                  onClick={() => setPayModalData({
                    isOpen: true,
                    student: currentFocusedStudent,
                    suggestedAmount: focusedBreakdown.dueAmount
                  })}
                  className="px-4 py-2.5 rounded-xl bg-[#D97B29] hover:bg-[#C4621C] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay Online (₹{focusedBreakdown.dueAmount.toLocaleString('en-IN')})</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Full Year Cleared</span>
                </span>
              )}
            </div>
          </div>

          {/* 4A. CLEAN UNIFIED 4-METRIC FEE OVERVIEW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF7F0] p-4 rounded-2xl border border-[#E5DAC6]">
            <div>
              <span className="text-[10px] font-bold text-[#7A6A5C] uppercase tracking-wider block">
                Yearly Total Fee
              </span>
              <span className="text-base sm:text-lg font-mono font-black text-[#231A12] block mt-0.5">
                ₹{focusedBreakdown.totalAnnualFee.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[#7A6A5C]">11-Month Session</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#7A6A5C] uppercase tracking-wider block">
                Monthly Rate
              </span>
              <span className="text-base sm:text-lg font-mono font-black text-[#231A12] block mt-0.5">
                ₹{focusedBreakdown.monthlyFee.toLocaleString('en-IN')}/mo
              </span>
              <span className="text-[10px] text-[#7A6A5C]">June to April</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Approved Paid
              </span>
              <span className="text-base sm:text-lg font-mono font-black text-emerald-700 block mt-0.5">
                ₹{focusedBreakdown.paidAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-emerald-700">
                {focusedBreakdown.clearedMonthsCount} of 11 Months Cleared
              </span>
            </div>

            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${focusedBreakdown.dueAmount > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                Remaining Balance
              </span>
              <span className={`text-base sm:text-lg font-mono font-black block mt-0.5 ${focusedBreakdown.dueAmount > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                {focusedBreakdown.dueAmount > 0 ? `₹${focusedBreakdown.dueAmount.toLocaleString('en-IN')}` : '₹0 (Settled)'}
              </span>
              <span className="text-[10px] text-[#7A6A5C]">
                {focusedBreakdown.dueAmount > 0 ? 'Pending Payment' : '✓ Cleared'}
              </span>
            </div>
          </div>

          {/* 4B. 11-MONTH ACADEMIC SESSION SCHEDULE VISUAL GRID (JUNE TO APRIL) */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D97B29]" />
                <h4 className="text-xs sm:text-sm font-bold text-[#231A12]">
                  11-Month Transportation Coverage Tracker (June to April)
                </h4>
              </div>
              <span className="text-xs font-mono text-[#7A6A5C]">
                {focusedBreakdown.clearedMonthsCount} of 11 Months Cleared ({Math.round((focusedBreakdown.clearedMonthsCount / 11) * 100)}%)
              </span>
            </div>

            {/* 11-Month Pill Tracker */}
            <div className="grid grid-cols-4 sm:grid-cols-11 gap-2">
              {focusedBreakdown.monthsList.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-center transition-colors ${
                    m.isCleared
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : m.isPartial
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-white border-[#E5DAC6] text-[#7A6A5C]'
                  }`}
                  title={`${m.fullName} - ₹${m.targetAmount}/mo`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider">
                    {m.month}
                  </div>
                  <div className="mt-1">
                    {m.isCleared ? (
                      <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1 py-0.2 rounded">
                        ✓ Paid
                      </span>
                    ) : m.isPartial ? (
                      <span className="inline-block text-[9px] font-bold text-amber-800 bg-amber-100/80 px-1 py-0.2 rounded">
                        Partial
                      </span>
                    ) : (
                      <span className="inline-block text-[9px] font-mono text-red-600 font-bold">
                        Due
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-[#7A6A5C] bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E5DAC6]">
              <span>Monthly Rate: <strong className="font-mono text-[#231A12]">₹{focusedBreakdown.monthlyFee}/month</strong></span>
              <span>Yearly Total: <strong className="font-mono text-[#231A12]">₹{focusedBreakdown.totalAnnualFee}</strong></span>
              <span>Academic Session: <strong>June 2026 to April 2027 (11 Months)</strong></span>
            </div>
          </div>

        </section>

        {/* 5. DEDICATED OFFICIAL FEE & RECEIPT SETTLEMENT LEDGER */}
        <section className="bg-white border border-[#E5DAC6] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F5E8D3]">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#231A12] flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#D97B29]" />
                <span>Transportation Fee Ledger &amp; Verified Receipts</span>
              </h2>
              <p className="text-xs text-[#7A6A5C]">
                Official records approved by Mr. Siddharth Kailas Shardul (Proprietor)
              </p>
            </div>

            <div className="text-xs font-mono text-[#7A6A5C]">
              Session 2026 - 2027 (June to April)
            </div>
          </div>

          {/* Reassuring Coordination & Payment Notice */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E5DAC6] text-xs text-[#7A6A5C] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#D97B29] flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-[#231A12]">Offline Fee Approval &amp; 1-Time Receipt Download:</strong> Fees paid offline or via UPI are verified and approved by Mr. Siddharth Kailas Shardul. Once approved, you can download your official paper receipt. Per security policy, receipts are available for one-time download and remain permanently accessible for history verification.
            </div>
          </div>

          {/* Official Fee Ledger Table */}
          <div className="overflow-x-auto rounded-xl border border-[#E5DAC6]">
            <table className="w-full text-left text-xs text-[#231A12] border-collapse">
              <thead className="bg-[#FAF7F0] text-[#7A6A5C] border-b border-[#E5DAC6] font-bold uppercase text-[10px] tracking-wider select-none">
                <tr>
                  <th className="p-3 pl-4">Student &amp; School</th>
                  <th className="p-3 text-right">Monthly Rate</th>
                  <th className="p-3 text-right">Yearly Total</th>
                  <th className="p-3 text-right text-emerald-800">Approved Paid (₹)</th>
                  <th className="p-3 text-right text-red-700">Remaining Due (₹)</th>
                  <th className="p-3 text-center">Coverage Status</th>
                  <th className="p-3 text-center pr-4">Approved Paper Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DAC6]/60 font-sans">
                {activeStudentList.map((stu) => {
                  const b = calculateFeeBreakdown(stu);
                  const isPaid = (b.dueAmount === 0);
                  const hasApprovedPayment = (b.paidAmount > 0);
                  const receiptNo = b.lastReceiptNo || `REC-2026-0${stu.id * 142}`;
                  const isDownloaded = downloadedReceipts.includes(receiptNo);

                  return (
                    <tr key={stu.id} className="hover:bg-[#FAF7F0]/60 transition-colors">
                      {/* Student Info */}
                      <td className="p-3 pl-4">
                        <div className="font-bold text-[#231A12] text-xs">
                          {stu.studentName}
                        </div>
                        <div className="text-[11px] text-[#7A6A5C]">
                          {stu.schoolName}
                        </div>
                      </td>

                      {/* Monthly Fee */}
                      <td className="p-3 text-right font-mono font-bold text-xs text-[#231A12]">
                        ₹{b.monthlyFee.toLocaleString('en-IN')}<span className="text-[10px] text-[#7A6A5C]">/mo</span>
                      </td>

                      {/* Annual Total Fee */}
                      <td className="p-3 text-right font-mono font-bold text-xs text-[#7A6A5C]">
                        ₹{b.totalAnnualFee.toLocaleString('en-IN')}
                      </td>

                      {/* Approved Paid Amount */}
                      <td className="p-3 text-right font-mono font-bold text-xs text-emerald-700">
                        <div>₹{b.paidAmount.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-[#7A6A5C] font-normal">{b.clearedMonthsCount}/11 Mo Cleared</div>
                      </td>

                      {/* Remaining Due Balance */}
                      <td className="p-3 text-right font-mono font-bold text-xs text-red-600">
                        {b.dueAmount > 0 ? `₹${b.dueAmount.toLocaleString('en-IN')}` : '₹0 (Settled)'}
                      </td>

                      {/* Status */}
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isPaid 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : (b.paidAmount > 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-red-100 text-red-900 border border-red-200')
                        }`}>
                          {isPaid ? '✓ Fully Cleared' : (b.paidAmount > 0 ? 'Partial Paid' : 'Pending Payment')}
                        </span>
                      </td>

                      {/* Official Verified Paper Receipt */}
                      <td className="p-3 pr-4 text-center">
                        {hasApprovedPayment ? (
                          !isDownloaded ? (
                            <button
                              onClick={() => {
                                setSelectedReceiptData({
                                  isOpen: true,
                                  student: stu,
                                  receipt: {
                                    receiptNo,
                                    amount: b.paidAmount,
                                    date: b.lastPaymentDate || '2026-08-15',
                                    mode: b.paymentMode || 'Offline / UPI Approved',
                                    term: b.dueAmount === 0 ? 'Full Academic Year Transport Fee (June to April)' : 'Monthly Transport Installment'
                                  },
                                  isDownloaded: false
                                });
                              }}
                              className="px-3.5 py-1.5 bg-[#D97B29] hover:bg-[#C4621C] text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download Receipt (1-Time)</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedReceiptData({
                                  isOpen: true,
                                  student: stu,
                                  receipt: {
                                    receiptNo,
                                    amount: b.paidAmount,
                                    date: b.lastPaymentDate || '2026-08-15',
                                    mode: b.paymentMode || 'Offline / UPI Approved',
                                    term: b.dueAmount === 0 ? 'Full Academic Year Transport Fee (June to April)' : 'Monthly Transport Installment'
                                  },
                                  isDownloaded: true
                                });
                              }}
                              className="px-3.5 py-1.5 bg-white hover:bg-[#FAF7F0] border border-[#E5DAC6] text-[#7A6A5C] hover:text-[#231A12] font-semibold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                              title="Receipt already downloaded. Click to view archived history record."
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>View History Archive</span>
                            </button>
                          )
                        ) : (
                          <span className="text-[11px] font-medium text-[#7A6A5C] bg-[#FAF7F0] px-2.5 py-1 rounded-md border border-[#E5DAC6] inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#D97B29]" />
                            <span>Awaiting Owner Approval</span>
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </section>

        {/* 6. PAY ONLINE UPI SCANNER MODAL */}
        {payModalData.isOpen && payModalData.student && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 text-left font-sans">
            <div className="bg-white border border-[#E5DAC6] rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-[#231A12]">
              <button 
                onClick={() => setPayModalData({ isOpen: false, student: null, suggestedAmount: 0 })}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 pb-3 border-b border-[#F5E8D3] mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97B29] flex items-center justify-center border border-amber-200 flex-shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#231A12]">
                    Pay Transportation Fee Online
                  </h3>
                  <p className="text-xs text-[#7A6A5C]">
                    Instant UPI QR for {payModalData.student.studentName}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* Particulars Card */}
                <div className="bg-[#FAF7F0] p-3.5 rounded-xl border border-[#E5DAC6] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#7A6A5C]">Student:</span>
                    <strong className="text-[#231A12]">{payModalData.student.studentName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A6A5C]">School:</span>
                    <strong className="text-[#231A12]">{payModalData.student.schoolName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A6A5C]">Amount to Pay:</span>
                    <strong className="text-base font-mono text-red-700 font-black">
                      ₹{payModalData.suggestedAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="text-center p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                  <div className="w-44 h-44 mx-auto bg-white p-2 border border-zinc-300 rounded-xl shadow-xs flex items-center justify-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=8446391127@upi&pn=Siddharth%20Kailas%20Shardul&am=${payModalData.suggestedAmount}&cu=INR&tn=${encodeURIComponent(`BusFee-${payModalData.student.studentName}`)}`)}`}
                      alt="UPI QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[11px] text-[#7A6A5C]">
                    Scan using PhonePe / Google Pay / Paytm / Any UPI App
                  </div>
                  <div className="font-mono text-xs font-bold text-[#231A12] bg-white py-1 px-3 rounded-lg border border-zinc-200 inline-block">
                    UPI ID: <strong>8446391127@upi</strong>
                  </div>
                </div>

                {/* WhatsApp Notification Link */}
                <a
                  href={`https://wa.me/918446391127?text=${encodeURIComponent(`Hello Mr. Siddharth Kailas Shardul, I have paid the transport fee of ₹${payModalData.suggestedAmount} for ${payModalData.student.studentName} (${payModalData.student.schoolName}) via UPI. Kindly verify and approve the receipt.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Notify Mr. Siddharth on WhatsApp After Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <div className="text-[10px] text-center text-[#7A6A5C]">
                  Once confirmed by Mr. Siddharth Kailas Shardul, your official paper receipt will become ready for 1-time download.
                </div>

              </div>
            </div>
          </div>
        )}

        {/* 7. AUTHENTIC PHYSICAL PAPER RECEIPT MODAL (NO SCROLL, ONE-TIME DOWNLOAD) */}
        {selectedReceiptData.isOpen && (
          <ReceiptModal
            isOpen={selectedReceiptData.isOpen}
            onClose={() => setSelectedReceiptData({ isOpen: false, student: null, receipt: null, isDownloaded: false })}
            student={selectedReceiptData.student}
            receipt={selectedReceiptData.receipt}
            isAlreadyDownloaded={selectedReceiptData.isDownloaded}
            onMarkDownloaded={(rNo) => {
              markReceiptAsDownloaded(rNo);
              setSelectedReceiptData(prev => ({ ...prev, isDownloaded: true }));
            }}
          />
        )}

      </div>
    </div>
  );
}
