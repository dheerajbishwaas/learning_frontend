import Link from 'next/link';
import Head from 'next/head';
import CourseTable from '../../../components/CourseTable'; // adjust path if needed

const Course = () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <>
      <Head>
        <title>Course List | {appName}</title>
      </Head>
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="m-0">Course List</h1>
          <Link href="/admin/course/create" className="btn btn-primary">
            Add Course
          </Link>
        </div>
         <CourseTable />
      </div>
    </>
  );
};

export default Course;
