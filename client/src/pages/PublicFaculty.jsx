import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PublicFaculty() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/teachers')
      .then(res => {
        if (res.data.success) {
          setTeachers(res.data.teachers);
        }
      })
      .catch(() => {
        setTeachers([
          { first_name: "Dr. Ramesh", last_name: "Sharma", employee_id: "EMP1001", qualification: "Ph.D in Computer Science", department_name: "Computer Applications", email: "teacher@college.com" }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-5 fade-in-up">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">Our Top Faculty</h1>
        <p className="lead text-muted">Learn from highly qualified experts and researchers.</p>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="cms-spinner"></div></div>
      ) : (
        <div className="row g-4">
          {teachers.map((teacher, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="cms-card text-center h-100">
                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center bg-primary text-white rounded-circle" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                  👨‍🏫
                </div>
                <h4 className="fw-bold text-primary mb-1">{teacher.first_name} {teacher.last_name}</h4>
                <p className="badge bg-light text-dark border mb-3">{teacher.employee_id}</p>
                <p className="mb-2"><strong>Dept:</strong> {teacher.department_name}</p>
                <p className="mb-2"><strong>Quals:</strong> {teacher.qualification}</p>
                <p className="mb-0 text-muted small">✉️ {teacher.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicFaculty;
