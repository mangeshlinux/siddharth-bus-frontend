import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, QrCode, X, Copy, Check, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCopyUpi = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText('8767948553@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#3B2314] border-b border-[#B08D57]/60 shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name (Horizontal Layout) */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-4 group py-2">
            <Logo size="md" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-left">
              <span className="text-xl sm:text-3xl font-black text-white tracking-tight font-heading group-hover:text-[#D97B29] transition-colors leading-none">
                SIDDHARTH
              </span>
              <span className="hidden sm:inline-block h-5 w-[2px] bg-[#B08D57]/60 rounded-full" />
              <span className="text-[10px] sm:text-sm font-bold text-[#D97B29] tracking-wider uppercase sm:mt-0.5 leading-tight">
                School Bus &amp; Travels • Nashik
              </span>
            </div>
          </Link>

          {/* Right Header Actions: Integrated UPI Pay Button & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1 sm:gap-2 p-1.5 sm:px-3.5 sm:py-2 bg-[#2A1810] hover:bg-[#20110A] text-white border border-[#B08D57]/50 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer group flex-shrink-0"
              title="Scan UPI QR Code to Pay (8767948553@upi)"
            >
              <QrCode className="w-4 h-4 text-[#D97B29] group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="hidden md:inline text-zinc-300">UPI Pay:</span>
              <span className="font-mono text-[#D97B29] text-[10px] sm:text-xs">
                <span className="inline sm:hidden">UPI</span>
                <span className="hidden sm:inline">8767948553@upi</span>
              </span>
            </button>

            {user && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#2A1810] hover:bg-red-800 text-[#FBF3E7] hover:text-white border border-[#B08D57]/40 text-xs font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* PROFESSIONAL FINTECH UPI QR SCANNER MODAL */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 text-left">
          <div className="bg-white border border-zinc-200 max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-zinc-900 rounded-2xl font-sans">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-100">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-200 flex-shrink-0 shadow-xs">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Merchant Account</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 leading-tight">
                  Siddharth School Bus &amp; Travels
                </h3>
                <p className="text-xs text-zinc-500">
                  Proprietor: Mr. Siddharth Shardul • Nashik
                </p>
              </div>
            </div>

            {/* QR Scanner Showcase Card */}
            <div className="my-5 flex flex-col items-center">
              <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-xl shadow-xs text-center max-w-[240px] w-full">
                <img 
                  src="/upi-qr.svg" 
                  alt="Siddharth Travels UPI QR" 
                  className="w-full h-auto object-contain mx-auto"
                />
              </div>

              {/* Supported UPI Apps Row */}
              <div className="flex items-center justify-center gap-2 mt-3 text-[11px] font-medium text-zinc-500">
                <span className="px-2 py-0.5 bg-zinc-100 rounded text-zinc-700 font-bold">Google Pay</span>
                <span>•</span>
                <span className="px-2 py-0.5 bg-zinc-100 rounded text-zinc-700 font-bold">PhonePe</span>
                <span>•</span>
                <span className="px-2 py-0.5 bg-zinc-100 rounded text-zinc-700 font-bold">Paytm</span>
                <span>•</span>
                <span className="px-2 py-0.5 bg-zinc-100 rounded text-zinc-700 font-bold">BHIM</span>
              </div>
            </div>

            {/* Official UPI Details Box */}
            <div className="bg-zinc-50 rounded-xl p-3.5 border border-zinc-200 space-y-2 text-xs mb-5">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-medium">UPI ID:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-zinc-900">8767948553@upi</span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-2 py-0.5 bg-white border border-zinc-300 rounded text-[11px] font-bold text-zinc-700 hover:bg-zinc-100 cursor-pointer flex items-center gap-1"
                  >
                    {copiedUpi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-200/60 pt-1.5">
                <span className="text-zinc-500 font-medium">Payee Name:</span>
                <span className="font-semibold text-zinc-900">Mr. Siddharth Shardul</span>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-200/60 pt-1.5">
                <span className="text-zinc-500 font-medium">Office Helpline:</span>
                <a href="tel:8767948553" className="font-mono font-bold text-amber-700 hover:underline">
                  +91 8767948553
                </a>
              </div>
            </div>

            {/* Note & Close Action */}
            <p className="text-[11px] text-zinc-400 text-center mb-4">
              Receipt will be issued and verified after transaction confirmation.
            </p>

            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer uppercase tracking-wider"
            >
              Close Window
            </button>

          </div>
        </div>
      )}

    </header>
  );
}
