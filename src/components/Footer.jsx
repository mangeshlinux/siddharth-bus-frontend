import React from 'react';
import { Phone, Mail, ArrowUp, Lock } from 'lucide-react';
import Logo from './Logo';

export default function Footer({ onOpenOwnerLogin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#3B2314] border-t-2 border-[#B08D57] text-[#FBF3E7] relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-[#B08D57]/40">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div>
                <h3 className="text-xl font-black text-white font-heading leading-tight">
                  SIDDHARTH
                </h3>
                <p className="text-xs font-bold tracking-wider uppercase text-[#D97B29]">
                  School Bus &amp; Travels • Nashik
                </p>
              </div>
            </div>
            <p className="text-xs text-[#FBF3E7]/80 leading-relaxed">
              Safe, comfortable, and reliable daily school transport across Nashik since 2017. Managed by Mr. Siddharth Kailas Shardul.
            </p>
          </div>

          {/* Col 2: Direct Contact */}
          <div className="space-y-2.5 text-xs">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Contact
            </h4>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D97B29] flex-shrink-0" />
              <span>Mobile No.: <a href="tel:8446391127" className="font-mono font-bold text-white hover:text-[#D97B29] transition-colors">8446391127</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#D97B29] flex-shrink-0" />
              <span>Email: <a href="mailto:siddharthshardul96@gmail.com" className="text-[#FBF3E7]/90 hover:text-[#D97B29] transition-colors">siddharthshardul96@gmail.com</a></span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-[#D97B29] flex-shrink-0 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>Instagram: <a href="https://www.instagram.com/siddhshardul2?igsi=MWRnaTM5aWF0c25hdg==" target="_blank" rel="noopener noreferrer" className="text-[#FBF3E7]/90 hover:text-[#D97B29] transition-colors font-semibold">@siddhshardul2</a></span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Developer Credit, Back to Top, and Owner Login */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FBF3E7]/60">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-left">
            <span>
              © {new Date().getFullYear()} Siddharth School Bus &amp; Travels (Nashik, Est. 2017). All Rights Reserved.
            </span>
            <span className="hidden sm:inline text-[#B08D57]/40">•</span>
            <span className="text-[11px] text-[#FBF3E7]/50 font-normal">
              Developed by{' '}
              <a
                href="https://www.instagram.com/mangesh.l_0081?igsi=cXg3N2Y5b2xtZnc5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FBF3E7]/70 hover:text-[#D97B29] transition-colors underline-offset-2 hover:underline font-mono"
              >
                @mangesh.l_0081
              </a>
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Operator / Owner Login at Bottom */}
            <button
              onClick={onOpenOwnerLogin}
              className="flex items-center gap-1.5 text-[#B08D57] hover:text-[#D97B29] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#D97B29]" />
              <span>Operator Admin Login</span>
            </button>

            <button
              onClick={scrollToTop}
              title="Scroll to Top"
              className="p-2.5 rounded-xl bg-[#2A1810] hover:bg-[#20110A] border border-[#B08D57]/50 text-white hover:text-[#D97B29] font-bold shadow-md transition-all cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
