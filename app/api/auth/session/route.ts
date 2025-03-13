import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function GET() {
  const cookieStore = cookies();
  const userSession = cookieStore.get('user_session');

  if (!userSession?.value) {
    return NextResponse.json({ user: null });
  }

  try {
    const sessionData = JSON.parse(userSession.value);
    const user = await workos.userManagement.getUser(sessionData.id);
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Failed to get user from WorkOS:', error);
    return NextResponse.json({ user: null });
  }
}
