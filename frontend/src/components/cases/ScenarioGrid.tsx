import { MessageCircle, PanelsTopLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { ApplicationScenario } from '../../types/case';

type ScenarioGridProps = {
  scenarios: ApplicationScenario[];
};

export function ScenarioGrid({ scenarios }: ScenarioGridProps) {
  if (scenarios.length === 0) {
    return (
      <div className="compact-state">
        Scenario data is temporarily unavailable. You can still discuss your application through WhatsApp or the inquiry form.
      </div>
    );
  }

  return (
    <div className="cases-grid">
      {scenarios.map((scenario) => (
        <article className="case-card" key={scenario.id}>
          <img
            src={scenario.image}
            alt={scenario.title}
            onError={(event) => {
              event.currentTarget.src = scenario.imageFallback;
            }}
          />
          <div>
            <span>{scenario.audience}</span>
            <h2>{scenario.title}</h2>
            <p>{scenario.summary}</p>
            <ul>
              {scenario.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="related-products">
              {scenario.recommendedProducts.map((sku) => (
                <span key={sku}>{sku}</span>
              ))}
            </div>
            <div className="case-actions">
              <a
                className="btn btn-primary"
                href={`https://api.whatsapp.com/send?phone=8615925638060&text=${encodeURIComponent(
                  `Hello, I want to discuss ${scenario.title} with Henlixo.`,
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={17} /> Discuss This Scenario
              </a>
              <Link className="btn" to="/catalog">
                <PanelsTopLeft size={17} /> View Related Products
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
