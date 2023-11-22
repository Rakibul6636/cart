import { useState } from 'react';
import { useRegister } from '../context/RegisterContext';

const RegistrationComponent = () => {
  const { register } = useRegister();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
//handle the register in the register context.
  const handleRegister = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      register(formData);
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <form>
      <div className="row">
        <div className="col-sm-6 justify-content-center">
          <div className="card p-4">
            <label>Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
            <label>Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
            <label>Password</label>
            <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

            <button
              type="button"
              onClick={handleRegister}
              className="btn btn-info mt-2"
            >
              Register
            </button>
          </div>
        </div>
      </div>
      </form>
    </div>
  );
};

export default RegistrationComponent;
