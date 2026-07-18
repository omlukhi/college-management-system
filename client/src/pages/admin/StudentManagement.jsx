import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', enrollment_no: '',
    dob: '', gender: 'Male', phone: '', address: '',
    department_id: '', course_id: '', semester: 1
  });
  
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [alert, setAlert] = useState('');

  const fetchStudents = () => {
    setLoading(true);
    axios.get(`/api/students?search=${search}&courseId=${selectedCourse}`)
      .then(res => {
        if (res.data.success) setStudents(res.data.students);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Initial fetch of support tables
    axios.get('/api/courses/courses').then(res => res.data.success && setCourses(res.data.courses));
    axios.get('/api/courses/departments').then(res => res.data.success && setDepts(res.data.departments));
    fetchStudents();
  }, [search, selectedCourse]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/students', formData);
      if (res.data.success) {
        setAlert('Student profile created successfully!');
        fetchStudents();
        // Reset form
        setFormData({
          first_name: '', last_name: '', email: '', enrollment_no: '',
          dob: '', gender: 'Male', phone: '', address: '',
          department_id: '', course_id: '', semester: 1
        });
      }
    } catch (err) {
      setAlert(err.response?.data?.message || 'Failed to create student.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student and user login details?')) return;
    try {
      const res = await axios.delete(`/api/students/${id}`);
      if (res.data.success) {
        setAlert('Student profile removed successfully.');
        fetchStudents();
      }
    } catch (err) {
      setAlert('Failed to delete student.');
    }
  };

  return (
    <div className="fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Manage Students</h2>
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addStudentModal">
          ➕ Add New Student
        </button>
      </div>

      {alert && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {alert}
          <button type="button" className="btn-close" onClick={() => setAlert('')}></button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search student name or enrollment no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map((c, i) => (
              <option key={i} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Grid */}
      {loading ? (
        <div className="spinner-container"><div className="cms-spinner"></div></div>
      ) : (
        <div className="cms-table-container">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Enrollment</th>
                <th>Full Name</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Phone</th>
                <th>QR Card</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={idx}>
                  <td><strong>{student.enrollment_no}</strong></td>
                  <td>{student.first_name} {student.last_name}</td>
                  <td>{student.course_name}</td>
                  <td>Sem {student.semester}</td>
                  <td>{student.phone}</td>
                  <td>
                    {student.qr_code_path ? (
                      <a href={`http://localhost:5000${student.qr_code_path}`} target="_blank" rel="noreferrer" className="badge bg-light text-primary border text-decoration-none">
                        🖼️ Open QR Card
                      </a>
                    ) : 'Pending'}
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(student.id)}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">No student profiles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Student Modal */}
      <div className="modal fade" id="addStudentModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <form className="modal-content" onSubmit={handleAddSubmit}>
            <div className="modal-header">
              <h5 className="modal-title fw-bold">Enroll New Student</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email Address (Login ID)</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Enrollment Number</label>
                  <input type="text" name="enrollment_no" className="form-control" value={formData.enrollment_no} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Date of Birth</label>
                  <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Gender</label>
                  <select name="gender" className="form-select" value={formData.gender} onChange={handleInputChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
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
                  <label className="form-label">Course Program</label>
                  <select name="course_id" className="form-select" value={formData.course_id} onChange={handleInputChange} required>
                    <option value="">Select Course</option>
                    {courses.map((c, i) => <option key={i} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Semester</label>
                  <input type="number" name="semester" className="form-control" min="1" max="8" value={formData.semester} onChange={handleInputChange} required />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Residential Address</label>
                  <textarea name="address" className="form-control" rows="2" value={formData.address} onChange={handleInputChange}></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save Student</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentManagement;
