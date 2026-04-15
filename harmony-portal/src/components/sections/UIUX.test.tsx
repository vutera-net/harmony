import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroSection from './HeroSection';
import EcosystemSection from './EcosystemSection';
import { APP_URLS } from '@/lib/urls';

describe('Harmony Portal UI/UX Tests', () => {
  describe('HeroSection', () => {
    it('should have correct CTA links to TuVi and AnMenh', () => {
      render(<HeroSection />);
      const tuviLink = screen.getByText(/Khám phá miễn phí ngay/i);
      const anmenhLink = screen.getByText(/Tìm hiểu AnMenh Sanctuary/i);

      expect(tuviLink).toHaveAttribute('href', APP_URLS.tuvi);
      expect(anmenhLink).toHaveAttribute('href', APP_URLS.anmenh);
    });

    it('should have the correct theme colors (amber-500 for accent)', () => {
      render(<HeroSection />);
      // Check for the Sparkles icon color
      const accentElement = screen.getByText(/Hệ sinh thái tâm linh & công nghệ/i);
      expect(accentElement).toHaveClass('text-stone-400');
    });
  });

  describe('EcosystemSection', () => {
    it('should have correct CTA links to TuVi and AnMenh', () => {
      render(<EcosystemSection />);
      const tuviLink = screen.getByText(/TRẢI NGHIỆM MIỄN PHÍ/i);
      const anmenhLink = screen.getByText(/KHÁM PHÁ SANCTUARY/i);

      expect(tuviLink).toHaveAttribute('href', APP_URLS.tuvi);
      expect(anmenhLink).toHaveAttribute('href', APP_URLS.anmenh);
    });

    it('should use amber-500 for AnMenh App highlighting', () => {
      render(<EcosystemSection />);
      const anmenhTitle = screen.getByText(/AnMenh App/i);
      expect(anmenhTitle).toHaveClass('text-amber-500');
    });
  });
});
