/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BridgeTransition from '@/components/common/BridgeTransition';

describe('BridgeTransition', () => {
  it('renders nothing when show is false', () => {
    render(<BridgeTransition show={false} />);
    expect(screen.queryByText(/Đang kết nối dữ liệu/i)).not.toBeInTheDocument();
  });

  it('renders loading screen when show is true', () => {
    render(<BridgeTransition show={true} />);
    expect(screen.getByText(/Đang kết nối dữ liệu/i)).toBeInTheDocument();
    expect(screen.getByText(/Vutera Harmony Ecosystem/i)).toBeInTheDocument();
  });

  it('shows target app name in messages', () => {
    render(<BridgeTransition show={true} targetApp="TuVi" />);
    expect(screen.getByText(/Đang khởi tạo module TuVi/i)).toBeInTheDocument();
  });
});
