export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="row between"><h3>{title}</h3><button className="btn btn-outline btn-sm" onClick={onClose}>✕</button></div>
        {children}
      </div>
    </div>
  );
}
