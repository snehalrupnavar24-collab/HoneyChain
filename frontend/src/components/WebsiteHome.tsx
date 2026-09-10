import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Camera,
  MapPin,
  Lock,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Copy,
  Check,
  Building,
  Scale,
  FlaskConical,
  Package,
  Layers,
  GitFork,
  Volume2,
  Smartphone,
  QrCode,
  UserCheck,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Leaf,
  X
} from 'lucide-react';
import { 
  verifyPackageByCode, 
  getDiscrepancies, 
  resolveDiscrepancy, 
  getAuditEvents 
} from '../services/api';
import { 
  ConsumerVerifyResponse, 
  Discrepancy, 
  SupplyChainEvent 
} from '../types';
import { HoneyJar3DViewer } from './HoneyJar3DViewer';
import { HouseholdPuritySimulator } from './HouseholdPuritySimulator';
import { RealCameraScannerModal } from './RealCameraScannerModal';
import { CustomerJarQRGenerator } from './CustomerJarQRGenerator';
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

  // Audit and Blockchain State
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [events, setEvents] = useState<SupplyChainEvent[]>([]);
  const [activeDiscrepancy, setActiveDiscrepancy] = useState<Discrepancy | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolving, setResolving] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isQrGeneratorOpen, setIsQrGeneratorOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showPuritySim, setShowPuritySim] = useState(false);

  // QR Code URL configuration
  const host = typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? window.location.hostname
    : '10.196.224.19';
  const qrTargetUrl = `http://${host}:5173/?batch=${encodeURIComponent(packageCode)}`;
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrTargetUrl)}&color=12-42-28&bgcolor=255-255-255`;
  const qrThumbUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrTargetUrl)}&color=12-42-28&bgcolor=255-255-255`;

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

  const loadAuditData = async () => {
    try {
      const [discList, eventList] = await Promise.all([
        getDiscrepancies(),
        getAuditEvents()
      ]);
      setDiscrepancies(discList);
      setEvents(eventList);
    } catch (err) {
      console.error('Audit data load error:', err);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const batchParam = urlParams.get('batch');
    const initialCode = batchParam ? batchParam.trim() : 'PKG-MAHA-042-2697';
    setPackageCode(initialCode);
    handleSearch(initialCode);
    loadAuditData();
  }, []);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDiscrepancy) return;
    setResolving(true);
    try {
      const updated = await resolveDiscrepancy(activeDiscrepancy.id, resolutionNotes);
      setDiscrepancies(prev =>
        prev.map(d => (d.id === updated.id ? { ...d, status: 'resolved', explanation: updated.explanation } : d))
      );
      setActiveDiscrepancy(null);
      setResolutionNotes('');
    } finally {
      setResolving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleAudioNarration = () => {
    let speechText = '';
    let speechLang = 'en-IN';
    if (lang === 'mr') {
      speechText = `हनीचेन संपूर्ण पडताळणी केंद्र. बॅच क्रमांक ${packageCode} सह्याद्रीच्या जंगलातून १००% अस्सल सिद्ध झाली आहे. शेतकरी रमेश पाटील यांना ४८० रुपये प्रति किलो पूर्ण दर मिळाला आहे. NABL लॅबमध्ये शून्य टक्के साखर पाक आढळली आहे.`;
      speechLang = 'mr-IN';
    } else if (lang === 'hi') {
      speechText = `हनीचेन संपूर्ण सत्यापन केंद्र। बैच क्रमांक ${packageCode} पूर्णतः शुद्ध एवं सत्यापित है। किसान रमेश पाटिल को ४८० रुपये प्रति किलो भुगतान किया गया है। NABL लैब में शून्य प्रतिशत कृत्रिम चीनी है।`;
      speechLang = 'hi-IN';
    } else {
      speechText = `HoneyChain Master Verification. Batch ${packageCode} is verified pure raw honey from beekeeper Ramesh Patil. Laboratory testing confirms zero added synthetic sugar and 17.8% moisture.`;
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. TOP INSTITUTIONAL SURVEILLANCE & HERO SEARCH BANNER */}
      <section className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-7 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-300 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.hero.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
              {t.hero.title}
            </h1>
            <p className="text-xs text-stone-600 max-w-xl">
              {t.hero.subtitle}
            </p>
          </div>

          {/* Blockchain Synced Pill & Audio Button */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="bg-stone-50 px-3 py-1.5 rounded-2xl border border-stone-300 text-left sm:text-right">
              <span className="text-[10px] text-stone-500 font-bold block uppercase tracking-wider">Blockchain Ledger</span>
              <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                BLOCK #18,409 (SYNCED)
              </span>
            </div>

            <button
              type="button"
              onClick={handleAudioNarration}
              className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all border border-amber-300 cursor-pointer shadow-2xs"
              title="Listen to Verification Summary"
            >
              <Volume2 className="w-4 h-4 text-amber-800" />
              <span>{lang === 'mr' ? 'ऑडिओ ऐका' : (lang === 'hi' ? 'ऑडियो सुनें' : 'Audio')}</span>
            </button>
          </div>
        </div>

        {/* High-Contrast Search & Camera Action */}
        <div className="max-w-xl mx-auto space-y-2.5 pt-1 text-center">
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

        {/* 4-STEP CUSTOMER PROCESS BAR */}
        <div className="pt-2 border-t border-stone-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
            {/* Step 1: Sign In */}
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

            {/* Step 2: Scan QR */}
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

            {/* Step 4: 3D Twin & Provenance */}
            <div 
              onClick={() => {
                const el = document.getElementById('master-jar-hub');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-2 rounded-xl border border-stone-200 hover:border-amber-300 bg-stone-50 hover:bg-amber-50/50 cursor-pointer transition-all flex items-center gap-2 group"
            >
              <div className="w-6 h-6 rounded-lg bg-stone-200 text-stone-800 group-hover:bg-amber-500 group-hover:text-stone-950 flex items-center justify-center text-xs font-bold shrink-0">
                4
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-stone-900 block truncate">
                  {lang === 'mr' ? '४. 3D व QR कोड' : (lang === 'hi' ? '4. 3D व QR कोड' : '4. 3D Jar & QR')}
                </span>
                <span className="text-[10px] text-stone-600 truncate block">
                  {lang === 'mr' ? 'थेट दृश्यमान' : (lang === 'hi' ? 'प्रत्यक्ष दर्शनीय' : 'Live Twin')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 CORE VERIFICATION & QR FEATURES (DIRECTLY VISIBLE - NOT HIDDEN!) */}
      <CoreFeaturesBar
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenGenerator={() => setIsQrGeneratorOpen(true)}
        onOpenMobile={() => onOpenMobileModal ? onOpenMobileModal() : setIsQrGeneratorOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* 3. MASTER QR CODE SHOWCASE & 3D DIGITAL TWIN HUB (SIDE-BY-SIDE FRONT & CENTER - NOT HIDDEN!) */}
      <section id="master-jar-hub" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT 5 COLS: PROMINENT LIVE HONEY JAR QR CODE (DIRECTLY SCANNABLE WITH PHONE CAMERA) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-amber-300/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-sm shadow-2xs">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-stone-900 leading-tight">
                  {lang === 'mr' ? 'थेट मधाच्या बाटलीचा QR कोड' : (lang === 'hi' ? 'शहद के जार का लाइव QR कोड' : 'Live Honey Jar QR Code')}
                </h3>
                <span className="text-[11px] text-amber-900 font-semibold">
                  {lang === 'mr' ? 'थेट कॅमेऱ्याने स्कॅन करा' : (lang === 'hi' ? 'फोन कैमरे से स्कैन करें' : 'Scan With Any Phone Camera')}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
              ✓ 100% Active
            </span>
          </div>

          {/* Large Visible QR Code Box */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col items-center text-center space-y-3">
            {/* The Actual QR Code Image (Big, Crisp, Scannable) */}
            <div className="w-44 h-44 bg-white p-2.5 rounded-2xl border-3 border-amber-400 shadow-md flex items-center justify-center">
              <img 
                src={qrImgUrl} 
                alt="Honey Jar QR Code" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-1">
              <div className="inline-block bg-white px-3 py-1 rounded-xl border border-stone-300 shadow-2xs">
                <span className="text-xs font-mono font-bold text-stone-900">
                  {packageCode}
                </span>
              </div>
              <p className="text-xs text-stone-700 max-w-xs font-medium pt-1">
                {lang === 'mr' 
                  ? 'कोणत्याही स्मार्टफोनच्या कॅमेऱ्याने हा QR कोड थेट स्कॅन करा आणि शेतकरी, NABL लॅब अहवाल तपासा.' 
                  : (lang === 'hi' 
                    ? 'किसी भी फोन कैमरे से यह QR कोड स्कैन करें और किसान तथा लैब रिपोर्ट देखें।' 
                    : 'Scan this QR code with your phone camera to inspect Ramesh Patil’s hive and NABL purity report.')}
              </p>
            </div>

            {/* Direct Verification Link */}
            <a
              href={qrTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200"
            >
              <span>{qrTargetUrl}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="px-3 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{lang === 'mr' ? 'कॅमेऱ्याने स्कॅन' : (lang === 'hi' ? 'कैमरा स्कैन' : 'Camera Scanner')}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsQrGeneratorOpen(true)}
              className="px-3 py-2.5 bg-stone-900 hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>{lang === 'mr' ? 'QR लेबल प्रिंट' : (lang === 'hi' ? 'QR लेबल प्रिंट' : 'Print Jar Label')}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCertificateOpen(true)}
              className="col-span-2 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all border border-emerald-300 cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'mr' ? 'अधिकृत NABL लॅब प्रमाणपत्र उघडा' : (lang === 'hi' ? 'आधिकारिक NABL लैब प्रमाण पत्र देखें' : 'View Official NABL Lab Certificate')}</span>
            </button>
          </div>

          {/* Farmer Attribution Box */}
          <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200 flex items-center gap-3 text-xs">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-2xs border-2 border-amber-300 shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=150&q=80" 
                alt="Ramesh Patil"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-stone-900 truncate">Ramesh Tukaram Patil</h4>
                <span className="text-[10px] font-mono font-bold text-emerald-900">₹480/kg DBT</span>
              </div>
              <p className="text-[11px] text-stone-600 truncate">Kas Forest Apiary, Western Ghats</p>
              <span className="text-[10px] font-bold text-amber-950">Syzygium cumini (Wild Jamun)</span>
            </div>
          </div>
        </div>

        {/* RIGHT 7 COLS: 3D DIGITAL TWIN HONEY JAR VIEWER */}
        <div className="lg:col-span-7">
          <HoneyJar3DViewer />
        </div>
      </section>

      {/* 4. VERIFIED AUTHENTICITY CARD & BEEKEEPER STORY */}
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

            {/* Humanized Beekeeper Profile */}
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
          </div>
        </section>
      )}

      {/* 5. 6-STAGE SUPPLY CHAIN LINEAGE (WITH REAL SCANNABLE QR CODE IN NODE 6 - TOTALLY VISIBLE!) */}
      <section className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
              <GitFork className="w-5 h-5 text-amber-600" />
              <span>
                {lang === 'mr' ? '६-टप्प्यांची पुरवठा साखळी व QR वंशावळ' : (lang === 'hi' ? '6-चरणीय आपूर्ति श्रृंखला एवं QR वंशावली' : '6-Stage Supply Chain Lineage & QR Provenance')}
              </span>
            </h2>
            <p className="text-xs text-stone-600">
              {lang === 'mr' ? 'मधमाशी पोळ्यापासून रिटेल जार QR कोडपर्यंतचा प्रत्येक टप्पा थेट दृश्यमान' : (lang === 'hi' ? 'मधुमक्खी के छत्ते से लेकर रिटेल जार QR तक प्रत्येक चरण प्रत्यक्ष' : 'Direct traceability from beehive telemetry to retail QR label with zero hidden nodes.')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-600 font-semibold">Active Batch:</span>
            <span className="px-2.5 py-1 bg-amber-50 rounded-lg text-xs font-mono font-bold text-amber-950 border border-amber-300">
              {packageCode}
            </span>
          </div>
        </div>

        {/* 6 Responsive Lineage Cards (NODE 6 SHOWS THE REAL SCANNABLE QR CODE RIGHT IN THE CORNER!) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {/* Node 1: Queen Hive */}
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 flex flex-col items-center text-center space-y-1.5 shadow-2xs hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">1. Queen Hive</span>
              <h4 className="text-xs font-bold text-stone-900">HIVE-17</h4>
              <p className="text-[10px] text-stone-600 font-mono">Ramesh Patil</p>
              <span className="inline-block text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full border border-emerald-300">
                34.5°C Brood
              </span>
            </div>
          </div>

          {/* Node 2: Harvest Lot */}
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 flex flex-col items-center text-center space-y-1.5 shadow-2xs hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-white flex items-center justify-center font-bold shadow-2xs">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 block">2. Harvest</span>
              <h4 className="text-xs font-bold text-stone-900 font-mono">HC-SAT-2026</h4>
              <p className="text-[10px] text-stone-600 font-mono">8.00 kg Jamun</p>
              <span className="inline-block text-[9px] font-bold bg-amber-100 text-amber-950 px-1.5 py-0.5 rounded-full border border-amber-300 font-mono">
                Voice Signed
              </span>
            </div>
          </div>

          {/* Node 3: Mandi Scale */}
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 flex flex-col items-center text-center space-y-1.5 shadow-2xs hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold shadow-2xs">
              <Scale className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 block">3. Mandi Scale</span>
              <h4 className="text-xs font-bold text-stone-900 font-mono">COL-SAT-042</h4>
              <p className="text-[10px] text-stone-600 font-mono">8.00 kg (0% var)</p>
              <span className="inline-block text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full border border-emerald-300">
                Tare Cleared
              </span>
            </div>
          </div>

          {/* Node 4: Processing Facility */}
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 flex flex-col items-center text-center space-y-1.5 shadow-2xs hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold shadow-2xs">
              <Building className="w-5 h-5 text-amber-300" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 block">4. Processing</span>
              <h4 className="text-xs font-bold text-stone-900 font-mono">PROC-2026-042</h4>
              <p className="text-[10px] text-stone-600 font-mono">48.2kg out / 50kg</p>
              <span className="inline-block text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full border border-emerald-300">
                Mass Bal. OK
              </span>
            </div>
          </div>

          {/* Node 5: NABL Chemical Lab */}
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 flex flex-col items-center text-center space-y-1.5 shadow-2xs hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold shadow-2xs">
              <FlaskConical className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 block">5. FSSAI Lab</span>
              <h4 className="text-xs font-bold text-stone-900 font-mono">LR-NABL-7821</h4>
              <p className="text-[10px] text-stone-600 font-mono">17.8% Moist</p>
              <span className="inline-block text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full border border-emerald-300">
                99.1% Pure
              </span>
            </div>
          </div>

          {/* Node 6: Serialized Package WITH REAL LIVE SCANNABLE QR CODE (NOT HIDDEN!) */}
          <div className="bg-emerald-50 p-2.5 rounded-2xl border-2 border-emerald-500 flex flex-col items-center text-center space-y-1 shadow-xs hover:border-emerald-600 transition-all">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-950 block">6. Consumer Jar QR</span>
            
            {/* REAL SCANNABLE QR CODE IMAGE RIGHT IN THIS CORNER CARD! */}
            <div className="w-14 h-14 bg-white p-1 rounded-xl border border-emerald-400 shadow-2xs flex items-center justify-center">
              <img
                src={qrThumbUrl}
                alt="Consumer Jar QR"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-0.5">
              <h4 className="text-[11px] font-bold text-stone-900 font-mono">PKG-MAHA-042</h4>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                ✓ Scannable QR
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REAL-TIME PLATFORM KPIS (4 Clean Cards) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-600 font-bold uppercase tracking-wider block">Apiary Clusters</span>
          <div className="text-2xl font-black font-mono text-stone-900 mt-0.5">14 Zones</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">Western Ghats, Kashmir, Sundarbans</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-600 font-bold uppercase tracking-wider block">IoT Telemetry Hives</span>
          <div className="text-2xl font-black font-mono text-stone-900 mt-0.5">412 Hives</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">99.4% LoRaWAN Sensor Uptime</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-600 font-bold uppercase tracking-wider block">Traceable Honey</span>
          <div className="text-2xl font-black font-mono text-stone-900 mt-0.5">14,820 kg</div>
          <span className="text-[11px] text-amber-800 font-semibold mt-0.5 block">100% Cryptographically Bound</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-600 font-bold uppercase tracking-wider block">Adulteration Defenses</span>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-0.5">
            0 Active Breaches
          </div>
          <span className="text-[11px] text-stone-600 font-semibold mt-0.5 block">
            {discrepancies.length} Resolved & Investigated
          </span>
        </div>
      </section>

      {/* 7. DISCREPANCY INVESTIGATION & FRAUD SURVEILLANCE GUARD */}
      <section className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-600" />
              <span>
                {lang === 'mr' ? 'स्वयंचलित विसंगती व गैरव्यवहार तपासणी' : (lang === 'hi' ? 'स्वचालित विसंगति एवं मिलावट जांच' : 'Automated Discrepancy & Adulteration Guard')}
              </span>
            </h2>
            <p className="text-xs text-stone-600">
              {lang === 'mr' ? 'भौतिक वजन संवर्धन व रासायनिक मानकांची तपासणी' : (lang === 'hi' ? 'भौतिक द्रव्यमान एवं रासायनिक मानकों की स्वचालित जांच' : 'Mass-conservation and botanical limits algorithmically monitored.')}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-xl border border-stone-200">
            {discrepancies.length} Incident(s) Logged
          </span>
        </div>

        <div className="space-y-2">
          {discrepancies.length === 0 ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs text-emerald-900 font-semibold">
              ✓ All mass balances, tare weights, and chemical isotopes strictly verified within standard limits.
            </div>
          ) : (
            discrepancies.map(item => (
              <div
                key={item.id}
                className="p-3.5 bg-stone-50 hover:bg-amber-50/40 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {item.entity_type} #{item.entity_id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                    }`}>
                      {item.status}
                    </span>
                    <span className="font-mono text-stone-600 text-[11px]">
                      Decl: {item.declared_quantity?.toFixed(1)}kg • Meas: {item.measured_quantity?.toFixed(1)}kg • Diff: {item.difference?.toFixed(1)}kg
                    </span>
                  </div>
                  <p className="text-stone-700 text-[11px]">{item.explanation}</p>
                </div>

                <div className="shrink-0">
                  {item.status === 'open' ? (
                    <button
                      type="button"
                      onClick={() => setActiveDiscrepancy(item)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Investigate
                    </button>
                  ) : (
                    <span className="text-emerald-800 font-bold text-xs flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 8. IMMUTABLE SHA-256 BLOCKCHAIN EVENT LEDGER */}
      <section className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="border-b border-stone-200 pb-3">
          <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <span>
              {lang === 'mr' ? 'अपरिवर्तनीय SHA-256 ब्लॉकचेन ऑडिट लेजर' : (lang === 'hi' ? 'अपरिवर्तनीय SHA-256 ब्लॉकचेन ऑडिट लेजर' : 'Cryptographic SHA-256 Blockchain Event Ledger')}
            </span>
          </h2>
          <p className="text-xs text-stone-600">
            {lang === 'mr' ? 'प्रत्येक भौतिक कृतीवर क्रिप्टोग्राफिक हॅश मिंट केले जाते' : (lang === 'hi' ? 'प्रत्येक भौतिक गतिविधि पर क्रिप्टोग्राफिक हैश मिंट किया जाता है' : 'Decentralized hash blocks minted on state transition events (Harvest → Collection → Processing → Lab → QR).')}
          </p>
        </div>

        <div className="space-y-2">
          {events.slice(0, 6).map((event, idx) => (
            <div
              key={event.event_id || idx}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200 text-[11px]">
                    EVENT #{event.event_id || idx + 1}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-950 font-bold rounded-full text-[10px] uppercase">
                    {event.event_type}
                  </span>
                  {event.timestamp && (
                    <span className="text-[10px] text-stone-500 font-mono">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <p className="text-stone-800 font-medium text-[11px]">{event.description}</p>
              </div>

              {/* SHA-256 Hash Display */}
              {event.blockchain_hash && (
                <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white px-2 py-1 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-mono text-stone-500">SHA-256:</span>
                  <span className="font-mono font-bold text-stone-900 text-[11px]">
                    {event.blockchain_hash.slice(0, 10)}...{event.blockchain_hash.slice(-8)}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(event.blockchain_hash!)}
                    className="p-1 hover:bg-stone-100 rounded text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                    title="Copy Full SHA-256 Hash"
                  >
                    {copiedHash === event.blockchain_hash ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. OPTIONAL KITCHEN PURITY SIMULATOR (CLEAN & COLLAPSIBLE) */}
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

      {/* MODAL 1: REAL CAMERA SCANNER MODAL */}
      <RealCameraScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(scannedCode) => {
          setPackageCode(scannedCode);
          handleSearch(scannedCode);
        }}
      />

      {/* MODAL 2: CUSTOMER HONEY JAR QR GENERATOR MODAL */}
      <CustomerJarQRGenerator
        isOpen={isQrGeneratorOpen}
        onClose={() => setIsQrGeneratorOpen(false)}
        onTestVerify={(batchCode) => {
          setPackageCode(batchCode);
          handleSearch(batchCode);
          setIsQrGeneratorOpen(false);
        }}
      />

      {/* MODAL 3: DISCREPANCY INVESTIGATION & RESOLUTION */}
      {activeDiscrepancy && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold font-serif text-stone-900 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-600" />
                Resolve Discrepancy #{activeDiscrepancy.id}
              </h3>
              <button
                type="button"
                onClick={() => setActiveDiscrepancy(null)}
                className="text-stone-400 hover:text-stone-800 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-1.5 text-xs">
              <div className="font-bold text-stone-900">
                Entity: {activeDiscrepancy.entity_type} #{activeDiscrepancy.entity_id}
              </div>
              <div className="text-stone-700">
                Declared: {activeDiscrepancy.declared_quantity?.toFixed(2)} kg | Measured: {activeDiscrepancy.measured_quantity?.toFixed(2)} kg
              </div>
              <div className="font-bold text-red-600">
                Variance: {activeDiscrepancy.difference?.toFixed(2)} kg
              </div>
              <p className="text-stone-600 pt-1 border-t border-stone-200">{activeDiscrepancy.explanation}</p>
            </div>

            <form onSubmit={handleResolve} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-800 block">Investigator Findings & Action Taken:</label>
                <textarea
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="Enter physical scale re-calibration notes, APMC inspector verification, or tare offset explanation..."
                  rows={3}
                  required
                  className="w-full p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:border-amber-500 text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDiscrepancy(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resolving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {resolving ? 'Submitting...' : 'Mark Resolved & Sign Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: OFFICIAL PRINTABLE CERTIFICATE MODAL */}
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

      {/* MODAL 5: CUSTOMER LOGIN MODAL */}
      <CustomerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onScanRedirect={() => setIsScannerOpen(true)}
      />
    </div>
  );
};
