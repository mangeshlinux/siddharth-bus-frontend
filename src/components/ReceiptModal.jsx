import React from 'react';
import { X, Printer, CheckCircle, Download, Check, ShieldCheck, Lock } from 'lucide-react';
import Logo from './Logo';

// Helper to convert numbers into Indian Rupees in words
function numberToWords(num) {
  if (!num || isNaN(num) || num === 0) return 'Rupees Zero Only';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n) => {
    let str = '';
    if (n > 99) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
    } else if (n > 0) {
      str += a[n];
    }
    return str.trim();
  };

  let numStr = ('000000000' + Math.floor(num)).substr(-9);
  let crore = parseInt(numStr.substr(0, 2), 10);
  let lakh = parseInt(numStr.substr(2, 2), 10);
  let thousand = parseInt(numStr.substr(4, 2), 10);
  let hundred = parseInt(numStr.substr(6, 3), 10);

  let res = '';
  if (crore > 0) res += inWords(crore) + ' Crore ';
  if (lakh > 0) res += inWords(lakh) + ' Lakh ';
  if (thousand > 0) res += inWords(thousand) + ' Thousand ';
  if (hundred > 0) res += inWords(hundred) + ' ';

  return ('Rupees ' + res.trim() + ' Only').replace(/\s+/g, ' ');
}

export default function ReceiptModal({ 
  isOpen, 
  onClose, 
  student, 
  receipt = null,
  isAlreadyDownloaded = false,
  onMarkDownloaded = null
}) {
  if (!isOpen || !student) return null;

  const currentReceipt = receipt || student.feeDetails?.paymentsHistory?.[0] || {
    receiptNo: student.feeDetails?.lastReceiptNo || "REC-2026-5116",
    amount: student.feeDetails?.paidAmount || 2000,
    date: student.feeDetails?.lastPaymentDate || new Date().toISOString().split('T')[0],
    mode: student.feeDetails?.paymentMode || "UPI / Cash",
    term: "School Bus Transport Term Fee"
  };

  const paidAmount = Number(currentReceipt.amount) || Number(student.feeDetails?.paidAmount) || 2000;
  const totalAnnualFee = Number(student.feeDetails?.totalAnnualFee) || 30000;
  const dueAmount = Math.max(0, totalAnnualFee - paidAmount);

  const handlePrintDownload = () => {
    if (!isAlreadyDownloaded && onMarkDownloaded) {
      onMarkDownloaded(currentReceipt.receiptNo);
    }
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 text-left print:p-0 print:bg-white overflow-hidden">
      
      {/* Compact Wrapper (No Scroll on standard viewports) */}
      <div className="relative max-w-2xl w-full max-h-[98vh] flex flex-col justify-center print:max-w-none print:max-h-none print:w-full">
        
        {/* Top Floating Action Bar */}
        <div className="flex items-center justify-between mb-2 px-1 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold">
              ✓ Owner Approved &amp; Verified
            </span>
            {isAlreadyDownloaded && (
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[11px] font-mono">
                Download Limit: 1/1 Completed
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isAlreadyDownloaded ? (
              <button
                onClick={handlePrintDownload}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D97B29] hover:bg-[#C4621C] text-white font-bold text-xs shadow-md transition-colors cursor-pointer rounded-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download / Print Receipt</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg border border-zinc-700">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Receipt Archived</span>
              </div>
            )}

            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* COMPACT PHYSICAL PAPER MEMO BODY */}
        <div className="bg-[#FFFDF9] text-[#1A1A1A] p-5 sm:p-6 shadow-2xl border border-[#2B2B2B] relative select-none print:shadow-none print:border-2 print:border-black font-sans rounded-xl">
          
          {/* Paper Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025] overflow-hidden">
            <span className="text-8xl font-black text-black font-heading -rotate-12 select-none">
              SIDDHARTH
            </span>
          </div>

          {/* 1. Letterhead */}
          <div className="border-b border-[#1A1A1A] pb-2.5 mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-black/30 flex-shrink-0">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-[#1A1A1A] font-heading tracking-tight uppercase leading-none">
                  SIDDHARTH SCHOOL BUS &amp; TRAVELS
                </h1>
                <p className="text-[9px] font-bold text-[#666] uppercase mt-0.5">
                  Official Transport Tax Invoice • Plot No 49, Vithu Mauli Colony Lane No 1, Swami Vivekanand Nagar, Makhamalabad, Nashik
                </p>
              </div>
            </div>
            
            <div className="text-right text-[9px] font-mono text-[#333]">
              <div>Reg: <strong>MH-NSK-SB-2017</strong></div>
              <div>Helpline: <strong>+91 84463 91127</strong></div>
            </div>
          </div>

          {/* 2. Receipt Meta Bar */}
          <div className="flex items-center justify-between text-[11px] font-mono bg-[#FAF7F0] px-3 py-1 border border-[#DDD] mb-2.5">
            <div>
              <span className="text-[#666]">Receipt No: </span>
              <strong className="text-[#1A1A1A] font-black">{currentReceipt.receiptNo}</strong>
            </div>
            <div>
              <span className="text-[#666]">Date: </span>
              <strong className="text-[#1A1A1A]">{currentReceipt.date}</strong>
            </div>
            <div>
              <span className="text-[#666]">Academic Session: </span>
              <strong className="text-[#1A1A1A]">2026 - 2027 (June to April)</strong>
            </div>
          </div>

          {/* 3. Particulars Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] mb-2.5 bg-[#FAF7F0] p-2.5 border border-[#DDD] leading-tight">
            <div>
              <span className="text-[#666]">Student: </span>
              <strong className="text-[#1A1A1A] uppercase">{student.studentName}</strong>
            </div>
            <div>
              <span className="text-[#666]">Parent: </span>
              <strong className="text-[#1A1A1A]">{student.parentName || 'Parent'}</strong> ({student.parentPhone})
            </div>
            <div>
              <span className="text-[#666]">School: </span>
              <span className="text-[#222] font-semibold">{student.schoolName}</span>
            </div>
            <div>
              <span className="text-[#666]">Bus Route: </span>
              <span className="text-[#222] font-semibold">{student.busNo || 'Bus #1'} ({student.routeName || 'Route 1'})</span>
            </div>
          </div>

          {/* 4. Table */}
          <table className="w-full text-[11px] text-left border-collapse border border-[#1A1A1A] mb-2">
            <thead>
              <tr className="bg-[#EFECE6] border-b border-[#1A1A1A] font-bold uppercase text-[9.5px]">
                <th className="p-1.5 border-r border-[#1A1A1A] w-8 text-center">#</th>
                <th className="p-1.5 border-r border-[#1A1A1A]">Particulars / Fee Description</th>
                <th className="p-1.5 border-r border-[#1A1A1A] w-24 text-center">Mode</th>
                <th className="p-1.5 w-28 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-1.5 border-r border-[#1A1A1A] text-center font-mono">1</td>
                <td className="p-1.5 border-r border-[#1A1A1A]">
                  <div className="font-bold text-[#1A1A1A]">Annual School Bus Transportation Fee (11-Month Academic Session — June to April)</div>
                  <div className="text-[9px] text-[#555] font-semibold">
                    Cycle: {currentReceipt.term || 'Approved Transport Installment'} • Monthly Rate: ₹{Math.round(totalAnnualFee / 11).toLocaleString('en-IN')}/mo
                  </div>
                </td>
                <td className="p-1.5 border-r border-[#1A1A1A] text-center font-mono text-[10px]">
                  {currentReceipt.mode || 'Offline Cash'}
                </td>
                <td className="p-1.5 text-right font-mono font-bold text-xs text-[#1A1A1A]">
                  ₹{paidAmount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-[#FAF7F0] border-t border-[#1A1A1A] font-bold">
                <td colSpan={3} className="p-1.5 text-right uppercase text-[10px] text-[#333]">
                  Total Approved Amount Paid:
                </td>
                <td className="p-1.5 text-right font-mono text-sm font-black text-[#1A1A1A]">
                  ₹{paidAmount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* 5. Words & Balance */}
          <div className="text-[10px] space-y-0.5 border-b border-dashed border-[#888] pb-1.5 mb-2">
            <div>
              <span className="font-bold text-[#555] uppercase">In words: </span>
              <span className="font-serif italic font-bold text-[#1A1A1A]">
                {numberToWords(paidAmount)}
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[#555]">
              <span>Status: <strong className="text-emerald-700">APPROVED &amp; RECEIVED</strong></span>
              <span>•</span>
              <span>Remaining Due: <strong className="text-red-700">₹{dueAmount.toLocaleString('en-IN')}</strong></span>
            </div>
          </div>

          {/* 6. Stamp & Signature */}
          <div className="flex items-end justify-between pt-1">
            <div className="text-center w-32">
              <div className="h-6 border-b border-[#666]" />
              <span className="text-[8.5px] uppercase font-bold text-[#777] mt-0.5 block">
                Parent / Depositor Sign
              </span>
            </div>

            {/* Official Ink Rubber Stamp */}
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-700 flex flex-col items-center justify-center text-center p-0.5 transform -rotate-6 text-emerald-800 select-none opacity-95">
              <div className="text-[6.5px] font-black uppercase">SIDDHARTH TRAVELS</div>
              <div className="text-[10px] font-black my-0.5">PAID</div>
              <div className="text-[6px] font-mono">NASHIK • {currentReceipt.date}</div>
              <div className="text-[5.5px] uppercase tracking-widest font-bold">VERIFIED</div>
            </div>

            <div className="text-center w-40">
              <div className="h-6 flex items-end justify-center pb-0.5">
                <span className="font-serif italic text-xs font-black text-[#1A1A1A]">
                  Siddharth Kailas Shardul
                </span>
              </div>
              <div className="border-t border-[#666] pt-0.5">
                <span className="text-[8.5px] uppercase font-black text-[#1A1A1A] block leading-none">
                  Authorized Signatory
                </span>
                <span className="text-[7.5px] text-[#666]">
                  Siddharth School Bus &amp; Travels
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
