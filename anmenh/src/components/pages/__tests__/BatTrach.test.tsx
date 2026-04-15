/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BatTrach from '@/components/pages/BatTrach';
import { UserProvider } from '@/context/UserContext';
import * as lunarLogic from '@/lib/lunar-logic';
import * as pdfService from '@/lib/pdf-service';

// Mock lunar-logic
jest.mock('@/lib/lunar-logic', () => ({
  ...jest.requireActual('@/lib/lunar-logic'),
  calculateBatTrach: jest.fn(),
  getYearCanChi: jest.fn(),
}));

// Mock pdf-service
jest.mock('@/lib/pdf-service', () => ({
  generatePremiumReport: jest.fn(),
}));

const mockBatTrachResult = {
  cung: 'Khôn',
  menh: 'Tây Tứ Mệnh',
  description: 'Mệnh Khôn thuộc Tây Tứ Mệnh, hạp với các hướng Tây, Tây Nam, Tây Bắc, Đông Bắc.',
  sinhKhi: 'Đông Bắc',
  thienY: 'Tây',
  dienNien: 'Tây Bắc',
  phucVi: 'Tây Nam',
  tuyetMenh: 'Nam',
  nguQuy: 'Đông',
  lucSat: 'Đông Nam',
  hoaHai: 'Bắc',
  compassDeg: 45,
};

describe('BatTrach Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (lunarLogic.getYearCanChi as jest.Mock).mockReturnValue('Canh Ngọ');
    (lunarLogic.calculateBatTrach as jest.Mock).mockReturnValue(mockBatTrachResult);
  });

  it('renders layout and inputs', () => {
    render(
      <UserProvider>
        <BatTrach />
      </UserProvider>
    );

    expect(screen.getByText(/La Bàn Bát Trạch/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Năm sinh \(Âm lịch\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Nam/i)).toBeInTheDocument();
    expect(screen.getByText(/Nữ/i)).toBeInTheDocument();
    expect(screen.getByText(/Tra Cứu Hướng/i)).toBeInTheDocument();
  });

  it('calculates and displays results', async () => {
    render(
      <UserProvider>
        <BatTrach />
      </UserProvider>
    );

    const yearInput = screen.getByLabelText(/Năm sinh \(Âm lịch\)/i);
    const submitButton = screen.getByText(/Tra Cứu Hướng/i);

    fireEvent.change(yearInput, { target: { value: '1990' } });
    fireEvent.click(submitButton);

    expect(lunarLogic.calculateBatTrach).toHaveBeenCalledWith(1990, 'male');
    expect(screen.getByText('Khôn')).toBeInTheDocument();
    expect(screen.getByText('Tây Tứ Mệnh')).toBeInTheDocument();
    expect(screen.getByText(/Hướng Đại Cát/i)).toBeInTheDocument();
    expect(screen.getByText(/Hướng Kỵ/i)).toBeInTheDocument();
    expect(screen.getByText('Đông Bắc')).toBeInTheDocument(); // Sinh Khi
    expect(screen.getByText('Nam')).toBeInTheDocument(); // Tuyet Menh
  });

  it('triggers PDF export', async () => {
    render(
      <UserProvider>
        <BatTrach />
      </UserProvider>
    );

    const yearInput = screen.getByLabelText(/Năm sinh \(Âm lịch\)/i);
    const submitButton = screen.getByText(/Tra Cứu Hướng/i);

    fireEvent.change(yearInput, { target: { value: '1990' } });
    fireEvent.click(submitButton);

    const pdfButton = screen.getByTitle(/Xuất báo cáo PDF/i);
    fireEvent.click(pdfButton);

    expect(pdfService.generatePremiumReport).toHaveBeenCalled();
  });
});
