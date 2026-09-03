import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProducts } from '../api/endpoints';
import { getCategory } from '../data/categories';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function CategoryProducts() {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addItem } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const category = getCategory(categoryId);

    useEffect(() => {
        setLoading(true);
        getProducts()
            .then((res) => setProducts(res.data.filter((p) => p.category === categoryId)))
            .catch(() => setError('Could not load this category.'))
            .finally(() => setLoading(false));
    }, [categoryId]);

    const handleAddToCart = async (product) => {
        if (!isAuthenticated) return navigate('/login');
        try { await addItem(product, 1); } catch { setError('Could not add to bag.'); }
    };
    const handleBuyNow = async (product) => {
        if (!isAuthenticated) return navigate('/login');
        try { await addItem(product, 1); navigate('/checkout'); } catch { setError('Could not start checkout.'); }
    };

    return (
        <div className="page">
            <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
                <Link to="/" className="nav-link" style={{ color: 'var(--violet)', fontWeight: 700, fontSize: '0.85rem' }}>
                    ← Back to categories
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0 26px' }}>
                    <div className="cat-icon" style={{ width: 48, height: 48, fontSize: '1.5rem', background: `${category.color}22` }}>
                        {category.icon}
                    </div>
                    <h1 style={{ fontSize: '1.8rem' }}>{category.label}</h1>
                </div>

                {error && <div className="error-banner">{error}</div>}
                {loading && <div className="loading-row">Loading…</div>}

                {!loading && products.length === 0 && (
                    <div className="empty-state">
                        <h3>No products in this category yet</h3>
                        <p>Add some from the admin panel and tag them "{categoryId}".</p>
                    </div>
                )}

                {!loading && products.length > 0 && (
                    <div className="product-grid">
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
