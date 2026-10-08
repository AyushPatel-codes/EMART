import { sellerApi } from '../../api/services';
import { useFetch } from '../../hooks';
import { ErrorBox, Loader } from '../../components/Feedback';
import { StatCard } from '../../components/Badges';
import { money } from '../../utils/format';

export default function Stats() {
  const { data: s, loading, error, reload } = useFetch(() => sellerApi.stats(), []);
  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  const recent = [...s.recentOrders].reverse();
  const max = Math.max(1, ...recent.map((o) => o.totalAmount));
  return (
    <>
      <h2>Sales statistics</h2>
      <div className="stats">
        <StatCard label="Total revenue" value={money(s.totalRevenue)} /><StatCard label="Units sold" value={s.totalSales} />
        <StatCard label="Orders" value={s.totalOrders} />
        <StatCard label="Avg. order value" value={money(s.totalOrders ? s.totalRevenue / s.totalOrders : 0)} />
        <StatCard label="Products" value={s.totalProducts} /><StatCard label="Low-stock products" value={s.lowStockProducts} />
      </div>
      <div className="card">
        <h3>Revenue from your last {recent.length || 0} orders</h3>
        {!recent.length ? <p className="muted">No sales yet.</p> : (
          <div className="bars">{recent.map((o) => <div key={o.id} style={{ height: `${(o.totalAmount / max) * 100}%` }} title={o.id}><span>{money(o.totalAmount)}</span></div>)}</div>
        )}
        <small className="muted">Cancelled orders are excluded from revenue totals.</small>
      </div>
    </>
  );
}
