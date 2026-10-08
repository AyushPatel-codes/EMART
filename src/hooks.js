import { useEffect, useState } from 'react';
import { errMsg } from './api/client';
import { useUi } from './context/UiContext';

/** Single-resource fetch with loading/error/reload. */
export function useFetch(fn, deps = []) {
  const [s, setS] = useState({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let on = true;
    setS((x) => ({ ...x, loading: true, error: null }));
    fn().then((d) => on && setS({ data: d, loading: false, error: null }))
        .catch((e) => on && setS({ data: null, loading: false, error: errMsg(e) }));
    return () => { on = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);
  return { ...s, reload: () => setTick((t) => t + 1), setData: (d) => setS((x) => ({ ...x, data: d })) };
}

/** Server-side paginated list. fetcher receives {...params, page, size}. */
export function usePaged(fetcher, params = {}, size = 10) {
  const [page, setPage] = useState(0);
  const [s, setS] = useState({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);
  const key = JSON.stringify(params);
  useEffect(() => { setPage(0); }, [key]);
  useEffect(() => {
    let on = true;
    setS((x) => ({ ...x, loading: true, error: null }));
    fetcher({ ...params, page, size }).then((d) => on && setS({ data: d, loading: false, error: null }))
        .catch((e) => on && setS({ data: null, loading: false, error: errMsg(e) }));
    return () => { on = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, page, tick]);
  return { ...s, page, setPage, reload: () => setTick((t) => t + 1) };
}

/** Runs a mutation with optional confirm dialog + success/error toasts. */
export function useAction(reload) {
  const ui = useUi();
  return async (fn, { ok = 'Done', confirm, danger = true } = {}) => {
    if (confirm && !(await ui.confirm(confirm, { danger }))) return false;
    try { await fn(); ui.success(ok); reload && reload(); return true; }
    catch (e) { ui.error(errMsg(e)); return false; }
  };
}
