import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, QrCode, X, Copy, Check } from 'lucide-react';
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
    navigator.clipboard.writeText('siddarthshardul2@okaxis');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#3B2314] border-b border-[#B08D57]/60 shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 sm:py-2.5 min-h-[74px] sm:min-h-[82px]">
          
          {/* Brand Logo & Name (Balanced, Clean Layout) */}
          <Link to="/" className="flex items-center gap-3 sm:gap-3.5 group py-1">
            <Logo size="md" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-left">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading group-hover:text-[#D97B29] transition-colors leading-none">
                SIDDHARTH
              </span>
              <span className="hidden sm:inline-block h-5 w-[1.5px] bg-[#B08D57]/60 rounded-full" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-[#E5A853] tracking-wider uppercase leading-tight group-hover:text-[#F3B367] transition-colors">
                  School Bus &amp; Travels
                </span>
                <span className="hidden sm:inline text-xs text-[#FBF3E7]/60">• Nashik</span>
              </div>
            </div>
          </Link>

          {/* Right Header Actions: Integrated UPI Pay Button & Logout */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#2A1810] hover:bg-[#20110A] text-white border border-[#B08D57]/60 hover:border-[#D97B29] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer group flex-shrink-0"
              title="Scan UPI QR Code to Pay (siddarthshardul2@okaxis)"
            >
              <QrCode className="w-4 h-4 text-[#D97B29] group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="hidden md:inline text-zinc-300">UPI Pay:</span>
              <span className="font-mono text-[#E5A853] text-xs font-black">
                <span className="inline sm:hidden">UPI</span>
                <span className="hidden sm:inline">siddarthshardul2@okaxis</span>
              </span>
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-900/30 hover:bg-red-900/50 text-red-200 border border-red-700/50 text-xs font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* UPI QR SCANNER MODAL */}
      {isQrModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div 
            className="bg-white border-2 border-[#B08D57] rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-zinc-900 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-[#D97B29] border border-amber-200">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900 leading-tight">
                    UPI Payment QR
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Proprietor: Mr. Siddharth Kailas Shardul • Nashik
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Scanner Showcase Card */}
            <div className="my-5 flex flex-col items-center">
              <div className="bg-zinc-900 p-2 border border-zinc-700 rounded-2xl shadow-lg text-center max-w-[260px] w-full">
                <img 
                  src="/siddharth_upi_qr.png" 
                  alt="Official Siddharth K Shardul GPay UPI QR Code" 
                  className="w-full h-auto object-contain mx-auto rounded-xl"
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
                  <span className="font-mono font-bold text-zinc-900">siddarthshardul2@okaxis</span>
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
                <span className="font-semibold text-zinc-900">Mr. Siddharth Kailas Shardul</span>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-200/60 pt-1.5">
                <span className="text-zinc-500 font-medium">Office Helpline:</span>
                <a href="tel:8446391127" className="font-mono font-bold text-amber-700 hover:underline">
                  +91 84463 91127
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
