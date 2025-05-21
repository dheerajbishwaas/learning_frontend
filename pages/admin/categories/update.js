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
    icon: ''
  });
  const [preview, setPreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem('token');
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}course/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        const data = res.data.data;
        setFormData(data);
        if (data.icon) {
          setPreview(`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${data.icon}`);
        }
      }).catch(() => {
        toast.error('Failed to load category');
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setIsSubmitting(true);

    try {
      const updatedData = new FormData();
      updatedData.append('name', formData.name);
      updatedData.append('description', formData.description);
      updatedData.append('status', formData.status);
      if (selectedImage) {
        updatedData.append('icon', selectedImage);
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}course/categories/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Category updated successfully', {
        onClose: () => router.push('/admin/categories'),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head><title>Update Category</title></Head>
      <div className="container my-4">
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

          <div className="mb-3">
            <label className="form-label">Icon (Image)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
            {preview && (
              <div className="mt-2 position-relative d-inline-block">
                <img src={preview} alt="Preview" style={{ maxWidth: '150px', borderRadius: '8px' }} />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'red',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >×</button>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </>
  );
};

export default UpdateCategory;
