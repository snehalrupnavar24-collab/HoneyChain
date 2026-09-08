import React from 'react';
import {
  QrCode,
  Radio,
  Scale,
  FlaskConical,
  ShieldCheck,
  ChevronRight,
  Printer,
  Camera,
  CheckCircle2,
  Lock,
  Layers,
  MapPin,
  Award
} from 'lucide-react';

interface FeatureSequencerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onScanClick?: () => void;
  onCertificateClick?: () => void;
}

export const FeatureSequencer: React.FC<FeatureSequencerProps> = ({
  activeTab,
  setActiveTab,
  onScanClick,
  onCertificateClick
}) => {
  const steps = [
    {
      id: 'consumer',
      stepNum: '01',
      title: 'Consumer Verification',
      category: 'Public QR Traceability',
      description: 'End-to-end journey from Kas Plateau to retail jar.',
      metrics: 'Batch PKG-MAHA-042 • 500g Jar',
      status: 'Verified (NABL)',
      icon: QrCode,
      activeColor: 'border-amber-400 bg-amber-50/70',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'beekeeper',
      stepNum: '02',
      title: 'Beekeeper Field Log',
      category: 'Grassroots Production',
      description: 'Rural voice logging (Hindi/Marathi), IoT hive sensors, and XGBoost AI yield prediction.',
      metrics: 'Hive HIVE-17 • 34.5°C • 8.00 kg',
      status: 'Voice Signed',
      icon: Radio,
      activeColor: 'border-amber-400 bg-amber-50/70',
      badgeColor: 'bg-amber-100 text-amber-900'
    },
    {
      id: 'collection',
      stepNum: '03',
      title: 'Mandi Weighment Terminal',
      category: 'Aggregation & Transit',
      description: 'Avery Berkel industrial scale simulation with container tare deduction & reconciliation.',
      metrics: '8.02 kg Measured • 0% Variance',
      status: 'Tare Cleared',
      icon: Scale,
      activeColor: 'border-amber-400 bg-amber-50/70',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'processing',
      stepNum: '04',
      title: 'Processing & NABL Lab',
      category: 'Quality Assurance',
      description: 'Mass-balance conservation checking, 5-parameter FSSAI assay, and QR serialization.',
      metrics: '17.8% Moisture • Zero C4 Sugar',
      status: 'Agmark Special',
      icon: FlaskConical,
      activeColor: 'border-amber-400 bg-amber-50/70',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'admin',
      stepNum: '05',
      title: 'Regulatory Audit Console',
      category: 'Governance & Merkle DAG',
      description: 'Multi-entity genealogy DAG tree, discrepancy investigation modal, and SHA-256 ledger.',
      metrics: '6 Anchored Blocks • Merkle Valid',
      status: 'Audit Pass',
      icon: ShieldCheck,
      activeColor: 'border-amber-400 bg-amber-50/70',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
  ];

  return (
    <aside className="space-y-6 sticky top-24">
      {/* Sequencer Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-amber-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold block">
              Custody Sequence
            </span>
            <h3 className="font-serif font-bold text-stone-900 text-base">
              Physical Honey Journey
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-stone-900 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-stone-700">
            5 Stages
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Select any stage in sequence to inspect or operate its live hardware simulation and cryptographic records:
        </p>

        {/* Sequential Step Cards with Vertical Rail */}
        <div className="space-y-2.5 relative pt-1 before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-amber-200/70">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCurrent = activeTab === step.id;

            return (
              <div
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`relative flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                  isCurrent
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50/40 border-amber-400 shadow-xs ring-1 ring-amber-300/60'
                    : 'bg-white hover:bg-stone-50 border-stone-200 hover:border-amber-200'
                }`}
              >
                {/* Step Number Circle */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 z-10 transition-all border ${
                    isCurrent
                      ? 'bg-stone-900 text-amber-400 border-stone-800 shadow-xs scale-105'
                      : 'bg-stone-100 text-stone-600 border-stone-300'
                  }`}
                >
                  {step.stepNum}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 truncate">
                      {step.category}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${step.badgeColor}`}>
                      {step.status}
                    </span>
                  </div>

                  <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-stone-950 font-black' : 'text-stone-800'}`}>
                    {step.title}
                  </h4>

                  <p className="text-[11px] text-stone-500 line-clamp-1">
                    {step.metrics}
                  </p>
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 self-center transition-transform ${
                  isCurrent ? 'text-amber-600 translate-x-0.5' : 'text-stone-300'
                }`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Persistent Batch Provenance Card with Real Photos */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-600" /> Active Batch In Custody
          </span>
          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
            NABL PASS
          </span>
        </div>

        {/* Real Photos Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="h-24 rounded-2xl overflow-hidden border border-amber-200 shadow-xs relative bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=300&q=80"
                alt="Pure Raw Jamun Honey Jar"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-2xs text-white text-[9px] font-mono px-1.5 py-0.2 rounded">
                500g Jar
              </span>
            </div>
            <span className="text-[10px] font-bold text-stone-900 block truncate">
              Raw Jamun Honey
            </span>
          </div>

          <div className="space-y-1">
            <div className="h-24 rounded-2xl overflow-hidden border border-amber-200 shadow-xs relative bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=300&q=80"
                alt="Ramesh Tukaram Patil"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-2xs text-white text-[9px] font-mono px-1.5 py-0.2 rounded">
                Beekeeper
              </span>
            </div>
            <span className="text-[10px] font-bold text-stone-900 block truncate">
              Ramesh T. Patil
            </span>
          </div>
        </div>

        <div className="space-y-1 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-200">
          <div className="flex justify-between">
            <span className="text-stone-500 text-[11px]">Batch Code:</span>
            <span className="font-mono font-bold text-stone-900">PKG-MAHA-042-2697</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500 text-[11px]">Apiary Origin:</span>
            <span className="font-semibold text-stone-900">Kas Valley, Satara (1,353m)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500 text-[11px]">Farmer DBT Payout:</span>
            <span className="font-bold text-emerald-700 font-mono">₹480 / kg Cleared</span>
          </div>
        </div>

        {/* Fast Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {onScanClick && (
            <button
              type="button"
              onClick={onScanClick}
              className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan QR</span>
            </button>
          )}

          {onCertificateClick && (
            <button
              type="button"
              onClick={onCertificateClick}
              className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Cert</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
