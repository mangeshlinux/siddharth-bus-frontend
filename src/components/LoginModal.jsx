import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function LoginModal({ isOpen, onClose }) {
  const { loginParent } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    const res = await loginParent(cleanPhone);
    setLoading(false);

    if (res.success) {
      onClose();
      navigate('/parent-dashboard');
    } else {
      setError(res.error || 'Mobile number not found in student records.');
    }
  };

  const handleClose = () => {
    setError('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231A12]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-2 border-[#B08D57] rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl relative text-[#231A12]">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#7A6A5C] hover:text-[#231A12] hover:bg-[#FBF3E7] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="md" className="mb-2" />
          <h2 className="text-xl font-black text-[#231A12] font-heading">
            Parent Login
          </h2>
          <p className="text-xs text-[#7A6A5C] mt-0.5">
            Siddharth School Bus &amp; Travels (Nashik)
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Single Step: Phone Input → Direct Login */}
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-[#231A12] uppercase tracking-wider mb-1.5">
              Registered Mobile Number
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A6A5C] font-mono font-bold border-r border-[#B08D57]/40 pr-2">
                +91
              </div>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit number"
                className="w-full bg-[#FBF3E7]/70 border border-[#B08D57]/60 rounded-xl pl-16 pr-4 py-3 text-sm font-mono font-bold text-[#231A12] placeholder-[#7A6A5C]/60 focus:outline-none focus:border-[#D97B29] focus:bg-white"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-[#7A6A5C] mt-1.5">
              Enter the mobile number registered by the bus operator.
              {' '}<button type="button" onClick={() => setPhone('9876543210')} className="text-[#D97B29] font-mono font-bold hover:underline">Try: 9876543210</button>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || phone.replace(/\D/g, '').length < 10}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D97B29] to-[#C4621C] hover:from-[#C4621C] hover:to-[#B55515] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#D97B29]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying...</span>
            ) : (
              <>
                <span>Login to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
