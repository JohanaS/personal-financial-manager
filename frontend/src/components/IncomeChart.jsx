import { AppIcon } from '../utils/icons';

const CATEGORY_COLORS = {
  Comida:          { bar: 'var(--color-accent)', bg: '#fff7ed', text: '#ea580c' },
  Transporte:      { bar: 'var(--color-primary)', bg: '#eff6ff', text: '#2563eb' },
  Compras:         { bar: '#ec4899', bg: '#fdf2f8', text: '#db2777' },
  Entretenimiento: { bar: '#a855f7', bg: '#faf5ff', text: '#9333ea' },
  Salud:           { bar: 'var(--color-success)', bg: '#ecfdf5', text: '#059669' },
  Servicios:       { bar: '#06b6d4', bg: '#ecfeff', text: '#0891b2' },
  Renta:           { bar: 'var(--color-error)', bg: '#fff7ed', text: '#ea580c' },
  Otro:            { bar: '#6b7280', bg: '#f9fafb', text: '#4b5563' },
};

const DEFAULT_COLOR = { bar: 'var(--color-error)', bg: '#fff7ed', text: '#ea580c' };

function formatCurrency(n) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', minimumFractionDigits: 0,
  }).format(n);
}

export default function IncomeChart({ transactions }) {
  // Agrupar gastos por categoría
  const expenseByCategory = {};
  for (const tx of transactions) {
    if (tx.type !== 'expense') continue;
    expenseByCategory[tx.category] = (expenseByCategory[tx.category] ?? 0) + tx.amount;
  }

  const total = Object.values(expenseByCategory).reduce((s, v) => s + v, 0);

  // Ordenar de mayor a menor
  const entries = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return (
      <div className="card">
        <div className="card__header">
          <span className="card__title">Gastos por categoría</span>
        </div>
        <div className="tx-empty">
          <div className="tx-empty__icon"><AppIcon name="chart" size={32} color="var(--color-error)" /></div>
          <div className="tx-empty__text">Sin gastos registrados</div>
          <div className="tx-empty__sub">Agrega transacciones de tipo gasto para ver la gráfica</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Gastos por categoría</span>
        <span className="card__badge">Total {formatCurrency(total)}</span>
      </div>

      <div className="chart">
        {entries.map(([category, amount]) => {
          const pct = total > 0 ? (amount / total) * 100 : 0;
          const color = CATEGORY_COLORS[category] ?? DEFAULT_COLOR;

          return (
            <div key={category} className="chart__row">
              {/* Etiqueta */}
              <div className="chart__label">
                <span className="chart__icon"><AppIcon name={category} size={15} color={color.bar} /></span>
                <span className="chart__name">{category}</span>
              </div>

              {/* Barra */}
              <div className="chart__track">
                <div
                  className="chart__bar"
                  style={{
                    '--bar-width': `${pct}%`,
                    background: color.bar,
                  }}
                />
              </div>

              {/* Valores */}
              <div className="chart__values">
                <span
                  className="chart__pct"
                  style={{ color: color.text, background: color.bg }}
                >
                  {pct.toFixed(1)}%
                </span>
                <span className="chart__amount">{formatCurrency(amount)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
