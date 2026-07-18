import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState('');

  const [formData, setFormData] = useState({
    employee_id: '', first_name: '', last_name: '', email: '',
    phone: '', address: '', department_id: '', qualification: '', salary: ''
  });

  const fetchTeachers = () => {
    setLoading(true);
    axios.get('/api/teachers')
      .then(res => {
        if (res.data.success) setTeachers(res.data.teachers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    axios.get('/api/courses/departments').then(res => res.data.success && setDepts(res.data.departments));
    fetchTeachers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/teachers', formData);
      if (res.data.success) {
        setAlert('Faculty member profile registered successfully!');
        fetchTeachers();
        setFormData({
          employee_id: '', first_name: '', last_name: '', email: '',
          phone: '', address: '', department_id: '', qualification: '', salary: ''
        });
      }
    } catch (err) {
      setAlert(err.response?.data?.message || 'Failed to register faculty member.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      const res = await axios.delete(`/api/teachers/${id}`);
      if (res.data.success) {
        setAlert('Faculty profile removed.');
        fetchTeachers();
      }
    } catch (err) {
      setAlert('Failed to delete teacher.');
    }
  };

  return (
    <div className="fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Manage Faculty Members</h2>
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTeacherModal">
          ➕ Register Faculty
        </button>
      </div>

      {alert && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {alert}
          <button type="button" className="btn-close" onClick={() => setAlert('')}></button>
        </div>
      )}

      {loading ? (
        <div className="spinner-container"><div className="cms-spinner"></div></div>
      ) : (
        <div className="cms-table-container">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Full Name</th>
                <th>Department</th>
                <th>Qualification</th>
                <th>Salary (₹)</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, idx) => (
                <tr key={idx}>
                  <td><strong>{teacher.employee_id}</strong></td>
                  <td>{teacher.first_name} {teacher.last_name}</td>
                  <td>{teacher.department_name}</td>
                  <td>{teacher.qualification}</td>
                  <td>₹{parseFloat(teacher.salary).toLocaleString()}</td>
                  <td>{teacher.phone}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(teacher.id)}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">No faculty profiles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Teacher Modal */}
      <div className="modal fade" id="addTeacherModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <form className="modal-content" onSubmit={handleAddSubmit}>
            <div className="modal-header">
              <h5 className="modal-title fw-bold">Register New Faculty</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Employee ID</label>
                  <input type="text" name="employee_id" className="form-control" value={formData.employee_id} onChange={handleInputChange} placeholder="e.g. EMP102" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Department</label>
                  <select name="department_id" className="form-select" value={formData.department_id} onChange={handleInputChange} required>
                    <option value="">Select Department</option>
                    {depts.map((d, i) => <option key={i} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Qualification</label>
                  <input type="text" name="qualification" className="form-control" placeholder="e.g. M.Tech, Ph.D" value={formData.qualification} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Salary (Monthly ₹)</label>
                  <input type="number" name="salary" className="form-control" value={formData.salary} onChange={handleInputChange} required />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Address</label>
                  <textarea name="address" className="form-control" rows="2" value={formData.address} onChange={handleInputChange}></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save Faculty</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TeacherManagement;
