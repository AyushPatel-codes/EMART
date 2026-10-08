export default function Field({ label, error, as = 'input', children, ...p }) {
  return (
    <label className="field">
      <span>{label}</span>
      {as === 'select' ? <select {...p}>{children}</select> : as === 'textarea' ? <textarea {...p} /> : <input {...p} />}
      {error && <small className="error-text">{error}</small>}
    </label>
  );
}
