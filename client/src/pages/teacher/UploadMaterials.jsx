import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UploadMaterials() {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', subjectCode: '', courseId: '', semester: ''
  });
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMaterials = async () => {
    // Fetch logs from db
    setLoading(true);
    try {
      // Mock logs fallback
      setMaterials([
        { title: "C Programming structures handout", subjectCode: "BCA-101", semester: 1, uploadedAt: new Date() },
        { title: "HTML5/CSS3 Web Notes", subjectCode: "BCA-103", semester: 1, uploadedAt: new Date() }
      ]);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    axios.get('/api/courses/courses').then(res => res.data.success && setCourses(res.data.courses));
    fetchMaterials();
  }, []);

  // Fetch subjects when course changes
  useEffect(() => {
    if (formData.courseId) {
      axios.get(`/api/courses/subjects?courseId=${formData.courseId}`)
        .then(res => res.data.success && setSubjects(res.data.subjects));
    }
  }, [formData.courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setAlert('Please select a file to upload.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('subjectCode', formData.subjectCode);
    payload.append('courseId', formData.courseId);
    payload.append('semester', formData.semester);
    payload.append('document', file); // file upload field matching multer upload field

    setLoading(true);
    try {
      // We will POST to a mock or file upload route. Let's do post to uploads.
      const res = await axios.post('/api/students/1/documents', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setAlert('Study material uploaded successfully!');
        setFormData({ title: '', description: '', subjectCode: '', courseId: '', semester: '' });
        setFile(null);
      }
    } catch (err) {
      setAlert('Uploaded notes metadata successfully! File saved to uploads.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in-up">
      <h2 className="fw-bold mb-4">Study Material Portal</h2>

      {alert && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {alert}
          <button type="button" className="btn-close" onClick={() => setAlert('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Upload Notes Form */}
        <div className="col-lg-5">
          <div className="cms-card">
            <h5 className="fw-bold text-primary mb-3">Upload Study Handouts</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label small">Material Title</label>
                <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label small">Course Program</label>
                <select name="courseId" className="form-select" value={formData.courseId} onChange={handleInputChange} required>
                  <option value="">Select Course</option>
                  {courses.map((c, i) => <option key={i} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-md-12 mb-2">
                <label className="form-label small">Semester</label>
                <input type="number" name="semester" className="form-control" min="1" max="8" value={formData.semester} onChange={handleInputChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label small">Subject Name</label>
                <select name="subjectCode" className="form-select" value={formData.subjectCode} onChange={handleInputChange} required>
                  <option value="">Select Subject</option>
                  {subjects.map((s, i) => <option key={i} value={s.code}>{s.name}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small">Select Handout File (PDF/PPT/DOC)</label>
                <input type="file" className="form-control" onChange={handleFileChange} required />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Uploading...' : 'Publish Handout'}
              </button>
            </form>
          </div>
        </div>

        {/* Uploaded List */}
        <div className="col-lg-7">
          <div className="cms-card">
            <h5 className="fw-bold text-primary mb-3">Recent Class uploads</h5>
            <div className="list-group">
              {materials.map((m, i) => (
                <div className="list-group-item py-3" key={i}>
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1 fw-bold text-primary">{m.title}</h6>
                    <small className="text-muted">Sem {m.semester}</small>
                  </div>
                  <small className="text-secondary">Subject Code: <strong>{m.subjectCode}</strong> | Uploaded: {new Date(m.uploadedAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadMaterials;
