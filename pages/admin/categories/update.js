import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const UpdateCategory = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  });

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem('token');
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}course/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        setFormData(res.data.data);
      }).catch(() => {
        toast.error('Failed to load category');
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
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}course/categories/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Category updated successfully', {
        onClose: () => router.push('/admin/categories'),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <>
      <Head><title>Update Category</title></Head>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="m-0">Update Course Category</h1>
          <Link href="/admin/categories" className="btn btn-outline-secondary">
            Back
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-select">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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

export default UpdateCategory;