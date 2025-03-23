import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_KEY!;

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');

  if (!token?.value) {
    return NextResponse.json({ user: null });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token.value, JWT_SECRET);
    
    // Assuming the token contains user information
    return NextResponse.json({ user: decoded });
  } catch (error) {
    console.error('Failed to verify JWT:', error);
    return NextResponse.json({ user: null });
  }
}