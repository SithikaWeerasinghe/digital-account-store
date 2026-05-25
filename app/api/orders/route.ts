import { NextResponse } from 'next/server';
import * as orderService from '@/lib/services/orderService';

export async function GET() {
  try {
    const orders = await orderService.getOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Extract input parameters
    const { customerEmail, productId, quantity, paymentMethod } = body;
    
    // Create new order using order service layer
    const newOrder = await orderService.createOrder({
      customerEmail,
      productId,
      quantity: Number(quantity || 1),
      paymentMethod
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to process checkout order' },
      { status: 400 }
    );
  }
}
