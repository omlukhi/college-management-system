import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import StudentManagement from '../pages/admin/StudentManagement';
import TeacherManagement from '../pages/admin/TeacherManagement';
import CourseManagement from '../pages/admin/CourseManagement';
import FeeManagement from '../pages/admin/FeeManagement';
import NoticeManagement from '../pages/admin/NoticeManagement';
import MessageInbox from '../pages/admin/MessageInbox';

function AdminLayout() {
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
          🎓 Admin Panel
        </Link>
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/admin')}`} to="/admin">
              📊 Dashboard Overview
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/admin/students')}`} to="/admin/students">
              👥 Manage Students
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/admin/teachers')}`} to="/admin/teachers">
              👨‍🏫 Manage Faculty
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/admin/courses')}`} to="/admin/courses">
              📚 Course Catalog
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/admin/fees')}`} to="/admin/fees">
              💳 Fee Collection
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/admin/notices')}`} to="/admin/notices">
              📢 Notice Board
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/admin/messages')}`} to="/admin/messages">
              ✉️ Visitor Inquiries
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
              Logged in as: <strong className="text-primary">{user?.email}</strong> (Administrator)
            </span>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="teachers" element={<TeacherManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="fees" element={<FeeManagement />} />
            <Route path="notices" element={<NoticeManagement />} />
            <Route path="messages" element={<MessageInbox />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
