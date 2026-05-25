import { NextResponse } from 'next/server';
import * as productService from '@/lib/services/productService';

export async function GET() {
  try {
    const products = await productService.getProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In the future, this will run: productService.createProduct(body)
    return NextResponse.json(
      { success: true, data: { message: 'Product creation placeholder', product: body } },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create product' },
      { status: 400 }
    );
  }
}

