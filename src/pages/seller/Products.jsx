import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sellerApi } from '../../api/services';
import { useAction, usePaged } from '../../hooks';
import PagedTable from '../../components/PagedTable';
import SearchInput from '../../components/SearchInput';
import ProductImage from '../../components/ProductImage';
import { StatusBadge } from '../../components/Badges';
import { money } from '../../utils/format';

export default function Products() {
  const [keyword, setKeyword] = useState('');
  const paged = usePaged((p) => sellerApi.products(p), { keyword }, 10);
  const act = useAction(paged.reload);
  return (
    <>
      <div className="row between"><h2>My products</h2><Link className="btn btn-primary" to="/seller/products/new">+ Add product</Link></div>
      <div style={{ margin: '10px 0' }}><SearchInput onChange={setKeyword} placeholder="Search my products…" /></div>
      <PagedTable paged={paged} empty="No products yet. Add your first one!" columns={[
        { header: '', render: (p) => <div style={{ width: 44 }}><ProductImage src={p.images?.[0]} name={p.name} /></div> },
        { header: 'Name', render: (p) => <Link to={`/products/${p.id}`}>{p.name}</Link> },
        { header: 'Category', render: (p) => p.category },
        { header: 'Price', render: (p) => <>{money(p.finalPrice)}{p.discount > 0 && <small className="muted"> (-{Math.round(p.discount)}%)</small>}</> },
        { header: 'Stock', render: (p) => p.stock },
        { header: 'Visible', render: (p) => <StatusBadge value={String(p.active)} /> },
        { header: 'Actions', render: (p) => (
          <div className="row">
            <Link className="btn btn-outline btn-sm" to={`/seller/products/${p.id}/edit`}>Edit</Link>
            <button className="btn btn-danger btn-sm" onClick={() => act(() => sellerApi.deleteProduct(p.id), { ok: 'Product deleted', confirm: `Delete “${p.name}”? This cannot be undone.` })}>Delete</button>
          </div>) },
      ]} />
    </>
  );
}
