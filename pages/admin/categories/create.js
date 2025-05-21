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
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false); 

  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setIconFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setIconFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('status', formData.status);

    if (iconFile) {
      data.append('icon', iconFile); // Image file with name="icon"
    }

    try {
      setLoading(true);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}course/categories`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Category created successfully', {
        onClose: () => router.push('/admin/categories'),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    }finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <Head><title>Create Category | {appName}</title></Head>
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="m-0">Create Course Category</h1>
          <Link href="/admin/categories" className="btn btn-outline-secondary">Back</Link>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" name="name" className="form-control" required onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" required onChange={handleChange}></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Icon Image</label>
            {previewUrl ? (
              <div className="position-relative d-inline-block">
                <img src={previewUrl} alt="Preview" style={{ height: '100px', borderRadius: '5px' }} />
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                  onClick={removeImage}
                  style={{ transform: 'translate(50%, -50%)' }}
                >
                  &times;
                </button>
              </div>
            ) : (
              <input
                type="file"
                name="icon"
                accept="image/*"
                className="form-control"
                onChange={handleImageChange}
                required
              />
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select name="status" className="form-select" onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" disabled={loading} className="btn btn-primary px-4">{loading ? 'Creating...' : 'Create Category'}</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default CreateCategory;
