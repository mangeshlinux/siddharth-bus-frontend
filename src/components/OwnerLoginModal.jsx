import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function OwnerLoginModal({ isOpen, onClose }) {
  const { loginOwner } = useAuth();
  const navigate = useNavigate();

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await loginOwner(pin);
    setLoading(false);

    if (res.success) {
      onClose();
      navigate('/admin-portal-x9f2');
    } else {
      setError(res.error || 'Invalid Owner PIN / Password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231A12]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-2 border-[#B08D57] rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl relative text-[#231A12] text-left">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#7A6A5C] hover:text-[#231A12] hover:bg-[#FBF3E7] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Branding */}
        <div className="flex flex-col items-center text-center mb-5">
          <Logo size="md" className="mb-2" />
          <h2 className="text-lg font-black text-[#231A12] font-heading">
            Operator Admin Login
          </h2>
          <p className="text-xs text-[#7A6A5C]">
            Siddharth School Bus &amp; Travels (Nashik)
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#231A12] uppercase tracking-wider mb-1.5 text-center">
              Enter Owner PIN / Password
            </label>
            <input
              type="password"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter Owner PIN / Password"
              className="w-full bg-[#FBF3E7]/70 border border-[#B08D57]/60 rounded-xl px-4 py-3 text-center text-xl font-mono font-bold text-[#231A12] placeholder-[#7A6A5C]/60 focus:outline-none focus:border-[#D97B29] focus:bg-white"
              autoFocus
            />
            <p className="text-[11px] text-[#7A6A5C] text-center mt-1.5 font-medium">
              Enter operator access PIN or master password
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#3B2314] hover:bg-[#2A1810] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#D97B29] border-t-transparent rounded-full animate-spin"></div>
                <span>Authenticating (Connecting to Server)...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-[#D97B29]" />
                <span>Access Admin Portal</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
