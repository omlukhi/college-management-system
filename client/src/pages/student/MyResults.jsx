import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState('');
  const [alert, setAlert] = useState('');

  useEffect(() => {
    axios.get('/api/results?studentId=1')
      .then(res => {
        if (res.data.success) {
          setResults(res.data.results);
        }
      })
      .catch(() => {
        // Fallback mock
        setResults([
          { subject_code: "BCA-101", subject_name: "Programming in C", internal_marks: 18, external_marks: 25, total_marks: 43, grade: "E", status: "Pass" },
          { subject_code: "BCA-103", subject_name: "Web Technologies", internal_marks: 20, external_marks: 58, total_marks: 78, grade: "B", status: "Pass" }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadPDF = async () => {
    setAlert('Generating Report Card PDF...');
    try {
      const res = await axios.get('/api/reports/pdf?studentId=1');
      if (res.data.success) {
        setAlert('Report card compiled! Redirecting to report print tab...');
        // Open generated PDF/HTML file in new tab
        window.open(`http://localhost:5000${res.data.fileUrl}`, '_blank');
      }
    } catch (err) {
      setAlert('Failed to generate report card PDF.');
    }
  };

  return (
    <div className="fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">My Academic Results</h2>
        <button className="btn btn-primary" onClick={handleDownloadPDF}>
          🗎 Download Report Card (PDF)
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
        <div className="cms-card">
          <h5 className="fw-bold text-primary mb-3">Academic Report Card - Semester 1</h5>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Subject Name</th>
                  <th>Internal Marks (/30)</th>
                  <th>External Marks (/70)</th>
                  <th>Total Obtained</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res, idx) => (
                  <tr key={idx}>
                    <td><strong>{res.subject_code}</strong></td>
                    <td>{res.subject_name}</td>
                    <td>{res.internal_marks}</td>
                    <td>{res.external_marks}</td>
                    <td><strong>{res.total_marks}</strong></td>
                    <td><span className="badge bg-primary px-3 py-2 fs-6">{res.grade}</span></td>
                    <td>
                      <span className={`badge bg-${res.status === 'Pass' ? 'success' : 'danger'}`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">No academic results published.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyResults;
