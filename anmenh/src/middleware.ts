import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'vutera-auth-session';

// Paths that require authentication and email verification on AnMenh
const PROTECTED_PATHS = ['/dashboard', '/premium', '/bridge'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;
  
  // Use env var so domain is configurable for local dev / staging
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? 'https://auth.vutera.net';

  if (!token) {
    if (PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
      const loginUrl = new URL('/login', authUrl);
      loginUrl.searchParams.set('redirect', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // If we are on a protected path, we need to verify the email
  if (PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    try {
      const sessionResponse = await fetch(`${authUrl}/api/auth/session`, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to fetch session');
      }

      const session = await sessionResponse.json();

      if (!session || !session.user) {
        const loginUrl = new URL('/login', authUrl);
        loginUrl.searchParams.set('redirect', request.url);
        return NextResponse.redirect(loginUrl);
      }

      if (!session.user.emailVerified) {
        const verifyUrl = new URL('/verify-email', authUrl);
        verifyUrl.searchParams.set('redirect', request.url);
        return NextResponse.redirect(verifyUrl);
      }
    } catch (error) {
      console.error('Middleware session verification failed:', error);
      // In case of error, we can either let them through or redirect to login.
      // Let's redirect to login for safety on protected paths.
      const loginUrl = new URL('/login', authUrl);
      loginUrl.searchParams.set('redirect', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  response.headers.set('x-vutera-authenticated', 'true');
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)',],
};
