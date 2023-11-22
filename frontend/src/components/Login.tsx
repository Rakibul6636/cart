import  { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginComponent = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    login(formData.email, formData.password);
  };

  return (
       <div>
       <form onSubmit={handleLogin}>
       <div className="row">
         <div className="col-sm-6 justify-content-center">
           <div className="card p-4">
             <label>Email</label>
             <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
             <label>Password</label>
             <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
             <button
               type="button"
               onClick={handleLogin}
               className="btn btn-info mt-2"
             >
               Login
             </button>
           </div>
         </div>
       </div>
       </form>
     </div>
  );
};

export default LoginComponent;
