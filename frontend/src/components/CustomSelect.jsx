import { useState, useRef, useEffect } from 'react';

/**
 * CustomSelect
 * Props:
 *   id          – string (optional, for label association)
 *   value       – current selected value
 *   onChange    – (value) => void
 *   options     – [{ value, label, icon?, accent? }]
 *   placeholder – string shown when nothing is selected
 */
export default function CustomSelect({ id, value, onChange, options, placeholder = 'Selecciona…' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find(o => o.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  function select(val) {
    onChange(val);
    setOpen(false);
  }

  return (
    <div
      id={id}
      className={`cselect${open ? ' cselect--open' : ''}`}
      ref={ref}
    >
      {/* Trigger */}
      <button
        type="button"
        className={`cselect__trigger${!selected ? ' cselect__trigger--placeholder' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="cselect__value">
          {selected ? (
            <>
              {selected.icon && <span className="cselect__item-icon">{selected.icon}</span>}
              {selected.label}
            </>
          ) : placeholder}
        </span>
        <span className={`cselect__chevron${open ? ' cselect__chevron--up' : ''}`}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <ul className="cselect__menu" role="listbox">
          {options.map(opt => {
            const isActive = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isActive}
                className={`cselect__option${isActive ? ' cselect__option--active' : ''}${opt.accent ? ' cselect__option--accent' : ''}`}
                onClick={() => select(opt.value)}
              >
                {opt.icon && <span className="cselect__item-icon">{opt.icon}</span>}
                <span>{opt.label}</span>
                {isActive && (
                  <span className="cselect__check">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path d="M1 5L5 9L13 1" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
