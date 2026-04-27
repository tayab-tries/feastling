import React, { createContext, useContext, useState, useCallback } from 'react';

export type CartItem = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string, restaurantId: string) => void;
  updateQuantity: (itemId: string, restaurantId: string, delta: number) => void;
  clearCart: () => void;
  getItemsByRestaurant: () => Record<string, CartItem[]>;
  getSubtotal: () => number;
  getTotalDeliveryFee: (feeMap: Record<string, number>) => number;
  getItemCount: () => number;
  getItemQuantity: (itemId: string, restaurantId: string) => number;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.restaurantId === item.restaurantId
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.restaurantId === item.restaurantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((itemId: string, restaurantId: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.id === itemId && i.restaurantId === restaurantId))
    );
  }, []);

  const updateQuantity = useCallback(
    (itemId: string, restaurantId: string, delta: number) => {
      setItems((prev) =>
        prev
          .map((i) =>
            i.id === itemId && i.restaurantId === restaurantId
              ? { ...i, quantity: i.quantity + delta }
              : i
          )
          .filter((i) => i.quantity > 0)
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const getItemsByRestaurant = useCallback(() => {
    return items.reduce((groups, item) => {
      if (!groups[item.restaurantId]) {
        groups[item.restaurantId] = [];
      }
      groups[item.restaurantId].push(item);
      return groups;
    }, {} as Record<string, CartItem[]>);
  }, [items]);

  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const getTotalDeliveryFee = useCallback(
    (feeMap: Record<string, number>) => {
      const restaurantIds = [...new Set(items.map((i) => i.restaurantId))];
      return restaurantIds.reduce((sum, id) => sum + (feeMap[id] || 0), 0);
    },
    [items]
  );

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const getItemQuantity = useCallback(
    (itemId: string, restaurantId: string) => {
      const item = items.find(
        (i) => i.id === itemId && i.restaurantId === restaurantId
      );
      return item?.quantity || 0;
    },
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemsByRestaurant,
        getSubtotal,
        getTotalDeliveryFee,
        getItemCount,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
