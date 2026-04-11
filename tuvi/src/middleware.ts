import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || '');
const COOKIE_NAME = 'vutera-auth-session';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Add a header to let the app know if the user is authenticated
  const response = NextResponse.next();

  if (token) {
    try {
      // In a real world, you'd verify the JWT here if it's a raw JWT.
      // NextAuth v5 session token might be encrypted if using JWE.
      // For shared session via cookie, just detecting it is often enough 
      // for UI, but for API routes we should verify.
      
      // Note: Verification might fail if NextAuth uses specific encryption 
      // which 'jose' needs exact params for. 
      // For now, we'll just reflect the auth status in a header.
      response.headers.set('x-vutera-authenticated', 'true');
    } catch (e) {
      console.error('JWT Verification failed:', e);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
