import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContentLock } from '@/components/funnel/ContentLock';
import { AnMenhCTA } from '@/components/funnel/AnMenhCTA';

jest.mock('@/hooks/useSessionMemory', () => ({
  useSessionMemory: jest.fn(() => ({ memory: null })),
}));

jest.mock('@/components/common/BridgeTransition', () => ({
  __esModule: true,
  default: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="bridge-transition" onClick={onComplete}>Bridge</div>
  ),
}));

jest.mock('@/lib/urls', () => ({
  APP_URLS: {
    auth: 'https://auth.vutera.net',
    anmenh: 'https://anmenh.vutera.net',
  },
  buildAnMenhUrl: (path: string, params: any) => `https://anmenh.vutera.net${path}`,
}));

describe('E2E Journey Segment: TuVi Funnel', () => {
  it('should guide user from ContentLock -> Bridge -> AnMenh', async () => {
    // Render ContentLock
    render(<ContentLock items={['Deep Insight 1']} buttonText="Unlock Now" />);
    
    // 1. User clicks Unlock
    const button = screen.getByText(/Unlock Now/);
    fireEvent.click(button);
    
    // 2. Verify Bridge UI appears
    expect(screen.getByTestId('bridge-transition')).toBeInTheDocument();
    
    // 3. Verify AnMenhCTA leads to the correct domain
    render(<AnMenhCTA variant="banner" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', expect.stringContaining('anmenh.vutera.net'));
  });
});
