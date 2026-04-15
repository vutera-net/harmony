import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../../components/auth/LoginForm';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

describe('LoginForm UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
  });

  it('should render all input fields and submit button', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ĐĂNG NHẬP/i })).toBeInTheDocument();
  });

  it('should call signIn with correct credentials on submit', async () => {
    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mật khẩu/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /ĐĂNG NHẬP/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', expect.objectContaining({
        email: 'test@example.com',
        password: 'Password123!',
      }));
    });
  });

  it('should display error message when signIn returns error', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: 'CredentialsSignin' });
    
    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mật khẩu/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /ĐĂNG NHẬP/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email hoặc mật khẩu không chính xác/i)).toBeInTheDocument();
    });
  });

  it('should be responsive (checks for tailwind classes)', () => {
    const { container } = render(<LoginForm />);
    // Check for the outer div that should be responsive (max-w-md, w-full)
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveClass('w-full', 'max-w-md');
  });
});
