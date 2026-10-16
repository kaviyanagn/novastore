import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Checkout from '../components/Checkout';
import { renderWithProviders } from '../test-utils';

const mockCartItems = [
  {
    product: {
      id: 101,
      name: 'Sony WH-1000XM5 Wireless Headphones',
      price: 349.99,
      image: 'https://example.com/sony.jpg',
    },
    quantity: 1,
  },
  {
    product: {
      id: 103,
      name: 'Nike Air Max 270 Sneakers',
      price: 160.00,
      image: 'https://example.com/nike.jpg',
    },
    quantity: 1,
  },
];

describe('Checkout Component', () => {
  it('does not render when isOpen is false', () => {
    renderWithProviders(<Checkout isOpen={false} cartItems={mockCartItems} />);
    expect(screen.queryByText('Customer & Delivery Information')).not.toBeInTheDocument();
  });

  it('renders checkout modal with form fields and order summary totals', () => {
    renderWithProviders(
      <Checkout
        isOpen={true}
        cartItems={mockCartItems}
      />
    );

    expect(screen.getByText('Customer & Delivery Information')).toBeInTheDocument();
    expect(screen.getByText('Order Summary (2 items)')).toBeInTheDocument();

    // Check form inputs
    expect(screen.getByPlaceholderText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+1 (555) 000-0000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('742 Evergreen Terrace')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Springfield')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('97477')).toBeInTheDocument();

    // Check financial calculations: subtotal = 349.99 + 160.00 = 509.99 (Subtotal & Total charges)
    expect(screen.getAllByText('$509.99').length).toBe(2);
    expect(screen.getByText('FREE')).toBeInTheDocument();
  });

  it('displays validation errors when submitting an empty form', () => {
    renderWithProviders(
      <Checkout
        isOpen={true}
        cartItems={mockCartItems}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /Place Order/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Full name is required')).toBeInTheDocument();
    expect(screen.getByText('Valid email is required')).toBeInTheDocument();
    expect(screen.getByText('Phone number is required')).toBeInTheDocument();
    expect(screen.getByText('Shipping address is required')).toBeInTheDocument();
    expect(screen.getByText('City is required')).toBeInTheDocument();
    expect(screen.getByText('Zip code is required')).toBeInTheDocument();
  });

  it('allows changing payment method', () => {
    renderWithProviders(
      <Checkout
        isOpen={true}
        cartItems={mockCartItems}
      />
    );

    const upiButton = screen.getByRole('button', { name: /UPI \/ NetBanking/i });
    fireEvent.click(upiButton);

    // Button should now be selected with active styles
    expect(upiButton.className).toContain('border-amber-400');
  });

  it('submits successfully with valid details and displays confirmation', () => {
    const handleOrderSuccess = jest.fn();

    renderWithProviders(
      <Checkout
        isOpen={true}
        cartItems={mockCartItems}
        onOrderSuccess={handleOrderSuccess}
      />
    );

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('Jane Doe'), {
      target: { name: 'fullName', value: 'Alex Morgan' },
    });
    fireEvent.change(screen.getByPlaceholderText('jane@example.com'), {
      target: { name: 'email', value: 'alex@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('+1 (555) 000-0000'), {
      target: { name: 'phone', value: '+1 555 123 4567' },
    });
    fireEvent.change(screen.getByPlaceholderText('742 Evergreen Terrace'), {
      target: { name: 'address', value: '123 Golden Avenue' },
    });
    fireEvent.change(screen.getByPlaceholderText('Springfield'), {
      target: { name: 'city', value: 'San Francisco' },
    });
    fireEvent.change(screen.getByPlaceholderText('97477'), {
      target: { name: 'zipCode', value: '94101' },
    });

    const submitBtn = screen.getByRole('button', { name: /Place Order/i });
    fireEvent.click(submitBtn);

    // Order confirmation should now be displayed
    expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
    expect(screen.getByText(/Alex Morgan/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Golden Avenue, San Francisco/i)).toBeInTheDocument();
    expect(handleOrderSuccess).toHaveBeenCalledTimes(1);
  });
});
