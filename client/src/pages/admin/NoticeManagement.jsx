import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NoticeManagement() {
  const [notices, setNotices] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '', target_role: 'all' });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState('');

  const fetchNotices = () => {
    setLoading(true);
    axios.get('/api/notices')
      .then(res => {
        if (res.data.success) setNotices(res.data.notices);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/notices', formData);
      if (res.data.success) {
        setAlert('Notice broadcasted successfully!');
        fetchNotices();
        setFormData({ title: '', content: '', target_role: 'all' });
      }
    } catch (err) {
      setAlert('Failed to create notice.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      const res = await axios.delete(`/api/notices/${id}`);
      if (res.data.success) {
        setAlert('Notice removed.');
        fetchNotices();
      }
    } catch (err) {
      setAlert('Failed to delete notice.');
    }
  };

  return (
    <div className="fade-in-up">
      <h2 className="fw-bold mb-4">📢 Announcement Desk</h2>

      {alert && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {alert}
          <button type="button" className="btn-close" onClick={() => setAlert('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Create Announcement */}
        <div className="col-lg-4">
          <div className="cms-card">
            <h5 className="fw-bold text-primary mb-3">Post Announcement</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label small">Notice Title</label>
                <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label small">Audience Scope</label>
                <select name="target_role" className="form-select" value={formData.target_role} onChange={handleInputChange}>
                  <option value="all">Everyone</option>
                  <option value="teacher">Faculty Members Only</option>
                  <option value="student">Students Only</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small">Detailed Message</label>
                <textarea name="content" className="form-control" rows="4" value={formData.content} onChange={handleInputChange} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">Broadcast Circular</button>
            </form>
          </div>
        </div>

        {/* Existing announcements list */}
        <div className="col-lg-8">
          <div className="cms-card">
            <h5 className="fw-bold text-primary mb-3">Active Board Circulars</h5>
            {loading ? (
              <div className="spinner-container"><div className="cms-spinner"></div></div>
            ) : (
              <div className="list-group">
                {notices.map((notice, idx) => (
                  <div className="list-group-item py-3" key={idx}>
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <h5 className="mb-1 text-primary fw-bold">{notice.title}</h5>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(notice.id)}>🗑️ Remove</button>
                    </div>
                    <p className="mb-2 text-muted small">{notice.content}</p>
                    <small className="text-secondary">Audience: <strong>{notice.target_role}</strong> | Posted: {new Date(notice.created_at).toLocaleDateString()}</small>
                  </div>
                ))}
                {notices.length === 0 && (
                  <div className="text-center py-4 text-muted">No circular announcements posted yet.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoticeManagement;
