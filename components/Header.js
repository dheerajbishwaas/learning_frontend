import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';  // Import Link from next

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
  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null); 
    router.push('/');
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
                  <li className="nav-item">
                    <Link href="/admin/course/" passHref>
                      <span className="nav-link">Manage Course</span>
                    </Link>
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
