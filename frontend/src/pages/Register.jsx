import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function Register() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (form.password.length < 6) e.password = 'Use at least 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
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
      const { data } = await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
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
        <h1>Create account</h1>
        <p className="muted">The first account created becomes the admin.</p>
        {serverError && <div className="alert">{serverError}</div>}
        <label>Name
          <input value={form.name} onChange={set('name')} />
          {errors.name && <small className="error">{errors.name}</small>}
        </label>
        <label>Email
          <input type="email" value={form.email} onChange={set('email')} />
          {errors.email && <small className="error">{errors.email}</small>}
        </label>
        <label>Password
          <input type="password" value={form.password} onChange={set('password')} />
          {errors.password && <small className="error">{errors.password}</small>}
        </label>
        <label>Confirm password
          <input type="password" value={form.confirm} onChange={set('confirm')} />
          {errors.confirm && <small className="error">{errors.confirm}</small>}
        </label>
        <button className="btn primary" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
        <p className="muted center">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
