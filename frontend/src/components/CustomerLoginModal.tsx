import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  User,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Sparkles,
  QrCode,
  X,
  ArrowRight,
  Award
} from 'lucide-react';

interface CustomerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanRedirect?: () => void;
}

export const CustomerLoginModal: React.FC<CustomerLoginModalProps> = ({
  isOpen,
  onClose,
  onScanRedirect
}) => {
  const { user, isLoggedIn, login, loginAsDemoConsumer, logout, scannedBatches } = useAuth();
  const { lang } = useLanguage();

  const [email, setEmail] = useState('consumer@honeychain.in');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);
    if (!res.success) {
      setError(res.message || 'Login failed. Please check credentials.');
    } else {
      onClose();
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoConsumer();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white text-stone-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-amber-300 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-black text-lg text-stone-900">
                {isLoggedIn 
                  ? (lang === 'mr' ? 'ग्राहक खाते प्रोफाइल' : (lang === 'hi' ? 'ग्राहक खाता प्रोफाइल' : 'Customer Account Profile'))
                  : (lang === 'mr' ? 'ग्राहक प्रवेश (Login)' : (lang === 'hi' ? 'ग्राहक लॉगिन' : 'Customer Sign In'))}
              </h3>
              <span className="text-xs text-stone-500">
                {lang === 'mr' ? 'राष्ट्रीय मध मोहीम ग्राहक केंद्र' : (lang === 'hi' ? 'राष्ट्रीय मधुमक्खी मिशन ग्राहक केंद्र' : 'National Honey Mission Consumer Hub')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-800 p-1.5 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoggedIn && user ? (
          /* LOGGED IN USER PROFILE */
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-amber-50 to-emerald-50/60 p-4 rounded-2xl border border-amber-200 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-serif font-bold text-lg shadow-xs">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-stone-900 truncate">{user.name}</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 shrink-0">
                    ✓ {lang === 'mr' ? 'सत्यापित' : (lang === 'hi' ? 'सत्यापित' : 'Verified')}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono truncate">{user.email}</p>
                <span className="text-[11px] text-amber-900 font-semibold mt-0.5 block">
                  {lang === 'mr' ? 'प्रमाणित अस्सल मध ग्राहक' : (lang === 'hi' ? 'प्रमाणित शुद्ध शहद उपभोक्ता' : 'Certified Pure Honey Consumer')}
                </span>
              </div>
            </div>

            {/* Scanned Jars History */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 uppercase tracking-wider">
                  {lang === 'mr' ? 'माझे स्कॅन केलेले मध बाटल्या:' : (lang === 'hi' ? 'मेरे स्कैन किए गए शहद जार:' : 'My Scanned Honey Jars:')}
                </span>
                <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-600 font-bold">
                  {scannedBatches.length} {lang === 'mr' ? 'बाटल्या' : (lang === 'hi' ? 'जार' : 'Jars')}
                </span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {scannedBatches.map((batch, idx) => (
                  <div key={idx} className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-mono font-bold text-stone-800">{batch}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      100% Pure
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
              {onScanRedirect && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onScanRedirect();
                  }}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{lang === 'mr' ? 'नवीन जार स्कॅन करा' : (lang === 'hi' ? 'नया जार स्कैन करें' : 'Scan New Jar')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={logout}
                className="px-4 py-2.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 border border-stone-200 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{lang === 'mr' ? 'लॉगआउट' : (lang === 'hi' ? 'लॉगआउट' : 'Log Out')}</span>
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN / REGISTRATION FORM */
          <div className="space-y-4">
            {/* 1-Click Fast Consumer Access Pill */}
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  {lang === 'mr' ? 'त्वरित १-क्लिक ग्राहक प्रवेश' : (lang === 'hi' ? 'त्वरित 1-क्लिक ग्राहक प्रवेश' : 'Instant 1-Click Customer Access')}
                </span>
                <span className="text-[10px] bg-amber-200/90 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                  Demo
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug">
                {lang === 'mr' 
                  ? 'पासवर्ड न टाकता लगेच ग्राहक म्हणून प्रवेश करा आणि मध स्कॅन व प्रमाणपत्रे तपासा.'
                  : (lang === 'hi' 
                    ? 'बिना पासवर्ड डाले तुरंत ग्राहक के रूप में लॉगिन करें और शहद जांच शुरू करें।'
                    : 'Instantly sign in as a verified consumer without typing passwords to test QR scans.')}
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 bg-stone-900 hover:bg-stone-950 text-amber-300 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{lang === 'mr' ? 'स्नेहल (ग्राहक) म्हणून १-क्लिक प्रवेश' : (lang === 'hi' ? 'स्नेहल (ग्राहक) के रूप में 1-क्लिक लॉगिन' : 'Continue as Snehal (Consumer)')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleLogin} className="space-y-3 pt-1">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-xl">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 block">
                  {lang === 'mr' ? 'ईमेल पत्ता' : (lang === 'hi' ? 'ईमेल पता' : 'Email Address')}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500 font-mono text-stone-900"
                  />
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 block">
                  {lang === 'mr' ? 'पासवर्ड' : (lang === 'hi' ? 'पासवर्ड' : 'Password')}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:border-amber-500 font-mono text-stone-900"
                  />
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading 
                  ? (lang === 'mr' ? 'तपासत आहे...' : (lang === 'hi' ? 'सत्यापित हो रहा है...' : 'Authenticating...'))
                  : (lang === 'mr' ? 'प्रवेश करा (Sign In)' : (lang === 'hi' ? 'लॉगिन करें' : 'Sign In'))}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
