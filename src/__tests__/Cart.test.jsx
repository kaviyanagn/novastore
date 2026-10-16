import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Cart from '../components/Cart';
import { renderWithProviders } from '../test-utils';

const mockCartItems = [
  {
    product: {
      id: 101,
      name: 'Sony WH-1000XM5 Wireless Headphones',
      brand: 'Sony',
      price: 349.99,
      image: 'https://example.com/sony.jpg',
      stockCount: 10,
    },
    quantity: 2,
  },
  {
    product: {
      id: 103,
      name: 'Nike Air Max 270 Sneakers',
      brand: 'Nike',
      price: 160.00,
      image: 'https://example.com/nike.jpg',
      stockCount: 5,
    },
    quantity: 1,
  },
];

describe('Cart Component', () => {
  it('does not render anything when isOpen is false', () => {
    renderWithProviders(<Cart isOpen={false} cartItems={mockCartItems} />);
    expect(screen.queryByText('Your Shopping Cart')).not.toBeInTheDocument();
  });

  it('displays empty state message when cartItems is empty', () => {
    renderWithProviders(<Cart isOpen={true} cartItems={[]} />);

    expect(screen.getByText('Your Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText(/Looks like you haven't added any products/i)).toBeInTheDocument();
  });

  it('renders cart items with correct name, quantity, individual price, and line total', () => {
    renderWithProviders(<Cart isOpen={true} cartItems={mockCartItems} />);

    expect(screen.getByText('Sony WH-1000XM5 Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('Nike Air Max 270 Sneakers')).toBeInTheDocument();

    // Quantities displayed
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    // Line totals: 349.99 * 2 = 699.98, and 160.00 unit & line price
    expect(screen.getByText('$699.98')).toBeInTheDocument();
    expect(screen.getAllByText('$160.00').length).toBe(2);
  });

  it('calls onUpdateQuantity when quantity buttons (+ and -) are clicked', () => {
    const handleUpdateQuantity = jest.fn();

    renderWithProviders(
      <Cart
        isOpen={true}
        cartItems={mockCartItems}
        onUpdateQuantity={handleUpdateQuantity}
      />
    );

    const increaseButtons = screen.getAllByTitle('Increase quantity');
    const decreaseButtons = screen.getAllByTitle('Decrease quantity');

    // Click + for first item
    fireEvent.click(increaseButtons[0]);
    expect(handleUpdateQuantity).toHaveBeenCalledWith(101, 1);

    // Click - for first item
    fireEvent.click(decreaseButtons[0]);
    expect(handleUpdateQuantity).toHaveBeenCalledWith(101, -1);
  });

  it('calls onRemoveFromCart when remove trash button is clicked', () => {
    const handleRemoveFromCart = jest.fn();

    renderWithProviders(
      <Cart
        isOpen={true}
        cartItems={mockCartItems}
        onRemoveFromCart={handleRemoveFromCart}
      />
    );

    const removeButtons = screen.getAllByTitle('Remove item');
    fireEvent.click(removeButtons[0]);

    expect(handleRemoveFromCart).toHaveBeenCalledWith(101);
  });

  it('calls onClearCart when "Clear All Cart Items" button is clicked', () => {
    const handleClearCart = jest.fn();

    renderWithProviders(
      <Cart
        isOpen={true}
        cartItems={mockCartItems}
        onClearCart={handleClearCart}
      />
    );

    const clearButton = screen.getByText('Clear All Cart Items');
    fireEvent.click(clearButton);

    expect(handleClearCart).toHaveBeenCalledTimes(1);
  });

  it('correctly calculates subtotal and grants free delivery for orders >= $50', () => {
    // subtotal = 349.99 * 2 + 160.00 = 859.98
    renderWithProviders(
      <Cart
        isOpen={true}
        cartItems={mockCartItems}
      />
    );

    expect(screen.getAllByText('$859.98').length).toBeGreaterThanOrEqual(1);
    // Delivery should show FREE (Over $50)
    expect(screen.getByText(/FREE \(Over \$50\)/i)).toBeInTheDocument();
  });

  it('calculates delivery fee of $9.99 for orders under $50', () => {
    const lowCostItem = [
      {
        product: {
          id: 201,
          name: 'Screen Cleaner',
          price: 25.00,
          image: '',
          stockCount: 10,
        },
        quantity: 1,
      }
    ];

    renderWithProviders(
      <Cart
        isOpen={true}
        cartItems={lowCostItem}
      />
    );

    expect(screen.getAllByText('$25.00').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    // Total = 25.00 + 9.99 = 34.99
    expect(screen.getByText('$34.99')).toBeInTheDocument();
  });

  it('calls onProceedToCheckout when checkout button is clicked', () => {
    const handleProceed = jest.fn();

    renderWithProviders(
      <Cart
        isOpen={true}
        cartItems={mockCartItems}
        onProceedToCheckout={handleProceed}
      />
    );

    const checkoutButton = screen.getByRole('button', { name: /Proceed to Checkout/i });
    fireEvent.click(checkoutButton);

    expect(handleProceed).toHaveBeenCalledTimes(1);
  });
});
