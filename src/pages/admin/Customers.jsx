import { useState } from 'react';
import { adminApi } from '../../api/services';
import { useAction, useFetch, usePaged } from '../../hooks';
import PagedTable from '../../components/PagedTable';
import SearchInput from '../../components/SearchInput';
import Modal from '../../components/Modal';
import { StatusBadge } from '../../components/Badges';
import { Loader } from '../../components/Feedback';
import { day, money } from '../../utils/format';

function Details({ c, onClose }) {
  const { data, loading } = useFetch(() => adminApi.customerOrders(c.id, { size: 10 }), [c.id]);
  return (
    <Modal title={c.name} onClose={onClose}>
      <p>{c.email} · {c.phone}<br />{c.address}<br />Joined {day(c.createdAt)} · <StatusBadge value={c.status} /></p>
      <h4>Orders</h4>
      {loading ? <Loader /> : !data.content.length ? <p className="muted">No orders.</p> : (
        <div className="table-wrap"><table><thead><tr><th>Order</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>{data.content.map((o) => <tr key={o.id}><td><code>{o.id.slice(-8)}</code></td><td>{day(o.createdAt)}</td><td>{money(o.totalAmount)}</td><td><StatusBadge value={o.orderStatus} /></td></tr>)}</tbody></table></div>
      )}
    </Modal>
  );
}

export default function Customers() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [view, setView] = useState(null);
  const paged = usePaged((p) => adminApi.customers(p), { keyword, status }, 10);
  const act = useAction(paged.reload);
  return (
    <>
      <h2>Customers</h2>
      <div className="row" style={{ margin: '10px 0' }}>
        <SearchInput onChange={setKeyword} placeholder="Search name or email…" />
        <select style={{ width: 'auto' }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option><option value="ACTIVE">Active</option><option value="SUSPENDED">Suspended</option>
        </select>
      </div>
      <PagedTable paged={paged} columns={[
        { header: 'Name', render: (c) => c.name }, { header: 'Email', render: (c) => c.email }, { header: 'Phone', render: (c) => c.phone },
        { header: 'Status', render: (c) => <StatusBadge value={c.status} /> }, { header: 'Joined', render: (c) => day(c.createdAt) },
        { header: 'Actions', render: (c) => (
          <div className="row">
            <button className="btn btn-outline btn-sm" onClick={() => setView(c)}>View</button>
            {c.status === 'SUSPENDED'
              ? <button className="btn btn-ok btn-sm" onClick={() => act(() => adminApi.activateCustomer(c.id), { ok: 'Customer activated' })}>Activate</button>
              : <button className="btn btn-outline btn-sm" onClick={() => act(() => adminApi.suspendCustomer(c.id), { ok: 'Customer suspended', confirm: `Suspend ${c.name}? They will be signed out immediately.` })}>Suspend</button>}
            <button className="btn btn-danger btn-sm" onClick={() => act(() => adminApi.deleteCustomer(c.id), { ok: 'Customer deleted', confirm: `Permanently delete ${c.name}?` })}>Delete</button>
          </div>) },
      ]} />
      {view && <Details c={view} onClose={() => setView(null)} />}
    </>
  );
}
