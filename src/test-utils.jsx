import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartContext } from './context/CartContextInstance';

export const defaultMockCart = {
  cartItems: [],
  isCartOpen: true,
  setIsCartOpen: jest.fn(),
  isCheckoutOpen: true,
  setIsCheckoutOpen: jest.fn(),
  couponCode: 'SAVE20',
  setCouponCode: jest.fn(),
  appliedCoupon: null,
  setAppliedCoupon: jest.fn(),
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  applyCoupon: jest.fn(),
  removeCoupon: jest.fn(),
  proceedToCheckout: jest.fn(),
  cartCount: 0,
  cartSubtotal: 0,
  discount: 0,
  deliveryFee: 0,
  totalCharges: 0,
};

export function renderWithProviders(ui, { cartValue = {}, ...renderOptions } = {}) {
  const value = { ...defaultMockCart, ...cartValue };
  return {
    ...render(
      <CartContext.Provider value={value}>
        <MemoryRouter>
          {ui}
        </MemoryRouter>
      </CartContext.Provider>,
      renderOptions
    ),
    cartValue: value,
  };
}
