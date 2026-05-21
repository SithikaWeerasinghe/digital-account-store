import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  
  if (body.email === 'admin@example.com' && body.password === 'password123') {
    return NextResponse.json({ message: 'Login successful', token: 'mock-token' }, { status: 200 });
  }
  
  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}
