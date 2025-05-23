import CommonTable from './CommonTable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const CourseTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);  // Add perPage state
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchData = async (pageNumber = 1, searchTerm = '', perPageCount = perPage) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}course/list`,
        {
          params: {
            page: pageNumber,
            search: searchTerm,
            limit: perPageCount   // pass limit param for perPage
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
    fetchData(page, search, perPage);
  }, [page, search, perPage]);

  const columns = [
    { name: 'Name', selector: row => row.courseName },
    { name: 'Course Type', selector: row => row.courseType.charAt(0).toUpperCase() + row.courseType.slice(1) },
    { name: 'Created-At', selector: row => new Date(row.createdAt).toLocaleDateString() },
    {
      name: 'Status',
      cell: row => {
        let badgeClass = '';
        switch(row.status) {
          case 'draft': badgeClass = 'bg-warning'; break;
          case 'published': badgeClass = 'bg-success'; break;
          case 'disabled': badgeClass = 'bg-danger'; break;
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
          fetchData(page, search, perPage);
        }
      });
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <div className="mb-3 d-flex">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={handleSearchChange}
          className="form-control me-2"
        />
        <button className="btn btn-primary" onClick={() => fetchData(1, search, perPage)}>Search</button>
      </div>

      <CommonTable
        title=""
        columns={columns}
        data={data}
        loading={loading}
        totalRows={totalRows}
        perPage={perPage}                 
        onPageChange={(pageNumber) => {
          setPage(pageNumber);
        }}
        onRowsPerPageChange={(newPerPage) => {
          setPerPage(newPerPage);       
          setPage(1);
        }}
      />
    </div>
  );
};

export default CourseTable;
