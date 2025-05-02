import Link from 'next/link';
import Head from 'next/head';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryTable from '../../../components/CategoryTable'; 

const Categories = () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <>
      <Head>
        <title>Categories List | {appName}</title>
      </Head>
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="m-0">Category List</h1>
          <Link href="/admin/categories/create" className="btn btn-primary">
            Add Category
          </Link>
        </div>
        {/* Category table or list will go here */}
        <CategoryTable/>
        <ToastContainer />
      </div>
    </>
  );
};

export default Categories;
