import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // CSS ko import karna zaroori hai

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation check
    let formErrors = { username: '', password: '' };
    if (!formData.username) formErrors.username = 'Username is required';
    if (!formData.password) formErrors.password = 'Password is required';

    setErrors(formErrors);

    // Agar errors nahi hain toh success toast dikhayein
    if (!formErrors.username && !formErrors.password) {
      toast.success('Login successful!');
    } else {
      // Agar errors hain toh error toast dikhayein
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
      
      {/* ToastContainer to show the toast notifications */}
      <ToastContainer />
    </div>
  );
}
