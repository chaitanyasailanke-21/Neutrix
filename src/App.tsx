/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NeutrixProvider } from './context/NeutrixContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemAndComparisonSection } from './components/ProblemAndComparisonSection';
import { ArchitectureAndPAndIDSection } from './components/ArchitectureAndPAndIDSection';
import { ModularTrainAndMappingSection } from './components/ModularTrainAndMappingSection';
import { AdaptiveDosingAndSimulatorSection } from './components/AdaptiveDosingAndSimulatorSection';
import { LivePrototypeDashboardSection } from './components/LivePrototypeDashboardSection';
import { BenchPrototypeSection } from './components/BenchPrototypeSection';
import { ValidationAndDataSection } from './components/ValidationAndDataSection';
import { SafetyWasteAndRiskSection } from './components/SafetyWasteAndRiskSection';
import { RoadmapFutureAndFooterSection } from './components/RoadmapFutureAndFooterSection';

export default function App() {
  return (
    <NeutrixProvider>
      <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] flex flex-col">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <ProblemAndComparisonSection />
          <ArchitectureAndPAndIDSection />
          <ModularTrainAndMappingSection />
          <AdaptiveDosingAndSimulatorSection />
          <LivePrototypeDashboardSection />
          <BenchPrototypeSection />
          <ValidationAndDataSection />
          <SafetyWasteAndRiskSection />
          <RoadmapFutureAndFooterSection />
        </main>
      </div>
    </NeutrixProvider>
  );
}
