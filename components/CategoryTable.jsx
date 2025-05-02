import CommonTable from './CommonTable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const CategoryTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}course/categories/list?page=${pageNumber}`, {
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
    { name: 'Categories Name', selector: row => row.name },
    { name: 'Created-At', selector: row => row.createdAt },
    { 
      name: 'Status',
      cell: row => {
        let badgeClass = '';
        
        switch(row.status) {
          case 'active':
            badgeClass = 'bg-success';  // Green for active
            break;
          case 'inactive':
            badgeClass = 'bg-danger';   // Red for inactive
            break;
          default:
            badgeClass = 'bg-secondary'; // Default grey
            break;
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
            fetchData(page);
          }
        });
      } catch (err) {
        // Check if the error response exists and contains a message
        const errorMessage = err.response?.data?.message || 'Delete failed';
        toast.error(errorMessage); // Show the error message from the server or fallback to a default message
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

export default CategoryTable;
