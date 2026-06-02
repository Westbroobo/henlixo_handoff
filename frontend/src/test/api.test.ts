import { describe, expect, it, vi } from 'vitest';

import { sendInquiry } from '../api/inquiries';
import { fetchProducts } from '../api/products';

describe('API client wrappers', () => {
  it('loads products from the backend API path', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ sku: 'HL-PG-LV-STD' }],
    });
    vi.stubGlobal('fetch', fetchMock);

    const products = await fetchProducts();

    expect(products[0].sku).toBe('HL-PG-LV-STD');
    expect(fetchMock).toHaveBeenCalledWith('/api/products', expect.any(Object));
  });

  it('submits inquiry payload as JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Inquiry received' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await sendInquiry({
      name: 'Jane Buyer',
      email: 'jane@example.com',
      customerType: 'Hotel / Resort',
      productInterest: 'Pergola',
      message: 'Please quote a terrace project.',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/inquiries',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Jane Buyer'),
      }),
    );
  });
});
