// components/Footer.js
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          <div className="text-center">
            <h5>Learning App</h5>
            <p>© {new Date().getFullYear()} All Rights Reserved.</p>
          </div>
          {/* <div className="col-md-6 text-md-right">
            <ul className="list-unstyled">
              <li>
                <Link href="/privacy-policy" className="text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;