import React, { useState } from 'react';
import { useNeutrix } from '../context/NeutrixContext';
import { Play, Pause, Sliders, ArrowRight, Activity } from 'lucide-react';

interface HeroHotspot {
  id: string;
  label: string;
  tag: string;
  detail: string;
}

const HERO_HOTSPOTS: Record<string, HeroHotspot> = {
  inlet: {
    id: 'inlet',
    label: 'Gas Inlet & Flow Sensor',
    tag: 'STAGE 00 · GAS INLET',
    detail: 'Controlled surrogate gas stream enters manifold; volumetric flow (Q_gas) and inlet concentration (C_in) feed mass-flow calculation.',
  },
  particulate: {
    id: 'particulate',
    label: 'Particulate Filtration Module',
    tag: 'STAGE 01 · PARTICULATE',
    detail: 'Mechanical filter chamber removes solid particulates upstream so downstream packed-bed rings and liquid sump stay clean.',
  },
  scrubber: {
    id: 'scrubber',
    label: 'Alkaline Packed-Bed Scrubber',
    tag: 'STAGE 02 · ABSORPTION',
    detail: 'Transparent acrylic column filled with white Raschig packing rings; upward gas contacts downward alkaline spray.',
  },
  mist: {
    id: 'mist',
    label: 'Top Mist Eliminator',
    tag: 'STAGE 03 · DEMISTER',
    detail: 'Coalescing mesh pad above the spray distributor captures entrained droplets to prevent liquid carry-over to sensors.',
  },
  dosing: {
    id: 'dosing',
    label: 'Reagent Tank & Peristaltic Pump',
    tag: 'ACTUATION · DOSING LOOP',
    detail: 'Meters dilute alkaline reagent from load-cell reservoir into the scrubber sump according to feedforward + feedback command.',
  },
  sump: {
    id: 'sump',
    label: 'Clear Sump, pH Probe & Circulation Loop',
    tag: 'SENSING · LIQUID LOOP',
    detail: 'Submerged pH sensor monitors scrubbing liquor alkalinity while the circulation pump returns liquid to the top spray nozzle.',
  },
  outlet: {
    id: 'outlet',
    label: 'Outlet Gas Sensor',
    tag: 'VERIFICATION · OUTLET',
    detail: 'Measures residual concentration (C_out) exiting the mist eliminator and closes the feedback loop to the controller.',
  },
  controller: {
    id: 'controller',
    label: 'Control Enclosure & Laptop Dashboard',
    tag: 'CONTROL · ESP32-CLASS',
    detail: 'Computes pollutant mass flow, stoichiometric demand, and pH/outlet feedback trim; streams telemetry to the dashboard.',
  },
};

export const HeroSection: React.FC = () => {
  const {
    inletConcentration,
    outletConcentration,
    gasFlow,
    pH,
    pHSetpoint,
    pumpCommand,
    dosingCalc,
  } = useNeutrix();

  const [animating, setAnimating] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string>('scrubber');

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const activeHotspot = HERO_HOTSPOTS[selectedNode] || HERO_HOTSPOTS.scrubber;

  return (
    <section
      id="overview"
      className="relative border-b border-slate-800/80 bg-[#07111F] bg-engineering-grid py-10 lg:py-16"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Engineering Identity & Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#2DD4BF]">
              <span>● PROTOTYPE / DEVELOPMENT STAGE</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-[#94A3B8]">BENCH-SCALE ENGINEERING VALIDATION</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F8FAFC] font-display">
                NEUTRIX
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-[#F8FAFC]/90 font-display text-balance">
                Modular Industrial Emission Treatment System
              </p>
              <p className="text-base font-mono text-[#A3E635] tracking-wide">
                “Capture. Convert. Protect.”
              </p>
            </div>

            <p className="text-base text-[#94A3B8] leading-relaxed max-w-[62ch]">
              An adaptive, modular emission-treatment architecture that selects treatment stages
              according to pollutant composition and dynamically adjusts reagent dosing using
              sensor feedback.
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => scrollToSection('#problem')}
                className="px-5 py-2.5 text-sm font-semibold bg-[#2DD4BF] text-[#07111F] hover:bg-[#5EEAD4] rounded-md transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>Explore the System</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('#simulator')}
                className="px-5 py-2.5 text-sm font-semibold bg-[#101F31] text-[#F8FAFC] hover:bg-slate-800 border border-slate-700 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-[#2DD4BF]" />
                <span>Open Simulator</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('#architecture')}
                className="px-4 py-2.5 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] border border-slate-800 hover:border-slate-700 rounded-md transition-colors whitespace-nowrap cursor-pointer"
              >
                View Architecture
              </button>
            </div>

            {/* Key Engineering Specifications & Truthfulness Boundaries */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-xs font-mono text-[#94A3B8]">SURROGATE CAPTURE</div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-xl font-mono font-semibold text-[#F8FAFC] tabular-nums">
                    ≥ 90%
                  </span>
                  <span className="text-xs font-mono text-[#A3E635]">TARGET</span>
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">
                  Design target — to be validated
                </div>
              </div>

              <div>
                <div className="text-xs font-mono text-[#94A3B8]">CONTROL ARCHITECTURE</div>
                <div className="mt-1 text-sm font-mono font-semibold text-[#F8FAFC]">
                  Feedforward + Trim
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">
                  Mass-flow stoichiometry + pH loop
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <div className="text-xs font-mono text-[#94A3B8]">PROJECT LEAD</div>
                <div className="mt-1 text-sm font-semibold text-[#F8FAFC]">
                  Chaitanya Sai Lanke
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">
                  Bench-scale prototype stage
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 2.5D Bench Prototype & Closed-Loop Schematic */}
          <div className="lg:col-span-7">
            <div className="bg-[#0B1726] border border-slate-800 rounded-lg overflow-hidden">
              {/* Schematic Top Bar */}
              <div className="px-4 py-3 bg-[#101F31] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <Activity className="w-4 h-4 text-[#2DD4BF]" />
                  <span className="text-[#F8FAFC] font-medium">
                    NEUTRIX BENCH PROTOTYPE — INTERACTIVE PROCESS LOOP
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-[#A3E635]">PROTOTYPE / DEVELOPMENT STAGE</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-[#94A3B8]">
                    Click any stage to inspect
                  </span>
                  <button
                    type="button"
                    onClick={() => setAnimating((a) => !a)}
                    className="px-2.5 py-1 text-xs font-mono text-[#F8FAFC] bg-[#07111F] hover:bg-slate-900 border border-slate-700 rounded flex items-center gap-1.5 cursor-pointer"
                  >
                    {animating ? (
                      <>
                        <Pause className="w-3 h-3 text-[#2DD4BF]" />
                        <span>Pause Flow</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-[#A3E635]" />
                        <span>Animate Flow</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Interactive SVG 2.5D Prototype Visualization */}
              <div className="relative p-3 sm:p-5 bg-[#07111F]/70">
                <svg
                  viewBox="0 0 820 440"
                  className="w-full h-auto select-none"
                  role="img"
                  aria-label="Interactive 2.5D schematic of the NEUTRIX bench prototype showing gas inlet, particulate filtration module, vertical packed-bed alkaline scrubber, mist eliminator, reagent tank, metering pump, pH sensor, circulation loop, outlet gas sensor, and controller feedback loop."
                >
                  <defs>
                    <linearGradient id="acrylicColumnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1E293B" stopOpacity="0.65" />
                      <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.14" />
                      <stop offset="75%" stopColor="#2DD4BF" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="#1E293B" stopOpacity="0.65" />
                    </linearGradient>
                    <linearGradient id="sumpLiquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#0D9488" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="reagentLiquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#A3E635" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#65A30D" stopOpacity="0.7" />
                    </linearGradient>
                    <marker
                      id="arrowTeal"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#2DD4BF" />
                    </marker>
                    <marker
                      id="arrowLime"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#A3E635" />
                    </marker>
                    <marker
                      id="arrowCyan"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#38BDF8" />
                    </marker>
                  </defs>

                  {/* Laboratory Secondary Containment Drip Tray Base */}
                  <rect
                    x="20"
                    y="398"
                    width="780"
                    height="16"
                    rx="3"
                    fill="#101F31"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                  <text x="34" y="410" fill="#64748B" fontSize="9" fontFamily="IBM Plex Mono">
                    SECONDARY CONTAINMENT DRIP TRAY · BENCH OPTICAL DECK
                  </text>

                  {/* ================= 1. GAS INLET & MANIFOLD ================= */}
                  <g
                    onClick={() => setSelectedNode('inlet')}
                    className="cursor-pointer"
                  >
                    <rect
                      x="28"
                      y="240"
                      width="76"
                      height="64"
                      rx="6"
                      fill="#101F31"
                      stroke={selectedNode === 'inlet' ? '#2DD4BF' : '#475569'}
                      strokeWidth={selectedNode === 'inlet' ? '2' : '1.2'}
                    />
                    <circle cx="66" cy="272" r="18" fill="#07111F" stroke="#2DD4BF" strokeWidth="1.5" />
                    <path d="M 58 272 L 74 272 M 66 264 L 66 280" stroke="#2DD4BF" strokeWidth="1.2" />
                    <text x="66" y="230" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
                      GAS INLET
                    </text>
                    <text x="66" y="320" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="IBM Plex Mono">
                      FIT-101 / AIT-101
                    </text>
                  </g>

                  {/* Duct: Gas Inlet -> Particulate Module */}
                  <path
                    d="M 104 272 L 154 272"
                    stroke="#334155"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 104 272 L 154 272"
                    stroke="#94A3B8"
                    strokeWidth="2"
                    className={animating ? 'animate-flow-fast' : ''}
                  />

                  {/* ================= 2. PARTICULATE FILTRATION MODULE ================= */}
                  <g
                    onClick={() => setSelectedNode('particulate')}
                    className="cursor-pointer"
                  >
                    <rect
                      x="154"
                      y="214"
                      width="88"
                      height="116"
                      rx="6"
                      fill="url(#acrylicColumnGrad)"
                      stroke={selectedNode === 'particulate' ? '#2DD4BF' : '#64748B'}
                      strokeWidth={selectedNode === 'particulate' ? '2.2' : '1.5'}
                    />
                    {/* Internal pleated mechanical filter element */}
                    <rect
                      x="186"
                      y="224"
                      width="24"
                      height="96"
                      rx="2"
                      fill="#0F172A"
                      stroke="#94A3B8"
                      strokeWidth="1"
                      strokeDasharray="3 2"
                    />
                    <line x1="192" y1="226" x2="204" y2="240" stroke="#64748B" strokeWidth="1" />
                    <line x1="204" y1="240" x2="192" y2="254" stroke="#64748B" strokeWidth="1" />
                    <line x1="192" y1="254" x2="204" y2="268" stroke="#64748B" strokeWidth="1" />
                    <line x1="204" y1="268" x2="192" y2="282" stroke="#64748B" strokeWidth="1" />
                    <line x1="192" y1="282" x2="204" y2="296" stroke="#64748B" strokeWidth="1" />
                    <line x1="204" y1="296" x2="192" y2="310" stroke="#64748B" strokeWidth="1" />

                    {/* Captured PM dots on upstream face */}
                    <circle cx="176" cy="248" r="2.5" fill="#94A3B8" />
                    <circle cx="182" cy="265" r="3" fill="#94A3B8" />
                    <circle cx="174" cy="284" r="2.2" fill="#94A3B8" />
                    <circle cx="181" cy="298" r="2.8" fill="#94A3B8" />

                    <text x="198" y="202" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
                      PARTICULATE
                    </text>
                    <text x="198" y="346" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="IBM Plex Mono">
                      FILTER + PM SENSORS
                    </text>
                  </g>

                  {/* Duct: Particulate Module -> Scrubber Lower Gas Inlet */}
                  <path
                    d="M 242 272 L 306 272"
                    stroke="#334155"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 242 272 L 306 272"
                    stroke="#2DD4BF"
                    strokeWidth="2.2"
                    className={animating ? 'animate-flow-fast' : ''}
                  />

                  {/* ================= 3. VERTICAL TRANSPARENT PACKED-BED SCRUBBER ================= */}
                  <g
                    onClick={() => setSelectedNode('scrubber')}
                    className="cursor-pointer"
                  >
                    {/* Main Vertical Acrylic Column */}
                    <rect
                      x="306"
                      y="64"
                      width="116"
                      height="316"
                      rx="8"
                      fill="url(#acrylicColumnGrad)"
                      stroke={selectedNode === 'scrubber' ? '#2DD4BF' : '#94A3B8'}
                      strokeWidth={selectedNode === 'scrubber' ? '2.4' : '1.6'}
                    />

                    {/* Flanges */}
                    <line x1="300" y1="115" x2="428" y2="115" stroke="#64748B" strokeWidth="2.5" />
                    <line x1="300" y1="255" x2="428" y2="255" stroke="#64748B" strokeWidth="2.5" />
                    <line x1="300" y1="305" x2="428" y2="305" stroke="#64748B" strokeWidth="2.5" />

                    {/* Packed Bed Region (White Plastic Raschig Rings) */}
                    <rect
                      x="314"
                      y="148"
                      width="100"
                      height="104"
                      rx="3"
                      fill="#0F172A"
                      fillOpacity="0.45"
                      stroke="#475569"
                      strokeDasharray="4 2"
                    />
                    {/* Draw structured rows of white plastic packing rings */}
                    {[160, 178, 196, 214, 232].map((rowY, rIdx) =>
                      [326, 344, 362, 380, 398].map((colX, cIdx) => (
                        <circle
                          key={`${rIdx}-${cIdx}`}
                          cx={colX + (rIdx % 2 === 0 ? 0 : 4)}
                          cy={rowY}
                          r="6.5"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeOpacity="0.65"
                          strokeWidth="2"
                        />
                      ))
                    )}

                    {/* Top Spray Distributor Header & Downward Droplets */}
                    <line x1="326" y1="128" x2="402" y2="128" stroke="#38BDF8" strokeWidth="3.5" />
                    {[336, 354, 374, 392].map((nozzleX) => (
                      <g key={nozzleX}>
                        <line
                          x1={nozzleX}
                          y1="128"
                          x2={nozzleX - 6}
                          y2="145"
                          stroke="#38BDF8"
                          strokeWidth="1.2"
                          strokeDasharray="2 2"
                          className={animating ? 'animate-flow-fast' : ''}
                        />
                        <line
                          x1={nozzleX}
                          y1="128"
                          x2={nozzleX + 6}
                          y2="145"
                          stroke="#38BDF8"
                          strokeWidth="1.2"
                          strokeDasharray="2 2"
                          className={animating ? 'animate-flow-fast' : ''}
                        />
                      </g>
                    ))}

                    <text x="364" y="48" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
                      ALKALINE SCRUBBER
                    </text>
                  </g>

                  {/* ================= 4. MIST ELIMINATOR (TOP OF COLUMN) ================= */}
                  <g
                    onClick={() => setSelectedNode('mist')}
                    className="cursor-pointer"
                  >
                    <rect
                      x="314"
                      y="82"
                      width="100"
                      height="24"
                      rx="3"
                      fill="#1E293B"
                      stroke={selectedNode === 'mist' ? '#2DD4BF' : '#38BDF8'}
                      strokeWidth={selectedNode === 'mist' ? '2' : '1.2'}
                    />
                    <path
                      d="M 318 90 L 330 98 L 342 90 L 354 98 L 366 90 L 378 98 L 390 90 L 402 98 L 410 90"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                    />
                    <text x="364" y="77" textAnchor="middle" fill="#38BDF8" fontSize="8.5" fontFamily="IBM Plex Mono">
                      MIST ELIMINATOR
                    </text>
                  </g>

                  {/* ================= 5. CLEAR SUMP, pH PROBE & CIRCULATION LOOP ================= */}
                  <g
                    onClick={() => setSelectedNode('sump')}
                    className="cursor-pointer"
                  >
                    {/* Sump Liquid Volume at Base of Column */}
                    <rect
                      x="310"
                      y="314"
                      width="108"
                      height="62"
                      rx="4"
                      fill="url(#sumpLiquidGrad)"
                      stroke={selectedNode === 'sump' ? '#A3E635' : '#2DD4BF'}
                      strokeWidth="1.5"
                    />
                    <text x="364" y="348" textAnchor="middle" fill="#F8FAFC" fontSize="9.5" fontFamily="IBM Plex Mono" fontWeight="600">
                      SCRUBBER SUMP
                    </text>
                    <text x="364" y="362" textAnchor="middle" fill="#E2E8F0" fontSize="9" fontFamily="IBM Plex Mono">
                      pH {pH.toFixed(2)} (SP {pHSetpoint.toFixed(1)})
                    </text>

                    {/* Submerged pH Sensor Probe */}
                    <rect
                      x="284"
                      y="324"
                      width="26"
                      height="14"
                      rx="2"
                      fill="#101F31"
                      stroke="#A3E635"
                      strokeWidth="1.4"
                    />
                    <line x1="310" y1="331" x2="332" y2="331" stroke="#A3E635" strokeWidth="2.5" />
                    <circle cx="332" cy="331" r="3.5" fill="#A3E635" />
                    <text x="278" y="334" textAnchor="end" fill="#A3E635" fontSize="9" fontFamily="IBM Plex Mono">
                      pH PROBE
                    </text>

                    {/* Circulation Pump (Right of Sump) */}
                    <circle
                      cx="464"
                      cy="354"
                      r="16"
                      fill="#101F31"
                      stroke="#38BDF8"
                      strokeWidth="1.8"
                    />
                    <text x="464" y="357" textAnchor="middle" fill="#38BDF8" fontSize="8.5" fontFamily="IBM Plex Mono" fontWeight="600">
                      P-301
                    </text>
                    <text x="464" y="384" textAnchor="middle" fill="#94A3B8" fontSize="8.5" fontFamily="IBM Plex Mono">
                      CIRC PUMP
                    </text>

                    {/* Liquid Line: Sump -> Circulation Pump -> Top Spray Distributor */}
                    <path
                      d="M 418 354 L 448 354"
                      stroke="#38BDF8"
                      strokeWidth="3"
                    />
                    <path
                      d="M 464 338 L 464 128 L 402 128"
                      fill="none"
                      stroke="#1E293B"
                      strokeWidth="6"
                    />
                    <path
                      d="M 464 338 L 464 128 L 402 128"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2.2"
                      markerEnd="url(#arrowCyan)"
                      className={animating ? 'animate-flow-medium' : ''}
                    />
                  </g>

                  {/* ================= 6. REAGENT TANK, LOAD CELL & DOSING PUMP ================= */}
                  <g
                    onClick={() => setSelectedNode('dosing')}
                    className="cursor-pointer"
                  >
                    {/* Peristaltic Metering Pump */}
                    <rect
                      x="518"
                      y="270"
                      width="56"
                      height="44"
                      rx="6"
                      fill="#101F31"
                      stroke={selectedNode === 'dosing' ? '#A3E635' : '#2DD4BF'}
                      strokeWidth="1.8"
                    />
                    <circle cx="546" cy="292" r="12" fill="#07111F" stroke="#A3E635" strokeWidth="1.5" />
                    <circle cx="546" cy="292" r="3" fill="#A3E635" />
                    <text x="546" y="262" textAnchor="middle" fill="#A3E635" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="600">
                      DOSING PUMP
                    </text>
                    <text x="546" y="326" textAnchor="middle" fill="#94A3B8" fontSize="8.5" fontFamily="IBM Plex Mono">
                      {pumpCommand.toFixed(0)}% CMD
                    </text>

                    {/* Alkaline Reagent Reservoir on Load Cell */}
                    <rect
                      x="604"
                      y="282"
                      width="74"
                      height="90"
                      rx="5"
                      fill="#101F31"
                      stroke={selectedNode === 'dosing' ? '#A3E635' : '#64748B'}
                      strokeWidth="1.5"
                    />
                    <rect
                      x="608"
                      y="310"
                      width="66"
                      height="58"
                      rx="3"
                      fill="url(#reagentLiquidGrad)"
                    />
                    <text x="641" y="336" textAnchor="middle" fill="#F8FAFC" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="600">
                      REAGENT
                    </text>
                    <text x="641" y="349" textAnchor="middle" fill="#E2E8F0" fontSize="8.5" fontFamily="IBM Plex Mono">
                      TANK
                    </text>

                    {/* Load cell platform */}
                    <rect
                      x="598"
                      y="374"
                      width="86"
                      height="10"
                      rx="2"
                      fill="#334155"
                      stroke="#94A3B8"
                      strokeWidth="1"
                    />
                    <text x="641" y="393" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="IBM Plex Mono">
                      LOAD CELL
                    </text>

                    {/* Tubing: Reagent Tank -> Dosing Pump -> Scrubber Sump */}
                    <path
                      d="M 604 335 L 584 335 L 584 292 L 574 292"
                      fill="none"
                      stroke="#A3E635"
                      strokeWidth="2.2"
                      className={animating ? 'animate-flow-medium' : ''}
                    />
                    <path
                      d="M 518 292 L 490 292 L 490 326 L 418 326"
                      fill="none"
                      stroke="#A3E635"
                      strokeWidth="2.2"
                      markerEnd="url(#arrowLime)"
                      className={animating ? 'animate-flow-fast' : ''}
                    />
                  </g>

                  {/* ================= 7. OUTLET GAS SENSOR & CLEAN EXHAUST ================= */}
                  <g
                    onClick={() => setSelectedNode('outlet')}
                    className="cursor-pointer"
                  >
                    {/* Top Outlet Pipe from Scrubber above Mist Eliminator */}
                    <path
                      d="M 422 88 L 548 88"
                      stroke="#334155"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 422 88 L 548 88"
                      stroke="#2DD4BF"
                      strokeWidth="2.2"
                      className={animating ? 'animate-flow-medium' : ''}
                    />

                    {/* Outlet Sensor Manifold Node */}
                    <rect
                      x="548"
                      y="62"
                      width="88"
                      height="52"
                      rx="6"
                      fill="#101F31"
                      stroke={selectedNode === 'outlet' ? '#2DD4BF' : '#38BDF8'}
                      strokeWidth={selectedNode === 'outlet' ? '2.2' : '1.5'}
                    />
                    <text x="592" y="84" textAnchor="middle" fill="#F8FAFC" fontSize="9.5" fontFamily="IBM Plex Mono" fontWeight="600">
                      OUTLET SENSOR
                    </text>
                    <text x="592" y="99" textAnchor="middle" fill="#2DD4BF" fontSize="8.5" fontFamily="IBM Plex Mono">
                      AIT-401 + RH/T
                    </text>

                    {/* Treated Exhaust Discharge Arrow */}
                    <path
                      d="M 636 88 L 765 88"
                      stroke="#1E293B"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 636 88 L 765 88"
                      stroke="#2DD4BF"
                      strokeWidth="2.5"
                      markerEnd="url(#arrowTeal)"
                      className={animating ? 'animate-flow-medium' : ''}
                    />
                    <text x="712" y="72" textAnchor="middle" fill="#2DD4BF" fontSize="9.5" fontFamily="IBM Plex Mono" fontWeight="600">
                      TREATED GAS OUT
                    </text>
                  </g>

                  {/* ================= 8. CONTROLLER ENCLOSURE & LAPTOP DASHBOARD ================= */}
                  <g
                    onClick={() => setSelectedNode('controller')}
                    className="cursor-pointer"
                  >
                    <rect
                      x="686"
                      y="148"
                      width="108"
                      height="96"
                      rx="6"
                      fill="#101F31"
                      stroke={selectedNode === 'controller' ? '#2DD4BF' : '#64748B'}
                      strokeWidth={selectedNode === 'controller' ? '2.2' : '1.5'}
                    />
                    <text x="740" y="170" textAnchor="middle" fill="#F8FAFC" fontSize="9.5" fontFamily="IBM Plex Mono" fontWeight="600">
                      CONTROLLER
                    </text>
                    <text x="740" y="184" textAnchor="middle" fill="#2DD4BF" fontSize="8.5" fontFamily="IBM Plex Mono">
                      ESP32-CLASS MCU
                    </text>
                    <text x="740" y="200" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="IBM Plex Mono">
                      Mass-Flow + Trim
                    </text>
                    {/* Hardware Emergency Stop Indicator */}
                    <circle cx="712" cy="222" r="8" fill="#7F1D1D" stroke="#F43F5E" strokeWidth="1.5" />
                    <text x="748" y="225" textAnchor="middle" fill="#F8FAFC" fontSize="8" fontFamily="IBM Plex Mono">
                      E-STOP
                    </text>

                    {/* Laptop / Data Logging Dashboard */}
                    <rect
                      x="706"
                      y="272"
                      width="76"
                      height="48"
                      rx="4"
                      fill="#07111F"
                      stroke="#38BDF8"
                      strokeWidth="1.4"
                    />
                    <path d="M 696 320 L 792 320 L 784 328 L 704 328 Z" fill="#334155" />
                    <polyline
                      points="714,306 726,294 738,300 752,286 768,290"
                      fill="none"
                      stroke="#2DD4BF"
                      strokeWidth="1.6"
                    />
                    <text x="744" y="342" textAnchor="middle" fill="#94A3B8" fontSize="8.5" fontFamily="IBM Plex Mono">
                      DASHBOARD LOG
                    </text>
                  </g>

                  {/* ================= 9. CLOSED-LOOP FEEDBACK SIGNALS ================= */}
                  {/* Feedback Line: OUTLET SENSOR -> CONTROLLER -> DOSING PUMP */}
                  <path
                    d="M 592 114 L 592 166 L 686 166"
                    fill="none"
                    stroke="#2DD4BF"
                    strokeWidth="1.6"
                    strokeDasharray="4 4"
                    markerEnd="url(#arrowTeal)"
                    className={animating ? 'animate-flow-slow' : ''}
                  />
                  {/* Feedback Line: pH Probe -> Controller */}
                  <path
                    d="M 284 331 L 266 331 L 266 390 L 664 390 L 664 214 L 686 214"
                    fill="none"
                    stroke="#A3E635"
                    strokeWidth="1.4"
                    strokeDasharray="4 4"
                    markerEnd="url(#arrowLime)"
                    className={animating ? 'animate-flow-slow' : ''}
                  />
                  {/* Actuation Command: Controller -> Dosing Pump */}
                  <path
                    d="M 686 196 L 546 196 L 546 250"
                    fill="none"
                    stroke="#A3E635"
                    strokeWidth="1.8"
                    strokeDasharray="5 3"
                    markerEnd="url(#arrowLime)"
                    className={animating ? 'animate-flow-fast' : ''}
                  />
                  <rect x="564" y="185" width="108" height="18" rx="3" fill="#07111F" stroke="#334155" />
                  <text x="618" y="197" textAnchor="middle" fill="#A3E635" fontSize="8" fontFamily="IBM Plex Mono">
                    FEEDBACK → PUMP CMD
                  </text>

                  {/* Animated Rising Gas Bubbles inside Packed Bed */}
                  {animating && (
                    <g>
                      <circle cx="342" cy="275" r="3.5" fill="#2DD4BF" fillOpacity="0.8">
                        <animate attributeName="cy" values="295;135" dur="2.6s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0.15" dur="2.6s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="368" cy="285" r="3" fill="#38BDF8" fillOpacity="0.8">
                        <animate attributeName="cy" values="295;145" dur="2.1s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0.1" dur="2.1s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="390" cy="265" r="3.5" fill="#2DD4BF" fillOpacity="0.8">
                        <animate attributeName="cy" values="295;125" dur="3.0s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.85;0.2" dur="3.0s" repeatCount="indefinite" />
                      </circle>
                      {/* Clean gas particles exiting top */}
                      <circle cx="440" cy="88" r="2.8" fill="#2DD4BF">
                        <animate attributeName="cx" values="425;755" dur="2.8s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="510" cy="88" r="2.5" fill="#38BDF8">
                        <animate attributeName="cx" values="425;755" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
                      </circle>
                    </g>
                  )}
                </svg>

                {/* Interactive Node Inspector Drawer inside Hero Card */}
                <div className="mt-3 p-3.5 bg-[#101F31] border border-slate-800 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-[#2DD4BF] font-semibold">{activeHotspot.tag}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[#F8FAFC] font-semibold">{activeHotspot.label}</span>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {activeHotspot.detail}
                    </p>
                  </div>

                  {/* Quick node selector buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {Object.keys(HERO_HOTSPOTS).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedNode(key)}
                        className={`px-2 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                          selectedNode === key
                            ? 'bg-[#2DD4BF] text-[#07111F] font-semibold'
                            : 'bg-[#07111F] text-[#94A3B8] hover:text-[#F8FAFC] border border-slate-800'
                        }`}
                      >
                        {key.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Illustrative Loop Readout Bar */}
              <div className="px-4 py-2.5 bg-[#0B1726] border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <span className="text-[#94A3B8]">SIM INLET: </span>
                  <span className="text-[#F8FAFC] font-semibold tabular-nums">
                    {inletConcentration} ppm
                  </span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">GAS FLOW: </span>
                  <span className="text-[#F8FAFC] font-semibold tabular-nums">
                    {gasFlow.toFixed(1)} L/min
                  </span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">DOSE EST: </span>
                  <span className="text-[#A3E635] font-semibold tabular-nums">
                    {dosingCalc.adaptiveTotalDoseMlMin.toFixed(2)} mL/min
                  </span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">SIM OUTLET: </span>
                  <span className="text-[#2DD4BF] font-semibold tabular-nums">
                    {outletConcentration} ppm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
