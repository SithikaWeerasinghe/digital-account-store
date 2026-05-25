import { NextResponse } from 'next/server';
import * as adminService from '@/lib/services/adminService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const result = await adminService.mockAdminLogin(email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication error occurred' },
      { status: 500 }
    );
  }
}

