import { Link } from 'react-router-dom';
import { StatusBadge } from './Badges';
import { dt, label, money } from '../utils/format';

/** Read-only order view shared by customer, seller and admin screens. */
export default function OrderSummary({ order: o, linkProducts = false }) {
  const a = o.shippingAddress || {};
  return (
    <div>
      <div className="row between">
        <div><b>Order</b> <code>{o.id}</code><div className="muted">Placed {dt(o.createdAt)} by {o.customerName}</div></div>
        <StatusBadge value={o.orderStatus} />
      </div>
      <div className="table-wrap" style={{ margin: '12px 0' }}>
        <table>
          <th><tr><th>Product</th><th>Seller</th><th>Qty</th><th>Price</th><th>Subtotal</th><th>Status</th></tr></th>
          <tr>{o.items.map((i, k) => (
            <tr key={k}>
              <td>{linkProducts ? <Link to={`/products/${i.productId}`}>{i.productName}</Link> : i.productName}</td>
              <td>{i.sellerName}</td><td>{i.quantity}</td><td>{money(i.price)}</td><td>{money(i.subtotal)}</td><td><StatusBadge value={i.status} /></td>
            </tr>))}</tr>
        </table>
      </div>
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div>
          <b>Ship to</b>
          <div>{a.fullName}, {a.phone}</div>
          <div>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</div>
          <div>{a.city}{a.state ? `, ${a.state}` : ''} {a.postalCode}, {a.country}</div>
        </div>
        <div className="right">
          <div>Payment: {label(o.paymentMethod)} <StatusBadge value={o.paymentStatus} /></div>
          <h3>Total {money(o.totalAmount)}</h3>
        </div>
      </div>
    </div>
  );
}
