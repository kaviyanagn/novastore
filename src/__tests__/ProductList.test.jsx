import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import ProductList from '../components/ProductList';
import { renderWithProviders } from '../test-utils';

const mockProducts = [
  {
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
    image: 'https://example.com/sony.jpg'
  },
  {
    id: 102,
    name: 'Apple MacBook Air M3 (15-inch)',
    brand: 'Apple',
    category: 'Electronics',
    price: 1299.00,
    originalPrice: 1399.00,
    rating: 4.9,
    reviewsCount: 980,
    inStock: true,
    stockCount: 8,
    badge: 'Featured',
    image: 'https://example.com/macbook.jpg'
  },
  {
    id: 103,
    name: 'Nike Air Max 270 Sneakers',
    brand: 'Nike',
    category: 'Footwear',
    price: 160.00,
    originalPrice: 190.00,
    rating: 4.7,
    reviewsCount: 840,
    inStock: false,
    stockCount: 0,
    badge: 'Trending',
    image: 'https://example.com/nike.jpg'
  }
];

describe('ProductList Component', () => {
  it('renders products and displays correct item count and category header', () => {
    renderWithProviders(
      <ProductList
        products={mockProducts}
        isLoading={false}
        selectedCategory="All"
      />
    );

    expect(screen.getByRole('heading', { name: 'All Golden Collections' })).toBeInTheDocument();
    expect(screen.getByText('(3 items available)')).toBeInTheDocument();
    expect(screen.getByText('Sony WH-1000XM5 Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('Apple MacBook Air M3 (15-inch)')).toBeInTheDocument();
    expect(screen.getByText('Nike Air Max 270 Sneakers')).toBeInTheDocument();
  });

  it('renders category-specific title when selectedCategory is provided', () => {
    renderWithProviders(
      <ProductList
        products={[mockProducts[0], mockProducts[1]]}
        isLoading={false}
        selectedCategory="Electronics"
      />
    );

    expect(screen.getByRole('heading', { name: 'Electronics' })).toBeInTheDocument();
    expect(screen.getByText('(2 items available)')).toBeInTheDocument();
  });

  it('displays active filter badges for search, brand, price, rating, and stock', () => {
    renderWithProviders(
      <ProductList
        products={mockProducts}
        isLoading={false}
        selectedCategory="Electronics"
        searchQuery="Sony"
        selectedBrand="Sony"
        filters={{
          maxPrice: 500,
          minRating: 4,
          inStockOnly: true
        }}
      />
    );

    expect(screen.getByText('Search: "Sony"')).toBeInTheDocument();
    expect(screen.getByText('Brand: Sony')).toBeInTheDocument();
    expect(screen.getByText('Under $500')).toBeInTheDocument();
    expect(screen.getByText('4★ & above')).toBeInTheDocument();
    expect(screen.getByText('In-Stock Only')).toBeInTheDocument();
  });

  it('displays "No products found" message and reset button when filtered list is empty', () => {
    const handleReset = jest.fn();

    renderWithProviders(
      <ProductList
        products={[]}
        isLoading={false}
        selectedCategory="Fashion"
        onResetFilters={handleReset}
      />
    );

    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(screen.getByText(/No products match your active search keyword/i)).toBeInTheDocument();

    const resetButton = screen.getByRole('button', { name: /Reset All Filters/i });
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('renders loading skeleton state when isLoading is true', () => {
    const { container } = renderWithProviders(
      <ProductList
        products={mockProducts}
        isLoading={true}
        selectedCategory="All"
      />
    );

    const skeletonCards = container.querySelectorAll('.animate-pulse');
    expect(skeletonCards.length).toBeGreaterThan(0);
    expect(screen.queryByText('Sony WH-1000XM5 Wireless Headphones')).not.toBeInTheDocument();
  });

  it('passes onAddToCart callback to child ProductCard components', () => {
    const handleAddToCart = jest.fn();

    renderWithProviders(
      <ProductList
        products={[mockProducts[0]]}
        isLoading={false}
        selectedCategory="All"
        onAddToCart={handleAddToCart}
      />
    );

    const addToCartButton = screen.getByRole('button', { name: /\+ Cart/i });
    fireEvent.click(addToCartButton);

    expect(handleAddToCart).toHaveBeenCalledWith(mockProducts[0]);
  });
});
