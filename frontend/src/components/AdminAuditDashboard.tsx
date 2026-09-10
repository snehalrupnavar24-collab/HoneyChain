import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  GitFork,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Search,
  ArrowRight,
  ChevronRight,
  Building,
  UserCheck,
  Scale,
  FlaskConical,
  Package,
  Layers,
  Sparkles,
  Camera,
  QrCode,
  Printer,
  Volume2,
  Smartphone,
  ExternalLink,
  MapPin,
  Leaf,
  X
} from 'lucide-react';
import { Discrepancy, SupplyChainEvent } from '../types';
import { getDiscrepancies, resolveDiscrepancy, getAuditEvents } from '../services/api';
import { HoneyJar3DViewer } from './HoneyJar3DViewer';
import { RealCameraScannerModal } from './RealCameraScannerModal';
import { CustomerJarQRGenerator } from './CustomerJarQRGenerator';
import { CoreFeaturesBar } from './CoreFeaturesBar';
import { useLanguage } from '../context/LanguageContext';

export const AdminAuditDashboard: React.FC = () => {
  const { lang, t } = useLanguage();
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [events, setEvents] = useState<SupplyChainEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [activeDiscrepancy, setActiveDiscrepancy] = useState<Discrepancy | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolving, setResolving] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isQrGeneratorOpen, setIsQrGeneratorOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Selected Batch for Audit & QR
  const [selectedBatchCode, setSelectedBatchCode] = useState('PKG-MAHA-042-2697');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [scannedFeedback, setScannedFeedback] = useState<string | null>(null);

  const host = typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? window.location.hostname
    : '10.196.224.19';
  const qrTargetUrl = `http://${host}:5173/?batch=${encodeURIComponent(selectedBatchCode)}`;
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrTargetUrl)}&color=12-42-28&bgcolor=255-255-255`;
  const qrThumbUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrTargetUrl)}&color=12-42-28&bgcolor=255-255-255`;

  useEffect(() => {
    loadAuditData();
  }, []);

  const loadAuditData = async () => {
    setLoading(true);
    try {
      const [discList, eventList] = await Promise.all([
        getDiscrepancies(),
        getAuditEvents()
      ]);
      setDiscrepancies(discList);
      setEvents(eventList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      speechText = `हनीचेन संपूर्ण ऑडिट डॅशबोर्ड. बॅच क्रमांक PKG-MAHA-042-2697 सह्याद्रीच्या जंगलातून १००% अस्सल सिद्ध झाली आहे. शेतकरी रमेश पाटील यांना ४८० रुपये प्रति किलो पूर्ण दर मिळाला आहे. NABL लॅबमध्ये शून्य टक्के साखर पाक आढळली आहे.`;
      speechLang = 'mr-IN';
    } else if (lang === 'hi') {
      speechText = `हनीचेन ऑडिट डैशबोर्ड। बैच क्रमांक PKG-MAHA-042-2697 पूर्णतः शुद्ध एवं सत्यापित है। किसान रमेश पाटिल को ४८० रुपये प्रति किलो भुगतान किया गया है। NABL लैब में शून्य प्रतिशत कृत्रिम चीनी है।`;
      speechLang = 'hi-IN';
    } else {
      speechText = `HoneyChain Master Audit Dashboard. Batch PKG-MAHA-042-2697 is verified pure. Harvested by beekeeper Ramesh Patil at 480 rupees per kg. NABL certified with zero synthetic sugar.`;
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
    <div className="space-y-6">
      {/* 1. TOP EXECUTIVE DASHBOARD BANNER */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                {lang === 'mr' ? 'राष्ट्रीय मध मोहीम • केंद्रीय नियामक व गुणवत्ता डॅशबोर्ड' : (lang === 'hi' ? 'राष्ट्रीय मधुमक्खी मिशन • केंद्रीय नियामक एवं गुणवत्ता डैशबोर्ड' : 'Central Regulatory Surveillance & Master Dashboard')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
              {lang === 'mr' ? 'हनीचेन सर्वसमावेशक ऑडिट व पडताळणी केंद्र' : (lang === 'hi' ? 'हनीचेन संपूर्ण ऑडिट एवं सत्यापन केंद्र' : 'HoneyChain All-in-One Master Dashboard')}
            </h1>
            <p className="text-xs text-stone-600">
              {lang === 'mr' ? 'कच्चा मध संकलन, शेतकरी DBT, NABL रासायनिक लॅब आणि थेट ग्राहक QR एकाच डॅशबोर्डवर' : (lang === 'hi' ? 'कच्चा शहद संकलन, किसान DBT, NABL लैब और ग्राहक QR कोड एक ही डैशबोर्ड पर' : 'Live IoT Telemetry, Mandi Tare Clearing, Mass Balance, NABL Chemical Assay, and Real-Time Customer QR')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <div className="bg-stone-50 px-3.5 py-1.5 rounded-2xl border border-stone-300 text-left sm:text-right">
              <span className="text-[10px] text-stone-600 font-bold block uppercase tracking-wider">Blockchain Ledger</span>
              <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                BLOCK #18,409 (SYNCED)
              </span>
            </div>

            <button
              type="button"
              onClick={handleAudioNarration}
              className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all border border-amber-300 cursor-pointer shadow-2xs"
              title="Listen to Dashboard Summary in Audio"
            >
              <Volume2 className="w-4 h-4 text-amber-800" />
              <span>{lang === 'mr' ? 'ऑडिओ ऐका' : (lang === 'hi' ? 'ऑडियो सुनें' : 'Audio')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE 4 CORE VERIFICATION & QR FEATURES (DIRECTLY VISIBLE ON THE DASHBOARD!) */}
      <CoreFeaturesBar
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenGenerator={() => setIsQrGeneratorOpen(true)}
        onOpenMobile={() => setIsQrGeneratorOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* 3. MASTER QR CODE SHOWCASE & 3D DIGITAL TWIN HUB (FRONT & CENTER - NOT HIDDEN!) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT 5 COLS: PROMINENT LIVE HONEY JAR QR CODE (TOTALLY VISIBLE ON SCREEN!) */}
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
                  {selectedBatchCode}
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
      </div>

      {/* 3. SUPPLY CHAIN LINEAGE - FULLY RESPONSIVE, 100% VISIBLE WITH REAL QR CODE IN NODE 6 */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-4">
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
              {selectedBatchCode}
            </span>
          </div>
        </div>

        {/* 6 Responsive Lineage Cards (NODE 6 SHOWS THE REAL SCANNABLE QR CODE RIGHT IN THE CORNER!) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {/* Node 1: Source Hive */}
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
      </div>

      {/* 4. REAL-TIME PLATFORM KPIS (4 Clean Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
      </div>

      {/* 5. DISCREPANCY INVESTIGATION & FRAUD SURVEILLANCE */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-4">
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
      </div>

      {/* 6. IMMUTABLE SHA-256 BLOCKCHAIN EVENT LEDGER */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-4">
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
      </div>

      {/* MODAL 1: DISCREPANCY INVESTIGATION & RESOLUTION */}
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

      {/* MODAL 2: REAL CAMERA SCANNER */}
      <RealCameraScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(scannedCode) => {
          setSelectedBatchCode(scannedCode);
          setScannedFeedback(`Scanned Batch: ${scannedCode}`);
          setTimeout(() => setScannedFeedback(null), 4000);
        }}
      />

      {/* MODAL 3: CUSTOMER HONEY JAR QR GENERATOR */}
      <CustomerJarQRGenerator
        isOpen={isQrGeneratorOpen}
        onClose={() => setIsQrGeneratorOpen(false)}
        onTestVerify={(batchCode) => {
          setSelectedBatchCode(batchCode);
          setIsQrGeneratorOpen(false);
        }}
      />

      {/* MODAL 4: OFFICIAL NABL CERTIFICATE */}
      {isCertificateOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#FAF7F0] text-stone-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-4 border-amber-800/80 shadow-2xl space-y-5 my-8 print:border-none print:shadow-none print:p-0">
            <div className="flex items-center justify-between border-b border-stone-300 pb-3 print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Official NABL Laboratory Purity Certificate
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" /> Print PDF
                </button>
                <button
                  onClick={() => setIsCertificateOpen(false)}
                  className="text-stone-500 hover:text-stone-900 text-lg font-bold px-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="border-2 border-stone-400 p-6 rounded-2xl bg-white space-y-4">
              <div className="text-center space-y-1 border-b border-stone-300 pb-3">
                <div className="text-xs font-bold uppercase text-stone-600">सत्यमेव जयते • Government of India</div>
                <h2 className="text-base sm:text-lg font-serif font-black text-stone-900">
                  NATIONAL BEE BOARD & FOOD SAFETY STANDARDS AUTHORITY OF INDIA
                </h2>
                <div className="text-xs font-semibold text-amber-900">
                  NABL Quality Assay • Batch Ref: {selectedBatchCode}
                </div>
              </div>

              <table className="w-full text-xs text-left border-collapse border border-stone-300">
                <thead>
                  <tr className="bg-stone-100 font-bold text-stone-800">
                    <th className="p-2 border border-stone-300">Parameter</th>
                    <th className="p-2 border border-stone-300">Standard</th>
                    <th className="p-2 border border-stone-300">Observed</th>
                    <th className="p-2 border border-stone-300">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-300">
                  <tr>
                    <td className="p-2 border border-stone-300 font-semibold">Moisture Content</td>
                    <td className="p-2 border border-stone-300">Max 20.0%</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">17.8%</td>
                    <td className="p-2 border border-stone-300 text-emerald-800 font-bold">PASSED</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-stone-300 font-semibold">F/G Ratio</td>
                    <td className="p-2 border border-stone-300">Min 1.0</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">1.22</td>
                    <td className="p-2 border border-stone-300 text-emerald-800 font-bold">PASSED</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-stone-300 font-semibold">EA-IRMS C4 Sugar Isotope</td>
                    <td className="p-2 border border-stone-300">Negative</td>
                    <td className="p-2 border border-stone-300 font-mono font-bold">&lt; -23.5‰</td>
                    <td className="p-2 border border-stone-300 text-emerald-800 font-bold">0.0% SYRUP</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-300">
                <span className="font-bold text-amber-800">Agmark Special Grade Cleared</span>
                <span className="font-serif italic font-bold text-stone-900">Dr. Sunita Kulkarni, Chief Food Analyst</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
