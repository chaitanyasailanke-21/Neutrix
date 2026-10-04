import React, { useState } from 'react';
import { useNeutrix } from '../context/NeutrixContext';
import {
  generateLoadComparisonSeries,
  LoadProfilePreset,
  validateTarget,
} from '../utils/calculations';
import { Sliders, Calculator, ArrowRight, Activity, RotateCcw } from 'lucide-react';

export const AdaptiveDosingAndSimulatorSection: React.FC = () => {
  const {
    inletConcentration,
    outletConcentration,
    gasFlow,
    pH,
    pHSetpoint,
    reagentConcentration,
    stoichiometricRatio,
    pumpMaxFlow,
    setInletConcentration,
    setOutletConcentration,
    setGasFlow,
    setPH,
    setPHSetpoint,
    setReagentConcentration,
    setStoichiometricRatio,
    setPumpMaxFlow,
    dosingCalc,
    resetSimulation,
  } = useNeutrix();

  // State for Fixed vs Adaptive Dosing comparison chart
  const [loadPreset, setLoadPreset] = useState<LoadProfilePreset>('variable_cycle');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // State for Section 20 Outlet Performance Calculator (synced by default or independently editable)
  const [calcCin, setCalcCin] = useState<number>(320);
  const [calcCout, setCalcCout] = useState<number>(24);

  const comparisonSeries = generateLoadComparisonSeries(
    loadPreset,
    gasFlow,
    reagentConcentration,
    stoichiometricRatio,
    600
  );

  const perfValidation = validateTarget(calcCin, calcCout);

  const maxDoseChart = Math.max(
    10,
    ...comparisonSeries.map((pt) => Math.max(pt.fixedDoseMlMin, pt.adaptiveDoseMlMin))
  );

  const activePoint =
    hoverIndex !== null && comparisonSeries[hoverIndex]
      ? comparisonSeries[hoverIndex]
      : comparisonSeries[Math.floor(comparisonSeries.length / 2)];

  return (
    <section
      id="simulator"
      className="border-b border-slate-800/80 bg-[#0B1726] py-16 lg:py-24"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 space-y-20">
        {/* ================= PART 1: ADAPTIVE DOSING CONTROL LOOP DIAGRAM ================= */}
        <div className="space-y-8">
          <div className="space-y-3 max-w-3xl">
            <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
              07. ADAPTIVE DOSING CONTROL ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] font-display text-balance">
              Mass-Flow Feedforward + Sensor Feedback Trim
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Feedforward provides an initial dosing estimate from measured loading. Feedback trims
              the command based on process condition.
            </p>
          </div>

          {/* Animated Control Loop Block Diagram */}
          <div className="bg-[#07111F] border border-slate-800 rounded-lg p-5 sm:p-7 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              {/* Block 1: Process Inputs */}
              <div className="lg:col-span-3 bg-[#101F31] border border-slate-800 rounded-md p-4 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-[#2DD4BF] font-semibold">
                    01 · MEASURED INPUTS
                  </div>
                  <div className="text-sm font-bold text-[#F8FAFC] mt-1">
                    Inlet Gas & Flow State
                  </div>
                  <ul className="mt-2.5 space-y-1.5 text-xs font-mono text-[#94A3B8]">
                    <li>• C_pollutant: {inletConcentration} ppmv</li>
                    <li>• Q_gas: {gasFlow.toFixed(1)} L/min</li>
                    <li>• Gas Temp / RH condition</li>
                  </ul>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-[#2DD4BF]">
                  Sensors: AIT-101 + FIT-101
                </div>
              </div>

              {/* Block 2: Mass Flow Equation */}
              <div className="lg:col-span-3 bg-[#101F31] border border-[#2DD4BF]/50 rounded-md p-4 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-[#2DD4BF] font-semibold">
                    02 · MASS FLOW CALCULATION
                  </div>
                  <div className="text-sm font-bold text-[#F8FAFC] mt-1">
                    Pollutant Mass Loading
                  </div>
                  <div className="my-3 p-2.5 bg-[#07111F] border border-slate-800 rounded text-center font-mono text-sm text-[#A3E635]">
                    ṁ_pollutant = C_pollutant × Q_gas
                  </div>
                </div>
                <div className="text-xs font-mono text-[#F8FAFC] flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[#94A3B8]">Current ṁ:</span>
                  <span className="text-[#2DD4BF] font-bold tabular-nums">
                    {dosingCalc.pollutantMassFlowMgMin.toFixed(2)} mg/min
                  </span>
                </div>
              </div>

              {/* Block 3: Stoichiometric Demand -> Feedforward Dose */}
              <div className="lg:col-span-3 bg-[#101F31] border border-slate-800 rounded-md p-4 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-[#A3E635] font-semibold">
                    03 · STOICHIOMETRIC DEMAND
                  </div>
                  <div className="text-sm font-bold text-[#F8FAFC] mt-1">
                    Feedforward Dose Estimate
                  </div>
                  <div className="my-2.5 p-2 bg-[#07111F] border border-slate-800 rounded text-center font-mono text-xs text-[#F8FAFC]">
                    ṅ_reagent = ν × ṅ_pollutant
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    Computes baseline volumetric flow from reagent molarity ({reagentConcentration} M).
                  </p>
                </div>
                <div className="text-xs font-mono flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[#94A3B8]">FF Dose:</span>
                  <span className="text-[#A3E635] font-bold tabular-nums">
                    {dosingCalc.feedforwardDoseMlMin.toFixed(2)} mL/min
                  </span>
                </div>
              </div>

              {/* Block 4: Metering Pump -> Scrubber -> Feedback Trim */}
              <div className="lg:col-span-3 bg-[#101F31] border border-[#A3E635]/50 rounded-md p-4 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-[#A3E635] font-semibold">
                    04 · ACTUATION & FEEDBACK TRIM
                  </div>
                  <div className="text-sm font-bold text-[#F8FAFC] mt-1">
                    Pump → Scrubber → Sensors
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                    pH sensor ({pH.toFixed(2)}) & outlet sensor trim the feedforward estimate by{' '}
                    <span className="text-[#F8FAFC] font-mono">
                      {dosingCalc.feedbackTrimMlMin >= 0 ? '+' : ''}
                      {dosingCalc.feedbackTrimMlMin.toFixed(2)} mL/min
                    </span>
                    .
                  </p>
                </div>
                <div className="text-xs font-mono flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[#94A3B8]">Net Pump Cmd:</span>
                  <span className="text-[#A3E635] font-bold tabular-nums">
                    {dosingCalc.adaptiveTotalDoseMlMin.toFixed(2)} mL/min ({dosingCalc.pumpCommandPct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Closed-Loop Signal Ribbon */}
            <div className="p-3 bg-[#0B1726] border border-slate-800 rounded flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-2 text-[#94A3B8]">
                <span className="text-[#F8FAFC]">LOOP TOPOLOGY:</span>
                <span>INPUTS</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span>MASS FLOW</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span>STOICHIOMETRY</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span className="text-[#A3E635]">METERING PUMP</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span>SCRUBBER</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span className="text-[#2DD4BF]">pH + OUTLET SENSORS</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A3E635]" />
                <span className="text-[#A3E635]">FEEDBACK TRIM</span>
              </div>
              <span className="text-[#94A3B8]">
                Engineering estimate — prototype validation required
              </span>
            </div>
          </div>
        </div>

        {/* ================= PART 2: INTERACTIVE DOSING & STOICHIOMETRY SIMULATOR ================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
                08. INTERACTIVE MASS-FLOW & STOICHIOMETRY CALCULATOR
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] font-display mt-1">
                Interactive Dosing Simulator
              </h2>
            </div>

            <button
              type="button"
              onClick={resetSimulation}
              className="px-3.5 py-2 text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] bg-[#07111F] border border-slate-800 rounded flex items-center gap-1.5 self-start cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Nominal Parameters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: 7 Interactive Sliders + Numeric Inputs */}
            <div className="lg:col-span-7 bg-[#07111F] border border-slate-800 rounded-lg p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
                  <Sliders className="w-4 h-4" />
                  <span className="font-semibold">PROCESS & REAGENT INPUT PARAMETERS</span>
                </div>
                <span className="text-[11px] font-mono text-[#94A3B8]">
                  SI / Metric Dimensional Model
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 1. Pollutant Concentration */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="sim-cin" className="font-medium text-[#F8FAFC]">
                      Pollutant Concentration (C_in)
                    </label>
                    <span className="font-mono text-[#2DD4BF] font-semibold tabular-nums">
                      {inletConcentration} ppmv
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="sim-cin"
                      type="range"
                      min={20}
                      max={1000}
                      step={5}
                      value={inletConcentration}
                      onChange={(e) => setInletConcentration(Number(e.target.value))}
                      className="w-full accent-[#2DD4BF]"
                    />
                    <input
                      type="number"
                      aria-label="Pollutant concentration numeric input"
                      min={0}
                      max={2000}
                      value={inletConcentration}
                      onChange={(e) => setInletConcentration(Math.max(0, Number(e.target.value)))}
                      className="w-20 px-2 py-1 text-xs font-mono bg-[#101F31] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                    />
                  </div>
                </div>

                {/* 2. Gas Flow Rate */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="sim-qgas" className="font-medium text-[#F8FAFC]">
                      Gas Flow Rate (Q_gas)
                    </label>
                    <span className="font-mono text-[#2DD4BF] font-semibold tabular-nums">
                      {gasFlow.toFixed(1)} L/min
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="sim-qgas"
                      type="range"
                      min={2}
                      max={50}
                      step={0.5}
                      value={gasFlow}
                      onChange={(e) => setGasFlow(Number(e.target.value))}
                      className="w-full accent-[#2DD4BF]"
                    />
                    <input
                      type="number"
                      aria-label="Gas flow rate numeric input"
                      min={1}
                      max={100}
                      step={0.5}
                      value={gasFlow}
                      onChange={(e) => setGasFlow(Math.max(0.5, Number(e.target.value)))}
                      className="w-20 px-2 py-1 text-xs font-mono bg-[#101F31] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                    />
                  </div>
                </div>

                {/* 3. Reagent Concentration */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="sim-reag-conc" className="font-medium text-[#F8FAFC]">
                      Reagent Concentration (M)
                    </label>
                    <span className="font-mono text-[#A3E635] font-semibold tabular-nums">
                      {reagentConcentration.toFixed(2)} mol/L
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="sim-reag-conc"
                      type="range"
                      min={0.05}
                      max={1.0}
                      step={0.05}
                      value={reagentConcentration}
                      onChange={(e) => setReagentConcentration(Number(e.target.value))}
                      className="w-full accent-[#A3E635]"
                    />
                    <input
                      type="number"
                      aria-label="Reagent concentration numeric input"
                      min={0.05}
                      max={2.0}
                      step={0.05}
                      value={reagentConcentration}
                      onChange={(e) =>
                        setReagentConcentration(Math.max(0.02, Number(e.target.value)))
                      }
                      className="w-20 px-2 py-1 text-xs font-mono bg-[#101F31] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                    />
                  </div>
                </div>

                {/* 4. Stoichiometric Ratio */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="sim-stoich" className="font-medium text-[#F8FAFC]">
                      Stoichiometric Ratio (ν)
                    </label>
                    <span className="font-mono text-[#A3E635] font-semibold tabular-nums">
                      {stoichiometricRatio.toFixed(1)} mol/mol
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="sim-stoich"
                      type="range"
                      min={0.5}
                      max={4.0}
                      step={0.1}
                      value={stoichiometricRatio}
                      onChange={(e) => setStoichiometricRatio(Number(e.target.value))}
                      className="w-full accent-[#A3E635]"
                    />
                    <input
                      type="number"
                      aria-label="Stoichiometric ratio numeric input"
                      min={0.5}
                      max={6.0}
                      step={0.1}
                      value={stoichiometricRatio}
                      onChange={(e) =>
                        setStoichiometricRatio(Math.max(0.1, Number(e.target.value)))
                      }
                      className="w-20 px-2 py-1 text-xs font-mono bg-[#101F31] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                    />
                  </div>
                </div>

                {/* 5. Current Sump pH */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="sim-ph" className="font-medium text-[#F8FAFC]">
                      Current Sump pH
                    </label>
                    <span className="font-mono text-[#2DD4BF] font-semibold tabular-nums">
                      {pH.toFixed(2)} pH
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="sim-ph"
                      type="range"
                      min={5.0}
                      max={10.5}
                      step={0.05}
                      value={pH}
                      onChange={(e) => setPH(Number(e.target.value))}
                      className="w-full accent-[#2DD4BF]"
                    />
                    <input
                      type="number"
                      aria-label="Current pH numeric input"
                      min={4.0}
                      max={12.0}
                      step={0.05}
                      value={pH}
                      onChange={(e) => setPH(Math.max(4, Math.min(13, Number(e.target.value))))}
                      className="w-20 px-2 py-1 text-xs font-mono bg-[#101F31] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                    />
                  </div>
                </div>

                {/* 6. Target pH Setpoint */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="sim-ph-sp" className="font-medium text-[#F8FAFC]">
                      Target pH Setpoint
                    </label>
                    <span className="font-mono text-[#A3E635] font-semibold tabular-nums">
                      {pHSetpoint.toFixed(2)} pH
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="sim-ph-sp"
                      type="range"
                      min={6.5}
                      max={9.5}
                      step={0.05}
                      value={pHSetpoint}
                      onChange={(e) => setPHSetpoint(Number(e.target.value))}
                      className="w-full accent-[#A3E635]"
                    />
                    <input
                      type="number"
                      aria-label="pH setpoint numeric input"
                      min={6.0}
                      max={10.5}
                      step={0.05}
                      value={pHSetpoint}
                      onChange={(e) =>
                        setPHSetpoint(Math.max(6, Math.min(11, Number(e.target.value))))
                      }
                      className="w-20 px-2 py-1 text-xs font-mono bg-[#101F31] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                    />
                  </div>
                </div>

                {/* 7. Metering Pump Maximum Flow */}
                <div className="sm:col-span-2 space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="sim-pump-max" className="font-medium text-[#F8FAFC]">
                      Metering Pump Maximum Flow Capacity (Q_pump,max)
                    </label>
                    <span className="font-mono text-[#F8FAFC] font-semibold tabular-nums">
                      {pumpMaxFlow.toFixed(1)} mL/min
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="sim-pump-max"
                      type="range"
                      min={5}
                      max={50}
                      step={1}
                      value={pumpMaxFlow}
                      onChange={(e) => setPumpMaxFlow(Number(e.target.value))}
                      className="w-full accent-[#2DD4BF]"
                    />
                    <input
                      type="number"
                      aria-label="Pump maximum flow numeric input"
                      min={2}
                      max={100}
                      step={1}
                      value={pumpMaxFlow}
                      onChange={(e) => setPumpMaxFlow(Math.max(2, Number(e.target.value)))}
                      className="w-20 px-2 py-1 text-xs font-mono bg-[#101F31] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Calculated Engineering Outputs & Load State */}
            <div className="lg:col-span-5 bg-[#101F31] border border-slate-700 rounded-lg p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="text-xs font-mono text-[#A3E635] font-semibold">
                    CALCULATED DOSING & MASS BALANCE
                  </div>
                  {/* Load Regime Indicator (Non-Hue-Only) */}
                  <span
                    className={`text-xs font-mono font-bold ${
                      dosingCalc.loadRegime === 'LOW LOAD'
                        ? 'text-[#2DD4BF]'
                        : dosingCalc.loadRegime === 'NORMAL LOAD'
                        ? 'text-[#A3E635]'
                        : 'text-amber-400'
                    }`}
                  >
                    ● {dosingCalc.loadRegime}
                  </span>
                </div>

                {/* Output Metric Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-[#07111F] border border-slate-800 rounded-md">
                    <div className="text-[11px] font-mono text-[#94A3B8]">
                      POLLUTANT MASS FLOW
                    </div>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-xl font-mono font-bold text-[#F8FAFC] tabular-nums">
                        {dosingCalc.pollutantMassFlowMgMin.toFixed(2)}
                      </span>
                      <span className="text-xs font-mono text-[#94A3B8] ml-1.5">mg/min</span>
                    </div>
                    <div className="text-[11px] font-mono text-[#2DD4BF] mt-1 tabular-nums">
                      ({dosingCalc.pollutantMolarFlowMmolMin.toFixed(4)} mmol/min)
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#07111F] border border-slate-800 rounded-md">
                    <div className="text-[11px] font-mono text-[#94A3B8]">
                      STOICHIOMETRIC DEMAND
                    </div>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-xl font-mono font-bold text-[#F8FAFC] tabular-nums">
                        {dosingCalc.theoreticalReagentMmolMin.toFixed(4)}
                      </span>
                      <span className="text-xs font-mono text-[#94A3B8] ml-1.5">mmol/min</span>
                    </div>
                    <div className="text-[11px] font-mono text-[#A3E635] mt-1 tabular-nums">
                      ({dosingCalc.theoreticalReagentMassMgMin.toFixed(2)} mg/min solute)
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#07111F] border border-slate-800 rounded-md">
                    <div className="text-[11px] font-mono text-[#94A3B8]">
                      ESTIMATED DOSING RATE
                    </div>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-xl font-mono font-bold text-[#2DD4BF] tabular-nums">
                        {dosingCalc.adaptiveTotalDoseMlMin.toFixed(2)}
                      </span>
                      <span className="text-xs font-mono text-[#94A3B8] ml-1.5">mL/min</span>
                    </div>
                    <div className="text-[11px] font-mono text-[#94A3B8] mt-1 tabular-nums">
                      FF: {dosingCalc.feedforwardDoseMlMin.toFixed(2)} + Trim:{' '}
                      {dosingCalc.feedbackTrimMlMin.toFixed(2)}
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#07111F] border border-slate-800 rounded-md">
                    <div className="text-[11px] font-mono text-[#94A3B8]">PUMP COMMAND</div>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-xl font-mono font-bold text-[#A3E635] tabular-nums">
                        {dosingCalc.pumpCommandPct.toFixed(1)}
                      </span>
                      <span className="text-xs font-mono text-[#94A3B8] ml-1.5">% PWM</span>
                    </div>
                    <div className="text-[11px] font-mono text-[#94A3B8] mt-1">
                      State: {dosingCalc.loadRegime}
                    </div>
                  </div>
                </div>

                {/* Pump Command Visual Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#94A3B8]">PERISTALTIC PUMP ACTUATION</span>
                    <span className="text-[#F8FAFC] tabular-nums">
                      {dosingCalc.adaptiveTotalDoseMlMin.toFixed(2)} / {pumpMaxFlow.toFixed(1)} mL/min
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#07111F] rounded overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-[#2DD4BF] transition-all duration-150"
                      style={{ width: `${Math.min(100, dosingCalc.pumpCommandPct)}%` }}
                    />
                  </div>
                  {dosingCalc.pumpSaturated && (
                    <div className="text-xs font-mono text-amber-400">
                      ▲ Warning: Calculated dose exceeds current pump maximum flow capacity.
                    </div>
                  )}
                </div>
              </div>

              {/* Mandatory Truthfulness Disclaimer */}
              <div className="pt-3 border-t border-slate-800 text-xs font-mono text-[#94A3B8] flex items-center justify-between">
                <span>Engineering estimate — prototype validation required.</span>
                <span className="text-[#2DD4BF]">Bench Model</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PART 3: FIXED DOSING VS ADAPTIVE DOSING SIMULATION CHART ================= */}
        <div className="bg-[#07111F] border border-slate-800 rounded-lg p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#A3E635]">
                <Activity className="w-4 h-4" />
                <span>ILLUSTRATIVE SIMULATION — NOT MEASURED PROTOTYPE DATA</span>
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC] font-display mt-1">
                Fixed Worst-Case Dosing vs. NEUTRIX Adaptive Dosing Simulation
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
                Visually illustrates how load-following stoichiometric dosing can avoid unnecessary
                reagent injection when pollutant loading drops below conservative peak design values.
              </p>
            </div>

            {/* Load Profile Selector Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'variable_cycle', label: 'Variable Cycle' },
                  { id: 'low_load_baseline', label: 'Low-Load Baseline' },
                  { id: 'intermittent_peak', label: 'Intermittent Spike' },
                  { id: 'step_turndown', label: 'Step Turndown' },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setLoadPreset(preset.id)}
                  className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                    loadPreset === preset.id
                      ? 'bg-[#2DD4BF] text-[#07111F] font-semibold'
                      : 'bg-[#101F31] text-[#94A3B8] hover:text-[#F8FAFC] border border-slate-800'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SVG Comparison Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-9 bg-[#0B1726] border border-slate-800 rounded-md p-4">
              <svg
                viewBox="0 0 760 250"
                className="w-full h-auto cursor-crosshair select-none"
                role="img"
                aria-label="Chart comparing fixed worst-case reagent dosing against adaptive stoichiometric dosing across a 60-minute synthetic load profile."
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* Horizontal Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
                  const y = 25 + frac * 185;
                  const val = ((1 - frac) * maxDoseChart).toFixed(1);
                  return (
                    <g key={i}>
                      <line
                        x1="52"
                        y1={y}
                        x2="735"
                        y2={y}
                        stroke="#1E293B"
                        strokeWidth="1"
                      />
                      <text
                        x="46"
                        y={y + 3}
                        textAnchor="end"
                        fill="#64748B"
                        fontSize="9"
                        fontFamily="IBM Plex Mono"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Excess Dosing Region between Fixed Line and Adaptive Curve */}
                {(() => {
                  const topPts = comparisonSeries.map((pt, idx) => {
                    const x = 52 + (idx / (comparisonSeries.length - 1)) * 683;
                    const y = 210 - (pt.fixedDoseMlMin / maxDoseChart) * 185;
                    return `${x},${y}`;
                  });
                  const botPts = [...comparisonSeries]
                    .reverse()
                    .map((pt, revIdx) => {
                      const idx = comparisonSeries.length - 1 - revIdx;
                      const x = 52 + (idx / (comparisonSeries.length - 1)) * 683;
                      const y = 210 - (pt.adaptiveDoseMlMin / maxDoseChart) * 185;
                      return `${x},${y}`;
                    });
                  return (
                    <polygon
                      points={[...topPts, ...botPts].join(' ')}
                      fill="#F59E0B"
                      fillOpacity="0.12"
                    />
                  );
                })()}

                {/* Fixed Worst-Case Dosing Line (Dashed Amber) */}
                <polyline
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  points={comparisonSeries
                    .map((pt, idx) => {
                      const x = 52 + (idx / (comparisonSeries.length - 1)) * 683;
                      const y = 210 - (pt.fixedDoseMlMin / maxDoseChart) * 185;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {/* Adaptive Dosing Curve (Solid Teal) */}
                <polyline
                  fill="none"
                  stroke="#2DD4BF"
                  strokeWidth="2.5"
                  points={comparisonSeries
                    .map((pt, idx) => {
                      const x = 52 + (idx / (comparisonSeries.length - 1)) * 683;
                      const y = 210 - (pt.adaptiveDoseMlMin / maxDoseChart) * 185;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {/* Interactive Hover Columns */}
                {comparisonSeries.map((pt, idx) => {
                  const x = 52 + (idx / (comparisonSeries.length - 1)) * 683;
                  const yAdapt = 210 - (pt.adaptiveDoseMlMin / maxDoseChart) * 185;
                  const yFixed = 210 - (pt.fixedDoseMlMin / maxDoseChart) * 185;
                  const isHovered = hoverIndex === idx;
                  return (
                    <g key={pt.minute}>
                      {isHovered && (
                        <>
                          <line
                            x1={x}
                            y1="25"
                            x2={x}
                            y2="210"
                            stroke="#94A3B8"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                          />
                          <circle cx={x} cy={yAdapt} r="4.5" fill="#2DD4BF" />
                          <circle cx={x} cy={yFixed} r="4" fill="#F59E0B" />
                        </>
                      )}
                      <rect
                        x={x - 10}
                        y="20"
                        width="20"
                        height="195"
                        fill="transparent"
                        onMouseEnter={() => setHoverIndex(idx)}
                      />
                    </g>
                  );
                })}

                {/* X-Axis Labels */}
                {[0, 15, 30, 45, 60].map((minVal) => {
                  const x = 52 + (minVal / 60) * 683;
                  return (
                    <text
                      key={minVal}
                      x={x}
                      y="232"
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="9.5"
                      fontFamily="IBM Plex Mono"
                    >
                      T+{minVal}m
                    </text>
                  );
                })}

                <text x="16" y="18" fill="#94A3B8" fontSize="9" fontFamily="IBM Plex Mono">
                  Dose (mL/min)
                </text>
              </svg>
            </div>

            {/* Inspection HUD Panel for Chart */}
            <div className="lg:col-span-3 bg-[#101F31] border border-slate-800 rounded-md p-4 space-y-4 font-mono text-xs">
              <div className="text-[#2DD4BF] font-semibold border-b border-slate-800 pb-2">
                SIMULATED TIME STEP · T+{activePoint.minute} MIN
              </div>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[#94A3B8] block text-[11px]">SYNTHETIC INLET LOAD</span>
                  <span className="text-base font-bold text-[#F8FAFC] tabular-nums">
                    {activePoint.pollutantPpm} ppmv
                  </span>
                </div>

                <div>
                  <span className="text-amber-400 block text-[11px]">
                    FIXED DOSING (600 PPM DESIGN)
                  </span>
                  <span className="text-base font-bold text-amber-400 tabular-nums">
                    {activePoint.fixedDoseMlMin.toFixed(2)} mL/min
                  </span>
                </div>

                <div>
                  <span className="text-[#2DD4BF] block text-[11px]">
                    NEUTRIX ADAPTIVE DOSING
                  </span>
                  <span className="text-base font-bold text-[#2DD4BF] tabular-nums">
                    {activePoint.adaptiveDoseMlMin.toFixed(2)} mL/min
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[#A3E635] block text-[11px]">
                    ESTIMATED EXCESS DOSING AVOIDED
                  </span>
                  <span className="text-base font-bold text-[#A3E635] tabular-nums">
                    {activePoint.excessDoseMlMin.toFixed(2)} mL/min
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[#94A3B8] pt-2 border-t border-slate-800 font-sans">
                Illustrative simulation — not measured prototype data. Actual reagent reduction will
                be evaluated under Validation Criterion #3.
              </div>
            </div>
          </div>
        </div>

        {/* ================= PART 4: OUTLET PERFORMANCE CALCULATOR (SECTION 20) ================= */}
        <div className="bg-[#101F31] border border-slate-700 rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
                <Calculator className="w-4 h-4" />
                <span>09. OUTLET PERFORMANCE & EFFICIENCY CALCULATOR</span>
              </div>
              <h3 className="text-2xl font-bold text-[#F8FAFC] font-display">
                Surrogate Removal Efficiency Formula
              </h3>
              <div className="p-3 bg-[#07111F] border border-slate-800 rounded font-mono text-sm text-[#A3E635] text-center">
                η = ((C_in − C_out) / C_in) × 100
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Enter hypothetical or measured inlet and outlet concentrations to evaluate whether a
                test scenario meets the ≥90% surrogate removal prototype target.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Inputs C_in and C_out */}
              <div className="sm:col-span-5 space-y-3 bg-[#07111F] border border-slate-800 p-4 rounded-md">
                <div>
                  <label
                    htmlFor="perf-cin"
                    className="block text-xs font-mono text-[#94A3B8] mb-1"
                  >
                    Inlet Concentration (C_in, ppm)
                  </label>
                  <input
                    id="perf-cin"
                    type="number"
                    min={1}
                    max={5000}
                    value={calcCin}
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value));
                      setCalcCin(val);
                      setInletConcentration(val);
                    }}
                    className="w-full px-3 py-2 text-sm font-mono bg-[#101F31] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="perf-cout"
                    className="block text-xs font-mono text-[#94A3B8] mb-1"
                  >
                    Outlet Concentration (C_out, ppm)
                  </label>
                  <input
                    id="perf-cout"
                    type="number"
                    min={0}
                    max={5000}
                    value={calcCout}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value));
                      setCalcCout(val);
                      setOutletConcentration(val);
                    }}
                    className="w-full px-3 py-2 text-sm font-mono bg-[#101F31] border border-slate-700 rounded text-[#F8FAFC] tabular-nums"
                  />
                </div>
              </div>

              {/* Output Evaluation Box */}
              <div className="sm:col-span-7 p-5 bg-[#07111F] border border-slate-800 rounded-md space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#94A3B8]">CALCULATED EFFICIENCY (η)</span>
                  <span className="text-[#2DD4BF]">PROTOTYPE TARGET: ≥ 90.0%</span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span
                    className={`text-3xl sm:text-4xl font-mono font-bold tabular-nums ${
                      perfValidation.meetsTarget ? 'text-[#A3E635]' : 'text-amber-400'
                    }`}
                  >
                    {perfValidation.efficiency.toFixed(2)}%
                  </span>
                  <span className="text-xs font-mono text-[#94A3B8]">SCENARIO CALCULATION</span>
                </div>

                <div
                  className={`text-xs font-mono font-semibold ${
                    perfValidation.meetsTarget ? 'text-[#A3E635]' : 'text-amber-400'
                  }`}
                >
                  {perfValidation.statusHeading}
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {perfValidation.statusSubtext}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
