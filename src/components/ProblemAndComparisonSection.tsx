import React, { useState } from 'react';
import { POLLUTANTS } from '../data/neutrixData';
import { PollutantSpec } from '../types/neutrix';
import { ArrowDown, ArrowRight, CheckCircle2, CircleDot } from 'lucide-react';

const FIVE_STEPS = [
  {
    num: '01',
    code: 'CHARACTERIZE',
    title: 'Identify pollutant composition',
    question: '“What pollutants are present?”',
    detail:
      'Industrial exhaust is rarely a single chemical species. NEUTRIX begins by characterizing which pollutant classes (particulates, soluble acid gases, nitrogen oxides, VOCs, or trace metals) are actually present in the exhaust stream.',
    output: 'Emission Composition Profile',
  },
  {
    num: '02',
    code: 'CONFIGURE',
    title: 'Select required treatment modules',
    question: '“Which treatment modules are actually required?”',
    detail:
      'Instead of routing gas through a rigid, oversized train designed for every hypothetical contaminant, NEUTRIX configures only the treatment mechanisms required by the active pollutant profile.',
    output: 'Tailored Modular Treatment Train',
  },
  {
    num: '03',
    code: 'CALCULATE',
    title: 'Estimate pollutant mass flow and reagent demand',
    question: '“How much pollutant mass is entering & how much reagent is theoretically required?”',
    detail:
      'Using measured gas volumetric flow (Q_gas) and inlet concentration (C_pollutant), the controller calculates incoming mass flow (ṁ_pollutant) and stoichiometric neutralizing reagent demand.',
    output: 'Feedforward Stoichiometric Dose',
  },
  {
    num: '04',
    code: 'TREAT',
    title: 'Operate the selected treatment stages',
    question: '“How is the contaminant captured or converted?”',
    detail:
      'In the bench prototype, particulate filtration removes solid aerosols, counter-current alkaline scrubbing neutralizes soluble acid-gas surrogates across high-surface-area packing rings, and mist elimination strips entrained droplets.',
    output: 'Phase Transfer & Neutralization',
  },
  {
    num: '05',
    code: 'VERIFY & ADAPT',
    title: 'Measure outlet conditions and adjust dosing',
    question: '“What is the current outlet condition — does the system need more or less dosing?”',
    detail:
      'Submerged sump pH sensing and downstream outlet gas monitoring provide continuous feedback to trim the metering pump command and verify whether the treated gas meets target conditions before release.',
    output: 'Closed-Loop Feedback Trim',
  },
];

export const ProblemAndComparisonSection: React.FC = () => {
  const [filterScope, setFilterScope] = useState<'all' | 'prototype' | 'architecture'>('all');
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);

  const filteredPollutants: PollutantSpec[] = POLLUTANTS.filter((p) => {
    if (filterScope === 'prototype') return p.prototypeIncluded;
    if (filterScope === 'architecture') return !p.prototypeIncluded;
    return true;
  });

  const activeStep = FIVE_STEPS[selectedStepIndex];

  return (
    <section id="problem" className="border-b border-slate-800/80 bg-[#07111F] py-16 lg:py-24">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 space-y-20">
        {/* ================= PART 1: THE PROBLEM & POLLUTANT MIXTURES ================= */}
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
                01. THE INDUSTRIAL EMISSIONS PROBLEM
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] font-display text-balance">
                Industrial emissions are mixtures, not single problems.
              </h2>
              <p className="text-base text-[#94A3B8] leading-relaxed">
                Industrial exhaust streams contain varying combinations of acid gases, combustion
                oxides, organic vapors, heavy metals, and particulates. Because different
                pollutants require distinct physical or chemical capture mechanisms, a fixed
                “treat-everything” plant designed around conservative worst-case loads can become
                oversized, chemically intensive, and waste-generating.
              </p>
            </div>

            {/* Interactive Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#0B1726] border border-slate-800 rounded-md self-start">
              <button
                type="button"
                onClick={() => setFilterScope('all')}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap cursor-pointer ${
                  filterScope === 'all'
                    ? 'bg-[#2DD4BF] text-[#07111F] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                All Pollutants (8)
              </button>
              <button
                type="button"
                onClick={() => setFilterScope('prototype')}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap cursor-pointer ${
                  filterScope === 'prototype'
                    ? 'bg-[#A3E635] text-[#07111F] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Prototype Demo Scope (3)
              </button>
              <button
                type="button"
                onClick={() => setFilterScope('architecture')}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap cursor-pointer ${
                  filterScope === 'architecture'
                    ? 'bg-[#101F31] text-[#2DD4BF] border border-[#2DD4BF]/40 font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Architecture Only (5)
              </button>
            </div>
          </div>

          {/* Core Principle Callout Banner */}
          <div className="p-4 sm:p-5 bg-[#0B1726] border-l-4 border-[#2DD4BF] border-y border-r border-slate-800 rounded-r-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#2DD4BF] font-semibold">
                FUNDAMENTAL CONTROL BOUNDARY
              </div>
              <p className="text-sm sm:text-base font-semibold text-[#F8FAFC]">
                Once emissions disperse into the atmosphere, recovery is practically impossible.
                Therefore: <span className="text-[#A3E635]">THE LAST CONTROLLABLE POINT IS BEFORE RELEASE.</span>
              </p>
            </div>
            <div className="text-xs font-mono text-[#94A3B8] shrink-0">
              Current Demo Emphasis: Particulate Removal · Alkaline Absorption · Mist Elimination
            </div>
          </div>

          {/* 8 Pollutant Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPollutants.map((pollutant) => (
              <div
                key={pollutant.id}
                className="bg-[#101F31] border border-slate-800 hover:border-slate-700 rounded-lg p-5 flex flex-col justify-between transition-colors"
              >
                <div className="space-y-3">
                  {/* Quiet unboxed metadata line */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94A3B8]">{pollutant.category}</span>
                    {pollutant.prototypeIncluded ? (
                      <span className="text-[#A3E635] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>PROTOTYPE SCOPE</span>
                      </span>
                    ) : (
                      <span className="text-[#2DD4BF] flex items-center gap-1">
                        <CircleDot className="w-3.5 h-3.5" />
                        <span>ARCHITECTURE</span>
                      </span>
                    )}
                  </div>

                  {/* Symbol & Name */}
                  <div className="flex items-baseline gap-2.5">
                    <span
                      className="text-2xl font-mono font-bold tracking-tight"
                      style={{ color: pollutant.particleColor }}
                    >
                      {pollutant.symbol}
                    </span>
                    <h3 className="text-base font-semibold text-[#F8FAFC]">{pollutant.name}</h3>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[#94A3B8] block font-mono text-[11px]">
                        EXAMPLE INDUSTRIAL SOURCE
                      </span>
                      <span className="text-[#F8FAFC]/90">{pollutant.exampleSource}</span>
                    </div>

                    <div>
                      <span className="text-[#94A3B8] block font-mono text-[11px]">
                        REQUIRED TREATMENT MECHANISM
                      </span>
                      <span className="text-[#2DD4BF] font-medium">
                        {pollutant.treatmentMechanism}
                      </span>
                      <span className="text-slate-500"> · </span>
                      <span className="text-[#F8FAFC]">{pollutant.neutrixModuleName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] font-mono text-[#94A3B8]">
                    {pollutant.prototypeIncluded ? (
                      <span className="text-[#A3E635]">
                        Demonstrated via safe laboratory surrogate in current bench prototype.
                      </span>
                    ) : (
                      <span>
                        Documented in architecture — not demonstrated in current prototype.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= PART 2: CONVENTIONAL VS NEUTRIX COMPARISON ================= */}
        <div className="space-y-8">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
              02. ARCHITECTURAL COMPARISON
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] font-display">
              Why Conventional Fixed Treatment Trains Can Be Inefficient
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8]">
              The primary innovation of NEUTRIX is not a new chemical reaction — it is the
              integration of modular stage selection, mass-flow calculation, stoichiometric demand
              estimation, and closed-loop sensor feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Conventional Fixed Treatment Approach */}
            <div className="bg-[#0B1726] border border-slate-800 rounded-lg p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-mono text-amber-400">
                    ▲ BASELINE PARADIGM · FIXED ARCHITECTURE
                  </div>
                  <h3 className="text-lg font-bold text-[#F8FAFC] mt-1">
                    Conventional Fixed Treatment Approach
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#94A3B8]">Worst-Case Sizing</span>
              </div>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Designed around static worst-case emission assumptions with fixed reagent feed rates,
                causing over-treatment during low-load operating periods.
              </p>

              {/* Vertical/Horizontal Flow Steps */}
              <div className="space-y-2.5">
                {[
                  {
                    step: '01',
                    label: 'Emission profile',
                    desc: 'Variable industrial exhaust enters system',
                  },
                  {
                    step: '02',
                    label: 'Multiple fixed units',
                    desc: 'Gas passes through rigid, permanently coupled stages regardless of composition',
                  },
                  {
                    step: '03',
                    label: 'Fixed / worst-case dosing',
                    desc: 'Reagent feed set for conservative peak load even when inlet concentration drops',
                  },
                  {
                    step: '04',
                    label: 'Higher unnecessary chemical use',
                    desc: 'Excess neutralizing reagent consumed during low or moderate pollutant loading',
                  },
                  {
                    step: '05',
                    label: 'More equipment & more secondary waste',
                    desc: 'Larger physical footprint, higher pressure drop, and increased spent liquor volume',
                  },
                  {
                    step: '06',
                    label: 'Higher operational complexity',
                    desc: 'Difficult to adapt when process fuels or emission profiles shift',
                  },
                ].map((item, idx, arr) => (
                  <React.Fragment key={item.step}>
                    <div className="p-3 bg-[#101F31]/70 border border-slate-800 rounded flex items-start gap-3">
                      <span className="text-xs font-mono text-amber-400 font-semibold mt-0.5">
                        {item.step}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-[#F8FAFC]">{item.label}</div>
                        <div className="text-xs text-[#94A3B8]">{item.desc}</div>
                      </div>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="flex justify-center">
                        <ArrowDown className="w-4 h-4 text-amber-400/70 animate-bounce" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* RIGHT: NEUTRIX Adaptive Modular Approach */}
            <div className="bg-[#0B1726] border border-[#2DD4BF]/40 rounded-lg p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-mono text-[#2DD4BF]">
                    ● NEUTRIX ARCHITECTURE · PROPOSED SYSTEM
                  </div>
                  <h3 className="text-lg font-bold text-[#F8FAFC] mt-1">
                    NEUTRIX Composition-Based & Adaptive Control
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#A3E635]">Closed-Loop Trim</span>
              </div>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Configures only the required treatment modules for the active emission profile and
                modulates reagent dosing using real-time mass-flow stoichiometry and sensor trim.
              </p>

              <div className="space-y-2.5">
                {[
                  {
                    step: '01',
                    label: 'Emission profile & composition mapping',
                    desc: 'Characterizes active pollutants and maps each to its specific capture mechanism',
                  },
                  {
                    step: '02',
                    label: 'Required modules selected',
                    desc: 'Deploys only the stages required by the actual emission profile',
                  },
                  {
                    step: '03',
                    label: 'Mass-flow calculation (ṁ = C × Q)',
                    desc: 'Computes real-time incoming pollutant loading from flow and concentration',
                  },
                  {
                    step: '04',
                    label: 'Stoichiometric demand estimation',
                    desc: 'Determines theoretical neutralizing reagent requirement (feedforward dose)',
                  },
                  {
                    step: '05',
                    label: 'Adaptive dosing with sensor feedback',
                    desc: 'Trims peristaltic pump command continuously using sump pH and outlet sensing',
                  },
                  {
                    step: '06',
                    label: 'Outlet verification before release',
                    desc: 'Confirms treated gas condition at the last controllable point before discharge',
                  },
                ].map((item, idx, arr) => (
                  <React.Fragment key={item.step}>
                    <div className="p-3 bg-[#101F31] border border-slate-800 rounded flex items-start gap-3">
                      <span className="text-xs font-mono text-[#2DD4BF] font-semibold mt-0.5">
                        {item.step}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-[#F8FAFC]">{item.label}</div>
                        <div className="text-xs text-[#94A3B8]">{item.desc}</div>
                      </div>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="flex justify-center">
                        <ArrowDown className="w-4 h-4 text-[#2DD4BF] animate-bounce" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Truthfulness Note on Savings */}
          <div className="p-4 bg-[#101F31] border border-slate-800 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <span className="text-[#A3E635]">
              ENGINEERING HYPOTHESIS (TO BE VALIDATED):
            </span>
            <span className="text-[#F8FAFC]">
              “Potential reduction in unnecessary chemical consumption and equipment complexity — to
              be validated experimentally.”
            </span>
          </div>
        </div>

        {/* ================= PART 3: HOW IT WORKS (5-STEP CLOSED LOOP) ================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
                03. CLOSED-LOOP METHODOLOGY
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] font-display mt-1">
                How NEUTRIX Works: 5-Step Engineering Loop
              </h2>
            </div>
            <div className="text-xs font-mono text-[#94A3B8]">
              Select any stage to inspect the governing engineering question
            </div>
          </div>

          {/* 5 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {FIVE_STEPS.map((s, idx) => {
              const active = idx === selectedStepIndex;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setSelectedStepIndex(idx)}
                  className={`text-left p-4 rounded-lg border transition-colors cursor-pointer flex flex-col justify-between ${
                    active
                      ? 'bg-[#101F31] border-[#2DD4BF]'
                      : 'bg-[#0B1726] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={active ? 'text-[#2DD4BF] font-bold' : 'text-[#94A3B8]'}>
                        {s.num} — {s.code}
                      </span>
                      {idx < 4 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden md:block" />}
                    </div>
                    <div className="text-sm font-semibold text-[#F8FAFC] mt-2">{s.title}</div>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-[#A3E635]">
                    {s.output}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Detail Box */}
          <div className="p-6 bg-[#101F31] border border-slate-800 rounded-lg grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 space-y-1 border-b lg:border-b-0 lg:border-r border-slate-800 pb-4 lg:pb-0 lg:pr-6">
              <div className="text-xs font-mono text-[#2DD4BF]">
                STEP {activeStep.num} · {activeStep.code}
              </div>
              <div className="text-lg font-bold text-[#F8FAFC] font-display">
                {activeStep.question}
              </div>
              <div className="text-xs font-mono text-[#A3E635] pt-1">
                Output: {activeStep.output}
              </div>
            </div>
            <div className="lg:col-span-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-sm text-[#94A3B8] leading-relaxed">{activeStep.detail}</p>
              <button
                type="button"
                onClick={() => setSelectedStepIndex((prev) => (prev + 1) % FIVE_STEPS.length)}
                className="px-3.5 py-2 text-xs font-mono font-semibold bg-[#07111F] text-[#2DD4BF] hover:text-[#F8FAFC] border border-slate-700 rounded shrink-0 cursor-pointer"
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
