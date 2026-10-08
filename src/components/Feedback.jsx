export const Loader = () => <div className="spinner" aria-label="Loading" />;
export const Empty = ({ text = 'Nothing to show' }) => <div className="empty">{text}</div>;
export const ErrorBox = ({ message, onRetry }) => (
  <div className="alert error">{message} {onRetry && <button className="btn btn-outline btn-sm" onClick={onRetry}>Retry</button>}</div>
);
