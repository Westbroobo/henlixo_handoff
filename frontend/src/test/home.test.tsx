import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ContactSection } from '../components/home/ContactSection';

describe('ContactSection', () => {
  it('submits inquiry payload and shows success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, message: 'Inquiry received' }),
      }),
    );

    render(<ContactSection />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jane Buyer' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Country / Region'), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText('Project Size / Quantity'), { target: { value: '12 pergolas' } });
    fireEvent.change(screen.getByPlaceholderText('Project size, quantity, timeline...'), {
      target: { value: 'Please quote a resort pergola project.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /request quote/i }));

    await waitFor(() => {
      expect(screen.getByText(/contact you within 24 hours/i)).toBeInTheDocument();
    });
  });
});
