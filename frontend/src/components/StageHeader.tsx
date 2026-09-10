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
      total: '05',
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
      total: '05',
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
      total: '05',
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
      total: '05',
      title: t.stages.labTitle,
      role: t.stages.labRole,
      description: t.stages.labDesc,
      standard: t.stages.labStandard,
      prevId: 'collection',
      prevName: `03. ${t.stages.mandiRole}`,
      nextId: 'admin',
      nextName: `05. ${t.stages.auditRole}`,
    },
    admin: {
      num: '05',
      total: '05',
      title: t.stages.auditTitle,
      role: t.stages.auditRole,
      description: t.stages.auditDesc,
      standard: t.stages.auditStandard,
      prevId: 'processing',
      prevName: `04. ${t.stages.labRole}`,
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
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="bg-amber-100 text-amber-950 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
              {t.stages.stageLabel} {current.num} {t.stages.stageOf} {current.total}
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
              <span className="hidden sm:inline">{t.stages.prevBtn}:</span>
              <span className="truncate max-w-[120px]">{current.prevName}</span>
            </button>
          ) : (
            <div className="text-[11px] text-stone-400 font-mono italic">
              {lang === 'mr' ? 'पहिली पायरी' : (lang === 'hi' ? 'पहला चरण' : 'First Stage')}
            </div>
          )}

          {current.nextId && (
            <button
              type="button"
              onClick={() => setActiveTab(current.nextId!)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>{t.stages.nextBtn}:</span>
              <span className="truncate max-w-[140px]">{current.nextName}</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-950" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
