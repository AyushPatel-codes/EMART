import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/endpoints';
import { CATEGORIES } from '../data/categories';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import '../styles/home.css';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addItem } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getProducts()
            .then((res) => setProducts(res.data))
            .catch(() => setError('Could not load products. Is the backend running?'))
            .finally(() => setLoading(false));
    }, []);

    const handleAddToCart = async (product) => {
        if (!isAuthenticated) return navigate('/login');
        try {
            await addItem(product, 1);
        } catch {
            setError('Could not add to bag.');
        }
    };

    const handleBuyNow = async (product) => {
        if (!isAuthenticated) return navigate('/login');
        try {
            await addItem(product, 1);
            navigate('/checkout');
        } catch {
            setError('Could not start checkout.');
        }
    };

    // Best-selling / top-rated: uses soldCount / rating fields if the backend
    // provides them; otherwise falls back to showing the first items so the
    // sections aren't empty. See README for the optional fields to add.
    const bestSelling = [...products]
        .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
        .slice(0, 4);
    const topRated = [...products]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);

    return (
        <div className="page">
            <div className="home-hero">
                <div className="container">
                    <span className="mono home-hero-eyebrow">✦ Festival Sale · Free shipping over ₹999 ✦</span>
                    <h1 className="home-hero-title">Shop the colours of India</h1>
                </div>
            </div>

            <div className="container">
                {error && <div className="error-banner" style={{ marginTop: 24 }}>{error}</div>}

                <section className="home-section">
                    <h2 className="home-section-title">Shop by Category</h2>
                    <div className="category-grid">
                        {CATEGORIES.map((c) => (
                            <div key={c.id} className="cat-card" onClick={() => navigate(`/category/${c.id}`)}>
                                <div className="cat-icon" style={{ background: `${c.color}22` }}>{c.icon}</div>
                                <span className="cat-label">{c.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {loading && <div className="loading-row">Fetching /api/products…</div>}

                {!loading && (
                    <>
                        <section className="home-section">
                            <h2 className="home-section-title">🔥 Best Selling</h2>
                            {bestSelling.length === 0 ? (
                                <p className="home-empty-note">No products yet — add some from the admin panel.</p>
                            ) : (
                                <div className="product-grid">
                                    {bestSelling.map((p) => (
                                        <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="home-section" style={{ paddingBottom: 60 }}>
                            <h2 className="home-section-title">⭐ Top Rated</h2>
                            {topRated.length === 0 ? (
                                <p className="home-empty-note">No products yet.</p>
                            ) : (
                                <div className="product-grid">
                                    {topRated.map((p) => (
                                        <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
