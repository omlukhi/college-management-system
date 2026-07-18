import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MessageInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [activeMsg, setActiveMsg] = useState(null);
  const [alert, setAlert] = useState('');

  const fetchMessages = () => {
    setLoading(true);
    axios.get('/api/contacts')
      .then(res => {
        if (res.data.success) setMessages(res.data.messages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText || !activeMsg) return;
    try {
      const res = await axios.put(`/api/contacts/reply/${activeMsg.id}`, { replied_message: replyText });
      if (res.data.success) {
        setAlert('Reply logged and updated!');
        fetchMessages();
        setReplyText('');
        setActiveMsg(null);
      }
    } catch (err) {
      setAlert('Failed to submit reply.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete message entry?')) return;
    try {
      const res = await axios.delete(`/api/contacts/${id}`);
      if (res.data.success) {
        setAlert('Message deleted.');
        fetchMessages();
      }
    } catch (err) {
      setAlert('Failed to delete message.');
    }
  };

  return (
    <div className="fade-in-up">
      <h2 className="fw-bold mb-4">✉️ Visitor Inquiry Desk</h2>

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
          {/* List of Messages */}
          <div className={activeMsg ? "col-lg-6" : "col-lg-12"}>
            <div className="cms-card">
              <h5 className="fw-bold text-primary mb-3">Received Messages</h5>
              <div className="list-group">
                {messages.map((msg, idx) => (
                  <div className={`list-group-item list-group-item-action py-3 ${activeMsg?.id === msg.id ? 'active text-white' : ''}`} key={idx} onClick={() => setActiveMsg(msg)} style={{ cursor: 'pointer' }}>
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1 fw-bold">{msg.name}</h6>
                      <small>{new Date(msg.created_at).toLocaleDateString()}</small>
                    </div>
                    <p className="mb-1 small text-truncate">{msg.message}</p>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <small className="small fw-semibold">{msg.email}</small>
                      <span className={`badge bg-${msg.status === 'replied' ? 'success' : 'warning'}`}>
                        {msg.status}
                      </span>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="text-center py-4 text-muted">No inquiry messages in inbox.</div>
                )}
              </div>
            </div>
          </div>

          {/* Details / Reply panel */}
          {activeMsg && (
            <div className="col-lg-6">
              <div className="cms-card">
                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                  <h5 className="fw-bold text-primary">Inquiry Details</h5>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(activeMsg.id)}>Delete Message</button>
                </div>
                <div className="mb-3">
                  <p className="mb-1"><strong>From:</strong> {activeMsg.name} ({activeMsg.email})</p>
                  <p className="mb-1"><strong>Subject:</strong> {activeMsg.subject}</p>
                  <p className="p-3 bg-light rounded mt-2 border text-muted">
                    "{activeMsg.message}"
                  </p>
                </div>

                <form onSubmit={handleReplySubmit}>
                  <label className="form-label fw-semibold">Reply Message</label>
                  <textarea className="form-control mb-3" rows="4" placeholder="Type reply description..." value={replyText} onChange={(e) => setReplyText(e.target.value)} required></textarea>
                  <button type="submit" className="btn btn-primary w-100">Submit Reply</button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MessageInbox;
