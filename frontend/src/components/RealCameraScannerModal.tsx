import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Shuffle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Flame,
  Droplets,
  Layers
} from 'lucide-react';

interface RealCameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (scannedCode: string) => void;
}

export const RealCameraScannerModal: React.FC<RealCameraScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const [activeMode, setActiveMode] = useState<'camera' | 'file' | 'presets'>('camera');
  const [cameraRunning, setCameraRunning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isDecodingFile, setIsDecodingFile] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileScannerRef = useRef<Html5Qrcode | null>(null);

  const playSoftBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch {}
  };

  const extractBatchCode = (rawText: string): string => {
    let clean = rawText.trim();
    try {
      if (clean.startsWith('http://') || clean.startsWith('https://')) {
        const url = new URL(clean);
        const batchParam =
          url.searchParams.get('batch') ||
          url.searchParams.get('code') ||
          url.searchParams.get('lot');
        if (batchParam) return batchParam.trim();
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length > 0) {
          return parts[parts.length - 1].trim();
        }
      }
    } catch {}
    return clean;
  };

  const handleDecoded = (rawText: string) => {
    playSoftBeep();
    const cleanCode = extractBatchCode(rawText);
    stopScanner();
    onScanSuccess(cleanCode);
    onClose();
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().then(() => {
            scannerRef.current?.clear();
          }).catch(() => {});
        }
      } catch {}
      scannerRef.current = null;
    }
    setCameraRunning(false);
  };

  const startScanner = async (facing: 'environment' | 'user' = facingMode) => {
    stopScanner();
    setCameraError(null);

    const regionId = 'honeychain-live-qr-reader';
    const element = document.getElementById(regionId);
    if (!element) return;

    try {
      const qrScanner = new Html5Qrcode(regionId);
      scannerRef.current = qrScanner;

      await qrScanner.start(
        { facingMode: facing },
        {
          fps: 12,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const edge = Math.min(viewfinderWidth, viewfinderHeight);
            const size = Math.max(180, Math.floor(edge * 0.75));
            return { width: size, height: size };
          },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleDecoded(decodedText);
        },
        () => {
          // Frame parse error: expected on frames without QR
        }
      );
      setCameraRunning(true);
      setCameraError(null);
    } catch (err: any) {
      console.warn('Real camera error:', err);
      setCameraRunning(false);
      const errMsg = err?.message || String(err);
      if (errMsg.includes('NotAllowedError') || errMsg.includes('Permission')) {
        setCameraError(
          'Camera permission denied. Please allow camera access in browser settings, or use the "Upload Photo" / "Preset" options.'
        );
      } else if (errMsg.includes('NotFoundError') || errMsg.includes('no camera')) {
        setCameraError(
          'No camera detected on this device. Please use the "Upload Photo" or "Presets" options.'
        );
      } else {
        setCameraError(
          `Camera could not be accessed (${errMsg}). Please use the "Upload Photo" or "Presets" options.`
        );
      }
    }
  };

  const toggleFacingMode = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    if (cameraRunning) {
      startScanner(next);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    if (activeMode === 'camera') {
      const timer = setTimeout(() => {
        startScanner(facingMode);
      }, 250);
      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    } else {
      stopScanner();
    }
  }, [isOpen, activeMode]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDecodingFile(true);
    try {
      const regionId = 'honeychain-file-qr-reader';
      const qrScanner = new Html5Qrcode(regionId);
      fileScannerRef.current = qrScanner;

      const decodedText = await qrScanner.scanFile(file, true);
      qrScanner.clear();
      setIsDecodingFile(false);
      handleDecoded(decodedText);
    } catch (err) {
      setIsDecodingFile(false);
      alert('Could not detect a valid QR code in this image. Please make sure the QR code is clearly visible, or pick one of the random jar presets below.');
    }
  };

  const generateRandomBatch = () => {
    const prefixes = ['MAHA', 'KASH', 'SUND', 'HIMA', 'COORG', 'GIR'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomLot = String(Math.floor(Math.random() * 900) + 100);
    const randomSeq = String(Math.floor(Math.random() * 9000) + 1000);
    const randomCode = `PKG-${randomPrefix}-${randomLot}-${randomSeq}`;
    handleDecoded(randomCode);
  };

  if (!isOpen) return null;

  const presets = [
    {
      code: 'PKG-MAHA-042-2697',
      name: 'Western Ghats Jamun Honey (100% Pure)',
      badge: 'Verified FSSAI / KVIC',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Kas Plateau Flora, Lead Beekeeper Ramesh Patil. EA-IRMS 0.0% C4 Sugars.'
    },
    {
      code: 'PKG-KASH-019-8832',
      name: 'Kashmir White Acacia Honey (100% Pure)',
      badge: 'High Altitude Harvest',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Pampore Pulwama Apiary, Ghulam Mohammad. Diastase 16.2 DN, 16.5% moisture.'
    },
    {
      code: 'PKG-SUND-005-4190',
      name: 'Sunderbans Wild Mangrove Honey (100% Pure)',
      badge: 'GI Protected Origin',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      description: 'Gosaba Island Reserve, Traditional Mouly Harvester Subhash Mondal.'
    },
    {
      code: 'COMMERCIAL-MARKET-SYRUP-404',
      name: 'Market Commercial Honey Jar (Unverified / Adulterated)',
      badge: '⚠️ High Adulteration Risk',
      badgeColor: 'bg-red-100 text-red-800 border-red-300',
      description: 'Commercial brand lacking KVIC blockchain anchor. 42% C4 Invert Sugar Syrup detected.'
    }
  ];

  return (
    <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      {/* Hidden container for file scanning */}
      <div id="honeychain-file-qr-reader" className="hidden" />

      <div className="bg-[#FAF7F0] text-stone-900 rounded-3xl max-w-lg w-full border-2 border-amber-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#122A1C] text-amber-100 p-4 sm:p-5 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white font-serif tracking-wide">
                  Live Honey Jar QR Scanner
                </h3>
                <span className="text-[10px] font-mono font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full">
                  Real Capture
                </span>
              </div>
              <p className="text-xs text-emerald-300">
                असली कैमरा, फोटो अपलोड, या किसी भी रैंडम शहद जार की जांच करें
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="text-stone-300 hover:text-white p-1.5 rounded-lg hover:bg-emerald-900/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-amber-100/70 p-2 border-b border-amber-200 flex items-center justify-around gap-1 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode('camera')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'camera'
                ? 'bg-stone-900 text-amber-400 shadow-xs'
                : 'text-stone-700 hover:bg-white/80'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>1. Live Camera</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('file')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'file'
                ? 'bg-stone-900 text-amber-400 shadow-xs'
                : 'text-stone-700 hover:bg-white/80'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>2. Upload Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('presets')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'presets'
                ? 'bg-stone-900 text-amber-400 shadow-xs'
                : 'text-stone-700 hover:bg-white/80'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>3. Random Presets</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: REAL LIVE CAMERA FEED */}
          {activeMode === 'camera' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] text-stone-600">
                <span>Point your webcam or phone camera at any Honey Jar QR:</span>
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className="text-amber-900 hover:text-amber-950 font-bold flex items-center gap-1 underline cursor-pointer"
                  title="Switch between front and back camera"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Switch Camera ({facingMode === 'environment' ? 'Rear' : 'Front'})</span>
                </button>
              </div>

              {/* Viewfinder Container */}
              <div className="relative aspect-square w-full max-w-[320px] mx-auto bg-stone-950 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-inner flex items-center justify-center">
                {/* Html5Qrcode video mounting element */}
                <div id="honeychain-live-qr-reader" className="w-full h-full" />

                {/* Laser animation when running */}
                {cameraRunning && (
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse pointer-events-none" />
                )}

                {/* Fallback state if camera error */}
                {cameraError && (
                  <div className="absolute inset-0 bg-stone-950/95 p-4 flex flex-col items-center justify-center text-center space-y-3 z-10">
                    <AlertCircle className="w-8 h-8 text-amber-400" />
                    <p className="text-amber-200 text-xs leading-relaxed max-w-xs">
                      {cameraError}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => startScanner(facingMode)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Retry Camera
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMode('file')}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Upload QR Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-center text-[11px] text-stone-500">
                ✨ Automatically scans standard QR codes, URLs, and HoneyChain batch labels.
              </p>
            </div>
          )}

          {/* TAB 2: UPLOAD IMAGE / PHOTO OF QR */}
          {activeMode === 'file' && (
            <div className="space-y-4 text-center">
              <div className="space-y-1">
                <h4 className="font-bold text-stone-900 text-sm font-serif">
                  Scan QR from a Photo or Screenshot
                </h4>
                <p className="text-stone-600 max-w-sm mx-auto">
                  Took a photo of a honey jar label? Or have a screenshot of a QR code? Upload it here to decode instantly:
                </p>
              </div>

              <label className="block p-8 border-2 border-dashed border-amber-400 rounded-2xl bg-white hover:bg-amber-50/50 cursor-pointer transition-colors space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 text-xs block">
                    {isDecodingFile ? 'Decoding Image...' : 'Click to Browse or Take Photo'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Supports JPG, PNG, WEBP, or Camera capture
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  disabled={isDecodingFile}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* TAB 3: RANDOM HONEY JAR PRESETS & MANUAL CODE */}
          {activeMode === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-xs font-serif">
                  Test Any Random Honey Jar Batch:
                </span>
                <button
                  type="button"
                  onClick={generateRandomBatch}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-[11px] flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>Generate Random Batch</span>
                </button>
              </div>

              {/* Presets List */}
              <div className="space-y-2">
                {presets.map((p) => (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => handleDecoded(p.code)}
                    className="w-full text-left p-3 rounded-2xl bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-400 transition-all shadow-2xs space-y-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-stone-900 text-xs truncate">
                        {p.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-amber-900 font-semibold">
                      {p.code}
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {p.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MANUAL ENTRY FALLBACK (ALWAYS VISIBLE AT BOTTOM) */}
          <div className="pt-2 border-t border-stone-200 space-y-2">
            <span className="text-[11px] text-stone-500 font-medium block">
              Or test with custom QR text or URL:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g. PKG-KASH-019-8832 or https://..."
                className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono focus:outline-hidden focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (manualCode.trim()) {
                    handleDecoded(manualCode);
                  }
                }}
                disabled={!manualCode.trim()}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-950 text-amber-300 font-bold text-xs rounded-xl transition-all disabled:opacity-40 cursor-pointer"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
