import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const CreateCategory = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  });
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}course/categories`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Category created successfully', {
        onClose: () => router.push('/admin/categories'),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    }
  };

  return (
    <>
      <Head><title>Create Category | {appName}</title></Head>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="m-0">Create Course Category</h1>
          <Link href="/admin/categories" className="btn btn-outline-secondary">
            Back
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" name="name" className="form-control" required onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" required onChange={handleChange}></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select name="status" className="form-select" onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary px-4">
              Create Category
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default CreateCategory;
