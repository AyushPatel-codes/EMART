import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import { Stars } from './Badges';
import { useShop } from '../context/ShopContext';
import { money } from '../utils/format';

export default function ProductCard({ product: p }) {
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const on = inWishlist(p.id);
  return (
    <div className="pcard">
      <button className={`wish ${on ? 'on' : ''}`} onClick={() => toggleWishlist(p)} aria-label="Toggle wishlist">{on ? '♥' : '♡'}</button>
      <Link to={`/products/${p.id}`}><ProductImage src={p.images?.[0]} name={p.name} /></Link>
      <Link to={`/products/${p.id}`} className="pname">{p.name}</Link>
      <Stars rating={p.rating} count={p.reviewCount} />
      <div>
        <span className="price">{money(p.finalPrice)}</span>
        {p.discount > 0 && <><span className="old">{money(p.price)}</span><span className="off">{Math.round(p.discount)}% off</span></>}
      </div>
      {p.stock === 0 ? <span className="badge b-CANCELLED">Out of stock</span> : p.stock <= 5 && <small className="error-text">Only {p.stock} left</small>}
      <button className="btn btn-primary" disabled={p.stock === 0} onClick={() => addToCart(p.id)}>Add to cart</button>
    </div>
  );
}
