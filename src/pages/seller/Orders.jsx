import { useState } from 'react';
import { sellerApi } from '../../api/services';
import { useAction, usePaged } from '../../hooks';
import PagedTable from '../../components/PagedTable';
import Modal from '../../components/Modal';
import OrderSummary from '../../components/OrderSummary';
import { StatusBadge } from '../../components/Badges';
import { dt, label, money, ORDER_STATUSES, ORDER_STEPS } from '../../utils/format';

const active = (o) => o.items.filter((i) => i.status !== 'CANCELLED');
const mineStatus = (o) => (active(o).length ? ORDER_STEPS[Math.min(...active(o).map((i) => ORDER_STEPS.indexOf(i.status)))] : 'CANCELLED');
/** Statuses strictly ahead of every active item (backend only allows moving forward). */
const nextSteps = (o) => (!active(o).length ? [] : ORDER_STEPS.slice(Math.max(Math.max(...active(o).map((i) => ORDER_STEPS.indexOf(i.status))) + 1, 1)));

function StatusUpdater({ order, onDone }) {
  const opts = nextSteps(order);
  const [v, setV] = useState('');
  const act = useAction(onDone);
  if (!opts.length) return <span className="muted">—</span>;
  return (
    <div className="row" style={{ flexWrap: 'nowrap' }}>
      <select style={{ width: 160 }} value={v} onChange={(e) => setV(e.target.value)}>
        <option value="">Move to…</option>{opts.map((s) => <option key={s} value={s}>{label(s)}</option>)}
      </select>
      <button className="btn btn-primary btn-sm" disabled={!v} onClick={() => act(() => sellerApi.updateOrderStatus(order.id, v), { ok: `Marked ${label(v)}`, confirm: `Mark your items as ${label(v)}?`, danger: false })}>Update</button>
    </div>
  );
}

export default function Orders() {
  const [status, setStatus] = useState('');
  const [view, setView] = useState(null);
  const paged = usePaged((p) => sellerApi.orders(p), { status }, 10);
  return (
    <>
      <div className="row between"><h2>Orders with my products</h2>
        <select style={{ width: 'auto' }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>{ORDER_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
        </select></div>
      <PagedTable paged={paged} empty="No orders yet." columns={[
        { header: 'Order', render: (o) => <button className="btn btn-outline btn-sm" onClick={() => setView(o)}>{o.id.slice(-8)}</button> },
        { header: 'Date', render: (o) => dt(o.createdAt) },
        { header: 'Customer', render: (o) => o.customerName },
        { header: 'Items', render: (o) => o.items.map((i) => `${i.productName} ×${i.quantity}`).join(', ') },
        { header: 'My total', render: (o) => money(o.totalAmount) },
        { header: 'My status', render: (o) => <StatusBadge value={mineStatus(o)} /> },
        { header: 'Update', render: (o) => <StatusUpdater order={o} onDone={paged.reload} /> },
      ]} />
      {view && <Modal title="Order details (your items)" onClose={() => setView(null)}><OrderSummary order={view} /></Modal>}
    </>
  );
}
