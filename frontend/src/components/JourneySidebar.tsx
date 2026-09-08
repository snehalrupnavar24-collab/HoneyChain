import React from 'react';
import {
  QrCode,
  Radio,
  Scale,
  FlaskConical,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Printer,
  Database
} from 'lucide-react';

interface JourneySidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onScanClick: () => void;
  onCertificateClick: () => void;
}

export const JourneySidebar: React.FC<JourneySidebarProps> = ({
  activeTab,
  setActiveTab,
  onScanClick,
  onCertificateClick,
}) => {
  const steps = [
    {
      id: 'consumer',
      num: '01',
      title: 'Consumer Verification',
      subtitle: 'Public QR Portal',
      metric: 'Batch PKG-MAHA-042 • 500g Jar',
      status: 'Verified',
      icon: QrCode,
    },
    {
      id: 'beekeeper',
      num: '02',
      title: 'Beekeeper Field Log',
      subtitle: 'Grassroots Apiary Log',
      metric: 'Hive #17 • 34.5°C • Voice Log',
      status: 'Signed',
      icon: Radio,
    },
    {
      id: 'collection',
      num: '03',
      title: 'Mandi Weighment Scale',
      subtitle: 'APMC Aggregation',
      metric: '8.02 kg Measured • 0% Tare',
      status: 'Reconciled',
      icon: Scale,
    },
    {
      id: 'processing',
      num: '04',
      title: 'Processing & NABL Lab',
      subtitle: 'Quality & Serialization',
      metric: '17.8% Moisture • 0% C4 Sugar',
      status: 'Certified',
      icon: FlaskConical,
    },
    {
      id: 'admin',
      num: '05',
      title: 'Regulatory Audit Console',
      subtitle: 'Merkle DAG & Governance',
      metric: '6 Anchored Blocks • SHA-256',
      status: 'Audited',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Main Sequential Pipeline Card */}
      <div className="bg-white/95 rounded-2xl border border-stone-200/90 shadow-sm p-4 backdrop-blur-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-stone-200">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 block">
              Physical Custody Flow
            </span>
            <h3 className="text-sm font-bold text-stone-900 font-serif">
              5 Sequential Stations
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
            Stages 01–05
          </span>
        </div>

        {/* Connected Vertical Steps */}
        <div className="relative space-y-1.5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activeTab === step.id;
            const isDone = steps.findIndex(s => s.id === activeTab) > idx;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveTab(step.id)}
                className={`w-full text-left p-2.5 rounded-xl transition-all relative z-10 flex items-start gap-3 group cursor-pointer ${
                  isCurrent
                    ? 'bg-stone-900 text-amber-400 shadow-md ring-2 ring-amber-400/40'
                    : 'hover:bg-amber-50/70 text-stone-700 bg-stone-50/60 border border-stone-200/60'
                }`}
              >
                {/* Number Badge with Status Icon */}
                <div
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-mono font-black text-xs transition-all shadow-2xs ${
                    isCurrent
                      ? 'bg-amber-500 text-stone-950 ring-2 ring-white/30'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-stone-600 border border-stone-300 group-hover:border-amber-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    step.num
                  )}
                </div>

                {/* Text Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider truncate block ${
                        isCurrent ? 'text-amber-300/90 font-black' : 'text-amber-900/80'
                      }`}
                    >
                      {step.subtitle}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono shrink-0 ${
                        isCurrent
                          ? 'bg-stone-800 text-amber-300'
                          : isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>

                  <h4
                    className={`text-xs font-bold leading-tight truncate mt-0.5 ${
                      isCurrent ? 'text-white font-black' : 'text-stone-900 group-hover:text-amber-900'
                    }`}
                  >
                    {step.title}
                  </h4>

                  <p
                    className={`text-[10px] font-mono truncate mt-0.5 ${
                      isCurrent ? 'text-stone-400' : 'text-stone-500'
                    }`}
                  >
                    {step.metric}
                  </p>
                </div>

                {/* Right Arrow / Icon */}
                <div className="shrink-0 pt-1">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isCurrent
                        ? 'text-amber-400'
                        : 'text-stone-400 group-hover:text-amber-700'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Actions in Sidebar */}
        <div className="pt-3.5 mt-3.5 border-t border-stone-200 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onScanClick}
            className="px-2.5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>

          <button
            type="button"
            onClick={onCertificateClick}
            className="px-2.5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>NABL Cert</span>
          </button>
        </div>
      </div>

      {/* 2. Active Sample Batch Focus Card with Authentic Photography */}
      <div className="bg-white/95 rounded-2xl border border-stone-200/90 shadow-sm p-3.5 backdrop-blur-xs space-y-2.5 overflow-hidden">
        {/* Real Honey Visual Banner */}
        <div className="relative h-24 rounded-xl overflow-hidden shadow-xs border border-amber-300">
          <img
            src="https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=500&q=80"
            alt="Pure Raw Jamun Honey Flow"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex items-end p-2.5">
            <div className="text-white">
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider bg-amber-500 text-stone-950 px-1.5 py-0.2 rounded inline-block">
                Raw Unadulterated
              </span>
              <div className="text-xs font-bold font-serif leading-tight text-amber-100">
                Wild Jamun Nectar (Mahabaleshwar)
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <span className="font-bold text-stone-800 font-serif flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Batch Focus
          </span>
          <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
            FSSAI Tested
          </span>
        </div>

        <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200 text-xs space-y-1">
          <div className="flex justify-between font-mono text-[11px]">
            <span className="text-stone-500">Batch Code:</span>
            <span className="font-bold text-stone-900">PKG-MAHA-042-2697</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-stone-500">Botanical Flora:</span>
            <span className="font-semibold text-stone-800">Syzygium cumini (Jamun)</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-stone-500">Lead Beekeeper:</span>
            <span className="font-semibold text-stone-800">Ramesh Tukaram Patil</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-stone-500">Origin Geo:</span>
            <span className="text-stone-700">Mahabaleshwar, MH (17.92° N)</span>
          </div>
        </div>
      </div>

      {/* 3. Live System Telemetry Card */}
      <div className="bg-[#102317] text-stone-300 rounded-2xl p-3.5 border border-emerald-950 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            Chain Telemetry
          </span>
          <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
            SYNCHRONIZED
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/40">
            <span className="text-stone-400 block">Postgres DB</span>
            <span className="text-emerald-300 font-bold">42 Seeded Rows</span>
          </div>
          <div className="bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/40">
            <span className="text-stone-400 block">Merkle Ledger</span>
            <span className="text-amber-300 font-bold">Block #18,409</span>
          </div>
          <div className="bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/40">
            <span className="text-stone-400 block">Yield ML Model</span>
            <span className="text-white font-bold">XGBoost 94.8%</span>
          </div>
          <div className="bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/40">
            <span className="text-stone-400 block">Adulteration Risk</span>
            <span className="text-emerald-400 font-bold">0.0% (Pure)</span>
          </div>
        </div>

        <div className="pt-2 border-t border-emerald-900/60 text-[10px] text-stone-400 flex items-center justify-between">
          <span>KVIC Kisan Helpline:</span>
          <span className="font-bold text-amber-400 font-mono">1800-180-1551</span>
        </div>
      </div>
    </div>
  );
};
