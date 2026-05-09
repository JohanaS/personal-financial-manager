import { useState } from 'react';
import { AppIcon } from '../utils/icons';

const TAGS = [
  {
    key: 'indispensable',
    label: 'Indispensable',
    icon: 'indispensable',
    desc: 'Renta, comida, transporte, servicios básicos',
    defaultPct: 50,
    color: 'var(--color-primary)',
    bg: '#ede9fe',
    text: 'var(--color-primary-hover)',
  },
  {
    key: 'ahorro',
    label: 'Ahorro',
    icon: 'ahorro',
    desc: 'Inversión, fondo de emergencia, retiro',
    defaultPct: 30,
    color: '#7c3aed',
    bg: '#f5f3ff',
    text: '#6d28d9',
  },
  {
    key: 'extra',
    label: 'Extra / Gusto',
    icon: 'extra',
    desc: 'Entretenimiento, compras, salidas',
    defaultPct: 20,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    text: '#7c3aed',
  },
];

function formatCurrency(n) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', minimumFractionDigits: 0,
  }).format(n);
}

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

export default function BudgetRule({ transactions, rule, onRuleChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState({ ...rule });

  const now = new Date();

  const isCurrentMonth = tx => {
    const [y, m] = tx.date.split('-').map(Number);
    return y === now.getFullYear() && m - 1 === now.getMonth();
  };

  // Ingresos del mes actual (sin etiqueta de ahorro)
  const monthIncome = transactions
    .filter(tx => tx.type === 'income' && !tx.budgetTag && isCurrentMonth(tx))
    .reduce((s, t) => s + t.amount, 0);

  // Gastos del mes actual con budgetTag (indispensable / extra)
  const thisMonthExpenses = transactions.filter(tx =>
    tx.type === 'expense' && tx.budgetTag && isCurrentMonth(tx)
  );

  // Ingresos marcados como ahorro del mes actual
  const thisMonthSavings = transactions.filter(tx =>
    tx.type === 'income' && tx.budgetTag === 'ahorro' && isCurrentMonth(tx)
  );

  // Acumulado por tag: gastos para indispensable/extra, ingresos para ahorro
  const spentByTag = {};
  for (const tx of thisMonthExpenses) {
    spentByTag[tx.budgetTag] = (spentByTag[tx.budgetTag] ?? 0) + tx.amount;
  }
  spentByTag.ahorro = thisMonthSavings.reduce((s, t) => s + t.amount, 0);

  function handleDraftChange(key, raw) {
    const val = Math.max(0, parseInt(raw, 10) || 0);
    setDraft(prev => {
      const otherSum = TAGS.reduce((s, t) => t.key === key ? s : s + (prev[t.key] ?? 0), 0);
      // Block the change if it would push the total above 100
      if (otherSum + val > 100) return prev;
      return { ...prev, [key]: val };
    });
  }

  function saveRule() {
    onRuleChange({ ...draft });
    setEditing(false);
  }

  function cancelEdit() {
    setDraft({ ...rule });
    setEditing(false);
  }

  const MONTH_NAMES = ['enero','febrero','marzo','abril','mayo','junio',
                        'julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div className="card budget-card">
      <div className="card__header">
        <div>
          <span className="card__title">Regla de presupuesto</span>
          <p className="budget__sub">Mes de {monthLabel} · basado en ingresos del mes</p>
        </div>
        {!editing && (
          <button type="button" className="budget__edit-btn" onClick={() => setEditing(true)}>
            <AppIcon name="edit" size={14} color="currentColor" /> Editar
          </button>
        )}
      </div>

      {/* Ingresos del mes */}
      <div className="budget__income-row">
        <span className="budget__income-label">Ingresos del mes</span>
        <span className="budget__income-value">
          {monthIncome > 0 ? formatCurrency(monthIncome) : '—'}
        </span>
      </div>

      {/* Cuerpo: gráfica vertical (izquierda) + detalles/edición (derecha) */}
      <div className="budget__body">

        {/* IZQUIERDA – barras verticales */}
        <div className="budget__chart">
          <div className="budget__bars">
            {TAGS.map(tag => {
              const budget     = monthIncome * (rule[tag.key] / 100);
              const spent      = spentByTag[tag.key] ?? 0;
              const spentPct   = budget > 0 ? clamp((spent / budget) * 100, 0, 100) : 0;
              const isAhorro   = tag.key === 'ahorro';
              const overBudget = !isAhorro && spent > budget && budget > 0;
              const fillColor  = overBudget ? 'var(--color-error)' : tag.color;

              return (
                <div key={tag.key} className="budget__bar-group">
                  <div className="budget__bar-pct-label" style={{ color: tag.text }}>
                    {rule[tag.key]}%
                  </div>
                  <div className="budget__bar-track" style={{ background: tag.bg }}>
                    {monthIncome > 0 && (
                      <div
                        className="budget__bar-fill"
                        style={{ '--bar-h': `${spentPct}%`, background: fillColor }}
                      />
                    )}
                  </div>
                  <div className="budget__bar-label">
                    <AppIcon name={tag.icon} size={13} color={tag.text} />
                    <span style={{ color: tag.text }}>{tag.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {monthIncome > 0
            ? <p className="budget__chart-hint">Progreso del mes actual</p>
            : <p className="budget__chart-hint">Sin ingresos este mes</p>
          }
        </div>

        {/* DERECHA – detalles por categoría (y edición) */}
        <div className="budget__details">
          {TAGS.map(tag => {
            const isAhorro   = tag.key === 'ahorro';
            const budget     = monthIncome * (rule[tag.key] / 100);
            const spent      = spentByTag[tag.key] ?? 0;
            const diff       = spent - budget;
            const overBudget = !isAhorro && spent > budget && budget > 0;
            const overGoal   =  isAhorro && spent > budget && budget > 0;

            return (
              <div key={tag.key} className="budget__detail-row" style={{ borderLeftColor: tag.color }}>
                <div className="budget__detail-head">
                  <span className="budget__detail-icon">
                    <AppIcon name={tag.icon} size={15} color={tag.text} />
                  </span>
                  <span className="budget__detail-label">{tag.label}</span>
                  {editing ? (
                    <div className="budget__edit-input-wrap">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="budget__edit-input"
                        value={draft[tag.key] ?? tag.defaultPct}
                        onChange={e => handleDraftChange(tag.key, e.target.value)}
                        style={{ borderColor: tag.color }}
                      />
                      <span className="budget__edit-pct">%</span>
                    </div>
                  ) : (
                    <span className="budget__row-pct" style={{ background: tag.bg, color: tag.text }}>
                      {rule[tag.key]}%
                    </span>
                  )}
                </div>

                {monthIncome > 0 && !editing && (
                  <div className="budget__detail-amounts">
                    <span className={`budget__detail-spent${overBudget ? ' budget__detail-spent--over' : ''}`}>
                      {isAhorro ? 'Ahorrado' : 'Gastado'}: <strong>{formatCurrency(spent)}</strong>
                    </span>
                    {overBudget && (
                      <span className="budget__detail-status budget__detail-status--over">
                        ⚠️ +{formatCurrency(diff)}
                      </span>
                    )}
                    {overGoal && (
                      <span className="budget__detail-status budget__detail-status--good">
                        🎉 +{formatCurrency(diff)}
                      </span>
                    )}
                    {!overBudget && !overGoal && (
                      <span className="budget__detail-remain">
                        de {formatCurrency(budget)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Acciones de edición */}
          {editing && (() => {
            const usedPct = TAGS.reduce((s, t) => s + (draft[t.key] ?? 0), 0);
            const remaining = 100 - usedPct;
            return (
              <>
                <div className="budget__edit-remaining">
                  <span>Total distribuido:</span>
                  <strong style={{ color: usedPct === 100 ? '#0d9488' : '#f59e0b' }}>
                    {usedPct}%
                  </strong>
                  {remaining > 0 && (
                    <span className="budget__edit-remaining-hint">· faltan {remaining}%</span>
                  )}
                </div>
                <div className="budget__edit-actions">
                  <button type="button" className="dialog__btn dialog__btn--cancel" onClick={cancelEdit}>
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn-primary budget__edit-save"
                    onClick={saveRule}
                    disabled={usedPct !== 100}
                    style={{ opacity: usedPct !== 100 ? 0.45 : 1, cursor: usedPct !== 100 ? 'not-allowed' : 'pointer' }}
                  >
                    Guardar
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
