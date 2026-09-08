import React from 'react';
import {
  QrCode,
  Radio,
  Scale,
  FlaskConical,
  ShieldCheck,
  ChevronRight,
  Camera,
  Printer,
  Sparkles,
  CheckCircle2,
  Lock,
  Award
} from 'lucide-react';

interface JourneyStepperProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onScanClick: () => void;
  onCertificateClick: () => void;
}

export const JourneyStepper: React.FC<JourneyStepperProps> = ({
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
      role: 'Public QR Portal',
      meta: 'Batch PKG-MAHA-042 • 500g Jar',
      status: 'Verified',
      icon: QrCode,
    },
    {
      id: 'beekeeper',
      num: '02',
      title: 'Beekeeper Field Log',
      role: 'Grassroots Production',
      meta: 'Hive 17 • 34.5°C • Voice Log',
      status: 'Signed',
      icon: Radio,
    },
    {
      id: 'collection',
      num: '03',
      title: 'Mandi Weighment Scale',
      role: 'Aggregation & Transit',
      meta: '8.02 kg Measured • 0% Variance',
      status: 'Reconciled',
      icon: Scale,
    },
    {
      id: 'processing',
      num: '04',
      title: 'Processing & NABL Lab',
      role: 'Quality & Serialization',
      meta: '17.8% Moisture • Zero C4 Sugar',
      status: 'Certified',
      icon: FlaskConical,
    },
    {
      id: 'admin',
      num: '05',
      title: 'Regulatory Audit Console',
      role: 'Governance & Merkle DAG',
      meta: '6 Anchored Blocks • SHA-256',
      status: 'Audited',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="bg-white/95 rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-5 backdrop-blur-xs space-y-4">
      {/* Top Bar of Stepper: Title + Fast Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shadow-xs">
            HC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900">
                End-to-End Custody Flow
              </span>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full border border-emerald-300">
                5 Chronological Stages
              </span>
            </div>
            <h3 className="text-sm font-bold text-stone-900 font-serif">
              Physical Honey Traceability Sequence
            </h3>
          </div>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onScanClick}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Jar QR</span>
          </button>

          <button
            type="button"
            onClick={onCertificateClick}
            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print NABL Certificate</span>
          </button>
        </div>
      </div>

      {/* The 5 Horizontal Sequential Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = activeTab === step.id;

          return (
            <div
              key={step.id}
              onClick={() => setActiveTab(step.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between space-y-2 relative group ${
                isCurrent
                  ? 'bg-gradient-to-b from-amber-50 to-orange-50/50 border-amber-400 shadow-sm ring-2 ring-amber-400/30'
                  : 'bg-stone-50/80 hover:bg-white border-stone-200 hover:border-amber-300'
              }`}
            >
              {/* Header row: Number + Status */}
              <div className="flex items-center justify-between">
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-stone-900 text-amber-400 shadow-2xs'
                      : 'bg-white text-stone-600 border border-stone-300'
                  }`}
                >
                  {step.num}
                </span>

                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                    isCurrent
                      ? 'bg-amber-200/80 text-amber-950'
                      : 'bg-stone-200/70 text-stone-600'
                  }`}
                >
                  {step.status}
                </span>
              </div>

              {/* Title & Category */}
              <div className="space-y-0.5 pt-0.5">
                <span className="text-[10px] uppercase font-bold text-amber-900/80 tracking-wider block truncate">
                  {step.role}
                </span>
                <h4 className={`text-xs font-bold leading-tight ${isCurrent ? 'text-stone-950 font-black' : 'text-stone-800'}`}>
                  {step.title}
                </h4>
              </div>

              {/* Footer Meta */}
              <div className="pt-1.5 border-t border-stone-200/70 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                <span className="truncate">{step.meta}</span>
                <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  isCurrent ? 'text-amber-700' : 'text-stone-400 group-hover:text-amber-600'
                }`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
