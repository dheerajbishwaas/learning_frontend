import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    status: 1,
    role: '2',
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}users/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User created successfully', {
        onClose: () => router.push('/admin/users'),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Creation failed');
    }
  };

  return (
    <>
      <Head><title>Create User</title></Head>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="m-0">Create User</h1>
          <Link href="/admin/users" className="btn btn-outline-secondary">
            Back
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-select">
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="form-select">
              <option value="2">User</option>
              <option value="3">Moderator</option>
              <option value="1">Admin</option>
            </select>
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-success">Create</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default CreateUser;
