import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { catalogApi, sellerApi } from '../../api/services';
import { errMsg, errFields } from '../../api/client';
import { useFetch } from '../../hooks';
import { useUi } from '../../context/UiContext';
import Field from '../../components/Field';
import { Loader } from '../../components/Feedback';
import { money } from '../../utils/format';

const empty = { name: '', description: '', price: '', discount: '0', category: '', brand: '', images: '', stock: '0' };

export default function ProductForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const ui = useUi();
  const [f, setF] = useState(empty);
  const [errs, setErrs] = useState({});
  const [msg, setMsg] = useState('');
  const { data: cats } = useFetch(() => catalogApi.categories(), []);
  const { data: existing, loading } = useFetch(() => (id ? sellerApi.product(id) : Promise.resolve(null)), [id]);

  useEffect(() => {
    if (existing) setF({ ...existing, price: existing.price, discount: existing.discount, brand: existing.brand || '', description: existing.description || '', images: (existing.images || []).join('\n'), stock: existing.stock });
  }, [existing]);
  if (id && loading) return <Loader />;

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const preview = f.price ? Number(f.price) * (1 - (Number(f.discount) || 0) / 100) : 0;

  const submit = async (e) => {
    e.preventDefault(); setErrs({}); setMsg('');
    const body = { name: f.name, description: f.description, price: Number(f.price), discount: Number(f.discount) || 0, category: f.category,
      brand: f.brand, stock: Number(f.stock), images: f.images.split('\n').map((s) => s.trim()).filter(Boolean) };
    try {
      id ? await sellerApi.updateProduct(id, body) : await sellerApi.createProduct(body);
      ui.success(id ? 'Product updated' : 'Product created'); nav('/seller/products');
    } catch (ex) { setErrs(errFields(ex)); setMsg(errMsg(ex)); }
  };

  return (
    <form className="card" onSubmit={submit} style={{ maxWidth: 760 }}>
      <h2>{id ? 'Edit product' : 'Add product'}</h2>
      {msg && <div className="alert error">{msg}</div>}
      <Field label="Name" value={f.name} onChange={set('name')} error={errs.name} required />
      <Field label="Description" as="textarea" value={f.description} onChange={set('description')} />
      <div className="form-grid">
        <Field label="Price" type="number" min="0.01" step="0.01" value={f.price} onChange={set('price')} error={errs.price} required />
        <Field label="Discount (%)" type="number" min="0" max="100" step="0.1" value={f.discount} onChange={set('discount')} error={errs.discount} />
        <Field label="Category" as="select" value={f.category} onChange={set('category')} error={errs.category} required>
          <option value="">Select…</option>{(cats || []).map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </Field>
        <Field label="Brand" value={f.brand} onChange={set('brand')} />
        <Field label="Stock" type="number" min="0" step="1" value={f.stock} onChange={set('stock')} error={errs.stock} required />
        <div className="field"><span>Final price</span><b style={{ fontSize: 22 }}>{money(preview)}</b></div>
      </div>
      <Field label="Image URLs (one per line)" as="textarea" value={f.images} onChange={set('images')} placeholder="https://…" />
      <div className="row end"><button type="button" className="btn btn-outline" onClick={() => nav('/seller/products')}>Cancel</button><button className="btn btn-primary">{id ? 'Save changes' : 'Create product'}</button></div>
    </form>
  );
}
