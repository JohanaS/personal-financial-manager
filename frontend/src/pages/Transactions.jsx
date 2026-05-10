import { useState } from 'react';
import Header from '../components/Header';
import TransactionList from '../components/TransactionList';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function Transactions({ transactions, onDelete, budgetRule, user, onLogout }) {
  const now = new Date();
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    const isCurrentOrFuture =
      viewYear > now.getFullYear() ||
      (viewYear === now.getFullYear() && viewMonth >= now.getMonth());
    if (isCurrentOrFuture) return; // no navegar al futuro
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const isCurrentMonth =
    viewYear === now.getFullYear() && viewMonth === now.getMonth();

  // Filtrar transacciones del mes visible
  const filtered = transactions.filter(tx => {
    const [y, m] = tx.date.split('-').map(Number);
    return y === viewYear && m - 1 === viewMonth;
  });

  const monthIncome   = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const monthExpenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const monthBalance  = monthIncome - monthExpenses;

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <main className="dashboard">
        {/* Encabezado de mes */}
        <div className="txpage__header">
          <div className="txpage__title-block">
            <h2 className="txpage__title">Transacciones</h2>
            <p className="txpage__sub">Historial por mes</p>
          </div>

          <div className="month-nav">
            <button
              type="button"
              className="month-nav__btn"
              onClick={prevMonth}
              aria-label="Mes anterior"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <span className="month-nav__label">
              {MONTH_NAMES[viewMonth]} {viewYear}
              {isCurrentMonth && <span className="month-nav__current">Mes actual</span>}
            </span>

            <button
              type="button"
              className={`month-nav__btn${isCurrentMonth ? ' month-nav__btn--disabled' : ''}`}
              onClick={nextMonth}
              disabled={isCurrentMonth}
              aria-label="Mes siguiente"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mini resumen del mes */}
        <div className="txpage__summary">
          <div className="txpage__stat txpage__stat--balance">
            <span className="txpage__stat-label">Balance</span>
            <span className="txpage__stat-value">{formatCurrency(monthBalance)}</span>
          </div>
          <div className="txpage__stat txpage__stat--income">
            <span className="txpage__stat-label">Ingresos</span>
            <span className="txpage__stat-value">{formatCurrency(monthIncome)}</span>
          </div>
          <div className="txpage__stat txpage__stat--expense">
            <span className="txpage__stat-label">Gastos</span>
            <span className="txpage__stat-value">{formatCurrency(monthExpenses)}</span>
          </div>
          <div className="txpage__stat txpage__stat--count">
            <span className="txpage__stat-label">Movimientos</span>
            <span className="txpage__stat-value">{filtered.length}</span>
          </div>
        </div>

        {/* 3 columnas */}
        <TransactionList transactions={filtered} onDelete={onDelete} rule={budgetRule} />
      </main>
    </>
  );
}
