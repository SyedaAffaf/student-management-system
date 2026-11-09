import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import Spinner from '../components/Spinner.jsx';

const empty = { name: '', email: '', phone: '', course: '', age: '' };

export default function StudentForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api.get(`/students/${id}`)
      .then((r) => setForm({ ...empty, ...r.data, age: r.data.age ?? '' }))
      .catch((e) => setServerError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Enter the student’s name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.course.trim()) e.course = 'Enter a course';
    if (form.phone && !/^[0-9+\-\s()]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    if (form.age !== '' && (Number(form.age) < 1 || Number(form.age) > 120)) e.age = 'Age must be between 1 and 120';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    setServerError('');
    const payload = { name: form.name, email: form.email, phone: form.phone, course: form.course, ...(form.age !== '' && { age: Number(form.age) }) };
    try {
      if (editing) await api.put(`/students/${id}`, payload);
      else await api.post('/students', payload);
      navigate('/students');
    } catch (err) {
      setServerError(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <div className="page-head"><h1>{editing ? 'Edit student' : 'Add student'}</h1></div>
      <form className="card form-card" onSubmit={submit} noValidate>
        {serverError && <div className="alert">{serverError}</div>}
        <label>Name
          <input value={form.name} onChange={set('name')} />
          {errors.name && <small className="error">{errors.name}</small>}
        </label>
        <label>Email
          <input type="email" value={form.email} onChange={set('email')} />
          {errors.email && <small className="error">{errors.email}</small>}
        </label>
        <div className="row">
          <label>Phone
            <input value={form.phone} onChange={set('phone')} />
            {errors.phone && <small className="error">{errors.phone}</small>}
          </label>
          <label>Age
            <input type="number" value={form.age} onChange={set('age')} />
            {errors.age && <small className="error">{errors.age}</small>}
          </label>
        </div>
        <label>Course
          <input value={form.course} onChange={set('course')} />
          {errors.course && <small className="error">{errors.course}</small>}
        </label>
        <div className="row-btns">
          <button className="btn primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add student'}</button>
          <Link to="/students" className="btn ghost">Cancel</Link>
        </div>
      </form>
    </>
  );
}
