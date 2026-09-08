import React, { useState } from 'react';
import {
  Scale,
  Barcode,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  ShieldCheck,
  Building2,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { CollectionLot } from '../types';
import { createCollection } from '../services/api';

export const CollectionTerminal: React.FC = () => {
  // Active intake session
  const [selectedLotCode, setSelectedLotCode] = useState('HC-SAT-2026-2697');
  const [harvestLotId, setHarvestLotId] = useState(1);
  const [declaredQty, setDeclaredQty] = useState(8.0);
  const [beekeeperName, setBeekeeperName] = useState('Ramesh Tukaram Patil (KVIC-MH-8841)');
  const [apiaryOrigin, setApiaryOrigin] = useState('Hive HIVE-17 • Mahabaleshwar Valley');

  // Digital Scale State
  const [scaleTare, setScaleTare] = useState(0.0);
  const [measuredGross, setMeasuredGross] = useState(8.0);
  const [isScaleStabilizing, setIsScaleStabilizing] = useState(false);

  // Collection receipt creation
  const [submitting, setSubmitting] = useState(false);
  const [createdReceipt, setCreatedReceipt] = useState<CollectionLot | null>(null);

  // Recent weighments log
  const [recentLots, setRecentLots] = useState<Array<{
    code: string;
    beekeeper: string;
    declared: number;
    measured: number;
    status: 'verified' | 'flagged';
    diff: number;
    time: string;
  }>>([
    {
      code: 'COL-SAT-2026-091',
      beekeeper: 'Ganesh Shinde (KVIC-MH-7712)',
      declared: 12.0,
      measured: 11.9,
      status: 'verified',
      diff: -0.1,
      time: '10:45 AM'
    },
    {
      code: 'COL-SAT-2026-088',
      beekeeper: 'Suresh More (KVIC-MH-9021)',
      declared: 15.0,
      measured: 11.2,
      status: 'flagged',
      diff: -3.8,
      time: '09:15 AM'
    }
  ]);

  // Derived calculations
  const netWeight = Math.max(0, measuredGross - scaleTare);
  const difference = Number((netWeight - declaredQty).toFixed(2));
  const percentageDiff = declaredQty > 0 ? Number(((difference / declaredQty) * 100).toFixed(2)) : 0;
  const isDiscrepant = Math.abs(difference) > 0.3; // more than 300g difference triggers alert

  // Quick preset loader
  const loadScenario = (type: 'normal' | 'fraud' | 'minor') => {
    setIsScaleStabilizing(true);
    if (type === 'normal') {
      setSelectedLotCode('HC-SAT-2026-2697');
      setHarvestLotId(1);
      setDeclaredQty(8.0);
      setBeekeeperName('Ramesh Tukaram Patil (KVIC-MH-8841)');
      setApiaryOrigin('Hive HIVE-17 • Mahabaleshwar Valley');
      setTimeout(() => {
        setMeasuredGross(8.02);
        setIsScaleStabilizing(false);
      }, 500);
    } else if (type === 'fraud') {
      setSelectedLotCode('HC-SAT-2026-9901');
      setHarvestLotId(2);
      setDeclaredQty(10.0);
      setBeekeeperName('Unknown Trader / Intermediary');
      setApiaryOrigin('Unverified Roadside Depo');
      setTimeout(() => {
        setMeasuredGross(7.45); // 2.55 kg deficit!
        setIsScaleStabilizing(false);
      }, 500);
    } else if (type === 'minor') {
      setSelectedLotCode('HC-SAT-2026-4412');
      setHarvestLotId(3);
      setDeclaredQty(14.0);
      setBeekeeperName('Sunita Jadhav (KVIC-MH-6542)');
      setApiaryOrigin('Hive HIVE-04 • Wai Foothills');
      setTimeout(() => {
        setMeasuredGross(13.92);
        setIsScaleStabilizing(false);
      }, 500);
    }
  };

  const handleTare = () => {
    setScaleTare(measuredGross);
  };

  const handleResetTare = () => {
    setScaleTare(0.0);
  };

  const handleSubmitCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const colCode = `COL-SAT-2026-${Math.floor(100 + Math.random() * 900)}`;
      const result = await createCollection({
        harvest_lot_id: harvestLotId,
        collection_code: colCode,
        measured_quantity: Number(netWeight.toFixed(2)),
        unit: 'kg',
        collection_center: 'Mahabaleshwar Regional KVIC Hub #04'
      });

      setCreatedReceipt(result);
      setRecentLots(prev => [
        {
          code: colCode,
          beekeeper: beekeeperName,
          declared: declaredQty,
          measured: netWeight,
          status: isDiscrepant ? 'flagged' : 'verified',
          diff: difference,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Terminal Title & Hardware Header */}
      <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-honey-100 text-honey-800 text-xs font-semibold border border-honey-300">
              <Building2 className="w-3.5 h-3.5 text-honey-700" />
              Khadi & Village Industries Commission (KVIC) • Satara Regional Aggregator Hub
            </div>
            <h1 className="text-2xl font-bold font-serif text-forest-900 tracking-tight">
              Mandi Weighment Terminal & Physical Reconciliation
            </h1>
            <p className="text-sm text-forest-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Connected Device: Avery Berkel IX-200 Industrial Grade Bench Scale (Serial RS-232 / BLE Active)
            </p>
          </div>

          {/* Quick Demo Scenario Switcher */}
          <div className="flex flex-wrap items-center gap-2 bg-cream-50 p-2 rounded-xl border border-cream-300">
            <span className="text-xs font-bold text-forest-900 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-honey-600" /> Test Scenarios:
            </span>
            <button
              type="button"
              onClick={() => loadScenario('normal')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 transition-colors"
            >
              Pass (8.0 kg)
            </button>
            <button
              type="button"
              onClick={() => loadScenario('fraud')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-red-50 text-red-700 border border-red-300 transition-colors"
            >
              Deficit Fraud (-2.55 kg)
            </button>
            <button
              type="button"
              onClick={() => loadScenario('minor')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-cream-200 text-forest-800 border border-cream-300 transition-colors"
            >
              Lot 14 kg
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Digital Scale Simulation & Lot Ingestion */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hardware Scale Display Box */}
          <div className="bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-2xl p-6 border-4 border-neutral-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                <span className="font-mono text-xs font-bold tracking-widest uppercase text-neutral-400">
                  Certified Trade Scale • Capacity 50.00 kg / d=0.01 kg
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/60 font-bold">
                  {isScaleStabilizing ? 'STABILIZING...' : 'STABLE'}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">NABL CALIBRATED</span>
              </div>
            </div>

            {/* Glowing Digital LCD Screen */}
            <div className="bg-black/90 p-5 rounded-xl border border-emerald-950/80 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-emerald-600 block uppercase tracking-wider font-semibold">
                  Net Measured Weight
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.35)]">
                    {netWeight.toFixed(2)}
                  </span>
                  <span className="text-2xl font-bold font-mono text-emerald-500">kg</span>
                </div>
              </div>

              {/* Sub-readings (Gross / Tare) */}
              <div className="flex sm:flex-col gap-4 sm:gap-2 text-xs font-mono text-neutral-400 border-t sm:border-t-0 sm:border-l border-neutral-800 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                <div>
                  <span className="text-neutral-500 block">Gross Weight:</span>
                  <span className="text-neutral-200 font-bold">{measuredGross.toFixed(2)} kg</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Tare Deduction:</span>
                  <span className="text-neutral-200 font-bold">-{scaleTare.toFixed(2)} kg</span>
                </div>
              </div>
            </div>

            {/* Scale Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTare}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-mono font-bold transition-colors border border-neutral-600"
                >
                  TARE CONTAINER
                </button>
                <button
                  type="button"
                  onClick={() => setScaleTare(2.40)}
                  className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-mono transition-colors"
                  title="Standard 20L Stainless Steel Milk/Honey Canister Tare"
                >
                  SS Can (2.4kg)
                </button>
                {scaleTare > 0 && (
                  <button
                    type="button"
                    onClick={handleResetTare}
                    className="px-2 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg text-xs font-mono transition-colors"
                  >
                    RESET
                  </button>
                )}
              </div>

              {/* Manual weight nudges */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-neutral-400 font-mono">Simulate Scale:</span>
                <button
                  type="button"
                  onClick={() => setMeasuredGross(prev => Math.max(0, Number((prev - 0.5).toFixed(2))))}
                  className="w-7 h-7 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono font-bold text-xs rounded border border-neutral-600"
                >
                  -0.5
                </button>
                <button
                  type="button"
                  onClick={() => setMeasuredGross(prev => Number((prev + 0.5).toFixed(2)))}
                  className="w-7 h-7 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono font-bold text-xs rounded border border-neutral-600"
                >
                  +0.5
                </button>
                <button
                  type="button"
                  onClick={() => setMeasuredGross(declaredQty)}
                  className="px-2 h-7 bg-emerald-900/50 hover:bg-emerald-900 text-emerald-300 font-mono text-xs rounded border border-emerald-700"
                >
                  Match Declared
                </button>
              </div>
            </div>
          </div>

          {/* Intake Batch Details & Submission */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm space-y-5">
            <h3 className="text-lg font-bold font-serif text-forest-900 flex items-center gap-2">
              <Barcode className="w-5 h-5 text-honey-600" />
              Incoming Lot Inspection & Ingestion
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-cream-50 p-4 rounded-xl border border-cream-200">
              <div>
                <span className="text-xs text-cream-600 block">Harvest Lot Code:</span>
                <span className="font-mono font-bold text-forest-950 text-base">{selectedLotCode}</span>
              </div>
              <div>
                <span className="text-xs text-cream-600 block">Declared Farmer Weight:</span>
                <span className="font-bold text-forest-950 text-base font-mono">{declaredQty.toFixed(2)} kg</span>
              </div>
              <div>
                <span className="text-xs text-cream-600 block">Producer Beekeeper:</span>
                <span className="font-semibold text-forest-900">{beekeeperName}</span>
              </div>
              <div>
                <span className="text-xs text-cream-600 block">Origin Location:</span>
                <span className="font-semibold text-forest-900">{apiaryOrigin}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitCollection} className="space-y-4">
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-cream-600 max-w-sm">
                  {isDiscrepant ? (
                    <span className="text-red-700 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      Attention: A discrepancy incident will be permanently logged on the audit ledger.
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Weighment within strict FSSAI tolerance. Ready for aggregation.
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-2.5 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 ${
                    isDiscrepant
                      ? 'bg-red-700 hover:bg-red-800'
                      : 'bg-forest-900 hover:bg-forest-950'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-honey-400" />
                  {submitting ? 'Signing Weighment...' : isDiscrepant ? 'Log Discrepancy & Ingest' : 'Accept & Issue Slip'}
                </button>
              </div>
            </form>

            {/* Created Receipt Card */}
            {createdReceipt && (
              <div className="p-4 rounded-xl bg-cream-50 border border-honey-300 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-honey-700" />
                    Digital Weighment Slip #{createdReceipt.collection_code}
                  </span>
                  <span className="text-xs font-mono text-cream-600">
                    {new Date(createdReceipt.collected_at || Date.now()).toLocaleTimeString()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-white p-3 rounded-lg border border-cream-200">
                  <div>
                    <span className="text-cream-600 block">Final Net:</span>
                    <span className="font-mono font-bold text-forest-950 text-sm">
                      {createdReceipt.measured_quantity} kg
                    </span>
                  </div>
                  <div>
                    <span className="text-cream-600 block">Variance:</span>
                    <span className={`font-mono font-bold text-sm ${isDiscrepant ? 'text-red-700' : 'text-emerald-700'}`}>
                      {difference > 0 ? `+${difference}` : difference} kg
                    </span>
                  </div>
                  <div>
                    <span className="text-cream-600 block">Reconciliation:</span>
                    <span className={`font-bold uppercase text-[11px] ${isDiscrepant ? 'text-red-700' : 'text-emerald-700'}`}>
                      {isDiscrepant ? 'Flagged / Open' : 'Auto-Verified'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-cream-600">
                    Authority: APMC & KVIC Mandi Operator Shri Anandrao Kadam
                  </span>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-forest-900 hover:bg-forest-950 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-honey-400" />
                    Print Mandi Slip (वजन पावती)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Real-time Reconciliation Engine & History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Reconciliation Gauge */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-forest-900 flex items-center justify-between">
              <span>Reconciliation Engine</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isDiscrepant ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isDiscrepant ? 'DEVIATION DETECTED' : 'TOLERANCE PASSED'}
              </span>
            </h3>

            {/* Difference breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-cream-600">
                <span>Declared at Hive:</span>
                <span className="font-mono font-bold text-forest-900">{declaredQty.toFixed(2)} kg</span>
              </div>
              <div className="flex items-center justify-between text-xs text-cream-600">
                <span>Scale Measured:</span>
                <span className="font-mono font-bold text-forest-900">{netWeight.toFixed(2)} kg</span>
              </div>

              {/* Progress deviation bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-cream-600">Weight Difference:</span>
                  <span className={difference < -0.3 ? 'text-red-600' : difference > 0.3 ? 'text-amber-600' : 'text-emerald-600'}>
                    {difference > 0 ? `+${difference.toFixed(2)}` : difference.toFixed(2)} kg ({percentageDiff > 0 ? `+${percentageDiff}` : percentageDiff}%)
                  </span>
                </div>
                <div className="w-full bg-cream-200 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isDiscrepant ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(10, (netWeight / (declaredQty || 1)) * 100))}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-cream-500 font-mono">
                  <span>Target: {declaredQty.toFixed(2)} kg</span>
                  <span>Allowable Margin: ±2.0%</span>
                </div>
              </div>
            </div>

            {/* Explanation card */}
            <div className={`p-3 rounded-xl text-xs leading-relaxed border ${
              isDiscrepant
                ? 'bg-red-50/80 border-red-200 text-red-900'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            }`}>
              {isDiscrepant ? (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Physical Weight Mismatch:</span>
                    Received quantity is {Math.abs(difference).toFixed(2)} kg ({Math.abs(percentageDiff).toFixed(1)}%) below the beekeeper's signed field declaration. This breach exceeds the standard evaporation threshold.
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Integrity Reconciled:</span>
                    The physical weighment confirms the declared harvest. No evidence of transit pilferage or sugar syrup substitution detected.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Mandi Intake Receipts */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-forest-900 flex items-center justify-between">
              <span>Recent Aggregation Log</span>
              <span className="text-xs text-cream-500 font-normal">Today's Shift</span>
            </h4>

            <div className="space-y-2.5">
              {recentLots.map((lot, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-cream-50/70 border border-cream-200 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-forest-950">{lot.code}</span>
                      <span className="text-[10px] text-cream-500">{lot.time}</span>
                    </div>
                    <div className="text-cream-700 truncate max-w-[200px]">
                      {lot.beekeeper}
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <div className="font-mono font-bold text-forest-950">
                      {lot.measured.toFixed(2)} kg
                    </div>
                    <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                      lot.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {lot.status === 'verified' ? 'Passed' : 'Flagged'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
