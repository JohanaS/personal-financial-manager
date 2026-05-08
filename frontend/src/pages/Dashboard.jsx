import Header from '../components/Header';
import SummaryCard from '../components/SummaryCard';
import TransactionForm from '../components/TransactionForm';
import IncomeChart from '../components/IncomeChart';
import BudgetRule from '../components/BudgetRule';

export default function Dashboard({ transactions, savedCards, budgetRule, onAdd, onDelete, onSaveCard, onDeleteCard, onRuleChange }) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <>
      <Header />
      <main className="dashboard">
        <div className="dashboard__greeting">
          <h2>¡Buenos días! 👋</h2>
          <p>Aquí tienes un resumen de tus finanzas</p>
        </div>

        <div className="summary-grid">
          <SummaryCard title="Balance Total"    amount={balance}       variant="balance" />
          <SummaryCard title="Ingresos Totales"  amount={totalIncome}   variant="income"  />
          <SummaryCard title="Gastos Totales"    amount={totalExpenses} variant="expense" />
        </div>

        <div className="content-grid">
          <TransactionForm
            onAdd={onAdd}
            savedCards={savedCards}
            onSaveCard={onSaveCard}
            onDeleteCard={onDeleteCard}
          />
          <div className="dashboard__right-col">
            <IncomeChart transactions={transactions} />
            <BudgetRule
              transactions={transactions}
              rule={budgetRule}
              onRuleChange={onRuleChange}
            />
          </div>
        </div>
      </main>
    </>
  );
}
