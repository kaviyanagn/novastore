import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { INITIAL_PRODUCTS } from "../data/products";

const OrderContext = createContext(null);
const ORDERS_STORAGE_KEY = "novastore_orders_data";

const DEFAULT_CURRENT_ORDERS = [
  {
    id: "ORD-2026-8921",
    date: "Sep 24, 2026, 02:45 PM",
    status: "Out for Delivery",
    statusStep: 4, // 1: Confirmed, 2: Processing, 3: Shipped, 4: Out for Delivery, 5: Delivered
    carrier: "Nova Express Logistics",
    trackingNumber: "NX-882941-US",
    estimatedDelivery: "Today, by 6:00 PM",
    customerInfo: {
      fullName: "Alex Morgan",
      email: "alex.morgan@novastore.com",
      phone: "+1 (555) 234-5678",
      address: "742 Evergreen Terrace",
      city: "San Francisco",
      state: "CA",
      zipCode: "94107",
      paymentMethod: "Credit Card (ending 4242)",
    },
    items: [
      {
        product: INITIAL_PRODUCTS[0], // Sony Headphones
        quantity: 1,
      },
      {
        product: INITIAL_PRODUCTS[3], // Vincero Watch
        quantity: 1,
      },
    ],
    subtotal: 494.99,
    discount: 49.50,
    deliveryFee: 0,
    total: 445.49,
  },
];

const DEFAULT_ORDER_HISTORY = [
  {
    id: "ORD-2026-7640",
    date: "Aug 18, 2026, 11:30 AM",
    status: "Delivered",
    statusStep: 5,
    carrier: "FedEx Priority",
    trackingNumber: "FDX-491029-US",
    deliveredDate: "Aug 20, 2026",
    customerInfo: {
      fullName: "Alex Morgan",
      email: "alex.morgan@novastore.com",
      phone: "+1 (555) 234-5678",
      address: "742 Evergreen Terrace",
      city: "San Francisco",
      state: "CA",
      zipCode: "94107",
      paymentMethod: "UPI / Digital Wallet",
    },
    items: [
      {
        product: INITIAL_PRODUCTS[2], // Nike Air Jordan
        quantity: 1,
      },
    ],
    subtotal: 189.95,
    discount: 0,
    deliveryFee: 0,
    total: 189.95,
  },
  {
    id: "ORD-2026-6192",
    date: "Jul 05, 2026, 04:15 PM",
    status: "Delivered",
    statusStep: 5,
    carrier: "DHL Express",
    trackingNumber: "DHL-901238-US",
    deliveredDate: "Jul 08, 2026",
    customerInfo: {
      fullName: "Alex Morgan",
      email: "alex.morgan@novastore.com",
      phone: "+1 (555) 234-5678",
      address: "742 Evergreen Terrace",
      city: "San Francisco",
      state: "CA",
      zipCode: "94107",
      paymentMethod: "Credit Card (ending 8812)",
    },
    items: [
      {
        product: INITIAL_PRODUCTS[9], // Ray-Ban Sunglasses
        quantity: 2,
      },
      {
        product: INITIAL_PRODUCTS[6], // Denim Jacket
        quantity: 1,
      },
    ],
    subtotal: 248.98,
    discount: 24.90,
    deliveryFee: 0,
    total: 224.08,
  },
];

export function OrderProvider({ children }) {
  const [currentOrders, setCurrentOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(`${ORDERS_STORAGE_KEY}_current`);
      return saved ? JSON.parse(saved) : DEFAULT_CURRENT_ORDERS;
    } catch {
      return DEFAULT_CURRENT_ORDERS;
    }
  });

  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(`${ORDERS_STORAGE_KEY}_history`);
      return saved ? JSON.parse(saved) : DEFAULT_ORDER_HISTORY;
    } catch {
      return DEFAULT_ORDER_HISTORY;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${ORDERS_STORAGE_KEY}_current`, JSON.stringify(currentOrders));
      localStorage.setItem(`${ORDERS_STORAGE_KEY}_history`, JSON.stringify(orderHistory));
    } catch (e) {
      console.error("Failed to persist orders", e);
    }
  }, [currentOrders, orderHistory]);

  const addOrder = useCallback((orderData) => {
    const newOrder = {
      ...orderData,
      id: orderData.id || `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Order Confirmed",
      statusStep: 1,
      carrier: "Nova Priority Express",
      trackingNumber: `NX-${Math.floor(100000 + Math.random() * 900000)}-US`,
      estimatedDelivery: "In 2-3 business days",
    };

    setCurrentOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const cancelOrder = useCallback((orderId) => {
    setCurrentOrders((prev) => prev.filter((order) => order.id !== orderId));
  }, []);

  return (
    <OrderContext.Provider
      value={{
        currentOrders,
        orderHistory,
        setOrderHistory,
        addOrder,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
