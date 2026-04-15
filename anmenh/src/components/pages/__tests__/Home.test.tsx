/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/components/pages/Home';
import { UserProvider, useUser } from '@/context/UserContext';
import * as lunarLogic from '@/lib/lunar-logic';

// Mock the UserContext
jest.mock('@/context/UserContext', () => ({
  ...jest.requireActual('@/context/UserContext'),
  useUser: jest.fn(),
}));

// Mock lunar-logic
jest.mock('@/lib/lunar-logic', () => ({
  getDailyLuck: jest.fn(),
  getYearCanChi: jest.fn(),
}));

const mockProfile = {
  name: 'Nguyễn Văn An',
  birthYear: 1990,
  gender: 'male' as const,
  birthDate: '1990-01-01',
};

const mockDailyLuck = {
  energy: 5,
  message: 'Hôm nay là một ngày tuyệt vời để bắt đầu điều mới.',
  luckyColor: 'Vàng',
  luckyDirection: 'Đông Nam',
  luckyHour: '7h - 9h',
  luckyNumbers: [7, 8, 9],
};

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (lunarLogic.getYearCanChi as jest.Mock).mockReturnValue('Canh Ngọ');
    (lunarLogic.getDailyLuck as jest.Mock).mockReturnValue(mockDailyLuck);
  });

  it('renders personalized greeting when profile exists', () => {
    (useUser as jest.Mock).mockReturnValue({
      profile: mockProfile,
      saveProfile: jest.fn(),
      clearProfile: jest.fn(),
    });

    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    expect(screen.getByText(/Hữu duyên, Nguyễn Văn An/i)).toBeInTheDocument();
    expect(screen.getByText(/Chào, Nguyễn Văn An/i)).toBeInTheDocument();
  });

  it('renders daily luck details when profile exists', () => {
    (useUser as jest.Mock).mockReturnValue({
      profile: mockProfile,
      saveProfile: jest.fn(),
      clearProfile: jest.fn(),
    });

    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    expect(screen.getByText(/Màu may mắn: Vàng/i)).toBeInTheDocument();
    expect(screen.getByText(/Hướng tốt: Đông Nam/i)).toBeInTheDocument();
    expect(screen.getByText(/"Hôm nay là một ngày tuyệt vời để bắt đầu điều mới."/i)).toBeInTheDocument();
    expect(screen.getByText(/7 · 8 · 9/i)).toBeInTheDocument();
  });

  it('renders generic greeting when no profile exists', () => {
    (useUser as jest.Mock).mockReturnValue({
      profile: null,
      saveProfile: jest.fn(),
      clearProfile: jest.fn(),
    });

    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    expect(screen.getByText(/Thấu hiểu Vận Mệnh/i)).toBeInTheDocument();
    expect(screen.getByText(/Kiến tạo Bình An/i)).toBeInTheDocument();
    expect(screen.getByText(/Tạo hồ sơ/i)).toBeInTheDocument();
  });

  it('shows the invitation to create profile when no profile exists', () => {
    (useUser as jest.Mock).mockReturnValue({
      profile: null,
      saveProfile: jest.fn(),
      clearProfile: jest.fn(),
    });

    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    expect(screen.getByText(/Tạo hồ sơ để xem Tử Vi Hôm Nay/i)).toBeInTheDocument();
  });
});
