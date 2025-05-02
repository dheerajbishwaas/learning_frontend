import CommonTable from './CommonTable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const CourseTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}course/list?page=${pageNumber}`, {
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
    { name: 'Name', selector: row => row.courseName },
    { name: 'Course Type', selector: row => row.courseType.charAt(0).toUpperCase() + row.courseType.slice(1)},
    { name: 'Created-At', selector: row => row.createdAt },
    {
        name: 'Status',
        cell: row => {
          let badgeClass = '';
          
          switch(row.status) {
            case 'draft':
              badgeClass = 'bg-warning';  // Yellow for draft
              break;
            case 'published':
              badgeClass = 'bg-success';  // Green for published
              break;
            case 'disabled':
              badgeClass = 'bg-danger';   // Red for disabled
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
          <button onClick={() => router.push(`/admin/course/update/${row._id}`)} className="btn btn-sm btn-warning me-2">Edit</button>
          <button onClick={() => handleDelete(row._id)} className="btn btn-sm btn-danger">Delete</button>
        </div>
      )
    }
  ];

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}course/${id}`, {
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

export default CourseTable;
