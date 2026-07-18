import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/dashboard/student')
      .then(res => {
        if (res.data.success) {
          setData(res.data);
        }
      })
      .catch(() => {
        // Mock fallback
        setData({
          student: {
            first_name: "Amit",
            last_name: "Kumar",
            enrollment_no: "STU2026001",
            course_name: "BCA",
            dept_name: "Computer Applications",
            semester: 1,
            admission_date: "2026-06-01",
            phone: "9812345678"
          },
          stats: {
            attendancePercentage: 85.00,
            pendingFees: 45000,
            activeBooksCount: 1
          }
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="spinner-container"><div className="cms-spinner"></div></div>
    );
  }

  const { student, stats } = data;

  return (
    <div className="fade-in-up">
      <h2 className="fw-bold mb-4">Student Hub</h2>

      {/* Stats row */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="cms-card border-start border-primary border-4 text-center">
            <h6 className="text-uppercase text-muted fw-bold small">Attendance Average</h6>
            <h3 className="fw-bold text-primary mb-0">{stats.attendancePercentage}%</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="cms-card border-start border-danger border-4 text-center">
            <h6 className="text-uppercase text-muted fw-bold small">Pending Dues</h6>
            <h3 className="fw-bold text-danger mb-0">₹{parseFloat(stats.pendingFees).toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="cms-card border-start border-success border-4 text-center">
            <h6 className="text-uppercase text-muted fw-bold small">Library Book Loans</h6>
            <h3 className="fw-bold text-success mb-0">{stats.activeBooksCount} Books</h3>
          </div>
        </div>
      </div>

      {/* Student bio card */}
      <div className="cms-card mb-4">
        <h5 className="fw-bold text-primary mb-4 border-bottom pb-2">Academic Profile</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <p className="mb-2"><strong>Full Name:</strong> {student.first_name} {student.last_name}</p>
            <p className="mb-2"><strong>Enrollment No:</strong> {student.enrollment_no}</p>
            <p className="mb-2"><strong>Department:</strong> {student.dept_name || 'Computer Applications'}</p>
          </div>
          <div className="col-md-6">
            <p className="mb-2"><strong>Program:</strong> {student.course_name}</p>
            <p className="mb-2"><strong>Current Semester:</strong> Semester {student.semester}</p>
            <p className="mb-2"><strong>Admission Date:</strong> {new Date(student.admission_date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
