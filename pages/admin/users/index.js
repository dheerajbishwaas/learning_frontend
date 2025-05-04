import Link from 'next/link';
import Head from 'next/head';
import UsersTable from '../../../components/UsersTable'; // adjust path if needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <>
      <Head>
        <title>Users List | {appName}</title>
      </Head>
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="m-0">Users List</h1>
          <Link href="/admin/users/create" className="btn btn-primary">
            Add User
          </Link>
        </div>
        <UsersTable />
        <ToastContainer />
      </div>
    </>
  );
};

export default Users;
