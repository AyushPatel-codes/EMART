import { useEffect, useState } from 'react';
import { sellerApi } from '../../api/services';
import { errMsg, errFields } from '../../api/client';
import { useFetch } from '../../hooks';
import { useAuth } from '../../context/AuthContext';
import { useUi } from '../../context/UiContext';
import Field from '../../components/Field';
import { StatusBadge } from '../../components/Badges';
import { ErrorBox, Loader } from '../../components/Feedback';

export default function Profile() {
  const { patchUser } = useAuth();
  const ui = useUi();
  const { data, loading, error, reload } = useFetch(() => sellerApi.profile(), []);
  const [f, setF] = useState(null);
  const [errs, setErrs] = useState({});
  useEffect(() => { if (data) setF({ name: data.name, phone: data.phone || '', storeName: data.storeName || '', businessAddress: data.businessAddress || '' }); }, [data]);
  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!f) return null;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault(); setErrs({});
    try { const u = await sellerApi.updateProfile(f); patchUser({ name: u.name }); ui.success('Store profile updated'); }
    catch (ex) { setErrs(errFields(ex)); ui.error(errMsg(ex)); }
  };
  return (
    <form className="card" onSubmit={save} style={{ maxWidth: 600 }}>
      <h2>Store profile</h2>
      <p>Account status: <StatusBadge value={data.status} /></p>
      <Field label="Email" value={data.email} disabled />
      <Field label="Your name" value={f.name} onChange={set('name')} error={errs.name} required />
      <Field label="Phone" value={f.phone} onChange={set('phone')} error={errs.phone} />
      <Field label="Store name" value={f.storeName} onChange={set('storeName')} required />
      <Field label="Business address" as="textarea" value={f.businessAddress} onChange={set('businessAddress')} />
      <button className="btn btn-primary">Save changes</button>
    </form>
  );
}
