import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function MainLayout() {
  const { user, token, logout, theme, toggleTheme } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg cms-navbar py-3">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center fw-bold" to="/" style={{ color: 'var(--primary-color)' }}>
            <span className="fs-3 me-2">🎓</span> Apex Institute
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item"><Link className="nav-link nav-link-custom" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link nav-link-custom" to="/about">About</Link></li>
              <li className="nav-item"><Link className="nav-link nav-link-custom" to="/courses">Courses</Link></li>
              <li className="nav-item"><Link className="nav-link nav-link-custom" to="/departments">Departments</Link></li>
              <li className="nav-item"><Link className="nav-link nav-link-custom" to="/faculty">Faculty</Link></li>
              <li className="nav-item"><Link className="nav-link nav-link-custom" to="/gallery">Gallery</Link></li>
              <li className="nav-item"><Link className="nav-link nav-link-custom" to="/notices">Notices</Link></li>
              <li className="nav-item"><Link className="nav-link nav-link-custom" to="/contact">Contact</Link></li>

              {/* Dark Mode toggle button */}
              <li className="nav-item ms-lg-2">
                <button className="btn btn-outline-secondary btn-sm p-2" onClick={toggleTheme}>
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              </li>

              {/* Logged in or Login action */}
              <li className="nav-item ms-lg-3">
                {token && user ? (
                  <div className="d-flex align-items-center gap-2">
                    <Link className="btn btn-primary btn-sm px-3" to={`/${user.role}`}>
                      Dashboard
                    </Link>
                    <button className="btn btn-danger btn-sm px-3" onClick={logout}>
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link className="btn btn-primary btn-sm px-4" to="/login">
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-5" style={{ backgroundColor: '#0f172a', color: '#94a3b8' }}>
        <div className="container">
          <div className="row g-4">
            {/* Quick Links */}
            <div className="col-md-3">
              <h5 className="text-white mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/about" className="text-decoration-none text-muted">About Us</Link></li>
                <li><Link to="/courses" className="text-decoration-none text-muted">Academic Courses</Link></li>
                <li><Link to="/gallery" className="text-decoration-none text-muted">Gallery</Link></li>
                <li><Link to="/notices" className="text-decoration-none text-muted">Bulletin Board</Link></li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="col-md-3">
              <h5 className="text-white mb-3">Follow Us</h5>
              <div className="d-flex gap-3">
                <a href="#" className="text-decoration-none text-muted fs-4"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 10.994 10.125 11.853v-8.385H7.078v-3.468h3.047V9.412c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.926-1.956 1.874v2.249h3.328l-.532 3.468h-2.796v8.385C19.612 23.067 24 18.092 24 12.073z" />
                </svg> facebook</a>
                <a href="#" className="text-decoration-none text-muted fs-4"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#E4405F" viewBox="0 0 24 24">
                  <path d="M7.5 2A5.5 5.5 0 0 0 2 7.5v9A5.5 5.5 0 0 0 7.5 22h9a5.5 5.5 0 0 0 5.5-5.5v-9A5.5 5.5 0 0 0 16.5 2h-9zm0 2h9A3.5 3.5 0 0 1 20 7.5v9a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 4 16.5v-9A3.5 3.5 0 0 1 7.5 4zm9.75 1a.75.75 0 1 0 .75.75.75.75 0 0 0-.75-.75zM12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 2a3 3 0 1 1-3 3 3 3 0 0 1 3-3z" />
                </svg>~ Instagram</a>
              </div>
            </div>

            {/* Address */}
            <div className="col-md-3">
              <h5 className="text-white mb-3">Contact Info</h5>
              <p className="mb-1 text-muted">📍 Sector 62, Noida, UP, India</p>
              <p className="mb-1 text-muted">📞 +91 9876543210</p>
              <p className="mb-0 text-muted">✉️ info@apexinstitute.edu</p>
            </div>

            {/* Google Map */}
            <div className="col-md-3">
              <h5 className="text-white mb-3">Location</h5>
              <div className="rounded overflow-hidden" style={{ height: '120px' }}>
                <iframe
                  title="Campus Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5620138541295!2d77.35967527622832!3d28.61289947567406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5662f555555%3A0x6b402cf89c372f2e!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
          <hr className="my-4 border-secondary" />
          <div className="text-center text-muted">
            <small>&copy; {new Date().getFullYear()} Apex Institute of Technology. All rights reserved.</small>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
