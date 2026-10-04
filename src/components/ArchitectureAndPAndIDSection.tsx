import React, { useState } from 'react';
import { ARCHITECTURE_NODES } from '../data/neutrixData';
import { ArchitectureNodeSpec } from '../types/neutrix';
import { Cpu, Layers, ArrowRight, ArrowDown, Info } from 'lucide-react';

export const ArchitectureAndPAndIDSection: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('alkaline_scrubber');
  const [viewMode, setViewMode] = useState<'process_flow' | 'pid_schematic'>('process_flow');

  const selectedNode: ArchitectureNodeSpec =
    ARCHITECTURE_NODES.find((n) => n.id === selectedNodeId) || ARCHITECTURE_NODES[3];

  const gasPathIds = [
    'gas_inlet',
    'particulate_stage',
    'alkaline_scrubber',
    'mist_eliminator',
    'outlet_sensor',
    'treated_gas',
  ];

  const liquidPathIds = ['reagent_tank', 'metering_pump', 'scrubber_sump', 'circulation_loop'];

  const sensorAndControlIds = ['inlet_sensor', 'controller_node'];

  return (
    <section
      id="architecture"
      className="border-b border-slate-800/80 bg-[#0B1726] py-16 lg:py-24"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header + Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="text-xs font-mono text-[#2DD4BF] tracking-wider">
              04. CORE SYSTEM ARCHITECTURE & P&ID SCHEMATIC
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] font-display text-balance">
              Coupled Gas Path, Liquid Loop & Sensor-Driven Control
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Click any process unit, liquid loop element, or sensor node below to inspect its
              inputs, outputs, physical bench implementation, and validation boundary. Toggle
              between the Process Block Diagram and the Engineering P&ID View.
            </p>
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-[#07111F] border border-slate-800 rounded-md self-start">
            <button
              type="button"
              onClick={() => setViewMode('process_flow')}
              className={`px-3.5 py-2 text-xs font-mono rounded transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                viewMode === 'process_flow'
                  ? 'bg-[#2DD4BF] text-[#07111F] font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Process Architecture</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('pid_schematic')}
              className={`px-3.5 py-2 text-xs font-mono rounded transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                viewMode === 'pid_schematic'
                  ? 'bg-[#A3E635] text-[#07111F] font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Engineering P&ID View</span>
            </button>
          </div>
        </div>

        {/* ================= MODE 1: INTERACTIVE HORIZONTAL PROCESS ARCHITECTURE ================= */}
        {viewMode === 'process_flow' ? (
          <div className="bg-[#07111F] border border-slate-800 rounded-lg p-5 sm:p-7 space-y-8">
            {/* Top Layer: Sensors & Controller Loop */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#94A3B8] flex items-center justify-between">
                <span>SENSING & CLOSED-LOOP CONTROL LAYER</span>
                <span className="text-[#2DD4BF]">
                  Sensors → Controller → Pump Command → Treatment → Outlet Measurement → Feedback
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sensorAndControlIds.map((id) => {
                  const node = ARCHITECTURE_NODES.find((n) => n.id === id)!;
                  const active = selectedNodeId === node.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`text-left p-4 rounded-md border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#101F31] border-[#2DD4BF]'
                          : 'bg-[#0B1726] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#2DD4BF]">{node.code}</span>
                        <span className="text-[#94A3B8]">{node.category}</span>
                      </div>
                      <div className="text-sm font-semibold text-[#F8FAFC] mt-1">{node.title}</div>
                      <div className="text-xs text-[#94A3B8] mt-1 line-clamp-2">{node.role}</div>
                    </button>
                  );
                })}

                {/* Feedback Loop Summary Block */}
                <div className="p-4 rounded-md bg-[#101F31]/60 border border-dashed border-slate-700 flex flex-col justify-between">
                  <div className="text-xs font-mono text-[#A3E635]">
                    CLOSED-LOOP FEEDBACK PATHWAY
                  </div>
                  <div className="text-xs text-[#F8FAFC] font-mono mt-1">
                    AIT-101 + FIT-101 (Feedforward) + pHIT-301 & AIT-401 (Feedback Trim) → MCU-01 → P-201 Command
                  </div>
                  <div className="text-[11px] text-[#94A3B8] mt-1">
                    Click any block to open technical specification below
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Layer: Primary Horizontal Gas Path */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#2DD4BF]">
                PRIMARY GAS TREATMENT TRAIN (LEFT → RIGHT CONTINUOUS FLOW)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                {gasPathIds.map((id, idx) => {
                  const node = ARCHITECTURE_NODES.find((n) => n.id === id)!;
                  const active = selectedNodeId === node.id;
                  return (
                    <div key={node.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`w-full h-full text-left p-4 rounded-md border transition-colors cursor-pointer flex flex-col justify-between ${
                          active
                            ? 'bg-[#101F31] border-[#2DD4BF]'
                            : 'bg-[#0B1726] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-[#2DD4BF]">{node.code}</span>
                            {idx < gasPathIds.length - 1 && (
                              <ArrowRight className="w-3.5 h-3.5 text-[#2DD4BF] hidden lg:block" />
                            )}
                          </div>
                          <div className="text-sm font-bold text-[#F8FAFC] mt-1.5">
                            {node.title}
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-[#94A3B8]">
                          {node.status}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Layer: Below the Scrubber — Reagent Dosing & Liquid Circulation Loop */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#A3E635]">
                LIQUID DOSING & SCRUBBER CIRCULATION SUBSYSTEM (BELOW SCRUBBER COLUMN)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {liquidPathIds.map((id, idx) => {
                  const node = ARCHITECTURE_NODES.find((n) => n.id === id)!;
                  const active = selectedNodeId === node.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`text-left p-4 rounded-md border transition-colors cursor-pointer flex flex-col justify-between ${
                        active
                          ? 'bg-[#101F31] border-[#A3E635]'
                          : 'bg-[#0B1726] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#A3E635]">{node.code}</span>
                          {idx < liquidPathIds.length - 1 ? (
                            <ArrowRight className="w-3.5 h-3.5 text-[#A3E635] hidden lg:block" />
                          ) : (
                            <span className="text-[10px] text-[#38BDF8]">→ TO TOP SPRAY</span>
                          )}
                        </div>
                        <div className="text-sm font-bold text-[#F8FAFC] mt-1">{node.title}</div>
                        <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">{node.role}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-[#94A3B8]">
                        {node.category} · {node.status}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ================= MODE 2: ENGINEERING P&ID SCHEMATIC VIEW ================= */
          <div className="bg-[#07111F] border border-slate-800 rounded-lg p-4 sm:p-6 space-y-5">
            {/* P&ID Header & Line Style Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="text-xs font-mono">
                <span className="text-[#F8FAFC] font-bold">
                  DWG NO: NTX-PID-001 · REV B (PROTOTYPE ARCHITECTURE)
                </span>
                <span className="text-slate-600"> · </span>
                <span className="text-[#94A3B8]">Click any P&ID block or instrument tag to inspect</span>
              </div>

              {/* Required Legend: GAS | LIQUID | CONTROL SIGNAL | FEEDBACK */}
              <div className="flex flex-wrap items-center gap-5 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-[#2DD4BF] inline-block" />
                  <span className="text-[#F8FAFC]">GAS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-[#38BDF8] inline-block" />
                  <span className="text-[#F8FAFC]">LIQUID</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 border-b-2 border-dashed border-[#A3E635] inline-block" />
                  <span className="text-[#F8FAFC]">CONTROL SIGNAL</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 border-b-2 border-dotted border-amber-400 inline-block" />
                  <span className="text-[#F8FAFC]">FEEDBACK</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Engineering P&ID Diagram */}
            <div className="overflow-x-auto">
              <svg
                viewBox="0 0 980 460"
                className="w-full min-w-[780px] h-auto select-none"
                role="img"
                aria-label="NEUTRIX Piping and Instrumentation Diagram (P&ID) showing gas lines, liquid lines, control signals, and feedback loops."
              >
                <defs>
                  <marker
                    id="pidGasArrow"
                    viewBox="0 0 10 10"
                    refX="7"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#2DD4BF" />
                  </marker>
                  <marker
                    id="pidLiqArrow"
                    viewBox="0 0 10 10"
                    refX="7"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#38BDF8" />
                  </marker>
                  <marker
                    id="pidCtrlArrow"
                    viewBox="0 0 10 10"
                    refX="7"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#A3E635" />
                  </marker>
                  <marker
                    id="pidFbArrow"
                    viewBox="0 0 10 10"
                    refX="7"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#FBBF24" />
                  </marker>
                </defs>

                {/* Grid Border */}
                <rect
                  x="10"
                  y="10"
                  width="960"
                  height="440"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="1.5"
                />

                {/* ================= GAS PROCESS LINES (SOLID TEAL) ================= */}
                {/* Gas Inlet -> Flow Meter -> Particulate Filter -> Scrubber Bottom */}
                <line
                  x1="100"
                  y1="230"
                  x2="165"
                  y2="230"
                  stroke="#2DD4BF"
                  strokeWidth="3"
                  markerEnd="url(#pidGasArrow)"
                />
                <line
                  x1="225"
                  y1="230"
                  x2="280"
                  y2="230"
                  stroke="#2DD4BF"
                  strokeWidth="3"
                  markerEnd="url(#pidGasArrow)"
                />
                <line
                  x1="370"
                  y1="230"
                  x2="450"
                  y2="230"
                  stroke="#2DD4BF"
                  strokeWidth="3"
                  markerEnd="url(#pidGasArrow)"
                />
                {/* Scrubber Top -> Outlet Sensor -> Exhaust */}
                <polyline
                  points="505,70 505,46 660,46"
                  fill="none"
                  stroke="#2DD4BF"
                  strokeWidth="3"
                  markerEnd="url(#pidGasArrow)"
                />
                <line
                  x1="745"
                  y1="46"
                  x2="865"
                  y2="46"
                  stroke="#2DD4BF"
                  strokeWidth="3"
                  markerEnd="url(#pidGasArrow)"
                />

                {/* ================= LIQUID PROCESS LINES (SOLID CYAN) ================= */}
                {/* Sump -> Circulation Pump -> Top Spray Distributor */}
                <line
                  x1="560"
                  y1="345"
                  x2="615"
                  y2="345"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  markerEnd="url(#pidLiqArrow)"
                />
                <polyline
                  points="640,320 640,128 560,128"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  markerEnd="url(#pidLiqArrow)"
                />
                {/* Reagent Tank -> Dosing Pump -> Scrubber Sump */}
                <polyline
                  points="795,355 725,355"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  markerEnd="url(#pidLiqArrow)"
                />
                <polyline
                  points="685,355 685,305 560,305"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  markerEnd="url(#pidLiqArrow)"
                />

                {/* ================= FEEDBACK LINES (DOTTED AMBER) ================= */}
                {/* FIT-101 / AIT-101 -> Controller */}
                <polyline
                  points="195,155 195,115 820,115 820,165"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="1.8"
                  strokeDasharray="2 4"
                  markerEnd="url(#pidFbArrow)"
                />
                {/* pH Sensor (pHIT-301) -> Controller */}
                <polyline
                  points="410,335 410,415 850,415 850,245"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="1.8"
                  strokeDasharray="2 4"
                  markerEnd="url(#pidFbArrow)"
                />
                {/* Outlet Sensor (AIT-401) -> Controller */}
                <polyline
                  points="702,75 702,190 805,190"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="1.8"
                  strokeDasharray="2 4"
                  markerEnd="url(#pidFbArrow)"
                />

                {/* ================= CONTROL SIGNAL LINES (DASHED LIME) ================= */}
                {/* Controller -> Dosing Pump P-201 */}
                <polyline
                  points="805,220 705,220 705,330"
                  fill="none"
                  stroke="#A3E635"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  markerEnd="url(#pidCtrlArrow)"
                />

                {/* ================= P&ID EQUIPMENT & INSTRUMENT SYMBOLS ================= */}
                {/* 1. Gas Inlet Block */}
                <g onClick={() => setSelectedNodeId('gas_inlet')} className="cursor-pointer">
                  <rect x="28" y="205" width="72" height="50" fill="#101F31" stroke="#2DD4BF" strokeWidth="1.5" />
                  <text x="64" y="227" textAnchor="middle" fill="#F8FAFC" fontSize="9.5" fontFamily="IBM Plex Mono" fontWeight="600">
                    GAS INLET
                  </text>
                  <text x="64" y="242" textAnchor="middle" fill="#94A3B8" fontSize="8.5" fontFamily="IBM Plex Mono">
                    BLOWER B-101
                  </text>
                </g>

                {/* 2. Flow Meter & Inlet Gas Analyzer (FIT-101 / AIT-101) */}
                <g onClick={() => setSelectedNodeId('inlet_sensor')} className="cursor-pointer">
                  <rect x="165" y="210" width="60" height="40" fill="#101F31" stroke="#2DD4BF" strokeWidth="1.5" />
                  <text x="195" y="233" textAnchor="middle" fill="#F8FAFC" fontSize="9" fontFamily="IBM Plex Mono">
                    FE-101
                  </text>
                  {/* ISA Instrument Circle above */}
                  <circle cx="195" cy="175" r="18" fill="#07111F" stroke="#FBBF24" strokeWidth="1.5" />
                  <line x1="177" y1="175" x2="213" y2="175" stroke="#FBBF24" strokeWidth="1" />
                  <text x="195" y="172" textAnchor="middle" fill="#F8FAFC" fontSize="8" fontFamily="IBM Plex Mono">
                    FIT/AIT
                  </text>
                  <text x="195" y="184" textAnchor="middle" fill="#FBBF24" fontSize="8" fontFamily="IBM Plex Mono">
                    101
                  </text>
                  <line x1="195" y1="193" x2="195" y2="210" stroke="#94A3B8" strokeWidth="1.2" />
                </g>

                {/* 3. Particulate Filter Vessel (F-201) */}
                <g onClick={() => setSelectedNodeId('particulate_stage')} className="cursor-pointer">
                  <rect x="280" y="185" width="90" height="90" fill="#101F31" stroke="#2DD4BF" strokeWidth="1.6" />
                  <line x1="325" y1="185" x2="325" y2="275" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="325" y="175" textAnchor="middle" fill="#F8FAFC" fontSize="9.5" fontFamily="IBM Plex Mono" fontWeight="600">
                    PARTICULATE FILTER
                  </text>
                  <text x="325" y="292" textAnchor="middle" fill="#94A3B8" fontSize="8.5" fontFamily="IBM Plex Mono">
                    MOD-201 + PM-201
                  </text>
                </g>

                {/* 4. Scrubber Column (C-301), Mist Eliminator (ME-302) & Sump (TK-301) */}
                <g onClick={() => setSelectedNodeId('alkaline_scrubber')} className="cursor-pointer">
                  <rect x="450" y="70" width="110" height="300" rx="6" fill="#101F31" stroke="#2DD4BF" strokeWidth="2" />
                  {/* Mist Eliminator Pad */}
                  <rect
                    x="456"
                    y="84"
                    width="98"
                    height="24"
                    fill="#07111F"
                    stroke="#38BDF8"
                    strokeWidth="1.2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNodeId('mist_eliminator');
                    }}
                  />
                  <text x="505" y="99" textAnchor="middle" fill="#38BDF8" fontSize="8.5" fontFamily="IBM Plex Mono">
                    MIST ELIMINATOR
                  </text>

                  {/* Spray Header */}
                  <line x1="468" y1="128" x2="560" y2="128" stroke="#38BDF8" strokeWidth="2.5" />

                  {/* Packed Bed Crossed Section (Standard P&ID representation for packed column) */}
                  <rect x="458" y="145" width="94" height="115" fill="#07111F" stroke="#64748B" strokeWidth="1.2" />
                  <line x1="458" y1="145" x2="552" y2="260" stroke="#475569" strokeWidth="1.2" />
                  <line x1="552" y1="145" x2="458" y2="260" stroke="#475569" strokeWidth="1.2" />
                  <text x="505" y="205" textAnchor="middle" fill="#F8FAFC" fontSize="9.5" fontFamily="IBM Plex Mono" fontWeight="600">
                    PACKED BED
                  </text>

                  {/* Sump Region */}
                  <rect
                    x="456"
                    y="290"
                    width="98"
                    height="74"
                    fill="#0D9488"
                    fillOpacity="0.3"
                    stroke="#38BDF8"
                    strokeWidth="1.2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNodeId('scrubber_sump');
                    }}
                  />
                  <text x="505" y="330" textAnchor="middle" fill="#F8FAFC" fontSize="9.5" fontFamily="IBM Plex Mono" fontWeight="600">
                    SUMP TK-301
                  </text>
                </g>

                {/* 5. pH Sensor (pHIT-301) connected to Sump */}
                <g onClick={() => setSelectedNodeId('scrubber_sump')} className="cursor-pointer">
                  <circle cx="410" cy="315" r="18" fill="#07111F" stroke="#FBBF24" strokeWidth="1.5" />
                  <line x1="392" y1="315" x2="428" y2="315" stroke="#FBBF24" strokeWidth="1" />
                  <text x="410" y="312" textAnchor="middle" fill="#F8FAFC" fontSize="8" fontFamily="IBM Plex Mono">
                    pHIT
                  </text>
                  <text x="410" y="324" textAnchor="middle" fill="#FBBF24" fontSize="8" fontFamily="IBM Plex Mono">
                    301
                  </text>
                  <line x1="428" y1="315" x2="456" y2="315" stroke="#38BDF8" strokeWidth="1.5" />
                </g>

                {/* 6. Circulation Pump (P-301) */}
                <g onClick={() => setSelectedNodeId('circulation_loop')} className="cursor-pointer">
                  <circle cx="640" cy="345" r="18" fill="#101F31" stroke="#38BDF8" strokeWidth="1.8" />
                  <polygon points="634,337 650,345 634,353" fill="#38BDF8" />
                  <text x="640" y="378" textAnchor="middle" fill="#38BDF8" fontSize="8.5" fontFamily="IBM Plex Mono">
                    CIRC P-301
                  </text>
                </g>

                {/* 7. Peristaltic Dosing Pump (P-201) */}
                <g onClick={() => setSelectedNodeId('metering_pump')} className="cursor-pointer">
                  <circle cx="705" cy="355" r="18" fill="#101F31" stroke="#A3E635" strokeWidth="1.8" />
                  <text x="705" y="358" textAnchor="middle" fill="#A3E635" fontSize="8.5" fontFamily="IBM Plex Mono" fontWeight="600">
                    P-201
                  </text>
                  <text x="705" y="388" textAnchor="middle" fill="#A3E635" fontSize="8.5" fontFamily="IBM Plex Mono">
                    DOSING PUMP
                  </text>
                </g>

                {/* 8. Reagent Tank (TK-201) + Load Cell (WT-201) */}
                <g onClick={() => setSelectedNodeId('reagent_tank')} className="cursor-pointer">
                  <rect x="795" y="305" width="84" height="75" fill="#101F31" stroke="#38BDF8" strokeWidth="1.6" />
                  <text x="837" y="338" textAnchor="middle" fill="#F8FAFC" fontSize="9.5" fontFamily="IBM Plex Mono" fontWeight="600">
                    REAGENT TANK
                  </text>
                  <text x="837" y="354" textAnchor="middle" fill="#38BDF8" fontSize="8.5" fontFamily="IBM Plex Mono">
                    TK-201 + WT-201
                  </text>
                </g>

                {/* 9. Outlet Gas Sensor (AIT-401) & Treated Gas */}
                <g onClick={() => setSelectedNodeId('outlet_sensor')} className="cursor-pointer">
                  <rect x="660" y="26" width="85" height="42" fill="#101F31" stroke="#2DD4BF" strokeWidth="1.6" />
                  <text x="702" y="45" textAnchor="middle" fill="#F8FAFC" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="600">
                    OUTLET SENSOR
                  </text>
                  <text x="702" y="59" textAnchor="middle" fill="#2DD4BF" fontSize="8" fontFamily="IBM Plex Mono">
                    AIT-401 / RH
                  </text>
                </g>

                <g onClick={() => setSelectedNodeId('treated_gas')} className="cursor-pointer">
                  <rect x="865" y="26" width="86" height="42" fill="#101F31" stroke="#2DD4BF" strokeWidth="1.6" />
                  <text x="908" y="45" textAnchor="middle" fill="#2DD4BF" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="600">
                    TREATED GAS
                  </text>
                  <text x="908" y="59" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="IBM Plex Mono">
                    TO LAB HOOD
                  </text>
                </g>

                {/* 10. Control System Block (MCU-01) */}
                <g onClick={() => setSelectedNodeId('controller_node')} className="cursor-pointer">
                  <rect x="805" y="165" width="135" height="80" rx="4" fill="#101F31" stroke="#A3E635" strokeWidth="1.8" />
                  <text x="872" y="190" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
                    CONTROL SYSTEM
                  </text>
                  <text x="872" y="206" textAnchor="middle" fill="#A3E635" fontSize="8.5" fontFamily="IBM Plex Mono">
                    ESP32-CLASS MCU-01
                  </text>
                  <text x="872" y="222" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="IBM Plex Mono">
                    ṁ = C×Q + pH Trim
                  </text>
                </g>
              </svg>
            </div>
          </div>
        )}

        {/* Selected Node Technical Information Panel */}
        <div className="bg-[#101F31] border border-slate-700 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono">
                <Info className="w-4 h-4 text-[#2DD4BF]" />
                <span className="text-[#2DD4BF] font-semibold">
                  TECHNICAL NODE SPECIFICATION · {selectedNode.code}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-[#A3E635]">{selectedNode.status}</span>
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC] font-display">
                {selectedNode.title}
              </h3>
            </div>

            <div className="text-xs font-mono text-[#94A3B8]">
              Subsystem Category: <span className="text-[#F8FAFC]">{selectedNode.category}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-5 text-sm">
            <div>
              <div className="text-xs font-mono text-[#94A3B8] mb-1">ENGINEERING ROLE</div>
              <p className="text-[#F8FAFC]/90 text-xs leading-relaxed">{selectedNode.role}</p>
            </div>

            <div>
              <div className="text-xs font-mono text-[#94A3B8] mb-1">PROCESS / SIGNAL INPUTS</div>
              <p className="text-[#2DD4BF] font-mono text-xs leading-relaxed">
                {selectedNode.inputs}
              </p>
              <div className="text-xs font-mono text-[#94A3B8] mt-3 mb-1">
                PROCESS / SIGNAL OUTPUTS
              </div>
              <p className="text-[#A3E635] font-mono text-xs leading-relaxed">
                {selectedNode.outputs}
              </p>
            </div>

            <div>
              <div className="text-xs font-mono text-[#94A3B8] mb-1">
                BENCH PROTOTYPE CANDIDATE
              </div>
              <p className="text-[#F8FAFC]/90 text-xs leading-relaxed">
                {selectedNode.prototypeImplementation}
              </p>
            </div>

            <div>
              <div className="text-xs font-mono text-[#94A3B8] mb-1">VALIDATION BOUNDARY</div>
              <p className="text-amber-300/90 text-xs leading-relaxed">
                {selectedNode.validationNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
