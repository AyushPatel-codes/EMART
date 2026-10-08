import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '../api/services';
import { errMsg, errFields } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useUi } from '../context/UiContext';
import Field from '../components/Field';
import { homeFor } from '../utils/format';

function RegisterForm({ title, intro, fields, call, footer }) {
  const { user, login } = useAuth();
  const ui = useUi();
  const nav = useNavigate();
  const [form, setForm] = useState(() => Object.fromEntries(fields.map((f) => [f.name, ''])));
  const [errs, setErrs] = useState({});
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={homeFor(user.role)} replace />;

  const submit = async (e) => {
    e.preventDefault(); setErrs({}); setMsg(''); setBusy(true);
    try {
      const u = login(await call(form));
      ui.success('Account created!');
      nav(homeFor(u.role), { replace: true });
    } catch (ex) { setErrs(errFields(ex)); setMsg(errMsg(ex)); setBusy(false); }
  };
  return (
    <div className="auth wide page">
      <form className="card" onSubmit={submit}>
        <h2>{title}</h2>
        <p className="muted">{intro}</p>
        {msg && <div className="alert error">{msg}</div>}
        <div className="form-grid">
          {fields.map((f) => (
            <Field key={f.name} label={f.label} type={f.type || 'text'} value={form[f.name]} error={errs[f.name]} required
                   onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} autoComplete={f.auto} />
          ))}
        </div>
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        <p className="muted">{footer}</p>
      </form>
    </div>
  );
}

const base = [
  { name: 'name', label: 'Full name', auto: 'name' },
  { name: 'email', label: 'Email', type: 'email', auto: 'email' },
  { name: 'password', label: 'Password (min 8 characters)', type: 'password', auto: 'new-password' },
  { name: 'phone', label: 'Phone', type: 'tel', auto: 'tel' },
];

export const RegisterCustomer = () => (
  <RegisterForm title="Create your Emart account" intro="Shop, track orders and save your favourites."
    fields={[...base, { name: 'address', label: 'Address' }]} call={authApi.registerCustomer}
    footer={<>Already have an account? <Link to="/login">Sign in</Link></>} />
);

export const RegisterSeller = () => (
  <RegisterForm title="Become an Emart seller" intro="Your application is reviewed by an admin. You can start selling once it is approved."
    fields={[...base, { name: 'storeName', label: 'Store / business name' }, { name: 'businessAddress', label: 'Business address' }]}
    call={authApi.registerSeller} footer={<>Already a seller? <Link to="/seller/login">Sign in</Link></>} />
);
