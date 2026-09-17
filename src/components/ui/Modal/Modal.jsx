// components/ui/Modal/Modal.jsx
// Controlled modal (open state is just a prop, same pattern as the
// off-canvas sidebar) — no Bootstrap JS dependency, and no reliance on
// Bootstrap's own modal CSS either; styling lives entirely in the
// adjacent Modal.css. Closes on Escape, backdrop click, or the × button,
// and locks page scroll while open.
import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="ui-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="ui-modal"
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ui-modal-header">
          <h5 className="ui-modal-title">{title}</h5>
          <button
            type="button"
            className="ui-modal-close"
            aria-label="Close"
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="ui-modal-body">{children}</div>

        {footer && <div className="ui-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
