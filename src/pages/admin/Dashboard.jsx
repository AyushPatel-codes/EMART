import { Link } from 'react-router-dom';
import { adminApi } from '../../api/services';
import { useFetch } from '../../hooks';
import { ErrorBox, Loader } from '../../components/Feedback';
import { StatCard, StatusBadge } from '../../components/Badges';
import { dt, money } from '../../utils/format';

export default function Dashboard() {
  const { data: d, loading, error, reload } = useFetch(() => adminApi.dashboard(), []);
  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <>
      <h2>Admin dashboard</h2>
      {d.pendingSellers > 0 && <div className="alert warn">{d.pendingSellers} seller application(s) waiting for review. <Link to="/admin/sellers">Review now</Link></div>}
      <div className="stats">
        <StatCard label="Total users" value={d.totalUsers} /><StatCard label="Customers" value={d.totalCustomers} />
        <StatCard label="Sellers" value={d.totalSellers} /><StatCard label="Pending sellers" value={d.pendingSellers} />
        <StatCard label="Products" value={d.totalProducts} /><StatCard label="Orders" value={d.totalOrders} />
        <StatCard label="Revenue" value={money(d.totalRevenue)} />
      </div>
      <div className="layout-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div><h3>Recent orders</h3><div className="table-wrap"><table>
          <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>{d.recentOrders.map((o) => <tr key={o.id}><td><code>{o.id.slice(-8)}</code></td><td>{o.customerName}</td><td>{money(o.totalAmount)}</td><td><StatusBadge value={o.orderStatus} /></td></tr>)}
            {!d.recentOrders.length && <tr><td colSpan="4" className="muted">No orders yet</td></tr>}</tbody></table></div></div>
        <div><h3>Recent registrations</h3><div className="table-wrap"><table>
          <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead>
          <tbody>{d.recentRegistrations.map((u) => <tr key={u.id}><td>{u.name}</td><td>{u.role.replace('ROLE_', '')}</td><td><StatusBadge value={u.status} /></td><td>{dt(u.createdAt)}</td></tr>)}</tbody></table></div></div>
      </div>
    </>
  );
}
