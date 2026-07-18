import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Pages
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import MarkAttendance from '../pages/teacher/MarkAttendance';
import EnterMarks from '../pages/teacher/EnterMarks';
import UploadMaterials from '../pages/teacher/UploadMaterials';

function TeacherLayout() {
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
          🎓 Faculty Desk
        </Link>
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/teacher')}`} to="/teacher">
              📊 Overview Panel
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/teacher/attendance')}`} to="/teacher/attendance">
              📝 Roll Call / Attendance
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/teacher/marks')}`} to="/teacher/marks">
              ✏️ Enter Exam Marks
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/teacher/materials')}`} to="/teacher/materials">
              📂 Study Material Upload
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
              Logged in as Faculty: <strong className="text-primary">{user?.first_name} {user?.last_name}</strong>
            </span>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
          <Routes>
            <Route index element={<TeacherDashboard />} />
            <Route path="attendance" element={<MarkAttendance />} />
            <Route path="marks" element={<EnterMarks />} />
            <Route path="materials" element={<UploadMaterials />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default TeacherLayout;
