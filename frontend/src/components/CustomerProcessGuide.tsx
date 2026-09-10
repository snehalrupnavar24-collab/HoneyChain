import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  UserCheck,
  QrCode,
  ShieldCheck,
  Box,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Printer
} from 'lucide-react';

interface CustomerProcessGuideProps {
  onOpenLogin: () => void;
  onOpenScanner: () => void;
  onOpenCertificate: () => void;
  onScrollTo3D: () => void;
}

export const CustomerProcessGuide: React.FC<CustomerProcessGuideProps> = ({
  onOpenLogin,
  onOpenScanner,
  onOpenCertificate,
  onScrollTo3D
}) => {
  const { user, isLoggedIn } = useAuth();
  const { lang } = useLanguage();

  const steps = [
    {
      step: '01',
      icon: UserCheck,
      title: lang === 'mr' ? '१. ग्राहक लॉगिन' : (lang === 'hi' ? '1. ग्राहक लॉगिन' : '1. Customer Login'),
      desc: isLoggedIn 
        ? (lang === 'mr' ? `लॉगिन पूर्ण: ${user?.name}` : (lang === 'hi' ? `लॉगिन पूर्ण: ${user?.name}` : `Signed in: ${user?.name}`))
        : (lang === 'mr' ? 'खाते उघडा / १-क्लिक प्रवेश' : (lang === 'hi' ? 'खाता खोलें / 1-क्लिक प्रवेश' : 'Sign in or 1-Click Access')),
      actionText: isLoggedIn 
        ? (lang === 'mr' ? 'खाते पहा' : (lang === 'hi' ? 'प्रोफाइल' : 'Profile'))
        : (lang === 'mr' ? 'लॉगिन करा' : (lang === 'hi' ? 'लॉगिन' : 'Sign In')),
      action: onOpenLogin,
      completed: isLoggedIn,
      badge: isLoggedIn ? '✓' : 'Step 1'
    },
    {
      step: '02',
      icon: QrCode,
      title: lang === 'mr' ? '२. जार QR स्कॅन' : (lang === 'hi' ? '2. जार QR स्कैन' : '2. Scan Jar QR'),
      desc: lang === 'mr' ? 'कॅमेऱ्याने स्टिकर स्कॅन करा' : (lang === 'hi' ? 'कैमरे से QR स्कैन करें' : 'Point camera at jar QR'),
      actionText: lang === 'mr' ? 'स्कॅन करा' : (lang === 'hi' ? 'स्कैन' : 'Scan QR'),
      action: onOpenScanner,
      completed: true,
      badge: 'Step 2'
    },
    {
      step: '03',
      icon: ShieldCheck,
      title: lang === 'mr' ? '३. शुद्धता व शेतकरी' : (lang === 'hi' ? '3. शुद्धता व किसान' : '3. Verify & Farmer'),
      desc: lang === 'mr' ? 'शेतकरी रमेश पाटील व NABL लॅब' : (lang === 'hi' ? 'किसान रमेश पाटिल व NABL लैब' : 'Farmer Patil & 99.1% pure'),
      actionText: lang === 'mr' ? 'तपासा' : (lang === 'hi' ? 'जांचें' : 'Verified'),
      action: () => {
        const el = document.getElementById('verified-batch-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
      completed: true,
      badge: 'Step 3'
    },
    {
      step: '04',
      icon: Box,
      title: lang === 'mr' ? '४. 3D मॉडेल व प्रमाणपत्र' : (lang === 'hi' ? '4. 3D मॉडल व प्रमाण पत्र' : '4. 3D Twin & Cert'),
      desc: lang === 'mr' ? '३६०° फिरवा व NABL सेव्ह करा' : (lang === 'hi' ? '360° घुमाएं व प्रमाण पत्र लें' : '360° spin & NABL PDF'),
      actionText: lang === 'mr' ? '3D पहा' : (lang === 'hi' ? '3D देखें' : 'View 3D'),
      action: onScrollTo3D,
      completed: true,
      badge: 'Step 4'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 shadow-xs p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-black text-sm sm:text-base text-stone-900 tracking-tight">
              {lang === 'mr' ? 'ग्राहकांसाठी संपूर्ण पडताळणी प्रक्रिया' : (lang === 'hi' ? 'ग्राहकों के लिए संपूर्ण सत्यापन प्रक्रिया' : 'Complete 4-Step Customer Process')}
            </h3>
            <p className="text-[11px] text-stone-500">
              {lang === 'mr' 
                ? 'लॉगिनपासून QR स्कॅन, शेतकरी माहिती, आणि ३D बाटली पाहणीपर्यंतचा सोपा प्रवास' 
                : (lang === 'hi' 
                  ? 'लॉगिन से लेकर QR स्कैन, किसान विवरण, और 3D जार निरीक्षण तक की आसान प्रक्रिया' 
                  : 'From sign-in and QR scanning to farmer attribution, lab purity, and 3D inspection')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenLogin}
          className="self-start sm:self-auto text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <UserCheck className="w-3.5 h-3.5 text-amber-700" />
          <span>
            {isLoggedIn 
              ? (lang === 'mr' ? `👤 ${user?.name}` : (lang === 'hi' ? `👤 ${user?.name}` : `👤 ${user?.name}`)) 
              : (lang === 'mr' ? 'ग्राहक लॉगिन / प्रवेश' : (lang === 'hi' ? 'ग्राहक लॉगिन' : 'Customer Sign In'))}
          </span>
        </button>
      </div>

      {/* 4 Interactive Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={item.action}
              className="bg-stone-50/80 hover:bg-amber-50/70 p-3.5 rounded-2xl border border-stone-200 hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-2xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    item.completed && idx === 0
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-stone-200 text-stone-700'
                  }`}>
                    {item.badge}
                  </span>
                  <Icon className="w-4 h-4 text-stone-400 group-hover:text-amber-700 transition-colors" />
                </div>

                <h4 className="font-bold text-xs text-stone-900 group-hover:text-amber-900 transition-colors">
                  {item.title}
                </h4>

                <p className="text-[11px] text-stone-600 leading-snug">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 pt-1 border-t border-stone-200/60">
                <span>{item.actionText}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
