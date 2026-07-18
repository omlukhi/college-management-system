import React, { useState } from 'react';
import axios from 'axios';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', msg: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    if (!name || !email || !subject || !message) {
      setAlert({ type: 'danger', msg: 'All form fields are required.' });
      return;
    }

    // Basic email format check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setAlert({ type: 'danger', msg: 'Please provide a valid email address.' });
      return;
    }

    setLoading(true);
    setAlert({ type: '', msg: '' });

    try {
      const res = await axios.post('/api/contacts', formData);
      if (res.data.success) {
        setAlert({ type: 'success', msg: res.data.message });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setAlert({ type: 'danger', msg: res.data.message });
      }
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Server connection failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 fade-in-up">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">Contact Admissions Office</h1>
        <p className="lead text-muted">Have a query? Drop us a message, and our counselors will get in touch.</p>
      </div>

      <div className="row g-5">
        {/* Contact Form */}
        <div className="col-lg-7">
          <div className="cms-card">
            <h3 className="fw-bold mb-4">Send Us A Message</h3>
            
            {alert.msg && (
              <div className={`alert alert-${alert.type} alert-dismissible`} role="alert">
                {alert.msg}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Your Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="form-control"
                  placeholder="Admission query, Course syllabus, etc."
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Message Detail</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="5"
                  placeholder="Type your query in detail..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary px-4 fw-semibold" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>

        {/* Contact details cards */}
        <div className="col-lg-5">
          <div className="cms-card mb-4" style={{ borderLeft: '6px solid var(--primary-color)' }}>
            <h5 className="fw-bold mb-3">📍 Main Campus</h5>
            <p className="text-muted mb-0">
              A-10, Sector 62, Noida, Gautam Buddha Nagar, Uttar Pradesh 201301
            </p>
          </div>

          <div className="cms-card mb-4" style={{ borderLeft: '6px solid var(--primary-light)' }}>
            <h5 className="fw-bold mb-3">📞 Helpline Numbers</h5>
            <p className="text-muted mb-1">General Office: +91 9876543210</p>
            <p className="text-muted mb-0">Admissions Cell: +91 9988776655</p>
          </div>

          <div className="cms-card" style={{ borderLeft: '6px solid var(--success)' }}>
            <h5 className="fw-bold mb-3">🕒 Office Working Hours</h5>
            <p className="text-muted mb-1">Monday - Friday: 9:00 AM - 5:00 PM</p>
            <p className="text-muted mb-0">Saturday: 9:00 AM - 1:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
