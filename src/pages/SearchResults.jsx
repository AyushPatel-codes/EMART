import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getProducts } from '../api/endpoints';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addItem } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getProducts()
            .then((res) => {
                const q = query.toLowerCase();
                setProducts(
                    res.data.filter(
                        (p) => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
                    )
                );
            })
            .catch(() => setError('Search failed.'))
            .finally(() => setLoading(false));
    }, [query]);

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
                <h1 style={{ fontSize: '1.6rem', marginBottom: 24 }}>Results for "{query}"</h1>
                {error && <div className="error-banner">{error}</div>}
                {loading && <div className="loading-row">Searching…</div>}
                {!loading && products.length === 0 && (
                    <div className="empty-state">
                        <h3>No matches</h3>
                        <p>Try a different search term.</p>
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
