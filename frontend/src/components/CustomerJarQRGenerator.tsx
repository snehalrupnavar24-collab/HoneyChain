import React, { useState } from 'react';
import {
  QrCode,
  Printer,
  X,
  Sparkles,
  ShieldCheck,
  Award,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Flame,
  Droplets,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CustomerJarQRGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onTestVerify: (batchCode: string) => void;
  localIp?: string;
  port?: string;
}

export const CustomerJarQRGenerator: React.FC<CustomerJarQRGeneratorProps> = ({
  isOpen,
  onClose,
  onTestVerify,
  localIp,
  port = '5173',
}) => {
  const { lang, t } = useLanguage();

  const presets = [
    {
      id: 'jamun',
      code: 'PKG-MAHA-042-2697',
      nameEn: 'Pure Raw Jamun Forest Honey',
      nameHi: 'शुद्ध प्राकृतिक जामुन वन शहद',
      nameMr: 'अस्सल नैसर्गिक जांभूळ वन मध',
      beekeeper: 'Ramesh Tukaram Patil',
      village: 'Kas Plateau, Satara, Maharashtra',
      floral: 'Syzygium cumini (Wild Jamun)',
      moisture: '17.8%',
      fairPrice: '₹480/kg Guaranteed MSP',
      color: 'from-amber-700 to-amber-950',
    },
    {
      id: 'acacia',
      code: 'PKG-KASH-019-8832',
      nameEn: 'Kashmir White Acacia Honey',
      nameHi: 'कश्मीर सफेद बबूल शहद',
      nameMr: 'काश्मीर पांढरा बाभूळ मध',
      beekeeper: 'Ghulam Mohammad Wani',
      village: 'Pampore Saffron Belt, Pulwama, J&K',
      floral: 'Robinia pseudoacacia (Acacia)',
      moisture: '16.5%',
      fairPrice: '₹550/kg Guaranteed MSP',
      color: 'from-amber-600 to-amber-900',
    },
    {
      id: 'mangrove',
      code: 'PKG-SUND-005-4190',
      nameEn: 'Sunderbans Wild Mangrove Honey',
      nameHi: 'सुंदरबन प्राकृतिक मैंग्रोव शहद',
      nameMr: 'सुंदरबन नैसर्गिक खारफुटी मध',
      beekeeper: 'Subhash Mondal (Mouly Harvester)',
      village: 'Gosaba Island Reserve, West Bengal',
      floral: 'Aegiceras & Rhizophora (Mangrove)',
      moisture: '18.2%',
      fairPrice: '₹520/kg Guaranteed MSP',
      color: 'from-teal-800 to-emerald-950',
    },
  ];

  const [selectedPreset, setSelectedPreset] = useState(presets[0]);
  const [customCode, setCustomCode] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeCode = useCustom ? (customCode.trim() || 'PKG-CUSTOM-001') : selectedPreset.code;
  const host = typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? window.location.hostname
    : (localIp || '10.196.224.19');
  
  const customerScanUrl = `http://${host}:${port}/?batch=${encodeURIComponent(activeCode)}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(customerScanUrl)}&color=12-42-28&bgcolor=255-255-255`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(customerScanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getLocalizedName = () => {
    if (useCustom) return customCode;
    if (lang === 'hi') return selectedPreset.nameHi;
    if (lang === 'mr') return selectedPreset.nameMr;
    return selectedPreset.nameEn;
  };

  return (
    <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
      <div className="bg-[#FAF7F0] text-stone-900 rounded-3xl max-w-2xl w-full border-2 border-amber-800/80 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Header */}
        <div className="bg-[#122A1C] text-amber-100 p-4 sm:p-5 flex items-center justify-between border-b border-emerald-900 shrink-0 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white font-serif tracking-wide">
                  {t.generator.modalTitle}
                </h3>
                <span className="text-[10px] font-mono font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full">
                  KVIC Standard
                </span>
              </div>
              <p className="text-xs text-emerald-300">
                {t.generator.modalSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1.5 rounded-lg hover:bg-emerald-900/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs">
          {/* Preset Selector Chips (Hide on print) */}
          <div className="space-y-2 print:hidden">
            <label className="font-bold text-stone-900 text-xs font-serif block">
              {t.generator.selectHoney}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {presets.map((p) => {
                const isCurrent = !useCustom && selectedPreset.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(p);
                      setUseCustom(false);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-stone-900 text-amber-400 border-amber-500 shadow-xs'
                        : 'bg-white hover:bg-amber-50 border-stone-300 text-stone-800'
                    }`}
                  >
                    <div className="font-bold text-[11px] truncate">
                      {lang === 'hi' ? p.nameHi : lang === 'mr' ? p.nameMr : p.nameEn}
                    </div>
                    <div className="text-[10px] opacity-75 font-mono truncate">{p.code}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* OFFICIAL PRINTABLE HONEY JAR STICKER (High Visual Impact) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 print:hidden">
              <span className="flex items-center gap-1.5 text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.generator.stickerPreviewTitle}</span>
              </span>
              <span className="text-[11px] text-stone-500 font-normal">
                Formatted for 3" × 4" Jar Label Sticker
              </span>
            </div>

            {/* Sticker Physical Container */}
            <div className="bg-white rounded-3xl border-4 border-amber-600/70 p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-4 max-w-md mx-auto print:border-2 print:shadow-none print:m-0 print:p-4">
              {/* Top Banner: Government & Mission */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-600 text-white font-serif font-black flex items-center justify-center text-xs">
                    HC
                  </div>
                  <div>
                    <div className="font-serif font-black text-stone-900 text-xs tracking-tight">
                      HONEYCHAIN INDIA
                    </div>
                    <div className="text-[9px] font-bold text-amber-900 tracking-wider uppercase">
                      National Honey Mission • KVIC
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
                  Agmark Special Grade
                </span>
              </div>

              {/* Product Variety Headline */}
              <div className="text-center space-y-0.5">
                <h4 className="text-base sm:text-lg font-serif font-black text-stone-900 leading-tight">
                  {getLocalizedName()}
                </h4>
                <p className="text-[10px] text-stone-600 font-medium">
                  100% Single-Origin Botanical Raw Honey • Net Wt. 500g
                </p>
              </div>

              {/* QR Code & Origin Split */}
              <div className="flex items-center gap-4 bg-[#FAF7F0] p-3.5 rounded-2xl border border-amber-200">
                {/* Real Scannable High-Res QR Code */}
                <div className="bg-white p-2 rounded-xl border border-stone-300 shadow-xs shrink-0 text-center">
                  <img
                    src={qrApiUrl}
                    alt="Customer Verification QR Code"
                    className="w-28 h-28 sm:w-32 sm:h-32 object-contain mx-auto"
                  />
                  <span className="text-[8px] font-mono font-bold text-stone-500 block mt-1">
                    SCAN TO VERIFY
                  </span>
                </div>

                {/* Beekeeper & Provenance Details on Label */}
                <div className="space-y-2 flex-1 text-[11px] leading-tight">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-stone-500 block">
                      Lead Beekeeper / Farmer:
                    </span>
                    <strong className="text-stone-900 font-bold text-xs block">
                      {selectedPreset.beekeeper}
                    </strong>
                    <span className="text-[10px] text-stone-600 block">
                      {selectedPreset.village}
                    </span>
                  </div>

                  <div className="pt-1 border-t border-amber-200/80">
                    <span className="text-[9px] uppercase font-bold text-stone-500 block">
                      Batch Identifier:
                    </span>
                    <span className="font-mono font-bold text-amber-900 text-[10px]">
                      {activeCode}
                    </span>
                  </div>

                  <div className="pt-1 border-t border-amber-200/80">
                    <span className="text-[9px] uppercase font-bold text-emerald-800 block">
                      NABL Isotope Lab Seal:
                    </span>
                    <span className="font-bold text-emerald-950 text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>0.0% C4 Sugar • Pure Raw</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Multilingual Scan Prompt (Clear to customers in 3 languages) */}
              <div className="bg-amber-100/70 p-2.5 rounded-xl text-center space-y-1 text-[10px] text-stone-800 leading-snug">
                <p className="font-bold text-stone-950">
                  📷 {t.generator.scanPrompt}
                </p>
                <p className="text-[9px] text-stone-600 font-medium">
                  (खेत से थाली तक की पूरी यात्रा व NABL लैब रिपोर्ट देखने के लिए फोन कैमरे से स्कैन करें)
                </p>
              </div>

              {/* Footer Stamp */}
              <div className="flex items-center justify-between text-[9px] text-stone-500 font-mono pt-1">
                <span>Govt of India Protocol</span>
                <span>Cryptographic SHA-256 Ledger</span>
              </div>
            </div>
          </div>

          {/* Action Bar (Print sticker & Test Scan) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:flex-1 py-3 bg-stone-900 hover:bg-stone-950 text-amber-300 font-bold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t.generator.printBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onTestVerify(activeCode);
                onClose();
              }}
              className="w-full sm:flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t.generator.testScanBtn}</span>
            </button>
          </div>

          {/* Direct URL copy helper */}
          <div className="bg-stone-100 p-2.5 rounded-xl border border-stone-300 flex items-center justify-between gap-2 text-[11px] font-mono text-stone-700 print:hidden">
            <span className="truncate">Encodes: {customerScanUrl}</span>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="text-stone-600 hover:text-stone-900 p-1 cursor-pointer shrink-0"
              title="Copy Customer Verification URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
