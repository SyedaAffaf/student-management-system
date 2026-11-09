import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

export default function StudentDetails() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [s, setS] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/students/${id}`).then((r) => setS(r.data)).catch((e) => setError(errMsg(e)));
  }, [id]);

  if (error) return <div className="alert">{error}</div>;
  if (!s) return <Spinner />;

  const rows = [
    ['Email', s.email],
    ['Phone', s.phone || '-'],
    ['Course', s.course],
    ['Age', s.age ?? '-'],
    ['Registered', new Date(s.createdAt).toLocaleString()],
    ['Last updated', new Date(s.updatedAt).toLocaleString()],
  ];

  return (
    <>
      <div className="page-head">
        <h1>{s.name}</h1>
        <div className="row-btns">
          {isAdmin && <Link to={`/students/${s._id}/edit`} className="btn primary">Edit student</Link>}
          <Link to="/students" className="btn ghost">Back to list</Link>
        </div>
      </div>
      <div className="card">
        <dl className="details">
          {rows.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </div>
    </>
  );
}
