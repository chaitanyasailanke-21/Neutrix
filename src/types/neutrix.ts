export type PollutantId = 'PM' | 'SO2' | 'HCl' | 'HF' | 'NOx' | 'H2S' | 'VOCs' | 'Hg';

export type ModuleId =
  | 'conditioning'
  | 'particulate'
  | 'alkaline_scrubber'
  | 'selective_nox'
  | 'mist_elimination'
  | 'polishing_adsorption'
  | 'outlet_verification';

export type ValidationScopeStatus =
  | 'PROTOTYPE STAGE'
  | 'ARCHITECTURE / SURROGATE VALIDATION'
  | 'ARCHITECTURE'
  | 'DOCUMENTED ONLY'
  | 'TO BE VALIDATED'
  | 'TARGET'
  | 'PROPOSED'
  | 'OUT OF SCOPE';

export type SystemHealthState = 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';

export type LoadRegime = 'LOW LOAD' | 'NORMAL LOAD' | 'HIGH LOAD';

export interface PollutantSpec {
  id: PollutantId;
  symbol: string;
  name: string;
  category: string;
  exampleSource: string;
  treatmentMechanism: string;
  neutrixModuleName: string;
  mappedModules: ModuleId[];
  prototypeIncluded: boolean;
  prototypeStatusLabel: string;
  molarMassGPerMol: number; // Used for stoichiometric mass-flow calculations (or representative surrogate)
  defaultStoichRatio: number; // mol NaOH (or equivalent reagent) per mol pollutant
  notes: string;
  particleColor: string;
}

export interface TreatmentModuleSpec {
  id: ModuleId;
  stepNumber: string;
  name: string;
  shortName: string;
  mechanism: string;
  targetPollutants: PollutantId[];
  demonstratedInPrototype: boolean;
  statusTag: 'PROTOTYPE DEMONSTRATION' | 'ARCHITECTURE / NOT CURRENTLY DEMONSTRATED';
  description: string;
  processInputs: string[];
  processOutputs: string[];
  keyInstrumentation: string[];
  engineeringBoundaryNote: string;
}

export interface ArchitectureNodeSpec {
  id: string;
  code: string;
  title: string;
  category: 'GAS PATH' | 'LIQUID LOOP' | 'SENSORS' | 'CONTROL';
  status: string;
  role: string;
  inputs: string;
  outputs: string;
  prototypeImplementation: string;
  validationNote: string;
}

export interface BenchComponentSpec {
  number: number;
  id: string;
  name: string;
  subsystem: 'GAS PATH' | 'CONTROL' | 'LIQUID LOOP' | 'SENSORS' | 'DOSING' | 'SAFETY' | 'DATA';
  status: 'Prototype candidate' | 'Architecture';
  functionDescription: string;
  physicalConnection: string;
  coords: { x: number; y: number }; // Percentage or SVG coords for interactive callouts
}

export interface ValidationCriterion {
  id: number;
  title: string;
  metricOrCondition: string;
  verificationMethod: string;
  targetCriterion: string;
  status: 'NOT YET VALIDATED';
}

export interface ExperimentalTestEntry {
  id: string;
  testId: string;
  date: string;
  surrogateUsed: string;
  inletConcentrationPpm: number;
  outletConcentrationPpm: number;
  gasFlowLpm: number;
  pH: number;
  reagentDoseMlMin: number;
  pumpCommandPct: number;
  calculatedEfficiencyPct: number;
  referenceMeasurementPpm: number;
  sensorMeasurementPpm: number;
  notes: string;
}

export interface EngineeringRiskItem {
  id: string;
  risk: string;
  category: 'Safety' | 'Process' | 'Sensing' | 'Control' | 'Scale-Up' | 'Project';
  whyItMatters: string;
  mitigation: string;
  status: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface DfmeaItem {
  id: string;
  component: string;
  failureMode: string;
  effect: string;
  cause: string;
  detection: string;
  mitigation: string;
  status: string;
}

export interface RoadmapStage {
  stage: string;
  code: string;
  title: string;
  targetDate: string;
  status: 'IN PROGRESS' | 'PLANNED' | 'UPCOMING';
  deliverables: string[];
  engineeringFocus: string;
}

export interface TelemetryPoint {
  tick: number;
  timeLabel: string;
  inletPpm: number;
  outletPpm: number;
  pH: number;
  gasFlowLpm: number;
  dosingCommandPct: number;
  fixedDosingPct: number;
  reagentRateMlMin: number;
  cumulativeReagentMl: number;
}
