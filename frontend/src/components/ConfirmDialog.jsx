import { useEffect } from 'react';

/**
 * ConfirmDialog
 * Props:
 *   open        – boolean
 *   title       – string
 *   message     – string | ReactNode
 *   confirmLabel – string (default "Eliminar")
 *   cancelLabel  – string (default "Cancelar")
 *   variant      – "danger" | "warning" (default "danger")
 *   onConfirm   – () => void
 *   onCancel    – () => void
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <div className={`dialog__icon-wrap dialog__icon-wrap--${variant}`}>
          {variant === 'danger' ? '🗑️' : '⚠️'}
        </div>

        <h3 id="dialog-title" className="dialog__title">{title}</h3>
        <p className="dialog__message">{message}</p>

        <div className="dialog__actions">
          <button type="button" className="dialog__btn dialog__btn--cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`dialog__btn dialog__btn--confirm dialog__btn--${variant}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
