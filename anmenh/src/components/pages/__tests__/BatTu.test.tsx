/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BatTu from '@/components/pages/BatTu';
import { UserProvider } from '@/context/UserContext';
import * as battuLogic from '@/lib/battu-logic';

// Mock battu-logic
jest.mock('@/lib/battu-logic', () => ({
  calculateBatTu: jest.fn(),
}));

// Mock RadarChart to avoid canvas/SVG issues in JSDOM
jest.mock('@/components/RadarChart', () => {
  return function DummyRadarChart({ data }: { data: any }) {
    return <div data-testid="radar-chart">Radar Chart Mocked {JSON.stringify(data)}</div>;
  };
});

const mockBatTuResult = {
  year: { can: 'Canh', chi: 'Ngọ', canHanh: 'Kim', chiHanh: 'Hỏa' },
  month: { can: 'Tân', chi: 'Tỵ', canHanh: 'Kim', chiHanh: 'Hỏa' },
  day: { can: 'Giáp', chi: 'Thìn', canHanh: 'Mộc', chiHanh: 'Thổ' },
  hour: { can: 'Nhâm', chi: 'Thìn', canHanh: 'Thủy', chiHanh: 'Thổ' },
  nguHanhCount: {
    Kim: 2,
    Mộc: 1,
    Thủy: 1,
    Hỏa: 2,
    Thổ: 2,
  },
  vuong: ['Kim', 'Hỏa'],
  khuyet: [],
};

describe('BatTu Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (battuLogic.calculateBatTu as jest.Mock).mockReturnValue(mockBatTuResult);
  });

  it('renders basic layout and inputs', () => {
    render(
      <UserProvider>
        <BatTu />
      </UserProvider>
    );

    expect(screen.getByText(/Bát Tự Tứ Trụ/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ngày sinh \(Dương lịch\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Giờ sinh/i)).toBeInTheDocument();
    expect(screen.getByText(/AN LÁ SỐ BÁT TỰ/i)).toBeInTheDocument();
  });

  it('calculates and displays result when form is submitted', async () => {
    render(
      <UserProvider>
        <BatTu />
      </UserProvider>
    );

    const dateInput = screen.getByLabelText(/Ngày sinh \(Dương lịch\)/i);
    const timeInput = screen.getByLabelText(/Giờ sinh/i);
    const submitButton = screen.getByText(/AN LÁ SỐ BÁT TỰ/i);

    fireEvent.change(dateInput, { target: { value: '1995-05-15' } });
    fireEvent.change(timeInput, { target: { value: '08:30' } });
    fireEvent.click(submitButton);

    expect(battuLogic.calculateBatTu).toHaveBeenCalled();
    expect(screen.getByText(/TRỤ GIỜ/i)).toBeInTheDocument();
    expect(screen.getByText(/TRỤ NGÀY/i)).toBeInTheDocument();
    expect(screen.getByText(/TRỤ THÁNG/i)).toBeInTheDocument();
    expect(screen.getByText(/TRỤ NĂM/i)).toBeInTheDocument();

    expect(screen.getByText('Canh')).toBeInTheDocument();
    expect(screen.getByText('Ngọ')).toBeInTheDocument();

    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();

    expect(screen.getByText(/Phân Tích Vượng Khuyết/i)).toBeInTheDocument();
    expect(screen.getByText('Kim')).toBeInTheDocument();
    expect(screen.getByText('Hỏa')).toBeInTheDocument();
  });
});
