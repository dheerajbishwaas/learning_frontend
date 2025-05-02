import { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingsPage = () => {
  const [form, setForm] = useState({
    siteName: '',
    contactEmail: '',
    supportPhone: '',
    maintenanceMode: false
  });

  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm(res.data.data);
    } catch (err) {
      toast.error('Failed to load settings');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}settings`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Settings updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <div className="container my-4">
        <h2>Website Settings</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Site Name</label>
            <input
              type="text"
              className="form-control"
              name="siteName"
              value={form.siteName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contact Email</label>
            <input
              type="email"
              className="form-control"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Support Phone</label>
            <input
              type="text"
              className="form-control"
              name="supportPhone"
              value={form.supportPhone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="maintenanceMode"
              checked={form.maintenanceMode}
              onChange={handleChange}
            />
            <label className="form-check-label">
              Maintenance Mode
            </label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default SettingsPage;
