// components/Layout.js
import Footer from './Footer';
import Header from './Header'; // Make sure to import your Header component

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header /> {/* This will include the header on every page */}
      <main className="flex-grow-1">
        {children} {/* This will render the page-specific content */}
      </main>
      <Footer /> {/* This will include the footer on every page */}
    </div>
  );
};

export default Layout;
