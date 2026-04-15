import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WaitlistModal from './WaitlistModal';

describe('WaitlistModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should display the modal when isOpen is true', () => {
    render(<WaitlistModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText(/App Harmony Sắp Ra Mắt/i)).toBeInTheDocument();
  });

  it('should not display the modal when isOpen is false', () => {
    render(<WaitlistModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText(/App Harmony Sắp Ra Mắt/i)).not.toBeInTheDocument();
  });

  it('should call onClose when the close button is clicked', () => {
    render(<WaitlistModal isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getByRole('button', { name: '' }); // The X button doesn't have text, but it's a button
    // There are multiple buttons (Close and Submit). The Close button is the first one.
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should show success message on successful submission', async () => {
    render(<WaitlistModal isOpen={true} onClose={mockOnClose} />);
    const emailInput = screen.getByPlaceholderText(/Địa chỉ email của bạn.../i);
    const submitButton = screen.getByText(/ĐĂNG KÝ NGAY/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Cảm ơn bạn!/i)).toBeInTheDocument();
    }, { timeout: 2000 });
    expect(screen.getByText(/Bạn đã được thêm vào danh sách hàng chờ/i)).toBeInTheDocument();
  });

  it('should show error message on failed submission', async () => {
    render(<WaitlistModal isOpen={true} onClose={mockOnClose} />);
    const emailInput = screen.getByPlaceholderText(/Địa chỉ email của bạn.../i);
    const submitButton = screen.getByText(/ĐĂNG KÝ NGAY/i);

    fireEvent.change(emailInput, { target: { value: 'error@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email này không hợp lệ hoặc đã tồn tại/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
