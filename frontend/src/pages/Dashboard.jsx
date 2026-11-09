import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import Spinner from '../components/Spinner.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/students/stats').then((r) => setStats(r.data)).catch((e) => setError(errMsg(e)));
  }, []);

  const search = (e) => {
    e.preventDefault();
    navigate(`/students?search=${encodeURIComponent(q)}`);
  };

  if (error) return <div className="alert">{error}</div>;
  if (!stats) return <Spinner />;

  return (
    <>
      <div className="page-head">
        <h1>Dashboard</h1>
        <form className="search" onSubmit={search}>
          <input placeholder="Search students by name, email or course" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn primary">Search</button>
        </form>
      </div>

      <div className="stats">
        <div className="card stat"><span className="stat-num">{stats.total}</span><span>Total students</span></div>
        <div className="card stat"><span className="stat-num">{stats.thisWeek}</span><span>Joined in the last 7 days</span></div>
        <div className="card stat"><span className="stat-num">{stats.courses}</span><span>Courses offered</span></div>
      </div>

      <div className="card">
        <div className="card-head">
          <h2>Recent registrations</h2>
          <Link to="/students">View all</Link>
        </div>
        {stats.recent.length === 0 ? (
          <p className="muted">No students yet. Add your first student to see them here.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Course</th><th>Email</th><th>Added</th></tr></thead>
              <tbody>
                {stats.recent.map((s) => (
                  <tr key={s._id}>
                    <td><Link to={`/students/${s._id}`}>{s.name}</Link></td>
                    <td>{s.course}</td>
                    <td>{s.email}</td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
