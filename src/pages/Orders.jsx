import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../api/endpoints';
import '../styles/orders.css';

export default function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user?.id) {
            setLoading(false);
            return;
        }
        getOrders(user.id)
            .then((res) => setOrders(Array.isArray(res.data) ? res.data : [res.data]))
            .catch(() => setError('Could not load your orders.'))
            .finally(() => setLoading(false));
    }, [user]);

    return (
        <div className="page">
            <div className="container" style={{ paddingTop: 36, paddingBottom: 80, maxWidth: 900 }}>
                <h1 style={{ marginBottom: 24 }}>Your Orders</h1>
                {error && <div className="error-banner">{error}</div>}
                {loading && <div className="loading-row">Fetching your orders…</div>}

                {!loading && orders.length === 0 && (
                    <div className="empty-state">
                        <h3>No orders yet</h3>
                        <p>Orders you place will show up here.</p>
                    </div>
                )}

                <div className="order-list">
                    {orders.map((o, idx) => (
                        <div className="order-row" key={o.id || idx}>
                            <div>
                                <span className="mono order-id">#{o.id || idx + 1}</span>
                                <span className="order-status">{o.status || 'PLACED'}</span>
                            </div>
                            <div>
                                <span className="mono order-amount">₹{Number(o.total || o.amount || 0).toLocaleString('en-IN')}</span>
                                {o.createdAt && <span className="order-date">{new Date(o.createdAt).toLocaleDateString()}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
