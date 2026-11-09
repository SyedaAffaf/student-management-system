import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const validate = () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Enter your password';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setServerError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/');
    } catch (err) {
      setServerError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit} noValidate>
        <h1>Log in</h1>
        <p className="muted">Manage your students in one place.</p>
        {serverError && <div className="alert">{serverError}</div>}
        <label>Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <small className="error">{errors.email}</small>}
        </label>
        <label>Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {errors.password && <small className="error">{errors.password}</small>}
        </label>
        <button className="btn primary" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
        <p className="muted center">No account? <Link to="/register">Create one</Link></p>
      </form>
    </div>
  );
}
