import { Link } from 'react-router-dom';
import { catalogApi } from '../api/services';
import { useFetch } from '../hooks';
import ProductCard from '../components/ProductCard';
import { ErrorBox, Loader } from '../components/Feedback';

const Section = ({ title, products, link }) => !products?.length ? null : (
  <section className="container section">
    <div className="section-head"><h2>{title}</h2>{link && <Link to={link}>See all →</Link>}</div>
    <div className="grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
  </section>
);

export default function Home() {
  const { data, loading, error, reload } = useFetch(async () => {
    const [cats, newest, trending, best] = await Promise.all([
      catalogApi.categories(),
      catalogApi.products({ sort: 'newest', size: 24 }),
      catalogApi.products({ sort: 'rating', size: 8 }),
      catalogApi.products({ sort: 'rating', rating: 4, size: 8 }),
    ]);
    return { cats, newest: newest.content, trending: trending.content, best: best.content };
  }, []);

  return (
    <>
      <div className="hero">
        <h1>Everything you need, delivered.</h1>
        <p>Shop thousands of products from trusted sellers. Great prices, fast delivery.</p>
        <Link className="btn btn-primary" to="/products">Start shopping</Link>
      </div>
      {loading && <Loader />}
      {error && <div className="container section"><ErrorBox message={error} onRetry={reload} /></div>}
      {data && (
        <>
          <section className="container section">
            <div className="section-head"><h2>Shop by category</h2></div>
            <div className="cat-grid">{data.cats.map((c) => <Link key={c.id} className="cat-tile" to={`/category/${encodeURIComponent(c.name)}`}>{c.name}</Link>)}</div>
          </section>
          <Section title="Featured products" products={data.newest.slice(0, 8)} link="/products" />
          <Section title="Trending now" products={data.trending} link="/products?sort=rating" />
          <Section title="Best sellers (4★ & up)" products={data.best} link="/products?sort=rating&rating=4" />
          <Section title="Deals of the day" products={data.newest.filter((p) => p.discount >= 10).slice(0, 8)} />
          {!data.newest.length && <div className="container empty">No products yet. Approved sellers can list products from the Seller portal.</div>}
        </>
      )}
    </>
  );
}
