import { useState } from 'react';
import { adminApi } from '../../api/services';
import { errMsg, errFields } from '../../api/client';
import { useAction, useFetch } from '../../hooks';
import { useUi } from '../../context/UiContext';
import Field from '../../components/Field';
import { ErrorBox, Loader } from '../../components/Feedback';

export default function Categories() {
  const ui = useUi();
  const { data, loading, error, reload } = useFetch(() => adminApi.categories(), []);
  const act = useAction(reload);
  const [f, setF] = useState({ id: null, name: '', description: '' });
  const [errs, setErrs] = useState({});

  const submit = async (e) => {
    e.preventDefault(); setErrs({});
    try {
      const body = { name: f.name, description: f.description };
      f.id ? await adminApi.updateCategory(f.id, body) : await adminApi.createCategory(body);
      ui.success(f.id ? 'Category updated' : 'Category created'); setF({ id: null, name: '', description: '' }); reload();
    } catch (ex) { setErrs(errFields(ex)); ui.error(errMsg(ex)); }
  };
  return (
    <>
      <h2>Categories</h2>
      <form className="card row" onSubmit={submit} style={{ alignItems: 'flex-end' }}>
        <Field label="Name" value={f.name} error={errs.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
        <Field label="Description" value={f.description || ''} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <div className="field"><span>&nbsp;</span><div className="row"><button className="btn btn-primary">{f.id ? 'Update' : 'Add category'}</button>
          {f.id && <button type="button" className="btn btn-outline" onClick={() => setF({ id: null, name: '', description: '' })}>Cancel</button>}</div></div>
      </form>
      {loading && <Loader />}{error && <ErrorBox message={error} onRetry={reload} />}
      {data && <div className="table-wrap"><table><thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead><tbody>
        {data.map((c) => <tr key={c.id}><td>{c.name}</td><td>{c.description}</td><td><div className="row">
          <button className="btn btn-outline btn-sm" onClick={() => setF({ id: c.id, name: c.name, description: c.description || '' })}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => act(() => adminApi.deleteCategory(c.id), { ok: 'Category deleted', confirm: `Delete category “${c.name}”?` })}>Delete</button>
        </div></td></tr>)}</tbody></table></div>}
    </>
  );
}
