import React, { useState } from 'react';
import { ROADMAP_STAGES } from '../data/neutrixData';
import industrialFutureImg from '../assets/images/industrial_future_concept_1791129560822.jpg';
import { Calendar, ArrowRight, Building2, CheckSquare, UserCheck } from 'lucide-react';

const PILOT_PREREQUISITES = [
  'Application-specific gas characterization',
  'Process engineering & mass-balance scaling',
  'Materials & corrosion compatibility',
  'Detailed mass transfer & packing design',
  'Pressure-drop & blower power analysis',
  'Thermal integration & heat recovery',
  'Secondary effluent & solid waste treatment',
  'Regulatory & permitting evaluation',
  'Pilot-scale field validation',
];

export const RoadmapFutureAndFooterSection: React.FC = () => {
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);
  const [imgError, setImgError] = useState<boolean>(false);

  const activeStage = ROADMAP_STAGES[selectedStageIdx];

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ================= SECTION 27: ENGINEERING ROADMAP ================= */}
      <section
        id="roadmap"
        className="border-b border-slate-800/80 bg-[#07111F] py-16 lg:py-24"
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 space-y-12">
          <div className="space-y-3 max-w-3xl">
            <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
              20. DEVELOPMENT ROADMAP (OCT 2026 – JAN 2027)
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] font-display text-balance">
              5-Stage Engineering Execution Timeline
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8]">
              Structured progression from problem charter and stoichiometric sizing through detailed
              P&ID/DFMEA engineering, physical bench assembly, and controlled surrogate validation.
            </p>
          </div>

          {/* Horizontal Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {ROADMAP_STAGES.map((item, idx) => {
              const isSelected = idx === selectedStageIdx;
              return (
                <button
                  key={item.stage}
                  type="button"
                  onClick={() => setSelectedStageIdx(idx)}
                  className={`text-left p-5 rounded-lg border transition-colors cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#101F31] border-[#2DD4BF]'
                      : 'bg-[#0B1726] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={isSelected ? 'text-[#2DD4BF] font-bold' : 'text-[#94A3B8]'}>
                        {item.stage} — {item.code}
                      </span>
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    </div>

                    <div className="text-xs font-mono text-[#A3E635]">{item.targetDate}</div>
                    <h3 className="text-sm font-bold text-[#F8FAFC]">{item.title}</h3>

                    <ul className="space-y-1 pt-2 border-t border-slate-800/80 text-xs text-[#94A3B8]">
                      {item.deliverables.map((del) => (
                        <li key={del} className="flex items-start gap-1.5">
                          <span className="text-[#2DD4BF]">·</span>
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-[#94A3B8]">
                    Status: <span className="text-[#F8FAFC]">{item.status}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Roadmap Stage Detail Bar */}
          <div className="p-5 bg-[#101F31] border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#2DD4BF]">
                ACTIVE MILESTONE FOCUS · {activeStage.stage} ({activeStage.code}) — TARGET:{' '}
                {activeStage.targetDate}
              </div>
              <p className="text-sm text-[#F8FAFC]">{activeStage.engineeringFocus}</p>
            </div>
            <div className="text-xs font-mono text-[#A3E635] shrink-0">
              Deliverables: {activeStage.deliverables.join(' / ')}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 30: INDUSTRIAL FUTURE VISION ================= */}
      <section
        id="future"
        className="border-b border-slate-800/80 bg-[#0B1726] py-16 lg:py-24"
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
                21. LONG-TERM ARCHITECTURAL SCALABILITY
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] font-display text-balance">
                Industrial Future Vision & Pilot Engineering Prerequisites
              </h2>
              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                The bench prototype validates modular architecture and closed-loop control
                principles at laboratory scale. It does not imply direct one-to-one geometric
                scale-up to a commercial plant without dedicated pilot process engineering.
              </p>
            </div>

            <div className="px-4 py-2 bg-[#101F31] border border-amber-400/40 rounded text-xs font-mono text-amber-300 self-start">
              Future Industrial Concept — Not a Current Deployment
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 Cols: Concept Visualization with Mandatory Label */}
            <div className="lg:col-span-7 bg-[#07111F] border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-[#101F31] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[#F8FAFC] font-semibold">
                  MODULAR SKID & PACKED TOWER — CONCEPTUAL FACILITY ARCHITECTURE
                </span>
                <span className="text-amber-400 font-bold">
                  Future Industrial Concept — Not a Current Deployment
                </span>
              </div>

              <div className="relative">
                {!imgError ? (
                  <img
                    src={industrialFutureImg}
                    alt="Future Industrial Concept — Not a Current Deployment: Conceptual mid-sized modular industrial emission treatment facility showing modular treatment containers, packed-bed scrubber tower, reagent skid, sensors, control system, and stack."
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-auto max-h-[440px] object-cover"
                  />
                ) : (
                  <div className="h-80 flex flex-col items-center justify-center p-6 text-center space-y-2 bg-[#07111F]">
                    <Building2 className="w-8 h-8 text-[#2DD4BF]" />
                    <div className="text-sm font-semibold text-[#F8FAFC]">
                      Future Industrial Concept — Not a Current Deployment
                    </div>
                    <p className="text-xs text-[#94A3B8] max-w-md">
                      Conceptual mid-sized facility layout featuring modular treatment skids,
                      packed-bed absorption tower, reagent dosing skid, and CEMS stack monitoring.
                    </p>
                  </div>
                )}

                {/* Contrast Scrim & Architectural Callouts */}
                <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 space-y-2">
                  <div className="text-xs font-mono text-amber-300 font-semibold">
                    LABEL: Future Industrial Concept — Not a Current Deployment
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-[#F8FAFC]/90">
                    <span>· Modular Treatment Containers</span>
                    <span>· Packed-Bed Scrubber Tower</span>
                    <span>· Automated Reagent Skid</span>
                    <span>· CEMS Sensor Telemetry</span>
                    <span>· Closed-Loop PLC Control</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: 9 Pilot Engineering Prerequisites */}
            <div className="lg:col-span-5 bg-[#101F31] border border-slate-800 rounded-lg p-6 space-y-5">
              <div className="space-y-1 border-b border-slate-800 pb-3">
                <div className="text-xs font-mono text-[#2DD4BF] font-semibold">
                  ENGINEERING BOUNDARY FOR SCALE-UP
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC] font-display">
                  What Future Pilot Validation Would Require
                </h3>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Transitioning from the NEUTRIX bench demonstrator to a pilot or industrial
                installation requires rigorous, site-specific chemical and mechanical engineering
                across nine domains:
              </p>

              <ul className="space-y-2 text-xs">
                {PILOT_PREREQUISITES.map((req, i) => (
                  <li
                    key={req}
                    className="p-2.5 bg-[#07111F] border border-slate-800 rounded flex items-center gap-2.5 text-[#F8FAFC]"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0" />
                    <span className="font-mono text-[#94A3B8] text-[11px]">0{i + 1}</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 15 & 16: TEAM, PROJECT METADATA & CLOSED-LOOP SUMMARY ================= */}
      <section className="border-b border-slate-800/80 bg-[#07111F] py-16 lg:py-20">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 space-y-14">
          {/* Closed-Loop Core Story Banner (Section 54 & 55) */}
          <div className="bg-[#101F31] border border-slate-700 rounded-lg p-6 sm:p-8 space-y-6">
            <div className="space-y-2 max-w-3xl">
              <div className="text-xs font-mono text-[#A3E635] font-semibold">
                CENTRAL ENGINEERING SYNTHESIS
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] font-display">
                The Complete NEUTRIX Closed Engineering Loop
              </h2>
              <p className="text-sm text-[#94A3B8]">
                Connecting emission composition characterization, modular stage configuration,
                mass-flow stoichiometric feedforward dosing, and real-time sensor feedback before
                atmospheric release.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center font-mono text-xs">
              {[
                { step: '01', name: 'CHARACTERIZE', sub: 'Emission Profile' },
                { step: '02', name: 'CONFIGURE', sub: 'Select Modules' },
                { step: '03', name: 'CALCULATE', sub: 'ṁ & Stoichiometry' },
                { step: '04', name: 'TREAT', sub: 'Scrub & Filter' },
                { step: '05', name: 'MEASURE', sub: 'pH & Outlet C_out' },
                { step: '06', name: 'ADAPT', sub: 'Feedback Trim' },
                { step: '07', name: 'VERIFY', sub: 'Before Release' },
              ].map((s) => (
                <div
                  key={s.step}
                  className="p-3 bg-[#07111F] border border-slate-800 rounded-md space-y-1"
                >
                  <div className="text-[10px] text-[#2DD4BF]">{s.step}</div>
                  <div className="font-bold text-[#F8FAFC]">{s.name}</div>
                  <div className="text-[10px] text-[#94A3B8]">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Team & Competition Identification Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 bg-[#0B1726] border border-slate-800 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
                <UserCheck className="w-4 h-4" />
                <span>22. PROJECT TEAM & COMPETITION DOSSIER</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#101F31] border border-slate-800 rounded-md">
                  <div className="text-[11px] font-mono text-[#94A3B8]">PROJECT LEAD / TEAM</div>
                  <div className="text-base font-bold text-[#F8FAFC] mt-1">
                    Chaitanya Sai Lanke
                  </div>
                  <div className="text-xs text-[#2DD4BF] font-mono mt-0.5">
                    System Architecture, Control & Prototype Engineering
                  </div>
                </div>

                <div className="p-4 bg-[#101F31] border border-slate-800 rounded-md">
                  <div className="text-[11px] font-mono text-[#94A3B8]">FACULTY MENTOR</div>
                  <div className="text-base font-mono font-semibold text-[#F8FAFC] mt-1">
                    [To be filled]
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-0.5">
                    Laboratory Supervision & Academic Review
                  </div>
                </div>

                <div className="p-4 bg-[#101F31] border border-slate-800 rounded-md">
                  <div className="text-[11px] font-mono text-[#94A3B8]">TARGET CONTEST</div>
                  <div className="text-sm font-mono font-semibold text-[#F8FAFC] mt-1">
                    [To be filled]
                  </div>
                </div>

                <div className="p-4 bg-[#101F31] border border-slate-800 rounded-md">
                  <div className="text-[11px] font-mono text-[#94A3B8]">PROBLEM STATEMENT ID</div>
                  <div className="text-sm font-mono font-semibold text-[#F8FAFC] mt-1">
                    [To be filled]
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Quick-Jump Summary Card */}
            <div className="lg:col-span-5 bg-[#0B1726] border border-slate-800 rounded-lg p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-mono text-[#A3E635]">
                  DEVELOPMENT STAGE · BENCH-SCALE PROTOTYPE
                </div>
                <h3 className="text-xl font-bold text-[#F8FAFC] font-display">
                  Explore Interactive Engineering Modules
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Navigate directly to any interactive calculator, schematic, or validation register
                  in this demonstrator:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => scrollToSection('#architecture')}
                  className="p-2.5 text-xs font-mono text-left bg-[#101F31] hover:bg-slate-800 text-[#F8FAFC] border border-slate-700 rounded flex items-center justify-between cursor-pointer"
                >
                  <span>P&ID & Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2DD4BF]" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('#simulator')}
                  className="p-2.5 text-xs font-mono text-left bg-[#101F31] hover:bg-slate-800 text-[#F8FAFC] border border-slate-700 rounded flex items-center justify-between cursor-pointer"
                >
                  <span>Dosing Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2DD4BF]" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('#prototype')}
                  className="p-2.5 text-xs font-mono text-left bg-[#101F31] hover:bg-slate-800 text-[#F8FAFC] border border-slate-700 rounded flex items-center justify-between cursor-pointer"
                >
                  <span>19-Pt Bench Model</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2DD4BF]" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('#validation')}
                  className="p-2.5 text-xs font-mono text-left bg-[#101F31] hover:bg-slate-800 text-[#F8FAFC] border border-slate-700 rounded flex items-center justify-between cursor-pointer"
                >
                  <span>Validation & CSV Log</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2DD4BF]" />
                </button>
              </div>
            </div>
          </div>

          {/* Section 51: Mandatory Engineering Disclaimer */}
          <div className="p-4 bg-[#0B1726] border border-slate-800 rounded-md text-xs text-[#94A3B8] leading-relaxed font-mono">
            <span className="text-[#F8FAFC] font-semibold">ENGINEERING DISCLAIMER: </span>
            “NEUTRIX is a bench-scale engineering prototype/concept. Performance values shown in
            simulations are illustrative unless explicitly identified as measured experimental data.
            Final treatment configuration, safety requirements, waste handling and regulatory
            compliance require application-specific engineering validation.”
          </div>
        </div>
      </section>

      {/* ================= SECTION 52: FOOTER ================= */}
      <footer className="bg-[#07111F] py-12 border-t border-slate-900">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-1.5">
            <div className="text-lg font-bold text-[#F8FAFC] font-display tracking-wider">
              NEUTRIX
            </div>
            <div className="text-xs text-[#94A3B8]">
              Modular Industrial Emission Treatment System ·{' '}
              <span className="text-[#2DD4BF] font-mono">Capture. Convert. Protect.</span>
            </div>
            <div className="text-xs font-mono text-[#94A3B8] pt-1">
              Project: Chaitanya Sai Lanke · Faculty Mentor: [To be filled] · Contest: [To be filled]
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-[#94A3B8]">
            <a
              href="#architecture"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#architecture');
              }}
              className="hover:text-[#F8FAFC] transition-colors"
            >
              Architecture
            </a>
            <a
              href="#simulator"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#simulator');
              }}
              className="hover:text-[#F8FAFC] transition-colors"
            >
              Simulator
            </a>
            <a
              href="#validation"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#validation');
              }}
              className="hover:text-[#F8FAFC] transition-colors"
            >
              Validation
            </a>
            <a
              href="#safety"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#safety');
              }}
              className="hover:text-[#F8FAFC] transition-colors"
            >
              Safety
            </a>
            <a
              href="#roadmap"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#roadmap');
              }}
              className="hover:text-[#F8FAFC] transition-colors"
            >
              Roadmap
            </a>
          </div>

          <div className="text-xs font-mono text-[#A3E635]">
            Prototype stage — validation in progress
          </div>
        </div>
      </footer>
    </>
  );
};
