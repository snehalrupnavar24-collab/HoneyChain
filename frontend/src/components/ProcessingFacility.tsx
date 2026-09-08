import React, { useState } from 'react';
import {
  Factory,
  FlaskConical,
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  QrCode,
  Thermometer,
  Percent,
  Sparkles,
  Award,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { ProcessingLot, LabReport, PackagingBatch } from '../types';
import { createProcessingLot, createLabReport, verifyLabReport, createPackagingBatch } from '../services/api';

export const ProcessingFacility: React.FC = () => {
  // --- SECTION A: MASS BALANCE PROCESSING STATE ---
  const [inputQuantity, setInputQuantity] = useState<number>(50.0);
  const [outputQuantity, setOutputQuantity] = useState<number>(48.2);
  const [processingCode, setProcessingCode] = useState<string>(`PROC-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [processingSubmitting, setProcessingSubmitting] = useState<boolean>(false);
  const [createdProcessingLot, setCreatedProcessingLot] = useState<ProcessingLot | null>(null);

  // Derived Mass Balance Calculations
  const massDifference = Number((outputQuantity - inputQuantity).toFixed(2));
  const lossPercentage = inputQuantity > 0 ? Number(((Math.abs(massDifference) / inputQuantity) * 100).toFixed(2)) : 0;
  const isDilutionFraud = outputQuantity > inputQuantity; // Output honey cannot exceed raw input!

  // --- SECTION B: LAB REPORT STATE ---
  const [labForm, setLabForm] = useState({
    report_code: 'LR-NABL-7821',
    sample_id: 'SAMPLE-MAHA-401',
    result: 'PASS',
    moisture: 17.8,
    purity_score: 99.1,
    hmf: 14.2, // Hydroxymethylfurfural in mg/kg (FSSAI max 40)
    fg_ratio: 1.24, // Fructose/Glucose ratio (FSSAI min 1.0)
    c4_sugar: 'Negative (< -23.5‰ δ13C)', // EA-IRMS carbon isotope
    diastase_activity: 14.5, // Schade units (min 8)
    verified: false,
    remarks: 'Complies with FSSAI Honey Standards (Gazette Notification 2020) & Agmark Special Grade criteria.'
  });
  const [labSubmitting, setLabSubmitting] = useState<boolean>(false);
  const [verifiedReport, setVerifiedReport] = useState<LabReport | null>(null);

  // --- SECTION C: PACKAGING SERIALIZATION STATE ---
  const [packForm, setPackForm] = useState({
    package_code: 'PKG-MAHA-042-2697',
    product_name: 'Pure Western Ghats Jamun Honey (Raw & Cold-Filtered)',
    quantity: 96,
    unit: 'Jars (500g)',
    qr_code: 'HC-QR-PKG-MAHA-042-2697'
  });
  const [packSubmitting, setPackSubmitting] = useState<boolean>(false);
  const [createdPackage, setCreatedPackage] = useState<PackagingBatch | null>(null);

  // Handlers
  const handleCreateProcessing = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingSubmitting(true);
    try {
      const res = await createProcessingLot({
        collection_lot_id: 1,
        processing_code: processingCode,
        input_quantity: Number(inputQuantity),
        output_quantity: Number(outputQuantity),
        processing_type: 'Raw Honey Micro-filtration (100μm) & Low-temp Dehumidification (<45°C)'
      });
      setCreatedProcessingLot(res);
    } finally {
      setProcessingSubmitting(false);
    }
  };

  const handleVerifyLab = async () => {
    setLabSubmitting(true);
    try {
      const saved = await createLabReport({
        processing_lot_id: createdProcessingLot?.id || 1,
        report_code: labForm.report_code,
        sample_id: labForm.sample_id,
        result: labForm.result,
        moisture: Number(labForm.moisture),
        purity_score: Number(labForm.purity_score),
        remarks: labForm.remarks,
        verified: true
      });
      setVerifiedReport(saved);
      setLabForm(prev => ({ ...prev, verified: true }));
    } finally {
      setLabSubmitting(false);
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setPackSubmitting(true);
    try {
      const res = await createPackagingBatch({
        processing_lot_id: createdProcessingLot?.id || 1,
        package_code: packForm.package_code,
        product_name: packForm.product_name,
        quantity: Number(packForm.quantity),
        unit: packForm.unit,
        qr_code: packForm.qr_code
      });
      setCreatedPackage(res);
    } finally {
      setPackSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Plant Banner */}
      <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-honey-100 text-honey-800 text-xs font-semibold border border-honey-300">
              <Factory className="w-3.5 h-3.5 text-honey-700" />
              Western Ghats Honey Federation Agro-Processing Plant #02 (Satara)
            </div>
            <h1 className="text-2xl font-bold font-serif text-forest-900 tracking-tight">
              Processing, Quality Assay & Packaging Serialization
            </h1>
            <p className="text-sm text-forest-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-honey-600" />
              FSSAI Lic. #10022022000451 • Agmark Grading Unit #MH-AGR-401 • NABL Certified Quality Control Lab
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-cream-500 block uppercase font-bold tracking-wider">Facility Temp</span>
              <span className="text-sm font-bold text-forest-900 font-mono flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-emerald-600" /> 23.4°C (Enzyme Safe)
              </span>
            </div>
            <div className="h-8 w-px bg-cream-300" />
            <div className="text-right">
              <span className="text-[10px] text-cream-500 block uppercase font-bold tracking-wider">Plant Status</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                ACTIVE BATCH
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION A: MASS BALANCE CALCULATOR */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
          <div>
            <h2 className="text-lg font-bold font-serif text-forest-900 flex items-center gap-2">
              <Percent className="w-5 h-5 text-honey-600" />
              Stage 1: Input / Output Mass-Balance Reconciliation
            </h2>
            <p className="text-xs text-cream-600 mt-0.5">
              Strict mass-conservation tracking prevents illegal dilution, inverted sugar syrup injection, or volume inflation.
            </p>
          </div>

          {/* Quick Fraud Simulation Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-cream-600 font-semibold">Test Scenario:</span>
            <button
              type="button"
              onClick={() => { setInputQuantity(50.0); setOutputQuantity(48.2); }}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors"
            >
              Normal Loss (3.6%)
            </button>
            <button
              type="button"
              onClick={() => { setInputQuantity(50.0); setOutputQuantity(54.5); }}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 transition-colors"
            >
              Syrup Fraud (+4.5 kg)
            </button>
          </div>
        </div>

        <form onSubmit={handleCreateProcessing} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Input Quantity */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-forest-900">
                Raw Aggregated Honey In (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={inputQuantity}
                  onChange={e => setInputQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 bg-cream-50 border border-cream-300 rounded-xl font-mono font-bold text-forest-950 focus:ring-2 focus:ring-honey-400 focus:outline-hidden"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-cream-500">kg</span>
              </div>
              <p className="text-[11px] text-cream-500">From Collection Lot COL-SAT-2026</p>
            </div>

            {/* Output Quantity */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-forest-900">
                Filtered Clean Honey Out (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={outputQuantity}
                  onChange={e => setOutputQuantity(parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2.5 bg-cream-50 border rounded-xl font-mono font-bold text-forest-950 focus:ring-2 focus:ring-honey-400 focus:outline-hidden ${
                    isDilutionFraud ? 'border-red-400 bg-red-50/50' : 'border-cream-300'
                  }`}
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-cream-500">kg</span>
              </div>
              <p className="text-[11px] text-cream-500">Post 100μm filtration & wax skimming</p>
            </div>

            {/* Processing Batch Code */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-forest-900">
                Processing Batch Code
              </label>
              <input
                type="text"
                value={processingCode}
                onChange={e => setProcessingCode(e.target.value)}
                className="w-full px-3 py-2.5 bg-cream-50 border border-cream-300 rounded-xl font-mono font-bold text-forest-950 focus:ring-2 focus:ring-honey-400 focus:outline-hidden"
                required
              />
              <p className="text-[11px] text-cream-500">Linked to stainless reactor #02</p>
            </div>
          </div>

          {/* Mass Balance Evaluation Card */}
          <div className={`p-4 rounded-xl border text-xs space-y-2 ${
            isDilutionFraud
              ? 'bg-red-50/80 border-red-300 text-red-950'
              : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
          }`}>
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-sm">
                {isDilutionFraud ? (
                  <>
                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                    MASS CONSERVATION BREACH DETECTED
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    Mass Balance Preserved Within Operational Limits
                  </>
                )}
              </span>
              <span className="font-mono text-sm">
                Yield Ratio: {(outputQuantity / (inputQuantity || 1)).toFixed(4)}
              </span>
            </div>

            <p className="leading-relaxed">
              {isDilutionFraud
                ? `CRITICAL ALERT: Output quantity (${outputQuantity.toFixed(2)} kg) exceeds raw incoming honey (${inputQuantity.toFixed(2)} kg) by +${Math.abs(massDifference).toFixed(2)} kg. Physical honey volume cannot increase during processing without external dilution. System will automatically freeze batch certification and alert the state enforcement officer.`
                : `Normal processing shrinkage of ${Math.abs(massDifference).toFixed(2)} kg (${lossPercentage}%) observed due to mechanical filter cake retention, wax cappings removal, and slight moisture evaporation at 38°C. This is well within the 1.5% - 4.5% standard industry baseline.`
              }
            </p>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={processingSubmitting}
              className={`px-6 py-2.5 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 ${
                isDilutionFraud ? 'bg-red-700 hover:bg-red-800' : 'bg-forest-900 hover:bg-forest-950'
              }`}
            >
              <Factory className="w-4 h-4 text-honey-400" />
              {processingSubmitting ? 'Recording Batch...' : 'Register Processing Run'}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION B: FSSAI & NABL QUALITY ASSAY */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm space-y-6">
        <div className="border-b border-cream-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-serif text-forest-900 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-honey-600" />
                Stage 2: FSSAI & NABL Chemical Quality Assay
              </h2>
              <p className="text-xs text-cream-600 mt-0.5">
                Multi-parameter chemical analysis ensuring compliance with Food Safety & Standards (Honey) Regulations 2020.
              </p>
            </div>
            {labForm.verified && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                DIGITALLY CERTIFIED BY NABL
              </span>
            )}
          </div>
        </div>

        {/* Lab Metrics Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Moisture */}
          <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
            <span className="text-cream-600 block text-[11px]">Moisture %</span>
            <span className="text-lg font-black font-mono text-forest-950">{labForm.moisture}%</span>
            <span className="text-[10px] text-emerald-700 block font-semibold mt-1">
              Max 20.0% (Passed)
            </span>
          </div>

          {/* F/G Ratio */}
          <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
            <span className="text-cream-600 block text-[11px]">F/G Ratio</span>
            <span className="text-lg font-black font-mono text-forest-950">{labForm.fg_ratio}</span>
            <span className="text-[10px] text-emerald-700 block font-semibold mt-1">
              Min 1.0 (Passed)
            </span>
          </div>

          {/* HMF */}
          <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
            <span className="text-cream-600 block text-[11px]">HMF (mg/kg)</span>
            <span className="text-lg font-black font-mono text-forest-950">{labForm.hmf}</span>
            <span className="text-[10px] text-emerald-700 block font-semibold mt-1">
              Max 40 mg/kg (Passed)
            </span>
          </div>

          {/* Diastase */}
          <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
            <span className="text-cream-600 block text-[11px]">Diastase Activity</span>
            <span className="text-lg font-black font-mono text-forest-950">{labForm.diastase_activity}</span>
            <span className="text-[10px] text-emerald-700 block font-semibold mt-1">
              Min 8 Schade (Active)
            </span>
          </div>

          {/* C4 Sugar EA-IRMS */}
          <div className="p-3 rounded-xl bg-cream-50 border border-cream-200 col-span-2">
            <span className="text-cream-600 block text-[11px]">C4 Sugar (Isotope δ13C)</span>
            <span className="text-sm font-bold font-mono text-forest-950 truncate block mt-1">
              {labForm.c4_sugar}
            </span>
            <span className="text-[10px] text-emerald-700 block font-semibold">
              Zero Cane / Corn Syrup Adulteration
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-cream-50 border border-cream-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-cream-600 font-semibold block">Laboratory Report ID:</span>
              <span className="font-mono font-bold text-forest-900">{labForm.report_code}</span>
            </div>
            <div>
              <span className="text-cream-600 font-semibold block">Sample Custody Barcode:</span>
              <span className="font-mono font-bold text-forest-900">{labForm.sample_id}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-cream-600 font-semibold block">NABL Chemist Sign-off & Remarks:</span>
              <span className="text-forest-900">{labForm.remarks}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleVerifyLab}
              disabled={labSubmitting || labForm.verified}
              className="px-6 py-2.5 bg-forest-900 hover:bg-forest-950 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4 text-honey-400" />
              {labSubmitting ? 'Writing to Hash Ledger...' : labForm.verified ? 'Lab Certificate Signed ✓' : 'Digitally Sign & Verify Lab Report'}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION C: FINAL PACKAGING & QR SERIALIZATION */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm space-y-6">
        <div className="border-b border-cream-200 pb-4">
          <h2 className="text-lg font-bold font-serif text-forest-900 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-honey-600" />
            Stage 3: Consumer Packaging & QR Serialization
          </h2>
          <p className="text-xs text-cream-600 mt-0.5">
            Bind the laboratory-cleared batch to serialized retail units with public cryptographic QR code.
          </p>
        </div>

        <form onSubmit={handleCreatePackage} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                Retail Package Batch Code
              </label>
              <input
                type="text"
                value={packForm.package_code}
                onChange={e => setPackForm({ ...packForm, package_code: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg font-mono font-bold text-forest-900 focus:ring-2 focus:ring-honey-400 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                Product Label Description
              </label>
              <input
                type="text"
                value={packForm.product_name}
                onChange={e => setPackForm({ ...packForm, product_name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg font-medium text-forest-900 focus:ring-2 focus:ring-honey-400 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                Batch Size & Container
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={packForm.quantity}
                  onChange={e => setPackForm({ ...packForm, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg font-mono font-bold text-forest-900 focus:ring-2 focus:ring-honey-400 focus:outline-hidden"
                  required
                />
                <input
                  type="text"
                  value={packForm.unit}
                  onChange={e => setPackForm({ ...packForm, unit: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg font-medium text-forest-900 focus:ring-2 focus:ring-honey-400 focus:outline-hidden"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-cream-600 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-honey-600" />
              Will generate verifiable cryptographic QR token: <span className="font-mono font-bold text-forest-900">HC-QR-{packForm.package_code}</span>
            </div>

            <button
              type="submit"
              disabled={packSubmitting}
              className="px-6 py-2.5 bg-forest-900 hover:bg-forest-950 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <QrCode className="w-4 h-4 text-honey-400" />
              {packSubmitting ? 'Minting Serialization...' : 'Serialize Retail Jars & Generate QR'}
            </button>
          </div>
        </form>

        {/* Package Batch Created Confirmation */}
        {createdPackage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-forest-950 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Retail Jars Successfully Serialized & Registered!
            </div>
            <div className="text-xs text-forest-800">
              This batch is now discoverable on the public Consumer QR Verification portal with full 6-stage provenance.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
