import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
        setRole(decoded?.role || null);
      } catch (error) {
        console.error('Invalid token:', error);
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}users/logout`, {}, { withCredentials: true });
      localStorage.removeItem('token');
      Cookies.remove('token', { path: '/' });
      router.push('/');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <Link href="/" className="navbar-brand">{appName}</Link>

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
            <ul className="navbar-nav ms-auto align-items-center">

              {/* Admin Role */}
              {role === '1' && (
                <>
                  <li className="nav-item">
                    <Link href="/admin/dashboard" className="nav-link">Dashboard</Link>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Manage Course
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <Link href="/admin/categories" className="dropdown-item">Course Category</Link>
                      </li>
                      <li>
                        <Link href="/admin/course" className="dropdown-item">Courses</Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link href="/admin/users" className="nav-link">Users</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/admin/settings" className="nav-link">Settings</Link>
                  </li>
                </>
              )}

              {/* User Role */}
              {role === '2' && (
                <>
                  <li className="nav-item">
                    <Link href="/user/dashboard" className="nav-link">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/user/profile" className="nav-link">Profile</Link>
                  </li>
                </>
              )}

              {/* Menu Items for Logged-in Users */}
              {!role && (
                <>
                  <li className="nav-item ms-3">
                    <Link href="/" className="nav-link">Home</Link>
                  </li>
                  <li className="nav-item ms-3">
                    <Link href="/courses" className="nav-link">Courses</Link>
                  </li>
                  <li className="nav-item ms-3">
                    <Link href="/about" className="nav-link">About</Link>
                  </li>
                  <li className="nav-item ms-3">
                    <Link href="/contact" className="nav-link">Contact</Link>
                  </li>
                </>
              )}

              {/* Login / Logout */}
              <li className="nav-item ms-3">
                {role ? (
                  <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Logout
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleLogin}>
                    Login
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
