import { useEffect, useState } from 'react';
import {
    getProducts,
    addAdminProduct,
    deleteAdminProduct,
    getAdminOrders,
    updateAdminOrder
} from '../api/endpoints';
import { CATEGORIES } from '../data/categories';
import '../styles/admin.css';

const ORDER_STATUSES = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminDashboard() {
    const [tab, setTab] = useState('products');

    return (
        <div className="page">
            <div className="container" style={{ paddingTop: 36, paddingBottom: 80 }}>
                <h1 style={{ marginBottom: 24 }}>Admin</h1>

                <div className="admin-tabs">
                    <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Products</button>
                    <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>Orders</button>
                </div>

                {tab === 'products' ? <AdminProducts /> : <AdminOrders />}
            </div>
        </div>
    );
}

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', price: '', description: '', category: CATEGORIES[0].id, imageUrl: '' });
    const [submitting, setSubmitting] = useState(false);

    const load = () => {
        setLoading(true);
        getProducts()
            .then((res) => setProducts(res.data))
            .catch(() => setError('Could not load products.'))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await addAdminProduct({ ...form, price: Number(form.price) });
            setForm({ name: '', price: '', description: '', category: CATEGORIES[0].id, imageUrl: '' });
            load();
        } catch {
            setError('Could not add the product.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteAdminProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch {
            setError('Could not delete that product.');
        }
    };

    return (
        <div className="admin-grid">
            <form className="admin-form" onSubmit={handleAdd}>
                <h3 style={{ marginBottom: 16 }}>Add product</h3>
                <div className="field">
                    <label>Name</label>
                    <input name="name" required value={form.name} onChange={handleChange} placeholder="Product name" />
                </div>
                <div className="field">
                    <label>Price (₹)</label>
                    <input name="price" type="number" min="0" step="0.01" required value={form.price} onChange={handleChange} placeholder="999" />
                </div>
                <div className="field">
                    <label>Category</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                        {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                    </select>
                </div>
                <div className="field">
                    <label>Image URL (optional)</label>
                    <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://…" />
                </div>
                <div className="field">
                    <label>Description</label>
                    <textarea name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Short description" />
                </div>
                <button className="btn btn-buy btn-block" disabled={submitting}>
                    {submitting ? 'Adding…' : 'Add to catalogue'}
                </button>
            </form>

            <div className="admin-list">
                {error && <div className="error-banner">{error}</div>}
                {loading && <div className="loading-row">Loading products…</div>}
                {!loading && products.map((p) => (
                    <div className="admin-row" key={p.id}>
                        <div>
                            <span className="mono admin-row-sku">SKU-{p.id}</span>
                            <strong style={{ marginLeft: 10 }}>{p.name}</strong>
                        </div>
                        <div className="admin-row-right">
                            <span className="mono">₹{Number(p.price).toLocaleString('en-IN')}</span>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = () => {
        setLoading(true);
        getAdminOrders()
            .then((res) => setOrders(res.data))
            .catch(() => setError('Could not load orders.'))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleStatusChange = async (id, status) => {
        try {
            await updateAdminOrder(id, { status });
            setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
        } catch {
            setError('Could not update that order.');
        }
    };

    return (
        <div className="admin-list">
            {error && <div className="error-banner">{error}</div>}
            {loading && <div className="loading-row">Loading orders…</div>}
            {!loading && orders.length === 0 && <div className="empty-state"><h3>No orders yet</h3></div>}
            {!loading && orders.map((o) => (
                <div className="admin-row" key={o.id}>
                    <div>
                        <span className="mono admin-row-sku">#{o.id}</span>
                        <span style={{ marginLeft: 10, color: 'var(--muted)' }}>User {o.userId}</span>
                    </div>
                    <div className="admin-row-right">
                        <span className="mono">₹{Number(o.total || o.amount || 0).toLocaleString('en-IN')}</span>
                        <select value={o.status || 'PLACED'} onChange={(e) => handleStatusChange(o.id, e.target.value)}>
                            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
}
