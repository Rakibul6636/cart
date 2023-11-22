import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatCurrency } from '../utilities/formatCurrency';
//View the carList for admin
const CartList = () => {
  const [carts, setCarts] = useState([]);
  console.log("hi");
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/admin/dashboard',config);
        const data = response.data;
        setCarts(data.carts);
        console.log(data.carts);
      } catch (error) {
        console.error('Error fetching carts:', error);
      }
    };

    fetchCarts();
  }, []);

  const handleStatusChange = async (cartId: any, newStatus: string) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.post(`http://127.0.0.1:8000/api/admin/status/${cartId}`, { status: newStatus },config);
    } catch (error) {
      console.error('Error updating cart status:', error);
    }
  };
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Cart List</h1>
      {carts.map((cart) => (
        <div key={cart.id} className="border p-4 mb-4 rounded">
          <h2 className="text-dark mb-3">Cart ID: {cart.id}</h2>
          <p>User: {cart.user_id}</p>
          <p>Total Amount: {formatCurrency(cart.total_amount)}</p>
          <label className="mb-3">
            Status:
            <select
              value={cart.status}
              onChange={(e) => handleStatusChange(cart.id, e.target.value)}
              className="form-select ms-2"
            >
              <option value="open">Open</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </label>
          <h3 className="text-dark mb-3">Cart Items</h3>
          {cart.cart_items.map((item) => (
            <div key={item.id} className="border p-3 mb-3 rounded">
              <p className="fw-bold">Product: {item.product.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Amount: {formatCurrency(item.quantity * item.product.price)}</p>
              <img
                src={item.product.imgUrl}
                alt={item.product.name}
                className="img-fluid rounded"
                style={{ maxWidth: '100px' }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  
};

export default CartList;
