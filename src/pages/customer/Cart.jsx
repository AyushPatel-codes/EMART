import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { useUi } from '../../context/UiContext';
import { Empty, Loader } from '../../components/Feedback';
import ProductImage from '../../components/ProductImage';
import { money } from '../../utils/format';

export default function Cart() {
  const { cart, updateQty, removeItem, clearCart } = useShop();
  const ui = useUi();
  if (!cart) return <Loader />;
  return (
    <div className="container page">
      <div className="row between"><h1>Shopping cart</h1>
        {cart.items.length > 0 && <button className="btn btn-outline" onClick={async () => (await ui.confirm('Remove all items from your cart?')) && clearCart()}>Clear cart</button>}
      </div>
      {!cart.items.length ? <div className="card"><Empty text="Your cart is empty." /><div className="right"><Link className="btn btn-primary" to="/products">Browse products</Link></div></div> : (
        <div className="layout-2" style={{ gridTemplateColumns: '1fr 300px' }}>
          <div className="card">
            {cart.items.map((i) => (
              <div className="cart-line" key={i.productId}>
                <ProductImage src={i.image} name={i.productName} />
                <div><Link to={`/products/${i.productId}`}><b>{i.productName}</b></Link><div className="muted">{money(i.price)} each</div>
                  <button className="btn btn-outline btn-sm" onClick={() => removeItem(i.productId)}>Remove</button></div>
                <div className="right">
                  <div className="qty"><button onClick={() => i.quantity > 1 && updateQty(i.productId, i.quantity - 1)}>−</button><span>{i.quantity}</span><button onClick={() => updateQty(i.productId, i.quantity + 1)}>+</button></div>
                  <div><b>{money(i.subtotal)}</b></div>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ alignSelf: 'start' }}>
            <h3>Order total</h3><h2>{money(cart.totalAmount)}</h2>
            <Link className="btn btn-primary btn-block" to="/customer/checkout">Proceed to checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
}
