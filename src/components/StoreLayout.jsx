import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { catalogApi } from '../api/services';
import { useFetch } from '../hooks';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { homeFor, ROLES } from '../utils/format';

export default function StoreLayout() {
  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useShop();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const { data: cats } = useFetch(() => catalogApi.categories(), []);
  const isCustomerOrGuest = !user || user.role === ROLES.CUSTOMER;

  const search = (e) => { e.preventDefault(); nav(`/products?keyword=${encodeURIComponent(q.trim())}`); };
  return (
    <>
      <header className="topbar">
        <div className="container">
          <Link to="/" className="logo">e<b>mart</b></Link>
          <form className="search" onSubmit={search}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, brands…" aria-label="Search" />
            <button type="submit">Search</button>
          </form>
          {user ? (
            <>
              <Link to={homeFor(user.role)} className="hlink"><span>Hello, {user.name.split(' ')[0]}</span><b>My account</b></Link>
              <button className="hlink" onClick={async () => { await logout(); nav('/'); }}><span>Account</span><b>Logout</b></button>
            </>
          ) : (
            <>
              <Link to="/login" className="hlink"><span>Hello, sign in</span><b>Account</b></Link>
              <Link to="/seller/register" className="hlink"><span>Become a</span><b>Seller</b></Link>
            </>
          )}
          {isCustomerOrGuest && (
            <>
              <Link to="/customer/wishlist" className="hlink"><span>Your</span><b>Wishlist ♡</b>{wishlist.length > 0 && <i className="count">{wishlist.length}</i>}</Link>
              <Link to="/customer/cart" className="hlink"><span>Your</span><b>Cart 🛒</b>{cartCount > 0 && <i className="count">{cartCount}</i>}</Link>
            </>
          )}
        </div>
        <nav className="catbar"><div className="container">
          <Link to="/products">All products</Link>
          {(cats || []).map((c) => <Link key={c.id} to={`/category/${encodeURIComponent(c.name)}`}>{c.name}</Link>)}
        </div></nav>
      </header>
      <Outlet />
      <footer className="footer">© {new Date().getFullYear()} Emart · <Link to="/seller/login">Seller portal</Link> · <Link to="/admin/login">Admin</Link></footer>
    </>
  );
}
