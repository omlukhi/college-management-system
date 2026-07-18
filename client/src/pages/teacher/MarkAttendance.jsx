import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MarkAttendance() {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSem, setSelectedSem] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [records, setRecords] = useState({});
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/courses/courses').then(res => res.data.success && setCourses(res.data.courses));
  }, []);

  // Fetch subjects when course is selected
  useEffect(() => {
    if (selectedCourse) {
      axios.get(`/api/courses/subjects?courseId=${selectedCourse}`)
        .then(res => res.data.success && setSubjects(res.data.subjects));
    }
  }, [selectedCourse]);

  const handleFetchStudents = async () => {
    if (!selectedCourse || !selectedSem) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/students?courseId=${selectedCourse}&semester=${selectedSem}`);
      if (res.data.success) {
        setStudents(res.data.students);
        
        // Initialize all records to Present
        const initial = {};
        res.data.students.forEach(s => {
          initial[s.id] = 'Present';
        });
        setRecords(initial);
      }
    } catch (err) {}
    setLoading(false);
  };

  const handleStatusChange = (studentId, status) => {
    setRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject || !students.length) return;

    const payload = {
      date,
      subjectId: selectedSubject,
      courseId: selectedCourse,
      semester: selectedSem,
      records: Object.keys(records).map(studentId => ({
        studentId,
        status: records[studentId]
      }))
    };

    try {
      const res = await axios.post('/api/attendance', payload);
      if (res.data.success) {
        setAlert('Attendance roll call submitted and synchronized successfully!');
        setStudents([]);
      }
    } catch (err) {
      setAlert('Failed to submit attendance.');
    }
  };

  return (
    <div className="fade-in-up">
      <h2 className="fw-bold mb-4">Roll Call Attendance</h2>

      {alert && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {alert}
          <button type="button" className="btn-close" onClick={() => setAlert('')}></button>
        </div>
      )}

      {/* Selectors panel */}
      <div className="cms-card mb-4">
        <h5 className="fw-bold text-primary mb-3">Select Target Class</h5>
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label small">Course Program</label>
            <select className="form-select" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">Select Course</option>
              {courses.map((c, i) => <option key={i} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label small">Semester</label>
            <input type="number" className="form-control" min="1" max="8" value={selectedSem} onChange={(e) => setSelectedSem(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label small">Subject</label>
            <select className="form-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
              <option value="">Select Subject</option>
              {subjects.map((s, i) => <option key={i} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label small">Date</label>
            <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleFetchStudents}>Load Students</button>
          </div>
        </div>
      </div>

      {/* Student List and marking radio checklist */}
      {students.length > 0 && (
        <form onSubmit={handleSubmit} className="cms-card">
          <h5 className="fw-bold text-primary mb-3">Student Roll Sheet</h5>
          <div className="table-responsive mb-4">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Enrollment</th>
                  <th>Full Name</th>
                  <th className="text-center">Status Toggle</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={idx}>
                    <td><strong>{student.enrollment_no}</strong></td>
                    <td>{student.first_name} {student.last_name}</td>
                    <td className="text-center">
                      <div className="btn-group" role="group">
                        <input
                          type="radio"
                          className="btn-check"
                          name={`status-${student.id}`}
                          id={`present-${student.id}`}
                          checked={records[student.id] === 'Present'}
                          onChange={() => handleStatusChange(student.id, 'Present')}
                        />
                        <label className="btn btn-outline-success btn-sm" htmlFor={`present-${student.id}`}>Present</label>

                        <input
                          type="radio"
                          className="btn-check"
                          name={`status-${student.id}`}
                          id={`absent-${student.id}`}
                          checked={records[student.id] === 'Absent'}
                          onChange={() => handleStatusChange(student.id, 'Absent')}
                        />
                        <label className="btn btn-outline-danger btn-sm" htmlFor={`absent-${student.id}`}>Absent</label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="submit" className="btn btn-primary px-5 py-2">Submit Attendance Ledger</button>
        </form>
      )}
    </div>
  );
}

export default MarkAttendance;
