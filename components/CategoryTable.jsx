import CommonTable from './CommonTable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const CategoryTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);   // Add perPage state
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchData = async (pageNumber = 1, search = '', limit = perPage) => {   // add limit param
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}course/categories/list`, {
        params: { page: pageNumber, search, limit },    // send limit param here
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.data);
      setTotalRows(response.data.total);
      setPage(pageNumber);
      setPerPage(limit);   // update perPage in state
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, searchTerm, perPage);
  }, [page, perPage]);  // run fetch when page or perPage changes

  const handleSearch = () => {
    fetchData(1, searchTerm, perPage);
  };

  const columns = [
    { name: 'Categories Name', selector: row => row.name },
    { name: 'Created-At', selector: row => new Date(row.createdAt).toLocaleDateString() },
    {
      name: 'Status',
      cell: row => {
        let badgeClass = '';
        switch (row.status) {
          case 'active': badgeClass = 'bg-success'; break;
          case 'inactive': badgeClass = 'bg-danger'; break;
          default: badgeClass = 'bg-secondary';
        }
        return (
          <span className={`badge ${badgeClass} rounded-pill px-3 py-2`}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button onClick={() => router.push(`/admin/categories/update/${row._id}`)} className="btn btn-sm btn-warning me-2">Edit</button>
          <button onClick={() => handleDelete(row._id)} className="btn btn-sm btn-danger">Delete</button>
        </div>
      )
    }
  ];

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}course/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Deleted successfully', {
        onClose: () => {
          fetchData(page, searchTerm, perPage);
        }
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Delete failed';
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      {/* 🔍 Search Field */}
      <div className="d-flex justify-content-end mb-3">
        <input
          type="text"
          placeholder="Search categories..."
          className="form-control me-2 w-25"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
      </div>

      <CommonTable
        title=""
        columns={columns}
        data={data}
        loading={loading}
        totalRows={totalRows}
        perPage={perPage}    // pass perPage here
        onPageChange={(newPage) => setPage(newPage)}  // update page state
        onRowsPerPageChange={(newPerPage) => {       // update perPage state
          setPerPage(newPerPage);
          setPage(1);
        }}
      />
    </div>
  );
};

export default CategoryTable;
