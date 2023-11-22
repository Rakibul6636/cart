import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

interface StoreItemsProviderProps {
  children: ReactNode;
}

const StoreItemsContext = createContext([]);

export const StoreItemsProvider: React.FC<StoreItemsProviderProps> = ({ children }) => {
  const [storeItems, setStoreItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products');
        setStoreItems(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItems();
  }, []);

  return (
    <StoreItemsContext.Provider value={storeItems}>
      {children}
    </StoreItemsContext.Provider>
  );
};

export const useStoreItems = () => {
  return useContext(StoreItemsContext);
};
