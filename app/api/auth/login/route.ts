import { NextResponse } from 'next/server';
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const userType = searchParams.get('userType');

  if (!userType || !['employer', 'job_seeker'].includes(userType)) {
    return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
  }

  try {
    const authorizationUrl = await workos.sso.getAuthorizationUrl({
      clientId: process.env.WORKOS_CLIENT_ID!,
      redirectUri: process.env.WORKOS_REDIRECT_URI!,
      state: userType, // Store user type in state for callback
    });

    return NextResponse.json({ url: authorizationUrl });
  } catch (error) {
    console.error('Failed to generate authorization URL:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Forward the login request to Flask backend
    const response = await fetch('http://127.0.0.1:5328/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    
    // Set the JWT token as an HTTP-only cookie
    const headers = new Headers();
    headers.append('Set-Cookie', `auth_token=${data.token}; HttpOnly; Path=/; SameSite=Lax`);

    return NextResponse.json({ user: data.user }, { headers });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
