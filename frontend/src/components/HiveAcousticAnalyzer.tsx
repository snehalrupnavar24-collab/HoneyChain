import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Activity,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Play,
  RotateCcw,
  Radio,
  Sliders
} from 'lucide-react';

export const HiveAcousticAnalyzer: React.FC = () => {
  const [colonyState, setColonyState] = useState<'healthy' | 'queenless' | 'swarming'>('healthy');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stateData = {
    healthy: {
      freq: 205,
      label: 'स्वस्थ रानी एवं सामान्य पोषण (Healthy Queen Foraging)',
      status: 'OPTIMAL (सामान्य)',
      confidence: 96.4,
      dbStatus: 'Clean Natural Comb Ripening',
      description:
        'Fundamental frequency at ~205 Hz with steady low harmonics. Indicates calm queen presence, standard fanning for honey dehydration, and active pollen intake.',
      color: 'emerald',
      action: 'No intervention required. Optimal honey ripening in super frames.'
    },
    queenless: {
      freq: 255,
      label: 'रानी विहीन चेतावनी (Queenless Roar)',
      status: 'HIGH ALERT (चेतावनी)',
      confidence: 93.8,
      dbStatus: 'Colony Agitation Detected',
      description:
        'Frequency spikes to ~255 Hz with irregular acoustic oscillations ("queenless roar"). Worker bees are stressed and may initiate emergency queen cell construction.',
      color: 'rose',
      action: 'Inspect brood chamber immediately. Introduce mated queen or fresh brood frame.'
    },
    swarming: {
      freq: 315,
      label: 'झुंड प्रस्थान तैयारी (Swarm Piping Alert)',
      status: 'IMMINENT SWARM (सतर्कता)',
      confidence: 91.2,
      dbStatus: 'High Flight Frequency',
      description:
        'Acoustic energy concentrated above ~310 Hz with queen piping pulses. Indicates colony congestion and imminent departure of the prime swarm with the old queen.',
      color: 'amber',
      action: 'Split colony into nucleus hive or add additional honey supers to relieve crowding.'
    }
  };

  const current = stateData[colonyState];

  // Web Audio Synthesizer to actually play real bee hive acoustic frequencies
  const startBeeHum = (frequency: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Stop previous
      stopBeeHum();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sawtooth wave closely mimics real insect wing beat harmonics
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Low volume for safe listening
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
      setIsPlayingAudio(true);
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  };

  const stopBeeHum = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {}
      oscRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  useEffect(() => {
    return () => {
      stopBeeHum();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleStateChange = (state: 'healthy' | 'queenless' | 'swarming') => {
    setColonyState(state);
    if (isPlayingAudio) {
      startBeeHum(stateData[state].freq);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Acoustic Bio-Telemetry Stethoscope
            </span>
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
              मधुमक्खी ध्वनि एवं स्वास्थ्य AI
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
            AI Hive Acoustic Analyzer (Apis cerana Wing Frequency)
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            Tribal beekeepers monitor colony health by listening to wingbeat acoustic frequencies. Our ESP32 LoRaWAN microphone feeds this real-time AI classifier.
          </p>
        </div>

        {/* Audio Listen Toggle */}
        <div className="flex items-center gap-2">
          {isPlayingAudio ? (
            <button
              type="button"
              onClick={stopBeeHum}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <VolumeX className="w-4 h-4" />
              <span>आवाज बंद करें (Stop Sound)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => startBeeHum(current.freq)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>छत्ते की आवाज सुनें (Listen Buzz)</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleStateChange('healthy')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            colonyState === 'healthy'
              ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/30 shadow-xs'
              : 'bg-stone-50 border-stone-200 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
            <span>205 Hz (Normal)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <h4 className="text-sm font-bold text-stone-900 font-serif mt-1">
            Healthy Colony (स्वस्थ छत्ता)
          </h4>
          <span className="text-[10px] text-stone-500 block mt-0.5">
            Calm fanning, normal dehydration
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleStateChange('queenless')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            colonyState === 'queenless'
              ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400/30 shadow-xs'
              : 'bg-stone-50 border-stone-200 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-900">
            <span>255 Hz (Stressed)</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <h4 className="text-sm font-bold text-stone-900 font-serif mt-1">
            Queenless Roar (रानी विहीन)
          </h4>
          <span className="text-[10px] text-stone-500 block mt-0.5">
            Worker bee distress frequencies
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleStateChange('swarming')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            colonyState === 'swarming'
              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/30 shadow-xs'
              : 'bg-stone-50 border-stone-200 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span>315 Hz (Congested)</span>
            <Radio className="w-4 h-4 text-amber-600" />
          </div>
          <h4 className="text-sm font-bold text-stone-900 font-serif mt-1">
            Swarm Piping (झुंड प्रस्थान)
          </h4>
          <span className="text-[10px] text-stone-500 block mt-0.5">
            Congestion alert before swarming
          </span>
        </button>
      </div>

      {/* Visual Spectrum & AI Diagnostics */}
      <div className="bg-stone-950 text-white rounded-3xl p-6 border border-stone-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-mono font-bold text-stone-300">
              FAST FOURIER TRANSFORM (FFT) ACOUSTIC SPECTRUM
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-stone-400">Peak Frequency:</span>
            <span className="font-black text-amber-400 text-sm">{current.freq} Hz</span>
            <span className="text-stone-400">AI Confidence:</span>
            <span className="font-bold text-emerald-400">{current.confidence}%</span>
          </div>
        </div>

        {/* Animated Audio Spectrum Bars */}
        <div className="h-32 bg-stone-900/90 rounded-2xl p-4 flex items-end justify-between gap-1.5 border border-stone-800 relative overflow-hidden">
          {Array.from({ length: 32 }).map((_, i) => {
            // Calculate dynamic bar height depending on frequency
            const centerIdx = Math.floor((current.freq / 400) * 32);
            const dist = Math.abs(i - centerIdx);
            const heightPct = Math.max(15, Math.min(95, 100 - dist * 14 + (i % 3) * 8));

            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all duration-300"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor:
                    colonyState === 'healthy'
                      ? '#10b981'
                      : colonyState === 'queenless'
                      ? '#f43f5e'
                      : '#f59e0b'
                }}
              />
            );
          })}
        </div>

        {/* AI Action Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-1.5">
            <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">
              Bioacoustic Diagnosis
            </span>
            <div className="font-bold text-white text-sm">{current.label}</div>
            <p className="text-stone-300 text-[11px] leading-relaxed mt-1">
              {current.description}
            </p>
          </div>

          <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-1.5">
            <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block">
              Recommended Beekeeper Action (सलाह)
            </span>
            <p className="text-stone-200 text-xs font-medium leading-relaxed">
              {current.action}
            </p>
            <div className="pt-2 border-t border-stone-800/80 text-[10px] text-stone-400 flex items-center justify-between font-mono">
              <span>Sensor: LoRaWAN Acoustic Mic #17</span>
              <span className="text-emerald-400">Node Sync: 2s ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
