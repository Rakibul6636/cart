import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextType = {
  user: null | UserData;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isLoggedIn: boolean;
};

const initialContextValue: AuthContextType = {
  user: null,
  login: async () => {},
  logout: () => {},
  isAdmin: false,
  isLoggedIn: false,
};

const AuthContext = createContext(initialContextValue);
//Provide auth inforamtion
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<null | UserData>(null);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      });

      const token = response.data.data.token;

      localStorage.setItem('token', token);
      setUser(response.data.data.user);
      navigate('/store');

    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('shopping-cart');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || false;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

type UserData = {
  id: number;
  name: string;
  email: string;
  role: string;
};
