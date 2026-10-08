import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import ProductCard from '../../components/ProductCard';
import { Empty } from '../../components/Feedback';

export default function Wishlist() {
  const { wishlist } = useShop();
  return (
    <div className="container page">
      <h1>My wishlist</h1>
      {!wishlist.length ? <div className="card"><Empty text="Your wishlist is empty." /><div className="right"><Link className="btn btn-primary" to="/products">Find something you like</Link></div></div>
        : <div className="grid">{wishlist.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
    </div>
  );
}
