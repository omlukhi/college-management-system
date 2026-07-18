import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import MyAttendance from '../pages/student/MyAttendance';
import MyResults from '../pages/student/MyResults';
import StudentIdCard from '../pages/student/StudentIdCard';

function StudentLayout() {
  const { user, logout, toggleTheme, theme } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar Nav */}
      <aside className="sidebar d-flex flex-column flex-shrink-0 p-3">
        <Link className="navbar-brand text-white fw-bold fs-4 mb-4 px-2 d-block" to="/">
          🎓 Student Desk
        </Link>
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/student')}`} to="/student">
              📊 My Overview
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/student/attendance')}`} to="/student/attendance">
              📈 Attendance Tracker
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/student/results')}`} to="/student/results">
              📝 Exam Marks Cards
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/student/idcard')}`} to="/student/idcard">
              🪪 Student QR ID Card
            </Link>
          </li>
        </ul>
        <hr className="bg-secondary" />
        <div className="px-2">
          <button className="btn btn-outline-light btn-sm w-100 mb-2" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          <button className="btn btn-danger btn-sm w-100" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content Container */}
      <div className="flex-grow-1 d-flex flex-column bg-light text-dark">
        {/* Top Navbar */}
        <header className="navbar navbar-expand navbar-light bg-white border-bottom py-3 px-4 shadow-sm">
          <div className="container-fluid">
            <span className="navbar-text fw-semibold text-secondary">
              Logged in Student: <strong className="text-primary">{user?.first_name} {user?.last_name}</strong>
            </span>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
          <Routes>
            <Route index element={<StudentDashboard />} />
            <Route path="attendance" element={<MyAttendance />} />
            <Route path="results" element={<MyResults />} />
            <Route path="idcard" element={<StudentIdCard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
