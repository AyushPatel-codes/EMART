import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/services';
import { useAction, useFetch, usePaged } from '../../hooks';
import PagedTable from '../../components/PagedTable';
import SearchInput from '../../components/SearchInput';
import Modal from '../../components/Modal';
import { Stars, StatusBadge } from '../../components/Badges';
import { dt, money } from '../../utils/format';

export default function Products() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [view, setView] = useState(null);
  const { data: cats } = useFetch(() => adminApi.categories(), []);
  const paged = usePaged((p) => adminApi.products(p), { keyword, category }, 10);
  const act = useAction(paged.reload);
  return (
    <>
      <h2>Products</h2>
      <div className="row" style={{ margin: '10px 0' }}>
        <SearchInput onChange={setKeyword} placeholder="Search products…" />
        <select style={{ width: 'auto' }} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>{(cats || []).map((c) => <option key={c.id}>{c.name}</option>)}
        </select>
      </div>
      <PagedTable paged={paged} columns={[
        { header: 'Name', render: (p) => <Link to={`/products/${p.id}`}>{p.name}</Link> }, { header: 'Seller', render: (p) => p.sellerName },
        { header: 'Category', render: (p) => p.category }, { header: 'Price', render: (p) => money(p.finalPrice) }, { header: 'Stock', render: (p) => p.stock },
        { header: 'Active', render: (p) => <StatusBadge value={String(p.active)} /> },
        { header: 'Actions', render: (p) => (
          <div className="row">
            <button className="btn btn-outline btn-sm" onClick={() => setView(p)}>View</button>
            {p.active
              ? <button className="btn btn-outline btn-sm" onClick={() => act(() => adminApi.deactivateProduct(p.id), { ok: 'Product deactivated', confirm: 'Hide this product from customers?' })}>Deactivate</button>
              : <button className="btn btn-ok btn-sm" onClick={() => act(() => adminApi.activateProduct(p.id), { ok: 'Product activated' })}>Activate</button>}
            <button className="btn btn-danger btn-sm" onClick={() => act(() => adminApi.deleteProduct(p.id), { ok: 'Product deleted', confirm: `Delete “${p.name}” permanently?` })}>Delete</button>
          </div>) },
      ]} />
      {view && (
        <Modal title={view.name} onClose={() => setView(null)}>
          <p>{view.description}</p>
          <p>Brand: {view.brand || '–'} · Category: {view.category} · Seller: {view.sellerName}</p>
          <p>Price {money(view.price)} → <b>{money(view.finalPrice)}</b> ({view.discount}% off) · Stock {view.stock}</p>
          <Stars rating={view.rating} count={view.reviewCount} /><p className="muted">Created {dt(view.createdAt)}</p>
        </Modal>
      )}
    </>
  );
}
