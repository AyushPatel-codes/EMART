import { Link } from 'react-router-dom';
import { customerApi } from '../../api/services';
import { useAction, usePaged } from '../../hooks';
import PagedTable from '../../components/PagedTable';
import { Stars } from '../../components/Badges';
import { day } from '../../utils/format';

export default function Reviews() {
  const paged = usePaged((p) => customerApi.myReviews(p), {}, 10);
  const act = useAction(paged.reload);
  return (
    <>
      <h2>My reviews</h2>
      <PagedTable paged={paged} empty="You haven't reviewed anything yet." columns={[
        { header: 'Product', render: (r) => <Link to={`/products/${r.productId}`}>{r.productName}</Link> },
        { header: 'Rating', render: (r) => <Stars rating={r.rating} /> },
        { header: 'Comment', render: (r) => r.comment },
        { header: 'Date', render: (r) => day(r.createdAt) },
        { header: '', render: (r) => <button className="btn btn-danger btn-sm" onClick={() => act(() => customerApi.deleteReview(r.id), { ok: 'Review deleted', confirm: 'Delete your review?' })}>Delete</button> },
      ]} />
    </>
  );
}
