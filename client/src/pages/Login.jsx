import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        // Authenticate context session
        login(res.data.token, res.data.user);

        // Redirect based on role
        const role = res.data.user.role;
        navigate(`/${role}`);
      } else {
        setError(res.data.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or server connection issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 fade-in-up">
      <div className="row justify-content-center py-5">
        <div className="col-md-5">
          <div className="cms-card">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">Login Access Portal</h2>
              <p className="text-muted small">Sign in to access your administrative, faculty, or student dashboard</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 mb-3" role="alert">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@college.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
