import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Students from './pages/Students.jsx';
import StudentForm from './pages/StudentForm.jsx';
import StudentDetails from './pages/StudentDetails.jsx';

function Protected({ children, adminOnly }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/students" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Protected><Dashboard /></Protected>} />
      <Route path="/students" element={<Protected><Students /></Protected>} />
      <Route path="/students/new" element={<Protected adminOnly><StudentForm /></Protected>} />
      <Route path="/students/:id/edit" element={<Protected adminOnly><StudentForm /></Protected>} />
      <Route path="/students/:id" element={<Protected><StudentDetails /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
