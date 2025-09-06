/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { InitReloads } from '../utils/initVariables';
import { userService } from '../services';
import { cartService } from '../services/cart.service';
import toast from 'react-hot-toast';

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'bookstore-cart';

const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [reload, setReload] = useState<Reloads>(InitReloads)
  const [deviceId] = useState(userService.getDeviceId());

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    let isMounted = true;
    const getItems = async () => {
      const cartItems = await cartService.getCart(deviceId, "pending");
      console.log(cartItems)
      if (cartItems?.length) setItems(cartItems);
    };
    if (isMounted) getItems();

    return () => {
      isMounted = false
    }
  }, [deviceId]);

  const addToCart = async (book: Book, quantity = 1) => {
    try {
      const deviceId = userService.getDeviceId();
      const newCart: CartItem = {
        book, quantity,
        price: book.price * quantity,
        userId: deviceId,
        status: 'pending',
      };
      const cartItems = await cartService.addCart(newCart);
      if (cartItems?.length) setItems(cartItems)
      toast.success(`${quantity} item(s) added to cart`);
    } catch (e: any) {
      console.log(e)
      toast.error("Erorr adding item to cart")
    }
  };

  const updateQuantity = async (cart: CartItem, quantity: number) => {
    try {  
      const cartItems = await cartService.updateCart(deviceId, cart.book.id, quantity);
      if (cartItems?.length) setItems(cartItems);
    } catch (e: any) {
      console.log(e)
      toast.error("Erorr updating cart item")
    }
  };

  const clearCart = async () => {
    await cartService.clearCart(deviceId);
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider 
      value={{ 
        items,
        reload,
        setReload,
        addToCart,  
        updateQuantity, 
        clearCart, 
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export {
  CartContext,
  CartProvider,
}