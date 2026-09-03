import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import '../styles/navbar.css';

export default function Navbar() {
    const {isAuthenticated, user, logout } = useAuth();
    const { count } = useCart();
    const navigate = useNavigate();
    const [ query, setQuery ] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) navigate(`/search?q=${encodeURI(query.trim())}`);
    };

    return (
        <header className="nav">
            <div className="container nav-inner">
                <Link to="/" className="nav-brand">
                    🪷 EMART<span className="nav-brand-accent">SHOP</span>
                </Link>

                <form className="nav-search" onSubmit={handleSearch}>
                    <span className="nav-search-icon">🔍</span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Seach for Products"
                    />
                </form>

                <nav className="nav-links">
                    <Link to="/cart" className="nav-link">🛍️ Bag ({count})</Link>
                    {isAuthenticated && <Link to="/orders" className="nav-link">Orders</Link> }
                    {isAuthenticated && user?.role === 'ADMIN' && <Link to="/admin" className="nav-link">Admin</Link> }
                    {isAuthenticated ? (
                        <span className="nav-link nav-pill" onClick={handleLogout}>Sign Out</span>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link nav-pill">Login</Link>
                            <Link to="/register" className="nav-link nav-pill nav-pill-accent">Register</Link>
                        </>
                    )}
                </nav>
            </div>

        </header>
    );
}