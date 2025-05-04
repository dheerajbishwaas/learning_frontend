import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';  // Import Link from next
import axios from 'axios';
import Cookies from 'js-cookie';

const Header = () => {
  const [role, setRole] = useState(null);
  const router = useRouter();
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded && decoded.role) {
          setRole(decoded.role);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, [router]);

  // Logout function
  const handleLogout = async () => {
    try {
      // Call backend API to log out the user and clear the cookie
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}users/logout`, {}, { withCredentials: true });
  
      // Remove token from localStorage
      localStorage.removeItem('token');
      Cookies.remove('access_token', {
        path: '/', 
      });
      // Redirect to login page or home page
      router.push('/');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  // Redirect to login page
  const handleLogin = () => {
    router.push('/login');  // Redirect to login page
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link href="/" passHref>
            <span className="navbar-brand">{appName}</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {role === '1' && ( // Admin ke liye navbar
                <>
                  <li className="nav-item">
                    <Link href="/admin/dashboard" passHref>
                      <span className="nav-link">Dashboard</span>
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Manage Course
                    </span>
                    <ul className="dropdown-menu">
                      <li>
                        <Link href="/admin/categories" passHref>
                          <span className="dropdown-item">Course Category</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/admin/course" passHref>
                          <span className="dropdown-item">Courses</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link href="/admin/settings" passHref>
                      <span className="nav-link">Settings</span>
                    </Link>
                  </li>
                </>
              )}
              {role === '2' && ( // User ke liye navbar
                <>
                  <li className="nav-item">
                    <Link href="/user/dashboard" passHref>
                      <span className="nav-link">Dashboard</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/user/profile" passHref>
                      <span className="nav-link">Profile</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/user/orders" passHref>
                      <span className="nav-link">Orders</span>
                    </Link>
                  </li>
                </>
              )}
              {role ? ( // Logout option, common for both admin and user
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </li>
              ) : ( // Login button for unauthenticated users
                <li className="nav-item">
                  <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
