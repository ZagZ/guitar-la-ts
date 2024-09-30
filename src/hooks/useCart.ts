import { useEffect, useState, useMemo } from "react";

import type { CartItem, Guitar } from "../types";

import { db } from "../data/db";

export const useCart = () => {
  const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");

    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_QUANTITY = 5;
  const MIN_QUANTITY = 1;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Guitar) => {
    const itemExist = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemExist >= 0) {
      if (cart[itemExist].quantity >= MAX_QUANTITY) return;
      const updatedCart = [...cart];
      updatedCart[itemExist].quantity++;
      setCart(updatedCart);
    } else {
      const newItem: CartItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (id: Guitar["id"]) => {
    setCart(cart.filter((guitar) => guitar.id !== id));
  };

  const increaseQuantity = (id: Guitar["id"]) => {
    const updatedCart = cart.map((guitar) => {
      if (guitar.id === id && guitar.quantity < MAX_QUANTITY) {
        return {
          ...guitar,
          quantity: guitar.quantity + 1,
        };
      }
      return guitar;
    });

    setCart(updatedCart);
  };

  const decreaseQuantity = (id: Guitar["id"]) => {
    const updatedCart = cart.map((guitar) => {
      if (guitar.id === id && guitar.quantity > MIN_QUANTITY) {
        return {
          ...guitar,
          quantity: guitar.quantity - 1,
        };
      }
      return guitar;
    });

    setCart(updatedCart);
  };

  const cleanCart = () => setCart([]);

  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    cleanCart,
    isEmpty,
    cartTotal,
  };
};
