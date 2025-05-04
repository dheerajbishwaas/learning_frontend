import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'; 
import axios from 'axios';
import Cookies from 'js-cookie';


const dotenv = require('dotenv');

dotenv.config();

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Assuming the token contains the user's role
      const userRole = JSON.parse(atob(token.split('.')[1])).role;
      if (userRole === '1') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check
    let formErrors = { username: '', password: '' };
    if (!formData.username) formErrors.username = 'Username is required';
    if (!formData.password) formErrors.password = 'Password is required';

    setErrors(formErrors);

    if (!formErrors.username && !formErrors.password) {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}users/login`, {
          username: formData.username,
          password: formData.password,
        },{withCredentials: true});

        if (res && res.data && res.data.token) {
          // Save token to localStorage
          localStorage.setItem('token', res.data.token);
          Cookies.set('token', res.data.token, {
            path: '/',
            sameSite: 'Strict', // or 'Lax' or 'None'
            secure: true,       // secure should be true on HTTPS
          });
          const userRole = res.data.user.role;
          
          if (userRole === '1') {
            toast.success('Admin Login successful!', {
              onClose: () => {
                router.push('/admin/dashboard');
              }
            });
          } else {
            toast.success('User Login successful!', {
              onClose: () => {
                router.push('/user/dashboard');
              }
            });
          }
        } else {
          console.log('Invalid response or no token received');
          toast.error('Login failed!!!');
        }
      } catch (error) {
        console.log('Error:', error);
        if (error.response) {
          toast.error(error.response?.data?.message || 'Login failed!!!');
        } else {
          toast.error('An error occurred while logging in.');
        }
      }
    } else {
      toast.error('Please fill all fields.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="card p-4" style={{ width: '22rem', backgroundColor: '#f1f1f1' }}>
        <h2 className="text-center mb-4">Login panel !!</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              placeholder='Enter email or username'
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <div className="text-danger">{errors.username}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder='Enter your password'
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
