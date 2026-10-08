import { Link } from 'react-router-dom';
import { adminApi } from '../../api/services';
import { useAction, usePaged } from '../../hooks';
import PagedTable from '../../components/PagedTable';
import { Stars } from '../../components/Badges';
import { day } from '../../utils/format';

export default function Reviews() {
  const paged = usePaged((p) => adminApi.reviews(p), {}, 10);
  const act = useAction(paged.reload);
  return (
    <>
      <h2>Reviews</h2>
      <PagedTable paged={paged} empty="No reviews yet." columns={[
        { header: 'Product', render: (r) => <Link to={`/products/${r.productId}`}>{r.productName}</Link> },
        { header: 'Customer', render: (r) => r.customerName }, { header: 'Rating', render: (r) => <Stars rating={r.rating} /> },
        { header: 'Comment', render: (r) => r.comment }, { header: 'Date', render: (r) => day(r.createdAt) },
        { header: '', render: (r) => <button className="btn btn-danger btn-sm" onClick={() => act(() => adminApi.deleteReview(r.id), { ok: 'Review removed', confirm: 'Remove this review? The product rating will be recalculated.' })}>Remove</button> },
      ]} />
    </>
  );
}
