import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { 
  Users, 
  IndianRupee, 
  AlertCircle, 
  FileSpreadsheet, 
  Share2, 
  Download, 
  RotateCcw,
  Plus,
  Trash2,
  Building2,
  TrendingUp,
  CheckCircle2,
  Table,
  Radio,
  Sparkles,
  AlertTriangle,
  Send,
  Eye,
  Calendar,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StudentTable from '../components/StudentTable';
import ExcelUploadModal from '../components/ExcelUploadModal';
import NotificationModal from '../components/NotificationModal';
import AddStudentModal from '../components/AddStudentModal';

export default function OwnerPortal_x9f2() {
  const { 
    students, 
    schools, 
    notices, 
    deleteNotice, 
    clearAllNotices, 
    resetDemoData,
    broadcastNotice
  } = useAuth();

  const [activeTab, setActiveTab] = useState('STUDENTS');
  
  // Modals state
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  // In-tab Quick Broadcast Composer
  const [quickTitle, setQuickTitle] = useState('');
  const [quickBody, setQuickBody] = useState('');
  const [quickUrgent, setQuickUrgent] = useState(false);
  const [quickTarget, setQuickTarget] = useState('All Parents');

  // Aggregated Financial & Student Metrics (Yearly & Monthly Breakdown)
  const totalStudents = students.length;
  const totalCollectedFees = students.reduce((acc, s) => acc + (s.feeDetails?.paidAmount || 0), 0);
  const totalPendingDues = students.reduce((acc, s) => acc + (s.feeDetails?.dueAmount ?? Math.max(0, (s.feeDetails?.totalAnnualFee || 30000) - (s.feeDetails?.paidAmount || 0))), 0);
  const totalAnnualValue = totalCollectedFees + totalPendingDues;
  
  // 11-Month Academic Session Standard (June to April)
  const totalMonthlyContract = totalStudents > 0 ? Math.round(totalAnnualValue / 11) : 0;
  const monthlyAvgCollected = totalStudents > 0 ? Math.round(totalCollectedFees / 11) : 0;
  const monthlyPendingDue = totalStudents > 0 ? Math.round(totalPendingDues / 11) : 0;

  const collectionPercentage = totalAnnualValue > 0 ? Math.round((totalCollectedFees / totalAnnualValue) * 100) : 100;
  const pendingStudentsCount = students.filter(s => (s.feeDetails?.dueAmount ?? Math.max(0, (s.feeDetails?.totalAnnualFee || 33000) - (s.feeDetails?.paidAmount || 0))) > 0).length;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const exportStudentsToExcel = () => {
    const exportData = students.map((s, index) => {
      const b = calculateFeeBreakdown(s);

      return {
        "Sr. No": index + 1,
        "Student Name": s.studentName,
        "Linked Parent Phone": s.parentPhone,
        "Parent Name": s.parentName,
        "School / Institute": s.schoolName,
        "Pickup Stop": s.stopName,
        "Pickup Time": s.pickupTime || "07:15 AM",
        "Monthly Fee (INR)": b.monthlyFee,
        "Yearly Total Fee (INR)": b.totalAnnualFee,
        "Approved Paid (INR)": b.paidAmount,
        "Balance Due (INR)": b.dueAmount,
        "Cleared Months (Out of 11)": `${b.clearedMonthsCount}/11`,
        "Payment Status": b.dueAmount === 0 ? "PAID" : "DUE",
        "Last Payment Date": s.feeDetails?.lastPaymentDate || "N/A",
        "Last Receipt No": s.feeDetails?.lastReceiptNo || "N/A"
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Master_Student_Fee_Roster");
    XLSX.writeFile(workbook, `Siddharth_Travels_Roster_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const [quickPublishing, setQuickPublishing] = useState(false);

  const handleQuickPublish = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim() || !quickBody.trim()) return;

    setQuickPublishing(true);
    const res = await broadcastNotice({
      title: quickTitle.trim(),
      content: quickBody.trim(),
      target: quickTarget,
      urgent: quickUrgent
    });
    setQuickPublishing(false);

    if (res) {
      setQuickTitle('');
      setQuickBody('');
      setQuickUrgent(false);
    }
  };

  return (
    <div className="min-h-screen py-6 bg-[#FAF7F2] text-[#231A12] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 text-left">
        
        {/* 1. COMPACT SPREADSHEET TOOLBAR */}
        <div className="bg-white border border-[#E5DAC6] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Title & Quick Stats */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF4E8] border border-[#E5DAC6] text-[#D97B29] flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-[#231A12] leading-tight">
                  Master Student Roster &amp; Fee Ledger
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[11px] font-bold">
                  {totalStudents} Enrolled
                </span>
              </div>
              <p className="text-xs text-[#7A6A5C]">
                Manage all student records, link parent numbers, set monthly/yearly fees, and broadcast live notices.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D97B29] hover:bg-[#C4621C] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add Student</span>
            </button>

            <button
              onClick={() => setIsExcelModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#FAF7F0] text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Import Excel</span>
            </button>

            <button
              onClick={exportStudentsToExcel}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#FAF7F0] text-[#231A12] border border-[#E5DAC6] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="Download Master Sheet (.xlsx)"
            >
              <Download className="w-3.5 h-3.5 text-[#D97B29]" />
              <span>Export Sheet</span>
            </button>
          </div>

        </div>

        {/* 2. REVENUE & FINANCIAL SUMMARY (MONTHLY & YEARLY DUAL BREAKDOWN) */}
        <div className="bg-white border border-[#E5DAC6] rounded-2xl p-4 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#F5E8D3]">
            
            {/* Stat 1: Total Revenue Contract (Yearly + Monthly) */}
            <div className="p-2 sm:px-3">
              <span className="text-[10px] font-bold text-[#7A6A5C] uppercase tracking-wider block">
                Total Revenue
              </span>
              <div className="text-lg sm:text-2xl font-black text-[#231A12] font-mono mt-0.5">
                {formatCurrency(totalAnnualValue)}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#7A6A5C] font-mono mt-0.5">
                <strong>{formatCurrency(totalMonthlyContract)}</strong> / mo expected
              </div>
            </div>

            {/* Stat 2: Collected Revenue (Yearly + Monthly avg) */}
            <div className="p-2 sm:px-3">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Collected Revenue
              </span>
              <div className="text-lg sm:text-2xl font-black text-emerald-700 font-mono mt-0.5">
                {formatCurrency(totalCollectedFees)}
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-700 font-bold mt-0.5">
                {collectionPercentage}% Cleared ({formatCurrency(monthlyAvgCollected)}/mo)
              </div>
            </div>

            {/* Stat 3: Monthly & Yearly Due Breakdown */}
            <div className="p-2 sm:px-3 pt-3 sm:pt-2">
              <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">
                Monthly Due Pending
              </span>
              <div className="text-lg sm:text-2xl font-black text-red-700 font-mono mt-0.5">
                {formatCurrency(monthlyPendingDue)} <span className="text-xs font-bold text-red-600">/ mo</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-red-700 font-medium mt-0.5">
                Yearly: <strong>{formatCurrency(totalPendingDues)}</strong> ({pendingStudentsCount} pending)
              </div>
            </div>

            {/* Stat 4: Student Roster Coverage */}
            <div className="p-2 sm:px-3 pt-3 sm:pt-2">
              <span className="text-[10px] font-bold text-[#7A6A5C] uppercase tracking-wider block">
                Enrolled Roster
              </span>
              <div className="text-lg sm:text-2xl font-black text-[#231A12] font-mono mt-0.5">
                {totalStudents} <span className="text-xs font-normal text-[#7A6A5C]">Students</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#7A6A5C] mt-0.5">
                Across {schools.length} Schools in Nashik
              </div>
            </div>

          </div>
        </div>

        {/* 3. TABS: STUDENT DIRECTORY & BROADCAST NOTICES */}
        <div className="flex items-center gap-2 border-b border-[#E5DAC6] pb-1">
          <button
            onClick={() => setActiveTab('STUDENTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'STUDENTS'
                ? 'bg-[#3B2314] text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#231A12] hover:bg-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Excel Student Sheet ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('NOTICES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'NOTICES'
                ? 'bg-[#3B2314] text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#231A12] hover:bg-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#D97B29]" />
            <span>Announcements &amp; Notices ({notices.length})</span>
          </button>
        </div>

        {/* 4. TAB 1: EXCEL STUDENT SHEET */}
        {activeTab === 'STUDENTS' && (
          <StudentTable onAddStudentClick={() => setIsAddStudentOpen(true)} />
        )}

        {/* 5. TAB 2: CLEAN PARENT ANNOUNCEMENTS & NOTICE CENTER */}
        {activeTab === 'NOTICES' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">
            
            {/* Left: Create New Announcement */}
            <div className="lg:col-span-5 bg-white border border-[#E5DAC6] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F5E8D3]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-[#D97B29] flex items-center justify-center">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#231A12]">
                      New Announcement
                    </h3>
                    <p className="text-[11px] text-[#7A6A5C]">
                      Broadcast live updates to website ticker &amp; parent dashboards
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleQuickPublish} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[#231A12] uppercase text-[10px] mb-1">
                    Target Parent Group / Audience
                  </label>
                  <select
                    value={quickTarget}
                    onChange={(e) => setQuickTarget(e.target.value)}
                    className="w-full bg-[#FAF7F0] border border-[#E5DAC6] rounded-xl px-3 py-2 text-xs font-bold text-[#231A12] outline-none"
                  >
                    <option value="All Parents">👥 All Enrolled Parents (Universal)</option>
                    <option value="Parents with Pending / Due Fees">⚠️ Parents with Pending / Due Fees Only</option>
                    <option value="Shree Chatrapati Shivaji Maharaj Vidhaylay Makhamalabad. Parents">🏫 Shree Chatrapati Shivaji Maharaj Vidhaylay Makhamalabad. Only</option>
                    <option value="New Grace Academy, Akta Nagar,Borgad Nashik Parents">🏫 New Grace Academy, Akta Nagar,Borgad Nashik Only</option>
                    <option value="Kaka Saheb Deodhar English Medium School, Reliance Pump Dindori Road.Nashik Parents">🏫 Kaka Saheb Deodhar English Medium School, Reliance Pump Dindori Road.Nashik Only</option>
                    <option value="Route 1 (Borgad / Makhamalabad) Parents">🚌 Route 1 (Borgad / Makhamalabad) Parents Only</option>
                    <option value="Route 2 (Adarsh / Vivekanand) Parents">🚌 Route 2 (Adarsh / Vivekanand) Parents Only</option>
                    <option value="Route 3 (Dindori Road / Borgad) Parents">🚌 Route 3 (Dindori Road / Borgad) Parents Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#231A12] uppercase text-[10px] mb-1">
                    Announcement Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tomorrow School Holiday Notice"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    className="w-full bg-[#FAF7F0] border border-[#E5DAC6] rounded-xl px-3 py-2 text-xs font-bold text-[#231A12] focus:bg-white focus:border-[#D97B29] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#231A12] uppercase text-[10px] mb-1">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Type announcement message for parents..."
                    value={quickBody}
                    onChange={(e) => setQuickBody(e.target.value)}
                    className="w-full bg-[#FAF7F0] border border-[#E5DAC6] rounded-xl p-2.5 text-xs text-[#231A12] focus:bg-white focus:border-[#D97B29] outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-red-700">
                    <input
                      type="checkbox"
                      checked={quickUrgent}
                      onChange={(e) => setQuickUrgent(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Mark as Urgent Alert</span>
                  </label>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="submit"
                    disabled={quickPublishing || !quickTitle.trim() || !quickBody.trim()}
                    className="w-full sm:flex-1 py-2.5 bg-[#D97B29] hover:bg-[#C4621C] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{quickPublishing ? 'Publishing...' : 'Publish Announcement'}</span>
                  </button>

                  {/* WhatsApp 1-Click Group Share */}
                  {quickTitle && quickBody && (
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`📢 *SIDDHARTH SCHOOL BUS & TRAVELS (NASHIK)*\n\n📌 *${quickTitle.toUpperCase()}*\n🎯 *Audience:* ${quickTarget}\n\n${quickBody}\n\n📞 Helpline: +91 84463 91127\n👤 Mr. Siddharth Kailas Shardul`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                      title="Share this announcement directly to parent WhatsApp group"
                    >
                      <span>Share to WhatsApp</span>
                    </a>
                  )}
                </div>
              </form>
            </div>

            {/* Right: Published Active Notices Board */}
            <div className="lg:col-span-7 bg-white border border-[#E5DAC6] rounded-2xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-[#F5E8D3]">
                <div>
                  <h3 className="text-sm font-bold text-[#231A12]">
                    Active Announcements ({notices.length})
                  </h3>
                  <p className="text-[11px] text-[#7A6A5C]">
                    Displayed live on website header ticker &amp; parent dashboards
                  </p>
                </div>

                {notices.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearAllNotices()}
                    className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors cursor-pointer active:scale-95"
                    title="Clear all active announcements"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {notices.length === 0 ? (
                  <div className="p-8 text-center text-[#7A6A5C] text-xs bg-[#FAF7F0] rounded-xl border border-[#E5DAC6]">
                    <p className="font-bold text-sm text-[#231A12] mb-1">No Active Announcements</p>
                    <p>Create and publish a new announcement on the left to display on the top ticker.</p>
                  </div>
                ) : (
                  notices.map((n) => (
                    <div 
                      key={n.id || n._id} 
                      className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E5DAC6] text-xs space-y-2 flex items-start justify-between gap-3 hover:bg-white transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-[#231A12] text-xs sm:text-sm">{n.title}</span>
                          {n.urgent && (
                            <span className="bg-red-100 text-red-800 border border-red-200 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              URGENT
                            </span>
                          )}
                          <span className="text-[10px] text-[#7A6A5C] font-mono">• {n.date} {n.time ? `(${n.time})` : ''}</span>
                        </div>
                        <p className="text-[#7A6A5C] leading-relaxed whitespace-pre-wrap text-[11px]">{n.content}</p>

                        {/* Quick WhatsApp Forward for Existing Notice */}
                        <div className="pt-1">
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(`📢 *SIDDHARTH SCHOOL BUS & TRAVELS (NASHIK)*\n\n📌 *${n.title.toUpperCase()}*\n\n${n.content}\n\n📞 Helpline: +91 84463 91127\n👤 Mr. Siddharth Kailas Shardul`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md transition-colors"
                          >
                            <span>Share to WhatsApp Group</span>
                          </a>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteNotice(n.id || n._id)}
                        title="Delete notice"
                        className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-600 hover:text-red-800 border border-red-200 shadow-2xs transition-colors cursor-pointer flex-shrink-0 mt-0.5 active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <ExcelUploadModal
          isOpen={isExcelModalOpen}
          onClose={() => setIsExcelModalOpen(false)}
        />

        <NotificationModal
          isOpen={isNotifModalOpen}
          onClose={() => setIsNotifModalOpen(false)}
        />

        <AddStudentModal
          isOpen={isAddStudentOpen}
          onClose={() => setIsAddStudentOpen(false)}
        />

      </div>
    </div>
  );
}
