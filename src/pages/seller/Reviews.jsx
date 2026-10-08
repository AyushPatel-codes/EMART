import { Link } from 'react-router-dom';
import { sellerApi } from '../../api/services';
import { usePaged } from '../../hooks';
import PagedTable from '../../components/PagedTable';
import { Stars } from '../../components/Badges';
import { day } from '../../utils/format';

export default function Reviews() {
  const paged = usePaged((p) => sellerApi.reviews(p), {}, 10);
  return (
    <>
      <h2>Reviews on my products</h2>
      <PagedTable paged={paged} empty="No reviews yet." columns={[
        { header: 'Product', render: (r) => <Link to={`/products/${r.productId}`}>{r.productName}</Link> },
        { header: 'Customer', render: (r) => r.customerName },
        { header: 'Rating', render: (r) => <Stars rating={r.rating} /> },
        { header: 'Comment', render: (r) => r.comment },
        { header: 'Date', render: (r) => day(r.createdAt) },
      ]} />
    </>
  );
}
