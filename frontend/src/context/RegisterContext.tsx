import  { createContext, useContext, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type RegisterProviderProps = {
  children: ReactNode;
};

type RegisterContextType = {
  register: (formData: RegisterFormData) => Promise<void>;
};

const RegisterContext = createContext<RegisterContextType>({
  register: async () => {},
});
//Register context
export const RegisterProvider = ({ children }: RegisterProviderProps) => {
  const navigate = useNavigate();
  const register = async (formData: RegisterFormData) => {
    try {
      // Make an API request to register the user
      const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <RegisterContext.Provider value={{ register }}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => {
  return useContext(RegisterContext);
};

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};
