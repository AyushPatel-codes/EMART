import { useEffect, useState } from 'react';

export default function SearchInput({ onChange, placeholder = 'Search…' }) {
  const [v, setV] = useState('');
  useEffect(() => { const t = setTimeout(() => onChange(v), 400); return () => clearTimeout(t); }, [v]); // eslint-disable-line
  return <input style={{ maxWidth: 280 }} value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} />;
}
