import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';


const UserDashboard = () => {
  const router = useRouter();

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
    <div className='text-center mt-5'>
      <h1>User Dashboard</h1>
      <p>Welcome to the user panel!</p>
    </div>
    </>
  );
};

export default UserDashboard;
