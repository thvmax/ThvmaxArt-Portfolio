import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from '@/lib/adminSession';

// Constant-time string comparison; length is padded so unequal lengths
// don't short-circuit faster than equal ones.
function safeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length, 1);
  const bufA = Buffer.alloc(len);
  const bufB = Buffer.alloc(len);
  bufA.write(a);
  bufB.write(b);
  return timingSafeEqual(bufA, bufB) && a.length === b.length;
}

export async function POST(req: NextRequest) {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) {
    return NextResponse.json(
      { error: 'Admin credentials are not configured (ADMIN_USER / ADMIN_PASSWORD).' },
      { status: 500 },
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const userOk = safeEqual(body.username ?? '', expectedUser);
  const passOk = safeEqual(body.password ?? '', expectedPass);
  if (!userOk || !passOk) {
    // Small fixed delay to blunt brute-force attempts.
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: 'Wrong username or password.' }, { status: 401 });
  }

  const token = await createSessionToken(expectedUser);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
