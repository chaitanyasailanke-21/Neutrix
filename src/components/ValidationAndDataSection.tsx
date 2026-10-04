import React, { useState } from 'react';
import { VALIDATION_CRITERIA } from '../data/neutrixData';
import { useNeutrix } from '../context/NeutrixContext';
import { calculateRemovalEfficiency } from '../utils/calculations';
import { Plus, Download, Trash2, ClipboardCheck, Clock } from 'lucide-react';

export const ValidationAndDataSection: React.FC = () => {
  const {
    testResults,
    addTestResult,
    deleteTestResult,
    clearTestResults,
    exportTestResultsCsv,
  } = useNeutrix();

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  // Form state for adding a future experimental test run
  const [testId, setTestId] = useState<string>('RUN-01');
  const [date, setDate] = useState<string>('2026-12-20');
  const [surrogateUsed, setSurrogateUsed] = useState<string>('CO₂ Surrogate');
  const [inletPpm, setInletPpm] = useState<number>(300);
  const [outletPpm, setOutletPpm] = useState<number>(25);
  const [gasFlowLpm, setGasFlowLpm] = useState<number>(18.0);
  const [phVal, setPhVal] = useState<number>(7.8);
  const [reagentDose, setReagentDose] = useState<number>(4.2);
  const [pumpCmd, setPumpCmd] = useState<number>(28.0);
  const [refMeas, setRefMeas] = useState<number>(24.5);
  const [sensorMeas, setSensorMeas] = useState<number>(25.0);
  const [notes, setNotes] = useState<string>('');

  const previewEfficiency = calculateRemovalEfficiency(inletPpm, outletPpm);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTestResult({
      testId: testId.trim() || `RUN-${testResults.length + 1}`,
      date,
      surrogateUsed,
      inletConcentrationPpm: Number(inletPpm),
      outletConcentrationPpm: Number(outletPpm),
      gasFlowLpm: Number(gasFlowLpm),
      pH: Number(phVal),
      reagentDoseMlMin: Number(reagentDose),
      pumpCommandPct: Number(pumpCmd),
      referenceMeasurementPpm: Number(refMeas),
      sensorMeasurementPpm: Number(sensorMeas),
      notes: notes.trim() || 'Logged in browser localStorage',
    });
    setTestId(`RUN-0${testResults.length + 2}`);
    setNotes('');
    setShowAddForm(false);
  };

  return (
    <section
      id="validation"
      className="border-b border-slate-800/80 bg-[#07111F] py-16 lg:py-24"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 space-y-20">
        {/* ================= PART 1: VALIDATION & SUCCESS CRITERIA DASHBOARD ================= */}
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
                14. ENGINEERING VALIDATION & SUCCESS CRITERIA
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] font-display text-balance">
                Structured Bench Validation Protocol
              </h2>
              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                NEUTRIX does not claim unverified performance. The bench prototype will be evaluated
                against seven explicit engineering success criteria during Stage 5 testing. All
                criteria remain marked <span className="text-amber-400 font-mono">NOT YET VALIDATED</span>{' '}
                until physical test runs are completed.
              </p>
            </div>

            <div className="p-3.5 bg-[#0B1726] border border-slate-800 rounded-md text-xs font-mono space-y-1 shrink-0">
              <div className="text-[#94A3B8]">OVERALL VALIDATION STATE</div>
              <div className="text-amber-400 font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>0 / 7 CRITERIA VALIDATED (PROTOTYPE STAGE)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VALIDATION_CRITERIA.map((item) => (
              <div
                key={item.id}
                className="bg-[#101F31] border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#2DD4BF] font-bold">CRITERION 0{item.id}</span>
                    <span className="text-amber-400 font-semibold">
                      ▲ STATUS: {item.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#F8FAFC]">{item.title}</h3>
                  <p className="text-xs text-[#F8FAFC]/90 leading-relaxed">
                    {item.metricOrCondition}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-[#94A3B8] block">
                      VERIFICATION METHODOLOGY
                    </span>
                    <span className="text-[#94A3B8]">{item.verificationMethod}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#94A3B8] block">
                      TARGET THRESHOLD
                    </span>
                    <span className="text-[#A3E635] font-mono text-[11px]">
                      {item.targetCriterion}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= PART 2: EXPERIMENTAL DATA ENTRY & CSV EXPORT MODULE ================= */}
        <div className="bg-[#0B1726] border border-slate-800 rounded-lg p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
                <ClipboardCheck className="w-4 h-4" />
                <span>15. EXPERIMENTAL DATA LOGGING MODULE (LOCALSTORAGE PERSISTENCE)</span>
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC] font-display">
                Bench Validation Test Log & CSV Export Interface
              </h3>
              <p className="text-xs text-[#94A3B8]">
                No fabricated experimental datasets are pre-populated. Use this interface to enter,
                calculate, persist, and export real bench-scale test measurements as validation
                proceeds.
              </p>
            </div>

            {/* Action Buttons: Add Test | Export CSV | Clear Data */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowAddForm((prev) => !prev)}
                className="px-4 py-2 text-xs font-mono font-bold bg-[#2DD4BF] text-[#07111F] hover:bg-[#5EEAD4] rounded-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddForm ? 'Close Entry Form' : 'Add Test'}</span>
              </button>

              <button
                type="button"
                onClick={exportTestResultsCsv}
                disabled={testResults.length === 0}
                className={`px-4 py-2 text-xs font-mono font-semibold rounded-md flex items-center gap-1.5 border ${
                  testResults.length > 0
                    ? 'bg-[#101F31] text-[#F8FAFC] hover:bg-slate-800 border-slate-700 cursor-pointer'
                    : 'bg-[#07111F] text-slate-600 border-slate-800 cursor-not-allowed'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV ({testResults.length})</span>
              </button>

              {!confirmClear ? (
                <button
                  type="button"
                  onClick={() => {
                    if (testResults.length > 0) setConfirmClear(true);
                  }}
                  disabled={testResults.length === 0}
                  className={`px-3.5 py-2 text-xs font-mono rounded-md flex items-center gap-1.5 border ${
                    testResults.length > 0
                      ? 'bg-[#07111F] text-rose-400 hover:bg-rose-950/30 border-slate-800 cursor-pointer'
                      : 'bg-[#07111F] text-slate-600 border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Data</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      clearTestResults();
                      setConfirmClear(false);
                    }}
                    className="px-3 py-2 text-xs font-mono font-bold bg-rose-600 text-white rounded-md cursor-pointer"
                  >
                    Confirm Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-2.5 py-2 text-xs font-mono text-[#94A3B8] bg-[#07111F] border border-slate-700 rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Collapsible Add Test Entry Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddSubmit}
              className="p-5 bg-[#101F31] border border-[#2DD4BF]/50 rounded-md space-y-4"
            >
              <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
                <span className="text-[#2DD4BF] font-bold">
                  ENTER EXPERIMENTAL TEST RECORD (STORED IN BROWSER LOCALSTORAGE)
                </span>
                <span className="text-[#A3E635]">
                  Preview Calculated Removal Efficiency: {previewEfficiency.toFixed(2)}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs">
                <div>
                  <label className="block font-mono text-[#94A3B8] mb-1">Test ID</label>
                  <input
                    type="text"
                    required
                    value={testId}
                    onChange={(e) => setTestId(e.target.value)}
                    className="w-full px-2.5 py-1.5 font-mono bg-[#07111F] border border-slate-700 rounded text-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#94A3B8] mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 font-mono bg-[#07111F] border border-slate-700 rounded text-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#94A3B8] mb-1">Inlet Conc (ppm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={inletPpm}
                    onChange={(e) => setInletPpm(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 font-mono bg-[#07111F] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#94A3B8] mb-1">Outlet Conc (ppm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={outletPpm}
                    onChange={(e) => setOutletPpm(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 font-mono bg-[#07111F] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#94A3B8] mb-1">Gas Flow (L/min)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={gasFlowLpm}
                    onChange={(e) => setGasFlowLpm(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 font-mono bg-[#07111F] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#94A3B8] mb-1">Sump pH</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={phVal}
                    onChange={(e) => setPhVal(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 font-mono bg-[#07111F] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#94A3B8] mb-1">
                    Reagent Dose (mL/min)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={reagentDose}
                    onChange={(e) => setReagentDose(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 font-mono bg-[#07111F] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#94A3B8] mb-1">Pump Command (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={pumpCmd}
                    onChange={(e) => setPumpCmd(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 font-mono bg-[#07111F] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#94A3B8] mb-1">
                    Reference Meas (ppm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={refMeas}
                    onChange={(e) => setRefMeas(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 font-mono bg-[#07111F] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#94A3B8] mb-1">
                    Sensor Meas (ppm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={sensorMeas}
                    onChange={(e) => setSensorMeas(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 font-mono bg-[#07111F] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[#94A3B8] mb-1">
                    Surrogate & Test Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., CO₂ surrogate bench calibration run"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-2.5 py-1.5 font-mono bg-[#07111F] border border-slate-700 rounded text-[#F8FAFC]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3.5 py-1.5 text-xs font-mono text-[#94A3B8] bg-[#07111F] border border-slate-700 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-mono font-bold bg-[#A3E635] text-[#07111F] rounded cursor-pointer"
                >
                  Save Test Record
                </button>
              </div>
            </form>
          )}

          {/* Experimental Data Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#101F31] border-b border-slate-800 text-[11px] font-mono text-[#94A3B8]">
                  <th className="py-3 px-3">Test ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Inlet Conc</th>
                  <th className="py-3 px-3">Outlet Conc</th>
                  <th className="py-3 px-3">Gas Flow</th>
                  <th className="py-3 px-3">pH</th>
                  <th className="py-3 px-3">Reagent Dose</th>
                  <th className="py-3 px-3">Pump Cmd</th>
                  <th className="py-3 px-3">Calc Efficiency</th>
                  <th className="py-3 px-3">Ref Meas</th>
                  <th className="py-3 px-3">Sensor Meas</th>
                  <th className="py-3 px-3">Notes</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs font-mono">
                {testResults.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-8 px-4 text-center text-[#94A3B8] font-sans">
                      No experimental test entries logged yet. Click{' '}
                      <button
                        type="button"
                        onClick={() => setShowAddForm(true)}
                        className="text-[#2DD4BF] underline font-mono cursor-pointer"
                      >
                        Add Test
                      </button>{' '}
                      above when recording bench prototype measurements.
                    </td>
                  </tr>
                ) : (
                  testResults.map((row) => (
                    <tr key={row.id} className="hover:bg-[#101F31]/60">
                      <td className="py-2.5 px-3 font-bold text-[#F8FAFC] whitespace-nowrap">
                        {row.testId}
                      </td>
                      <td className="py-2.5 px-3 text-[#94A3B8] whitespace-nowrap">{row.date}</td>
                      <td className="py-2.5 px-3 text-[#F8FAFC] tabular-nums">
                        {row.inletConcentrationPpm} ppm
                      </td>
                      <td className="py-2.5 px-3 text-[#2DD4BF] tabular-nums">
                        {row.outletConcentrationPpm} ppm
                      </td>
                      <td className="py-2.5 px-3 text-[#F8FAFC] tabular-nums">
                        {row.gasFlowLpm} L/min
                      </td>
                      <td className="py-2.5 px-3 text-[#A3E635] tabular-nums">{row.pH}</td>
                      <td className="py-2.5 px-3 text-[#F8FAFC] tabular-nums">
                        {row.reagentDoseMlMin} mL/min
                      </td>
                      <td className="py-2.5 px-3 text-[#F8FAFC] tabular-nums">
                        {row.pumpCommandPct}%
                      </td>
                      <td
                        className={`py-2.5 px-3 font-bold tabular-nums ${
                          row.calculatedEfficiencyPct >= 90 ? 'text-[#A3E635]' : 'text-amber-400'
                        }`}
                      >
                        {row.calculatedEfficiencyPct.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-3 text-[#F8FAFC] tabular-nums">
                        {row.referenceMeasurementPpm} ppm
                      </td>
                      <td className="py-2.5 px-3 text-[#F8FAFC] tabular-nums">
                        {row.sensorMeasurementPpm} ppm
                      </td>
                      <td className="py-2.5 px-3 text-[#94A3B8] font-sans max-w-xs truncate">
                        {row.notes}
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          type="button"
                          onClick={() => deleteTestResult(row.id)}
                          aria-label={`Delete test ${row.testId}`}
                          className="text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
