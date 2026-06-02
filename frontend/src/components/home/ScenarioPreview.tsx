import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { ApplicationScenario } from '../../types/case';

type ScenarioPreviewProps = {
  scenarios: ApplicationScenario[];
};

export function ScenarioPreview({ scenarios }: ScenarioPreviewProps) {
  if (scenarios.length === 0) {
    return null;
  }

  return (
    <section className="section scenario-preview">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Application Scenarios</div>
            <h2>Show use cases without inventing fake project stories.</h2>
          </div>
          <Link className="inline-link" to="/cases">
            All Scenarios <ArrowRight size={16} />
          </Link>
        </div>
        <div className="scenario-strip">
          {scenarios.slice(0, 3).map((scenario) => (
            <article key={scenario.id}>
              <img
                src={scenario.image}
                alt={scenario.title}
                onError={(event) => {
                  event.currentTarget.src = scenario.imageFallback;
                }}
              />
              <div>
                <span>{scenario.audience}</span>
                <h3>{scenario.title}</h3>
                <p>{scenario.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
