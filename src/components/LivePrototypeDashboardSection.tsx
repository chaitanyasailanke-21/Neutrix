import React from 'react';
import { useNeutrix } from '../context/NeutrixContext';
import { Play, Pause, Activity, RotateCcw, Zap } from 'lucide-react';

interface MiniTelemetryChartProps {
  title: string;
  unit: string;
  color: string;
  values: number[];
  labels: string[];
  minBound?: number;
  maxBound?: number;
}

const MiniTelemetryChart: React.FC<MiniTelemetryChartProps> = ({
  title,
  unit,
  color,
  values,
  labels,
  minBound,
  maxBound,
}) => {
  const safeVals = values.length > 0 ? values : [0];
  const minVal = minBound !== undefined ? minBound : Math.min(...safeVals) * 0.9;
  const maxVal = maxBound !== undefined ? maxBound : Math.max(minVal + 1, Math.max(...safeVals) * 1.1);
  const latest = safeVals[safeVals.length - 1];

  const points = safeVals
    .map((v, idx) => {
      const x = 36 + (idx / Math.max(1, safeVals.length - 1)) * 290;
      const ratio = (v - minVal) / Math.max(0.001, maxVal - minVal);
      const y = 104 - Math.max(0, Math.min(1, ratio)) * 80;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-[#0B1726] border border-slate-800 rounded-md p-4 space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-[#94A3B8]">{title}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold text-[#F8FAFC] tabular-nums">
            {latest.toFixed(unit === 'pH' || unit === 'mL' ? 2 : 1)}
          </span>
          <span className="text-[11px] text-[#94A3B8]">{unit}</span>
        </div>
      </div>

      <svg
        viewBox="0 0 340 122"
        className="w-full h-auto select-none"
        role="img"
        aria-label={`Simulated time-series chart for ${title} in ${unit}`}
      >
        {[0, 0.5, 1].map((frac, idx) => {
          const y = 24 + frac * 80;
          const labelVal = (maxVal - frac * (maxVal - minVal)).toFixed(
            unit === 'pH' ? 1 : 0
          );
          return (
            <g key={idx}>
              <line x1="34" y1={y} x2="328" y2={y} stroke="#1E293B" strokeWidth="1" />
              <text
                x="30"
                y={y + 3}
                textAnchor="end"
                fill="#64748B"
                fontSize="8.5"
                fontFamily="IBM Plex Mono"
              >
                {labelVal}
              </text>
            </g>
          );
        })}

        <polyline fill="none" stroke={color} strokeWidth="2" points={points} />

        {/* Latest point dot */}
        {safeVals.length > 0 && (() => {
          const ratio = (latest - minVal) / Math.max(0.001, maxVal - minVal);
          const cy = 104 - Math.max(0, Math.min(1, ratio)) * 80;
          return <circle cx="326" cy={cy} r="3.5" fill={color} />;
        })()}

        <text x="36" y="117" fill="#64748B" fontSize="8" fontFamily="IBM Plex Mono">
          {labels[0] || 'T-60s'}
        </text>
        <text
          x="326"
          y="117"
          textAnchor="end"
          fill="#94A3B8"
          fontSize="8"
          fontFamily="IBM Plex Mono"
        >
          {labels[labels.length - 1] || 'NOW'}
        </text>
      </svg>
    </div>
  );
};

export const LivePrototypeDashboardSection: React.FC = () => {
  const {
    inletConcentration,
    outletConcentration,
    gasFlow,
    pH,
    pHSetpoint,
    pumpCommand,
    reagentLevel,
    systemState,
    simulationRunning,
    setSimulationRunning,
    telemetryHistory,
    triggerSimulationScenario,
    resetSimulation,
  } = useNeutrix();

  const timeLabels = telemetryHistory.map((t) => t.timeLabel);

  const getSystemStateDisplay = () => {
    switch (systemState) {
      case 'NORMAL':
        return {
          symbol: '●',
          text: 'NORMAL',
          colorClass: 'text-[#A3E635]',
          desc: 'All simulated loops within nominal operating band',
        };
      case 'WATCH':
        return {
          symbol: '◆',
          text: 'WATCH',
          colorClass: 'text-[#2DD4BF]',
          desc: 'Elevated dosing load or minor pH trim active',
        };
      case 'WARNING':
        return {
          symbol: '▲',
          text: 'WARNING',
          colorClass: 'text-amber-400',
          desc: 'Significant pH deviation or high inlet load spike',
        };
      case 'CRITICAL':
        return {
          symbol: '✖',
          text: 'CRITICAL',
          colorClass: 'text-rose-400',
          desc: 'Pump saturation, low reagent, or out-of-bounds pH',
        };
    }
  };

  const stateBadge = getSystemStateDisplay();

  return (
    <section className="border-b border-slate-800/80 bg-[#07111F] py-16 lg:py-24">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 space-y-10">
        {/* Header with Mandatory SIMULATED DATA Labels & Run Button */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-amber-400 font-bold">▲ SIMULATED DATA</span>
              <span className="text-slate-600">·</span>
              <span className="text-[#2DD4BF]">
                10. SENSOR & CONTROL TELEMETRY DASHBOARD
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] font-display">
              Live / Simulated Prototype Control Console
            </h2>
            <p className="text-sm text-[#94A3B8]">
              Simulation mode — values are illustrative. Click “Run Simulation” to observe
              deterministic closed-loop feedforward + feedback dynamics across all six process
              channels, or inject a process disturbance.
            </p>
          </div>

          {/* Primary Simulation Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSimulationRunning(!simulationRunning)}
              className={`px-4 py-2.5 text-xs font-mono font-bold rounded-md flex items-center gap-2 transition-colors cursor-pointer ${
                simulationRunning
                  ? 'bg-amber-400 text-[#07111F] hover:bg-amber-300'
                  : 'bg-[#2DD4BF] text-[#07111F] hover:bg-[#5EEAD4]'
              }`}
            >
              {simulationRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Simulation</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Simulation</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => triggerSimulationScenario('load_spike')}
              className="px-3 py-2.5 text-xs font-mono text-[#F8FAFC] bg-[#101F31] hover:bg-slate-800 border border-slate-700 rounded-md flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Inject Load Spike</span>
            </button>

            <button
              type="button"
              onClick={() => triggerSimulationScenario('low_load')}
              className="px-3 py-2.5 text-xs font-mono text-[#F8FAFC] bg-[#101F31] hover:bg-slate-800 border border-slate-700 rounded-md cursor-pointer"
            >
              Simulate Low Load
            </button>

            <button
              type="button"
              onClick={resetSimulation}
              aria-label="Reset simulation"
              className="p-2.5 text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0B1726] border border-slate-800 rounded-md cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Simulation Mode Banner */}
        <div className="px-4 py-2.5 bg-[#101F31] border border-slate-700 rounded-md flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#2DD4BF]" />
            <span className="text-[#F8FAFC] font-semibold">
              TELEMETRY STATUS: {simulationRunning ? 'STREAMING SYNTHETIC LOOP' : 'STATIC SNAPSHOT'}
            </span>
          </div>
          <span className="text-amber-300">
            SIMULATED DATA · Simulation mode — values are illustrative and not real experimental measurements.
          </span>
        </div>

        {/* 7 Required Dashboard Sensor & Control Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* 1. INLET GAS */}
          <div className="bg-[#101F31] border border-slate-800 rounded-md p-4">
            <div className="text-[11px] font-mono text-[#94A3B8]">INLET GAS</div>
            <div className="mt-1.5 flex items-baseline">
              <span className="text-2xl font-mono font-bold text-[#F8FAFC] tabular-nums">
                {inletConcentration}
              </span>
              <span className="text-xs font-mono text-[#94A3B8] ml-1">ppm</span>
            </div>
            <div className="text-[10px] font-mono text-[#2DD4BF] mt-1">AIT-101 (Sim)</div>
          </div>

          {/* 2. OUTLET GAS */}
          <div className="bg-[#101F31] border border-slate-800 rounded-md p-4">
            <div className="text-[11px] font-mono text-[#94A3B8]">OUTLET GAS</div>
            <div className="mt-1.5 flex items-baseline">
              <span className="text-2xl font-mono font-bold text-[#2DD4BF] tabular-nums">
                {outletConcentration}
              </span>
              <span className="text-xs font-mono text-[#94A3B8] ml-1">ppm</span>
            </div>
            <div className="text-[10px] font-mono text-[#94A3B8] mt-1">AIT-401 (Sim)</div>
          </div>

          {/* 3. GAS FLOW */}
          <div className="bg-[#101F31] border border-slate-800 rounded-md p-4">
            <div className="text-[11px] font-mono text-[#94A3B8]">GAS FLOW</div>
            <div className="mt-1.5 flex items-baseline">
              <span className="text-2xl font-mono font-bold text-[#F8FAFC] tabular-nums">
                {gasFlow.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-[#94A3B8] ml-1">L/min</span>
            </div>
            <div className="text-[10px] font-mono text-[#94A3B8] mt-1">FIT-101 (Sim)</div>
          </div>

          {/* 4. pH */}
          <div className="bg-[#101F31] border border-slate-800 rounded-md p-4">
            <div className="text-[11px] font-mono text-[#94A3B8]">SUMP pH</div>
            <div className="mt-1.5 flex items-baseline">
              <span className="text-2xl font-mono font-bold text-[#A3E635] tabular-nums">
                {pH.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-[#94A3B8] ml-1">pH</span>
            </div>
            <div className="text-[10px] font-mono text-[#94A3B8] mt-1">
              Setpoint: {pHSetpoint.toFixed(1)}
            </div>
          </div>

          {/* 5. REAGENT LEVEL */}
          <div className="bg-[#101F31] border border-slate-800 rounded-md p-4">
            <div className="text-[11px] font-mono text-[#94A3B8]">REAGENT LEVEL</div>
            <div className="mt-1.5 flex items-baseline">
              <span className="text-2xl font-mono font-bold text-[#F8FAFC] tabular-nums">
                {reagentLevel.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-[#94A3B8] ml-1">%</span>
            </div>
            <div className="text-[10px] font-mono text-[#94A3B8] mt-1">WT-201 Load Cell</div>
          </div>

          {/* 6. PUMP COMMAND */}
          <div className="bg-[#101F31] border border-slate-800 rounded-md p-4">
            <div className="text-[11px] font-mono text-[#94A3B8]">PUMP COMMAND</div>
            <div className="mt-1.5 flex items-baseline">
              <span className="text-2xl font-mono font-bold text-[#2DD4BF] tabular-nums">
                {pumpCommand.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-[#94A3B8] ml-1">%</span>
            </div>
            <div className="text-[10px] font-mono text-[#A3E635] mt-1">P-201 Peristaltic</div>
          </div>

          {/* 7. SYSTEM STATE */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 bg-[#101F31] border border-slate-700 rounded-md p-4 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-[#94A3B8]">SYSTEM STATE</div>
            <div className={`mt-1.5 text-lg font-mono font-bold ${stateBadge.colorClass}`}>
              {stateBadge.symbol} {stateBadge.text}
            </div>
            <div className="text-[10px] text-[#94A3B8] mt-1 leading-tight">{stateBadge.desc}</div>
          </div>
        </div>

        {/* 6 Live Time-Series Telemetry Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MiniTelemetryChart
            title="1. INLET CONCENTRATION (SIM)"
            unit="ppm"
            color="#F8FAFC"
            values={telemetryHistory.map((t) => t.inletPpm)}
            labels={timeLabels}
            minBound={0}
            maxBound={800}
          />

          <MiniTelemetryChart
            title="2. OUTLET CONCENTRATION (SIM)"
            unit="ppm"
            color="#2DD4BF"
            values={telemetryHistory.map((t) => t.outletPpm)}
            labels={timeLabels}
            minBound={0}
            maxBound={120}
          />

          <MiniTelemetryChart
            title="3. SUMP pH TRAJECTORY (SIM)"
            unit="pH"
            color="#A3E635"
            values={telemetryHistory.map((t) => t.pH)}
            labels={timeLabels}
            minBound={5.5}
            maxBound={9.5}
          />

          <MiniTelemetryChart
            title="4. GAS VOLUMETRIC FLOW (SIM)"
            unit="L/min"
            color="#38BDF8"
            values={telemetryHistory.map((t) => t.gasFlowLpm)}
            labels={timeLabels}
            minBound={0}
            maxBound={40}
          />

          <MiniTelemetryChart
            title="5. DOSING PUMP COMMAND (SIM)"
            unit="%"
            color="#A3E635"
            values={telemetryHistory.map((t) => t.dosingCommandPct)}
            labels={timeLabels}
            minBound={0}
            maxBound={100}
          />

          <MiniTelemetryChart
            title="6. CUMULATIVE REAGENT USE (SIM)"
            unit="mL"
            color="#2DD4BF"
            values={telemetryHistory.map((t) => t.cumulativeReagentMl)}
            labels={timeLabels}
          />
        </div>
      </div>
    </section>
  );
};
