import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

export default function Students() {
  const { isAdmin } = useAuth();
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const page = parseInt(params.get('page')) || 1;

  const [text, setText] = useState(search);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/students', { params: { search, page } })
      .then((r) => { setData(r.data); setError(''); })
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  };
  useEffect(load, [search, page]);

  const submitSearch = (e) => {
    e.preventDefault();
    setParams(text ? { search: text } : {});
  };

  const goTo = (p) => setParams({ ...(search && { search }), page: p });

  const remove = async (s) => {
    if (!window.confirm(`Delete ${s.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/students/${s._id}`);
      // If that was the last row on this page, step back one page.
      if (data.students.length === 1 && page > 1) goTo(page - 1);
      else load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <>
      <div className="page-head">
        <h1>Students</h1>
        {isAdmin && <Link to="/students/new" className="btn primary">Add student</Link>}
      </div>

      <form className="search" onSubmit={submitSearch}>
        <input placeholder="Search by name, email or course" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn primary">Search</button>
        {search && <button type="button" className="btn ghost" onClick={() => { setText(''); setParams({}); }}>Clear</button>}
      </form>

      {error && <div className="alert">{error}</div>}

      <div className="card">
        {loading ? (
          <Spinner />
        ) : data?.students.length === 0 ? (
          <p className="muted">{search ? `No students match "${search}".` : 'No students yet.'}</p>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Course</th><th>Age</th><th></th></tr></thead>
                <tbody>
                  {data.students.map((s) => (
                    <tr key={s._id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.course}</td>
                      <td>{s.age ?? '-'}</td>
                      <td className="actions">
                        <Link to={`/students/${s._id}`}>View</Link>
                        {isAdmin && <Link to={`/students/${s._id}/edit`}>Edit</Link>}
                        {isAdmin && <button className="link danger" onClick={() => remove(s)}>Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pager">
              <button className="btn ghost" disabled={page <= 1} onClick={() => goTo(page - 1)}>Previous</button>
              <span>Page {data.page} of {data.pages} ({data.total} students)</span>
              <button className="btn ghost" disabled={page >= data.pages} onClick={() => goTo(page + 1)}>Next</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
