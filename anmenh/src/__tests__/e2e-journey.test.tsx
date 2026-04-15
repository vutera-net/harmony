import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/components/pages/Home';
import { UserProvider } from '@/context/UserContext';

describe('E2E Journey Segment: AnMenh Dashboard', () => {
  it('should render personalized dashboard when user profile exists', () => {
    // We can't easily mock useUser because it's a context.
    // But we can wrap it in UserProvider and use a way to set the profile.
    // However, since UserProvider uses localStorage, we can mock localStorage.
    
    const mockProfile = {
      name: 'Nguyễn Văn An',
      birthYear: 1990,
      gender: 'male',
      birthDate: '1990-01-01',
    };
    
    localStorage.setItem('anmenh_user_profile', JSON.stringify(mockProfile));

    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    // The component has an useEffect to set mounted = true
    // In Jest/RTL, we might need to wait or just check for the element
    // Since Home.tsx uses `mounted && profile`, we should check for it.
    
    // Wait for the profile name to appear
    expect(screen.getByText(/Hữu duyên, Nguyễn Văn An/i)).toBeInTheDocument();
    expect(screen.getByText(/Tử Vi Hôm Nay/i)).toBeInTheDocument();
  });
});
