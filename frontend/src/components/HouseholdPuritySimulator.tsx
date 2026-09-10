import React, { useState } from 'react';
import {
  Flame,
  Droplets,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FlaskConical,
  Award,
  HelpCircle,
  Play
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HouseholdPuritySimulator: React.FC = () => {
  const { lang, t } = useLanguage();
  const [activeTest, setActiveTest] = useState<'water' | 'flame'>('water');
  const [sampleType, setSampleType] = useState<'pure' | 'adulterated'>('pure');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationComplete(false);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setSimulationComplete(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              {t.puritySim.tag}
            </span>
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
              {t.puritySim.badge}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
            {t.puritySim.title}
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            {t.puritySim.subtitle}
          </p>
        </div>

        {/* Test Selector Tabs */}
        <div className="flex rounded-xl border border-stone-300 bg-stone-50 p-1 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTest('water');
              handleReset();
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTest === 'water'
                ? 'bg-amber-500 text-stone-950 shadow-xs font-black'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>{t.puritySim.waterTest}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTest('flame');
              handleReset();
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTest === 'flame'
                ? 'bg-amber-500 text-stone-950 shadow-xs font-black'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{t.puritySim.flameTest}</span>
          </button>
        </div>
      </div>

      {/* Interactive Testing Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 5 Cols: Sample Switcher & Physics Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              {t.puritySim.selectSamplePrompt}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSampleType('pure');
                  handleReset();
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  sampleType === 'pure'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/30'
                    : 'bg-stone-50 border-stone-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>Batch PKG-MAHA-042</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-sm font-bold text-stone-900 font-serif mt-1">
                  {t.puritySim.pureSampleTitle}
                </div>
                <span className="text-[10px] font-mono text-emerald-700 mt-1 block">
                  {t.puritySim.pureSampleStats}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSampleType('adulterated');
                  handleReset();
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  sampleType === 'adulterated'
                    ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400/30'
                    : 'bg-stone-50 border-stone-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                  <span>Commercial Sample</span>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-sm font-bold text-stone-900 font-serif mt-1">
                  {t.puritySim.adulteratedSampleTitle}
                </div>
                <span className="text-[10px] font-mono text-rose-700 mt-1 block">
                  {t.puritySim.adulteratedSampleStats}
                </span>
              </button>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs text-stone-700 space-y-2">
            <h4 className="font-bold text-amber-950 font-serif flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              {activeTest === 'water'
                ? t.puritySim.waterScienceTitle
                : t.puritySim.flameScienceTitle}
            </h4>
            <p className="leading-relaxed">
              {activeTest === 'water'
                ? t.puritySim.waterScienceDesc
                : t.puritySim.flameScienceDesc}
            </p>
          </div>

          {/* Action Trigger Button */}
          <button
            type="button"
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>
              {isSimulating
                ? t.puritySim.runningSim
                : (activeTest === 'water' ? t.puritySim.runWaterBtn : t.puritySim.runFlameBtn)}
            </span>
          </button>
        </div>

        {/* Right 7 Cols: Animated Visual Simulation Tank */}
        <div className="lg:col-span-7 bg-stone-900 text-white rounded-3xl p-6 border border-stone-800 shadow-md relative overflow-hidden min-h-[300px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-3">
            <span className="font-mono text-amber-400 font-bold flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4" />
              {activeTest === 'water' ? t.puritySim.vesselWaterTitle : t.puritySim.vesselFlameTitle}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                sampleType === 'pure'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-rose-950 text-rose-300 border border-rose-700'
              }`}
            >
              {sampleType === 'pure' ? t.puritySim.pureVesselBadge : t.puritySim.adulteratedVesselBadge}
            </span>
          </div>

          {/* Dynamic Visual Stage */}
          <div className="py-6 flex items-center justify-center">
            {activeTest === 'water' ? (
              /* Water Test Simulation: Glass Beaker */
              <div className="relative w-44 h-56 border-4 border-t-0 border-blue-400/60 rounded-b-3xl bg-blue-950/40 backdrop-blur-xs flex flex-col justify-end p-2 overflow-hidden shadow-inner">
                {/* Water Surface Line */}
                <div className="absolute top-8 left-0 right-0 h-0.5 bg-blue-400/80 border-t border-dashed border-cyan-300">
                  <span className="absolute -top-4 right-1 text-[9px] font-mono text-cyan-300">
                    H2O (25°C)
                  </span>
                </div>

                {/* Animated Droplet State */}
                {isSimulating && (
                  <div className="absolute top-9 left-1/2 -translate-x-1/2 w-4 h-5 rounded-full bg-amber-400 animate-bounce shadow-md" />
                )}

                {simulationComplete && sampleType === 'pure' && (
                  /* Pure Honey Dropped to bottom intact */
                  <div className="w-full flex flex-col items-center animate-in zoom-in-50 duration-500">
                    <div className="w-28 h-10 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 border-2 border-amber-300 shadow-[0_0_15px_#f59e0b] flex items-center justify-center text-[10px] font-mono font-bold text-stone-950">
                      {t.puritySim.waterPureResult}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold mt-1 font-mono">
                      ✓ 17.8% Moisture
                    </span>
                  </div>
                )}

                {simulationComplete && sampleType === 'adulterated' && (
                  /* Adulterated honey dispersed cloudy */
                  <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-500 bg-amber-700/40 rounded-b-2xl">
                    <div className="text-center p-2">
                      <span className="text-xs font-bold text-rose-300 block font-mono">
                        ✗ {t.puritySim.waterAdulteratedResult}
                      </span>
                      <span className="text-[10px] text-rose-200 mt-1 block">
                        {t.puritySim.adulteratedVerdict}
                      </span>
                    </div>
                  </div>
                )}

                {!simulationComplete && !isSimulating && (
                  <div className="text-center text-xs text-stone-400 py-16">
                    {t.puritySim.clickPrompt}
                  </div>
                )}
              </div>
            ) : (
              /* Flame Test Simulation: Cotton Wick */
              <div className="relative flex flex-col items-center justify-center space-y-4">
                {/* Flame Graphic */}
                <div className="relative w-20 h-28 flex items-center justify-center">
                  {simulationComplete && sampleType === 'pure' && (
                    <div className="relative flex flex-col items-center animate-in zoom-in-75 duration-300">
                      <div className="w-12 h-18 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 blur-xs animate-pulse shadow-[0_0_25px_#f97316]" />
                      <span className="text-[10px] font-bold text-emerald-400 font-mono mt-2">
                        ✓ {t.puritySim.flamePureResult}
                      </span>
                    </div>
                  )}

                  {simulationComplete && sampleType === 'adulterated' && (
                    <div className="relative flex flex-col items-center animate-in zoom-in-75 duration-300">
                      <div className="w-4 h-4 rounded-full bg-stone-600 blur-xs animate-ping" />
                      <span className="text-lg">💨</span>
                      <span className="text-[10px] font-bold text-rose-400 font-mono mt-2">
                        ✗ {t.puritySim.flameAdulteratedResult}
                      </span>
                    </div>
                  )}

                  {!simulationComplete && !isSimulating && (
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-stone-600 flex items-center justify-center text-xs text-stone-500">
                      Wick
                    </div>
                  )}
                </div>

                {/* Cotton Candle Base */}
                <div className="w-16 h-12 bg-stone-800 rounded-t-lg border border-stone-700 flex items-center justify-center text-[10px] font-mono text-stone-400">
                  Dipped Wick
                </div>
              </div>
            )}
          </div>

          {/* Outcome Verdict Card */}
          <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800 text-xs">
            {simulationComplete ? (
              <div className="flex items-start gap-2.5">
                {sampleType === 'pure' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-300 block">
                        {t.puritySim.verdictPurePassed}
                      </span>
                      <p className="text-[11px] text-stone-300 mt-0.5">
                        {activeTest === 'water'
                          ? t.puritySim.verdictPureWaterDesc
                          : t.puritySim.verdictPureFlameDesc}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-300 block">
                        {t.puritySim.verdictAdulteratedFailed}
                      </span>
                      <p className="text-[11px] text-stone-300 mt-0.5">
                        {activeTest === 'water'
                          ? t.puritySim.verdictAdulteratedWaterDesc
                          : t.puritySim.verdictAdulteratedFlameDesc}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center text-stone-400 text-[11px]">
                {t.puritySim.clickPrompt}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
