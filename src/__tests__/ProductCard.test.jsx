import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard';
import { renderWithProviders } from '../test-utils';

const mockProduct = {
  id: 101,
  name: 'Sony WH-1000XM5 Wireless Headphones',
  brand: 'Sony',
  category: 'Electronics',
  price: 349.99,
  originalPrice: 399.99,
  rating: 4.8,
  reviewsCount: 1420,
  inStock: true,
  stockCount: 18,
  badge: 'Best Seller',
  image: 'https://example.com/sony.jpg',
  description: 'Industry-leading noise canceling headphones.'
};

describe('ProductCard Component', () => {
  it('renders product details correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Sony WH-1000XM5 Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('Sony')).toBeInTheDocument();
    expect(screen.getByText('$349.99')).toBeInTheDocument();
    expect(screen.getByText('$399.99')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('Best Seller')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('renders "Out of Stock" when product is not in stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    renderWithProviders(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('calls onAddToCart callback when "+ Cart" button is clicked', () => {
    const handleAddToCart = jest.fn();
    renderWithProviders(<ProductCard product={mockProduct} onAddToCart={handleAddToCart} />);

    const addToCartButton = screen.getByRole('button', { name: /\+ Cart/i });
    fireEvent.click(addToCartButton);

    expect(handleAddToCart).toHaveBeenCalledTimes(1);
    expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('calls cart context addToCart when onAddToCart prop is not provided', () => {
    const mockAddToCart = jest.fn();
    renderWithProviders(
      <ProductCard product={mockProduct} />,
      { cartValue: { addToCart: mockAddToCart, cartItems: [] } }
    );

    const addToCartButton = screen.getByRole('button', { name: /\+ Cart/i });
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('displays "Added (N)" indicator when product already exists in the cart', () => {
    renderWithProviders(
      <ProductCard product={mockProduct} />,
      {
        cartValue: {
          cartItems: [{ product: mockProduct, quantity: 3 }],
          addToCart: jest.fn(),
        }
      }
    );

    expect(screen.getByText('Added (3)')).toBeInTheDocument();
  });

  it('triggers onSelectProduct when "Details" button is clicked', () => {
    const handleSelectProduct = jest.fn();
    renderWithProviders(<ProductCard product={mockProduct} onSelectProduct={handleSelectProduct} />);

    const detailsButton = screen.getByRole('button', { name: /Details/i });
    fireEvent.click(detailsButton);

    expect(handleSelectProduct).toHaveBeenCalledTimes(1);
    expect(handleSelectProduct).toHaveBeenCalledWith(mockProduct);
  });
});
