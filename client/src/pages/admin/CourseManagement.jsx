import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CourseManagement() {
  const [depts, setDepts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const [deptForm, setDeptForm] = useState({ name: '', code: '', description: '' });
  const [courseForm, setCourseForm] = useState({ department_id: '', name: '', duration_years: '', semester_count: '' });
  const [subjectForm, setSubjectForm] = useState({ course_id: '', semester: '', name: '', code: '', credit_hours: '' });
  
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const resD = await axios.get('/api/courses/departments');
      if (resD.data.success) setDepts(resD.data.departments);

      const resC = await axios.get('/api/courses/courses');
      if (resC.data.success) setCourses(resC.data.courses);

      const resS = await axios.get('/api/courses/subjects');
      if (resS.data.success) setSubjects(resS.data.subjects);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/courses/departments', deptForm);
      if (res.data.success) {
        setAlert('Department created successfully!');
        fetchData();
        setDeptForm({ name: '', code: '', description: '' });
      }
    } catch (err) { setAlert('Failed to add department.'); }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/courses/courses', courseForm);
      if (res.data.success) {
        setAlert('Course program added!');
        fetchData();
        setCourseForm({ department_id: '', name: '', duration_years: '', semester_count: '' });
      }
    } catch (err) { setAlert('Failed to add course.'); }
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/courses/subjects', subjectForm);
      if (res.data.success) {
        setAlert('Subject added successfully.');
        fetchData();
        setSubjectForm({ course_id: '', semester: '', name: '', code: '', credit_hours: '' });
      }
    } catch (err) { setAlert('Failed to add subject.'); }
  };

  return (
    <div className="fade-in-up">
      <h2 className="fw-bold mb-4">Course & Academic Catalog</h2>

      {alert && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {alert}
          <button type="button" className="btn-close" onClick={() => setAlert('')}></button>
        </div>
      )}

      {loading ? (
        <div className="spinner-container"><div className="cms-spinner"></div></div>
      ) : (
        <div className="row g-4">
          
          {/* Departments block */}
          <div className="col-lg-4">
            <div className="cms-card">
              <h5 className="fw-bold text-primary mb-3">Departments</h5>
              <form onSubmit={handleDeptSubmit} className="mb-4">
                <input type="text" className="form-control mb-2" placeholder="Dept Name" value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} required />
                <input type="text" className="form-control mb-2" placeholder="Code (e.g. CA)" value={deptForm.code} onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })} required />
                <button type="submit" className="btn btn-primary btn-sm w-100">Add Department</button>
              </form>
              <ul className="list-group list-group-flush">
                {depts.map((d, i) => (
                  <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
                    {d.name} <span className="badge bg-secondary">{d.code}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Courses block */}
          <div className="col-lg-4">
            <div className="cms-card">
              <h5 className="fw-bold text-primary mb-3">Courses</h5>
              <form onSubmit={handleCourseSubmit} className="mb-4">
                <select className="form-select mb-2" value={courseForm.department_id} onChange={(e) => setCourseForm({ ...courseForm, department_id: e.target.value })} required>
                  <option value="">Select Dept</option>
                  {depts.map((d, i) => <option key={i} value={d.id}>{d.name}</option>)}
                </select>
                <input type="text" className="form-control mb-2" placeholder="Course Name" value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} required />
                <input type="number" className="form-control mb-2" placeholder="Duration (Years)" value={courseForm.duration_years} onChange={(e) => setCourseForm({ ...courseForm, duration_years: e.target.value })} required />
                <input type="number" className="form-control mb-2" placeholder="Semesters" value={courseForm.semester_count} onChange={(e) => setCourseForm({ ...courseForm, semester_count: e.target.value })} required />
                <button type="submit" className="btn btn-primary btn-sm w-100">Add Course</button>
              </form>
              <ul className="list-group list-group-flush">
                {courses.map((c, i) => (
                  <li className="list-group-item py-2" key={i}>
                    <div><strong>{c.name}</strong></div>
                    <small className="text-muted">{c.duration_years} Years ({c.semester_count} Sems)</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Subjects block */}
          <div className="col-lg-4">
            <div className="cms-card">
              <h5 className="fw-bold text-primary mb-3">Subjects</h5>
              <form onSubmit={handleSubjectSubmit} className="mb-4">
                <select className="form-select mb-2" value={subjectForm.course_id} onChange={(e) => setSubjectForm({ ...subjectForm, course_id: e.target.value })} required>
                  <option value="">Select Course</option>
                  {courses.map((c, i) => <option key={i} value={c.id}>{c.name}</option>)}
                </select>
                <input type="number" className="form-control mb-2" placeholder="Semester" min="1" max="8" value={subjectForm.semester} onChange={(e) => setSubjectForm({ ...subjectForm, semester: e.target.value })} required />
                <input type="text" className="form-control mb-2" placeholder="Subject Name" value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} required />
                <input type="text" className="form-control mb-2" placeholder="Subject Code" value={subjectForm.code} onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })} required />
                <input type="number" className="form-control mb-2" placeholder="Credit Hours" value={subjectForm.credit_hours} onChange={(e) => setSubjectForm({ ...subjectForm, credit_hours: e.target.value })} required />
                <button type="submit" className="btn btn-primary btn-sm w-100">Add Subject</button>
              </form>
              <ul className="list-group list-group-flush">
                {subjects.map((s, i) => (
                  <li className="list-group-item py-2" key={i}>
                    <div className="d-flex justify-content-between">
                      <strong>{s.name}</strong>
                      <span className="badge bg-light text-dark border">{s.code}</span>
                    </div>
                    <small className="text-muted">Sem {s.semester} | {s.credit_hours} credits</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default CourseManagement;
