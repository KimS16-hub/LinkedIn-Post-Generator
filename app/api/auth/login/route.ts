import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let password: string | undefined;
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password;
  } catch {
    return NextResponse.json({ error: 'Ugyldigt request' }, { status: 400 });
  }

  if (!password || password !== process.env.APP_PASSWORD) {
    return NextResponse.json({ error: 'Forkert kodeord' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('auth_session', process.env.APP_SECRET ?? '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  return response;
}
