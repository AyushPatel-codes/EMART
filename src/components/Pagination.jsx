export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  const start = Math.max(0, Math.min(page - 2, totalPages - 5));
  const num = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);
  return (
    <div className="pager">
      <button disabled={page === 0} onClick={() => onChange(page - 1)}>‹ Prev</button>
      {num.map((n) => <button key={n} className={n === page ? 'on' : ''} onClick={() => onChange(n)}>{n + 1}</button>)}
      <button disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>Next ›</button>
    </div>
  );
}
