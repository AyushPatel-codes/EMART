import { useEffect, useState } from 'react';
import { customerApi } from '../../api/services';
import { errMsg, errFields } from '../../api/client';
import { useFetch } from '../../hooks';
import { useAuth } from '../../context/AuthContext';
import { useUi } from '../../context/UiContext';
import Field from '../../components/Field';
import { ErrorBox, Loader } from '../../components/Feedback';

export default function Profile() {
  const { patchUser } = useAuth();
  const ui = useUi();
  const { data, loading, error, reload } = useFetch(() => customerApi.profile(), []);
  const [f, setF] = useState(null);
  const [errs, setErrs] = useState({});
  useEffect(() => { if (data) setF({ name: data.name, phone: data.phone || '', address: data.address || '' }); }, [data]);
  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!f) return null;

  const save = async (e) => {
    e.preventDefault(); setErrs({});
    try { const u = await customerApi.updateProfile(f); patchUser({ name: u.name }); ui.success('Profile updated'); }
    catch (ex) { setErrs(errFields(ex)); ui.error(errMsg(ex)); }
  };
  return (
    <form className="card" onSubmit={save} style={{ maxWidth: 560 }}>
      <h2>My profile</h2>
      <Field label="Email" value={data.email} disabled />
      <Field label="Name" value={f.name} error={errs.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
      <Field label="Phone" value={f.phone} error={errs.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
      <Field label="Address" as="textarea" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />
      <button className="btn btn-primary">Save changes</button>
    </form>
  );
}
