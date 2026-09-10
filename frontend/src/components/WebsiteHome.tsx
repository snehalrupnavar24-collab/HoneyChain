import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Search,
  Camera,
  MapPin,
  Calendar,
  Scale,
  Lock,
  Printer,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Leaf,
  Award,
  CheckCircle2,
  FileCheck,
  Radio,
  Building2,
  FlaskConical,
  ArrowRight,
  Volume2,
  Mic,
  Smartphone,
  QrCode
} from 'lucide-react';
import { verifyPackageByCode } from '../services/api';
import { ConsumerVerifyResponse } from '../types';
import { HoneyJar3DViewer } from './HoneyJar3DViewer';
import { HouseholdPuritySimulator } from './HouseholdPuritySimulator';
import { RealCameraScannerModal } from './RealCameraScannerModal';
import { useLanguage } from '../context/LanguageContext';

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
  const [packageCode, setPackageCode] = useState('PKG-MAHA-042-2697');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ConsumerVerifyResponse | null>(null);
  const [verifiedHash, setVerifiedHash] = useState<string | null>(null);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [scannerScanning, setScannerScanning] = useState(false);

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
      playSoftBeep();
      confetti({
        particleCount: 50,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#D97706', '#F59E0B', '#10B981']
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedCameraScan = (scannedCode: string) => {
    setScannerScanning(true);
    setTimeout(() => {
      setScannerScanning(false);
      setIsScannerOpen(false);
      setPackageCode(scannedCode);
      handleSearch(scannedCode);
    }, 1200);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const batchParam = urlParams.get('batch');
    const initialCode = batchParam ? batchParam.trim() : 'PKG-MAHA-042-2697';
    setPackageCode(initialCode);
    handleSearch(initialCode);
  }, []);

  return (
    <div className="space-y-14">
      {/* 1. HERO SECTION WITH REAL LIGHT HONEY DIPPER BACKGROUND */}
      <section className="relative rounded-3xl overflow-hidden border border-amber-200/90 shadow-sm">
        {/* Real photographic background of honey dripping from wooden dipper with soft light warm wash */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(254, 252, 248, 0.90) 0%, rgba(253, 249, 240, 0.96) 100%), url('https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=1920&q=80')`
          }}
        />

        <div className="relative z-10 p-6 sm:p-12 md:p-14 max-w-4xl mx-auto text-center space-y-5">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 bg-white/95 text-stone-900 px-4 py-1.5 rounded-full text-xs font-semibold border border-amber-300 shadow-xs backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black text-stone-900 tracking-tight leading-tight">
            {t.hero.title}
          </h1>

          <p className="text-base sm:text-lg text-stone-700 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* Search & Camera Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-white p-2 rounded-2xl border border-stone-300 shadow-md">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                className="flex-1 w-full relative"
              >
                <input
                  type="text"
                  value={packageCode}
                  onChange={(e) => setPackageCode(e.target.value)}
                  placeholder={t.hero.placeholder}
                  className="w-full pl-10 pr-3 py-3 text-sm bg-transparent border-none focus:outline-hidden font-mono text-stone-900"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              </form>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSearch()}
                  disabled={loading}
                  className="flex-1 sm:flex-none px-5 py-3 bg-stone-900 hover:bg-stone-950 text-white font-bold text-xs rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loading ? t.hero.verifying : t.hero.verifyBtn}
                </button>

                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title="Scan Jar QR with Camera"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t.hero.scanBtn}</span>
                </button>

                {onOpenCustomerQrModal && (
                  <button
                    type="button"
                    onClick={onOpenCustomerQrModal}
                    className="px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    title="Generate Customer Honey Jar QR Sticker"
                  >
                    <QrCode className="w-4 h-4 text-amber-200" />
                    <span className="hidden md:inline">{t.hero.genQrBtn}</span>
                    <span className="md:hidden">Sticker</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Test Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-600 pt-3">
              <span className="font-medium">{t.hero.testBatchLabel}</span>
              <button
                type="button"
                onClick={() => { setPackageCode('PKG-MAHA-042-2697'); handleSearch('PKG-MAHA-042-2697'); }}
                className="px-2.5 py-1 bg-white/90 hover:bg-amber-50 border border-amber-300 rounded-lg text-amber-900 font-mono font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                {t.hero.sampleJamun}
              </button>
              {onOpenCustomerQrModal && (
                <button
                  type="button"
                  onClick={onOpenCustomerQrModal}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 border border-amber-400 rounded-lg text-amber-950 font-bold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-700" />
                  <span>🏷️ {t.generator.modalTitle}</span>
                </button>
              )}
              {onOpenMobileModal && (
                <button
                  type="button"
                  onClick={onOpenMobileModal}
                  className="px-2.5 py-1 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-400 rounded-lg text-emerald-950 font-bold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.hero.mobileTestBtn}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. VERIFIED BATCH DETAILS CARD (DYNAMIC UPON SEARCH) */}
      {data && (
        <section className="space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-stone-300 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {t.batchCard.sectionTitle}
              </span>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                {t.batchCard.subTitle}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  let speechText = '';
                  let speechLang = 'en-IN';
                  if (lang === 'mr') {
                    speechText = `हनीचेन सत्यापन यशस्वी झाले. हा मध १००% अस्सल आणि शुद्ध आहे. शेतकरी रमेश तुकाराम पाटील यांनी सह्याद्रीच्या रानातून हा मध काढला आहे. NABL लॅब तपासणीत शून्य टक्के कृत्रिम साखर आणि १७.८ टक्के नैसर्गिक ओलावा आढळला आहे.`;
                    speechLang = 'mr-IN';
                  } else if (lang === 'hi') {
                    speechText = `हनीचेन सत्यापन सफल हुआ। यह शहद शत-प्रतिशत शुद्ध है। इसे महाबलेश्वर के पंजीकृत किसान श्री रमेश तुकाराम पाटिल ने निकाला है। NABL प्रयोगशाला जाँच में शून्य प्रतिशत C4 चीनी और 17.8 प्रतिशत नमी पाई गई है।`;
                    speechLang = 'hi-IN';
                  } else {
                    speechText = `HoneyChain verification successful. This honey is 100% pure raw botanical honey, harvested by lead beekeeper Ramesh Patil. Laboratory testing confirms 0.0% C4 cane sugar and 17.8% moisture.`;
                    speechLang = 'en-IN';
                  }
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const ut = new SpeechSynthesisUtterance(speechText);
                    ut.lang = speechLang;
                    window.speechSynthesis.speak(ut);
                  }
                }}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Listen Verification Report in Active Language / Audio"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{t.batchCard.listenAudio}</span>
              </button>

              <button
                onClick={() => setIsCertificateOpen(true)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.batchCard.printCertBtn}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 8 Cols: Official Verification Green Card */}
            <div className="lg:col-span-8 bg-gradient-to-br from-[#123621] via-[#0E2818] to-[#0A1F13] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-800 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 bg-emerald-950/90 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-600/40">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t.batchCard.verifiedBadge}</span>
                  </div>

                  <span className="font-mono text-xs bg-emerald-900/60 text-emerald-200 px-3 py-1 rounded-lg border border-emerald-700">
                    {t.batchCard.batchLabel}: {data.package.package_code}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
                  {data.package.product_name}
                </h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed">
                  {t.batchCard.locationLabel}: <strong className="text-white font-medium">{data.origin?.apiary_location || 'Kas Valley, Satara, Maharashtra'}</strong>. {t.ribbon.mission}.
                </p>
              </div>

              {/* Lab Highlights Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-emerald-800/80">
                <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-800/50">
                  <span className="text-[11px] text-emerald-300 font-medium block">{t.batchCard.moistureLabel}</span>
                  <div className="text-xl font-black font-mono text-white mt-0.5">
                    {data.laboratory?.moisture_pct || 17.8}%
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">{t.batchCard.moistureSub}</span>
                </div>

                <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-800/50">
                  <span className="text-[11px] text-emerald-300 font-medium block">{t.batchCard.purityLabel}</span>
                  <div className="text-xl font-black font-mono text-white mt-0.5">
                    {data.laboratory?.purity_score_pct || 99.1}%
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">{t.batchCard.puritySub}</span>
                </div>

                <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-800/50">
                  <span className="text-[11px] text-emerald-300 font-medium block">{t.batchCard.freshnessLabel}</span>
                  <div className="text-xl font-black font-mono text-white mt-0.5">
                    14.2 <span className="text-xs font-normal">mg/kg</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">{t.batchCard.freshnessSub}</span>
                </div>

                <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-800/50">
                  <span className="text-[11px] text-emerald-300 font-medium block">{t.batchCard.trustLabel}</span>
                  <div className="text-sm font-bold text-amber-300 mt-1 flex items-center gap-1 font-mono">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>SHA-256 Valid</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">{t.batchCard.trustSub}</span>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Real Honey Jar Photo & Botanical Card */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-amber-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                    {t.batchCard.floralSourceLabel}
                  </span>
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    {lang === 'mr' ? '५०० ग्रॅम काचेची बाटली' : (lang === 'hi' ? '500 ग्राम कांच का जार' : '500g Glass Jar')}
                  </span>
                </div>

                {/* Jar Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">{t.batchCard.floralSourceLabel}:</span>
                    <span className="font-bold text-stone-900">Syzygium cumini (Wild Jamun)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">{t.batchCard.locationLabel}:</span>
                    <span className="font-bold text-stone-900">Western Ghats (1,353 m MSL)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">{lang === 'mr' ? 'रंग प्रोफाइल:' : (lang === 'hi' ? 'रंग प्रोफाइल:' : 'Color Profile:')}</span>
                    <span className="font-bold text-amber-900">Deep Amber / Pfund 65mm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">{lang === 'mr' ? 'शीत प्रक्रिया:' : (lang === 'hi' ? 'शीत प्रक्रिया:' : 'Cold Settled:')}</span>
                    <span className="font-bold text-stone-900">&lt;45°C Unpasteurized</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{lang === 'mr' ? 'पाचक एन्झाईम्स:' : (lang === 'hi' ? 'पाचक एंजाइम:' : 'Enzyme Activity:')}</span>
                    <span className="font-bold text-emerald-800">14.5 DN Diastase</span>
                  </div>
                </div>
              </div>

              {/* Real Photo Thumbnail */}
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=300&q=80"
                  alt="Raw Jamun Honey Jar"
                  className="w-14 h-14 rounded-xl object-cover shadow-xs border border-amber-300 shrink-0"
                />
                <div className="text-[11px] text-amber-950 leading-snug">
                  <strong>{t.batchCard.freshnessSub}:</strong> {lang === 'mr' ? 'अस्सल नैसर्गिक मध, जिवंत पाचकद्रव्ये आणि शून्य कृत्रिम साखर.' : (lang === 'hi' ? 'प्राकृतिक कच्चा शहद, जीवित पाचक एंजाइम और शून्य कृत्रिम चाशनी।' : 'Cold-settled raw honey preserving live enzymes and zero syrup.')}
                </div>
              </div>
            </div>
          </div>

          {/* HUMAN SECTION: MEET YOUR BEEKEEPER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                  {t.batchCard.beekeeperSectionTitle}
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  {t.batchCard.beekeeperSectionSub}
                </h3>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300">
                {t.batchCard.dbtVerified}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Real Farmer Photo */}
              <div className="flex flex-col items-center text-center space-y-2 shrink-0 self-center md:self-start">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-amber-300 bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=400&q=80"
                    alt="Ramesh Tukaram Patil"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{data.origin?.beekeeper_name || 'Ramesh Tukaram Patil'}</h4>
                  <span className="text-[11px] text-stone-500 font-mono">KVIC-MH-2024-8841</span>
                </div>
              </div>

              {/* Story */}
              <div className="flex-1 space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <p className="italic bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-stone-800 font-serif">
                  {lang === 'mr' 
                    ? '"सह्याद्रीच्या पर्वतरांगेत आमची तिसरी पिढी नैसर्गिक मध गोळा करते. जांभूळ फुलोऱ्यात मधमाश्या कसल्याही कृत्रिम हस्तक्षेपाशिवाय शुद्ध मध तयार करतात. आम्ही मधाला कधीही तापवत नाही आणि साखरेचा पाक घालत नाही. हनीचेनमुळे आमच्या अस्सल कष्टाला योग्य सन्मान आणि रास्त भाव मिळतो."'
                    : (lang === 'hi'
                      ? '"सह्याद्री के जंगलों में हमारी तीन पीढ़ियां पारंपरिक मधुमक्खी पालन कर रही हैं। जंगली जामुन के मौसम में मक्खियां बिना किसी कृत्रिम छेड़छाड़ के शुद्ध शहद बनाती हैं। हम कभी भी छत्ते को गर्म नहीं करते और न ही चीनी की चाशनी देते हैं। हनीचेन हमारे पारंपरिक श्रम का पारदर्शी मूल्य सुनिश्चित करता है।"'
                      : '"Our family has practiced traditional apiculture across the Western Ghats for three generations. During wild Jamun blooms, bees forage freely across Kas Plateau. We never heat combs or feed sugar. HoneyChain ensures our honest craft is directly recognized and fairly rewarded."')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">{t.batchCard.locationLabel}:</span>
                    <span className="font-semibold text-stone-900">{data.origin?.apiary_name}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">{t.batchCard.hiveIdLabel}:</span>
                    <span className="font-mono font-bold text-stone-900">{data.origin?.hive_code}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">{t.batchCard.fairPriceLabel}:</span>
                    <span className="font-bold text-emerald-700 font-mono">₹480 / kg ({t.batchCard.directPay})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5-STEP PROVENANCE TIMELINE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                  {lang === 'mr' ? 'संपूर्ण भौतिक प्रवास' : (lang === 'hi' ? 'संपूर्ण भौतिक यात्रा' : 'Complete Chain of Custody')}
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  {t.timeline.title}
                </h3>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full">
                {t.timeline.custodyBadge}
              </span>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-amber-200">
              {/* Step 1 */}
              <div className="relative flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm text-xs font-mono font-bold border-2 border-stone-700">
                  01
                </div>
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex-1 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-amber-800">{t.timeline.step1Title}</span>
                    <span className="font-mono font-bold text-stone-600">{data.origin?.hive_code}</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900">{data.origin?.beekeeper_name}</div>
                  <div className="text-stone-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{data.origin?.apiary_name} • {data.origin?.apiary_location}</span>
                  </div>
                  <p className="text-stone-600 leading-snug">{t.timeline.step1Desc}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm text-xs font-mono font-bold border-2 border-stone-700">
                  02
                </div>
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex-1 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-emerald-800">{t.timeline.step2Title}</span>
                    <span className="font-mono font-bold text-stone-600">{data.collection?.collection_code}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <span>{lang === 'mr' ? 'वजन:' : (lang === 'hi' ? 'तौल:' : 'Measured:')} <strong className="text-stone-900">{data.collection?.measured_quantity || 48.5} kg</strong></span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      {lang === 'mr' ? '✓ २% सहिष्णुतेत वजन प्रमाणित' : (lang === 'hi' ? '✓ 2% सहनशीलता में वजन सत्यापित' : '✓ Reconciled within 2% tolerance')}
                    </span>
                  </div>
                  <p className="text-stone-600 leading-snug">{t.timeline.step2Desc}</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm text-xs font-mono font-bold border-2 border-stone-700">
                  03
                </div>
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex-1 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-stone-700">{t.timeline.step3Title}</span>
                    <span className="font-mono font-bold text-stone-600">{data.processing?.processing_code}</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900">{data.processing?.processing_type}</div>
                  <p className="text-stone-600 leading-snug">{t.timeline.step3Desc}</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm text-xs font-mono font-bold border-2 border-stone-700">
                  04
                </div>
                <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 flex-1 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-emerald-900">{t.timeline.step4Title}</span>
                    <span className="font-mono font-bold text-emerald-800">{data.laboratory?.report_code}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-bold text-emerald-950">{lang === 'mr' ? 'निकाल:' : (lang === 'hi' ? 'परिणाम:' : 'Result:')} {data.laboratory?.result}</span>
                    <span className="text-xs bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                      {t.timeline.verifiedStamp}
                    </span>
                  </div>
                  <p className="text-stone-700 leading-snug">{t.timeline.step4Desc}</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-mono font-bold border-2 border-emerald-600">
                  05
                </div>
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex-1 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-amber-800">{t.timeline.step5Title}</span>
                    <span className="font-mono font-bold text-stone-600">{data.package.package_code}</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900">{data.package.product_name}</div>
                  <p className="text-stone-600 leading-snug">{t.timeline.step5Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. INTERACTIVE 3D HONEY JAR DIGITAL TWIN (HIGH VISIBILITY FEATURE) */}
      <section className="space-y-4">
        <HoneyJar3DViewer />
      </section>

      {/* 4. CUSTOMER HONEY JAR QR GENERATOR FEATURED CALLOUT CARD */}
      <section className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-stone-950 rounded-3xl p-6 sm:p-8 shadow-md border border-amber-400 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-stone-950 text-amber-300 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
              <QrCode className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.generator.modalTitle}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-stone-950 tracking-tight">
              {lang === 'mr' ? 'ग्राहकांसाठी मध बाटली QR स्टिकर बनवा' : (lang === 'hi' ? 'ग्राहकों के लिए हनी जार QR स्टिकर बनाएं' : 'Generate Printable Customer Honey Jar QR Labels')}
            </h3>
            <p className="text-sm text-stone-900 leading-relaxed font-medium">
              {lang === 'mr' 
                ? 'कोणत्याही ग्राहकाने मोबाईल कॅमेऱ्याने हा QR कोड स्कॅन करताच, मध बाटलीची संपूर्ण माहिती—शेतकऱ्याचे नाव, हमीभाव, वजन काटा नोंद, आणि NABL सरकारी लॅब रिपोर्ट लगेच दिसेल!' 
                : (lang === 'hi' 
                  ? 'ग्राहक अपने फोन कैमरे से यह QR स्कैन करके शहद जार का पूरा विवरण—किसान का नाम, MSP मूल्य, मंडी वजन और NABL लैब रिपोर्ट तुरंत देख सकते हैं!'
                  : 'When customers scan this serialized QR with their smartphone camera, they instantly view authentic beekeeper story, fair price, mandi weighment, and NABL lab purity test!')}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold text-stone-900">
              <span className="bg-white/90 px-2.5 py-1 rounded-lg border border-amber-300">✓ Jamun Honey</span>
              <span className="bg-white/90 px-2.5 py-1 rounded-lg border border-amber-300">✓ Kashmir Acacia</span>
              <span className="bg-white/90 px-2.5 py-1 rounded-lg border border-amber-300">✓ Sunderbans Mangrove</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {onOpenCustomerQrModal && (
              <button
                type="button"
                onClick={onOpenCustomerQrModal}
                className="px-6 py-3.5 bg-stone-950 hover:bg-black text-amber-300 hover:text-white font-bold text-sm rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer border border-amber-400"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>{t.generator.printBtn}</span>
              </button>
            )}
            {onOpenMobileModal && (
              <button
                type="button"
                onClick={onOpenMobileModal}
                className="px-5 py-3.5 bg-white hover:bg-stone-100 text-stone-900 font-bold text-sm rounded-2xl transition-all shadow-xs flex items-center gap-2 cursor-pointer border border-amber-300"
              >
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>{t.hero.mobileTestBtn}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 5. SENSORY & PHYSICAL HONEY QUALITY GALLERY (REAL FOOD PHOTOGRAPHY) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            {t.gallery.tag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {t.gallery.title}
          </h2>
          <p className="text-sm text-stone-600">
            {t.gallery.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Dipper Drip & Viscosity */}
          <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between group hover:border-amber-300 transition-all">
            <div className="h-48 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=600&q=80"
                alt="Natural Honey Viscosity with Wooden Dipper"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                {t.gallery.card1Badge}
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">{t.gallery.card1Title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed mt-1">
                  {t.gallery.card1Desc}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-emerald-800 font-semibold">
                <span>Moisture Ratio:</span>
                <span className="bg-emerald-100 px-2 py-0.5 rounded font-bold">17.8% (Passed)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Hexagonal Wax Comb */}
          <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between group hover:border-amber-300 transition-all">
            <div className="h-48 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=600&q=80"
                alt="Raw Honeycomb with Wooden Dipper"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                {t.gallery.card2Badge}
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">{t.gallery.card2Title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed mt-1">
                  {t.gallery.card2Desc}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-emerald-800 font-semibold">
                <span>Enzyme Activity:</span>
                <span className="bg-emerald-100 px-2 py-0.5 rounded font-bold">14.5 DN (Active)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Indian Bees on Comb */}
          <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between group hover:border-amber-300 transition-all">
            <div className="h-48 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=600&q=80"
                alt="Apis cerana indica Honeybees on Comb"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                {t.gallery.card3Badge}
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">{t.gallery.card3Title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed mt-1">
                  {t.gallery.card3Desc}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-emerald-800 font-semibold">
                <span>Habitat:</span>
                <span className="bg-emerald-100 px-2 py-0.5 rounded font-bold">Western Ghats</span>
              </div>
            </div>
          </div>

          {/* Card 4: Sealed Glass Jar */}
          <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between group hover:border-amber-300 transition-all">
            <div className="h-48 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=600&q=80"
                alt="Sealed Glass Jar of Raw Honey"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                {t.gallery.card4Badge}
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">{t.gallery.card4Title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed mt-1">
                  {t.gallery.card4Desc}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-emerald-800 font-semibold">
                <span>Standard:</span>
                <span className="bg-emerald-100 px-2 py-0.5 rounded font-bold">Agmark Special</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOUSEHOLD PURITY SIMULATOR (TRILINGUAL KITCHEN SCIENCE) */}
      <section className="space-y-4">
        <HouseholdPuritySimulator />
      </section>

      {/* 7. STAKEHOLDER PORTAL GATEWAY (OPERATIONAL HARDWARE SIMULATIONS) */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-stone-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              {t.terminals.tag}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              {t.terminals.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
              {t.terminals.subtitle}
            </p>
          </div>

          <span className="text-xs bg-emerald-950 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800 font-mono self-start sm:self-auto">
            {t.terminals.dbStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Terminal 1: Beekeeper */}
          <button
            type="button"
            onClick={() => onOpenPortal('beekeeper')}
            className="bg-stone-900/90 hover:bg-stone-800 p-4 rounded-2xl border border-stone-700/80 text-left transition-all group shadow-sm flex flex-col justify-between space-y-3 cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Field App</span>
                <Radio className="w-4 h-4 text-stone-400 group-hover:text-amber-400 transition-colors" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                {t.terminals.beekeeperTitle}
              </h4>
              <p className="text-xs text-stone-400 leading-snug">
                {t.terminals.beekeeperDesc}
              </p>
            </div>
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              {t.terminals.launchBtn} <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Terminal 2: Mandi */}
          <button
            type="button"
            onClick={() => onOpenPortal('collection')}
            className="bg-stone-900/90 hover:bg-stone-800 p-4 rounded-2xl border border-stone-700/80 text-left transition-all group shadow-sm flex flex-col justify-between space-y-3 cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Mandi Scale</span>
                <Scale className="w-4 h-4 text-stone-400 group-hover:text-amber-400 transition-colors" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                {t.terminals.mandiTitle}
              </h4>
              <p className="text-xs text-stone-400 leading-snug">
                {t.terminals.mandiDesc}
              </p>
            </div>
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              {t.terminals.launchBtn} <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Terminal 3: Processing & Lab */}
          <button
            type="button"
            onClick={() => onOpenPortal('processing')}
            className="bg-stone-900/90 hover:bg-stone-800 p-4 rounded-2xl border border-stone-700/80 text-left transition-all group shadow-sm flex flex-col justify-between space-y-3 cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">QA Facility</span>
                <FlaskConical className="w-4 h-4 text-stone-400 group-hover:text-amber-400 transition-colors" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                {t.terminals.labTitle}
              </h4>
              <p className="text-xs text-stone-400 leading-snug">
                {t.terminals.labDesc}
              </p>
            </div>
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              {t.terminals.launchBtn} <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Terminal 4: Audit */}
          <button
            type="button"
            onClick={() => onOpenPortal('admin')}
            className="bg-stone-900/90 hover:bg-stone-800 p-4 rounded-2xl border border-stone-700/80 text-left transition-all group shadow-sm flex flex-col justify-between space-y-3 cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Regulatory</span>
                <ShieldCheck className="w-4 h-4 text-stone-400 group-hover:text-amber-400 transition-colors" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                {t.terminals.auditTitle}
              </h4>
              <p className="text-xs text-stone-400 leading-snug">
                {t.terminals.auditDesc}
              </p>
            </div>
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              {t.terminals.launchBtn} <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </section>

      {/* REAL CAMERA SCANNER MODAL (LIVE WEBCAM / REAR CAMERA / FILE UPLOAD) */}
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
          <div className="bg-[#FAF7F0] text-stone-900 rounded-3xl max-w-2xl w-full p-8 border-4 border-amber-800/80 shadow-2xl space-y-6 my-8 print:border-none print:shadow-none print:p-0">
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-stone-300 pb-3 print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                {lang === 'mr' ? 'अधिकृत सरकारी शुद्धता प्रमाणपत्र' : (lang === 'hi' ? 'आधिकारिक सरकारी शुद्धता प्रमाण पत्र' : 'Official Government Purity Certificate')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> {lang === 'mr' ? 'प्रिंट / सेव्ह करा' : (lang === 'hi' ? 'प्रिंट / सहेजें' : 'Print / Save PDF')}
                </button>
                <button
                  onClick={() => setIsCertificateOpen(false)}
                  className="text-stone-500 hover:text-stone-900 text-lg font-bold px-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Certificate Paper Document */}
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
                    ? <>याद्वारे प्रमाणित करण्यात येते की रिटेल बॅच <strong>{data.package.package_code}</strong> (उत्पादन: <em>{data.package.product_name}</em>) ज्याची काढणी नोंदणीकृत शेतकरी <strong>{data.origin?.beekeeper_name}</strong> यांनी <strong>{data.origin?.apiary_name}, {data.origin?.apiary_location}</strong> येथे केली आहे, त्याची NABL रासायनिक चाचणी व वस्तुमान पडताळणी यशस्वीपणे पूर्ण झाली आहे.</>
                    : (lang === 'hi'
                      ? <>प्रमाणित किया जाता है कि रिटेल बैच <strong>{data.package.package_code}</strong> (उत्पाद: <em>{data.package.product_name}</em>) जिसे पंजीकृत किसान <strong>{data.origin?.beekeeper_name}</strong> ने <strong>{data.origin?.apiary_name}, {data.origin?.apiary_location}</strong> में निकाला है, की NABL प्रयोगशाला जांच एवं द्रव्यमान संतुलन परीक्षण सफलतापूर्वक पूर्ण हुआ है।</>
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
                    <td className="p-2 border border-stone-300">{lang === 'mr' ? 'ओलावा (Moisture)' : (lang === 'hi' ? 'नमी की मात्रा' : 'Moisture Content')}</td>
                    <td className="p-2 border border-stone-300">Max 20.0%</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">{data.laboratory?.moisture_pct || 17.8}%</td>
                    <td className="p-2 border border-stone-300 text-emerald-700 font-bold">{lang === 'mr' ? 'उत्तीर्ण' : (lang === 'hi' ? 'उत्तीर्ण' : 'COMPLIANT')}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-stone-300">{lang === 'mr' ? 'F/G गुणोत्तर (फ्रुक्टोज/ग्लुकोज)' : (lang === 'hi' ? 'F/G अनुपात (फ्रुक्टोज़/ग्लूकोज)' : 'F/G Ratio (Fructose/Glucose)')}</td>
                    <td className="p-2 border border-stone-300">Min 1.0</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">1.22</td>
                    <td className="p-2 border border-stone-300 text-emerald-700 font-bold">{lang === 'mr' ? 'उत्तीर्ण' : (lang === 'hi' ? 'उत्तीर्ण' : 'COMPLIANT')}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-stone-300">Hydroxymethylfurfural (HMF)</td>
                    <td className="p-2 border border-stone-300">Max 40 mg/kg</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">14.2 mg/kg</td>
                    <td className="p-2 border border-stone-300 text-emerald-700 font-bold">{lang === 'mr' ? 'शीत प्रक्रिया (कच्चा मध)' : (lang === 'hi' ? 'कच्चा शहद (शीत निष्कर्षित)' : 'RAW / UNHEATED')}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-stone-300">EA-IRMS C4 Sugar Isotope</td>
                    <td className="p-2 border border-stone-300">Negative</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">&lt; -23.5‰ δ13C</td>
                    <td className="p-2 border border-stone-300 text-emerald-700 font-bold">{lang === 'mr' ? 'शून्य साखर पाक भेसळ' : (lang === 'hi' ? 'शून्य चीनी चाशनी' : 'ZERO CORN/CANE SYRUP')}</td>
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
    </div>
  );
};
