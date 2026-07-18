import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PublicDepartments() {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/courses/departments')
      .then(res => {
        if (res.data.success) {
          setDepts(res.data.departments);
        }
      })
      .catch(() => {
        setDepts([
          { name: "Computer Applications", code: "CA", description: "Department of Computer Applications running BCA & MCA courses" },
          { name: "Information Science", code: "IS", description: "Department of Information Science running engineering courses" }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-5 fade-in-up">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">Academic Departments</h1>
        <p className="lead text-muted">Specialized study blocks equipped with industry-standard labs.</p>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="cms-spinner"></div></div>
      ) : (
        <div className="row g-4">
          {depts.map((dept, idx) => (
            <div className="col-md-6" key={idx}>
              <div className="cms-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold text-primary mb-0">{dept.name}</h4>
                  <span className="badge bg-secondary px-3 py-2 fs-6">{dept.code}</span>
                </div>
                <p className="text-muted mb-0">{dept.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicDepartments;
