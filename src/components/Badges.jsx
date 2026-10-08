import { label } from '../utils/format';

export const StatusBadge = ({ value }) => <span className={`badge b-${value}`}>{label(String(value))}</span>;
export const Stars = ({ rating = 0, count }) => (
  <span className="stars">{'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))} <small>{rating ? rating.toFixed(1) : 'No ratings'}{count != null && ` (${count})`}</small></span>
);
export const StatCard = ({ label: l, value }) => <div className="stat"><small>{l}</small><div>{value ?? '–'}</div></div>;
