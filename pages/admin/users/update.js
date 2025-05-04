import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const UpdateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    status: 1,  // Active by default
    role: '2',  // Default role
  });

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem('token');
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}users/getuser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        if(res.data.success){
            setFormData(prev => ({
                ...prev,
                ...res.data.user,
                password: '',
              }));
        }else{
        toast.error('User not found');
        }
      }).catch(() => {
        toast.error('Failed to load user details');
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User updated successfully', {
        onClose: () => router.push('/admin/users'),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <>
      <Head><title>Update User</title></Head>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="m-0">Update User</h1>
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
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" />
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
            <button type="submit" className="btn btn-primary">Update</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default UpdateUser;
