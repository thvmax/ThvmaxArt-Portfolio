// Session helpers for the admin panel. A logged-in admin holds an
// httpOnly cookie containing a short JWT signed with SESSION_SECRET.
// Used by both the login route (sign) and middleware (verify), so it
// must stay edge-runtime compatible (jose only, no node crypto).

import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'thvmax_admin';
const SESSION_DAYS = 7;

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('SESSION_SECRET env var missing or too short (16+ chars required)');
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(username: string): Promise<string> {
  return new SignJWT({ sub: username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secretKey());
    return true;
  } catch {
    return false;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};
