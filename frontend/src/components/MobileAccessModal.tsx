import React, { useState } from 'react';
import {
  Smartphone,
  QrCode,
  Camera,
  Copy,
  Check,
  X,
  Wifi,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';

interface MobileAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  localIp: string;
  port: string;
}

export const MobileAccessModal: React.FC<MobileAccessModalProps> = ({
  isOpen,
  onClose,
  localIp,
  port
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'open-site' | 'scan-jar' | 'how-to'>('open-site');

  if (!isOpen) return null;

  const mobileUrl = `http://${localIp}:${port}/`;
  const jarScanUrl = `http://${localIp}:${port}/?batch=PKG-MAHA-042-2697`;

  const copyUrl = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-[#FAF7F0] text-stone-900 rounded-3xl max-w-lg w-full border-2 border-amber-800/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#122A1C] text-amber-100 p-4 sm:p-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white font-serif tracking-wide">
                  Mobile Access & QR Scanner Hub
                </h3>
                <span className="text-[10px] font-mono font-bold bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full">
                  SIH 2026
                </span>
              </div>
              <p className="text-xs text-emerald-300">
                फोन पर कैसे खोलें और QR कोड कैसे स्कैन करें
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-amber-100/70 p-2 border-b border-amber-200 flex items-center justify-around gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('open-site')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'open-site'
                ? 'bg-stone-900 text-amber-400 shadow-xs'
                : 'text-stone-700 hover:bg-white/80'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>1. Open on Phone</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scan-jar')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'scan-jar'
                ? 'bg-stone-900 text-amber-400 shadow-xs'
                : 'text-stone-700 hover:bg-white/80'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>2. Honey Jar QR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('how-to')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'how-to'
                ? 'bg-stone-900 text-amber-400 shadow-xs'
                : 'text-stone-700 hover:bg-white/80'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>3. Camera Guide</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* TAB 1: OPEN ON MOBILE PHONE */}
          {activeTab === 'open-site' && (
            <div className="space-y-4 text-center">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900">
                  Step 1: Open Website on Mobile Device
                </span>
                <h4 className="text-base font-bold text-stone-900 font-serif">
                  Scan to Open HoneyChain on Your Phone
                </h4>
                <p className="text-stone-600 max-w-sm mx-auto">
                  Make sure your mobile phone is connected to the same Wi-Fi or hotspot. Point your phone camera at this QR code:
                </p>
              </div>

              {/* Scannable QR Code */}
              <div className="inline-block p-4 bg-white rounded-2xl border-2 border-amber-300 shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                    mobileUrl
                  )}&color=12-42-28&bgcolor=255-255-255`}
                  alt="QR Code to Open on Phone"
                  className="w-48 h-48 mx-auto"
                />
                <span className="text-[10px] font-mono text-stone-500 mt-2 block">
                  Encodes: {mobileUrl}
                </span>
              </div>

              {/* URL & Direct Copy Button */}
              <div className="bg-stone-100 p-3 rounded-2xl border border-stone-300 space-y-2 max-w-sm mx-auto text-left">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 font-medium">Or type this in mobile browser:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> Same Wi-Fi
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-xl border border-stone-200 font-mono text-xs font-bold text-stone-900">
                  <span className="truncate">{mobileUrl}</span>
                  <button
                    type="button"
                    onClick={() => copyUrl(mobileUrl)}
                    className="text-amber-800 hover:text-amber-950 p-1 cursor-pointer"
                    title="Copy URL"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SAMPLE HONEY JAR QR CODE */}
          {activeTab === 'scan-jar' && (
            <div className="space-y-4 text-center">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900">
                  Step 2: Consumer Physical Jar Test
                </span>
                <h4 className="text-base font-bold text-stone-900 font-serif">
                  Scan This Sample Jar QR With Your Phone
                </h4>
                <p className="text-stone-600 max-w-sm mx-auto">
                  Open your phone's camera (Google Lens / iPhone Camera) and scan this QR code. It will instantly verify Batch PKG-MAHA-042!
                </p>
              </div>

              {/* Scannable Jar QR Code */}
              <div className="inline-block p-4 bg-white rounded-2xl border-2 border-emerald-500 shadow-md relative">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                    jarScanUrl
                  )}&color=12-42-28&bgcolor=255-255-255`}
                  alt="Honey Jar QR Code"
                  className="w-48 h-48 mx-auto"
                />
                <div className="mt-2 bg-amber-50 py-1 px-2 rounded-lg border border-amber-200 text-[10px] font-mono font-bold text-amber-950">
                  BATCH: PKG-MAHA-042-2697 (Jamun Honey)
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-300 text-left max-w-sm mx-auto space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Instant Verification On Mobile:</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-snug">
                  When scanned with a phone, it opens the backward provenance timeline, displays lead beekeeper Ramesh Patil's bio, and allows downloading the official NABL certificate!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CAMERA GUIDE */}
          {activeTab === 'how-to' && (
            <div className="space-y-4">
              <div className="space-y-1 text-center">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900">
                  Step 3: In-App Camera Scanning
                </span>
                <h4 className="text-base font-bold text-stone-900 font-serif">
                  How In-App QR Scanning Works
                </h4>
              </div>

              <div className="space-y-3">
                <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900 text-xs">Click "Scan Jar QR" Button</h5>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      Found in the top navigation bar or the hero section of the website.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900 text-xs">Allow Camera Permission</h5>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      The browser opens your device's webcam or mobile rear camera with optical autofocus and audio chime feedback.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900 text-xs">Point at Honey Jar or Tap Simulate</h5>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      Hold the honey bottle QR within the scanning frame, or hit "Simulate Scan" for instant hackathon demonstration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <span>IP: <strong className="font-mono text-stone-900">{localIp}:{port}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
