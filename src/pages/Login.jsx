import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginMode, setLoginMode] = useState('USER'); // 'USER' or 'ADMIN' — UI only
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userInfo = await login(form);

            // Guard: if someone picked the Admin tab but their account isn't
            // actually an admin, don't silently let them into the customer flow —
            // tell them clearly instead.
            if (loginMode === 'ADMIN' && userInfo.role !== 'ADMIN') {
                setError('This account does not have admin access.');
                setLoading(false);
                return;
            }

            navigate(userInfo.role === 'ADMIN' ? '/admin' : '/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="form-card">
        <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--turquoise)', textTransform: 'uppercase', fontWeight: 700 }}>
          Welcome back
        </span>
                <h2 style={{ margin: '8px 0 20px' }}>Sign in</h2>

                <div className="login-mode-tabs">
                    <button
                        type="button"
                        className={loginMode === 'USER' ? 'active' : ''}
                        onClick={() => setLoginMode('USER')}
                    >
                        🛍️ Customer
                    </button>
                    <button
                        type="button"
                        className={loginMode === 'ADMIN' ? 'active' : ''}
                        onClick={() => setLoginMode('ADMIN')}
                    >
                        🛠️ Admin
                    </button>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Email</label>
                        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input type="password" name="password" required value={form.password} onChange={handleChange} placeholder="••••••••" />
                    </div>
                    <button className="btn btn-pay btn-block" disabled={loading}>
                        {loading ? 'Signing in…' : loginMode === 'ADMIN' ? 'Sign in to Admin' : 'Sign in'}
                    </button>
                </form>

                <p style={{ marginTop: 20, fontSize: '0.85rem', color: 'var(--muted)' }}>
                    New here? <Link to="/register" style={{ color: 'var(--magenta)', fontWeight: 600 }}>Create an account</Link>
                </p>
            </div>
        </div>
    );
}