import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PollutantId,
  ModuleId,
  SystemHealthState,
  ExperimentalTestEntry,
  TelemetryPoint,
} from '../types/neutrix';
import { POLLUTANTS } from '../data/neutrixData';
import {
  runFullDosingCalculation,
  DosingCalculationResult,
  calculateRemovalEfficiency,
} from '../utils/calculations';

interface NeutrixContextType {
  // Modular Configurator State
  selectedPollutants: PollutantId[];
  selectedModules: ModuleId[];
  autoSyncModules: boolean;
  togglePollutant: (id: PollutantId) => void;
  toggleModule: (id: ModuleId) => void;
  setAutoSyncModules: (val: boolean) => void;
  applyPresetProfile: (pollutants: PollutantId[]) => void;

  // Dosing Simulator & Process Parameters
  inletConcentration: number; // ppmv
  outletConcentration: number; // ppmv
  gasFlow: number; // L/min
  pH: number;
  pHSetpoint: number;
  reagentConcentration: number; // mol/L
  stoichiometricRatio: number; // mol/mol
  pumpMaxFlow: number; // mL/min
  pumpCommand: number; // %
  reagentLevel: number; // % of tank remaining
  systemState: SystemHealthState;

  setInletConcentration: (val: number) => void;
  setOutletConcentration: (val: number) => void;
  setGasFlow: (val: number) => void;
  setPH: (val: number) => void;
  setPHSetpoint: (val: number) => void;
  setReagentConcentration: (val: number) => void;
  setStoichiometricRatio: (val: number) => void;
  setPumpMaxFlow: (val: number) => void;

  // Derived Real-time Engineering Calculations
  dosingCalc: DosingCalculationResult;

  // Live Deterministic Telemetry Simulation
  simulationRunning: boolean;
  setSimulationRunning: (running: boolean) => void;
  telemetryHistory: TelemetryPoint[];
  triggerSimulationScenario: (mode: 'nominal' | 'load_spike' | 'low_load' | 'ph_drop') => void;
  resetSimulation: () => void;

  // Experimental Data Entries (Validation Log)
  testResults: ExperimentalTestEntry[];
  addTestResult: (entry: Omit<ExperimentalTestEntry, 'id' | 'calculatedEfficiencyPct'>) => void;
  deleteTestResult: (id: string) => void;
  clearTestResults: () => void;
  exportTestResultsCsv: () => void;
}

const STORAGE_KEYS = {
  TEST_RESULTS: 'neutrix_experimental_tests_v1',
  SIM_PREFS: 'neutrix_sim_prefs_v1',
  MODULES: 'neutrix_selected_modules_v1',
};

function deriveRecommendedModules(pollutants: PollutantId[]): ModuleId[] {
  const set = new Set<ModuleId>();
  if (pollutants.includes('NOx') || pollutants.includes('VOCs') || pollutants.includes('Hg')) {
    set.add('conditioning');
  }
  if (pollutants.includes('PM')) {
    set.add('particulate');
  }
  if (
    pollutants.includes('SO2') ||
    pollutants.includes('HCl') ||
    pollutants.includes('HF') ||
    pollutants.includes('H2S')
  ) {
    set.add('alkaline_scrubber');
    set.add('mist_elimination');
  }
  if (pollutants.includes('NOx')) {
    set.add('selective_nox');
  }
  if (pollutants.includes('VOCs') || pollutants.includes('Hg')) {
    set.add('polishing_adsorption');
  }
  if (pollutants.length > 0) {
    set.add('outlet_verification');
  }

  const order: ModuleId[] = [
    'conditioning',
    'particulate',
    'selective_nox',
    'alkaline_scrubber',
    'mist_elimination',
    'polishing_adsorption',
    'outlet_verification',
  ];
  return order.filter((m) => set.has(m));
}

function generateInitialTelemetry(): TelemetryPoint[] {
  const initial: TelemetryPoint[] = [];
  let cumReagent = 12.4;
  for (let i = 0; i < 20; i++) {
    const tick = i + 1;
    const inlet = Math.round(280 + 45 * Math.sin(i * 0.4));
    const flow = Number((18.0 + 1.2 * Math.cos(i * 0.3)).toFixed(1));
    const phVal = Number((7.8 + 0.12 * Math.sin(i * 0.5)).toFixed(2));
    const calc = runFullDosingCalculation({
      inletConcentrationPpm: inlet,
      gasFlowLpm: flow,
      pollutantMolarMassGPerMol: 64.066,
      reagentConcentrationMolPerL: 0.25,
      stoichiometricRatio: 2.0,
      currentPh: phVal,
      phSetpoint: 7.8,
      pumpMaxFlowMlMin: 15.0,
      designMaxConcentrationPpm: 800,
    });
    const simOutlet = Math.max(8, Math.round(inlet * (1 - 0.925)));
    cumReagent = Number((cumReagent + calc.adaptiveTotalDoseMlMin * 0.05).toFixed(2));
    initial.push({
      tick,
      timeLabel: `T-${(20 - i) * 3}s`,
      inletPpm: inlet,
      outletPpm: simOutlet,
      pH: phVal,
      gasFlowLpm: flow,
      dosingCommandPct: Number(calc.pumpCommandPct.toFixed(1)),
      fixedDosingPct: Number(((calc.fixedWorstCaseDoseMlMin / 15.0) * 100).toFixed(1)),
      reagentRateMlMin: Number(calc.adaptiveTotalDoseMlMin.toFixed(2)),
      cumulativeReagentMl: cumReagent,
    });
  }
  return initial;
}

const NeutrixContext = createContext<NeutrixContextType | undefined>(undefined);

export const NeutrixProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Pollutant & Module selection
  const [selectedPollutants, setSelectedPollutants] = useState<PollutantId[]>(['PM', 'SO2', 'HCl']);
  const [selectedModules, setSelectedModules] = useState<ModuleId[]>([
    'particulate',
    'alkaline_scrubber',
    'mist_elimination',
    'outlet_verification',
  ]);
  const [autoSyncModules, setAutoSyncModules] = useState<boolean>(true);

  // 2. Process & Dosing Simulator parameters
  const [inletConcentration, setInletConcentration] = useState<number>(320);
  const [outletConcentration, setOutletConcentration] = useState<number>(24);
  const [gasFlow, setGasFlow] = useState<number>(18.0);
  const [pH, setPH] = useState<number>(7.75);
  const [pHSetpoint, setPHSetpoint] = useState<number>(7.8);
  const [reagentConcentration, setReagentConcentration] = useState<number>(0.25);
  const [stoichiometricRatio, setStoichiometricRatio] = useState<number>(2.0);
  const [pumpMaxFlow, setPumpMaxFlow] = useState<number>(15.0);
  const [reagentLevel, setReagentLevel] = useState<number>(84.5);

  // 3. Simulation Engine State
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(generateInitialTelemetry);

  // 4. Experimental Test Results (stored in localStorage; initially empty so no fake verified data is claimed)
  const [testResults, setTestResults] = useState<ExperimentalTestEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage error
    }
    return [];
  });

  // Load saved simulator preferences if available
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem(STORAGE_KEYS.SIM_PREFS);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        if (typeof parsed.inletConcentration === 'number') setInletConcentration(parsed.inletConcentration);
        if (typeof parsed.gasFlow === 'number') setGasFlow(parsed.gasFlow);
        if (typeof parsed.pHSetpoint === 'number') setPHSetpoint(parsed.pHSetpoint);
        if (typeof parsed.reagentConcentration === 'number') setReagentConcentration(parsed.reagentConcentration);
        if (typeof parsed.stoichiometricRatio === 'number') setStoichiometricRatio(parsed.stoichiometricRatio);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist simulator preferences
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.SIM_PREFS,
        JSON.stringify({
          inletConcentration,
          gasFlow,
          pHSetpoint,
          reagentConcentration,
          stoichiometricRatio,
        })
      );
    } catch {
      // ignore
    }
  }, [inletConcentration, gasFlow, pHSetpoint, reagentConcentration, stoichiometricRatio]);

  // Persist testResults
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(testResults));
    } catch {
      // ignore
    }
  }, [testResults]);

  // Sync modules when pollutants change if autoSyncModules is true
  const togglePollutant = useCallback(
    (id: PollutantId) => {
      setSelectedPollutants((prev) => {
        const exists = prev.includes(id);
        const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
        if (autoSyncModules) {
          setSelectedModules(deriveRecommendedModules(next));
        }
        return next;
      });
    },
    [autoSyncModules]
  );

  const applyPresetProfile = useCallback((pollutants: PollutantId[]) => {
    setSelectedPollutants(pollutants);
    setSelectedModules(deriveRecommendedModules(pollutants));
    setAutoSyncModules(true);
  }, []);

  const toggleModule = useCallback((id: ModuleId) => {
    setAutoSyncModules(false);
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }, []);

  // Representative molar mass from primary acid gas or default SO2 (64.066 g/mol)
  const activePollutantSpec =
    POLLUTANTS.find((p) => selectedPollutants.includes(p.id) && p.defaultStoichRatio > 0) ||
    POLLUTANTS[0];

  const dosingCalc = runFullDosingCalculation({
    inletConcentrationPpm: inletConcentration,
    gasFlowLpm: gasFlow,
    pollutantMolarMassGPerMol: activePollutantSpec.molarMassGPerMol,
    reagentConcentrationMolPerL: reagentConcentration,
    stoichiometricRatio,
    currentPh: pH,
    phSetpoint: pHSetpoint,
    pumpMaxFlowMlMin: pumpMaxFlow,
    designMaxConcentrationPpm: 800,
  });

  const pumpCommand = Number(dosingCalc.pumpCommandPct.toFixed(1));

  // Derive System Health State (NORMAL / WATCH / WARNING / CRITICAL)
  let systemState: SystemHealthState = 'NORMAL';
  const phDeviation = Math.abs(pH - pHSetpoint);
  const simRemovalPct = calculateRemovalEfficiency(inletConcentration, outletConcentration);

  if (pH < 6.0 || pH > 10.5 || reagentLevel < 10 || dosingCalc.pumpSaturated) {
    systemState = 'CRITICAL';
  } else if (phDeviation > 0.65 || simRemovalPct < 85 || reagentLevel < 22) {
    systemState = 'WARNING';
  } else if (phDeviation > 0.3 || pumpCommand > 75 || simRemovalPct < 90) {
    systemState = 'WATCH';
  }

  // Live Deterministic Simulation Loop
  useEffect(() => {
    if (!simulationRunning) return;

    const interval = setInterval(() => {
      setTelemetryHistory((prev) => {
        const last = prev[prev.length - 1] || {
          tick: 0,
          cumulativeReagentMl: 15.0,
        };
        const nextTick = last.tick + 1;

        // Deterministic multi-harmonic load wave around current inletConcentration
        const wave = Math.sin(nextTick * 0.35) * 35 + Math.cos(nextTick * 0.18) * 20;
        const nextInlet = Math.max(60, Math.min(850, Math.round(inletConcentration + wave)));
        const nextFlow = Number(
          Math.max(5, Math.min(35, gasFlow + Math.sin(nextTick * 0.25) * 0.8)).toFixed(1)
        );

        // Simulate closed-loop pH convergence toward pHSetpoint
        const phDriftTowardsSetpoint = pH + (pHSetpoint - pH) * 0.32 - (nextInlet - 300) * 0.00025;
        const nextPh = Number(Math.max(5.2, Math.min(11.0, phDriftTowardsSetpoint)).toFixed(2));

        const stepCalc = runFullDosingCalculation({
          inletConcentrationPpm: nextInlet,
          gasFlowLpm: nextFlow,
          pollutantMolarMassGPerMol: activePollutantSpec.molarMassGPerMol,
          reagentConcentrationMolPerL: reagentConcentration,
          stoichiometricRatio,
          currentPh: nextPh,
          phSetpoint: pHSetpoint,
          pumpMaxFlowMlMin: pumpMaxFlow,
          designMaxConcentrationPpm: 800,
        });

        // Simulated scrubber capture effectiveness depends on pH adequacy and liquid dosing
        const phFactor = nextPh >= 7.0 ? 0.93 : nextPh >= 6.3 ? 0.84 : 0.68;
        const nextOutlet = Math.max(5, Math.round(nextInlet * (1 - phFactor)));
        const nextCumReagent = Number(
          (last.cumulativeReagentMl + stepCalc.adaptiveTotalDoseMlMin * (1.2 / 60)).toFixed(2)
        );

        setInletConcentration(nextInlet);
        setOutletConcentration(nextOutlet);
        setGasFlow(nextFlow);
        setPH(nextPh);
        setReagentLevel((lvl) => Number(Math.max(5, lvl - stepCalc.adaptiveTotalDoseMlMin * 0.008).toFixed(2)));

        const point: TelemetryPoint = {
          tick: nextTick,
          timeLabel: `T+${nextTick * 2}s`,
          inletPpm: nextInlet,
          outletPpm: nextOutlet,
          pH: nextPh,
          gasFlowLpm: nextFlow,
          dosingCommandPct: Number(stepCalc.pumpCommandPct.toFixed(1)),
          fixedDosingPct: Number(((stepCalc.fixedWorstCaseDoseMlMin / pumpMaxFlow) * 100).toFixed(1)),
          reagentRateMlMin: Number(stepCalc.adaptiveTotalDoseMlMin.toFixed(2)),
          cumulativeReagentMl: nextCumReagent,
        };

        return [...prev.slice(-23), point];
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [
    simulationRunning,
    inletConcentration,
    gasFlow,
    pH,
    pHSetpoint,
    reagentConcentration,
    stoichiometricRatio,
    pumpMaxFlow,
    activePollutantSpec.molarMassGPerMol,
  ]);

  const triggerSimulationScenario = useCallback(
    (mode: 'nominal' | 'load_spike' | 'low_load' | 'ph_drop') => {
      if (mode === 'nominal') {
        setInletConcentration(300);
        setOutletConcentration(22);
        setGasFlow(18.0);
        setPH(7.8);
        setPHSetpoint(7.8);
      } else if (mode === 'load_spike') {
        setInletConcentration(680);
        setOutletConcentration(58);
        setGasFlow(24.0);
        setPH(7.15);
      } else if (mode === 'low_load') {
        setInletConcentration(95);
        setOutletConcentration(7);
        setGasFlow(12.0);
        setPH(7.95);
      } else if (mode === 'ph_drop') {
        setInletConcentration(460);
        setOutletConcentration(62);
        setPH(6.35);
      }
    },
    []
  );

  const resetSimulation = useCallback(() => {
    setSimulationRunning(false);
    setInletConcentration(320);
    setOutletConcentration(24);
    setGasFlow(18.0);
    setPH(7.75);
    setPHSetpoint(7.8);
    setReagentConcentration(0.25);
    setStoichiometricRatio(2.0);
    setPumpMaxFlow(15.0);
    setReagentLevel(84.5);
    setTelemetryHistory(generateInitialTelemetry());
  }, []);

  const addTestResult = useCallback(
    (entry: Omit<ExperimentalTestEntry, 'id' | 'calculatedEfficiencyPct'>) => {
      const calculatedEfficiencyPct = Number(
        calculateRemovalEfficiency(entry.inletConcentrationPpm, entry.outletConcentrationPpm).toFixed(2)
      );
      const newEntry: ExperimentalTestEntry = {
        ...entry,
        id: `test-${Date.now()}`,
        calculatedEfficiencyPct,
      };
      setTestResults((prev) => [newEntry, ...prev]);
    },
    []
  );

  const deleteTestResult = useCallback((id: string) => {
    setTestResults((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearTestResults = useCallback(() => {
    setTestResults([]);
  }, []);

  const exportTestResultsCsv = useCallback(() => {
    const headers = [
      'Test ID',
      'Date',
      'Surrogate Gas',
      'Inlet Concentration (ppm)',
      'Outlet Concentration (ppm)',
      'Gas Flow (L/min)',
      'pH',
      'Reagent Dose (mL/min)',
      'Pump Command (%)',
      'Calculated Removal Efficiency (%)',
      'Reference Measurement (ppm)',
      'Sensor Measurement (ppm)',
      'Notes',
    ];
    const rows = testResults.map((r) => [
      r.testId,
      r.date,
      `"${(r.surrogateUsed || '').replace(/"/g, '""')}"`,
      r.inletConcentrationPpm,
      r.outletConcentrationPpm,
      r.gasFlowLpm,
      r.pH,
      r.reagentDoseMlMin,
      r.pumpCommandPct,
      r.calculatedEfficiencyPct,
      r.referenceMeasurementPpm,
      r.sensorMeasurementPpm,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `neutrix_validation_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [testResults]);

  return (
    <NeutrixContext.Provider
      value={{
        selectedPollutants,
        selectedModules,
        autoSyncModules,
        togglePollutant,
        toggleModule,
        setAutoSyncModules,
        applyPresetProfile,
        inletConcentration,
        outletConcentration,
        gasFlow,
        pH,
        pHSetpoint,
        reagentConcentration,
        stoichiometricRatio,
        pumpMaxFlow,
        pumpCommand,
        reagentLevel,
        systemState,
        setInletConcentration,
        setOutletConcentration,
        setGasFlow,
        setPH,
        setPHSetpoint,
        setReagentConcentration,
        setStoichiometricRatio,
        setPumpMaxFlow,
        dosingCalc,
        simulationRunning,
        setSimulationRunning,
        telemetryHistory,
        triggerSimulationScenario,
        resetSimulation,
        testResults,
        addTestResult,
        deleteTestResult,
        clearTestResults,
        exportTestResultsCsv,
      }}
    >
      {children}
    </NeutrixContext.Provider>
  );
};

export function useNeutrix() {
  const ctx = useContext(NeutrixContext);
  if (!ctx) {
    throw new Error('useNeutrix must be used within a NeutrixProvider');
  }
  return ctx;
}
