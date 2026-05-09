import { AppIcon } from '../utils/icons';

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
}

export default function MonthCard({ monthName, monthIndex, year, transactions }) {
  const monthTx = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === monthIndex && d.getFullYear() === year;
  });

  const income   = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance  = income - expenses;

  const cardDebts = monthTx
    .filter(t => t.paymentMethod === 'credito' && t.cardName)
    .reduce((acc, t) => {
      acc[t.cardName] = (acc[t.cardName] || 0) + t.amount;
      return acc;
    }, {});

  const hasActivity = monthTx.length > 0;
  const isPositive  = balance >= 0;

  return (
    <div className={`month-card${!hasActivity ? ' month-card--empty' : ''}`}>
      <div className="month-card__header">
        <span className="month-card__name">{monthName}</span>
        <span className="month-card__year">{year}</span>
      </div>

      <div className="month-card__rows">
        <div className="month-card__row">
          <span className="month-card__row-label">
              <span className="month-card__row-icon month-card__row-icon--income">
                <AppIcon name="income" size={11} color="#0d9488" />
              </span>
            Ingresos
          </span>
          <span className="month-card__row-value month-card__row-value--income">
            {hasActivity ? formatCurrency(income) : '—'}
          </span>
        </div>
        <div className="month-card__row">
          <span className="month-card__row-label">
              <span className="month-card__row-icon month-card__row-icon--expense">
                <AppIcon name="expense" size={11} color="#ea580c" />
              </span>
            Egresos
          </span>
          <span className="month-card__row-value month-card__row-value--expense">
            {hasActivity ? formatCurrency(expenses) : '—'}
          </span>
        </div>
      </div>

      <div className={`month-card__balance ${isPositive ? 'month-card__balance--positive' : 'month-card__balance--negative'}`}>
        <div className="month-card__balance-row">
          <span className="month-card__balance-label">Balance</span>
          <span className="month-card__balance-tag">
            {!hasActivity ? 'Sin movimientos' : isPositive ? '▲ A favor' : '▼ En contra'}
          </span>
        </div>
        <div className="month-card__balance-amount">
          {hasActivity ? formatCurrency(balance) : '—'}
        </div>
      </div>

      {Object.keys(cardDebts).length > 0 && (
        <div className="month-card__cards">
          <div className="month-card__cards-title">Tarjetas de crédito</div>
          {Object.entries(cardDebts).map(([card, debt]) => (
            <div key={card} className="month-card__card-row">
              <span className="month-card__card-name">
              <AppIcon name="card" size={13} color="#7c3aed" /> {card}
            </span>
              <span className="month-card__card-debt">{formatCurrency(debt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
