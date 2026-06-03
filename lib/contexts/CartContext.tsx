'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, ProductOption, GuaranteeOption } from '@/types/product';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedOption?: ProductOption;
  selectedGuarantee?: GuaranteeOption;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, variant?: ProductVariant, option?: ProductOption, guarantee?: GuaranteeOption) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addToCart = (product: Product, quantity: number, variant?: ProductVariant, option?: ProductOption, guarantee?: GuaranteeOption) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          (!variant ? !item.selectedVariant : item.selectedVariant?.id === variant.id) &&
          (!option ? !item.selectedOption : item.selectedOption?.id === option.id) &&
          (!guarantee ? !item.selectedGuarantee : item.selectedGuarantee?.id === guarantee.id)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          id: `${product.id}-${variant?.id || 'base'}-${option?.id || 'noopt'}-${guarantee?.id || 'noguar'}`,
          product,
          quantity,
          selectedVariant: variant,
          selectedOption: option,
          selectedGuarantee: guarantee,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => {
    // Use guarantee total price if available, otherwise use variant price, otherwise use product price
    let itemPrice: number;
    if (item.selectedGuarantee?.total_price) {
      itemPrice = item.selectedGuarantee.total_price;
    } else if (item.selectedOption?.price) {
      itemPrice = item.selectedOption.price;
    } else if (item.selectedVariant?.price) {
      itemPrice = item.selectedVariant.price;
    } else {
      itemPrice = item.product.price;
    }
    return sum + itemPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
