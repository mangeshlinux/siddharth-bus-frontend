import React, { useState } from 'react';
import { X, UserPlus, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AddStudentModal({ isOpen, onClose }) {
  const { addStudent, schools, fleet } = useAuth();

  const [formData, setFormData] = useState({
    studentName: '',
    rollNo: '',
    parentName: '',
    parentPhone: '',
    alternatePhone: '',
    email: '',
    schoolName: schools[0]?.name || "Fravashi International Academy",
    grade: 'Grade 6-A',
    busNo: 'Bus #1',
    routeName: fleet[0]?.routeName || 'Route 1: Gangapur Road - College Road',
    stopName: '',
    pickupTime: '07:15 AM',
    dropTime: '02:30 PM',
    totalAnnualFee: '32000',
    paidAmount: '0'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const cleanParentPhone = formData.parentPhone.replace(/\D/g, '').slice(-10);
    if (!formData.studentName.trim() || cleanParentPhone.length !== 10) {
      setError('Please enter a valid student name and 10-digit parent mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const total = Number(formData.totalAnnualFee) || 30000;
      const paid = Number(formData.paidAmount) || 0;
      const due = Math.max(0, total - paid);
      const p1Target = Math.round(total / 2);
      const p2Target = total - p1Target;
      const p1Paid = Math.min(paid, p1Target);
      const p2Paid = Math.max(0, paid - p1Target);
      const p1Due = Math.max(0, p1Target - p1Paid);
      const p2Due = Math.max(0, p2Target - p2Paid);
      const receiptNo = paid > 0 ? `REC-2026-${Math.floor(1000 + Math.random() * 9000)}` : null;
      const today = new Date().toISOString().split('T')[0];

      const newStudentRecord = {
        studentName: formData.studentName.trim(),
        rollNo: formData.rollNo.trim() || `NSK-${Math.floor(1000 + Math.random() * 9000)}`,
        parentName: formData.parentName.trim() || 'Parent',
        parentPhone: cleanParentPhone,
        alternatePhone: formData.alternatePhone ? formData.alternatePhone.replace(/\D/g, '').slice(-10) : '',
        email: formData.email.trim(),
        schoolName: formData.schoolName,
        grade: formData.grade.trim() || 'Grade 1',
        busNo: formData.busNo,
        routeName: formData.routeName,
        stopName: formData.stopName.trim() || 'Designated Stop',
        pickupTime: formData.pickupTime,
        dropTime: formData.dropTime,
        feeDetails: {
          totalAnnualFee: total,
          paidAmount: paid,
          dueAmount: due,
          phase1Amount: p1Target,
          phase1Paid: p1Paid,
          phase1Status: p1Due === 0 ? 'PAID' : (p1Paid > 0 ? 'PARTIAL' : 'DUE'),
          phase2Amount: p2Target,
          phase2Paid: p2Paid,
          phase2Status: p2Due === 0 ? 'PAID' : (p2Paid > 0 ? 'PARTIAL' : 'DUE'),
          status: due === 0 ? 'PAID' : (paid > 0 ? 'PARTIAL' : 'DUE'),
          lastPaymentDate: paid > 0 ? today : null,
          lastReceiptNo: receiptNo,
          nextDueDate: p2Due > 0 ? '2026-10-15 (Phase 2 Due)' : 'Fully Paid for 2026-27',
          paymentMode: 'Offline Cash',
          paymentsHistory: paid > 0 ? [
            {
              receiptNo,
              amount: paid,
              date: today,
              mode: 'Advance / Initial Payment',
              term: p1Due === 0 && p2Due === 0 ? 'Full Academic Year (Phase 1 & 2)' : (p1Due === 0 ? 'Phase 1 (Term 1) Transport Fee' : 'Initial Transport Installment')
            }
          ] : []
        }
      };

      const result = await addStudent(newStudentRecord);
      if (result) {
        onClose();
      } else {
        setError('Failed to save student record to backend. Please check connection and try again.');
      }
    } catch (err) {
      setError(err.message || 'Error occurred while saving student record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231A12]/60 backdrop-blur-xs animate-in fade-in duration-200 text-left">
      <div className="bg-white border-2 border-[#B08D57] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-[#231A12] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F5E8D3]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#FFF4E8] text-[#D97B29] border border-[#B08D57]/40">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#231A12] font-heading">
                Register New Student
              </h2>
              <p className="text-xs text-[#7A6A5C]">
                Add student transport details and parent mobile number
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A6A5C] hover:text-[#231A12] hover:bg-[#FBF3E7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <X className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#231A12] uppercase mb-1">Student Full Name *</label>
              <input
                type="text"
                required
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="e.g. Aarav Sharma"
                className="w-full bg-[#FBF3E7]/70 border border-[#B08D57] rounded-xl px-3.5 py-2.5 font-bold text-[#231A12] placeholder-[#7A6A5C]/60 focus:border-[#D97B29] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#231A12] uppercase mb-1">Roll / Student ID</label>
              <input
                type="text"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                placeholder="e.g. FIA-7A-14"
                className="w-full bg-[#FBF3E7]/70 border border-[#B08D57] rounded-xl px-3.5 py-2.5 font-bold text-[#231A12] placeholder-[#7A6A5C]/60 focus:border-[#D97B29] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#231A12] uppercase mb-1">Parent Full Name *</label>
              <input
                type="text"
                required
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="e.g. Rajesh Sharma"
                className="w-full bg-[#FBF3E7]/70 border border-[#B08D57] rounded-xl px-3.5 py-2.5 font-bold text-[#231A12] placeholder-[#7A6A5C]/60 focus:border-[#D97B29] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#231A12] uppercase mb-1 flex items-center justify-between">
                <span>Parent Mobile (10-Digit) *</span>
                <span className="text-[10px] text-[#6B8F71] font-bold">Login Access</span>
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                placeholder="9876543210"
                className="w-full bg-[#FBF3E7]/70 border-2 border-[#B08D57] rounded-xl px-3.5 py-2.5 font-mono font-black text-[#231A12] placeholder-[#7A6A5C]/60 focus:border-[#D97B29] outline-none"
              />
            </div>
          </div>

          {/* Sibling Link Notice */}
          <div className="bg-[#FFF4E8] border border-[#D97B29]/40 rounded-xl p-3 text-[11px] text-[#8C4A15] leading-relaxed">
            💡 <strong>Multi-Child Tip:</strong> If the parent already has another child registered under this mobile number, entering the same number here will automatically link both students to the parent's single login dashboard.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#231A12] uppercase mb-1">School Name *</label>
              <select
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full bg-[#FBF3E7]/70 border border-[#B08D57] rounded-xl px-3.5 py-2.5 font-bold text-[#231A12] focus:border-[#D97B29] outline-none"
              >
                {schools.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#231A12] uppercase mb-1">Grade / Section</label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="e.g. Grade 7-A"
                className="w-full bg-[#FBF3E7]/70 border border-[#B08D57] rounded-xl px-3.5 py-2.5 font-bold text-[#231A12] placeholder-[#7A6A5C]/60 focus:border-[#D97B29] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#231A12] uppercase mb-1">Pickup Stop &amp; Society Landmark</label>
            <input
              type="text"
              value={formData.stopName}
              onChange={(e) => setFormData({ ...formData, stopName: e.target.value })}
              placeholder="e.g. Jehan Circle / Society Gate, Gangapur Rd"
              className="w-full bg-[#FBF3E7]/70 border border-[#B08D57] rounded-xl px-3.5 py-2.5 font-bold text-[#231A12] placeholder-[#7A6A5C]/60 focus:border-[#D97B29] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#231A12] uppercase mb-1">Total Annual Transport Fee (₹)</label>
              <input
                type="number"
                value={formData.totalAnnualFee}
                onChange={(e) => setFormData({ ...formData, totalAnnualFee: e.target.value })}
                className="w-full bg-[#FBF3E7]/70 border border-[#B08D57] rounded-xl px-3.5 py-2.5 font-mono font-bold text-[#231A12] focus:border-[#D97B29] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#231A12] uppercase mb-1">Advance Amount Paid (₹)</label>
              <input
                type="number"
                value={formData.paidAmount}
                onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                className="w-full bg-[#FBF3E7]/70 border border-[#B08D57] rounded-xl px-3.5 py-2.5 font-mono font-bold text-[#6B8F71] focus:border-[#D97B29] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#F5E8D3] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#F5E8D3] hover:bg-[#B08D57]/30 text-[#231A12] font-bold text-xs cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D97B29] to-[#C4621C] hover:from-[#C4621C] hover:to-[#B55515] text-white font-black text-xs shadow-md shadow-[#D97B29]/30 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving to Database...</span>
                </>
              ) : (
                <span>Register Student Record</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
