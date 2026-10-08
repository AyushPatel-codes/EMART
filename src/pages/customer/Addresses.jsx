import { useState } from 'react';
import { customerApi } from '../../api/services';
import { errMsg, errFields } from '../../api/client';
import { useAction, useFetch } from '../../hooks';
import { useUi } from '../../context/UiContext';
import { Empty, ErrorBox, Loader } from '../../components/Feedback';
import Modal from '../../components/Modal';
import AddressForm, { emptyAddress } from './AddressForm';

export default function Addresses() {
  const ui = useUi();
  const { data, loading, error, reload } = useFetch(() => customerApi.addresses(), []);
  const act = useAction(reload);
  const [edit, setEdit] = useState(null);
  const [errs, setErrs] = useState({});

  const save = async (e) => {
    e.preventDefault(); setErrs({});
    try {
      edit.id ? await customerApi.updateAddress(edit.id, edit) : await customerApi.addAddress(edit);
      ui.success('Address saved'); setEdit(null); reload();
    } catch (ex) { setErrs(errFields(ex)); ui.error(errMsg(ex)); }
  };

  return (
    <>
      <div className="row between"><h2>Shipping addresses</h2><button className="btn btn-primary" onClick={() => { setErrs({}); setEdit({ ...emptyAddress }); }}>+ Add address</button></div>
      {loading && <Loader />}{error && <ErrorBox message={error} onRetry={reload} />}
      {data && !data.length && <Empty text="No saved addresses yet." />}
      <div className="grid">
        {data?.map((a) => (
          <div className="card" key={a.id}>
            {a.defaultAddress && <span className="badge b-ACTIVE">Default</span>}
            <p><b>{a.fullName}</b><br />{a.line1}{a.line2 && `, ${a.line2}`}<br />{a.city}{a.state && `, ${a.state}`} {a.postalCode}<br />{a.country}<br />{a.phone}</p>
            <div className="row">
              <button className="btn btn-outline btn-sm" onClick={() => { setErrs({}); setEdit(a); }}>Edit</button>
              {!a.defaultAddress && <button className="btn btn-outline btn-sm" onClick={() => act(() => customerApi.updateAddress(a.id, { ...a, defaultAddress: true }), { ok: 'Default address updated' })}>Make default</button>}
              <button className="btn btn-danger btn-sm" onClick={() => act(() => customerApi.deleteAddress(a.id), { ok: 'Address deleted', confirm: 'Delete this address?' })}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {edit && (
        <Modal title={edit.id ? 'Edit address' : 'New address'} onClose={() => setEdit(null)}>
          <form onSubmit={save}>
            <AddressForm value={edit} onChange={setEdit} errors={errs} />
            <label className="row"><input type="checkbox" style={{ width: 'auto' }} checked={!!edit.defaultAddress} onChange={(e) => setEdit({ ...edit, defaultAddress: e.target.checked })} /> Set as default</label>
            <div className="row end"><button type="button" className="btn btn-outline" onClick={() => setEdit(null)}>Cancel</button><button className="btn btn-primary">Save</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
