import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface StageHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const StageHeader: React.FC<StageHeaderProps> = ({ activeTab, setActiveTab }) => {
  const { lang, t } = useLanguage();

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
      total: '04',
      title: t.stages.consumerTitle,
      role: t.stages.consumerRole,
      description: t.stages.consumerDesc,
      standard: t.stages.consumerStandard,
      prevId: null,
      prevName: null,
      nextId: 'beekeeper',
      nextName: `02. ${t.stages.beekeeperRole}`,
    },
    beekeeper: {
      num: '02',
      total: '04',
      title: t.stages.beekeeperTitle,
      role: t.stages.beekeeperRole,
      description: t.stages.beekeeperDesc,
      standard: t.stages.beekeeperStandard,
      prevId: 'consumer',
      prevName: `01. ${t.stages.consumerRole}`,
      nextId: 'collection',
      nextName: `03. ${t.stages.mandiRole}`,
    },
    collection: {
      num: '03',
      total: '04',
      title: t.stages.mandiTitle,
      role: t.stages.mandiRole,
      description: t.stages.mandiDesc,
      standard: t.stages.mandiStandard,
      prevId: 'beekeeper',
      prevName: `02. ${t.stages.beekeeperRole}`,
      nextId: 'processing',
      nextName: `04. ${t.stages.labRole}`,
    },
    processing: {
      num: '04',
      total: '04',
      title: t.stages.labTitle,
      role: t.stages.labRole,
      description: t.stages.labDesc,
      standard: t.stages.labStandard,
      prevId: 'collection',
      prevName: `03. ${t.stages.mandiRole}`,
      nextId: 'consumer',
      nextName: `01. ${t.stages.consumerRole}`,
    },
  };

  const current = stageMap[activeTab] || stageMap['consumer'];

  return (
    <div className="bg-white/95 rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-5 backdrop-blur-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Context Breadcrumb + Title + Description */}
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 font-mono font-bold text-xs border border-amber-300">
              <Sparkles className="w-3 h-3 text-amber-800" />
              STAGE {current.num} / {current.total}
            </span>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {current.role}
            </span>
            <span className="text-stone-300">•</span>
            <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {current.standard}
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-0.5">
              {current.description}
            </p>
          </div>
        </div>

        {/* Right Side: Step Navigation Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-start lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto justify-between lg:justify-end">
          {current.prevId ? (
            <button
              onClick={() => setActiveTab(current.prevId!)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-stone-500" />
              <span className="hidden sm:inline">{current.prevName}</span>
              <span className="sm:hidden">Prev</span>
            </button>
          ) : (
            <div className="w-1" />
          )}

          {current.nextId && (
            <button
              onClick={() => setActiveTab(current.nextId!)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-all shadow-xs cursor-pointer ml-auto lg:ml-0"
            >
              <span>{current.nextName}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
