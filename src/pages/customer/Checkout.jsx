import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { customerApi } from '../../api/services';
import { errMsg, errFields } from '../../api/client';
import { useShop } from '../../context/ShopContext';
import { useUi } from '../../context/UiContext';
import { Loader } from '../../components/Feedback';
import AddressForm, { emptyAddress } from './AddressForm';
import { money } from '../../utils/format';

export default function Checkout() {
  const { cart, reloadCart } = useShop();
  const ui = useUi();
  const nav = useNavigate();
  const [addrs, setAddrs] = useState(null);
  const [sel, setSel] = useState('');
  const [form, setForm] = useState({ ...emptyAddress });
  const [save, setSave] = useState(false);
  const [pay, setPay] = useState('COD');
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    customerApi.addresses().then((a) => { setAddrs(a); setSel(a.find((x) => x.defaultAddress)?.id || a[0]?.id || 'new'); }).catch((e) => ui.error(errMsg(e)));
  }, []); // eslint-disable-line

  if (!cart || !addrs) return <Loader />;
  if (!cart.items.length) return <div className="container page card"><p>Your cart is empty.</p><Link className="btn btn-primary" to="/products">Browse products</Link></div>;

  const place = async () => {
    setErrs({}); setBusy(true);
    try {
      if (sel === 'new' && save) await customerApi.addAddress({ ...form, defaultAddress: !addrs.length });
      const order = await customerApi.placeOrder({ paymentMethod: pay, ...(sel === 'new' ? { shippingAddress: form } : { addressId: sel }) });
      await reloadCart();
      ui.success('Order placed successfully!');
      nav(`/customer/orders/${order.id}`, { replace: true });
    } catch (ex) { setErrs(errFields(ex)); ui.error(errMsg(ex)); reloadCart(); setBusy(false); }
  };

  return (
    <div className="container page">
      <h1>Checkout</h1>
      <div className="layout-2" style={{ gridTemplateColumns: '1fr 320px' }}>
        <div>
          <div className="card">
            <h3>1. Shipping address</h3>
            {addrs.map((a) => (
              <label key={a.id} className="row" style={{ alignItems: 'flex-start', margin: '8px 0' }}>
                <input type="radio" style={{ width: 'auto' }} checked={sel === a.id} onChange={() => setSel(a.id)} />
                <span><b>{a.fullName}</b>, {a.line1}, {a.city} {a.postalCode}, {a.country} · {a.phone}</span>
              </label>
            ))}
            <label className="row"><input type="radio" style={{ width: 'auto' }} checked={sel === 'new'} onChange={() => setSel('new')} /> <b>Use a new address</b></label>
            {sel === 'new' && (
              <div style={{ marginTop: 12 }}>
                <AddressForm value={form} onChange={setForm} errors={Object.fromEntries(Object.entries(errs).map(([k, v]) => [k.replace('shippingAddress.', ''), v]))} />
                <label className="row"><input type="checkbox" style={{ width: 'auto' }} checked={save} onChange={(e) => setSave(e.target.checked)} /> Save this address for next time</label>
              </div>
            )}
          </div>
          <div className="card">
            <h3>2. Payment method</h3>
            <label className="row"><input type="radio" style={{ width: 'auto' }} checked={pay === 'COD'} onChange={() => setPay('COD')} /> Cash on delivery</label>
            <label className="row"><input type="radio" style={{ width: 'auto' }} checked={pay === 'MOCK_ONLINE'} onChange={() => setPay('MOCK_ONLINE')} /> Online payment (mock — no real charge)</label>
          </div>
        </div>
        <div className="card" style={{ alignSelf: 'start' }}>
          <h3>Order summary</h3>
          {cart.items.map((i) => <div key={i.productId} className="row between"><span>{i.productName} × {i.quantity}</span><span>{money(i.subtotal)}</span></div>)}
          <hr /><div className="row between"><b>Total</b><b>{money(cart.totalAmount)}</b></div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 12 }} disabled={busy} onClick={place}>{busy ? 'Placing order…' : 'Place order'}</button>
        </div>
      </div>
    </div>
  );
}
