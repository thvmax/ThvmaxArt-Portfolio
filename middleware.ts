import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/adminSession';

// Gate every admin page and admin API route behind the session cookie.
// The login page and login endpoint stay open.

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const valid = token ? await verifySessionToken(token) : false;
  if (valid) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }
  const login = req.nextUrl.clone();
  login.pathname = '/admin/login';
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
