/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { userService } from '../services';
import { cartService } from '../services/cart.service';
import toast from 'react-hot-toast';

const CartContext = createContext<CartContextType | undefined>(undefined);

// const LOCAL_STORAGE_KEY = 'bookstore-cart';

const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deviceId] = useState(userService.getDeviceId());

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    let isMounted = true;
    const getItems = async () => {
      setIsLoading(true);
      const cartItems = await cartService.getCart(deviceId, "pending");
      if (cartItems?.length) setItems(cartItems);
      setIsLoading(false)
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
        addToCart,  
        updateQuantity, 
        clearCart, 
        totalItems,
        totalPrice,
        isLoading,
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