import { NextResponse } from 'next/server';
import * as productService from '@/lib/services/productService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Admin lists pass ?all=true to include archived (is_active=false) products.
    // Public callers omit it and receive active products only.
    const includeInactive = new URL(request.url).searchParams.get('all') === 'true';
    const products = await productService.getProducts(includeInactive);
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
    const product = await productService.createProduct(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create product' },
      { status: 400 }
    );
  }
}

