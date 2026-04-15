/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RadarChart from '@/components/RadarChart';

describe('RadarChart', () => {
  const mockData = {
    Kim: 20,
    Mộc: 30,
    Thủy: 10,
    Hỏa: 40,
    Thổ: 25,
  };

  it('renders the SVG element', () => {
    render(<RadarChart data={mockData} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByLabelText(/Biểu đồ Radar Ngũ Hành/i)).toBeInTheDocument();
  });

  it('renders all five element labels', () => {
    render(<RadarChart data={mockData} />);
    expect(screen.getByText('Kim')).toBeInTheDocument();
    expect(screen.getByText('Mộc')).toBeInTheDocument();
    expect(screen.getByText('Thủy')).toBeInTheDocument();
    expect(screen.getByText('Hỏa')).toBeInTheDocument();
    expect(screen.getByText('Thổ')).toBeInTheDocument();
  });
});
