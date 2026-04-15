import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '@/components/auth/LoginForm';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

describe('E2E Journey Segment: Auth Redirect', () => {
  it('should use the redirect parameter as callbackUrl during signIn', async () => {
    const mockRedirect = 'https://anmenh.vutera.net/dashboard';
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(mockRedirect),
    });

    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mật khẩu/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /ĐĂNG NHẬP/i }));

    expect(signIn).toHaveBeenCalledWith('credentials', expect.objectContaining({
      callbackUrl: mockRedirect,
    }));
  });
});
