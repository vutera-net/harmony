import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContentLock } from '@/components/funnel/ContentLock';
import { AnMenhCTA } from '@/components/funnel/AnMenhCTA';
import { StickyCTA } from '@/components/funnel/StickyCTA';
import { PersonalDoubtTrigger } from '@/components/funnel/PersonalDoubtTrigger';
import { useSessionMemory } from '@/hooks/useSessionMemory';

// Mock useSessionMemory
jest.mock('@/hooks/useSessionMemory', () => ({
  useSessionMemory: jest.fn(() => ({ memory: null })),
}));

// Mock BridgeTransition to avoid complex animation tests
jest.mock('@/components/common/BridgeTransition', () => ({
  __esModule: true,
  default: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="bridge-transition" onClick={onComplete}>Bridge</div>
  ),
}));

// Mock APP_URLS
jest.mock('@/lib/urls', () => ({
  APP_URLS: {
    anmenh: 'https://anmenh.vutera.net',
  },
  buildAnMenhUrl: (path: string, params: any) => `https://anmenh.vutera.net${path}?${new URLSearchParams(params)}`,
}));

describe('Funnel & Conversion Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    window.gtag = jest.fn();
  });

  describe('ContentLock', () => {
    const mockItems = ['Item 1', 'Item 2'];

    it('should blur content items', () => {
      render(<ContentLock items={mockItems} />);
      const items = screen.getAllByText(/Item \d/);
      items.forEach(item => {
        expect(item).toHaveClass('blur-[3px]');
      });
    });

    it('should show Premium label', () => {
      render(<ContentLock items={mockItems} />);
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });

    it('should trigger bridge transition on CTA click', () => {
      render(<ContentLock items={mockItems} buttonText="Unlock Now" />);
      const button = screen.getByText(/Unlock Now/);
      fireEvent.click(button);
      
      expect(screen.getByTestId('bridge-transition')).toBeInTheDocument();
    });
  });

  describe('AnMenhCTA', () => {
    it('should render banner variant by default', () => {
      render(<AnMenhCTA />);
      expect(screen.getByText(/AnMenh — Cá nhân hóa sâu hơn/i)).toBeInTheDocument();
    });

    it('should render inline variant correctly', () => {
      render(<AnMenhCTA variant="inline" context="tuvi" />);
      expect(screen.getByText(/Lá số này dựa trên ngày sinh/i)).toBeInTheDocument();
    });

    it('should render card variant correctly', () => {
      render(<AnMenhCTA variant="card" context="phongthuy" />);
      expect(screen.getByText(/Bố trí nội thất cụ thể/i)).toBeInTheDocument();
    });

    it('should have correct link to AnMenh', () => {
      render(<AnMenhCTA variant="inline" context="tuvi" />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', expect.stringContaining('anmenh.vutera.net'));
    });
  });

  describe('StickyCTA', () => {
    it('should not be visible by default', () => {
      render(<StickyCTA />);
      expect(screen.queryByText(/Xem bản cá nhân/i)).not.toBeInTheDocument();
    });

    it('should become visible when scrolled', async () => {
      // Mock window.scrollY and document.documentElement.scrollHeight
      Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 500, writable: true });

      render(<StickyCTA />);
      
      // Trigger scroll event
      fireEvent.scroll(window);

      await waitFor(() => {
        expect(screen.getByText(/Xem bản cá nhân/i)).toBeInTheDocument();
      });
    });

    it('should be dismissed when close button is clicked', async () => {
      Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 500, writable: true });

      render(<StickyCTA />);
      fireEvent.scroll(window);

      await waitFor(() => {
        expect(screen.getByText(/Xem bản cá nhân/i)).toBeInTheDocument();
      });

      const closeButton = screen.getByLabelText('Đóng');
      fireEvent.click(closeButton);

      expect(screen.queryByText(/Xem bản cá nhân/i)).not.toBeInTheDocument();
      expect(sessionStorage.getItem('tuvi_sticky_cta_dismissed')).toBe('1');
    });
  });

  describe('PersonalDoubtTrigger', () => {
    it('should show general text when no birthYear in memory', () => {
      (useSessionMemory as jest.Mock).mockReturnValue({ memory: null });
      render(<PersonalDoubtTrigger context="tuvi" />);
      expect(screen.getByText(/Kết quả này chỉ dựa trên ngày sinh/i)).toBeInTheDocument();
    });

    it('should show personalized text when birthYear is present', () => {
      (useSessionMemory as jest.Mock).mockReturnValue({
        memory: { birthYear: 1990, gender: 'male' },
      });
      render(<PersonalDoubtTrigger context="tuvi" />);
      // getCanChiYear(1990) should return something like "Canh Ngo"
      expect(screen.getByText(/Với tuổi/i)).toBeInTheDocument();
      expect(screen.getByText(/1990/i)).toBeInTheDocument();
    });

    it('should render prominent variant correctly', () => {
      render(<PersonalDoubtTrigger variant="prominent" />);
      expect(screen.getByText(/Lưu ý về độ chính xác/i)).toBeInTheDocument();
    });

    it('should render subtle variant correctly', () => {
      render(<PersonalDoubtTrigger variant="subtle" />);
      expect(screen.getByText(/\* /)).toBeInTheDocument();
    });
  });
});
