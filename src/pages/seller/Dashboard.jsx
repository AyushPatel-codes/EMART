import { Link } from 'react-router-dom';
import { sellerApi } from '../../api/services';
import { useFetch } from '../../hooks';
import { ErrorBox, Loader } from '../../components/Feedback';
import { StatCard, StatusBadge } from '../../components/Badges';
import { dt, money } from '../../utils/format';

export default function Dashboard() {
  const { data: s, loading, error, reload } = useFetch(() => sellerApi.stats(), []);
  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <>
      <h2>Seller dashboard</h2>
      <div className="stats">
        <StatCard label="Products" value={s.totalProducts} /><StatCard label="Total stock" value={s.totalStock} />
        <StatCard label="Low stock (≤5)" value={s.lowStockProducts} /><StatCard label="Orders" value={s.totalOrders} />
        <StatCard label="Units sold" value={s.totalSales} /><StatCard label="Revenue" value={money(s.totalRevenue)} />
      </div>
      <div className="row between"><h3>Recent orders</h3><Link to="/seller/orders">All orders →</Link></div>
      <div className="table-wrap"><table>
        <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>My total</th><th>Status</th></tr></thead>
        <tbody>
          {s.recentOrders.map((o) => <tr key={o.id}><td><code>{o.id.slice(-8)}</code></td><td>{dt(o.createdAt)}</td><td>{o.customerName}</td><td>{money(o.totalAmount)}</td><td><StatusBadge value={o.orderStatus} /></td></tr>)}
          {!s.recentOrders.length && <tr><td colSpan="5" className="muted">No orders yet.</td></tr>}
        </tbody>
      </table></div>
    </>
  );
}
