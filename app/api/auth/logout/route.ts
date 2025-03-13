import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  
  // Delete the user session cookie
  cookieStore.delete('user_session');

  return NextResponse.json({ success: true });
}
