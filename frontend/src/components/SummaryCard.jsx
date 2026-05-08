import { AppIcon } from '../utils/icons';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
}

const TRENDS = {
  balance: 'Balance neto · todo el tiempo',
  income: 'Todos los ingresos registrados',
  expense: 'Todos los gastos registrados',
};

export default function SummaryCard({ title, amount, variant }) {
  return (
    <div className="summary-card">
      <div className={`summary-card__icon summary-card__icon--${variant}`}>
        <AppIcon name={variant} size={22} color="#6366f1" />
      </div>
      <div className="summary-card__body">
        <div className="summary-card__label">{title}</div>
        <div className={`summary-card__amount summary-card__amount--${variant}`}>
          {formatCurrency(amount)}
        </div>
        <div className="summary-card__trend">{TRENDS[variant]}</div>
      </div>
    </div>
  );
}
