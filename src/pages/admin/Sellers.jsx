import { useState } from 'react';
import { adminApi } from '../../api/services';
import { useAction, useFetch, usePaged } from '../../hooks';
import PagedTable from '../../components/PagedTable';
import SearchInput from '../../components/SearchInput';
import Modal from '../../components/Modal';
import { StatusBadge } from '../../components/Badges';
import { Loader } from '../../components/Feedback';
import { day, money } from '../../utils/format';

function Details({ s, onClose }) {
  const products = useFetch(() => adminApi.sellerProducts(s.id, { size: 10 }), [s.id]);
  const orders = useFetch(() => adminApi.sellerOrders(s.id, { size: 10 }), [s.id]);
  return (
    <Modal title={s.storeName} onClose={onClose}>
      <p>{s.name} · {s.email} · {s.phone}<br />{s.businessAddress}<br />Joined {day(s.createdAt)} · <StatusBadge value={s.status} /></p>
      <h4>Products</h4>
      {products.loading ? <Loader /> : !products.data.content.length ? <p className="muted">No products.</p> : (
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Active</th></tr></thead>
          <tbody>{products.data.content.map((p) => <tr key={p.id}><td>{p.name}</td><td>{money(p.finalPrice)}</td><td>{p.stock}</td><td><StatusBadge value={String(p.active)} /></td></tr>)}</tbody></table></div>)}
      <h4>Orders</h4>
      {orders.loading ? <Loader /> : !orders.data.content.length ? <p className="muted">No orders.</p> : (
        <div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Seller total</th><th>Status</th></tr></thead>
          <tbody>{orders.data.content.map((o) => <tr key={o.id}><td><code>{o.id.slice(-8)}</code></td><td>{o.customerName}</td><td>{money(o.totalAmount)}</td><td><StatusBadge value={o.orderStatus} /></td></tr>)}</tbody></table></div>)}
    </Modal>
  );
}

export default function Sellers() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [view, setView] = useState(null);
  const paged = usePaged((p) => adminApi.sellers(p), { keyword, status }, 10);
  const act = useAction(paged.reload);
  return (
    <>
      <h2>Sellers</h2>
      <div className="row" style={{ margin: '10px 0' }}>
        <SearchInput onChange={setKeyword} placeholder="Search name, email or store…" />
        <select style={{ width: 'auto' }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>{['PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <PagedTable paged={paged} columns={[
        { header: 'Store', render: (s) => s.storeName }, { header: 'Owner', render: (s) => s.name }, { header: 'Email', render: (s) => s.email },
        { header: 'Status', render: (s) => <StatusBadge value={s.status} /> }, { header: 'Joined', render: (s) => day(s.createdAt) },
        { header: 'Actions', render: (s) => (
          <div className="row">
            <button className="btn btn-outline btn-sm" onClick={() => setView(s)}>View</button>
            {(s.status === 'PENDING' || s.status === 'REJECTED') && <button className="btn btn-ok btn-sm" onClick={() => act(() => adminApi.approveSeller(s.id), { ok: 'Seller approved' })}>Approve</button>}
            {s.status === 'PENDING' && <button className="btn btn-outline btn-sm" onClick={() => act(() => adminApi.rejectSeller(s.id), { ok: 'Seller rejected', confirm: `Reject ${s.storeName}?` })}>Reject</button>}
            {s.status === 'APPROVED' && <button className="btn btn-outline btn-sm" onClick={() => act(() => adminApi.suspendSeller(s.id), { ok: 'Seller suspended', confirm: `Suspend ${s.storeName}? Their products will be hidden.` })}>Suspend</button>}
            {s.status === 'SUSPENDED' && <button className="btn btn-ok btn-sm" onClick={() => act(() => adminApi.activateSeller(s.id), { ok: 'Seller activated' })}>Activate</button>}
            <button className="btn btn-danger btn-sm" onClick={() => act(() => adminApi.deleteSeller(s.id), { ok: 'Seller deleted', confirm: `Permanently delete ${s.storeName} and all of its products?` })}>Delete</button>
          </div>) },
      ]} />
      {view && <Details s={view} onClose={() => setView(null)} />}
    </>
  );
}
