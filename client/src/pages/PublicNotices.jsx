import React, { useEffect, useState } from 'react';
import axios from 'axios';


function PublicNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/notices')
      .then(res => {
        if (res.data.success) {
          setNotices(res.data.notices);
        }
      })
      .catch(() => {
        setNotices([
          { title: "Semester Registration Open", content: "All students must complete their Semester 1 registration and fee payments by 31st July.", posted_by: "Admin Office", created_at: new Date().toISOString() },
          { title: "Smart India Hackathon Internal Nominations", content: "Register in teams of 6 before 20th July with your project synopsis.", posted_by: "Tech Club Coordinator", created_at: new Date().toISOString() }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-5 fade-in-up">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">Notice Board</h1>
        <p className="lead text-muted">Keep up-to-date with academic announcements and circulars.</p>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="cms-spinner"></div></div>
      ) : (
        <div className="row g-4 justify-content-center">
          <div className="col-lg-10">
            {notices.map((notice, idx) => (
              <div className="cms-card mb-4 border-start border-primary border-4" key={idx}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold text-primary mb-0">{notice.title}</h4>
                  <small className="text-muted">📅 {new Date(notice.created_at).toLocaleDateString()}</small>
                </div>
                <p className="mb-3 text-muted">{notice.content}</p>
                <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded">
                  <small className="text-muted">Posted By: <strong>{notice.posted_by}</strong></small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicNotices;
