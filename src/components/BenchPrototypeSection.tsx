import React, { useState } from 'react';
import { BENCH_COMPONENTS } from '../data/neutrixData';
import { BenchComponentSpec } from '../types/neutrix';
import benchConceptImg from '../assets/images/bench_prototype_concept_1791129578468.jpg';
import { Eye, Cpu, Layers, CheckCircle2, Circle } from 'lucide-react';

const SUBSYSTEM_CATEGORIES = [
  'ALL',
  'GAS PATH',
  'LIQUID LOOP',
  'DOSING',
  'SENSORS',
  'CONTROL',
  'SAFETY',
  'DATA',
] as const;

export const BenchPrototypeSection: React.FC = () => {
  const [selectedCompId, setSelectedCompId] = useState<string>('scrubber_column');
  const [subsystemFilter, setSubsystemFilter] =
    useState<(typeof SUBSYSTEM_CATEGORIES)[number]>('ALL');
  const [visualMode, setVisualMode] = useState<'schematic' | 'concept_render'>('schematic');
  const [imgError, setImgError] = useState<boolean>(false);

  const selectedComp: BenchComponentSpec =
    BENCH_COMPONENTS.find((c) => c.id === selectedCompId) || BENCH_COMPONENTS[4];

  const filteredComponents = BENCH_COMPONENTS.filter(
    (c) => subsystemFilter === 'ALL' || c.subsystem === subsystemFilter
  );

  return (
    <section
      id="prototype"
      className="border-b border-slate-800/80 bg-[#0B1726] py-16 lg:py-24"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 space-y-16">
        {/* Header & Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
              11. BENCH-SCALE PROTOTYPE ARCHITECTURE (19-POINT HARDWARE ASSEMBLY)
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] font-display text-balance">
              Transparent Packed-Bed Scrubber & Closed-Loop Dosing Bench
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              The vertical transparent acrylic packed-bed scrubber column is the visual and
              mass-transfer centerpiece of the proposed NEUTRIX bench prototype. Click any numbered
              callout (1–19) on the schematic or component cards below to inspect its plumbing and
              signal path.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#07111F] border border-slate-800 rounded-md self-start">
            <button
              type="button"
              onClick={() => setVisualMode('schematic')}
              className={`px-3.5 py-2 text-xs font-mono rounded transition-colors flex items-center gap-2 cursor-pointer ${
                visualMode === 'schematic'
                  ? 'bg-[#2DD4BF] text-[#07111F] font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive 19-Point Bench Diagram</span>
            </button>
            <button
              type="button"
              onClick={() => setVisualMode('concept_render')}
              className={`px-3.5 py-2 text-xs font-mono rounded transition-colors flex items-center gap-2 cursor-pointer ${
                visualMode === 'concept_render'
                  ? 'bg-[#A3E635] text-[#07111F] font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Concept Render View</span>
            </button>
          </div>
        </div>

        {/* ================= MAIN BENCH PROTOTYPE VIEWPORT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 8 Columns: Interactive 19-Point Bench Schematic OR Concept Render */}
          <div className="lg:col-span-8 bg-[#07111F] border border-slate-800 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-[#101F31] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-[#F8FAFC] font-semibold">
                {visualMode === 'schematic'
                  ? 'BENCH PROTOTYPE MECHANICAL & PLUMBING LAYOUT (CALLOUTS 01–19)'
                  : 'CONCEPT RENDER — BENCH-SCALE ENGINEERING PROTOTYPE'}
              </span>
              <span className="text-[#A3E635]">
                {visualMode === 'schematic' ? 'Prototype Stage · Continuous Tubing' : 'Concept Render'}
              </span>
            </div>

            {visualMode === 'schematic' ? (
              <div className="p-4 sm:p-6">
                <svg
                  viewBox="0 0 920 520"
                  className="w-full h-auto select-none"
                  role="img"
                  aria-label="Detailed 19-component technical diagram of the NEUTRIX bench prototype featuring the vertical transparent acrylic packed-bed scrubber column, white plastic packing rings, top spray distributor, mist eliminator, clear sump, circulation pump, reagent tank on load cell, peristaltic dosing pump, particulate chamber, and ESP32-class controller."
                >
                  <defs>
                    <linearGradient id="benchColGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1E293B" stopOpacity="0.7" />
                      <stop offset="30%" stopColor="#38BDF8" stopOpacity="0.15" />
                      <stop offset="70%" stopColor="#2DD4BF" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#1E293B" stopOpacity="0.7" />
                    </linearGradient>
                    <marker
                      id="benchGasArr"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#2DD4BF" />
                    </marker>
                    <marker
                      id="benchLiqArr"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#38BDF8" />
                    </marker>
                    <marker
                      id="benchDoseArr"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#A3E635" />
                    </marker>
                  </defs>

                  {/* Laboratory Secondary Containment Drip Tray */}
                  <rect
                    x="24"
                    y="465"
                    width="872"
                    height="22"
                    rx="4"
                    fill="#101F31"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                  <text x="40" y="479" fill="#94A3B8" fontSize="9.5" fontFamily="IBM Plex Mono">
                    SECONDARY CONTAINMENT DRIP TRAY · SAFE LABORATORY BENCH ENVIRONMENT
                  </text>

                  {/* 1. Gas Inlet & Small Bench Blower */}
                  <g onClick={() => setSelectedCompId('gas_inlet')} className="cursor-pointer">
                    <rect
                      x="38"
                      y="310"
                      width="74"
                      height="64"
                      rx="6"
                      fill="#101F31"
                      stroke="#2DD4BF"
                      strokeWidth="1.6"
                    />
                    <circle cx="75" cy="342" r="18" fill="#07111F" stroke="#2DD4BF" strokeWidth="1.4" />
                    <text x="75" y="302" textAnchor="middle" fill="#F8FAFC" fontSize="9.5" fontFamily="IBM Plex Mono">
                      [01] BLOWER/INLET
                    </text>
                  </g>

                  {/* Continuous Tube: Inlet (1) -> Flow Meter (2) */}
                  <line x1="112" y1="342" x2="142" y2="342" stroke="#334155" strokeWidth="10" />
                  <line
                    x1="112"
                    y1="342"
                    x2="142"
                    y2="342"
                    stroke="#2DD4BF"
                    strokeWidth="2"
                    className="animate-flow-fast"
                  />

                  {/* 2. Flow Measurement */}
                  <g onClick={() => setSelectedCompId('flow_measurement')} className="cursor-pointer">
                    <rect
                      x="142"
                      y="318"
                      width="56"
                      height="48"
                      rx="4"
                      fill="#101F31"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                    />
                    <text x="170" y="345" textAnchor="middle" fill="#38BDF8" fontSize="9" fontFamily="IBM Plex Mono">
                      FLOW
                    </text>
                    <text x="170" y="310" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="IBM Plex Mono">
                      [02] FIT
                    </text>
                  </g>

                  {/* Continuous Tube: Flow Meter (2) -> Particulate Chamber (3) */}
                  <line x1="198" y1="342" x2="228" y2="342" stroke="#334155" strokeWidth="10" />
                  <line
                    x1="198"
                    y1="342"
                    x2="228"
                    y2="342"
                    stroke="#2DD4BF"
                    strokeWidth="2"
                    className="animate-flow-fast"
                  />

                  {/* 3. Transparent Particulate Chamber & 4. Particle Sensors */}
                  <g onClick={() => setSelectedCompId('particulate_chamber')} className="cursor-pointer">
                    <rect
                      x="228"
                      y="272"
                      width="92"
                      height="136"
                      rx="6"
                      fill="url(#benchColGrad)"
                      stroke="#94A3B8"
                      strokeWidth="1.6"
                    />
                    {/* Internal filter element */}
                    <rect
                      x="264"
                      y="282"
                      width="20"
                      height="116"
                      fill="#0F172A"
                      stroke="#94A3B8"
                      strokeDasharray="4 2"
                    />
                    <text x="274" y="424" textAnchor="middle" fill="#F8FAFC" fontSize="9" fontFamily="IBM Plex Mono">
                      [03] PARTICULATE CHAMBER
                    </text>
                  </g>

                  {/* 4. Particle Sensors */}
                  <g onClick={() => setSelectedCompId('particle_sensors')} className="cursor-pointer">
                    <rect
                      x="240"
                      y="246"
                      width="68"
                      height="22"
                      rx="3"
                      fill="#101F31"
                      stroke="#A3E635"
                      strokeWidth="1.4"
                    />
                    <text x="274" y="260" textAnchor="middle" fill="#A3E635" fontSize="8.5" fontFamily="IBM Plex Mono">
                      [04] PM SENSORS
                    </text>
                  </g>

                  {/* Continuous Tube: Particulate Chamber (3) -> Scrubber Lower Gas Inlet (5) */}
                  <line x1="320" y1="342" x2="386" y2="342" stroke="#334155" strokeWidth="12" />
                  <line
                    x1="320"
                    y1="342"
                    x2="386"
                    y2="342"
                    stroke="#2DD4BF"
                    strokeWidth="2.5"
                    markerEnd="url(#benchGasArr)"
                    className="animate-flow-fast"
                  />

                  {/* ================= HERO VESSEL: 5. TRANSPARENT PACKED-BED SCRUBBER ================= */}
                  <g onClick={() => setSelectedCompId('scrubber_column')} className="cursor-pointer">
                    <rect
                      x="386"
                      y="58"
                      width="136"
                      height="395"
                      rx="8"
                      fill="url(#benchColGrad)"
                      stroke="#2DD4BF"
                      strokeWidth="2.4"
                    />
                    {/* Acrylic Section Flanges */}
                    <line x1="378" y1="118" x2="530" y2="118" stroke="#64748B" strokeWidth="3" />
                    <line x1="378" y1="318" x2="530" y2="318" stroke="#64748B" strokeWidth="3" />
                    <line x1="378" y1="368" x2="530" y2="368" stroke="#64748B" strokeWidth="3" />
                    <text
                      x="454"
                      y="42"
                      textAnchor="middle"
                      fill="#2DD4BF"
                      fontSize="10.5"
                      fontFamily="IBM Plex Mono"
                      fontWeight="600"
                    >
                      [05] TRANSPARENT PACKED-BED SCRUBBER
                    </text>
                  </g>

                  {/* 8. Mist Eliminator (Above Spray Region) */}
                  <g onClick={() => setSelectedCompId('mist_eliminator')} className="cursor-pointer">
                    <rect
                      x="394"
                      y="76"
                      width="120"
                      height="28"
                      rx="3"
                      fill="#0F172A"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 400 90 L 415 82 L 430 96 L 445 82 L 460 96 L 475 82 L 490 96 L 508 86"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="1.5"
                    />
                    <text x="454" y="70" textAnchor="middle" fill="#38BDF8" fontSize="8.5" fontFamily="IBM Plex Mono">
                      [08] MIST ELIMINATOR
                    </text>
                  </g>

                  {/* 7. Top Spray Distributor */}
                  <g onClick={() => setSelectedCompId('spray_distributor')} className="cursor-pointer">
                    <line x1="406" y1="138" x2="504" y2="138" stroke="#38BDF8" strokeWidth="4" />
                    {[418, 442, 466, 490].map((nx) => (
                      <g key={nx}>
                        <line
                          x1={nx}
                          y1="138"
                          x2={nx - 7}
                          y2="162"
                          stroke="#38BDF8"
                          strokeWidth="1.4"
                          strokeDasharray="2 2"
                          className="animate-flow-fast"
                        />
                        <line
                          x1={nx}
                          y1="138"
                          x2={nx + 7}
                          y2="162"
                          stroke="#38BDF8"
                          strokeWidth="1.4"
                          strokeDasharray="2 2"
                          className="animate-flow-fast"
                        />
                      </g>
                    ))}
                    <text x="454" y="131" textAnchor="middle" fill="#38BDF8" fontSize="8.5" fontFamily="IBM Plex Mono">
                      [07] SPRAY DISTRIBUTOR
                    </text>
                  </g>

                  {/* 6. Packing Material (White Plastic Rings) */}
                  <g onClick={() => setSelectedCompId('packing_material')} className="cursor-pointer">
                    <rect
                      x="394"
                      y="165"
                      width="120"
                      height="145"
                      rx="4"
                      fill="#07111F"
                      fillOpacity="0.45"
                      stroke="#64748B"
                      strokeDasharray="4 2"
                    />
                    {[180, 200, 220, 240, 260, 280, 298].map((ry, rIdx) =>
                      [408, 426, 444, 462, 480, 498].map((cx, cIdx) => (
                        <circle
                          key={`${rIdx}-${cIdx}`}
                          cx={cx + (rIdx % 2 === 0 ? 0 : 4)}
                          cy={ry}
                          r="7"
                          fill="none"
                          stroke="#F8FAFC"
                          strokeOpacity="0.7"
                          strokeWidth="2"
                        />
                      ))
                    )}
                    <rect x="404" y="226" width="100" height="20" rx="3" fill="#07111F" fillOpacity="0.88" />
                    <text x="454" y="239" textAnchor="middle" fill="#F8FAFC" fontSize="8.5" fontFamily="IBM Plex Mono">
                      [06] WHITE PACKING RINGS
                    </text>
                  </g>

                  {/* 9. Clear Sump at Column Base */}
                  <g onClick={() => setSelectedCompId('clear_sump')} className="cursor-pointer">
                    <rect
                      x="390"
                      y="376"
                      width="128"
                      height="73"
                      rx="4"
                      fill="#0D9488"
                      fillOpacity="0.45"
                      stroke="#2DD4BF"
                      strokeWidth="1.6"
                    />
                    <text x="454" y="412" textAnchor="middle" fill="#F8FAFC" fontSize="9.5" fontFamily="IBM Plex Mono" fontWeight="600">
                      [09] CLEAR SUMP
                    </text>
                    <text x="454" y="427" textAnchor="middle" fill="#2DD4BF" fontSize="8.5" fontFamily="IBM Plex Mono">
                      ALKALINE LIQUOR
                    </text>
                  </g>

                  {/* 10. Submerged pH Probe */}
                  <g onClick={() => setSelectedCompId('ph_probe')} className="cursor-pointer">
                    <rect
                      x="336"
                      y="395"
                      width="54"
                      height="22"
                      rx="3"
                      fill="#101F31"
                      stroke="#A3E635"
                      strokeWidth="1.5"
                    />
                    <line x1="390" y1="406" x2="416" y2="406" stroke="#A3E635" strokeWidth="3" />
                    <circle cx="416" cy="406" r="4" fill="#A3E635" />
                    <text x="363" y="409" textAnchor="middle" fill="#A3E635" fontSize="8.5" fontFamily="IBM Plex Mono">
                      [10] pH
                    </text>
                  </g>

                  {/* 11. Circulation Pump + Continuous Return Line (Sump -> Pump -> Top Spray) */}
                  <g onClick={() => setSelectedCompId('circulation_pump')} className="cursor-pointer">
                    <line x1="518" y1="425" x2="556" y2="425" stroke="#38BDF8" strokeWidth="4" />
                    <circle cx="574" cy="425" r="18" fill="#101F31" stroke="#38BDF8" strokeWidth="2" />
                    <text x="574" y="428" textAnchor="middle" fill="#38BDF8" fontSize="8.5" fontFamily="IBM Plex Mono" fontWeight="600">
                      [11]
                    </text>
                    <text x="574" y="456" textAnchor="middle" fill="#38BDF8" fontSize="8.5" fontFamily="IBM Plex Mono">
                      CIRC PUMP
                    </text>
                    {/* Riser tube from Circulation Pump to Top Spray Distributor (7) */}
                    <polyline
                      points="574,407 574,138 504,138"
                      fill="none"
                      stroke="#1E293B"
                      strokeWidth="6"
                    />
                    <polyline
                      points="574,407 574,138 504,138"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2.4"
                      markerEnd="url(#benchLiqArr)"
                      className="animate-flow-medium"
                    />
                  </g>

                  {/* 12. Reagent Tank, 13. Load Cell & 14. Peristaltic Dosing Pump */}
                  <g onClick={() => setSelectedCompId('dosing_pump')} className="cursor-pointer">
                    <rect
                      x="616"
                      y="322"
                      width="66"
                      height="48"
                      rx="5"
                      fill="#101F31"
                      stroke="#A3E635"
                      strokeWidth="1.8"
                    />
                    <circle cx="649" cy="346" r="12" fill="#07111F" stroke="#A3E635" strokeWidth="1.5" />
                    <text x="649" y="314" textAnchor="middle" fill="#A3E635" fontSize="8.5" fontFamily="IBM Plex Mono">
                      [14] DOSING PUMP
                    </text>
                    {/* Tube: Dosing Pump (14) -> Clear Sump (9) */}
                    <polyline
                      points="616,346 594,346 594,392 518,392"
                      fill="none"
                      stroke="#A3E635"
                      strokeWidth="2.4"
                      markerEnd="url(#benchDoseArr)"
                      className="animate-flow-fast"
                    />
                  </g>

                  <g onClick={() => setSelectedCompId('reagent_tank')} className="cursor-pointer">
                    <rect
                      x="710"
                      y="330"
                      width="78"
                      height="105"
                      rx="5"
                      fill="#101F31"
                      stroke="#94A3B8"
                      strokeWidth="1.6"
                    />
                    <rect
                      x="714"
                      y="362"
                      width="70"
                      height="69"
                      rx="3"
                      fill="#65A30D"
                      fillOpacity="0.45"
                    />
                    <text x="749" y="388" textAnchor="middle" fill="#F8FAFC" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="600">
                      [12] REAGENT
                    </text>
                    <text x="749" y="402" textAnchor="middle" fill="#A3E635" fontSize="8.5" fontFamily="IBM Plex Mono">
                      RESERVOIR
                    </text>
                    {/* Suction tube: Reagent Tank (12) -> Dosing Pump (14) */}
                    <polyline
                      points="710,385 695,385 695,346 682,346"
                      fill="none"
                      stroke="#A3E635"
                      strokeWidth="2.2"
                      className="animate-flow-medium"
                    />
                  </g>

                  <g onClick={() => setSelectedCompId('load_cell')} className="cursor-pointer">
                    <rect
                      x="702"
                      y="437"
                      width="94"
                      height="16"
                      rx="2"
                      fill="#334155"
                      stroke="#2DD4BF"
                      strokeWidth="1.4"
                    />
                    <text x="749" y="448" textAnchor="middle" fill="#F8FAFC" fontSize="8.5" fontFamily="IBM Plex Mono">
                      [13] LOAD CELL
                    </text>
                  </g>

                  {/* 15. Outlet Gas Sensor & 16. Temperature/Humidity Sensor */}
                  <polyline
                    points="522,86 610,86"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="12"
                  />
                  <polyline
                    points="522,86 610,86"
                    fill="none"
                    stroke="#2DD4BF"
                    strokeWidth="2.5"
                    className="animate-flow-medium"
                  />

                  <g onClick={() => setSelectedCompId('outlet_gas_sensor')} className="cursor-pointer">
                    <rect
                      x="610"
                      y="62"
                      width="84"
                      height="48"
                      rx="5"
                      fill="#101F31"
                      stroke="#2DD4BF"
                      strokeWidth="1.6"
                    />
                    <text x="652" y="84" textAnchor="middle" fill="#F8FAFC" fontSize="8.5" fontFamily="IBM Plex Mono" fontWeight="600">
                      [15] OUTLET
                    </text>
                    <text x="652" y="97" textAnchor="middle" fill="#2DD4BF" fontSize="8" fontFamily="IBM Plex Mono">
                      GAS SENSOR
                    </text>
                  </g>

                  <line x1="694" y1="86" x2="718" y2="86" stroke="#334155" strokeWidth="10" />

                  <g onClick={() => setSelectedCompId('temp_humidity_sensor')} className="cursor-pointer">
                    <rect
                      x="718"
                      y="62"
                      width="84"
                      height="48"
                      rx="5"
                      fill="#101F31"
                      stroke="#38BDF8"
                      strokeWidth="1.6"
                    />
                    <text x="760" y="84" textAnchor="middle" fill="#F8FAFC" fontSize="8.5" fontFamily="IBM Plex Mono" fontWeight="600">
                      [16] TEMP/RH
                    </text>
                    <text x="760" y="97" textAnchor="middle" fill="#38BDF8" fontSize="8" fontFamily="IBM Plex Mono">
                      SENSOR
                    </text>
                  </g>

                  <line
                    x1="802"
                    y1="86"
                    x2="880"
                    y2="86"
                    stroke="#2DD4BF"
                    strokeWidth="2.5"
                    markerEnd="url(#benchGasArr)"
                    className="animate-flow-medium"
                  />

                  {/* 17. Control Enclosure, 18. ESP32-Class Controller & 19. Data Logging Dashboard */}
                  <g onClick={() => setSelectedCompId('control_enclosure')} className="cursor-pointer">
                    <rect
                      x="764"
                      y="152"
                      width="126"
                      height="136"
                      rx="6"
                      fill="#101F31"
                      stroke="#64748B"
                      strokeWidth="1.8"
                    />
                    <text x="827" y="172" textAnchor="middle" fill="#F8FAFC" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="600">
                      [17] ENCLOSURE
                    </text>
                    {/* E-Stop button */}
                    <circle cx="792" cy="264" r="9" fill="#7F1D1D" stroke="#F43F5E" strokeWidth="1.5" />
                    <text x="836" y="267" textAnchor="middle" fill="#F43F5E" fontSize="8.5" fontFamily="IBM Plex Mono" fontWeight="600">
                      E-STOP
                    </text>
                  </g>

                  <g onClick={() => setSelectedCompId('esp32_controller')} className="cursor-pointer">
                    <rect
                      x="778"
                      y="184"
                      width="98"
                      height="56"
                      rx="4"
                      fill="#07111F"
                      stroke="#2DD4BF"
                      strokeWidth="1.5"
                    />
                    <text x="827" y="206" textAnchor="middle" fill="#2DD4BF" fontSize="8.5" fontFamily="IBM Plex Mono" fontWeight="600">
                      [18] ESP32-CLASS
                    </text>
                    <text x="827" y="222" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="IBM Plex Mono">
                      CONTROLLER
                    </text>
                  </g>

                  <g onClick={() => setSelectedCompId('data_dashboard')} className="cursor-pointer">
                    <rect
                      x="808"
                      y="346"
                      width="82"
                      height="54"
                      rx="4"
                      fill="#07111F"
                      stroke="#A3E635"
                      strokeWidth="1.5"
                    />
                    <path d="M 798 400 L 898 400 L 890 410 L 806 410 Z" fill="#334155" />
                    <text x="849" y="370" textAnchor="middle" fill="#A3E635" fontSize="8.5" fontFamily="IBM Plex Mono" fontWeight="600">
                      [19] LAPTOP
                    </text>
                    <text x="849" y="384" textAnchor="middle" fill="#F8FAFC" fontSize="8" fontFamily="IBM Plex Mono">
                      DASHBOARD
                    </text>
                  </g>
                </svg>
              </div>
            ) : (
              /* Concept Render View with Resilient Fallback */
              <div className="p-5 space-y-4">
                <div className="relative rounded-md overflow-hidden border border-slate-800 bg-[#0B1726]">
                  {!imgError ? (
                    <img
                      src={benchConceptImg}
                      alt="Concept Render of the NEUTRIX bench-scale modular emission treatment prototype showing transparent packed-bed scrubber column, peristaltic dosing pump, particulate chamber, and electronics enclosure."
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      className="w-full h-auto max-h-[480px] object-cover"
                    />
                  ) : (
                    <div className="h-80 flex flex-col items-center justify-center p-6 text-center space-y-2 bg-[#0B1726]">
                      <Cpu className="w-8 h-8 text-[#2DD4BF]" />
                      <div className="text-sm font-semibold text-[#F8FAFC]">
                        NEUTRIX Bench Prototype — Concept Render
                      </div>
                      <p className="text-xs text-[#94A3B8] max-w-md">
                        Switch to the Interactive 19-Point Bench Diagram above to inspect every
                        component and tubing path in full detail.
                      </p>
                    </div>
                  )}

                  {/* Measured contrast scrim at bottom */}
                  <div className="bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono text-[#A3E635] font-semibold">
                      CONCEPT RENDER — PROTOTYPE / DEVELOPMENT STAGE
                    </span>
                    <span className="text-xs font-mono text-[#F8FAFC]">
                      Illustrative architectural visualization · Not a photograph of a completed industrial unit
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right 4 Columns: Active Component Inspector & Prototype Status Panel (Section 18) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Active Component Inspector */}
            <div className="bg-[#101F31] border border-slate-700 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-[#2DD4BF] font-bold">
                  CALLOUT [{String(selectedComp.number).padStart(2, '0')}] · {selectedComp.subsystem}
                </span>
                <span className="text-xs font-mono text-[#A3E635]">{selectedComp.status}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#F8FAFC] font-display">
                  {selectedComp.name}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                  {selectedComp.functionDescription}
                </p>
              </div>

              <div className="p-3 bg-[#07111F] border border-slate-800 rounded text-xs space-y-1">
                <div className="font-mono text-[11px] text-[#2DD4BF]">
                  PHYSICAL TUBING / WIRING INTERCONNECT
                </div>
                <p className="text-[#F8FAFC]/90">{selectedComp.physicalConnection}</p>
              </div>
            </div>

            {/* Section 18: PROTOTYPE STATUS PANEL */}
            <div className="bg-[#07111F] border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <div className="text-xs font-mono text-[#2DD4BF] font-semibold">
                  12. PROTOTYPE DEMONSTRATION STATUS
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">
                  Scope distinction between physical bench demonstration and documented architecture
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono text-[#A3E635] font-semibold">
                  CURRENT DEMONSTRATION (PLANNED / PROTOTYPE STAGE):
                </div>
                <ul className="space-y-1.5 text-xs font-mono">
                  {[
                    'Particulate removal',
                    'Alkaline absorption',
                    'Mist elimination',
                    'pH-based dosing',
                    'Outlet monitoring',
                    'Data logging',
                  ].map((item) => (
                    <li key={item} className="flex items-center justify-between text-[#F8FAFC]">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#A3E635]" />
                        <span>{item}</span>
                      </span>
                      <span className="text-[10px] text-amber-400">Validation Pending</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800">
                <div className="text-xs font-mono text-[#2DD4BF] font-semibold">
                  ARCHITECTURE / FUTURE (NOT CURRENTLY DEMONSTRATED):
                </div>
                <ul className="space-y-1.5 text-xs font-mono">
                  {[
                    { label: 'NOₓ selective treatment', tag: 'Architecture' },
                    { label: 'VOC polishing', tag: 'Architecture' },
                    { label: 'Mercury capture', tag: 'Architecture' },
                    { label: 'Additional treatment modules', tag: 'Architecture' },
                    { label: 'Full industrial deployment', tag: 'Out of Scope' },
                  ].map((item) => (
                    <li key={item.label} className="flex items-center justify-between text-[#94A3B8]">
                      <span className="flex items-center gap-2">
                        <Circle className="w-3.5 h-3.5 text-[#2DD4BF]" />
                        <span>{item.label}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">{item.tag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PART 2: INTERACTIVE EXPLODED COMPONENT ARCHITECTURE (SECTION 31 & 32) ================= */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
                13. COMPONENT ARCHITECTURE & CANDIDATE TECHNOLOGY STACK
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] font-display mt-1">
                Interactive Subsystem Explorer (19 Bench Nodes)
              </h2>
            </div>

            {/* 7 Subsystem Category Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              {SUBSYSTEM_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSubsystemFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                    subsystemFilter === cat
                      ? 'bg-[#2DD4BF] text-[#07111F] font-semibold'
                      : 'bg-[#07111F] text-[#94A3B8] hover:text-[#F8FAFC] border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {filteredComponents.map((comp) => {
              const isSelected = comp.id === selectedCompId;
              return (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => setSelectedCompId(comp.id)}
                  className={`text-left p-4 rounded-md border transition-colors cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#101F31] border-[#2DD4BF]'
                      : 'bg-[#07111F] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#2DD4BF] font-bold">
                        #{String(comp.number).padStart(2, '0')} · {comp.subsystem}
                      </span>
                      <span className="text-[#94A3B8] text-[11px]">{comp.status}</span>
                    </div>
                    <div className="text-sm font-bold text-[#F8FAFC]">{comp.name}</div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {comp.functionDescription}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-[#A3E635]">
                    {comp.physicalConnection}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
