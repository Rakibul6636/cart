import { useEffect, useState } from "react";
import axios from "axios";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T), isLoggedIn: boolean) {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);
    if (typeof initialValue === "function") {
      return (initialValue as () => T)();
    } else {
      return initialValue;
    }

  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isLoggedIn) {
          const token = localStorage.getItem('token');
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          // Fetch data from the database when the user is logged in
          const response = await axios.get('http://127.0.0.1:8000/api/viewCart', config);
          const databaseData = response.data;
          const resultArray = databaseData.cart.cart_items.map((item: {
            id: any; product_id: any; quantity: any; 
}) => ({
            id: item.product_id,
            quantity: item.quantity,
            cart_items_id: item.id,
          }));
  
          // Set the state with database data
          setValue(resultArray);
  
          // Update local storage with database data
          localStorage.setItem(key, JSON.stringify(resultArray));
        }
      } catch (error) {
        console.error("Error fetching data from the database:", error);
      }
    };
  
    fetchData();
  }, [key, isLoggedIn]);
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as [typeof value, typeof setValue];
}
