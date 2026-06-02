import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { ScenarioGrid } from '../components/cases/ScenarioGrid';
import type { ApplicationScenario } from '../types/case';

const scenarios: ApplicationScenario[] = [
  {
    id: 'hotel-resort-terraces',
    kind: 'application-scenario',
    title: 'Hotel & Resort Terraces',
    audience: 'Hotels and resorts',
    summary: 'Outdoor hospitality spaces',
    image: 'image.jpg',
    imageFallback: 'fallback.jpg',
    recommendedProducts: ['HL-PG-LV-HD'],
    keyPoints: ['Heavy-duty structures'],
  },
];

describe('ScenarioGrid', () => {
  it('renders application scenario cards without fake project labels', () => {
    render(
      <MemoryRouter>
        <ScenarioGrid scenarios={scenarios} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Hotel & Resort Terraces')).toBeInTheDocument();
    expect(screen.getByText('HL-PG-LV-HD')).toBeInTheDocument();
    expect(screen.queryByText(/client project/i)).not.toBeInTheDocument();
  });
});
