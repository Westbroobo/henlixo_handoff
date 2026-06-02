import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { CatalogPage } from '../pages/CatalogPage';
import type { Product } from '../types/product';

const products: Product[] = [
  {
    sku: 'HL-PG-LV-STD',
    name: 'Motorized Louvered Aluminum Pergola',
    family: 'Pergola',
    subType: 'Motorized Louvered',
    application: ['Villa', 'Restaurant'],
    tier: 'Standard',
    featured: true,
    tagline: 'Pergola for villas and restaurants.',
    intro: 'Intro',
    image: 'image.jpg',
    imageFallback: 'fallback.jpg',
    specs: [{ label: 'Frame', value: '6063-T5 aluminum' }],
    features: ['Hidden drainage'],
    accessories: ['LED'],
    leadTime: '25-30 days',
    moq: '1 set',
    ctaLabel: 'Inquire via WhatsApp',
  },
  {
    sku: 'HL-MSR-PC',
    name: 'Mobile Retractable Polycarbonate Sunroom',
    family: 'Sunroom',
    subType: 'Mobile Retractable',
    application: ['Pool', 'Hotel'],
    tier: 'Mobile enclosure',
    featured: true,
    tagline: 'Retractable enclosure for pools.',
    intro: 'Intro',
    image: 'image.jpg',
    imageFallback: 'fallback.jpg',
    specs: [{ label: 'Panel', value: '5mm polycarbonate' }],
    features: ['Motorized track'],
    accessories: ['Lighting'],
    leadTime: '35 days',
    moq: '1 set',
    ctaLabel: 'Inquire via WhatsApp',
  },
];

describe('CatalogPage', () => {
  it('loads products and filters by family', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => products,
      }),
    );

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Motorized Louvered Aluminum Pergola')).toBeInTheDocument();
    expect(screen.getByText('Mobile Retractable Polycarbonate Sunroom')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sunroom' }));

    await waitFor(() => {
      expect(screen.queryByText('Motorized Louvered Aluminum Pergola')).not.toBeInTheDocument();
      expect(screen.getByText('Mobile Retractable Polycarbonate Sunroom')).toBeInTheDocument();
    });
  });
});
