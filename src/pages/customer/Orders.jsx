import { Link } from 'react-router-dom';
import { customerApi } from '../../api/services';
import { usePaged } from '../../hooks';
import PagedTable from '../../components/PagedTable';
import { StatusBadge } from '../../components/Badges';
import { dt, label, money } from '../../utils/format';

export default function Orders() {
  const paged = usePaged((p) => customerApi.orders(p), {}, 10);
  return (
    <>
      <h2>My orders</h2>
      <PagedTable paged={paged} empty="You haven't placed any orders yet." columns={[
        { header: 'Order', render: (o) => <Link to={`/customer/orders/${o.id}`}><code>{o.id.slice(-8)}</code></Link> },
        { header: 'Date', render: (o) => dt(o.createdAt) },
        { header: 'Items', render: (o) => o.items.map((i) => `${i.productName} ×${i.quantity}`).join(', ') },
        { header: 'Total', render: (o) => money(o.totalAmount) },
        { header: 'Payment', render: (o) => <>{label(o.paymentMethod)} <StatusBadge value={o.paymentStatus} /></> },
        { header: 'Status', render: (o) => <StatusBadge value={o.orderStatus} /> },
      ]} />
    </>
  );
}
