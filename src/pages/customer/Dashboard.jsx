import { Link } from 'react-router-dom';
import { customerApi } from '../../api/services';
import { useFetch } from '../../hooks';
import { useAuth } from '../../context/AuthContext';
import { ErrorBox, Loader } from '../../components/Feedback';
import { StatCard } from '../../components/Badges';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(() => customerApi.dashboard(), []);
  return (
    <>
      <h2>Welcome back, {user.name}</h2>
      {loading && <Loader />}{error && <ErrorBox message={error} onRetry={reload} />}
      {data && (
        <div className="stats">
          <StatCard label="Total orders" value={data.totalOrders} />
          <StatCard label="Pending orders" value={data.pendingOrders} />
          <StatCard label="Delivered" value={data.deliveredOrders} />
          <StatCard label="Wishlist" value={data.wishlistCount} />
          <StatCard label="Cart items" value={data.cartCount} />
        </div>
      )}
      <div className="row">
        <Link className="btn btn-primary" to="/products">Continue shopping</Link>
        <Link className="btn btn-outline" to="/customer/cart">View cart</Link>
        <Link className="btn btn-outline" to="/customer/wishlist">View wishlist</Link>
      </div>
    </>
  );
}
