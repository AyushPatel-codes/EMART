import { useState } from 'react';
import { sellerApi } from '../../api/services';
import { useAction, usePaged } from '../../hooks';
import PagedTable from '../../components/PagedTable';

function StockEditor({ p, onSaved }) {
  const [v, setV] = useState(p.stock);
  const act = useAction(onSaved);
  return (
    <div className="row" style={{ flexWrap: 'nowrap' }}>
      <input type="number" min="0" style={{ width: 90 }} value={v} onChange={(e) => setV(e.target.value)} />
      <button className="btn btn-primary btn-sm" disabled={Number(v) === p.stock || v === ''} onClick={() => act(() => sellerApi.updateStock(p.id, Number(v)), { ok: 'Stock updated' })}>Update</button>
    </div>
  );
}

export default function Inventory() {
  const [low, setLow] = useState(false);
  const paged = usePaged((p) => sellerApi.inventory(p), { maxStock: low ? 5 : '' }, 10);
  return (
    <>
      <div className="row between"><h2>Inventory</h2>
        <label className="row"><input type="checkbox" style={{ width: 'auto' }} checked={low} onChange={(e) => setLow(e.target.checked)} /> Low stock only (≤ 5)</label></div>
      <PagedTable paged={paged} empty="No products to show." columns={[
        { header: 'Product', render: (p) => p.name },
        { header: 'Category', render: (p) => p.category },
        { header: 'Status', render: (p) => p.stock === 0 ? <span className="badge b-CANCELLED">Out of stock</span> : p.stock <= 5 ? <span className="badge b-PENDING">Low</span> : <span className="badge b-ACTIVE">OK</span> },
        { header: 'Stock', render: (p) => <StockEditor key={`${p.id}-${p.stock}`} p={p} onSaved={paged.reload} /> },
      ]} />
    </>
  );
}
