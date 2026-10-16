export const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Footwear",
  "Home & Living",
  "Accessories"
];

export const BRANDS = [
  "All",
  "Apple",
  "Asakuki",
  "Fable",
  "Herman Miller",
  "Levi's",
  "LG",
  "Loro Piana",
  "Nike",
  "Ray-Ban",
  "Sony",
  "Vincero"
];

export const INITIAL_PRODUCTS = [
  {
    id: 101,
    name: "Sony WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    category: "Electronics",
    price: 349.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviewsCount: 1420,
    inStock: true,
    stockCount: 18,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Industry-leading noise canceling headphones with two processors and 8 microphones for unprecedented sound quality and crystal clear hands-free calls.",
    specs: {
      Battery: "30 Hours",
      Connectivity: "Bluetooth 5.2",
      Weight: "250g",
      Warranty: "1 Year"
    }
  },
  {
    id: 102,
    name: "Apple MacBook Air M3 (15-inch)",
    brand: "Apple",
    category: "Electronics",
    price: 1299.00,
    originalPrice: 1399.00,
    rating: 4.9,
    reviewsCount: 980,
    inStock: true,
    stockCount: 8,
    badge: "Featured",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    description: "Supercharged by the next-generation M3 chip, MacBook Air delivers incredible performance and up to 18 hours of battery life inside an ultra-slim aluminum body.",
    specs: {
      Display: "15.3-inch Liquid Retina",
      Chip: "Apple M3 (8-core CPU)",
      Memory: "16GB Unified",
      Storage: "512GB SSD"
    }
  },
  {
    id: 103,
    name: "Nike Air Jordan 1 Retro High OG",
    brand: "Nike",
    category: "Footwear",
    price: 189.95,
    originalPrice: 220.00,
    rating: 4.7,
    reviewsCount: 3120,
    inStock: true,
    stockCount: 12,
    badge: "Hot Deal",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    description: "A timeless classic sneaker crafted from genuine leather with iconic Air cushioning in the sole for unparalleled street style and everyday comfort.",
    specs: {
      Upper: "Full-Grain Leather",
      Sole: "Rubber Cupsole",
      Closure: "Lace-up",
      Origin: "Imported"
    }
  },
  {
    id: 104,
    name: "Minimalist Italian Leather Chronograph",
    brand: "Vincero",
    category: "Accessories",
    price: 145.00,
    originalPrice: 195.00,
    rating: 4.6,
    reviewsCount: 640,
    inStock: true,
    stockCount: 25,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Sophisticated analog chronograph watch featuring surgical-grade stainless steel case, genuine Italian leather strap, and Japanese quartz precision movement.",
    specs: {
      CaseDiameter: "42mm",
      WaterResistance: "50m (5 ATM)",
      Strap: "Genuine Leather",
      Glass: "Sapphire Coated"
    }
  },
  {
    id: 105,
    name: "Premium Ergonomic Office Chair",
    brand: "Herman Miller",
    category: "Home & Living",
    price: 320.00,
    originalPrice: 420.00,
    rating: 4.5,
    reviewsCount: 420,
    inStock: false,
    stockCount: 0,
    badge: "Sold Out",
    image: "https://images.unsplash.com/photo-1580481077197-28d8442a03ee?auto=format&fit=crop&w=800&q=80",
    description: "Engineered for full day posture support with breathable mesh back, 3D adjustable armrests, dynamic lumbar support, and heavy-duty gas lift.",
    specs: {
      MaxLoad: "150 kg",
      Recline: "90° - 135°",
      Material: "Breathable ElastoMesh",
      Base: "Polished Aluminum"
    }
  },
  {
    id: 106,
    name: "Smart Ceramic Aroma Diffuser & Humidifier",
    brand: "Asakuki",
    category: "Home & Living",
    price: 58.50,
    originalPrice: 75.00,
    rating: 4.4,
    reviewsCount: 530,
    inStock: true,
    stockCount: 34,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    description: "Ultrasonic cool mist essential oil diffuser featuring handcrafted matte ceramic housing, soothing ambient ambient LED glow, and auto-shutoff safety timer.",
    specs: {
      Capacity: "300ml",
      Coverage: "400 sq.ft",
      Modes: "Continuous / Intermittent",
      Timer: "1h, 3h, 6h"
    }
  },
  {
    id: 107,
    name: "Classic Denim Trucker Jacket",
    brand: "Levi's",
    category: "Fashion",
    price: 89.00,
    originalPrice: 110.00,
    rating: 4.6,
    reviewsCount: 880,
    inStock: true,
    stockCount: 15,
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    description: "Authentic 100% cotton rigid denim jacket tailored with dual chest flap pockets, antique bronze buttons, and side welt pockets for an effortless silhouette.",
    specs: {
      Fabric: "100% Cotton Denim",
      Fit: "Regular Straight Fit",
      Care: "Machine wash cold",
      Closure: "Button Front"
    }
  },
  {
    id: 108,
    name: "Ultra-Lightweight Carbon Running Shoes",
    brand: "Nike",
    category: "Footwear",
    price: 160.00,
    originalPrice: 190.00,
    rating: 4.7,
    reviewsCount: 1120,
    inStock: true,
    stockCount: 9,
    badge: "Performance",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description: "Marathon-ready road running shoes featuring full-length carbon fiber propulsive plate, high-rebound nitrogen-infused foam, and engineered breathable mesh.",
    specs: {
      Drop: "8mm",
      Weight: "198g",
      Pace: "Tempo & Race Day",
      Upper: "FlyKnit Mesh"
    }
  },
  {
    id: 109,
    name: "Smart 4K Ultra-HD OLED 55-inch TV",
    brand: "LG",
    category: "Electronics",
    price: 1150.00,
    originalPrice: 1400.00,
    rating: 4.9,
    reviewsCount: 780,
    inStock: true,
    stockCount: 5,
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
    description: "Infinite contrast, self-lit pixels, Dolby Vision IQ, and Dolby Atmos audio give you a truly immersive cinematic theater experience right in your living room.",
    specs: {
      Resolution: "3840 x 2160 (4K)",
      RefreshRate: "120Hz VRR",
      HDR: "Dolby Vision, HDR10+",
      Audio: "40W 2.2 Channel"
    }
  },
  {
    id: 110,
    name: "Handmade Polarized Acetate Sunglasses",
    brand: "Ray-Ban",
    category: "Accessories",
    price: 79.99,
    originalPrice: 99.00,
    rating: 4.5,
    reviewsCount: 340,
    inStock: true,
    stockCount: 22,
    badge: "Summer Pick",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    description: "Premium handcrafted Italian acetate frame with polarized UV400 scratch-resistant lenses eliminating glare while maintaining authentic true color definition.",
    specs: {
      UVProtection: "100% UV400",
      Frame: "Handmade Acetate",
      Hinges: "5-Barrel Stainless",
      Case: "Hard Shell Leather Included"
    }
  },
  {
    id: 111,
    name: "Organic Cashmere Wool Crewneck Sweater",
    brand: "Loro Piana",
    category: "Fashion",
    price: 135.00,
    originalPrice: 175.00,
    rating: 4.8,
    reviewsCount: 460,
    inStock: true,
    stockCount: 14,
    badge: "Luxury",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
    description: "Finely spun from sustainably sourced Grade-A Mongolian cashmere. Luxuriously soft against the skin, naturally temperature-regulating, and pill-resistant.",
    specs: {
      Material: "100% Mongolian Cashmere",
      Yarn: "2-ply tightly twisted",
      Fit: "Tailored Comfort",
      Care: "Dry clean or hand wash"
    }
  },
  {
    id: 112,
    name: "Handcrafted Ceramic Dinnerware 16-Piece Set",
    brand: "Fable",
    category: "Home & Living",
    price: 119.00,
    originalPrice: 159.00,
    rating: 4.6,
    reviewsCount: 290,
    inStock: true,
    stockCount: 11,
    badge: "Artisan",
    image: "https://images.unsplash.com/photo-1614735241165-6756e1df61ab?auto=format&fit=crop&w=800&q=80",
    description: "Stoneware pottery set featuring matte speckled glaze finish. Microwave and dishwasher safe, crafted to elevate daily dining and dinner party entertaining.",
    specs: {
      Pieces: "4 Bowls, 4 Mugs, 4 Plates, 4 Salad Plates",
      Safety: "Lead-Free, Food Safe",
      Finish: "Matte Speckled Glaze",
      Care: "Dishwasher & Microwave Safe"
    }
  }
];

export const PROMO_CODES = {
  SAVE10: 0.10, // 10% off
  SAVE20: 0.20, // 20% off
  WELCOME50: 50 // $50 flat off on orders > $150
};
