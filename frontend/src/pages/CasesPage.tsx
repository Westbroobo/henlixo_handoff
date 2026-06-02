import { useEffect, useState } from 'react';

import { fetchCases } from '../api/cases';
import { ScenarioGrid } from '../components/cases/ScenarioGrid';
import type { ApplicationScenario } from '../types/case';

export function CasesPage() {
  const [scenarios, setScenarios] = useState<ApplicationScenario[]>([]);

  useEffect(() => {
    fetchCases().then(setScenarios).catch(() => setScenarios([]));
  }, []);

  return (
    <main className="cases-page">
      <section className="subpage-hero cases-hero">
        <div className="wrap">
          <div className="eyebrow">Application Scenarios</div>
          <h1>Outdoor structure solutions by application.</h1>
          <p>
            From hotel terraces and restaurant patios to villa gardens, pool enclosures and rooftop lounges,
            Henlixo systems are configured around real use cases.
          </p>
        </div>
      </section>
      <section className="wrap cases-section">
        <ScenarioGrid scenarios={scenarios} />
      </section>
    </main>
  );
}
