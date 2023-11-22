import { createContext, ReactNode, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";
import axios from "axios";
import { useAuth } from "./AuthContext";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  runningTotalRef: any;
  product_id: number;
  id: number;
  quantity: number;
  cart_items_id: number;
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    [],
    isLoggedIn
  );
  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity, 
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  function getItemQuantity(id: number) {
    return cartItems.find(item => item.id === id)?.quantity || 0;
  }

  function increaseCartQuantity(id: number) {
    setCartItems(currItems => {
      if (currItems.find(item => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map(item => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });

    // Update the backend if the user is logged in
    if (isLoggedIn) {
      addToCartBackend(id);
    }
  }

  function decreaseCartQuantity(id: number) {
    
    setCartItems(currItems => {
      const updatedItems = currItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity - 1); // Ensure quantity doesn't go below 1
          return { ...item, quantity: newQuantity };
        } else {
          return item;
        }
      });
      // Update the backend if the user is logged in
      if (isLoggedIn) {
        removeCartItemBackend(id);
          
       }
    
      return updatedItems;
    });
  }

  function removeFromCart(id: number) {
    setCartItems(currItems => {
      const updatedItems = currItems.filter(item => item.id !== id);

      // Update the backend if the user is logged in
      if (isLoggedIn) {
        removeFromCartBackend(id);
      }

      return updatedItems;
    });
  }

  // Additional functions for backend communication
  async function addToCartBackend(id: number) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      // an API endpoint to add an item to the user's cart
      const product_id = id;
      console.log(config,product_id);
      await axios.post(`http://127.0.0.1:8000/api/addToCart`, { product_id }, config);
    } catch (error) {
      console.error("Error adding item to user cart in the backend:", error);
    }
  }

  async function removeCartItemBackend(id: number) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      // an API endpoint to add an item to the user's cart
      console.log(config);
      await axios.put(`http://127.0.0.1:8000/api/removeCartItem/${id}`, {}, config);
    } catch (error) {
      console.error("Error reducing item from user cart in the backend:", error);
    }
  }

  async function removeFromCartBackend(id: number) { 
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      // an API endpoint to add an item to the user's cart
      console.log(config);
      await axios.delete(`http://127.0.0.1:8000/api/removeFromCart/${id}`, config);
    } catch (error) {
      console.error("Error removing item from user cart in the backend:", error);
    }
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
