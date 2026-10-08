import { useState } from 'react';
import { adminApi } from '../../api/services';
import { usePaged } from '../../hooks';
import PagedTable from '../../components/PagedTable';
import SearchInput from '../../components/SearchInput';
import Modal from '../../components/Modal';
import OrderSummary from '../../components/OrderSummary';
import { StatusBadge } from '../../components/Badges';
import { dt, label, money, ORDER_STATUSES } from '../../utils/format';

export default function Orders() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [view, setView] = useState(null);
  const paged = usePaged((p) => adminApi.orders(p), { keyword, status }, 10);
  return (
    <>
      <h2>Orders</h2>
      <div className="row" style={{ margin: '10px 0' }}>
        <SearchInput onChange={setKeyword} placeholder="Customer name or order id…" />
        <select style={{ width: 'auto' }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>{ORDER_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
        </select>
      </div>
      <PagedTable paged={paged} columns={[
        { header: 'Order', render: (o) => <button className="btn btn-outline btn-sm" onClick={() => setView(o)}>{o.id.slice(-8)}</button> },
        { header: 'Date', render: (o) => dt(o.createdAt) }, { header: 'Customer', render: (o) => o.customerName },
        { header: 'Items', render: (o) => o.items.length }, { header: 'Total', render: (o) => money(o.totalAmount) },
        { header: 'Payment', render: (o) => <StatusBadge value={o.paymentStatus} /> }, { header: 'Status', render: (o) => <StatusBadge value={o.orderStatus} /> },
      ]} />
      {view && <Modal title="Order details" onClose={() => setView(null)}><OrderSummary order={view} /></Modal>}
    </>
  );
}