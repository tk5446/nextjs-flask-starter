import { NextResponse } from 'next/server';

export async function GET() {
  // Example of calling Flask backend from Next.js API
  const response = await fetch('http://127.0.0.1:5328/api/python');
  const data = await response.text();
  
  return NextResponse.json({ 
    message: 'Hello from Next.js API!',
    flaskData: data 
  });
}
