import React, { useState, useMemo } from 'react';
import { 
  Search, 
  IndianRupee, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MapPin, 
  X, 
  Plus,
  Receipt,
  FileText,
  Copy,
  Check,
  CheckCheck,
  SlidersHorizontal,
  CheckSquare,
  Square,
  Users,
  RotateCcw,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useAuth, calculateFeeBreakdown } from '../context/AuthContext';
import ReceiptModal from './ReceiptModal';

export default function StudentTable({ onAddStudentClick }) {
  const { 
    students, 
    schools, 
    deleteStudent, 
    updateStudent, 
    recordPayment,
    bulkSetFee,
    bulkSetPickupStop
  } = useAuth();

  // Multi-Selection State
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [isBulkFeeModalOpen, setIsBulkFeeModalOpen] = useState(false);
  const [bulkFeeAmount, setBulkFeeAmount] = useState('');
  const [isBulkStopModalOpen, setIsBulkStopModalOpen] = useState(false);
  const [bulkStopName, setBulkStopName] = useState('');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('ALL');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState('ALL');

  // Modals & Drawers
  const [paymentModalStudent, setPaymentModalStudent] = useState(null);
  const [paymentModalTab, setPaymentModalTab] = useState('APPROVE'); // 'APPROVE', 'CORRECT', or 'ADJUST'
  
  // Payment Recording State
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Offline Cash');
  const [paymentTerm, setPaymentTerm] = useState('School Bus Fee Installment');

  // Correction State (When owner typed wrong amount)
  const [correctTotalFee, setCorrectTotalFee] = useState('');
  const [correctPaidAmount, setCorrectPaidAmount] = useState('');

  // Direct Due Adjustment State
  const [adjustTotalFee, setAdjustTotalFee] = useState('');
  const [adjustDueFee, setAdjustDueFee] = useState('');

  // Quick Pickup Stop Edit State
  const [quickStopStudent, setQuickStopStudent] = useState(null);
  const [newStopName, setNewStopName] = useState('');

  const [editModalStudent, setEditModalStudent] = useState(null);
  const [historyStudent, setHistoryStudent] = useState(null);
  const [viewReceiptModal, setViewReceiptModal] = useState({ isOpen: false, student: null, receipt: null });
  const [copiedId, setCopiedId] = useState(null);

  // Filter Logic
  const filteredStudents = useMemo(() => {
    return (students || []).filter(s => {
      if (!s) return false;
      const cleanTerm = searchTerm.toLowerCase().trim();
      const studentName = (s.studentName || '').toLowerCase();
      const parentPhone = String(s.parentPhone || '');
      const parentName = (s.parentName || '').toLowerCase();
      const rollNo = (s.rollNo || '').toLowerCase();
      const stopName = (s.stopName || '').toLowerCase();

      const matchesSearch = !cleanTerm || 
        studentName.includes(cleanTerm) ||
        parentPhone.includes(cleanTerm) ||
        parentName.includes(cleanTerm) ||
        rollNo.includes(cleanTerm) ||
        stopName.includes(cleanTerm);

      const matchesSchool = selectedSchool === 'ALL' || s.schoolName === selectedSchool;

      let matchesFee = true;
      if (selectedFeeStatus === 'PAID') {
        matchesFee = s.feeDetails?.status === 'PAID' || s.feeDetails?.dueAmount === 0;
      } else if (selectedFeeStatus === 'DUE') {
        matchesFee = s.feeDetails?.status === 'DUE' || (s.feeDetails?.dueAmount || 0) > 0;
      }

      return matchesSearch && matchesSchool && matchesFee;
    });
  }, [students, searchTerm, selectedSchool, selectedFeeStatus]);

  // Bulk Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const handleToggleSelectStudent = (id) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleApplyBulkFee = (e) => {
    e.preventDefault();
    if (!bulkFeeAmount || Number(bulkFeeAmount) < 0 || selectedStudentIds.length === 0) return;
    bulkSetFee(selectedStudentIds, Number(bulkFeeAmount));
    setIsBulkFeeModalOpen(false);
    setBulkFeeAmount('');
    setSelectedStudentIds([]);
  };

  const handleApplyBulkStop = (e) => {
    e.preventDefault();
    if (!bulkStopName.trim() || selectedStudentIds.length === 0) return;
    bulkSetPickupStop(selectedStudentIds, bulkStopName.trim());
    setIsBulkStopModalOpen(false);
    setBulkStopName('');
    setSelectedStudentIds([]);
  };

  // 1-Click Clear All Dues for Selected Students (Set Due to 0)
  const handleBulkClearDues = () => {
    if (!window.confirm(`Clear all remaining fees to ₹0 (Mark as fully settled) for ${selectedStudentIds.length} selected students?`)) return;
    
    selectedStudentIds.forEach(id => {
      const student = students.find(s => s.id === id);
      if (student) {
        const total = student.feeDetails?.totalAnnualFee || 30000;
        updateStudent(id, {
          feeDetails: {
            ...student.feeDetails,
            totalAnnualFee: total,
            paidAmount: total,
            dueAmount: 0,
            status: 'PAID',
            lastPaymentDate: new Date().toISOString().split('T')[0]
          }
        });
      }
    });

    setSelectedStudentIds([]);
  };

  // Open Payment / Ledger Modal
  const handleOpenPaymentModal = (student) => {
    setPaymentModalStudent(student);
    setPaymentModalTab('APPROVE');
    const breakdown = calculateFeeBreakdown(student);
    
    // Suggest Phase 2 if Phase 1 is done, or Phase 1 if Phase 1 has due
    let defaultAmount = breakdown.dueAmount > 0 ? breakdown.dueAmount : breakdown.monthlyFee;
    let defaultTerm = 'Phase 2 (Term 2) Transport Fee';

    if (breakdown.phase1Due > 0) {
      defaultAmount = breakdown.phase1Due;
      defaultTerm = 'Phase 1 (Term 1) Transport Fee';
    } else if (breakdown.phase2Due > 0) {
      defaultAmount = breakdown.phase2Due;
      defaultTerm = 'Phase 2 (Term 2) Transport Fee';
    } else {
      defaultAmount = breakdown.monthlyFee;
      defaultTerm = 'Monthly Transport Installment';
    }
    
    setPaymentAmount(String(defaultAmount));
    setPaymentTerm(defaultTerm);
    setCorrectTotalFee(String(breakdown.totalAnnualFee));
    setCorrectPaidAmount(String(breakdown.paidAmount));
    setAdjustTotalFee(String(breakdown.totalAnnualFee));
    setAdjustDueFee(String(breakdown.dueAmount));
  };

  // 1-Click Clear Fee for Single Student (Make Due Zero)
  const handleClearSingleStudentDue = (student) => {
    const total = student.feeDetails?.totalAnnualFee || 30000;
    updateStudent(student.id, {
      feeDetails: {
        ...student.feeDetails,
        totalAnnualFee: total,
        paidAmount: total,
        dueAmount: 0,
        status: 'PAID',
        lastPaymentDate: new Date().toISOString().split('T')[0]
      }
    });
    setPaymentModalStudent(null);
  };

  // 1. Approve Payment Submit
  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentAmount || Number(paymentAmount) <= 0 || !paymentModalStudent) return;

    recordPayment(paymentModalStudent.id, {
      amount: Number(paymentAmount),
      mode: paymentMode,
      term: paymentTerm
    });

    setPaymentModalStudent(null);
    setPaymentAmount('');
  };

  // 2. Correct Paid Fee / Total Fee (When typed wrong)
  const handleCorrectPaidFeeSubmit = (e) => {
    e.preventDefault();
    if (!paymentModalStudent) return;

    const total = Number(correctTotalFee) || 30000;
    const paid = Number(correctPaidAmount) || 0;
    const due = Math.max(0, total - paid);

    updateStudent(paymentModalStudent.id, {
      feeDetails: {
        totalAnnualFee: total,
        paidAmount: paid,
        dueAmount: due,
        status: due === 0 ? 'PAID' : (paid > 0 ? 'PARTIAL' : 'DUE'),
        lastPaymentDate: new Date().toISOString().split('T')[0]
      }
    });

    setPaymentModalStudent(null);
  };

  // 3. Direct Ledger Adjustment Submit
  const handleAdjustLedgerSubmit = (e) => {
    e.preventDefault();
    if (!paymentModalStudent) return;

    const total = Number(adjustTotalFee) || 30000;
    const due = Math.max(0, Number(adjustDueFee) || 0);
    const paid = Math.max(0, total - due);

    updateStudent(paymentModalStudent.id, {
      feeDetails: {
        totalAnnualFee: total,
        paidAmount: paid,
        dueAmount: due,
        status: due === 0 ? 'PAID' : (paid > 0 ? 'PARTIAL' : 'DUE'),
        lastPaymentDate: new Date().toISOString().split('T')[0]
      }
    });

    setPaymentModalStudent(null);
  };

  // Quick Pickup Stop Submit
  const handleQuickStopSubmit = (e) => {
    e.preventDefault();
    if (!quickStopStudent || !newStopName.trim()) return;
    updateStudent(quickStopStudent.id, {
      stopName: newStopName.trim()
    });
    setQuickStopStudent(null);
    setNewStopName('');
  };

  // Edit Student Form Submit
  const handleEditStudentSubmit = (e) => {
    e.preventDefault();
    if (!editModalStudent) return;
    updateStudent(editModalStudent.id, editModalStudent);
    setEditModalStudent(null);
  };

  // Void / Delete a single erroneous payment history entry
  const handleVoidHistoryItem = (student, itemIndex) => {
    if (!window.confirm("Void / Delete this payment receipt entry? The paid amount and remaining due will automatically be recalculated.")) return;

    const history = student.feeDetails?.paymentsHistory || [];
    const itemToVoid = history[itemIndex];
    if (!itemToVoid) return;

    const updatedHistory = history.filter((_, idx) => idx !== itemIndex);
    const newPaid = updatedHistory.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);
    const total = student.feeDetails?.totalAnnualFee || 30000;
    const newDue = Math.max(0, total - newPaid);

    updateStudent(student.id, {
      feeDetails: {
        ...student.feeDetails,
        paidAmount: newPaid,
        dueAmount: newDue,
        status: newDue === 0 ? 'PAID' : (newPaid > 0 ? 'PARTIAL' : 'DUE'),
        paymentsHistory: updatedHistory,
        lastReceiptNo: updatedHistory[0]?.receiptNo || null,
        lastPaymentDate: updatedHistory[0]?.date || null
      }
    });

    setHistoryStudent(prev => prev ? {
      ...prev,
      feeDetails: {
        ...prev.feeDetails,
        paidAmount: newPaid,
        dueAmount: newDue,
        paymentsHistory: updatedHistory
      }
    } : null);
  };

  // WhatsApp Link
  const getWhatsAppLink = (student) => {
    const cleanPhone = student.parentPhone.replace(/\D/g, '').slice(-10);
    const msg = `Hello ${student.parentName}, regards from Siddharth School Bus & Travels regarding ${student.studentName} (${student.schoolName}). Total Fee: ₹${student.feeDetails?.totalAnnualFee || 30000}, Balance Due: ₹${student.feeDetails?.dueAmount || 0}. Please reach out for any queries.`;
    return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-3.5">
      
      {/* 1. FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white border border-[#E5DAC6] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-left">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7A6A5C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student, parent 10-digit number, roll, stop..."
            className="w-full bg-[#FAF7F0] border border-[#E5DAC6] rounded-xl pl-10 pr-8 py-2 text-xs text-[#231A12] placeholder-[#7A6A5C] focus:outline-none focus:border-[#D97B29] focus:bg-white transition-colors"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6A5C] hover:text-[#231A12] text-xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters & Results Counter */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#7A6A5C] uppercase">School:</span>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="bg-[#FAF7F0] border border-[#E5DAC6] rounded-xl px-2.5 py-1.5 text-xs text-[#231A12] focus:outline-none focus:border-[#D97B29] font-medium"
            >
              <option value="ALL">All Schools ({schools.length})</option>
              {schools.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#7A6A5C] uppercase">Status:</span>
            <select
              value={selectedFeeStatus}
              onChange={(e) => setSelectedFeeStatus(e.target.value)}
              className="bg-[#FAF7F0] border border-[#E5DAC6] rounded-xl px-2.5 py-1.5 text-xs text-[#231A12] focus:outline-none focus:border-[#D97B29] font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="PAID">Fully Paid</option>
              <option value="DUE">Pending Due</option>
            </select>
          </div>

          <span className="text-xs font-mono font-bold text-[#7A6A5C] pl-2 border-l border-[#E5DAC6]">
            Showing {filteredStudents.length} / {students.length}
          </span>
        </div>

      </div>

      {/* 2. BULK SELECTION ACTION BANNER */}
      {selectedStudentIds.length > 0 && (
        <div className="bg-[#3B2314] text-white p-3 sm:p-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3 animate-in fade-in text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#D97B29] text-white flex items-center justify-center font-bold text-xs">
              {selectedStudentIds.length}
            </span>
            <span className="font-bold">
              {selectedStudentIds.length} {selectedStudentIds.length === 1 ? 'Student Selected' : 'Students Selected'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkFeeModalOpen(true)}
              className="px-3 py-1.5 bg-[#D97B29] hover:bg-[#C4621C] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Set Fee</span>
            </button>

            <button
              onClick={handleBulkClearDues}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
              title="Clear All Remaining Fees to 0 for Selected"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Clear Dues to ₹0</span>
            </button>

            <button
              onClick={() => setIsBulkStopModalOpen(true)}
              className="px-3 py-1.5 bg-white hover:bg-zinc-100 text-[#231A12] font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D97B29]" />
              <span>Change Stop</span>
            </button>

            <button
              onClick={() => setSelectedStudentIds([])}
              className="p-1.5 text-zinc-300 hover:text-white cursor-pointer"
              title="Deselect All"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. EXCEL-STYLE MASTER SPREADSHEET TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-[#E5DAC6] bg-white shadow-xs">
        <table className="w-full text-left text-xs text-[#231A12] border-collapse">
          <thead className="bg-[#FAF7F0] text-[#7A6A5C] border-b border-[#E5DAC6] font-bold uppercase text-[10px] tracking-wider select-none">
            <tr>
              {/* Checkbox Header */}
              <th className="p-3 pl-3 w-8 text-center border-r border-[#E5DAC6]/60">
                <input
                  type="checkbox"
                  checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                  onChange={handleToggleSelectAll}
                  className="rounded text-[#D97B29] focus:ring-[#D97B29] cursor-pointer"
                  title="Select / Deselect All"
                />
              </th>
              <th className="p-3 border-r border-[#E5DAC6]/60">#</th>
              <th className="p-3 border-r border-[#E5DAC6]/60">Student Name &amp; ID</th>
              <th className="p-3 border-r border-[#E5DAC6]/60">Linked Parent Phone</th>
              <th className="p-3 border-r border-[#E5DAC6]/60">Parent Name</th>
              <th className="p-3 border-r border-[#E5DAC6]/60">School &amp; Grade</th>
              <th className="p-3 border-r border-[#E5DAC6]/60">Pickup Stop</th>
              <th className="p-3 text-right border-r border-[#E5DAC6]/60">Monthly &amp; Total Fee (₹)</th>
              <th className="p-3 text-right border-r border-[#E5DAC6]/60 text-emerald-800">Approved Paid (₹)</th>
              <th className="p-3 text-right border-r border-[#E5DAC6]/60 text-red-700">Monthly / Total Due (₹)</th>
              <th className="p-3 text-center border-r border-[#E5DAC6]/60">Status</th>
              <th className="p-3 text-center pr-3 min-w-[210px]">Approve / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5DAC6]/60 font-sans">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={12} className="p-8 text-center text-[#7A6A5C]">
                  No student records match your search criteria.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s, idx) => {
                const isSelected = selectedStudentIds.includes(s.id);
                const b = calculateFeeBreakdown(s);
                const isPaid = (b.dueAmount === 0);

                return (
                  <tr 
                    key={s.id} 
                    className={`transition-colors ${isSelected ? 'bg-amber-50/80' : 'hover:bg-[#FAF7F0]/80'}`}
                  >
                    
                    {/* Row Checkbox */}
                    <td className="p-2.5 pl-3 text-center border-r border-[#E5DAC6]/60">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectStudent(s.id)}
                        className="rounded text-[#D97B29] focus:ring-[#D97B29] cursor-pointer"
                      />
                    </td>

                    {/* Row Index */}
                    <td className="p-2.5 text-center font-mono text-[11px] text-[#7A6A5C] border-r border-[#E5DAC6]/60 bg-[#FAF7F0]/40">
                      {idx + 1}
                    </td>

                    {/* Student Name */}
                    <td className="p-2.5 border-r border-[#E5DAC6]/60">
                      <div className="font-bold text-[#231A12] text-xs">
                        {s.studentName}
                      </div>
                      <div className="text-[10px] text-[#7A6A5C] font-mono">
                        {s.rollNo || s.id}
                      </div>
                    </td>

                    {/* Linked Parent Phone */}
                    <td className="p-2.5 border-r border-[#E5DAC6]/60 font-mono">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-[#231A12] text-xs">{s.parentPhone}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy(s.parentPhone, s.id)}
                          className="text-[#7A6A5C] hover:text-[#231A12] cursor-pointer"
                          title="Copy Phone Number"
                        >
                          {copiedId === s.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    {/* Parent Name */}
                    <td className="p-2.5 border-r border-[#E5DAC6]/60">
                      <div className="font-medium text-[#231A12]">{s.parentName || 'Parent'}</div>
                    </td>

                    {/* School & Grade */}
                    <td className="p-2.5 border-r border-[#E5DAC6]/60">
                      <div className="font-medium text-[#231A12]">{s.schoolName}</div>
                      <div className="text-[10px] text-[#7A6A5C] font-mono">{s.grade}</div>
                    </td>

                    {/* Pickup Stop with 1-Click Quick Edit */}
                    <td className="p-2.5 border-r border-[#E5DAC6]/60">
                      <div className="flex items-center justify-between gap-1 max-w-[180px]">
                        <span className="font-medium text-[#231A12] truncate" title={s.stopName}>
                          📍 {s.stopName || 'Designated Stop'}
                        </span>
                        <button
                          onClick={() => {
                            setQuickStopStudent(s);
                            setNewStopName(s.stopName || '');
                          }}
                          className="p-1 text-[#7A6A5C] hover:text-[#D97B29] cursor-pointer"
                          title="Edit Pickup Stop"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Fee (Monthly + Total) */}
                    <td className="p-2.5 text-right font-mono text-xs border-r border-[#E5DAC6]/60">
                      <div className="font-bold text-[#231A12]">
                        ₹{b.monthlyFee.toLocaleString('en-IN')}<span className="text-[10px] text-[#7A6A5C]">/mo</span>
                      </div>
                      <div className="text-[10px] text-[#7A6A5C]">
                        ₹{b.totalAnnualFee.toLocaleString('en-IN')} Total
                      </div>
                    </td>

                    {/* Paid Amount */}
                    <td className="p-2.5 text-right font-mono font-bold text-xs text-emerald-700 border-r border-[#E5DAC6]/60">
                      <div>₹{b.paidAmount.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-[#7A6A5C] font-sans font-medium">
                        {b.clearedMonthsCount}/10 Mo Cleared
                      </div>
                    </td>

                    {/* Due Amount (Monthly + Total) */}
                    <td className="p-2.5 text-right font-mono text-xs border-r border-[#E5DAC6]/60">
                      <div className="font-bold text-red-600">
                        {b.dueAmount > 0 ? `₹${b.monthlyDue.toLocaleString('en-IN')}/mo` : '₹0'}
                      </div>
                      <div className="text-[10px] text-red-700 font-medium">
                        {b.dueAmount > 0 ? `₹${b.dueAmount.toLocaleString('en-IN')} Due` : 'Cleared'}
                      </div>
                    </td>

                    {/* Phase 1 & Phase 2 Status Badges */}
                    <td className="p-2.5 text-center border-r border-[#E5DAC6]/60 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-center justify-center">
                        <div className="flex items-center gap-1 text-[10px] font-bold">
                          <span className={`px-1.5 py-0.2 rounded ${
                            b.phase1Status === 'PAID' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                              : 'bg-amber-50 text-amber-900 border border-amber-300'
                          }`}>
                            P1: {b.phase1Status === 'PAID' ? '✓ Paid' : `₹${b.phase1Due}`}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded ${
                            b.phase2Status === 'PAID' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                              : (b.phase2Status === 'PARTIAL' ? 'bg-amber-50 text-amber-900 border border-amber-300' : 'bg-red-50 text-red-800 border border-red-200')
                          }`}>
                            P2: {b.phase2Status === 'PAID' ? '✓ Paid' : (b.phase2Due > 0 ? `₹${b.phase2Due}` : 'Pending')}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          isPaid 
                            ? 'bg-emerald-100 text-emerald-900 font-black' 
                            : 'bg-amber-100 text-amber-900 font-bold'
                        }`}>
                          {isPaid ? 'All Settled' : `Due: ₹${b.dueAmount}`}
                        </span>
                      </div>
                    </td>

                    {/* Actions Toolbar (Standardized Heights & No Wrapping) */}
                    <td className="p-2.5 pr-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Approve / Correct Fee Button */}
                        <button
                          onClick={() => handleOpenPaymentModal(s)}
                          title="Approve Payment (Phase 1 / Phase 2 / Monthly / Full)"
                          className="h-8 px-2.5 rounded-lg bg-[#D97B29] hover:bg-[#C4621C] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <CheckCheck className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Approve ₹</span>
                        </button>

                        {/* WhatsApp Message */}
                        <a
                          href={getWhatsAppLink(s)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Message Parent on WhatsApp"
                          className="h-8 w-8 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-[#E5DAC6] transition-colors inline-flex items-center justify-center flex-shrink-0"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>

                        {/* History */}
                        <button
                          onClick={() => setHistoryStudent(s)}
                          title="View Payment Logs & Receipts"
                          className="h-8 w-8 rounded-lg bg-white hover:bg-[#FAF7F0] text-[#7A6A5C] hover:text-[#231A12] border border-[#E5DAC6] transition-colors cursor-pointer inline-flex items-center justify-center flex-shrink-0"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>

                        {/* Full Edit */}
                        <button
                          onClick={() => setEditModalStudent(s)}
                          title="Edit Full Profile"
                          className="h-8 w-8 rounded-lg bg-white hover:bg-[#FAF7F0] text-[#7A6A5C] hover:text-[#231A12] border border-[#E5DAC6] transition-colors cursor-pointer inline-flex items-center justify-center flex-shrink-0"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${s.studentName}?`)) {
                              deleteStudent(s.id);
                            }
                          }}
                          title="Remove Record"
                          className="h-8 w-8 rounded-lg bg-white hover:bg-red-50 text-red-600 hover:text-red-800 border border-[#E5DAC6] transition-colors cursor-pointer inline-flex items-center justify-center flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. BULK SET FEE MODAL */}
      {isBulkFeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 text-left">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-zinc-900 relative">
            <button 
              onClick={() => setIsBulkFeeModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97B29] flex items-center justify-center border border-amber-200 flex-shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Bulk Set Fee for {selectedStudentIds.length} Students
                </h3>
                <p className="text-xs text-zinc-500">
                  Applies fee amount to all selected student records
                </p>
              </div>
            </div>

            <form onSubmit={handleApplyBulkFee} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 uppercase text-[11px] mb-1">
                  Enter Fee Amount (INR)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 5000, 30000, 32000"
                  value={bulkFeeAmount}
                  onChange={(e) => setBulkFeeAmount(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-zinc-900 focus:bg-white focus:border-amber-600 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBulkFeeModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#D97B29] hover:bg-[#C4621C] text-white font-bold shadow-xs cursor-pointer uppercase tracking-wider transition-colors"
                >
                  Apply Fee to All ({selectedStudentIds.length})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. BULK SET PICKUP STOP MODAL */}
      {isBulkStopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 text-left">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-zinc-900 relative">
            <button 
              onClick={() => setIsBulkStopModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97B29] flex items-center justify-center border border-amber-200 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Bulk Update Pickup Stop
                </h3>
                <p className="text-xs text-zinc-500">
                  Update stop location for {selectedStudentIds.length} selected students
                </p>
              </div>
            </div>

            <form onSubmit={handleApplyBulkStop} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 uppercase text-[11px] mb-1">
                  New Pickup Stop / Landmark
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jehan Circle, College Road, Gangapur Naka"
                  value={bulkStopName}
                  onChange={(e) => setBulkStopName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-zinc-900 focus:bg-white focus:border-amber-600 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBulkStopModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#D97B29] hover:bg-[#C4621C] text-white font-bold shadow-xs cursor-pointer uppercase tracking-wider transition-colors"
                >
                  Save Stop for All ({selectedStudentIds.length})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. QUICK PICKUP STOP EDIT MODAL */}
      {quickStopStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 text-left">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-zinc-900 relative">
            <button 
              onClick={() => setQuickStopStudent(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97B29] flex items-center justify-center border border-amber-200 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Update Pickup Stop
                </h3>
                <p className="text-xs text-zinc-500">
                  {quickStopStudent.studentName} ({quickStopStudent.schoolName})
                </p>
              </div>
            </div>

            <form onSubmit={handleQuickStopSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 uppercase text-[11px] mb-1">
                  Pickup Stop &amp; Landmark
                </label>
                <input
                  type="text"
                  required
                  value={newStopName}
                  onChange={(e) => setNewStopName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-zinc-900 focus:bg-white focus:border-amber-600 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setQuickStopStudent(null)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#D97B29] hover:bg-[#C4621C] text-white font-bold shadow-xs cursor-pointer uppercase tracking-wider transition-colors"
                >
                  Save Pickup Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. OWNER APPROVAL, CORRECTION & LEDGER MODAL */}
      {paymentModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 text-left">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-zinc-900 relative font-sans">
            <button 
              onClick={() => setPaymentModalStudent(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 rounded-xl transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#D97B29] flex items-center justify-center flex-shrink-0">
                <CheckCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Owner Fee Authority &amp; Settlement
                </h3>
                <p className="text-xs text-zinc-500">
                  {paymentModalStudent.studentName} ({paymentModalStudent.schoolName})
                </p>
              </div>
            </div>

            {/* Current Balance Snapshot */}
            <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 space-y-1 text-xs mb-3">
              <div className="flex justify-between text-zinc-500">
                <span>Fee (Total):</span>
                <span className="font-mono font-bold text-zinc-900">₹{(paymentModalStudent.feeDetails?.totalAnnualFee || 30000).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Approved Amount Paid:</span>
                <span className="font-mono font-bold text-emerald-700">₹{(paymentModalStudent.feeDetails?.paidAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-zinc-500 border-t border-zinc-200 pt-1">
                <span className="font-bold text-zinc-900">Remaining Due Balance:</span>
                <span className="font-mono font-bold text-red-600">₹{(paymentModalStudent.feeDetails?.dueAmount ?? Math.max(0, (paymentModalStudent.feeDetails?.totalAnnualFee || 30000) - (paymentModalStudent.feeDetails?.paidAmount || 0))).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Quick 1-Click Clear All Dues Button */}
            <div className="mb-3">
              <button
                type="button"
                onClick={() => handleClearSingleStudentDue(paymentModalStudent)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4 text-emerald-700" />
                <span>⚡ Clear All Fees (Set Due to ₹0 / Mark Settled)</span>
              </button>
            </div>

            {/* Tab Selector (Approve vs Correct Typed Mistake vs Set Due) */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-100 rounded-xl text-[11px] font-bold mb-4">
              <button
                type="button"
                onClick={() => setPaymentModalTab('APPROVE')}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                  paymentModalTab === 'APPROVE' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                ✓ Approve
              </button>
              <button
                type="button"
                onClick={() => setPaymentModalTab('CORRECT')}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                  paymentModalTab === 'CORRECT' ? 'bg-white text-amber-800 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                ✏ Correct Fee
              </button>
              <button
                type="button"
                onClick={() => setPaymentModalTab('ADJUST')}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                  paymentModalTab === 'ADJUST' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                ⚙ Set Due
              </button>
            </div>

            {/* TAB 1: RECORD & APPROVE PAYMENT */}
            {paymentModalTab === 'APPROVE' && (() => {
              const b = calculateFeeBreakdown(paymentModalStudent);
              return (
                <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 text-xs">
                  
                  {/* Quick 1-Click Presets for Phase 1, Phase 2, Monthly, Clear All */}
                  <div className="space-y-1.5 bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E5DAC6]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A6A5C] flex items-center justify-between">
                      <span>1-Click Fee Presets</span>
                      <span className="font-mono text-[#231A12]">Due: ₹{b.dueAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {/* Phase 1 Preset */}
                      <button
                        type="button"
                        onClick={() => {
                          const amt = b.phase1Due > 0 ? b.phase1Due : b.phase1Target;
                          setPaymentAmount(String(amt));
                          setPaymentTerm('Phase 1 (Term 1) Transport Fee');
                        }}
                        className={`p-1.5 rounded-lg border text-left font-sans transition-colors cursor-pointer ${
                          b.phase1Status === 'PAID'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-white hover:bg-amber-50 border-[#E5DAC6] text-[#231A12]'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-[#7A6A5C]">
                          Phase 1 (Term 1) {b.phase1Status === 'PAID' ? '✓ Paid' : ''}
                        </div>
                        <div className="text-xs font-mono font-bold">
                          ₹{b.phase1Target.toLocaleString('en-IN')} {b.phase1Due > 0 ? `(₹${b.phase1Due} due)` : ''}
                        </div>
                      </button>

                      {/* Phase 2 Preset */}
                      <button
                        type="button"
                        onClick={() => {
                          const amt = b.phase2Due > 0 ? b.phase2Due : b.phase2Target;
                          setPaymentAmount(String(amt));
                          setPaymentTerm('Phase 2 (Term 2) Transport Fee');
                        }}
                        className={`p-1.5 rounded-lg border text-left font-sans transition-colors cursor-pointer ${
                          b.phase2Status === 'PAID'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : (b.phase1Status === 'PAID' ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-400' : 'bg-white hover:bg-amber-50 border-[#E5DAC6] text-[#231A12]')
                        }`}
                      >
                        <div className="text-[10px] font-bold text-[#7A6A5C]">
                          Phase 2 (Term 2) {b.phase2Status === 'PAID' ? '✓ Paid' : (b.phase1Status === 'PAID' ? '👉 Recommended' : '')}
                        </div>
                        <div className="text-xs font-mono font-bold">
                          ₹{b.phase2Target.toLocaleString('en-IN')} {b.phase2Due > 0 ? `(₹${b.phase2Due} due)` : ''}
                        </div>
                      </button>

                      {/* 1 Month Preset */}
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentAmount(String(b.monthlyFee));
                          setPaymentTerm('Monthly Transport Fee Installment');
                        }}
                        className="p-1.5 rounded-lg border bg-white hover:bg-[#FAF7F0] border-[#E5DAC6] text-left font-sans transition-colors cursor-pointer text-[#231A12]"
                      >
                        <div className="text-[10px] font-bold text-[#7A6A5C]">1 Month Installment</div>
                        <div className="text-xs font-mono font-bold">₹{b.monthlyFee.toLocaleString('en-IN')} / mo</div>
                      </button>

                      {/* Clear Full Due Preset */}
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentAmount(String(b.dueAmount));
                          setPaymentTerm('Full Academic Year Transport Fee');
                        }}
                        disabled={b.dueAmount === 0}
                        className="p-1.5 rounded-lg border bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-left font-sans transition-colors cursor-pointer text-emerald-900 disabled:opacity-50"
                      >
                        <div className="text-[10px] font-bold text-emerald-800">Clear All Remaining</div>
                        <div className="text-xs font-mono font-bold">₹{b.dueAmount.toLocaleString('en-IN')} Total</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">
                      Amount Received from Parent (INR)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-base font-mono font-bold text-zinc-900 focus:bg-white focus:border-amber-600 outline-none"
                    />
                    
                    {/* Dynamic calculation preview */}
                    {paymentAmount && Number(paymentAmount) > 0 && (
                      <div className="mt-1 text-[11px] text-zinc-600 font-medium">
                        Remaining due will become: <strong className="text-red-700 font-mono">₹{Math.max(0, (paymentModalStudent.feeDetails?.totalAnnualFee || 30000) - ((paymentModalStudent.feeDetails?.paidAmount || 0) + Number(paymentAmount))).toLocaleString('en-IN')}</strong>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">
                      Payment Received Via
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs font-bold text-zinc-900 outline-none"
                    >
                      <option value="Offline Cash (Direct Handover)">Offline Cash (Direct Handover)</option>
                      <option value="UPI (8767948553@upi / Scanner)">UPI (8767948553@upi / Scanner)</option>
                      <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
                      <option value="Cheque Deposit">Cheque Deposit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">
                      Receipt Memo / Fee Term
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentTerm}
                      onChange={(e) => setPaymentTerm(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-900 outline-none"
                    />
                    <div className="flex flex-wrap gap-1 mt-1">
                      {[
                        'Phase 1 (Term 1) Transport Fee',
                        'Phase 2 (Term 2) Transport Fee',
                        'Monthly Transport Installment',
                        'Full Academic Year (Phase 1 & 2)'
                      ].map((termChoice) => (
                        <button
                          key={termChoice}
                          type="button"
                          onClick={() => setPaymentTerm(termChoice)}
                          className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 hover:bg-amber-50 text-zinc-700 hover:text-amber-900 border border-zinc-200 cursor-pointer"
                        >
                          {termChoice}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentModalStudent(null)}
                      className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#D97B29] hover:bg-[#C4621C] text-white font-bold shadow-xs cursor-pointer uppercase tracking-wider transition-colors"
                    >
                      Approve &amp; Issue Receipt
                    </button>
                  </div>
                </form>
              );
            })()}

            {/* TAB 2: CORRECTION MODE (WHEN TYPED WRONG) */}
            {paymentModalTab === 'CORRECT' && (
              <form onSubmit={handleCorrectPaidFeeSubmit} className="space-y-3 text-xs">
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                  Use this to fix any mistyped amounts. The remaining due balance will automatically adjust.
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">
                    Correct Total Fee (INR)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={correctTotalFee}
                    onChange={(e) => setCorrectTotalFee(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-sm font-mono font-bold text-zinc-900 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">
                    Correct Approved Paid Amount (INR)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={correctPaidAmount}
                    onChange={(e) => setCorrectPaidAmount(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-sm font-mono font-bold text-emerald-700 focus:bg-white outline-none"
                  />
                </div>

                <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-200 text-[11px] flex justify-between text-zinc-600 font-medium">
                  <span>Recalculated Due Balance:</span>
                  <strong className="text-red-700 font-mono font-bold">
                    ₹{Math.max(0, (Number(correctTotalFee) || 0) - (Number(correctPaidAmount) || 0)).toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="pt-2 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentModalStudent(null)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold shadow-xs cursor-pointer uppercase tracking-wider transition-colors"
                  >
                    Save Corrected Amounts
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: DIRECT LEDGER OVERRIDE & SET REMAINING DUE */}
            {paymentModalTab === 'ADJUST' && (
              <form onSubmit={handleAdjustLedgerSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">
                    Fee (Total in INR)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={adjustTotalFee}
                    onChange={(e) => setAdjustTotalFee(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-sm font-mono font-bold text-zinc-900 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">
                    Set Remaining Due for Parent (INR)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={adjustDueFee}
                    onChange={(e) => setAdjustDueFee(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-sm font-mono font-bold text-red-600 focus:bg-white outline-none"
                  />
                </div>

                <p className="text-[11px] text-zinc-500 pt-1">
                  Updating this immediately sets the exact remaining due displayed in the parent portal.
                </p>

                <div className="pt-2 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentModalStudent(null)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs cursor-pointer uppercase tracking-wider transition-colors"
                  >
                    Save Remaining Due
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 8. EDIT STUDENT MODAL */}
      {editModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 text-left">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-zinc-900 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setEditModalStudent(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 rounded-xl transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#D97B29] flex items-center justify-center flex-shrink-0">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Edit Student Transport Profile
                </h3>
                <p className="text-xs text-zinc-500">
                  Update student, pickup stop, and parent contact details
                </p>
              </div>
            </div>

            <form onSubmit={handleEditStudentSubmit} className="space-y-3 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={editModalStudent.studentName}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, studentName: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-2.5 font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">Roll / Student ID</label>
                  <input
                    type="text"
                    value={editModalStudent.rollNo || ''}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, rollNo: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-2.5 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={editModalStudent.parentName}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, parentName: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">Parent Mobile Number</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={editModalStudent.parentPhone}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, parentPhone: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-2.5 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">School Name</label>
                  <input
                    type="text"
                    required
                    value={editModalStudent.schoolName}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, schoolName: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">Class / Grade</label>
                  <input
                    type="text"
                    value={editModalStudent.grade}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, grade: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase text-[10px] mb-1">Pickup Stop &amp; Landmark</label>
                <input
                  type="text"
                  value={editModalStudent.stopName}
                  onChange={(e) => setEditModalStudent({ ...editModalStudent, stopName: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditModalStudent(null)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#D97B29] hover:bg-[#C4621C] text-white font-bold shadow-xs cursor-pointer uppercase tracking-wider transition-colors"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 9. PAYMENT HISTORY & RECEIPTS DRAWER */}
      {historyStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 text-left">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-zinc-900 relative">
            <button 
              onClick={() => setHistoryStudent(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 rounded-xl transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#D97B29] flex items-center justify-center flex-shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Payment History &amp; Receipts
                </h3>
                <p className="text-xs text-zinc-500">
                  {historyStudent.studentName} • {historyStudent.schoolName}
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {(!historyStudent.feeDetails?.paymentsHistory || historyStudent.feeDetails.paymentsHistory.length === 0) ? (
                <div className="p-6 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl border border-zinc-200">
                  No previous payment transactions recorded yet.
                </div>
              ) : (
                historyStudent.feeDetails.paymentsHistory.map((p, idx) => (
                  <div key={idx} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-zinc-900 font-mono">
                        {p.receiptNo || 'REC-2026-0891'}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        {p.term || 'Term Fee'} • {p.mode || 'Offline Cash'} • {p.date}
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-700 text-sm">
                        ₹{p.amount}
                      </span>
                      <button
                        onClick={() => {
                          setViewReceiptModal({
                            isOpen: true,
                            student: historyStudent,
                            receipt: p
                          });
                        }}
                        className="px-2 py-1 bg-white hover:bg-zinc-100 border border-zinc-300 rounded-lg text-[11px] font-bold text-zinc-800 transition-colors cursor-pointer flex items-center gap-1"
                        title="View Paper Receipt"
                      >
                        <FileText className="w-3 h-3 text-[#D97B29]" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => handleVoidHistoryItem(historyStudent, idx)}
                        className="p-1 rounded-lg bg-white hover:bg-red-50 text-red-600 hover:text-red-800 border border-red-200 transition-colors cursor-pointer"
                        title="Void / Delete Mistyped Transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 mt-2 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => setHistoryStudent(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer uppercase tracking-wider"
              >
                Close History
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 10. AUTHENTIC PAPER RECEIPT MODAL */}
      {viewReceiptModal.isOpen && (
        <ReceiptModal
          isOpen={viewReceiptModal.isOpen}
          onClose={() => setViewReceiptModal({ isOpen: false, student: null, receipt: null })}
          student={viewReceiptModal.student}
          receipt={viewReceiptModal.receipt}
        />
      )}

    </div>
  );
}
