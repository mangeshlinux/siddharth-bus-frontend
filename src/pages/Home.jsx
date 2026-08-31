import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  AlertCircle,
  MapPin,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const dynamicWords = ["Safe & Secure", "100% Punctual", "Trusted & Reliable", "Joyful & Caring"];

export default function Home() {
  const { loginParent } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  // Auto-rotate hero words
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % dynamicWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const [loading, setLoading] = useState(false);

  const handleQuickLogin = async (e) => {
    e.preventDefault();
    setError('');
    const clean = phone.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginParent(clean);
      if (res && res.success) {
        navigate('/parent-dashboard');
      } else {
        setError(res?.error || 'Mobile number not found in student records. Please check the number or contact Siddharth Travels.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] w-full flex items-center justify-center py-10 lg:py-16 px-4 sm:px-6 lg:px-12 bg-[#FBF3E7] overflow-hidden">
      
      {/* Immersive Warm Canvas Background Glows */}
      <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-[#D97B29]/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-[#B08D57]/15 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute inset-0 bg-[radial-gradient(#B08D57_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

      {/* FULL-BLEED IMMERSIVE 2-COLUMN PANORAMIC CANVAS */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        
        {/* LEFT COLUMN: Handcrafted Storytelling */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Official Enterprise Service Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-[#B08D57]/50 shadow-xs backdrop-blur-xs text-xs font-bold text-[#3B2314]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97B29] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D97B29]" />
            </span>
            <span className="text-[#D97B29] font-black uppercase tracking-wider text-[11px]">Nashik School Transport</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-600 font-medium">Safe &amp; Reliable Commute</span>
          </div>

          {/* Dynamic Changing Headline with Smooth Blur & Gradient Flip */}
          <div className="space-y-3.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#231A12] font-heading tracking-tight leading-[1.15]">
              Your Child's{' '}
              <span className="inline-block relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeWordIndex}
                    initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-[#D97B29] via-[#C4621C] to-[#9C430B] bg-clip-text text-transparent font-black"
                  >
                    {dynamicWords[activeWordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              School Commute
            </h1>

            <p className="text-sm sm:text-base text-[#7A6A5C] font-medium leading-relaxed max-w-xl">
              Reliable daily school transportation across Borgad, Adarsh Nagar, Omkar Nagar, and Swami Vivekanand Nagar (Makhamalabad). Managed by <strong>Mr. Siddharth Kailas Shardul</strong>.
            </p>
          </div>

          {/* Feature Badges Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-[#5A483C]">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#B08D57]/40 rounded-xl shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Female Attendants</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#B08D57]/40 rounded-xl shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#D97B29]" />
              <span>Dedicated Routes</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#B08D57]/40 rounded-xl shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Punctual</span>
            </span>
          </div>

          {/* Direct Support & Helpline Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <a
              href="tel:8446391127"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white border-2 border-[#B08D57] hover:border-[#D97B29] text-[#231A12] text-xs sm:text-sm font-black shadow-xs transition-all hover:scale-102 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#D97B29] flex-shrink-0" />
              <span>Mobile No.: 8446391127</span>
            </a>

            <a
              href="https://wa.me/918446391127?text=Hello%20Siddharth%20Travels,%20I%20am%20a%20parent%20in%20Nashik%20inquiring%20about%20school%20bus%20routes."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#6B8F71] hover:bg-[#56735B] text-white text-xs sm:text-sm font-black shadow-md shadow-[#6B8F71]/25 transition-all hover:scale-102 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span>WhatsApp Direct</span>
            </a>
          </div>

        </div>

        {/* RIGHT COLUMN: Large & Prominent Integrated Parent Portal */}
        <div className="lg:col-span-5 w-full">
          <motion.div 
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-5 sm:p-8 lg:p-10 rounded-3xl border-2 sm:border-3 border-[#B08D57] shadow-2xl shadow-[#3B2314]/10 text-left space-y-5 sm:space-y-6 relative overflow-hidden"
          >
            {/* Ambient Corner Flare */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D97B29]/15 rounded-full blur-2xl pointer-events-none" />

            {/* Portal Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#F5E8D3]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 sm:p-2.5 rounded-2xl bg-[#3B2314] text-[#D97B29]">
                  <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#231A12]">
                    Official Parent Portal
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#7A6A5C] font-medium">
                    Nashik Academic Transport 2026-27
                  </div>
                </div>
              </div>

              <span className="text-[10px] sm:text-[11px] font-mono font-black text-[#2F4F35] bg-[#EAF2EC] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-[#6B8F71]/50">
                Online Active
              </span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-[#231A12] font-heading leading-tight">
                Parent Portal Access
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6A5C] mt-1 font-medium">
                Enter your registered 10-digit mobile number to view live GPS status and tax receipts.
              </p>
            </div>

            {error && (
              <div className="p-3 sm:p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleQuickLogin} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-black text-[#231A12] uppercase tracking-wider mb-1.5 sm:mb-2">
                  Parent Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-[#7A6A5C] font-mono font-black border-r-2 border-[#B08D57]/40 pr-2.5 sm:pr-3">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit number"
                    className="w-full bg-[#FBF3E7]/60 border-2 border-[#B08D57]/60 rounded-2xl pl-20 sm:pl-24 pr-4 py-3 sm:py-4 text-base sm:text-xl font-mono font-black text-[#231A12] placeholder-[#7A6A5C]/60 focus:outline-none focus:border-[#D97B29] focus:bg-white transition-all shadow-inner"
                  />
                </div>
                
              </div>

              {/* Big CTA Button */}
              <button
                type="submit"
                disabled={loading || phone.replace(/\D/g, '').length < 10}
                className="w-full py-3.5 sm:py-5 rounded-2xl bg-gradient-to-r from-[#D97B29] to-[#C4621C] hover:from-[#C4621C] hover:to-[#B55515] text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-[#D97B29]/30 transition-all flex items-center justify-center gap-2 sm:gap-3 cursor-pointer disabled:opacity-50 active:scale-98"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Login to Parent Dashboard</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                  </>
                )}
              </button>
            </form>

            {/* Verified Benefits */}
            <div className="pt-3 sm:pt-4 border-t border-[#F5E8D3] flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#231A12] font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#6B8F71] flex-shrink-0" />
              <span>Instant Digital Fee Receipts &amp; Statements</span>
            </div>

          </motion.div>
        </div>

      </div>

    </div>
  );
}
