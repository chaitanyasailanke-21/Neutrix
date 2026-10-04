import React from 'react';
import { useNeutrix } from '../context/NeutrixContext';
import { POLLUTANTS, TREATMENT_MODULES } from '../data/neutrixData';
import { PollutantId } from '../types/neutrix';
import { Check, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';

export const ModularTrainAndMappingSection: React.FC = () => {
  const {
    selectedPollutants,
    selectedModules,
    autoSyncModules,
    togglePollutant,
    toggleModule,
    setAutoSyncModules,
    applyPresetProfile,
  } = useNeutrix();

  const activeModulesOrdered = TREATMENT_MODULES.filter((m) => selectedModules.includes(m.id));

  return (
    <section className="border-b border-slate-800/80 bg-[#07111F] py-16 lg:py-24">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 space-y-20">
        {/* ================= PART 1: INTERACTIVE "BUILD YOUR NEUTRIX" CONFIGURATOR ================= */}
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
                05. INTERACTIVE “BUILD YOUR NEUTRIX” CONFIGURATOR
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] font-display text-balance">
                Only deploy the treatment stages required by the emission profile.
              </h2>
              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                Select the pollutants present in a target exhaust stream below — or manually toggle
                the 7 modular treatment stages ON/OFF — to inspect the recommended conceptual
                treatment train and multi-species particle capture path.
              </p>
            </div>

            {/* Quick Example Profiles from Prompt */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[#94A3B8] mr-1">Example Profiles:</span>
              <button
                type="button"
                onClick={() => applyPresetProfile(['PM', 'SO2', 'HCl'])}
                className="px-3 py-1.5 text-xs font-mono bg-[#101F31] hover:bg-slate-800 text-[#2DD4BF] border border-slate-700 rounded transition-colors cursor-pointer"
              >
                SO₂ + HCl + PM (Prototype Core)
              </button>
              <button
                type="button"
                onClick={() => applyPresetProfile(['PM', 'VOCs'])}
                className="px-3 py-1.5 text-xs font-mono bg-[#101F31] hover:bg-slate-800 text-[#F8FAFC] border border-slate-700 rounded transition-colors cursor-pointer"
              >
                VOCs + PM
              </button>
              <button
                type="button"
                onClick={() => applyPresetProfile(['NOx'])}
                className="px-3 py-1.5 text-xs font-mono bg-[#101F31] hover:bg-slate-800 text-[#F8FAFC] border border-slate-700 rounded transition-colors cursor-pointer"
              >
                NOₓ Only
              </button>
              <button
                type="button"
                onClick={() =>
                  applyPresetProfile(['PM', 'SO2', 'HCl', 'HF', 'NOx', 'H2S', 'VOCs', 'Hg'])
                }
                className="px-3 py-1.5 text-xs font-mono bg-[#101F31] hover:bg-slate-800 text-[#94A3B8] hover:text-[#F8FAFC] border border-slate-800 rounded transition-colors cursor-pointer"
              >
                All 8 Pollutants
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Step A: Select Pollutants */}
            <div className="lg:col-span-5 bg-[#0B1726] border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs font-mono text-[#2DD4BF] font-semibold">
                    STEP 1 · SELECT EMISSION SPECIES
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-0.5">
                    Click species to include/exclude from gas stream
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs font-mono text-[#A3E635] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSyncModules}
                    onChange={(e) => setAutoSyncModules(e.target.checked)}
                    className="accent-[#2DD4BF] rounded"
                  />
                  <span>Auto-map train</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {POLLUTANTS.map((p) => {
                  const selected = selectedPollutants.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePollutant(p.id)}
                      className={`p-3 rounded-md border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                        selected
                          ? 'bg-[#101F31] border-[#2DD4BF]'
                          : 'bg-[#07111F] border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-base font-mono font-bold"
                          style={{ color: selected ? p.particleColor : '#94A3B8' }}
                        >
                          {p.symbol}
                        </span>
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            selected
                              ? 'bg-[#2DD4BF] border-[#2DD4BF] text-[#07111F]'
                              : 'border-slate-700'
                          }`}
                        >
                          {selected && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-[#F8FAFC] mt-1">{p.name}</div>
                      <div className="text-[10px] font-mono text-[#94A3B8] mt-1">
                        {p.prototypeIncluded ? '● Prototype scope' : '○ Architecture only'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step B: Toggle 7 Modular Treatment Stages */}
            <div className="lg:col-span-7 bg-[#0B1726] border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs font-mono text-[#A3E635] font-semibold">
                    STEP 2 · CONFIGURE MODULAR TREATMENT TRAIN (7 STAGES)
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-0.5">
                    Toggle modules manually or let pollutant composition map them automatically
                  </div>
                </div>
                <span className="text-xs font-mono text-[#F8FAFC]">
                  Active Stages: {selectedModules.length} / 7
                </span>
              </div>

              <div className="space-y-2.5">
                {TREATMENT_MODULES.map((mod) => {
                  const active = selectedModules.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => toggleModule(mod.id)}
                      className={`p-3.5 rounded-md border transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        active
                          ? 'bg-[#101F31] border-[#2DD4BF]'
                          : 'bg-[#07111F]/60 border-slate-800/80 opacity-65 hover:opacity-100'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                          <span className={active ? 'text-[#2DD4BF] font-bold' : 'text-[#94A3B8]'}>
                            {mod.stepNumber}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-[#F8FAFC] font-semibold text-sm">{mod.name}</span>
                        </div>
                        <div className="text-xs text-[#94A3B8]">{mod.mechanism}</div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                        <span
                          className={`text-[11px] font-mono ${
                            mod.demonstratedInPrototype ? 'text-[#A3E635]' : 'text-[#94A3B8]'
                          }`}
                        >
                          {mod.statusTag}
                        </span>

                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleModule(mod.id);
                          }}
                          className={`px-3 py-1 text-xs font-mono font-semibold rounded transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#2DD4BF] text-[#07111F]'
                              : 'bg-[#0B1726] text-[#94A3B8] border border-slate-700'
                          }`}
                        >
                          {active ? 'ONLINE' : 'BYPASSED'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= PART 2: RECOMMENDED CONCEPTUAL CONFIGURATION & MULTI-SPECIES FLOW VISUALIZATION ================= */}
          <div className="bg-[#101F31] border border-slate-700 rounded-lg p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="text-xs font-mono text-[#2DD4BF] font-semibold">
                  RECOMMENDED CONCEPTUAL CONFIGURATION & INTERACTIVE GAS FLOW PATH
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mt-1">
                  Active Train for Selected Profile:{' '}
                  <span className="text-[#A3E635] font-mono">
                    {selectedPollutants.length > 0
                      ? selectedPollutants
                          .map((id) => POLLUTANTS.find((p) => p.id === id)?.symbol)
                          .join(' + ')
                      : 'No Pollutants Selected'}
                  </span>
                </h3>
              </div>
              <div className="text-xs font-mono text-[#94A3B8]">
                Visual representation only — does not imply 100% capture
              </div>
            </div>

            {/* Active Train Chain */}
            {activeModulesOrdered.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3 py-2 bg-[#07111F] border border-slate-700 rounded text-xs font-mono text-[#94A3B8]">
                  RAW EXHAUST IN
                </div>
                <ArrowRight className="w-4 h-4 text-[#2DD4BF]" />
                {activeModulesOrdered.map((mod, idx) => (
                  <React.Fragment key={mod.id}>
                    <div
                      className={`px-3.5 py-2 rounded border text-xs font-mono ${
                        mod.demonstratedInPrototype
                          ? 'bg-[#0B1726] border-[#2DD4BF] text-[#F8FAFC]'
                          : 'bg-[#0B1726] border-slate-700 text-[#94A3B8]'
                      }`}
                    >
                      <div className="font-semibold">{mod.shortName.toUpperCase()}</div>
                      <div className="text-[10px] text-[#A3E635]">
                        {mod.demonstratedInPrototype ? 'Prototype Stage' : 'Architecture Only'}
                      </div>
                    </div>
                    {idx < activeModulesOrdered.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-[#2DD4BF]" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[#07111F] border border-slate-800 rounded text-xs font-mono text-amber-400">
                No treatment stages currently selected. Select at least one pollutant or toggle a module ON.
              </div>
            )}

            {/* Interactive SVG Multi-Species Particle Flow Visualization */}
            <div className="bg-[#07111F] border border-slate-800 rounded-md p-4 overflow-x-auto">
              <svg
                viewBox="0 0 920 155"
                className="w-full min-w-[680px] h-auto"
                role="img"
                aria-label="Multi-species gas particle flow visualization across the active modular treatment stages."
              >
                {/* Flow Duct Background */}
                <rect x="20" y="42" width="880" height="68" rx="6" fill="#0B1726" stroke="#1E293B" strokeWidth="1.5" />

                {/* Stage Zones along the duct */}
                {[
                  { id: 'particulate' as const, x: 150, label: 'PARTICULATE MODULE', captures: 'PM' },
                  { id: 'alkaline_scrubber' as const, x: 350, label: 'ALKALINE SCRUBBER', captures: 'Acid Gases' },
                  { id: 'mist_elimination' as const, x: 520, label: 'MIST ELIMINATOR', captures: 'Droplets' },
                  { id: 'selective_nox' as const, x: 670, label: 'SELECTIVE / POLISHING', captures: 'NOₓ / VOC / Hg' },
                  { id: 'outlet_verification' as const, x: 820, label: 'OUTLET VERIFY', captures: 'Sensor Trim' },
                ].map((zone) => {
                  const isActive =
                    selectedModules.includes(zone.id) ||
                    (zone.id === 'selective_nox' &&
                      (selectedModules.includes('selective_nox') ||
                        selectedModules.includes('polishing_adsorption')));
                  return (
                    <g key={zone.label}>
                      <rect
                        x={zone.x - 58}
                        y="32"
                        width="116"
                        height="88"
                        rx="5"
                        fill={isActive ? '#101F31' : '#07111F'}
                        stroke={isActive ? '#2DD4BF' : '#334155'}
                        strokeWidth={isActive ? '1.8' : '1'}
                        strokeDasharray={isActive ? 'none' : '3 3'}
                      />
                      <text
                        x={zone.x}
                        y="24"
                        textAnchor="middle"
                        fill={isActive ? '#F8FAFC' : '#64748B'}
                        fontSize="8.5"
                        fontFamily="IBM Plex Mono"
                        fontWeight="600"
                      >
                        {zone.label}
                      </text>
                      <text
                        x={zone.x}
                        y="134"
                        textAnchor="middle"
                        fill={isActive ? '#2DD4BF' : '#475569'}
                        fontSize="8"
                        fontFamily="IBM Plex Mono"
                      >
                        {isActive ? `ACTIVE (${zone.captures})` : 'BYPASSED'}
                      </text>
                    </g>
                  );
                })}

                {/* Animated Particles by Species */}
                {/* 1. PM Particles (Gray) -> captured at x=150 if particulate active */}
                {selectedPollutants.includes('PM') && (
                  <g>
                    {[55, 75, 95].map((yPos, i) => {
                      const endX = selectedModules.includes('particulate') ? 150 : 890;
                      return (
                        <circle key={`pm-${i}`} cx="30" cy={yPos} r="3.5" fill="#94A3B8">
                          <animate
                            attributeName="cx"
                            values={`30;${endX}`}
                            dur={`${2.2 + i * 0.4}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      );
                    })}
                  </g>
                )}

                {/* 2. Acid Gas Particles (Teal/Cyan) -> absorbed at x=350 if scrubber active */}
                {(selectedPollutants.includes('SO2') ||
                  selectedPollutants.includes('HCl') ||
                  selectedPollutants.includes('HF') ||
                  selectedPollutants.includes('H2S')) && (
                  <g>
                    {[52, 68, 84, 98].map((yPos, i) => {
                      const capturedInScrubber = selectedModules.includes('alkaline_scrubber') && i < 3; // Leave 1 residual particle to show non-100% capture
                      const endX = capturedInScrubber ? 355 : 890;
                      return (
                        <circle key={`acid-${i}`} cx="30" cy={yPos} r="3.2" fill="#2DD4BF">
                          <animate
                            attributeName="cx"
                            values={`30;${endX}`}
                            dur={`${2.8 + i * 0.35}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      );
                    })}
                  </g>
                )}

                {/* 3. NOx / VOC / Hg Particles (Amber / Purple) -> pass to future modules at x=670 */}
                {(selectedPollutants.includes('NOx') ||
                  selectedPollutants.includes('VOCs') ||
                  selectedPollutants.includes('Hg')) && (
                  <g>
                    {[60, 78, 92].map((yPos, i) => {
                      const hasFutureStage =
                        selectedModules.includes('selective_nox') ||
                        selectedModules.includes('polishing_adsorption');
                      const endX = hasFutureStage && i < 2 ? 670 : 890;
                      return (
                        <circle key={`adv-${i}`} cx="30" cy={yPos} r="3.2" fill="#F59E0B">
                          <animate
                            attributeName="cx"
                            values={`30;${endX}`}
                            dur={`${3.1 + i * 0.3}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      );
                    })}
                  </g>
                )}
              </svg>

              {/* Particle Legend & Required Disclaimer */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-[#94A3B8]">● PM (Particulate Module)</span>
                  <span className="text-[#2DD4BF]">● Acid Gases (Alkaline Scrubber)</span>
                  <span className="text-amber-400">● NOₓ / VOCs / Hg (Architecture Stages)</span>
                </div>
                <span className="text-[#94A3B8]">
                  This configurator is an educational architecture tool. Final treatment selection
                  requires detailed process engineering and gas characterization.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PART 3: POLLUTANT -> TREATMENT MAPPING MATRIX ================= */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
              06. POLLUTANT → TREATMENT MAPPING MATRIX
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] font-display">
              Multi-Pollutant Capture Mechanisms & Prototype Scope
            </h2>
          </div>

          <div className="bg-[#0B1726] border border-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#101F31] border-b border-slate-800 text-xs font-mono text-[#94A3B8]">
                    <th className="py-3.5 px-4">Pollutant</th>
                    <th className="py-3.5 px-4">Primary Treatment Mechanism</th>
                    <th className="py-3.5 px-4">NEUTRIX Module</th>
                    <th className="py-3.5 px-4">Prototype Status</th>
                    <th className="py-3.5 px-4">Engineering Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                  {POLLUTANTS.map((row) => (
                    <tr key={row.id} className="hover:bg-[#101F31]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#F8FAFC] whitespace-nowrap">
                        <span style={{ color: row.particleColor }}>{row.symbol}</span>
                        <span className="text-xs font-normal text-[#94A3B8] ml-2">
                          ({row.name})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#F8FAFC]">{row.treatmentMechanism}</td>
                      <td className="py-3.5 px-4 font-mono text-[#2DD4BF] whitespace-nowrap">
                        {row.neutrixModuleName}
                      </td>
                      <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                        <span
                          className={
                            row.prototypeIncluded ? 'text-[#A3E635]' : 'text-[#94A3B8]'
                          }
                        >
                          {row.prototypeStatusLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#94A3B8] max-w-md">
                        {row.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 bg-[#101F31] border-t border-slate-800 text-xs font-mono text-[#94A3B8]">
              Disclaimer: Treatment selection depends on pollutant concentration, gas conditions,
              chemistry and application-specific engineering validation.
            </div>
          </div>
        </div>

        {/* ================= PART 4: SCR TEMPERATURE & SEQUENCE TECHNICAL CALLOUT ================= */}
        <div className="bg-[#0B1726] border border-slate-800 rounded-lg p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-mono text-amber-400 font-semibold">
                  THERMAL PROCESS INTEGRATION · SCR TEMPERATURE CONSIDERATIONS
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC]">
                  Why Module Sequence Is an Application-Dependent Engineering Decision
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono text-[#2DD4BF] shrink-0">
              Application-dependent engineering decision
            </span>
          </div>

          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Conventional SCR catalysts require suitable temperature and gas conditions (typically
            200–400 °C). A wet scrubber cools and humidifies the exhaust stream, so placing a wet
            scrubber upstream of an SCR stage without thermal reheat would deactivate or cool the
            catalyst below its operating window. Therefore, treatment stage order in a full-scale
            NEUTRIX system is governed by upstream gas temperature and catalyst poison profiles:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Configuration A */}
            <div className="p-4 bg-[#101F31] border border-slate-800 rounded-md space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#2DD4BF] font-semibold">
                  CONCEPTUAL SEQUENCE A · HOT-SIDE SELECTIVE STAGE
                </span>
                <span className="text-[#94A3B8]">No Reheat Required</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[#F8FAFC]">
                <span className="px-2 py-1 bg-[#07111F] rounded border border-slate-700">
                  HOT GAS
                </span>
                <span>→</span>
                <span className="px-2 py-1 bg-[#07111F] rounded border border-amber-400/50 text-amber-300">
                  SCR
                </span>
                <span>→</span>
                <span className="px-2 py-1 bg-[#07111F] rounded border border-[#2DD4BF]/50 text-[#2DD4BF]">
                  WET SCRUBBER
                </span>
                <span>→</span>
                <span className="px-2 py-1 bg-[#07111F] rounded border border-slate-700">
                  MIST ELIMINATION
                </span>
                <span>→</span>
                <span className="px-2 py-1 bg-[#07111F] rounded border border-slate-700">
                  OUTLET
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Utilizes existing exhaust heat for selective reduction before the gas is cooled and
                saturated in the alkaline wet scrubber.
              </p>
            </div>

            {/* Configuration B */}
            <div className="p-4 bg-[#101F31] border border-slate-800 rounded-md space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#A3E635] font-semibold">
                  CONCEPTUAL SEQUENCE B · TAIL-END SELECTIVE STAGE
                </span>
                <span className="text-[#94A3B8]">Requires Gas Reheating</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[#F8FAFC]">
                <span className="px-2 py-1 bg-[#07111F] rounded border border-slate-700">
                  HOT GAS
                </span>
                <span>→</span>
                <span className="px-2 py-1 bg-[#07111F] rounded border border-slate-700">
                  CONDITIONING
                </span>
                <span>→</span>
                <span className="px-2 py-1 bg-[#07111F] rounded border border-[#2DD4BF]/50 text-[#2DD4BF]">
                  OTHER REQUIRED STAGE
                </span>
                <span>→</span>
                <span className="px-2 py-1 bg-[#07111F] rounded border border-amber-400/50 text-amber-300">
                  REHEATING IF REQUIRED
                </span>
                <span>→</span>
                <span className="px-2 py-1 bg-[#07111F] rounded border border-[#A3E635]/50 text-[#A3E635]">
                  SELECTIVE TREATMENT
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Used when heavy particulates or catalyst-poisoning acid gases must be scrubbed first,
                requiring a heat exchanger / burner before tail-end selective treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
