import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const UiContext = createContext(null);
export const useUi = () => useContext(UiContext);

export function UiProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dlg, setDlg] = useState(null);

  const push = useCallback((type, msg) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  const confirm = useCallback((message, { title = 'Please confirm', confirmText = 'Confirm', danger = true } = {}) =>
    new Promise((res) => setDlg({ message, title, confirmText, danger, res })), []);
  const value = useMemo(() => ({ success: (m) => push('success', m), error: (m) => push('error', m), confirm }), [push, confirm]);
  const close = (v) => { dlg.res(v); setDlg(null); };

  return (
    <UiContext.Provider value={value}>
      {children}
      <div className="toasts">{toasts.map((t) => <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>)}</div>
      {dlg && (
        <div className="modal-back" onClick={() => close(false)}>
          <div className="modal small" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h3>{dlg.title}</h3>
            <p>{dlg.message}</p>
            <div className="row end">
              <button className="btn btn-outline" onClick={() => close(false)}>Cancel</button>
              <button className={`btn ${dlg.danger ? 'btn-danger' : 'btn-primary'}`} onClick={() => close(true)}>{dlg.confirmText}</button>
            </div>
          </div>
        </div>
      )}
    </UiContext.Provider>
  );
}
