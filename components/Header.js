import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Header = () => {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Token ko localStorage se fetch karo
    const token = localStorage.getItem('token');
    
    if (token) {
      // JWT decode karo aur user role ko get karo
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      setRole(decoded.role); // Set role from decoded token
    } else {
      // Agar token nahi milta, to login page pe redirect kar do
      router.push('/login');
    }
  }, [router]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Learning App</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {role === '1' && ( // Admin ke liye navbar
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/admin/dashboard">Dashboard</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/admin/course/">Manage Course</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/admin/settings">Settings</a>
                  </li>
                </>
              )}
              {role === '2' && ( // User ke liye navbar
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/user/dashboard">Dashboard</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/user/profile">Profile</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/user/orders">Orders</a>
                  </li>
                </>
              )}
              {role && ( // Logout option, common for both admin and user
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header