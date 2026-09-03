import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getCategory } from '../data/categories';
import '../styles/cart.css';

export default function Cart() {
    const { items, updateQuantity, removeItem, total, clearCart } = useCart();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="page">
                <div className="container empty-state">
                    <div style={{ fontSize: '2.4rem' }}>🛍️</div>
                    <h3>Your bag is empty</h3>
                    <p>Browse the catalogue and add something you like.</p>
                    <Link to="/" className="btn btn-buy" style={{ marginTop: 16 }}>Start shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container" style={{ paddingTop: 36, paddingBottom: 80, maxWidth: 900 }}>
                <h1 style={{ marginBottom: 24 }}>Your Bag</h1>

                <div className="cart-list">
                    {items.map((item) => {
                        const cat = getCategory(item.category);
                        return (
                            <div className="cart-row" key={item.productId}>
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt="" className="cart-thumb" />
                                ) : (
                                    <div className="cart-thumb cart-thumb-placeholder" style={{ background: `${cat.color}22` }}>
                                        {cat.icon}
                                    </div>
                                )}
                                <div className="cart-row-main">
                                    <div className="cart-name">{item.name}</div>
                                    <div className="mono cart-unit-price">₹{item.price} × {item.quantity}</div>
                                </div>
                                <div className="qty-stepper">
                                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                                    <span className="mono">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                                </div>
                                <span className="mono cart-line-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                <button className="cart-remove" onClick={() => removeItem(item.productId)} aria-label="Remove item">✕</button>
                            </div>
                        );
                    })}
                </div>

                <div className="cart-summary">
                    <button className="btn btn-outline btn-sm" onClick={clearCart}>Clear bag</button>
                    <span className="mono cart-total-amount">Total: ₹{total.toLocaleString('en-IN')}</span>
                    <button className="btn btn-pay" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
}
