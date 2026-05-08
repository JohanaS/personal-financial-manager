import { useState } from 'react';
import { AppIcon } from '../utils/icons';

const TAGS = [
  {
    key: 'indispensable',
    label: 'Indispensable',
    icon: 'indispensable',
    desc: 'Renta, comida, transporte, servicios básicos',
    defaultPct: 50,
    color: '#6366f1',
    bg: '#ede9fe',
    text: '#4f46e5',
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
  const [error, setError]     = useState('');

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
    const val = parseInt(raw, 10) || 0;
    setDraft(prev => ({ ...prev, [key]: val }));
  }

  function saveRule() {
    const total = TAGS.reduce((s, t) => s + (draft[t.key] ?? 0), 0);
    if (total !== 100) {
      setError(`Los porcentajes suman ${total}%. Deben sumar exactamente 100%.`);
      return;
    }
    setError('');
    onRuleChange({ ...draft });
    setEditing(false);
  }

  function cancelEdit() {
    setDraft({ ...rule });
    setError('');
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

      {/* Edición de porcentajes */}
      {editing && (
        <div className="budget__edit-panel card-reveal">
          <p className="budget__edit-hint">Ajusta los porcentajes (deben sumar 100%)</p>
          <div className="budget__edit-fields">
            {TAGS.map(tag => (
              <div key={tag.key} className="budget__edit-field">
                <label className="budget__edit-label" style={{ color: tag.text }}>
                  <AppIcon name={tag.icon} size={14} color={tag.text} /> {tag.label}
                </label>
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
              </div>
            ))}
          </div>
          {error && <p className="budget__edit-error">{error}</p>}
          <div className="budget__edit-actions">
            <button type="button" className="dialog__btn dialog__btn--cancel" onClick={cancelEdit}>
              Cancelar
            </button>
            <button type="button" className="btn-primary budget__edit-save" onClick={saveRule}>
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Gráfica comparativa por tag */}
      <div className="budget__rows">
        {TAGS.map(tag => {
          const isAhorro   = tag.key === 'ahorro';
          const budget     = monthIncome * (rule[tag.key] / 100);
          const spent      = spentByTag[tag.key] ?? 0;
          const diff       = spent - budget;           // positivo = exceso / bono ahorro
          const spentPct   = budget > 0 ? clamp((spent / budget) * 100, 0, 100) : 0;
          const remainPct  = 100 - spentPct;
          const overBudget = !isAhorro && spent > budget && budget > 0;  // gasto excedido (malo)
          const overGoal   =  isAhorro && spent > budget && budget > 0;  // ahorro extra   (bueno)

          return (
            <div key={tag.key} className="budget__row">
              {/* Encabezado fila */}
              <div className="budget__row-head">
                <div className="budget__row-title">
                  <span className="budget__row-icon">
                    <AppIcon name={tag.icon} size={18} color={tag.text} />
                  </span>
                  <div>
                    <span className="budget__row-label">{tag.label}</span>
                    <span className="budget__row-desc">{tag.desc}</span>
                  </div>
                </div>
                <div className="budget__row-nums">
                  <span className="budget__row-pct" style={{ background: tag.bg, color: tag.text }}>
                    {rule[tag.key]}%
                  </span>
                </div>
              </div>

              {/* Barra de progreso apilada */}
              {monthIncome > 0 ? (
                <div className="budget__progress-wrap">
                  <div className="budget__progress-track">
                    {/* Segmento principal (gastado / ahorrado) */}
                    <div
                      className={`budget__progress-spent${overBudget ? ' budget__progress-spent--over' : ''}`}
                      style={{
                        '--spent-w': `${spentPct}%`,
                        background: overBudget ? '#ef4444' : tag.color,
                      }}
                    />
                    {/* Segmento restante (solo cuando no se excede) */}
                    {!overBudget && !overGoal && (
                      <div
                        className="budget__progress-remain"
                        style={{ '--remain-w': `${remainPct}%`, background: '#9582e9' }}
                      />
                    )}
                  </div>

                  {/* Leyenda debajo */}
                  <div className="budget__progress-legend">
                    {/* Izquierda: ahorrado / gastado */}
                    <div className="budget__legend-item">
                      <span
                        className="budget__legend-dot"
                        style={{ background: overBudget ? '#ef4444' : tag.color }}
                      />
                      <span className="budget__legend-lbl">
                        {isAhorro ? 'Ahorrado' : 'Gastado'}
                      </span>
                      <strong className={`budget__legend-val${overBudget ? ' budget__legend-val--over' : ''}`}>
                        {formatCurrency(spent)}
                      </strong>
                      <span className="budget__legend-pct">
                        {Math.round(spentPct)}%
                      </span>
                    </div>

                    {/* Derecha: situación */}
                    {overBudget && (
                      <div className="budget__legend-over">
                        ⚠️ Excediste {formatCurrency(diff)}
                      </div>
                    )}

                    {overGoal && (
                      <div className="budget__legend-extra">
                        🎉 Adicional {formatCurrency(diff)}
                      </div>
                    )}

                    {!overBudget && !overGoal && (
                      <div className="budget__legend-item budget__legend-item--right">
                        <span className="budget__legend-dot" style={{ background: '#e2e8f0' }} />
                        <span className="budget__legend-lbl">
                          {isAhorro ? 'Por ahorrar' : 'Restante'}
                        </span>
                        <strong className="budget__legend-val">
                          {formatCurrency(Math.max(budget - spent, 0))}
                        </strong>
                        <span className="budget__legend-pct budget__legend-pct--muted">
                          de {formatCurrency(budget)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="budget__no-income">Sin ingresos este mes para calcular el presupuesto.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
