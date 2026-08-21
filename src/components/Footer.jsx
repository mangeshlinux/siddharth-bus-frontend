import React from 'react';
import { Phone, Mail, MapPin, ArrowUp, Lock } from 'lucide-react';
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
              Safe, comfortable, and reliable daily school transport across Nashik since 2017. Managed by Mr. Siddharth Shardul.
            </p>
          </div>

          {/* Col 2: Direct Contact */}
          <div className="space-y-2.5 text-xs">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Nashik Office &amp; Helpline
            </h4>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D97B29] flex-shrink-0" />
              <span>Call Helpline: <a href="tel:8767948553" className="font-mono font-bold text-white hover:text-[#D97B29] transition-colors">8767948553</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#D97B29] flex-shrink-0" />
              <span>Email: <a href="mailto:siddharth.travels.nashik@gmail.com" className="text-[#FBF3E7]/90 hover:text-[#D97B29] transition-colors">siddharth.travels.nashik@gmail.com</a></span>
            </div>
            <div className="flex items-start gap-2 text-[#FBF3E7]/80">
              <MapPin className="w-3.5 h-3.5 text-[#D97B29] flex-shrink-0 mt-0.5" />
              <span>Shop #4, Shree Samarth Plaza, Near College Road, Nashik - 422005</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Back to Top, and Owner Login */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FBF3E7]/70">
          <div>
            © {new Date().getFullYear()} Siddharth School Bus &amp; Travels (Nashik, Est. 2017). All Rights Reserved.
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
