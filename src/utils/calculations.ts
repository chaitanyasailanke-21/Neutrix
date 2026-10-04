import { LoadRegime } from '../types/neutrix';

/**
 * NEUTRIX Engineering Calculation Engine
 *
 * All calculations are dimensionally consistent and explicitly expose intermediate SI/metric units.
 * NOTE: These functions provide theoretical stoichiometric and mass-balance estimates for
 * prototype sizing and educational simulation. Experimental validation is required.
 */

export interface DosingCalculationInput {
  inletConcentrationPpm: number; // ppmv (parts per million by volume in gas)
  gasFlowLpm: number; // Volumetric gas flow rate in L/min (at standard bench conditions ~25 °C, 1 atm)
  pollutantMolarMassGPerMol: number; // g/mol (e.g., 64.066 for SO2, or 44.01 for CO2 surrogate)
  reagentConcentrationMolPerL: number; // Molarity of alkaline reagent (mol/L, e.g., 0.10 to 1.0 M NaOH)
  reagentMolarMassGPerMol?: number; // Default 40.00 g/mol (NaOH)
  stoichiometricRatio: number; // mol reagent per mol pollutant (e.g., 2.0)
  currentPh: number; // Current measured sump pH
  phSetpoint: number; // Target sump pH setpoint
  pumpMaxFlowMlMin: number; // Maximum peristaltic pump flow rate (mL/min)
  designMaxConcentrationPpm?: number; // Worst-case design concentration for Fixed Dosing comparison
}

export interface DosingCalculationResult {
  // Gas & Pollutant Mass Flow
  gasMolarFlowMmolMin: number; // mmol/min of total gas
  pollutantMolarFlowMmolMin: number; // mmol/min of pollutant entering
  pollutantMassFlowMgMin: number; // mg/min of pollutant entering
  pollutantMassConcentrationMgM3: number; // mg/m³ equivalent at 25 °C, 1 atm

  // Stoichiometric Reagent Demand (Feedforward)
  theoreticalReagentMmolMin: number; // mmol/min of reagent required stoichiometrically
  theoreticalReagentMassMgMin: number; // mg/min of pure reagent required
  feedforwardDoseMlMin: number; // mL/min of liquid reagent solution from feedforward alone

  // Feedback Trim (from pH error)
  phError: number; // phSetpoint - currentPh (positive when acidic / below setpoint)
  feedbackTrimMlMin: number; // mL/min adjustment from pH controller
  adaptiveTotalDoseMlMin: number; // Clamped total dosing rate (mL/min)

  // Fixed Dosing Comparison (sized for worst-case load)
  fixedWorstCaseDoseMlMin: number; // mL/min if fixed at design worst-case

  // Pump Actuation & State
  pumpCommandPct: number; // 0 to 100 %
  pumpSaturated: boolean; // True if adaptive dose exceeds pumpMaxFlowMlMin
  loadRegime: LoadRegime;
}

const MOLAR_VOLUME_L_AT_25C = 24.465; // L/mol ideal gas molar volume at 25 °C (298.15 K) and 1 atm

/**
 * Calculates pollutant mass flowrate from volumetric gas flow and ppmv concentration.
 * m_dot = C_mass * Q_gas
 */
export function calculateMassFlow(
  inletConcentrationPpm: number,
  gasFlowLpm: number,
  pollutantMolarMassGPerMol: number = 64.066
) {
  const safePpm = Math.max(0, inletConcentrationPpm);
  const safeFlowLpm = Math.max(0, gasFlowLpm);

  // Convert ppmv to mass concentration (mg/m³) at 25 °C, 1 atm:
  // C (mg/m³) = ppmv * (MW / 24.465)
  const pollutantMassConcentrationMgM3 = safePpm * (pollutantMolarMassGPerMol / MOLAR_VOLUME_L_AT_25C);

  // Q_gas in m³/min = L/min * 1e-3
  const gasFlowM3Min = safeFlowLpm * 1e-3;

  // Mass flow in mg/min = C (mg/m³) * Q (m³/min)
  const pollutantMassFlowMgMin = pollutantMassConcentrationMgM3 * gasFlowM3Min;

  // Molar flow of pollutant in mmol/min = mg/min / (g/mol)
  const pollutantMolarFlowMmolMin =
    pollutantMolarMassGPerMol > 0 ? pollutantMassFlowMgMin / pollutantMolarMassGPerMol : 0;

  const gasMolarFlowMmolMin = (safeFlowLpm / MOLAR_VOLUME_L_AT_25C) * 1000;

  return {
    pollutantMassConcentrationMgM3,
    pollutantMassFlowMgMin,
    pollutantMolarFlowMmolMin,
    gasMolarFlowMmolMin,
  };
}

/**
 * Calculates stoichiometric reagent demand from pollutant molar flow.
 */
export function calculateStoichiometricDemand(
  pollutantMolarFlowMmolMin: number,
  stoichiometricRatio: number,
  reagentConcentrationMolPerL: number,
  reagentMolarMassGPerMol: number = 40.0
) {
  const safeRatio = Math.max(0, stoichiometricRatio);
  const safeMolarity = Math.max(0.01, reagentConcentrationMolPerL);

  // Required molar flow of reagent (mmol/min) = nu * n_dot_pollutant
  const theoreticalReagentMmolMin = pollutantMolarFlowMmolMin * safeRatio;

  // Mass flow of active reagent solute (mg/min)
  const theoreticalReagentMassMgMin = theoreticalReagentMmolMin * reagentMolarMassGPerMol;

  // Volumetric dosing flow rate (mL/min):
  // Since 1 mol/L = 1 mmol/mL, Volume (mL/min) = (mmol/min) / (mol/L)
  const feedforwardDoseMlMin = theoreticalReagentMmolMin / safeMolarity;

  return {
    theoreticalReagentMmolMin,
    theoreticalReagentMassMgMin,
    feedforwardDoseMlMin,
  };
}

/**
 * Combines feedforward stoichiometric dosing with proportional pH feedback trim.
 */
export function calculateAdaptiveDose(
  feedforwardDoseMlMin: number,
  currentPh: number,
  phSetpoint: number,
  pumpMaxFlowMlMin: number
) {
  // Positive phError means sump is more acidic than setpoint -> needs positive reagent trim
  const phError = phSetpoint - currentPh;

  // Proportional feedback gain (mL/min per pH unit deviation) scaled conservatively to pump capacity
  const kp = Math.max(0.5, pumpMaxFlowMlMin * 0.14);
  const feedbackTrimMlMin = phError * kp;

  const rawDose = feedforwardDoseMlMin + feedbackTrimMlMin;
  const adaptiveTotalDoseMlMin = Math.max(0, Math.min(pumpMaxFlowMlMin, rawDose));
  const pumpSaturated = rawDose > pumpMaxFlowMlMin;

  return {
    phError,
    feedbackTrimMlMin,
    adaptiveTotalDoseMlMin,
    pumpSaturated,
  };
}

/**
 * Calculates conservative fixed dosing rate assuming worst-case design concentration.
 */
export function calculateFixedDose(
  designMaxConcentrationPpm: number,
  gasFlowLpm: number,
  pollutantMolarMassGPerMol: number,
  stoichiometricRatio: number,
  reagentConcentrationMolPerL: number,
  safetyFactor: number = 1.15
) {
  const { pollutantMolarFlowMmolMin } = calculateMassFlow(
    designMaxConcentrationPpm,
    gasFlowLpm,
    pollutantMolarMassGPerMol
  );
  const { feedforwardDoseMlMin } = calculateStoichiometricDemand(
    pollutantMolarFlowMmolMin,
    stoichiometricRatio,
    reagentConcentrationMolPerL
  );
  return feedforwardDoseMlMin * safetyFactor;
}

/**
 * Maps required dosing flow (mL/min) to pump command percentage and load classification.
 */
export function calculatePumpCommand(adaptiveDoseMlMin: number, pumpMaxFlowMlMin: number) {
  const safeMax = Math.max(0.1, pumpMaxFlowMlMin);
  const pumpCommandPct = Math.max(0, Math.min(100, (adaptiveDoseMlMin / safeMax) * 100));

  let loadRegime: LoadRegime = 'NORMAL LOAD';
  if (pumpCommandPct < 30) {
    loadRegime = 'LOW LOAD';
  } else if (pumpCommandPct >= 75) {
    loadRegime = 'HIGH LOAD';
  }

  return {
    pumpCommandPct,
    loadRegime,
  };
}

/**
 * Full pipeline wrapper for the interactive dosing simulator.
 */
export function runFullDosingCalculation(input: DosingCalculationInput): DosingCalculationResult {
  const {
    inletConcentrationPpm,
    gasFlowLpm,
    pollutantMolarMassGPerMol,
    reagentConcentrationMolPerL,
    reagentMolarMassGPerMol = 40.0,
    stoichiometricRatio,
    currentPh,
    phSetpoint,
    pumpMaxFlowMlMin,
    designMaxConcentrationPpm = 800,
  } = input;

  const massFlow = calculateMassFlow(inletConcentrationPpm, gasFlowLpm, pollutantMolarMassGPerMol);
  const stoich = calculateStoichiometricDemand(
    massFlow.pollutantMolarFlowMmolMin,
    stoichiometricRatio,
    reagentConcentrationMolPerL,
    reagentMolarMassGPerMol
  );
  const adaptive = calculateAdaptiveDose(
    stoich.feedforwardDoseMlMin,
    currentPh,
    phSetpoint,
    pumpMaxFlowMlMin
  );
  const fixedWorstCaseDoseMlMin = Math.min(
    pumpMaxFlowMlMin,
    calculateFixedDose(
      designMaxConcentrationPpm,
      gasFlowLpm,
      pollutantMolarMassGPerMol,
      stoichiometricRatio,
      reagentConcentrationMolPerL,
      1.1
    )
  );
  const pump = calculatePumpCommand(adaptive.adaptiveTotalDoseMlMin, pumpMaxFlowMlMin);

  return {
    ...massFlow,
    ...stoich,
    ...adaptive,
    fixedWorstCaseDoseMlMin,
    ...pump,
  };
}

/**
 * Calculates removal efficiency percentage:
 * eta = ((C_in - C_out) / C_in) * 100
 */
export function calculateRemovalEfficiency(cIn: number, cOut: number): number {
  if (cIn <= 0) return 0;
  const clampedOut = Math.max(0, cOut);
  const eff = ((cIn - clampedOut) / cIn) * 100;
  return Math.max(-100, Math.min(100, eff));
}

/**
 * Evaluates whether an entered calculation scenario meets the ≥90% prototype target.
 * Strictly adheres to truthfulness guidelines: never claims NEUTRIX has experimentally achieved 90%.
 */
export function validateTarget(cIn: number, cOut: number) {
  const efficiency = calculateRemovalEfficiency(cIn, cOut);
  const meetsTarget = efficiency >= 90.0 && cIn > 0 && cOut >= 0 && cOut <= cIn;
  return {
    efficiency,
    meetsTarget,
    statusHeading: meetsTarget
      ? 'Target achieved in this calculation'
      : 'Below current prototype target — further optimization required.',
    statusSubtext: meetsTarget
      ? 'Entered scenario meets the prototype target (≥90% surrogate removal). This is a mathematical scenario evaluation, not experimental validation evidence.'
      : 'Entered scenario calculates below the ≥90% prototype target. Adjust liquid-to-gas ratio, packing height, or reagent pH setpoint in testing.',
  };
}

export type LoadProfilePreset = 'variable_cycle' | 'low_load_baseline' | 'intermittent_peak' | 'step_turndown';

export interface LoadComparisonPoint {
  minute: number;
  pollutantPpm: number;
  fixedDoseMlMin: number;
  adaptiveDoseMlMin: number;
  excessDoseMlMin: number;
}

/**
 * Generates deterministic synthetic time-series comparing Fixed (worst-case) Dosing vs. Adaptive Dosing.
 * Explicitly labeled as illustrative simulation — not measured prototype data.
 */
export function generateLoadComparisonSeries(
  preset: LoadProfilePreset,
  gasFlowLpm: number,
  reagentMolarity: number,
  stoichRatio: number,
  designMaxPpm: number = 600
): LoadComparisonPoint[] {
  const points: LoadComparisonPoint[] = [];
  const fixedDose = calculateFixedDose(designMaxPpm, gasFlowLpm, 64.066, stoichRatio, reagentMolarity, 1.05);

  for (let t = 0; t <= 60; t += 2) {
    let ppm = 200;
    if (preset === 'variable_cycle') {
      ppm = 240 + 180 * Math.sin((t / 60) * Math.PI * 2.5) + 60 * Math.cos((t / 60) * Math.PI * 5);
    } else if (preset === 'low_load_baseline') {
      ppm = 110 + 35 * Math.sin((t / 60) * Math.PI * 3);
    } else if (preset === 'intermittent_peak') {
      ppm = t >= 22 && t <= 34 ? 560 : 135 + 20 * Math.sin(t);
    } else if (preset === 'step_turndown') {
      ppm = t < 20 ? 520 : t < 42 ? 260 : 95;
    }

    ppm = Math.max(30, Math.min(designMaxPpm, Math.round(ppm)));

    const { pollutantMolarFlowMmolMin } = calculateMassFlow(ppm, gasFlowLpm, 64.066);
    const { feedforwardDoseMlMin } = calculateStoichiometricDemand(
      pollutantMolarFlowMmolMin,
      stoichRatio,
      reagentMolarity
    );

    const adaptiveDose = Number(feedforwardDoseMlMin.toFixed(2));
    const fixedClamped = Number(fixedDose.toFixed(2));
    const excess = Number(Math.max(0, fixedClamped - adaptiveDose).toFixed(2));

    points.push({
      minute: t,
      pollutantPpm: ppm,
      fixedDoseMlMin: fixedClamped,
      adaptiveDoseMlMin: adaptiveDose,
      excessDoseMlMin: excess,
    });
  }

  return points;
}
