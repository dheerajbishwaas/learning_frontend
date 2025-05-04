import CommonTable from './CommonTable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const UsersTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null); // To store current logged-in user ID
  const router = useRouter();

  // Get current user ID from local storage or token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(decodedToken.userId); // Assuming the token contains userId
    }
  }, []);

  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}users/getPaginatedUsers?page=${pageNumber}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setData(response.data.data);
      setTotalRows(response.data.total);
      setPage(pageNumber);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { name: 'Name', selector: row => row.name },
    { name: 'Username', selector: row => row.username },
    { name: 'Email', selector: row => row.email },
    { name: 'UserIp', selector: row => row.ipAddress },
    {
        name: 'Role',
        selector: row => row.role,
        cell: row => {
          let roleText = '';
      
          // Check the role value and display the corresponding text
          if (row.role == '1') {
            roleText = 'Admin';  // Admin role
          } else if (row.role == '2') {
            roleText = 'Normal User';  // Normal User role
          }
      
          return <span>{roleText}</span>;  // Display role text
        }
      },
    { 
      name: 'Status', 
      cell: row => {
        let badgeClass = '';
        
        switch(row.status) {
          case 1:
            badgeClass = 'bg-success';  // Green for active
            break;
          case 0:
            badgeClass = 'bg-danger';   // Red for inactive
            break;
          default:
            badgeClass = 'bg-secondary'; // Default grey
            break;
        }
        
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
          {/* Hide edit/delete buttons for the current user */}
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
      toast.success('Deleted successfully',{
        onClose: () => {
          fetchData(page);
        }
      });
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <CommonTable
      title=""
      columns={columns}
      data={data}
      loading={loading}
      totalRows={totalRows}
      onPageChange={fetchData}
    />
  );
};

export default UsersTable;
