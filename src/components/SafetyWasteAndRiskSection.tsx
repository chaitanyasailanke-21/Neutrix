import React, { useState } from 'react';
import { ENGINEERING_RISKS, DFMEA_ITEMS } from '../data/neutrixData';
import { ShieldAlert, ArrowDown, AlertTriangle } from 'lucide-react';

const SAFETY_CONTROLS = [
  {
    code: 'VENTILATION',
    title: 'Active Laboratory Exhaust Extraction',
    detail:
      'All bench prototype operations are conducted inside a certified laboratory fume hood or connected to active local exhaust ventilation.',
  },
  {
    code: 'PPE',
    title: 'Personal Protective Equipment',
    detail:
      'Chemical splash goggles, nitrile gloves, and laboratory coats are mandatory during reagent preparation, dosing calibration, and sump draining.',
  },
  {
    code: 'GAS DETECTION',
    title: 'Ambient & Inline Gas Monitoring',
    detail:
      'Surrogate concentrations are bounded and continuously monitored at both inlet and outlet ports, alongside ambient workspace gas monitoring.',
  },
  {
    code: 'CHEMICAL HANDLING',
    title: 'Dilute Reagent & Buffer Protocol',
    detail:
      'Uses low-molarity alkaline solutions or mild carbonate/bicarbonate buffer surrogates rather than concentrated industrial caustic.',
  },
  {
    code: 'SPILL MANAGEMENT',
    title: 'Full-Footprint Secondary Drip Tray',
    detail:
      'The scrubber column, sump, circulation loop, and reagent reservoir sit inside a continuous secondary containment tray with neutralizer kit nearby.',
  },
  {
    code: 'WASTE COLLECTION',
    title: 'Segregated Spent Liquor & Media Containers',
    detail:
      'Spent scrubber sump solution and used particulate filter elements are collected in labeled containers for institutional chemical waste disposal.',
  },
  {
    code: 'SUPERVISED TESTING',
    title: 'Surrogate-Only Supervised Validation',
    detail:
      'No toxic industrial gases are generated on the student bench; testing uses harmless or low-concentration surrogate gas under faculty/lab supervision.',
  },
];

export const SafetyWasteAndRiskSection: React.FC = () => {
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const filteredRisks = ENGINEERING_RISKS.filter(
    (r) => riskFilter === 'ALL' || r.category.toUpperCase() === riskFilter
  );

  return (
    <section
      id="safety"
      className="border-b border-slate-800/80 bg-[#0B1726] py-16 lg:py-24"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 space-y-20">
        {/* ================= PART 1: PROMINENT SAFETY & CONTROLLED VALIDATION SECTION ================= */}
        <div className="space-y-8">
          <div className="space-y-3 max-w-3xl">
            <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
              16. LABORATORY SAFETY & OPERATING BOUNDARIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] font-display text-balance">
              Designed around controlled validation.
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Industrial hazardous gases such as{' '}
              <span className="text-[#F8FAFC] font-mono">SO₂, H₂S, HCl, HF, and NOₓ</span> are{' '}
              <span className="text-rose-400 font-semibold">NOT</span> intended for uncontrolled
              student bench testing. Current prototype demonstration uses{' '}
              <span className="text-[#A3E635] font-medium">
                “Harmless or low-concentration surrogate gas under appropriate laboratory
                supervision.”
              </span>
            </p>
          </div>

          {/* Mandatory Safety Warning Callout */}
          <div className="p-5 bg-[#07111F] border-l-4 border-rose-500 border-y border-r border-slate-800 rounded-r-lg flex items-start gap-4">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-mono text-rose-400 font-bold">
                MANDATORY ENGINEERING SAFETY BOUNDARY
              </div>
              <p className="text-sm sm:text-base font-semibold text-[#F8FAFC]">
                “NEUTRIX is a prototype engineering demonstration. Hazardous-gas testing requires an
                appropriately qualified laboratory, engineering controls, procedures and
                supervision.”
              </p>
            </div>
          </div>

          {/* 7 Safety Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAFETY_CONTROLS.map((card, idx) => (
              <div
                key={card.code}
                className="bg-[#101F31] border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#2DD4BF] font-bold">{card.code}</span>
                    <span className="text-[#94A3B8]">SAFEGUARD 0{idx + 1}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#F8FAFC]">{card.title}</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{card.detail}</p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-[#A3E635]">
                  ● Required for bench validation
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= PART 2: SECONDARY WASTE PHASE-TRANSFER DIAGRAM (SECTION 24) ================= */}
        <div className="bg-[#07111F] border border-slate-800 rounded-lg p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#2DD4BF] font-semibold">
                17. CONSERVATION OF MASS & SECONDARY WASTE MANAGEMENT
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC] font-display">
                Phase Transfer: Gas-Phase Capture to Liquid & Solid Waste Streams
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-400">
              Secondary streams require controlled management
            </span>
          </div>

          <p className="text-sm text-[#F8FAFC]/90 font-medium bg-[#101F31] border border-slate-800 p-4 rounded-md">
            “Treatment transfers contaminants from the gas phase into liquid or solid waste streams
            that must be managed appropriately.”
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Liquid Waste Flow Chain */}
            <div className="lg:col-span-7 bg-[#0B1726] border border-slate-800 rounded-md p-5 space-y-3">
              <div className="text-xs font-mono text-[#2DD4BF] font-semibold">
                AQUEOUS SCRUBBER EFFLUENT PATHWAY
              </div>
              <div className="space-y-2">
                {[
                  {
                    stage: '01 · Scrubber',
                    desc: 'Acid-gas species absorbed and neutralized by alkaline scrubbing liquor in packed column',
                  },
                  {
                    stage: '02 · Spent liquid',
                    desc: 'Dissolved reaction salts accumulate in lower sump as reagent is consumed',
                  },
                  {
                    stage: '03 · Collection',
                    desc: 'Periodic blowdown / sump drain routed into dedicated labeled collection vessel',
                  },
                  {
                    stage: '04 · Neutralization / treatment',
                    desc: 'pH verification, precipitation/filtration or secondary wastewater treatment as required',
                  },
                  {
                    stage: '05 · Safe disposal or reuse subject to applicable procedures',
                    desc: 'Managed in accordance with laboratory or industrial environmental regulations (not assumed automatically harmless)',
                  },
                ].map((step, i, arr) => (
                  <React.Fragment key={step.stage}>
                    <div className="p-3 bg-[#101F31] border border-slate-800 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-[#F8FAFC] shrink-0">
                        {step.stage}
                      </span>
                      <span className="text-xs text-[#94A3B8]">{step.desc}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex justify-center">
                        <ArrowDown className="w-4 h-4 text-[#2DD4BF]" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Solid Waste Streams */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="bg-[#0B1726] border border-slate-800 rounded-md p-5 space-y-2 flex-1">
                <div className="text-xs font-mono text-[#A3E635] font-semibold">
                  SOLID STREAM 01 · PARTICULATE FILTER WASTE
                </div>
                <h4 className="text-base font-bold text-[#F8FAFC]">
                  Loaded Mechanical Filter Media
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Captured fly ash, dust, or aerosol particulates remain trapped on the upstream
                  filter cartridge. Must be bagged and disposed of according to the chemical hazard
                  class of the captured dust.
                </p>
              </div>

              <div className="bg-[#0B1726] border border-slate-800 rounded-md p-5 space-y-2 flex-1">
                <div className="text-xs font-mono text-amber-400 font-semibold">
                  SOLID STREAM 02 · ADSORBENT WASTE (ARCHITECTURE STAGE)
                </div>
                <h4 className="text-base font-bold text-[#F8FAFC]">
                  Spent Activated Carbon / Polishing Sorbent
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  In configurations utilizing downstream VOC or mercury polishing modules, spent
                  sorbent media concentrates captured species and requires thermal regeneration or
                  licensed hazardous solid waste disposal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PART 3: INTERACTIVE ENGINEERING RISK MATRIX (SECTION 25) ================= */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
                18. ENGINEERING RISK REGISTER (10 CORE RISKS)
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] font-display mt-1">
                Interactive Risk & Mitigation Matrix
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {['ALL', 'SAFETY', 'PROCESS', 'SENSING', 'CONTROL', 'SCALE-UP', 'PROJECT'].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setRiskFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                      riskFilter === cat
                        ? 'bg-[#2DD4BF] text-[#07111F] font-semibold'
                        : 'bg-[#07111F] text-[#94A3B8] hover:text-[#F8FAFC] border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRisks.map((item) => (
              <div
                key={item.id}
                className="bg-[#101F31] border border-slate-800 rounded-lg p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-[#2DD4BF] font-semibold">
                      {item.category.toUpperCase()} RISK
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          item.severity === 'HIGH'
                            ? 'text-rose-400 font-bold'
                            : item.severity === 'MEDIUM'
                            ? 'text-amber-400'
                            : 'text-[#94A3B8]'
                        }
                      >
                        SEV: {item.severity}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[#94A3B8]">LIKELIHOOD: {item.likelihood}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#F8FAFC]">{item.risk}</h3>

                  <div className="text-xs space-y-1.5 pt-1">
                    <div>
                      <span className="font-mono text-[10px] text-[#94A3B8] block">
                        WHY IT MATTERS
                      </span>
                      <span className="text-[#F8FAFC]/90">{item.whyItMatters}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#A3E635] block">
                        ENGINEERING MITIGATION
                      </span>
                      <span className="text-[#94A3B8]">{item.mitigation}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-800 text-[11px] font-mono text-[#2DD4BF]">
                  STATUS: {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= PART 4: SIMPLIFIED DESIGN-FMEA (DFMEA) TABLE (SECTION 29) ================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
                19. DESIGN FAILURE MODE AND EFFECTS ANALYSIS (DFMEA)
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] font-display mt-1">
                Subsystem Failure Modes, Detection & Safeguards
              </h2>
            </div>
            <div className="text-xs font-mono text-[#94A3B8]">
              Qualitative engineering DFMEA — no unverified numerical RPN scores assigned
            </div>
          </div>

          <div className="bg-[#07111F] border border-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#101F31] border-b border-slate-800 text-xs font-mono text-[#94A3B8]">
                    <th className="py-3.5 px-4">Component</th>
                    <th className="py-3.5 px-4">Failure Mode</th>
                    <th className="py-3.5 px-4">Process Effect</th>
                    <th className="py-3.5 px-4">Potential Cause</th>
                    <th className="py-3.5 px-4">Detection Method</th>
                    <th className="py-3.5 px-4">Mitigation / Safeguard</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {DFMEA_ITEMS.map((row) => (
                    <tr key={row.id} className="hover:bg-[#101F31]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#F8FAFC] whitespace-nowrap">
                        {row.component}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-amber-300">
                        {row.failureMode}
                      </td>
                      <td className="py-3.5 px-4 text-[#F8FAFC]/90">{row.effect}</td>
                      <td className="py-3.5 px-4 text-[#94A3B8]">{row.cause}</td>
                      <td className="py-3.5 px-4 text-[#2DD4BF] font-mono text-[11px]">
                        {row.detection}
                      </td>
                      <td className="py-3.5 px-4 text-[#94A3B8]">{row.mitigation}</td>
                      <td className="py-3.5 px-4 font-mono text-[#A3E635] whitespace-nowrap text-[11px]">
                        {row.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
