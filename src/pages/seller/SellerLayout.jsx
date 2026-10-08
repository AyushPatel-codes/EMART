import { useFetch } from '../../hooks';
import { sellerApi } from '../../api/services';
import PortalLayout from '../../components/PortalLayout';

const links = [
  { to: '/seller/dashboard', label: 'Dashboard' }, { to: '/seller/products', label: 'My products' },
  { to: '/seller/products/new', label: 'Add product' }, { to: '/seller/inventory', label: 'Inventory' },
  { to: '/seller/orders', label: 'Orders' }, { to: '/seller/stats', label: 'Sales statistics' },
  { to: '/seller/reviews', label: 'Reviews' }, { to: '/seller/profile', label: 'Store profile' },
];

export default function SellerLayout() {
  const { data } = useFetch(() => sellerApi.profile(), []);
  const s = data?.status;
  const banner = s && s !== 'APPROVED' && (
    <div className={`alert ${s === 'PENDING' ? 'warn' : 'error'}`}>
      {s === 'PENDING' ? 'Your seller account is awaiting admin approval. You can edit your store profile, but cannot manage products yet.' : `Your seller account is ${s}. Product management is disabled.`}
    </div>
  );
  return <PortalLayout title="Seller" links={links} banner={banner} />;
}
