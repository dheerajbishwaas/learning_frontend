import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Head from 'next/head';

const UserDashboard = () => {
  const router = useRouter();
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If there's no token, redirect to login page
      router.push('/login');
    } else {
      const userRole = JSON.parse(atob(token.split('.')[1])).role;
      if (userRole !== '2') {
        // If the user isn't a regular user, redirect to the admin dashboard
        router.push('/admin/dashboard');
      }
    }
  }, [router]);

  return (
    <>
    <Head>
      <title>Dashboard {appName}</title>
    </Head>
    <div className='text-center mt-5'>
      <h1>User Dashboard</h1>
      <p>Welcome to the user panel!</p>
    </div>
    </>
  );
};

export default UserDashboard;
