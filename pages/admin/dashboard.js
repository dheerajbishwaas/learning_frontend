import { useEffect } from 'react';
import { useRouter } from 'next/router';


const AdminDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If there's no token, redirect to login page
      router.push('/login');
    } else {
      const userRole = JSON.parse(atob(token.split('.')[1])).role;
      if (userRole !== '1') {
        // If the user isn't an admin, redirect to the user dashboard
        router.push('/user/dashboard');
      }
    }
  }, [router]);

  return (
   <>
     <div className='text-center'>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel!</p>
    </div>
   </>
  );
};

export default AdminDashboard;
