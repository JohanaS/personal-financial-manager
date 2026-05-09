import { useState } from 'react';
import Header from '../components/Header';
import SummaryCard from '../components/SummaryCard';
import TransactionForm from '../components/TransactionForm';
import IncomeChart from '../components/IncomeChart';
import BudgetRule from '../components/BudgetRule';

export default function Dashboard({ transactions, savedCards, budgetRule, user, onAdd, onSaveCard, onDeleteCard, onRuleChange, onLogout }) {
  const [showForm, setShowForm] = useState(false);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  function handleAdd(tx) {
    onAdd(tx);
    setShowForm(false);
  }

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <main className="dashboard">
        <div className="dashboard__greeting">
          <div className="dashboard__greeting-row">
            <div>
              <h2>¡Buenos días! 👋</h2>
              <p>Aquí tienes un resumen de tus finanzas</p>
            </div>
            <button
              type="button"
              className="btn-add-tx"
              onClick={() => setShowForm(true)}
            >
              + Agregar transacción
            </button>
          </div>
        </div>

        <div className="summary-grid">
          <SummaryCard title="Balance Total"    amount={balance}       variant="balance" />
          <SummaryCard title="Ingresos Totales"  amount={totalIncome}   variant="income"  />
          <SummaryCard title="Gastos Totales"    amount={totalExpenses} variant="expense" />
        </div>

        <div className="dashboard__right-col dashboard__right-col--full">
          <IncomeChart transactions={transactions} />
          <BudgetRule
            transactions={transactions}
            rule={budgetRule}
            onRuleChange={onRuleChange}
          />
        </div>
      </main>

      {/* Modal overlay */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowForm(false)}
              aria-label="Cerrar formulario"
            >
              ✕
            </button>
            <TransactionForm
              onAdd={handleAdd}
              savedCards={savedCards}
              onSaveCard={onSaveCard}
              onDeleteCard={onDeleteCard}
            />
          </div>
        </div>
      )}
    </>
  );
}
