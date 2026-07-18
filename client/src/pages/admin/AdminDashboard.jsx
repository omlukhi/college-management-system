import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/dashboard/admin')
      .then(res => {
        if (res.data.success) {
          setStats(res.data.stats);
          setCharts(res.data.charts);
          setActivities(res.data.recentActivity);
        }
      })
      .catch(() => {
        // Mock fallback if offline/no db
        setStats({
          students: 120,
          teachers: 15,
          departments: 2,
          courses: 4,
          revenue: 135000,
          pendingFees: 45000,
          books: 350,
          issuedBooks: 42,
          placedStudents: 18,
          assignments: 8,
          alerts: 3,
          attendanceDays: 24
        });
        setCharts({
          feesCollection: [
            { month: "Jan 2026", total: 45000 },
            { month: "Feb 2026", total: 60000 },
            { month: "Mar 2026", total: 30000 }
          ],
          grades: [
            { grade: 'O', count: 5 },
            { grade: 'A', count: 18 },
            { grade: 'B', count: 12 },
            { grade: 'C', count: 8 },
            { grade: 'F', count: 2 }
          ]
        });
        setActivities([
          { title: "Semester Registration Open", posted_by: "Admin Office", created_at: new Date() }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="spinner-container"><div className="cms-spinner"></div></div>
    );
  }

  // Fees Chart Data Configuration
  const feesData = {
    labels: charts?.feesCollection?.map(c => c.month) || [],
    datasets: [
      {
        label: 'Fees Collected (₹)',
        data: charts?.feesCollection?.map(c => c.total) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#1e3a8a',
        borderWidth: 1,
      },
    ],
  };

  // Grade Doughnut Configuration
  const gradesData = {
    labels: charts?.grades?.map(g => `Grade ${g.grade}`) || [],
    datasets: [
      {
        data: charts?.grades?.map(g => g.count) || [],
        backgroundColor: [
          '#10b981', // green (O)
          '#3b82f6', // blue (A)
          '#f59e0b', // orange (B)
          '#8b5cf6', // purple (C)
          '#ef4444'  // red (F)
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="fade-in-up">
      <h2 className="fw-bold mb-4">Dashboard Overview</h2>
      
      {/* 4 Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="cms-card border-start border-primary border-4">
            <h6 className="text-uppercase text-muted fw-bold small">Total Students</h6>
            <h3 className="fw-bold text-primary mb-0">{stats.students}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="cms-card border-start border-success border-4">
            <h6 className="text-uppercase text-muted fw-bold small">Fees Collection</h6>
            <h3 className="fw-bold text-success mb-0">₹{stats.revenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="cms-card border-start border-info border-4">
            <h6 className="text-uppercase text-muted fw-bold small">Active Courses</h6>
            <h3 className="fw-bold text-info mb-0">{stats.courses}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="cms-card border-start border-warning border-4">
            <h6 className="text-uppercase text-muted fw-bold small">Faculty Members</h6>
            <h3 className="fw-bold text-warning mb-0">{stats.teachers}</h3>
          </div>
        </div>
      </div>

      {/* Grid for Charts & Reports */}
      <div className="row g-4 mb-5">
        <div className="col-lg-7">
          <div className="cms-card h-100">
            <h5 className="fw-bold text-primary mb-4">Monthly Fees Collection (₹)</h5>
            <div style={{ height: '280px' }}>
              <Bar data={feesData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="cms-card h-100">
            <h5 className="fw-bold text-primary mb-4">Grade Distribution</h5>
            <div style={{ height: '280px' }} className="d-flex justify-content-center">
              <Doughnut data={gradesData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Bulletins */}
      <div className="cms-card">
        <h5 className="fw-bold text-primary mb-3">Recent Announcements</h5>
        <div className="list-group list-group-flush">
          {activities.map((act, idx) => (
            <div className="list-group-item py-3" key={idx}>
              <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1 fw-bold">{act.title}</h6>
                <small className="text-muted">{new Date(act.created_at).toLocaleDateString()}</small>
              </div>
              <small className="text-muted">Posted by {act.posted_by}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
