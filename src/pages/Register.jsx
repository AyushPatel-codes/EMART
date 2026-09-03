import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleCheckbox = (e) => setForm({ ...form, role: e.target.checked ? 'ADMIN' : 'USER' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(form);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not create account. Try a different email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="form-card">
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--turquoise)', textTransform: 'uppercase', fontWeight: 700 }}>New account</span>
                <h2 style={{ margin: '8px 0 24px' }}>Create an account</h2>
                {error && <div className="error-banner">{error}</div>}
                {success && <div className="success-banner">Account created — redirecting to sign in…</div>}
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Full name</label>
                        <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Jordan Rivera" />
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
                    </div>
                    <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <input
                            type="checkbox"
                            id="isAdmin"
                            checked={form.role === 'ADMIN'}
                            onChange={handleCheckbox}
                            style={{ width: 'auto' }}
                        />
                        <label htmlFor="isAdmin" style={{ marginBottom: 0, cursor: 'pointer' }}>Register as Admin</label>
                    </div>
                    <button className="btn btn-pay btn-block" disabled={loading}>
                        {loading ? 'Creating…' : 'Create account'}
                    </button>
                </form>
                <p style={{ marginTop: 20, fontSize: '0.85rem', color: 'var(--muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--magenta)', fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}