import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'vutera-auth-session';

// Paths that require authentication on AnMenh
const PROTECTED_PATHS = ['/dashboard', '/premium'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const response = NextResponse.next();

  if (token) {
    response.headers.set('x-vutera-authenticated', 'true');
  } else {
    const { pathname } = request.nextUrl;
    if (PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
      // Use env var so domain is configurable for local dev / staging
      const authUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? 'https://auth.vutera.net';
      const loginUrl = new URL('/login', authUrl);
      loginUrl.searchParams.set('redirect', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)',],
};
