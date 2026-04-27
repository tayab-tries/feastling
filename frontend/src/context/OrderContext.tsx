import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem } from './CartContext';
import { restaurants } from '../data/mockData';

export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'delivered';

export type OrderStep = {
  status: OrderStatus;
  label: string;
  time: string | null;
  completed: boolean;
};

export type Order = {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  restaurantNames: string[];
  steps: OrderStep[];
};

type OrderContextType = {
  orders: Order[];
  createOrder: (items: CartItem[], subtotal: number, deliveryFee: number) => Order;
  getOrder: (orderId: string) => Order | undefined;
};

const OrderContext = createContext<OrderContextType>({} as OrderContextType);

export const useOrders = () => useContext(OrderContext);

const generateSteps = (): OrderStep[] => {
  const now = new Date();
  return [
    { status: 'placed', label: 'Order Placed', time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
    { status: 'accepted', label: 'Accepted', time: new Date(now.getTime() + 5 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
    { status: 'preparing', label: 'Preparing', time: new Date(now.getTime() + 10 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
    { status: 'ready', label: 'Ready', time: null, completed: false },
    { status: 'picked_up', label: 'Picked Up', time: null, completed: false },
    { status: 'delivered', label: 'Delivered', time: null, completed: false },
  ];
};

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const createOrder = useCallback(
    (items: CartItem[], subtotal: number, deliveryFee: number): Order => {
      const restaurantNames = [...new Set(items.map((i) => i.restaurantName))];
      const order: Order = {
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        items,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        status: 'preparing',
        createdAt: new Date().toISOString(),
        estimatedDelivery: '30-45 min',
        restaurantNames,
        steps: generateSteps(),
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    []
  );

  const getOrder = useCallback(
    (orderId: string) => orders.find((o) => o.id === orderId),
    [orders]
  );

  return (
    <OrderContext.Provider value={{ orders, createOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
}
