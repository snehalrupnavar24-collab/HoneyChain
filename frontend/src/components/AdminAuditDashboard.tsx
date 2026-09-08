import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  GitFork,
  FileSpreadsheet,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Search,
  ArrowRight,
  ChevronRight,
  Building,
  UserCheck,
  Scale,
  FlaskConical,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { Discrepancy, SupplyChainEvent } from '../types';
import { getDiscrepancies, resolveDiscrepancy, getAuditEvents } from '../services/api';

export const AdminAuditDashboard: React.FC = () => {
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [events, setEvents] = useState<SupplyChainEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Resolution Modal State
  const [activeDiscrepancy, setActiveDiscrepancy] = useState<Discrepancy | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  // DAG Explorer State
  const [selectedBatchCode, setSelectedBatchCode] = useState('PKG-MAHA-042-2697');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    loadAuditData();
  }, []);

  const loadAuditData = async () => {
    setLoading(true);
    const [discList, eventList] = await Promise.all([
      getDiscrepancies(),
      getAuditEvents()
    ]);
    setDiscrepancies(discList);
    setEvents(eventList);
    setLoading(false);
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDiscrepancy) return;
    setResolving(true);
    try {
      const updated = await resolveDiscrepancy(activeDiscrepancy.id, resolutionNotes);
      setDiscrepancies(prev =>
        prev.map(d => (d.id === updated.id ? { ...d, status: 'resolved', explanation: updated.explanation } : d))
      );
      setActiveDiscrepancy(null);
      setResolutionNotes('');
    } finally {
      setResolving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-900 text-xs font-semibold border border-forest-300">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
              Central Regulatory Surveillance • National Honey Mission & FSSAI
            </div>
            <h1 className="text-2xl font-bold font-serif text-forest-900 tracking-tight">
              Chain of Custody Audit & Discrepancy Investigation Console
            </h1>
            <p className="text-xs text-cream-600">
              Surveillance Authority: Directorate of Food Safety Standards & KVIC Monitoring Cell, New Delhi
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-cream-100 px-3 py-1.5 rounded-xl border border-cream-300 text-right">
              <span className="text-[10px] text-cream-600 font-bold block uppercase">Audit Ledger State</span>
              <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                SYNCHRONIZED (BLOCK #18,409)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-cream-200 shadow-xs">
          <span className="text-xs text-cream-600 font-bold uppercase tracking-wider block">Monitored Apiary Clusters</span>
          <div className="text-2xl font-black font-mono text-forest-950 mt-1">14 Zones</div>
          <span className="text-[11px] text-forest-700 font-medium mt-1 block">Western Ghats, Nilgiris, Kashmir</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cream-200 shadow-xs">
          <span className="text-xs text-cream-600 font-bold uppercase tracking-wider block">IoT Telemetry Hives</span>
          <div className="text-2xl font-black font-mono text-forest-950 mt-1">412 Hives</div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">99.4% LoRaWAN Uptime</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cream-200 shadow-xs">
          <span className="text-xs text-cream-600 font-bold uppercase tracking-wider block">Total Traceable Honey</span>
          <div className="text-2xl font-black font-mono text-forest-950 mt-1">14,820 kg</div>
          <span className="text-[11px] text-honey-700 font-medium mt-1 block">100% Cryptographically Bound</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cream-200 shadow-xs">
          <span className="text-xs text-cream-600 font-bold uppercase tracking-wider block">Adulteration Breaches Blocked</span>
          <div className="text-2xl font-black font-mono text-red-600 mt-1">
            {discrepancies.filter(d => d.status === 'open').length} Active
          </div>
          <span className="text-[11px] text-cream-600 font-medium mt-1 block">
            {discrepancies.filter(d => d.status === 'resolved').length} Resolved & Investigated
          </span>
        </div>
      </div>

      {/* SECTION 1: BATCH GENEALOGY DAG EXPLORER */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
          <div>
            <h2 className="text-lg font-bold font-serif text-forest-900 flex items-center gap-2">
              <GitFork className="w-5 h-5 text-honey-600" />
              Batch Genealogy Directed Acyclic Graph (DAG)
            </h2>
            <p className="text-xs text-cream-600 mt-0.5">
              Inspect full multi-entity tree linkage tracing retail jar serialization back to physical apiary soil and queen hive.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-cream-600 font-semibold">Active Batch:</span>
            <span className="px-3 py-1 bg-cream-100 rounded-lg text-xs font-mono font-bold text-forest-900 border border-cream-300">
              {selectedBatchCode}
            </span>
          </div>
        </div>

        {/* Visual Graph Nodes */}
        <div className="overflow-x-auto pb-4 pt-2">
          <div className="min-w-[850px] flex items-center justify-between relative px-4">
            {/* Connector Line behind nodes */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-cream-300 -z-0" />

            {/* Node 1: Queen Hive */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-2 max-w-[140px]">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-forest-950 flex items-center justify-center font-bold shadow-md border-2 border-white">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-honey-800">Source Hive</span>
                <h4 className="text-xs font-bold text-forest-950">HIVE-17</h4>
                <p className="text-[10px] text-cream-600 font-mono">Ramesh Patil</p>
                <span className="inline-block text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  34.5°C Brood
                </span>
              </div>
            </div>

            {/* Node 2: Harvest Lot */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-2 max-w-[140px]">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center font-bold shadow-md border-2 border-white">
                <Clock className="w-6 h-6 text-honey-400" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700">Harvest Lot</span>
                <h4 className="text-xs font-bold text-forest-950 font-mono">HC-SAT-2026</h4>
                <p className="text-[10px] text-cream-600 font-mono">8.00 kg Jamun</p>
                <span className="inline-block text-[9px] font-bold bg-cream-200 text-forest-900 px-1.5 py-0.2 rounded font-mono">
                  Voice Signed
                </span>
              </div>
            </div>

            {/* Node 3: Mandi Collection */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-2 max-w-[140px]">
              <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center font-bold shadow-md border-2 border-white">
                <Scale className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700">Mandi Scale</span>
                <h4 className="text-xs font-bold text-forest-950 font-mono">COL-SAT-042</h4>
                <p className="text-[10px] text-cream-600 font-mono">8.00 kg (0% var)</p>
                <span className="inline-block text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  Tare Cleared
                </span>
              </div>
            </div>

            {/* Node 4: Processing Facility */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-2 max-w-[140px]">
              <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center font-bold shadow-md border-2 border-white">
                <Building className="w-6 h-6 text-honey-300" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700">Agro-Processing</span>
                <h4 className="text-xs font-bold text-forest-950 font-mono">PROC-2026-042</h4>
                <p className="text-[10px] text-cream-600 font-mono">48.2kg out / 50kg</p>
                <span className="inline-block text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  Mass Bal. OK
                </span>
              </div>
            </div>

            {/* Node 5: NABL Chemical Lab */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-2 max-w-[140px]">
              <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center font-bold shadow-md border-2 border-white">
                <FlaskConical className="w-6 h-6 text-amber-400" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700">FSSAI Lab</span>
                <h4 className="text-xs font-bold text-forest-950 font-mono">LR-NABL-7821</h4>
                <p className="text-[10px] text-cream-600 font-mono">17.8% Moisture</p>
                <span className="inline-block text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  Agmark Special
                </span>
              </div>
            </div>

            {/* Node 6: Serialized Package */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-2 max-w-[140px]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md border-2 border-white">
                <Package className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Consumer Jar</span>
                <h4 className="text-xs font-bold text-forest-950 font-mono">PKG-MAHA-042</h4>
                <p className="text-[10px] text-cream-600 font-mono">96 Jars (500g)</p>
                <span className="inline-block text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  QR Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: DISCREPANCY INVESTIGATION TABLE */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
          <div>
            <h2 className="text-lg font-bold font-serif text-forest-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              Automated Discrepancy & Fraud Investigation Console
            </h2>
            <p className="text-xs text-cream-600 mt-0.5">
              Algorithmically flagged deviations exceeding physical mass-conservation or botanical tolerance limits.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-cream-600">
            {discrepancies.length} Incident(s) Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-50/50 text-cream-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Declared Weight</th>
                <th className="py-3 px-4">Measured Weight</th>
                <th className="py-3 px-4">Deficit / Variance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Flag Description</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200 text-forest-950">
              {discrepancies.map(item => (
                <tr key={item.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold">
                    {item.entity_type} #{item.entity_id}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">
                    {item.declared_quantity.toFixed(2)} kg
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">
                    {item.measured_quantity.toFixed(2)} kg
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-red-600">
                    {item.difference.toFixed(2)} kg
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800 animate-pulse'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-cream-700 max-w-xs truncate" title={item.explanation}>
                    {item.explanation}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {item.status === 'open' ? (
                      <button
                        onClick={() => setActiveDiscrepancy(item)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                      >
                        Investigate
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold text-xs flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: IMMUTABLE AUDIT EVENT LEDGER */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm space-y-5">
        <div className="border-b border-cream-200 pb-4">
          <h2 className="text-lg font-bold font-serif text-forest-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-honey-600" />
            Cryptographic SHA-256 Audit Event Ledger
          </h2>
          <p className="text-xs text-cream-600 mt-0.5">
            Decentralized hash blocks minted on state transition events (Harvest → Collection → Processing → Lab → QR).
          </p>
        </div>

        <div className="space-y-3">
          {events.map(event => (
            <div
              key={event.event_id}
              className="p-4 rounded-xl bg-cream-50/70 border border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-forest-950 bg-white px-2 py-0.5 rounded border border-cream-300">
                    EVENT #{event.event_id}
                  </span>
                  <span className="px-2 py-0.5 bg-honey-100 text-honey-900 font-bold rounded text-[10px] uppercase">
                    {event.event_type}
                  </span>
                  <span className="text-[10px] text-cream-500 font-mono">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-forest-900 font-medium">{event.description}</p>
              </div>

              {/* SHA-256 Hash Display */}
              <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-2.5 py-1.5 rounded-lg border border-cream-300">
                <span className="text-[10px] font-mono text-cream-600">SHA-256:</span>
                <span className="font-mono font-bold text-forest-950 text-[11px]">
                  {event.blockchain_hash.slice(0, 10)}...{event.blockchain_hash.slice(-8)}
                </span>
                <button
                  onClick={() => copyToClipboard(event.blockchain_hash)}
                  className="p-1 hover:bg-cream-100 rounded text-cream-600 hover:text-forest-900 transition-colors"
                  title="Copy Full 64-character SHA-256 Hash"
                >
                  {copiedHash === event.blockchain_hash ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESOLUTION MODAL */}
      {activeDiscrepancy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-cream-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="text-base font-bold font-serif text-forest-900 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-600" />
                Resolve Discrepancy #{activeDiscrepancy.id}
              </h3>
              <button
                onClick={() => setActiveDiscrepancy(null)}
                className="text-cream-500 hover:text-forest-900 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-xs text-red-950 space-y-1">
              <div className="font-bold">Flagged Deficit: {activeDiscrepancy.difference.toFixed(2)} kg</div>
              <p>{activeDiscrepancy.explanation}</p>
            </div>

            <form onSubmit={handleResolve} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Enforcement Officer Investigation Notes & Remediation Action
                </label>
                <textarea
                  rows={4}
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Conducted physical inspection at Mandi #04. Beekeeper tare deduction corrected after verifying canister weight discrepancy of 2.5 kg due to uncalibrated private scale. Penalty issued and batch cleared under supervision."
                  className="w-full p-3 text-xs bg-cream-50 border border-cream-300 rounded-xl font-medium text-forest-900 focus:ring-2 focus:ring-honey-400 focus:outline-hidden"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveDiscrepancy(null)}
                  className="px-4 py-2 text-xs font-bold text-cream-700 hover:bg-cream-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resolving}
                  className="px-5 py-2 text-xs font-bold bg-forest-900 hover:bg-forest-950 text-white rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {resolving ? 'Signing Settlement...' : 'Sign & Close Incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
