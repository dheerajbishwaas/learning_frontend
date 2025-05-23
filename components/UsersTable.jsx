import CommonTable from './CommonTable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const UsersTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);  // rows per page
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // search input
  const [currentUserId, setCurrentUserId] = useState(null);
  const router = useRouter();

  // Get current user ID from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(decodedToken.userId); 
    }
  }, []);

  const fetchData = async (pageNumber = 1, search = '', limit = perPage) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}users/getPaginatedUsers`, {
        params: { page: pageNumber, limit, search },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setData(response.data.data);
      setTotalRows(response.data.total);
      setPage(pageNumber);
      setPerPage(limit);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, searchTerm, perPage);
  }, [page, perPage]);

  const handleSearch = () => {
    fetchData(1, searchTerm, perPage);  // reset page to 1 on new search
  };

  const columns = [
    { name: 'Name', selector: row => row.name },
    { name: 'Username', selector: row => row.username },
    { name: 'Email', selector: row => row.email },
    { name: 'UserIp', selector: row => row.ipAddress },
    {
      name: 'Role',
      cell: row => {
        if (row.role === '1') return <span>Admin</span>;
        if (row.role === '2') return <span>Normal User</span>;
        return <span>Unknown</span>;
      }
    },
    { 
      name: 'Status', 
      cell: row => {
        const badgeClass = row.status === 1 ? 'bg-success' : 'bg-danger';
        return (
          <span className={`badge ${badgeClass} rounded-pill px-3 py-2`}>
            {row.status === 1 ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          {row._id !== currentUserId && (
            <>
              <button onClick={() => router.push(`/admin/users/update/${row._id}`)} className="btn btn-sm btn-warning me-2">Edit</button>
              <button onClick={() => handleDelete(row._id)} className="btn btn-sm btn-danger">Delete</button>
            </>
          )}
        </div>
      )
    }
  ];

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Deleted successfully', {
        onClose: () => fetchData(page, searchTerm, perPage)
      });
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      {/* Search Input */}
      <div className="d-flex justify-content-end mb-3">
        <input
          type="text"
          placeholder="Search users..."
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
        perPage={perPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newPerPage) => {
          setPerPage(newPerPage);
          setPage(1); // reset to first page when rows per page changes
        }}
      />
    </div>
  );
};

export default UsersTable;
