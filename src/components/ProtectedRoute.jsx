import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeFor } from '../utils/format';

/** UX guard only. The backend independently rejects any request made with the wrong role. */
export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) {
    const p = loc.pathname;
    const to = p.startsWith('/admin') ? '/admin/login' : p.startsWith('/seller') ? '/seller/login' : '/login';
    return <Navigate to={to} state={{ from: loc }} replace />;
  }
  if (!roles.includes(user.role)) {
    return (
      <div className="page container" style={{ textAlign: 'center' }}>
        <h1>403 – Access denied</h1>
        <p className="muted">Your account does not have permission to view this page.</p>
        <Link className="btn btn-primary" to={homeFor(user.role)}>Go to my dashboard</Link>
      </div>
    );
  }
  return <Outlet />;
}
