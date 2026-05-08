import { AppIcon } from '../utils/icons';

const CATEGORY_COLORS = {
  Salario:         { bar: '#6366f1', bg: '#ede9fe', text: '#4f46e5' },
  Freelance:       { bar: '#7c3aed', bg: '#f5f3ff', text: '#6d28d9' },
  'Inversión':     { bar: '#8b5cf6', bg: '#f5f3ff', text: '#7c3aed' },
  Bono:            { bar: '#4f46e5', bg: '#e0e7ff', text: '#3730a3' },
  Regalo:          { bar: '#a78bfa', bg: '#f5f3ff', text: '#7c3aed' },
  Otro:            { bar: '#c4b5fd', bg: '#faf5ff', text: '#8b5cf6' },
};

const DEFAULT_COLOR = { bar: '#6366f1', bg: '#ede9fe', text: '#4f46e5' };

function formatCurrency(n) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', minimumFractionDigits: 0,
  }).format(n);
}

export default function IncomeChart({ transactions }) {
  // Agrupar ingresos por categoría
  const incomeByCategory = {};
  for (const tx of transactions) {
    if (tx.type !== 'income') continue;
    incomeByCategory[tx.category] = (incomeByCategory[tx.category] ?? 0) + tx.amount;
  }

  const total = Object.values(incomeByCategory).reduce((s, v) => s + v, 0);

  // Ordenar de mayor a menor
  const entries = Object.entries(incomeByCategory).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return (
      <div className="card">
        <div className="card__header">
          <span className="card__title">Ingresos por categoría</span>
        </div>
        <div className="tx-empty">
          <div className="tx-empty__icon"><AppIcon name="chart" size={32} color="#6366f1" /></div>
          <div className="tx-empty__text">Sin ingresos registrados</div>
          <div className="tx-empty__sub">Agrega transacciones de tipo ingreso para ver la gráfica</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Ingresos por categoría</span>
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

      {/* Leyenda de categorías */}
      <div className="chart__legend">
        {entries.map(([category]) => {
          const color = CATEGORY_COLORS[category] ?? DEFAULT_COLOR;
          return (
            <div key={category} className="chart__legend-item">
              <span className="chart__legend-dot" style={{ background: color.bar }} />
              <span className="chart__legend-name">{category}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
