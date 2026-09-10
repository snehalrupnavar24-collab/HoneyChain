import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Search,
  Camera,
  MapPin,
  Lock,
  Printer,
  Sparkles,
  CheckCircle2,
  Volume2,
  Smartphone,
  QrCode,
  UserCheck,
  ChevronRight,
  FlaskConical,
  ArrowRight
} from 'lucide-react';
import { verifyPackageByCode } from '../services/api';
import { ConsumerVerifyResponse } from '../types';
import { HoneyJar3DViewer } from './HoneyJar3DViewer';
import { HouseholdPuritySimulator } from './HouseholdPuritySimulator';
import { RealCameraScannerModal } from './RealCameraScannerModal';
import { CustomerLoginModal } from './CustomerLoginModal';
import { CoreFeaturesBar } from './CoreFeaturesBar';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface WebsiteHomeProps {
  onOpenPortal: (portalId: string) => void;
  onOpenMobileModal?: () => void;
  onOpenCustomerQrModal?: () => void;
}

export const WebsiteHome: React.FC<WebsiteHomeProps> = ({ 
  onOpenPortal, 
  onOpenMobileModal, 
  onOpenCustomerQrModal 
}) => {
  const { lang, t } = useLanguage();
  const { user, isLoggedIn, addScannedBatch } = useAuth();
  const [packageCode, setPackageCode] = useState('PKG-MAHA-042-2697');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ConsumerVerifyResponse | null>(null);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showPuritySim, setShowPuritySim] = useState(false);

  const playSoftBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch {}
  };

  const handleSearch = async (codeToVerify?: string) => {
    const code = codeToVerify || packageCode;
    if (!code) return;
    setLoading(true);
    try {
      const res = await verifyPackageByCode(code.trim());
      setData(res);
      addScannedBatch(code.trim());
      playSoftBeep();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#D97706', '#F59E0B', '#10B981']
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const batchParam = urlParams.get('batch');
    const initialCode = batchParam ? batchParam.trim() : 'PKG-MAHA-042-2697';
    setPackageCode(initialCode);
    handleSearch(initialCode);
  }, []);

  const handleAudioNarration = () => {
    let speechText = '';
    let speechLang = 'en-IN';
    if (lang === 'mr') {
      speechText = `हनीचेन सत्यापन यशस्वी झाले. हा मध १००% अस्सल आहे. शेतकरी रमेश तुकाराम पाटील यांनी सह्याद्रीच्या रानातून हा मध काढला आहे. NABL लॅब तपासणीत शून्य टक्के कृत्रिम साखर आढळली आहे.`;
      speechLang = 'mr-IN';
    } else if (lang === 'hi') {
      speechText = `हनीचेन सत्यापन सफल हुआ। यह शत-प्रतिशत शुद्ध कच्चा शहद है। इसे महाबलेश्वर के पंजीकृत किसान रमेश तुकाराम पाटिल ने निकाला है। इसमें शून्य प्रतिशत कृत्रिम चीनी है।`;
      speechLang = 'hi-IN';
    } else {
      speechText = `HoneyChain verification successful. This honey is 100% pure raw honey from beekeeper Ramesh Patil. Laboratory testing confirms 0.0% added sugar and 17.8% moisture.`;
      speechLang = 'en-IN';
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance(speechText);
      ut.lang = speechLang;
      window.speechSynthesis.speak(ut);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. ULTRA-CLEAN HIGH-VISIBILITY HERO & UNIFIED PROCESS */}
      <section className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-5 text-center">
        {/* Top Trust Guarantee Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-300 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{t.hero.badge}</span>
        </div>

        {/* High-Contrast Bold Headline */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 tracking-tight leading-snug">
            {t.hero.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-700 max-w-lg mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
        </div>

        {/* High-Contrast Search & Camera Action */}
        <div className="max-w-lg mx-auto space-y-2.5 pt-1">
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-stone-50 p-2 rounded-2xl border-2 border-stone-300 focus-within:border-amber-500 focus-within:bg-white transition-all shadow-xs">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
              className="flex-1 w-full relative"
            >
              <input
                type="text"
                value={packageCode}
                onChange={(e) => setPackageCode(e.target.value)}
                placeholder={t.hero.placeholder}
                className="w-full pl-10 pr-3 py-2 text-sm bg-transparent border-none focus:outline-hidden font-mono font-bold text-stone-900 placeholder:text-stone-400"
              />
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={loading}
                className="flex-1 sm:flex-none px-4 py-2 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {loading ? t.hero.verifying : t.hero.verifyBtn}
              </button>

              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Scan Jar QR with Camera"
              >
                <Camera className="w-4 h-4" />
                <span>{t.hero.scanBtn}</span>
              </button>
            </div>
          </div>

          {/* Quick 1-Tap Sample Batch & Mobile QR Link */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-0.5">
            <span className="text-stone-600 font-semibold">{t.hero.testBatchLabel}</span>
            <button
              type="button"
              onClick={() => { setPackageCode('PKG-MAHA-042-2697'); handleSearch('PKG-MAHA-042-2697'); }}
              className="px-2.5 py-0.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg text-amber-950 font-mono font-bold transition-colors cursor-pointer shadow-2xs"
            >
              🍯 {t.hero.sampleJamun}
            </button>
            {onOpenMobileModal && (
              <button
                type="button"
                onClick={onOpenMobileModal}
                className="px-2.5 py-0.5 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg text-emerald-950 font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Smartphone className="w-3 h-3 text-emerald-800" />
                <span>{t.hero.mobileTestBtn}</span>
              </button>
            )}
          </div>
        </div>

        {/* STREAMLINED 4-STEP CUSTOMER PROCESS BAR (INTEGRATED & CLEAN) */}
        <div className="pt-3 border-t border-stone-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
            {/* Step 1: Customer Sign In */}
            <div 
              onClick={() => setIsLoginModalOpen(true)}
              className="p-2 rounded-xl border border-stone-200 hover:border-amber-300 bg-stone-50 hover:bg-amber-50/50 cursor-pointer transition-all flex items-center gap-2 group"
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                isLoggedIn ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-800 group-hover:bg-amber-500 group-hover:text-stone-950'
              }`}>
                {isLoggedIn ? '✓' : '1'}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-stone-900 block truncate">
                  {lang === 'mr' ? '१. ग्राहक खाते' : (lang === 'hi' ? '1. ग्राहक खाता' : '1. Sign In')}
                </span>
                <span className="text-[10px] text-stone-600 truncate block">
                  {isLoggedIn ? user?.name.split(' ')[0] : (lang === 'mr' ? 'लॉगिन करा' : (lang === 'hi' ? 'लॉगिन' : '1-Click Access'))}
                </span>
              </div>
            </div>

            {/* Step 2: Scan Jar QR */}
            <div 
              onClick={() => setIsScannerOpen(true)}
              className="p-2 rounded-xl border border-stone-200 hover:border-amber-300 bg-stone-50 hover:bg-amber-50/50 cursor-pointer transition-all flex items-center gap-2 group"
            >
              <div className="w-6 h-6 rounded-lg bg-stone-200 text-stone-800 group-hover:bg-amber-500 group-hover:text-stone-950 flex items-center justify-center text-xs font-bold shrink-0">
                2
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-stone-900 block truncate">
                  {lang === 'mr' ? '२. QR स्कॅन' : (lang === 'hi' ? '2. QR स्कैन' : '2. Scan QR')}
                </span>
                <span className="text-[10px] text-stone-600 truncate block">
                  {lang === 'mr' ? 'कॅमेरा उघडा' : (lang === 'hi' ? 'कैमरा खोलें' : 'Point Camera')}
                </span>
              </div>
            </div>

            {/* Step 3: Verified Lab & Farmer */}
            <div 
              onClick={() => {
                const el = document.getElementById('verified-batch-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-2 rounded-xl border border-emerald-300 bg-emerald-50/60 cursor-pointer transition-all flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                ✓
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-emerald-950 block truncate">
                  {lang === 'mr' ? '३. लॅब व शेतकरी' : (lang === 'hi' ? '3. लैब व किसान' : '3. Lab & Farmer')}
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold truncate block">
                  99.1% {lang === 'mr' ? 'शुद्ध' : (lang === 'hi' ? 'शुद्ध' : 'Pure')}
                </span>
              </div>
            </div>

            {/* Step 4: 3D Twin & Certificate */}
            <div 
              onClick={() => {
                const el = document.getElementById('honey-jar-3d-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-2 rounded-xl border border-stone-200 hover:border-amber-300 bg-stone-50 hover:bg-amber-50/50 cursor-pointer transition-all flex items-center gap-2 group"
            >
              <div className="w-6 h-6 rounded-lg bg-stone-200 text-stone-800 group-hover:bg-amber-500 group-hover:text-stone-950 flex items-center justify-center text-xs font-bold shrink-0">
                4
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-stone-900 block truncate">
                  {lang === 'mr' ? '४. 3D व प्रमाणपत्र' : (lang === 'hi' ? '4. 3D व प्रमाण पत्र' : '4. 3D Jar & Cert')}
                </span>
                <span className="text-[10px] text-stone-600 truncate block">
                  {lang === 'mr' ? '३६०° फिरवा' : (lang === 'hi' ? '360° घुमाएं' : '360° Spin')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROMINENT 4 CORE VERIFICATION & QR FEATURES (DIRECTLY VISIBLE - NOT HIDDEN!) */}
      <CoreFeaturesBar
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenGenerator={() => onOpenCustomerQrModal && onOpenCustomerQrModal()}
        onOpenMobile={() => onOpenMobileModal && onOpenMobileModal()}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* 2. VERIFIED AUTHENTICITY CARD (HIGH CONTRAST & CLEAN) */}
      {data && (
        <section id="verified-batch-section" className="space-y-5 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-5">
            {/* Top Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.batchCard.verifiedBadge}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 pt-0.5">
                  {data.package.product_name}
                </h2>
                <div className="text-xs text-stone-700 flex items-center gap-2 font-medium">
                  <span className="font-mono bg-stone-100 px-2 py-0.5 rounded-md border border-stone-300 text-stone-900 font-bold">
                    {t.batchCard.batchLabel}: {data.package.package_code}
                  </span>
                  <span>•</span>
                  <span>{lang === 'mr' ? '५०० ग्रॅम काचेची बाटली' : (lang === 'hi' ? '500 ग्राम कांच का जार' : '500g Glass Jar')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAudioNarration}
                  className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all border border-amber-300 cursor-pointer shadow-2xs"
                  title="Listen in Audio"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                  <span>{t.batchCard.listenAudio}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCertificateOpen(true)}
                  className="px-3.5 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.batchCard.printCertBtn}</span>
                </button>
              </div>
            </div>

            {/* 3 High-Visibility Key Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-50/90 p-3.5 rounded-2xl border border-emerald-300">
                <span className="text-xs text-emerald-950 font-bold block">{t.batchCard.purityLabel}</span>
                <div className="text-2xl font-black font-mono text-emerald-900 mt-0.5">
                  {data.laboratory?.purity_score_pct || 99.1}%
                </div>
                <span className="text-[11px] text-emerald-800 font-semibold block mt-0.5">
                  ✓ {lang === 'mr' ? 'शून्य टक्के कृत्रिम साखर (C4 उत्तीर्ण)' : (lang === 'hi' ? 'शून्य प्रतिशत चाशनी (C4 उत्तीर्ण)' : '0.0% Added Sugar (C4 Passed)')}
                </span>
              </div>

              <div className="bg-amber-50/90 p-3.5 rounded-2xl border border-amber-300">
                <span className="text-xs text-amber-950 font-bold block">{t.batchCard.moistureLabel}</span>
                <div className="text-2xl font-black font-mono text-stone-900 mt-0.5">
                  {data.laboratory?.moisture_pct || 17.8}%
                </div>
                <span className="text-[11px] text-amber-900 font-semibold block mt-0.5">
                  ✓ {t.batchCard.moistureSub}
                </span>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-300">
                <span className="text-xs text-stone-800 font-bold block">{t.batchCard.fairPriceLabel}</span>
                <div className="text-2xl font-black font-mono text-emerald-800 mt-0.5">
                  ₹480 / kg
                </div>
                <span className="text-[11px] text-stone-700 font-semibold block mt-0.5">
                  ✓ {lang === 'mr' ? 'शेतकऱ्याला थेट बँक खात्यात पूर्ण मोबदला' : (lang === 'hi' ? 'किसान को सीधे बैंक खाते में भुगतान' : '100% Direct DBT to Beekeeper')}
                </span>
              </div>
            </div>

            {/* Humanized Beekeeper Profile (Customer Favorite) */}
            <div className="bg-stone-50/90 rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-3.5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  {t.batchCard.beekeeperSectionTitle}
                </span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  ✓ {t.batchCard.dbtVerified}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Beekeeper Photo */}
                <div className="w-18 h-18 rounded-2xl overflow-hidden shadow-xs border-2 border-amber-400 bg-stone-200 shrink-0 self-center sm:self-start">
                  <img
                    src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=300&q=80"
                    alt="Ramesh Tukaram Patil"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Farmer Details */}
                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-stone-900">
                        {data.origin?.beekeeper_name || 'Ramesh Tukaram Patil'}
                      </h3>
                      <span className="text-stone-600 font-mono text-xs font-medium">KVIC-MH-2024-8841</span>
                    </div>
                    <div className="bg-white px-2.5 py-1 rounded-xl border border-emerald-300 text-emerald-900 font-bold font-mono text-xs">
                      ₹480 / kg ({t.batchCard.directPay})
                    </div>
                  </div>

                  <p className="text-stone-800 leading-relaxed italic bg-white p-2.5 rounded-xl border border-stone-200 font-serif text-xs">
                    {lang === 'mr'
                      ? '"सह्याद्रीच्या रानातून काढलेला हा १००% अस्सल जांभूळ मध आहे. आम्ही मधाला कधीही तापवत नाही आणि साखर घालत नाही."'
                      : (lang === 'hi'
                        ? '"सह्याद्री के जंगलों से निकाला गया यह १००% शुद्ध जामुन शहद है। हम छत्ते को कभी गर्म नहीं करते और न ही कोई चाशनी मिलाते हैं।"'
                        : '"100% pure raw Jamun honey harvested in the Western Ghats. Cold-extracted without heat or synthetic syrups."')}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5">
                    <div className="bg-white p-2 rounded-xl border border-stone-200">
                      <span className="text-stone-600 text-[10px] block font-semibold">{t.batchCard.locationLabel}:</span>
                      <span className="font-bold text-stone-900">{data.origin?.apiary_location}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-stone-200">
                      <span className="text-stone-600 text-[10px] block font-semibold">{t.batchCard.hiveIdLabel}:</span>
                      <span className="font-mono font-bold text-stone-900">{data.origin?.hive_code}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-stone-200">
                      <span className="text-stone-600 text-[10px] block font-semibold">{t.batchCard.floralSourceLabel}:</span>
                      <span className="font-bold text-amber-950">Syzygium cumini (Wild Jamun)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple 4-Step Chain of Custody */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800 uppercase tracking-wider">
                  {t.timeline.title}
                </span>
                <span className="text-stone-600 font-mono text-xs">
                  {t.timeline.custodyBadge}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-mono">1</span>
                    <span className="truncate">{t.timeline.step1Title}</span>
                  </div>
                  <p className="text-[11px] text-stone-700 truncate">{data.origin?.beekeeper_name}</p>
                </div>

                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-mono">2</span>
                    <span className="truncate">{t.timeline.step2Title}</span>
                  </div>
                  <p className="text-[11px] text-stone-700 truncate">{data.collection?.measured_quantity || 48.5} kg</p>
                </div>

                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <span className="w-5 h-5 rounded-full bg-stone-800 text-white flex items-center justify-center text-[10px] font-mono">3</span>
                    <span className="truncate">{t.timeline.step3Title}</span>
                  </div>
                  <p className="text-[11px] text-stone-700 truncate">&lt;45°C Micro-mesh</p>
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-300 space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-mono">4</span>
                    <span className="truncate">{t.timeline.step4Title}</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 font-bold truncate">0.0% C4 (Passed)</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. INTERACTIVE 3D HONEY JAR MODEL (HIGH VISIBILITY STUDIO) */}
      <section id="honey-jar-3d-section">
        <HoneyJar3DViewer />
      </section>

      {/* 4. OPTIONAL KITCHEN PURITY SIMULATOR (CLEAN & COLLAPSIBLE) */}
      <section className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
              {t.puritySim.tag}
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
              {t.puritySim.title}
            </h3>
            <p className="text-xs text-stone-600">
              {t.puritySim.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowPuritySim(!showPuritySim)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs self-start sm:self-auto"
          >
            {showPuritySim 
              ? (lang === 'mr' ? 'सिम्युलेटर लपवा ✕' : (lang === 'hi' ? 'सिम्युलेटर छुपाएं ✕' : 'Hide Test ✕'))
              : (lang === 'mr' ? 'घरी चाचणी करा 🧪' : (lang === 'hi' ? 'घर पर परीक्षण देखें 🧪' : 'Try Kitchen Test 🧪'))}
          </button>
        </div>

        {showPuritySim && (
          <div className="pt-3 border-t border-stone-200 animate-in fade-in duration-200">
            <HouseholdPuritySimulator />
          </div>
        )}
      </section>

      {/* REAL CAMERA SCANNER MODAL */}
      <RealCameraScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(scannedCode) => {
          setPackageCode(scannedCode);
          handleSearch(scannedCode);
        }}
      />

      {/* OFFICIAL PRINTABLE CERTIFICATE MODAL */}
      {isCertificateOpen && data && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#FAF7F0] text-stone-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-4 border-amber-800/80 shadow-2xl space-y-6 my-8 print:border-none print:shadow-none print:p-0">
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-stone-300 pb-3 print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                {lang === 'mr' ? 'अधिकृत सरकारी शुद्धता प्रमाणपत्र' : (lang === 'hi' ? 'आधिकारिक सरकारी शुद्धता प्रमाण पत्र' : 'Official Government Purity Certificate')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" /> {lang === 'mr' ? 'प्रिंट / सेव्ह करा' : (lang === 'hi' ? 'प्रिंट / सहेजें' : 'Print / Save PDF')}
                </button>
                <button
                  onClick={() => setIsCertificateOpen(false)}
                  className="text-stone-500 hover:text-stone-900 text-lg font-bold px-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Certificate Document */}
            <div className="border-2 border-stone-400 p-6 rounded-2xl bg-white space-y-5 relative">
              <div className="text-center space-y-1 border-b border-stone-300 pb-4">
                <div className="text-xs font-bold tracking-widest uppercase text-stone-600">
                  सत्यमेव जयते • Government of India
                </div>
                <h2 className="text-lg font-serif font-black tracking-tight text-stone-900">
                  {lang === 'mr' ? 'राष्ट्रीय मध मंडळ आणि अन्न सुरक्षा व मानके प्राधिकरण (FSSAI)' : (lang === 'hi' ? 'राष्ट्रीय मधुमक्खी बोर्ड एवं भारतीय खाद्य सुरक्षा मानक प्राधिकरण (FSSAI)' : 'NATIONAL BEE BOARD & FOOD SAFETY AND STANDARDS AUTHORITY OF INDIA')}
                </h2>
                <div className="text-[11px] font-semibold text-amber-900">
                  {lang === 'mr' ? 'राष्ट्रीय मध मोहीम • वनस्पती मूळ शुद्धता आणि ब्लॉकचेन प्रमाणपत्र' : (lang === 'hi' ? 'राष्ट्रीय मधुमक्खी मिशन • वानस्पतिक शुद्धता एवं ब्लॉकचेन प्रमाण पत्र' : 'National Honey Mission • Certificate of Botanical Purity & Blockchain Provenance')}
                </div>
                <div className="text-[10px] font-mono text-stone-500">
                  Certificate Ref: HC/NABL/2026/MAHA-042 • Issue Date: {data.harvest?.harvest_date}
                </div>
              </div>

              <div className="text-xs leading-relaxed space-y-2 text-stone-800">
                <p>
                  {lang === 'mr' 
                    ? <>याद्वारे प्रमाणित करण्यात येते की रिटेल बॅच <strong>{data.package.package_code}</strong> (उत्पादन: <em>{data.package.product_name}</em>) ज्याची काढणी नोंदणीकृत शेतकरी <strong>{data.origin?.beekeeper_name}</strong> यांनी <strong>{data.origin?.apiary_name}, {data.origin?.apiary_location}</strong> येथे केली आहे, त्याची NABL रासायनिक चाचणी व पडताळणी यशस्वीपणे पूर्ण झाली आहे.</>
                    : (lang === 'hi'
                      ? <>प्रमाणित किया जाता है कि रिटेल बैच <strong>{data.package.package_code}</strong> (उत्पाद: <em>{data.package.product_name}</em>) जिसे पंजीकृत किसान <strong>{data.origin?.beekeeper_name}</strong> ने <strong>{data.origin?.apiary_name}, {data.origin?.apiary_location}</strong> में निकाला है, की NABL प्रयोगशाला जांच सफलतापूर्वक पूर्ण हुई है।</>
                      : <>This is to certify that retail batch <strong>{data.package.package_code}</strong> (Product: <em>{data.package.product_name}</em>) harvested by registered beekeeper <strong>{data.origin?.beekeeper_name}</strong> at <strong>{data.origin?.apiary_name}, {data.origin?.apiary_location}</strong> has undergone mandatory laboratory chemical profiling and physical mass-balance verification.</>)}
                </p>
              </div>

              {/* Lab Results Table */}
              <table className="w-full text-xs text-left border-collapse border border-stone-300">
                <thead>
                  <tr className="bg-stone-100 font-bold text-stone-800">
                    <th className="p-2 border border-stone-300">{lang === 'mr' ? 'गुणवत्ता निकष' : (lang === 'hi' ? 'गुणवत्ता मानक' : 'Quality Parameter')}</th>
                    <th className="p-2 border border-stone-300">{lang === 'mr' ? 'FSSAI प्रमाण' : (lang === 'hi' ? 'FSSAI मानक' : 'FSSAI Standard')}</th>
                    <th className="p-2 border border-stone-300">{lang === 'mr' ? 'आढळलेले मूल्य' : (lang === 'hi' ? 'परीक्षित मान' : 'Observed Value')}</th>
                    <th className="p-2 border border-stone-300">{lang === 'mr' ? 'निकाल' : (lang === 'hi' ? 'परिणाम' : 'Result')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-300">
                  <tr>
                    <td className="p-2 border border-stone-300 font-semibold">{lang === 'mr' ? 'ओलावा (Moisture)' : (lang === 'hi' ? 'नमी की मात्रा' : 'Moisture Content')}</td>
                    <td className="p-2 border border-stone-300">Max 20.0%</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">{data.laboratory?.moisture_pct || 17.8}%</td>
                    <td className="p-2 border border-stone-300 text-emerald-800 font-bold">{lang === 'mr' ? 'उत्तीर्ण' : (lang === 'hi' ? 'उत्तीर्ण' : 'COMPLIANT')}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-stone-300 font-semibold">{lang === 'mr' ? 'F/G गुणोत्तर (फ्रुक्टोज/ग्लुकोज)' : (lang === 'hi' ? 'F/G अनुपात (फ्रुक्टोज़/ग्लूकोज)' : 'F/G Ratio (Fructose/Glucose)')}</td>
                    <td className="p-2 border border-stone-300">Min 1.0</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">1.22</td>
                    <td className="p-2 border border-stone-300 text-emerald-800 font-bold">{lang === 'mr' ? 'उत्तीर्ण' : (lang === 'hi' ? 'उत्तीर्ण' : 'COMPLIANT')}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-stone-300 font-semibold">Hydroxymethylfurfural (HMF)</td>
                    <td className="p-2 border border-stone-300">Max 40 mg/kg</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">14.2 mg/kg</td>
                    <td className="p-2 border border-stone-300 text-emerald-800 font-bold">{lang === 'mr' ? 'शीत प्रक्रिया (कच्चा मध)' : (lang === 'hi' ? 'कच्चा शहद (शीत निष्कर्षित)' : 'RAW / UNHEATED')}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-stone-300 font-semibold">EA-IRMS C4 Sugar Isotope</td>
                    <td className="p-2 border border-stone-300">Negative</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">&lt; -23.5‰ δ13C</td>
                    <td className="p-2 border border-stone-300 text-emerald-800 font-bold">{lang === 'mr' ? 'शून्य साखर पाक भेसळ' : (lang === 'hi' ? 'शून्य चीनी चाशनी' : 'ZERO CORN/CANE SYRUP')}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-4 flex items-center justify-between border-t border-stone-300 text-xs">
                <div>
                  <div className="w-16 h-16 rounded-full border-2 border-amber-600 flex items-center justify-center text-center p-1 text-[9px] font-bold text-amber-800 uppercase leading-tight">
                    Agmark Special Grade
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-serif italic font-bold text-stone-900 text-sm">
                    Dr. Sunita Kulkarni
                  </div>
                  <div className="text-[10px] text-stone-600">
                    {lang === 'mr' 
                      ? 'मुख्य अन्न विश्लेषक व रासायनिक परीक्षक, NABL मान्यताप्राप्त प्रयोगशाळा, पुणे'
                      : (lang === 'hi'
                        ? 'मुख्य खाद्य विश्लेषक एवं रासायनिक परीक्षक, NABL प्रमाणित प्रयोगशाला, पुणे'
                        : 'Chief Food Analyst & Chemical Examiner, NABL Accredited Quality Testing Laboratory, Pune')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Login Modal */}
      <CustomerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onScanRedirect={() => setIsScannerOpen(true)}
      />
    </div>
  );
};
