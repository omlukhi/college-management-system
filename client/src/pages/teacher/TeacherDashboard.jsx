import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TeacherDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/dashboard/teacher')
      .then(res => {
        if (res.data.success) {
          setDashboardData(res.data);
        }
      })
      .catch(() => {
        // Fallback mock
        setDashboardData({
          assignedSubjectsCount: 2,
          uploadedAssignments: 4,
          uploadedMaterials: 3,
          subjects: [
            { name: "Programming in C", code: "BCA-101", course_name: "BCA" },
            { name: "Web Technologies", code: "BCA-103", course_name: "BCA" }
          ]
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !dashboardData) {
    return (
      <div className="spinner-container"><div className="cms-spinner"></div></div>
    );
  }

  return (
    <div className="fade-in-up">
      <h2 className="fw-bold mb-4">Faculty Desk</h2>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="cms-card border-start border-primary border-4 text-center">
            <h6 className="text-uppercase text-muted fw-bold small">Assigned Subjects</h6>
            <h3 className="fw-bold text-primary mb-0">{dashboardData.assignedSubjectsCount}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="cms-card border-start border-success border-4 text-center">
            <h6 className="text-uppercase text-muted fw-bold small">Uploaded Materials</h6>
            <h3 className="fw-bold text-success mb-0">{dashboardData.uploadedMaterials}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="cms-card border-start border-info border-4 text-center">
            <h6 className="text-uppercase text-muted fw-bold small">Uploaded Assignments</h6>
            <h3 className="fw-bold text-info mb-0">{dashboardData.uploadedAssignments}</h3>
          </div>
        </div>
      </div>

      <div className="cms-card">
        <h5 className="fw-bold text-primary mb-3">Assigned Class Timetable</h5>
        <div className="list-group">
          {dashboardData.subjects.map((sub, i) => (
            <div className="list-group-item d-flex justify-content-between align-items-center py-3" key={i}>
              <div>
                <h6 className="mb-0 fw-bold">{sub.name} ({sub.code})</h6>
                <small className="text-muted">Target: {sub.course_name} Program</small>
              </div>
              <span className="badge bg-primary px-3 py-2">Active Syllabus</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
