import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { catalogApi, customerApi } from '../api/services';
import { errMsg, errFields } from '../api/client';
import { useFetch, usePaged } from '../hooks';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useUi } from '../context/UiContext';
import { Empty, ErrorBox, Loader } from '../components/Feedback';
import Pagination from '../components/Pagination';
import ProductImage from '../components/ProductImage';
import { Stars } from '../components/Badges';
import { day, money, ROLES } from '../utils/format';

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const ui = useUi();
  const { data: p, loading, error, reload } = useFetch(() => catalogApi.product(id), [id]);
  const reviews = usePaged((q) => catalogApi.reviews(id, q), { id }, 5);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [rv, setRv] = useState({ rating: 5, comment: '' });
  const [rvErr, setRvErr] = useState({});

  if (loading) return <Loader />;
  if (error) return <div className="container page"><ErrorBox message={error} onRetry={reload} /></div>;

  const submitReview = async (e) => {
    e.preventDefault(); setRvErr({});
    try {
      await customerApi.createReview(id, { rating: Number(rv.rating), comment: rv.comment });
      ui.success('Thanks for your review!'); setRv({ rating: 5, comment: '' }); reviews.reload(); reload();
    } catch (er) { setRvErr(errFields(er)); ui.error(errMsg(er)); }
  };

  return (
    <div className="container page">
      <div className="detail">
        <div>
          <div style={{ maxWidth: 480 }}><ProductImage key={img} src={p.images?.[img]} name={p.name} /></div>
          {p.images?.length > 1 && <div className="thumbs">{p.images.map((s, i) => <img key={i} src={s} alt="" className={i === img ? 'on' : ''} onClick={() => setImg(i)} />)}</div>}
        </div>
        <div>
          <Link to={`/category/${encodeURIComponent(p.category)}`} className="muted">{p.category}</Link>
          <h1>{p.name}</h1>
          {p.brand && <div className="muted">Brand: {p.brand}</div>}
          <Stars rating={p.rating} count={p.reviewCount} />
          <div style={{ margin: '12px 0' }}>
            <span className="price" style={{ fontSize: 28 }}>{money(p.finalPrice)}</span>
            {p.discount > 0 && <><span className="old">{money(p.price)}</span><span className="off">{Math.round(p.discount)}% off</span></>}
          </div>
          <p>{p.description}</p>
          <div className="card">
            <b>Sold by:</b> {p.sellerName || 'Emart seller'}
            <div>Availability: {p.stock > 0 ? <span className="badge b-ACTIVE">In stock ({p.stock})</span> : <span className="badge b-CANCELLED">Out of stock</span>}</div>
          </div>
          <div className="row">
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span>{qty}</span>
              <button onClick={() => setQty(Math.min(p.stock || 1, qty + 1))}>+</button>
            </div>
            <button className="btn btn-primary" disabled={p.stock === 0} onClick={() => addToCart(p.id, qty)}>Add to cart</button>
            <button className="btn btn-outline" onClick={() => toggleWishlist(p)}>{inWishlist(p.id) ? '♥ In wishlist' : '♡ Add to wishlist'}</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }} id="reviews">
        <h2>Customer reviews</h2>
        {user?.role === ROLES.CUSTOMER && (
          <form onSubmit={submitReview} style={{ marginBottom: 16 }}>
            <div className="alert warn">You can review a product once it has been delivered to you.</div>
            <div className="row">
              <label className="field"><span>Rating</span>
                <select value={rv.rating} onChange={(e) => setRv({ ...rv, rating: e.target.value })}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}</select>
              </label>
              <label className="field grow"><span>Comment</span><input value={rv.comment} onChange={(e) => setRv({ ...rv, comment: e.target.value })} maxLength={1000} /></label>
              <button className="btn btn-blue">Submit review</button>
            </div>
            {rvErr.rating && <small className="error-text">{rvErr.rating}</small>}
          </form>
        )}
        {reviews.loading && !reviews.data ? <Loader /> : !reviews.data?.content?.length ? <Empty text="No reviews yet." /> : (
          <>
            {reviews.data.content.map((r) => (
              <div key={r.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <Stars rating={r.rating} /> <b>{r.customerName}</b> <small className="muted">{day(r.createdAt)}</small>
                <div>{r.comment}</div>
              </div>
            ))}
            <Pagination page={reviews.page} totalPages={reviews.data.totalPages} onChange={reviews.setPage} />
          </>
        )}
      </div>
    </div>
  );
}
