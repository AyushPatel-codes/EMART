import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/services';
import { errMsg, errFields } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Field from '../components/Field';
import { canAccess, homeFor, ROLES } from '../utils/format';

/** variant: 'customer' | 'seller' | 'admin' - same form, different endpoint/heading. */
export default function Login({ variant = 'customer' }) {
  const { user, login, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [fields, setFields] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const titles = { customer: 'Sign in', seller: 'Seller sign in', admin: 'Admin sign in' };

  if (user) return <Navigate to={homeFor(user.role)} replace />;

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setFields({}); setBusy(true);
    try {
      const data = variant === 'admin' ? await authApi.adminLogin(form) : await authApi.login(form);
      if (variant === 'seller' && data.role !== ROLES.SELLER) { setErr('This is not a seller account. Use the customer sign-in.'); setBusy(false); return; }
      if (variant === 'customer' && data.role === ROLES.ADMIN) { setErr('Invalid email or password'); setBusy(false); return; }
      const u = login(data);
      const from = loc.state?.from?.pathname;
      nav(from && canAccess(u.role, from) ? from : homeFor(u.role), { replace: true });
    } catch (ex) { setErr(errMsg(ex)); setFields(errFields(ex)); setBusy(false); }
  };

  return (
    <div className="auth page">
      <form className="card" onSubmit={submit}>
        <h2>{titles[variant]}</h2>
        {err && <div className="alert error">{err}</div>}
        <Field label="Email" type="email" value={form.email} onChange={set('email')} error={fields.email} required autoComplete="username" />
        <Field label="Password" type="password" value={form.password} onChange={set('password')} error={fields.password} required autoComplete="current-password" />
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        {variant === 'customer' && <p className="muted">New to Emart? <Link to="/register">Create an account</Link> · <Link to="/seller/login">Seller sign in</Link></p>}
        {variant === 'seller' && <p className="muted">Want to sell on Emart? <Link to="/seller/register">Register as a seller</Link></p>}
      </form>
    </div>
  );
}
