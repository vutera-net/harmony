import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'vutera-auth-session';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const response = NextResponse.next();

  if (token) {
    response.headers.set('x-vutera-authenticated', 'true');
  } else {
    // If user tries to access protected premium pages on AnMenh without login
    // we might want to redirect them to auth.vutera.net/login
    const { pathname } = request.nextUrl;
    
    // Example: protect dashboard or deep analysis pages
    const protectedPaths = ['/dashboard', '/premium'];
    if (protectedPaths.some(path => pathname.startsWith(path))) {
       const loginUrl = new URL('https://auth.vutera.net/login', request.url);
       loginUrl.searchParams.set('redirect', request.url);
       return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
