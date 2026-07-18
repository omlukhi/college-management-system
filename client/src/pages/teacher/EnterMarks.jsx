import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EnterMarks() {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSem, setSelectedSem] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');

  const [marksData, setMarksData] = useState({}); // { studentId: { internal: '', external: '' } }
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/courses/courses').then(res => res.data.success && setCourses(res.data.courses));
  }, []);

  // Fetch subjects & exams when course changes
  useEffect(() => {
    if (selectedCourse) {
      axios.get(`/api/courses/subjects?courseId=${selectedCourse}`)
        .then(res => res.data.success && setSubjects(res.data.subjects));

      axios.get(`/api/exams?courseId=${selectedCourse}`)
        .then(res => res.data.success && setExams(res.data.exams));
    }
  }, [selectedCourse]);

  const handleFetchStudents = async () => {
    if (!selectedCourse || !selectedSem) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/students?courseId=${selectedCourse}&semester=${selectedSem}`);
      if (res.data.success) {
        setStudents(res.data.students);
        
        // Load existing marks if any
        const initial = {};
        res.data.students.forEach(s => {
          initial[s.id] = { internal: '', external: '' };
        });
        
        // Fetch existing result log
        const resR = await axios.get(`/api/results?courseId=${selectedCourse}&semester=${selectedSem}&subjectId=${selectedSubject}&examId=${selectedExam}`);
        if (resR.data.success && resR.data.results.length) {
          resR.data.results.forEach(r => {
            if (initial[r.student_id]) {
              initial[r.student_id] = { internal: r.internal_marks, external: r.external_marks };
            }
          });
        }
        setMarksData(initial);
      }
    } catch (err) {}
    setLoading(false);
  };

  const handleMarkChange = (studentId, field, value) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (studentId) => {
    const data = marksData[studentId];
    
    // Validate limits
    if (parseInt(data.internal) > 30 || parseInt(data.external) > 70) {
      setAlert('⚠️ Validation Error: Internals max is 30, Externals max is 70.');
      return;
    }

    const payload = {
      student_id: studentId,
      exam_id: selectedExam,
      subject_id: selectedSubject,
      internal_marks: parseInt(data.internal || 0),
      external_marks: parseInt(data.external || 0)
    };

    try {
      const res = await axios.post('/api/results/enter', payload);
      if (res.data.success) {
        setAlert('Marks logged and grade calculated successfully!');
      }
    } catch (err) {
      setAlert('Failed to submit marks.');
    }
  };

  return (
    <div className="fade-in-up">
      <h2 className="fw-bold mb-4">Academic Marks Entry</h2>

      {alert && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {alert}
          <button type="button" className="btn-close" onClick={() => setAlert('')}></button>
        </div>
      )}

      {/* Selectors panel */}
      <div className="cms-card mb-4">
        <h5 className="fw-bold text-primary mb-3">Filter Marks Sheet</h5>
        <div className="row g-3 align-items-end">
          <div className="col-md-2">
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
            <label className="form-label small">Exam Code</label>
            <select className="form-select" value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
              <option value="">Select Exam</option>
              {exams.map((ex, i) => <option key={i} value={ex.id}>{ex.name}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small">Subject Name</label>
            <select className="form-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
              <option value="">Select Subject</option>
              {subjects.map((s, i) => <option key={i} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleFetchStudents}>Load Ledger</button>
          </div>
        </div>
      </div>

      {/* Student List for entering marks */}
      {students.length > 0 && (
        <div className="cms-card">
          <h5 className="fw-bold text-primary mb-3">Class List (Internals /30 | Externals /70)</h5>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Enrollment</th>
                  <th>Full Name</th>
                  <th>Internal Marks</th>
                  <th>External Marks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={idx}>
                    <td><strong>{student.enrollment_no}</strong></td>
                    <td>{student.first_name} {student.last_name}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{ width: '80px' }}
                        min="0"
                        max="30"
                        value={marksData[student.id]?.internal || ''}
                        onChange={(e) => handleMarkChange(student.id, 'internal', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{ width: '80px' }}
                        min="0"
                        max="70"
                        value={marksData[student.id]?.external || ''}
                        onChange={(e) => handleMarkChange(student.id, 'external', e.target.value)}
                      />
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => handleSubmit(student.id)}>
                        💾 Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnterMarks;
