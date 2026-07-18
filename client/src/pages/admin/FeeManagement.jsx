import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FeeManagement() {
  const [fees, setFees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState('');
  
  // Invoice form
  const [invoice, setInvoice] = useState({
    course_id: '', semester: '', amount: '', due_date: ''
  });

  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/fees');
      if (res.data.success) setFees(res.data.fees);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    axios.get('/api/courses/courses').then(res => res.data.success && setCourses(res.data.courses));
    fetchFees();
  }, []);

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/fees/schedule', invoice);
      if (res.data.success) {
        setAlert(res.data.message);
        fetchFees();
        setInvoice({ course_id: '', semester: '', amount: '', due_date: '' });
      }
    } catch (err) {
      setAlert('Failed to generate fee invoices.');
    }
  };

  const handleRecordPayment = async (feeId) => {
    if (!window.confirm('Record payment for this receipt?')) return;
    try {
      const res = await axios.post(`/api/fees/collect/${feeId}`, { payment_method: 'Cash/Offline' });
      if (res.data.success) {
        setAlert(`Payment recorded! Receipt: ${res.data.receipt_no}`);
        fetchFees();
      }
    } catch (err) {
      setAlert('Failed to record payment.');
    }
  };

  return (
    <div className="fade-in-up">
      <h2 className="fw-bold mb-4">Fee Collection Desk</h2>

      {alert && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {alert}
          <button type="button" className="btn-close" onClick={() => setAlert('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Generate Invoice Schedule */}
        <div className="col-lg-4">
          <div className="cms-card">
            <h5 className="fw-bold text-primary mb-3">Schedule Semester Fees</h5>
            <form onSubmit={handleCreateInvoice}>
              <div className="mb-2">
                <label className="form-label small">Course Program</label>
                <select name="course_id" className="form-select" value={invoice.course_id} onChange={handleInvoiceChange} required>
                  <option value="">Select Course</option>
                  {courses.map((c, i) => <option key={i} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label small">Target Semester</label>
                <input type="number" name="semester" className="form-control" min="1" max="8" value={invoice.semester} onChange={handleInvoiceChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label small">Amount (₹)</label>
                <input type="number" name="amount" className="form-control" value={invoice.amount} onChange={handleInvoiceChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label small">Due Date</label>
                <input type="date" name="due_date" className="form-control" value={invoice.due_date} onChange={handleInvoiceChange} required />
              </div>
              <button type="submit" className="btn btn-primary w-100">Broadcast Invoice</button>
            </form>
          </div>
        </div>

        {/* Collections Ledger */}
        <div className="col-lg-8">
          <div className="cms-card">
            <h5 className="fw-bold text-primary mb-3">Collections Ledger</h5>
            {loading ? (
              <div className="spinner-container"><div className="cms-spinner"></div></div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Enrollment</th>
                      <th>Student</th>
                      <th>Sem</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((fee, idx) => (
                      <tr key={idx}>
                        <td><strong>{fee.enrollment_no}</strong></td>
                        <td>{fee.student_name}</td>
                        <td>Sem {fee.semester}</td>
                        <td>₹{parseFloat(fee.amount).toLocaleString()}</td>
                        <td>
                          <span className={`badge bg-${fee.status === 'Paid' ? 'success' : 'danger'}`}>
                            {fee.status}
                          </span>
                        </td>
                        <td>
                          {fee.status === 'Pending' && (
                            <button className="btn btn-success btn-sm" onClick={() => handleRecordPayment(fee.id)}>
                              💸 Mark Paid
                            </button>
                          )}
                          {fee.status === 'Paid' && (
                            <span className="text-muted small">Receipt: {fee.receipt_no}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {fees.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">No invoices found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeeManagement;
