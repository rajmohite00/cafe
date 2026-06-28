'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface MenuItem {
  slug: string;
  name: string;
  desc: string;
  longDesc: string;
  price: number;      // in ₹
  img: string;        // path or emoji fallback
  badge?: string;
  category: string;
  calories: string;
  prepTime: string;
  isVeg: boolean;
  ingredients: string[];
  rating: number;
  reviews: number;
  isAvailable?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; item: MenuItem }
  | { type: 'REMOVE_ITEM'; slug: string }
  | { type: 'UPDATE_QTY'; slug: string; quantity: number }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.slug === action.item.slug);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.slug === action.item.slug ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.slug !== action.slug) };
    case 'UPDATE_QTY':
      if (action.quantity <= 0) {
        return { items: state.items.filter(i => i.slug !== action.slug) };
      }
      return {
        items: state.items.map(i =>
          i.slug === action.slug ? { ...i, quantity: action.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: MenuItem) => void;
  removeItem: (slug: string) => void;
  updateQty: (slug: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('raj_cafe_cart');
        return saved ? JSON.parse(saved) : { items: [] };
      } catch {
        return { items: [] };
      }
    }
    return { items: [] };
  });

  useEffect(() => {
    localStorage.setItem('raj_cafe_cart', JSON.stringify(state));
  }, [state]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      totalItems,
      totalPrice,
      addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
      removeItem: (slug) => dispatch({ type: 'REMOVE_ITEM', slug }),
      updateQty: (slug, quantity) => dispatch({ type: 'UPDATE_QTY', slug, quantity }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
