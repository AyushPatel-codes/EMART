import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { catalogApi } from '../api/services';
import { errMsg } from '../api/client';
import { useFetch } from '../hooks';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { Empty, ErrorBox, Loader } from '../components/Feedback';

/** Used for /products (filters in the query string) and /category/:name. */
export default function Products() {
  const [sp] = useSearchParams();
  const { name } = useParams();
  const nav = useNavigate();
  const params = {
    keyword: sp.get('keyword') || '', category: name || sp.get('category') || '', minPrice: sp.get('minPrice') || '',
    maxPrice: sp.get('maxPrice') || '', rating: sp.get('rating') || '', sort: sp.get('sort') || 'newest',
  };
  const page = Number(sp.get('page') || 0);
  const [price, setPrice] = useState({ min: params.minPrice, max: params.maxPrice });
  useEffect(() => setPrice({ min: params.minPrice, max: params.maxPrice }), [params.minPrice, params.maxPrice]);

  const go = (patch) => {
    const merged = { ...params, page: 0, ...patch };
    const qs = new URLSearchParams(Object.entries(merged).filter(([k, v]) => v !== '' && v != null && !(k === 'page' && v === 0) && !(k === 'sort' && v === 'newest')));
    nav(`/products?${qs}`);
  };

  const { data: cats } = useFetch(() => catalogApi.categories(), []);
  const [state, setState] = useState({ loading: true });
  const key = JSON.stringify([params, page]);
  useEffect(() => {
    let on = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    catalogApi.products({ ...params, page, size: 12 }).then((d) => on && setState({ data: d })).catch((e) => on && setState({ error: errMsg(e) }));
    return () => { on = false; };
  }, [key]); // eslint-disable-line

  return (
    <div className="container page layout-2">
      <aside>
        <div className="card">
          <h3>Filters</h3>
          <label className="field"><span>Category</span>
            <select value={params.category} onChange={(e) => go({ category: e.target.value })}>
              <option value="">All categories</option>
              {(cats || []).map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </label>
          <label className="field"><span>Min rating</span>
            <select value={params.rating} onChange={(e) => go({ rating: e.target.value })}>
              <option value="">Any</option><option value="4">4★ & up</option><option value="3">3★ & up</option><option value="2">2★ & up</option>
            </select>
          </label>
          <div className="field"><span>Price</span>
            <div className="row" style={{ flexWrap: 'nowrap' }}>
              <input type="number" min="0" placeholder="Min" value={price.min} onChange={(e) => setPrice({ ...price, min: e.target.value })} />
              <input type="number" min="0" placeholder="Max" value={price.max} onChange={(e) => setPrice({ ...price, max: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => go({ minPrice: price.min, maxPrice: price.max })}>Apply price</button>
          <button className="btn btn-outline btn-block" style={{ marginTop: 8 }} onClick={() => nav('/products')}>Clear all</button>
        </div>
      </aside>
      <section>
        <div className="row between" style={{ marginBottom: 12 }}>
          <h2>{params.keyword ? `Results for “${params.keyword}”` : params.category || 'All products'} {state.data && <small className="muted">({state.data.totalElements})</small>}</h2>
          <select style={{ width: 'auto' }} value={params.sort} onChange={(e) => go({ sort: e.target.value })}>
            <option value="newest">Newest</option><option value="priceAsc">Price: low to high</option>
            <option value="priceDesc">Price: high to low</option><option value="rating">Top rated</option>
          </select>
        </div>
        {state.loading && <Loader />}
        {state.error && <ErrorBox message={state.error} />}
        {state.data && (state.data.content.length
          ? <><div className="grid">{state.data.content.map((p) => <ProductCard key={p.id} product={p} />)}</div>
              <Pagination page={page} totalPages={state.data.totalPages} onChange={(p) => go({ page: p })} /></>
          : <Empty text="No products match your filters." />)}
      </section>
    </div>
  );
}
