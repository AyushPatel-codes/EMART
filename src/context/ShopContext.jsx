import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { customerApi } from '../api/services';
import { errMsg } from '../api/client';
import { useAuth } from './AuthContext';
import { useUi } from './UiContext';
import { ROLES } from '../utils/format';

const ShopContext = createContext(null);
export const useShop = () => useContext(ShopContext);

/** Cart + wishlist state for logged-in customers. Every action hits the real API. */
export function ShopProvider({ children }) {
  const { user } = useAuth();
  const ui = useUi();
  const nav = useNavigate();
  const loc = useLocation();
  const isCustomer = user?.role === ROLES.CUSTOMER;
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const reloadCart = useCallback(() => customerApi.cart().then(setCart).catch(() => {}), []);
  useEffect(() => {
    if (isCustomer) { reloadCart(); customerApi.wishlist().then(setWishlist).catch(() => {}); }
    else { setCart(null); setWishlist([]); }
  }, [isCustomer, user?.id, reloadCart]);

  const guard = () => {
    if (!user) { nav('/login', { state: { from: loc } }); return false; }
    if (!isCustomer) { ui.error('Please sign in with a customer account to shop'); return false; }
    return true;
  };
  const run = async (fn, ok) => {
    try { const r = await fn(); if (ok) ui.success(ok); return r; } catch (e) { ui.error(errMsg(e)); return null; }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!guard()) return;
    const c = await run(() => customerApi.addToCart({ productId, quantity }), 'Added to cart');
    if (c) setCart(c);
  };
  const updateQty = async (pid, q) => { const c = await run(() => customerApi.updateCartItem(pid, q)); if (c) setCart(c); };
  const removeItem = async (pid) => { const c = await run(() => customerApi.removeCartItem(pid), 'Item removed'); if (c) setCart(c); };
  const clearCart = async () => { const c = await run(() => customerApi.clearCart(), 'Cart cleared'); if (c) setCart(c); };
  const inWishlist = (id) => wishlist.some((p) => p.id === id);
  const toggleWishlist = async (product) => {
    if (!guard()) return;
    const had = inWishlist(product.id);
    const w = await run(() => (had ? customerApi.removeWish(product.id) : customerApi.addWish(product.id)), had ? 'Removed from wishlist' : 'Added to wishlist');
    if (w) setWishlist(w);
  };
  const cartCount = cart ? cart.items.reduce((n, i) => n + i.quantity, 0) : 0;

  return (
    <ShopContext.Provider value={{ cart, cartCount, wishlist, inWishlist, addToCart, updateQty, removeItem, clearCart, toggleWishlist, reloadCart }}>
      {children}
    </ShopContext.Provider>
  );
}
