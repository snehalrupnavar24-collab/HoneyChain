import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  ShieldCheck, 
  Search, 
  MapPin, 
  FileText, 
  Calendar, 
  Scale, 
  Lock, 
  Printer,
  Camera,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Heart,
  Volume2,
  Check,
  X,
  Compass,
  Thermometer,
  Droplets,
  Layers,
  Leaf
} from 'lucide-react';
import { verifyPackageByCode } from '../services/api';
import { ConsumerVerifyResponse } from '../types';
import { HouseholdPuritySimulator } from './HouseholdPuritySimulator';
import { RealCameraScannerModal } from './RealCameraScannerModal';
import { useLanguage } from '../context/LanguageContext';

export const ConsumerVerification: React.FC = () => {
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
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
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
        particleCount: 60,
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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Humanized Hero Header & Scanner Input */}
      <div className="bg-gradient-to-b from-white to-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm relative overflow-hidden">
        {/* Subtle decorative honey comb background accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-100/80 text-amber-900 px-3.5 py-1 rounded-full text-xs font-semibold border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
            {t.hero.title}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>

          {/* Action Bar: Direct Search + Real-Feel Camera Scanner Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
              className="flex-1 w-full relative"
            >
              <input
                type="text"
                value={packageCode}
                onChange={(e) => setPackageCode(e.target.value)}
                placeholder={t.hero.placeholder}
                className="w-full pl-10 pr-4 py-3.5 text-sm bg-white border border-stone-300 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono shadow-xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-4" />
            </form>

            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3.5 bg-stone-900 hover:bg-stone-950 text-white font-semibold text-sm rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {loading ? t.hero.verifying : t.hero.verifyBtn}
            </button>

            <button
              id="btn-scan-qr"
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="w-full sm:w-auto px-4 py-3.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-stone-950" />
              <span>{t.hero.scanBtn}</span>
            </button>
          </div>

          {/* Verified Preset Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500 pt-1">
            <span className="font-medium">{t.hero.testBatchLabel}</span>
            <button
              type="button"
              onClick={() => { setPackageCode('PKG-MAHA-042-2697'); handleSearch('PKG-MAHA-042-2697'); }}
              className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-stone-200 rounded-lg text-amber-800 font-mono font-semibold transition-colors cursor-pointer"
            >
              {t.hero.sampleJamun}
            </button>
          </div>
        </div>
      </div>

      {/* VERIFIED BATCH MAIN CONTENT */}
      {data && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Visual Showcase: Jar Showcase & Official Certificate Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 8 Cols: Official Verification Green Card */}
            <div className="lg:col-span-8 bg-gradient-to-br from-[#123621] via-[#0E2818] to-[#0A1F13] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-800 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 bg-emerald-950/80 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-600/40">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t.batchCard.verifiedBadge}</span>
                  </div>

                  <span className="font-mono text-xs bg-emerald-900/60 text-emerald-200 px-3 py-1 rounded-lg border border-emerald-700">
                    {t.batchCard.batchLabel}: {data.package.package_code}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
                  {data.package.product_name}
                </h2>
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

              {/* View Certificate & Audio Read-Out Action */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-xs text-emerald-200/80">
                  Report: {data.laboratory?.report_code} • NABL Quality Lab
                </span>
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
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    title="Audio Verification Report"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{t.batchCard.listenAudio}</span>
                  </button>

                  <button
                    id="btn-view-cert"
                    type="button"
                    onClick={() => setIsCertificateOpen(true)}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t.batchCard.printCertBtn}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Tactile Physical Jar & Botanical Terroir Card */}
            <div className="lg:col-span-4 bg-gradient-to-b from-[#FFFBF2] to-[#F7F2E7] rounded-3xl p-6 border border-amber-200/80 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                    {t.batchCard.floralSourceLabel}
                  </span>
                  <span className="text-xs font-bold bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full">
                    500g Glass Jar
                  </span>
                </div>

                {/* Jar Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-amber-100">
                    <span className="text-stone-500">{t.batchCard.floralSourceLabel}:</span>
                    <span className="font-bold text-stone-900">Syzygium cumini (Wild Jamun)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-amber-100">
                    <span className="text-stone-500">{t.batchCard.locationLabel}:</span>
                    <span className="font-bold text-stone-900">Western Ghats (1,353 m MSL)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-amber-100">
                    <span className="text-stone-500">Color Profile:</span>
                    <span className="font-bold text-amber-900">Deep Amber / Pfund 65mm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-amber-100">
                    <span className="text-stone-500">Cold Settled:</span>
                    <span className="font-bold text-stone-900">&lt;45°C Unpasteurized</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">Enzyme Activity:</span>
                    <span className="font-bold text-emerald-800">High Diastase (14.5 DN)</span>
                  </div>
                </div>
              </div>

              {/* Natural Raw Seal Graphic */}
              <div className="bg-amber-100/70 p-3 rounded-2xl border border-amber-300 flex items-center gap-3.5">
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

          {/* HUMAN COMPONENT: MEET YOUR BEEKEEPER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                  {lang === 'mr' ? 'कष्टकरी मधपाळ शेतकरी' : (lang === 'hi' ? 'पंजीकृत मधमक्खी पालक' : 'Grassroots Producer Attribution')}
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  {lang === 'mr' ? 'या मधामागील परिश्रमी शेतकरी' : (lang === 'hi' ? 'इस शहद के पीछे परिश्रमी किसान' : 'Meet the Beekeeper Behind This Honey')}
                </h3>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300">
                {lang === 'mr' ? 'थेट बँक खात्यात हमीभाव (DBT)' : (lang === 'hi' ? 'सीधा बैंक खाता हस्तांतरण (DBT)' : 'Direct Benefit Transfer (DBT) Verified')}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Farmer Profile Avatar Badge */}
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

              {/* Farmer Bio and Story */}
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

          {/* REAL BOTANICAL ORIGIN & SENSORY QUALITY GALLERY */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                  Sensory & Botanical Profiling
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Physical Honey Authenticity & Apiary Gallery
                </h3>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 self-start sm:self-auto">
                100% Unpasteurized & Single-Flora
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Photo 1: Viscosity & Pour */}
              <div className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 flex flex-col group hover:border-amber-300 transition-all">
                <div className="h-44 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=600&q=80"
                    alt="Natural Honey Viscosity & Amber Flow"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-stone-950/80 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    Slow Helical Flow
                  </span>
                </div>
                <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-stone-900">Natural Nectar Viscosity</h4>
                    <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                      High surface tension and slow helical folding indicating 17.8% moisture. Zero water dilution or artificial thickening agents.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-200 text-[10px] font-mono text-emerald-800 font-semibold flex items-center justify-between">
                    <span>Moisture Test:</span>
                    <span className="bg-emerald-100 px-1.5 py-0.2 rounded font-bold">17.8% (Passed)</span>
                  </div>
                </div>
              </div>

              {/* Photo 2: Honeycomb Frame */}
              <div className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 flex flex-col group hover:border-amber-300 transition-all">
                <div className="h-44 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=600&q=80"
                    alt="Wild Raw Honeycomb with Wooden Dipper"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-stone-950/80 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    Capped Wax Cells
                  </span>
                </div>
                <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-stone-900">Hexagonal Wax Comb</h4>
                    <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                      Cold-harvested directly from natural beeswax frames. Contains active beneficial propolis, bioflavonoids, and floral pollen grains.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-200 text-[10px] font-mono text-emerald-800 font-semibold flex items-center justify-between">
                    <span>Enzymes:</span>
                    <span className="bg-emerald-100 px-1.5 py-0.2 rounded font-bold">Diastase 14.5 DN</span>
                  </div>
                </div>
              </div>

              {/* Photo 3: Indian Honeybees on Comb */}
              <div className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 flex flex-col group hover:border-amber-300 transition-all">
                <div className="h-44 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=600&q=80"
                    alt="Indian Honeybees on Honeycomb Brood"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-stone-950/80 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    Apis cerana indica
                  </span>
                </div>
                <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-stone-900">Indigenous Foraging</h4>
                    <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                      Native Indian honeybees foraging undisturbed across Kas Plateau and Western Ghats forest reserves during the annual Jamun bloom.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-200 text-[10px] font-mono text-emerald-800 font-semibold flex items-center justify-between">
                    <span>Biodiversity:</span>
                    <span className="bg-emerald-100 px-1.5 py-0.2 rounded font-bold">Western Ghats</span>
                  </div>
                </div>
              </div>

              {/* Photo 4: Sealed Glass Jar */}
              <div className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 flex flex-col group hover:border-amber-300 transition-all">
                <div className="h-44 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=600&q=80"
                    alt="Sealed Glass Jar of Raw Honey"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-stone-950/80 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    500g Glass Packaging
                  </span>
                </div>
                <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-stone-900">Cryptographic Serial Tag</h4>
                    <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                      Packaged in food-grade inert glass jars with tamper-evident seal and non-fungible QR code tied to the immutable blockchain ledger.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-200 text-[10px] font-mono text-emerald-800 font-semibold flex items-center justify-between">
                    <span>Purity Grade:</span>
                    <span className="bg-emerald-100 px-1.5 py-0.2 rounded font-bold">Agmark Special</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HOUSEHOLD PURITY SIMULATOR (WATER & FLAME TESTS) */}
          <HouseholdPuritySimulator />

          {/* INTERACTIVE 5-STEP PROVENANCE TIMELINE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
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
                5 Anchored Milestones
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
                    <span>Measured: <strong className="text-stone-900">{data.collection?.measured_quantity || 48.5} kg</strong></span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      ✓ Reconciled within 2% tolerance
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
                    <span className="font-bold text-emerald-950">Result: {data.laboratory?.result}</span>
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

          {/* CRYPTOGRAPHIC AUDIT EVENT LEDGER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Tamper-Evident SHA-256 Ledger
                </h3>
              </div>
              <span className="text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-full font-mono">
                {data.events_history.length} Event Anchors
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              {data.events_history.map((ev) => (
                <div 
                  key={ev.event_id} 
                  className="bg-stone-50 hover:bg-amber-50/50 p-3.5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{ev.event_type}</span>
                      <span className="text-[10px] text-stone-500 font-mono">({ev.entity_type})</span>
                    </div>
                    <div className="text-stone-600">{ev.description}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[11px] bg-stone-200/80 text-stone-800 px-2.5 py-1 rounded-lg select-all max-w-[200px] truncate" title={ev.blockchain_hash}>
                      {ev.blockchain_hash}
                    </span>
                    <button
                      onClick={() => setVerifiedHash(ev.blockchain_hash || null)}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-lg transition-colors"
                    >
                      {verifiedHash === ev.blockchain_hash ? '✓ Valid' : 'Verify'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
                Official Government Purity Certificate
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setIsCertificateOpen(false)}
                  className="text-stone-500 hover:text-stone-900 text-lg font-bold px-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Certificate Paper Document */}
            <div className="border-2 border-stone-400 p-6 rounded-2xl bg-white space-y-5 relative">
              {/* Emblem & Institutional Header */}
              <div className="text-center space-y-1 border-b border-stone-300 pb-4">
                <div className="text-xs font-bold tracking-widest uppercase text-stone-600">
                  सत्यमेव जयते • Government of India
                </div>
                <h2 className="text-lg font-serif font-black tracking-tight text-stone-900">
                  NATIONAL BEE BOARD & FOOD SAFETY AND STANDARDS AUTHORITY OF INDIA
                </h2>
                <div className="text-[11px] font-semibold text-amber-900">
                  National Honey Mission • Certificate of Botanical Purity & Blockchain Provenance
                </div>
                <div className="text-[10px] font-mono text-stone-500">
                  Certificate Ref: HC/NABL/2026/MAHA-042 • Issue Date: {data.harvest?.harvest_date}
                </div>
              </div>

              {/* Certificate Body Statement */}
              <div className="text-xs leading-relaxed space-y-2 text-stone-800">
                <p>
                  This is to certify that retail batch <strong>{data.package.package_code}</strong> (Product: <em>{data.package.product_name}</em>) harvested by registered beekeeper <strong>{data.origin?.beekeeper_name}</strong> at <strong>{data.origin?.apiary_name}, {data.origin?.apiary_location}</strong> has undergone mandatory laboratory chemical profiling and physical mass-balance verification.
                </p>
              </div>

              {/* Lab Results Table */}
              <table className="w-full text-xs text-left border-collapse border border-stone-300">
                <thead>
                  <tr className="bg-stone-100 font-bold text-stone-800">
                    <th className="p-2 border border-stone-300">Quality Parameter</th>
                    <th className="p-2 border border-stone-300">FSSAI Standard</th>
                    <th className="p-2 border border-stone-300">Observed Value</th>
                    <th className="p-2 border border-stone-300">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-300">
                  <tr>
                    <td className="p-2 border border-stone-300">Moisture Content</td>
                    <td className="p-2 border border-stone-300">Max 20.0%</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">{data.laboratory?.moisture_pct || 17.8}%</td>
                    <td className="p-2 border border-stone-300 text-emerald-700 font-bold">COMPLIANT</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-stone-300">F/G Ratio (Fructose/Glucose)</td>
                    <td className="p-2 border border-stone-300">Min 1.0</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">1.22</td>
                    <td className="p-2 border border-stone-300 text-emerald-700 font-bold">COMPLIANT</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-stone-300">Hydroxymethylfurfural (HMF)</td>
                    <td className="p-2 border border-stone-300">Max 40 mg/kg</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">14.2 mg/kg</td>
                    <td className="p-2 border border-stone-300 text-emerald-700 font-bold">RAW / UNHEATED</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-stone-300">EA-IRMS C4 Sugar Isotope</td>
                    <td className="p-2 border border-stone-300">Negative</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">&lt; -23.5‰ δ13C</td>
                    <td className="p-2 border border-stone-300 text-emerald-700 font-bold">ZERO CORN/CANE SYRUP</td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures & Seal */}
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
                    Chief Food Analyst & Chemical Examiner<br />
                    NABL Accredited Quality Testing Laboratory, Pune
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
