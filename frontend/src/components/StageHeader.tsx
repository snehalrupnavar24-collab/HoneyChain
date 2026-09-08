import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Info
} from 'lucide-react';

interface StageHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const StageHeader: React.FC<StageHeaderProps> = ({ activeTab, setActiveTab }) => {
  const stageMap: Record<string, {
    num: string;
    total: string;
    title: string;
    role: string;
    description: string;
    standard: string;
    prevId: string | null;
    prevName: string | null;
    nextId: string | null;
    nextName: string | null;
  }> = {
    consumer: {
      num: '01',
      total: '05',
      title: 'Consumer Verification & Botanical Provenance',
      role: 'Public Verification Portal',
      description: 'End-consumer authenticity portal. Scan jar QR tags, verify Ramesh Patil\'s apiary location, inspect NABL laboratory isotope certificates, and track the complete cryptographic custody chain.',
      standard: 'Consumer Protection (E-Commerce) Rules 2020 • FSSAI Food Safety Standards',
      prevId: null,
      prevName: null,
      nextId: 'beekeeper',
      nextName: '02. Beekeeper Field Log',
    },
    beekeeper: {
      num: '02',
      total: '05',
      title: 'Beekeeper Field Harvest Log & IoT Apiary Telemetry',
      role: 'Grassroots Production Station',
      description: 'Decentralized apiary console empowering rural beekeepers. Log harvests using voice commands in English, Hindi, or Marathi, monitor real-time Hive #17 IoT telemetry (temp, humidity, acoustics), and forecast yield with XGBoost.',
      standard: 'National Honey Mission Guidelines • KVIC Smart Kisan Passbook Protocol',
      prevId: 'consumer',
      prevName: '01. Consumer Verification',
      nextId: 'collection',
      nextName: '03. Mandi Weighment Scale',
    },
    collection: {
      num: '03',
      total: '05',
      title: 'Mandi Weighment Scale & Tare Reconciliation',
      role: 'Aggregation & APMC Mandi Station',
      description: 'Industrial weighment terminal at the APMC Mandi. Integrates with Avery Berkel digital scales, computes automatic tare deductions for SS canisters and drums, and flags mass discrepancies to prevent syrup adulteration.',
      standard: 'Legal Metrology (Packaged Commodities) Rules 2011 • APMC Honey Intake Norms',
      prevId: 'beekeeper',
      prevName: '02. Beekeeper Field Log',
      nextId: 'processing',
      nextName: '04. Processing & NABL Lab',
    },
    processing: {
      num: '04',
      total: '05',
      title: 'Agro-Processing, NABL Isotope Lab & Serialization',
      role: 'Industrial Processing & Testing Station',
      description: 'NABL laboratory purity testing and serialization plant. Performs EA-IRMS Carbon-13 isotope analysis to catch C4 synthetic sugars, calculates mass-balance conservation, and assigns unique cryptographically signed QR codes.',
      standard: 'FSSAI Gazette Honey Standards (Section 2.8.2) • EA-IRMS Carbon-13 Protocol',
      prevId: 'collection',
      prevName: '03. Mandi Scale',
      nextId: 'admin',
      nextName: '05. Regulatory Audit',
    },
    admin: {
      num: '05',
      total: '05',
      title: 'Central Regulatory Surveillance & Merkle DAG Console',
      role: 'National Governance & Audit Console',
      description: 'Central surveillance console for FSSAI and KVIC enforcement teams. Visualizes multi-stage Merkle DAG batch genealogy, audits SHA-256 block ledger integrity, and manages discrepancy investigations with legal signoff.',
      standard: 'FSSAI Surveillance Cell • National Digital Traceability Architecture (NDTA)',
      prevId: 'processing',
      prevName: '04. Processing & Lab',
      nextId: 'consumer',
      nextName: '01. Consumer Verification',
    },
  };

  const current = stageMap[activeTab] || stageMap['consumer'];

  return (
    <div className="bg-white/95 rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-5 backdrop-blur-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Context Breadcrumb + Title + Description */}
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="bg-amber-100 text-amber-950 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
              Stage {current.num} of {current.total}
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-amber-900 font-bold uppercase tracking-wider">
              {current.role}
            </span>
            <span className="text-stone-400 hidden sm:inline">•</span>
            <span className="text-stone-500 hidden sm:inline">
              {current.standard}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-950 tracking-tight">
            {current.title}
          </h2>

          <p className="text-xs text-stone-600 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Right Side: Step Through Controls */}
        <div className="flex items-center gap-2 shrink-0 self-start lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-stone-200 w-full lg:w-auto justify-between lg:justify-end">
          {current.prevId ? (
            <button
              type="button"
              onClick={() => setActiveTab(current.prevId!)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-white text-stone-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs hover:border-amber-400 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Previous:</span>
              <span className="truncate max-w-[110px]">{current.prevName}</span>
            </button>
          ) : (
            <div className="text-[11px] text-stone-400 font-mono italic">
              First Stage
            </div>
          )}

          {current.nextId && (
            <button
              type="button"
              onClick={() => setActiveTab(current.nextId!)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Next:</span>
              <span className="truncate max-w-[130px]">{current.nextName}</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-950" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
