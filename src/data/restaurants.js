/**
 * Mock Data for Restaurant Search and Table Reservation System
 */
export const LOCATIONS = ["All Locations", "Downtown", "Midtown", "Uptown", "Waterfront", "Westside"];

export const CUISINES = ["All Cuisines", "Italian", "Japanese", "Indian", "French", "Mexican", "American"];

export const DEFAULT_TIME_SLOTS = [
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM"
];

export const INITIAL_RESTAURANTS = [
  {
    id: "101",
    name: "L'Aura Osteria & Wine Bar",
    cuisine: "Italian",
    location: "Downtown",
    rating: 4.9,
    reviewsCount: 420,
    priceRange: "$$$",
    address: "142 Grand Street, Downtown",
    phone: "+1 (555) 782-9011",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    description: "Authentic wood-fired pasta and Tuscan wines in an intimate, candlelit ambiance.",
    operatingHours: "12:00 PM - 10:30 PM",
    availableTimeSlots: ["12:30 PM", "01:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:30 PM"],
    tables: [
      { id: "T1", number: 1, capacity: 2, type: "Window Table", isAvailable: true },
      { id: "T2", number: 2, capacity: 2, type: "Romantic Corner", isAvailable: true },
      { id: "T3", number: 3, capacity: 4, type: "Central Booth", isAvailable: true },
      { id: "T4", number: 4, capacity: 4, type: "Wine Wall", isAvailable: false },
      { id: "T5", number: 5, capacity: 6, type: "Family Dining", isAvailable: true },
      { id: "T6", number: 6, capacity: 8, type: "Chef's Table", isAvailable: true }
    ]
  },
  {
    id: "102",
    name: "Sakura Blossom Omakase",
    cuisine: "Japanese",
    location: "Uptown",
    rating: 4.8,
    reviewsCount: 380,
    priceRange: "$$$$",
    address: "88 Lexington Avenue, Uptown",
    phone: "+1 (555) 349-2200",
    image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=800&q=80",
    description: "Michelin-recognized seasonal nigiri and sashimi prepared directly before guests.",
    operatingHours: "01:00 PM - 10:00 PM",
    availableTimeSlots: ["01:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"],
    tables: [
      { id: "T1", number: 1, capacity: 2, type: "Sushi Bar Counter", isAvailable: true },
      { id: "T2", number: 2, capacity: 2, type: "Sushi Bar Counter", isAvailable: true },
      { id: "T3", number: 3, capacity: 4, type: "Tatami Room", isAvailable: true },
      { id: "T4", number: 4, capacity: 4, type: "Tatami Room", isAvailable: false },
      { id: "T5", number: 5, capacity: 6, type: "Private Garden View", isAvailable: true }
    ]
  },
  {
    id: "103",
    name: "Saffron Royal Indian Kitchen",
    cuisine: "Indian",
    location: "Midtown",
    rating: 4.7,
    reviewsCount: 512,
    priceRange: "$$",
    address: "214 Park Avenue, Midtown",
    phone: "+1 (555) 902-4512",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
    description: "Rich Mughlai curries, fresh tandoor delicacies, and aromatic biryanis in a royal setting.",
    operatingHours: "12:00 PM - 11:00 PM",
    availableTimeSlots: ["12:00 PM", "12:30 PM", "01:00 PM", "06:00 PM", "06:30 PM", "07:30 PM", "08:00 PM"],
    tables: [
      { id: "T1", number: 1, capacity: 2, type: "Standard Table", isAvailable: true },
      { id: "T2", number: 2, capacity: 4, type: "Cozy Booth", isAvailable: true },
      { id: "T3", number: 3, capacity: 4, type: "Standard Table", isAvailable: true },
      { id: "T4", number: 4, capacity: 6, type: "Royal Banquet Table", isAvailable: true },
      { id: "T5", number: 5, capacity: 8, type: "Party Lounge", isAvailable: true }
    ]
  },
  {
    id: "104",
    name: "Le Petit Bistro & Brasserie",
    cuisine: "French",
    location: "Waterfront",
    rating: 4.6,
    reviewsCount: 290,
    priceRange: "$$$",
    address: "12 Harbor Pier, Waterfront",
    phone: "+1 (555) 612-8877",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
    description: "Classic Parisian delicacies, duck confit, fresh baguettes, and harbor sunsets.",
    operatingHours: "01:00 PM - 10:00 PM",
    availableTimeSlots: ["01:00 PM", "01:30 PM", "07:00 PM", "08:00 PM"],
    tables: [
      { id: "T1", number: 1, capacity: 2, type: "Waterfront Patio", isAvailable: true },
      { id: "T2", number: 2, capacity: 2, type: "Waterfront Patio", isAvailable: false },
      { id: "T3", number: 3, capacity: 4, type: "Brasserie Booth", isAvailable: true },
      { id: "T4", number: 4, capacity: 4, type: "Indoor Classic", isAvailable: true }
    ]
  },
  {
    id: "105",
    name: "Fuego Maya Cantina",
    cuisine: "Mexican",
    location: "Westside",
    rating: 4.7,
    reviewsCount: 460,
    priceRange: "$$",
    address: "710 Sunset Blvd, Westside",
    phone: "+1 (555) 441-3399",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    description: "Artisanal tacos, smoked mezcal cocktails, and live Latin jazz acoustic sessions.",
    operatingHours: "04:00 PM - 11:30 PM",
    availableTimeSlots: ["06:00 PM", "06:30 PM", "07:00 PM", "08:00 PM", "09:00 PM"],
    tables: [
      { id: "T1", number: 1, capacity: 2, type: "High-Top Bar Table", isAvailable: true },
      { id: "T2", number: 2, capacity: 4, type: "Fiesta Booth", isAvailable: true },
      { id: "T3", number: 3, capacity: 6, type: "Outdoor Courtyard", isAvailable: true },
      { id: "T4", number: 4, capacity: 8, type: "Cantina Long Table", isAvailable: true }
    ]
  },
  {
    id: "106",
    name: "The Capital Prime Steakhouse",
    cuisine: "American",
    location: "Downtown",
    rating: 4.8,
    reviewsCount: 630,
    priceRange: "$$$$",
    address: "500 Financial Center, Downtown",
    phone: "+1 (555) 880-9911",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    description: "Dry-aged prime steaks, fresh seafood towers, and top-shelf bourbon cellar selections.",
    operatingHours: "05:00 PM - 11:00 PM",
    availableTimeSlots: ["06:00 PM", "06:30 PM", "07:30 PM", "08:30 PM"],
    tables: [
      { id: "T1", number: 1, capacity: 2, type: "Private Booth", isAvailable: true },
      { id: "T2", number: 2, capacity: 4, type: "Leather Booth", isAvailable: true },
      { id: "T3", number: 3, capacity: 6, type: "Executive Table", isAvailable: true },
      { id: "T4", number: 4, capacity: 10, type: "Boardroom Suite", isAvailable: false }
    ]
  }
];
