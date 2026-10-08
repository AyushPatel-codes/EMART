import { Link, useParams } from 'react-router-dom';
import { customerApi } from '../../api/services';
import { useAction, useFetch } from '../../hooks';
import { ErrorBox, Loader } from '../../components/Feedback';
import OrderSummary from '../../components/OrderSummary';
import { ORDER_STEPS } from '../../utils/format';

export default function OrderDetails() {
  const { id } = useParams();
  const { data: o, loading, error, reload, setData } = useFetch(() => customerApi.order(id), [id]);
  const act = useAction();
  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const cancelled = o.orderStatus === 'CANCELLED';
  const idx = ORDER_STEPS.indexOf(o.orderStatus);
  const canCancel = !cancelled && o.items.every((i) => i.status === 'CANCELLED' || ORDER_STEPS.indexOf(i.status) <= 1);
  const cancel = () => act(async () => setData(await customerApi.cancelOrder(id)), { ok: 'Order cancelled', confirm: 'Cancel this order? Stock will be released.' });

  return (
    <>
      <div className="row between"><h2>Order details</h2><Link to="/customer/orders" className="btn btn-outline btn-sm">← All orders</Link></div>
      <div className="card">
        {!cancelled && <div className="timeline">{ORDER_STEPS.map((s, i) => <div key={s} className={`step ${i <= idx ? 'done' : ''}`}>{s.replace(/_/g, ' ')}</div>)}</div>}
        <OrderSummary order={o} linkProducts />
        <div className="row end" style={{ marginTop: 14 }}>
          {o.orderStatus === 'DELIVERED' && <span className="muted">Delivered — open a product above and write a review.</span>}
          {canCancel && <button className="btn btn-danger" onClick={cancel}>Cancel order</button>}
        </div>
      </div>
    </>
  );
}
