import { renderHook, act } from '@testing-library/react';
import { useCart } from '../hooks/useCart';

const productA = {
  id: 101,
  name: 'Sony WH-1000XM5 Wireless Headphones',
  price: 100.0,
  stockCount: 5,
};

const productB = {
  id: 102,
  name: 'Apple MacBook Air M3',
  price: 30.0,
  stockCount: 10,
};

describe('useCart Hook Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    // Clear URL parameters
    window.history.pushState({}, '', '/');
  });

  it('initializes with empty cart items by default', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.cartItemCount).toBe(0);
    expect(result.current.cartSubtotal).toBe(0);
    expect(result.current.deliveryFee).toBe(0);
    expect(result.current.finalTotal).toBe(0);
  });

  it('adds items to the cart using addToCart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(productA, 1);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].product.id).toBe(101);
    expect(result.current.cartItems[0].quantity).toBe(1);
    expect(result.current.cartItemCount).toBe(1);
    expect(result.current.cartSubtotal).toBe(100.0);
  });

  it('increments quantity when adding an existing item again', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(productA, 1);
    });
    act(() => {
      result.current.addToCart(productA, 2);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(3);
    expect(result.current.cartItemCount).toBe(3);
    expect(result.current.cartSubtotal).toBe(300.0);
  });

  it('removes item from cart using removeFromCart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(productA, 1);
      result.current.addToCart(productB, 1);
    });
    expect(result.current.cartItems).toHaveLength(2);

    act(() => {
      result.current.removeFromCart(101);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].product.id).toBe(102);
    expect(result.current.cartSubtotal).toBe(30.0);
  });

  it('modifies quantity using updateQuantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(productA, 2);
    });

    // Increment
    act(() => {
      result.current.updateQuantity(101, 1);
    });
    expect(result.current.cartItems[0].quantity).toBe(3);

    // Decrement
    act(() => {
      result.current.updateQuantity(101, -1);
    });
    expect(result.current.cartItems[0].quantity).toBe(2);

    // Decrement to zero removes item
    act(() => {
      result.current.updateQuantity(101, -2);
    });
    expect(result.current.cartItems).toHaveLength(0);
  });

  it('clears all items from cart using clearCart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(productA, 2);
      result.current.addToCart(productB, 1);
    });
    expect(result.current.cartItems).toHaveLength(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.cartSubtotal).toBe(0);
  });

  it('correctly calculates total with delivery fee and promo discount', () => {
    const { result } = renderHook(() => useCart());

    // Single item of $30 (< $50) should incur $9.99 delivery fee
    act(() => {
      result.current.addToCart(productB, 1);
    });
    expect(result.current.cartSubtotal).toBe(30.0);
    expect(result.current.deliveryFee).toBe(9.99);
    expect(result.current.finalTotal).toBe(39.99);

    // Adding item of $100 -> subtotal = 130 (>= 50) -> free delivery fee
    act(() => {
      result.current.addToCart(productA, 1);
    });
    expect(result.current.cartSubtotal).toBe(130.0);
    expect(result.current.deliveryFee).toBe(0);
    expect(result.current.finalTotal).toBe(130.0);

    // Apply SAVE20 (20% off) -> discount = 26.00, total = 104.00
    act(() => {
      result.current.applyCoupon('SAVE20');
    });
    expect(result.current.appliedCoupon).toBe('SAVE20');
    expect(result.current.cartDiscount).toBe(26.0);
    expect(result.current.finalTotal).toBe(104.0);
  });
});
