
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import { ThemeProvider } from './context/ThemeContext';

const DEFAULT_RULE = { indispensable: 50, ahorro: 30, extra: 20 };

const INITIAL_TRANSACTIONS = [
  { id: 1, amount: 3500.00, category: 'Salario',         type: 'income',  date: '2026-05-01', paymentMethod: 'efectivo', cardName: null,         budgetTag: null             },
  { id: 2, amount:  120.50, category: 'Comida',           type: 'expense', date: '2026-05-02', paymentMethod: 'debito',   cardName: null,         budgetTag: 'indispensable'  },
  { id: 3, amount:  450.00, category: 'Freelance',        type: 'income',  date: '2026-05-03', paymentMethod: 'efectivo', cardName: null,         budgetTag: null             },
  { id: 4, amount:   85.00, category: 'Transporte',       type: 'expense', date: '2026-05-04', paymentMethod: 'debito',   cardName: null,         budgetTag: 'indispensable'  },
  { id: 5, amount:  199.99, category: 'Compras',          type: 'expense', date: '2026-05-04', paymentMethod: 'credito',  cardName: 'Visa viajes',budgetTag: 'extra'          },
  { id: 6, amount: 1200.00, category: 'Inversión',        type: 'income',  date: '2026-05-05', paymentMethod: 'efectivo', cardName: null,         budgetTag: 'ahorro'         },
  { id: 7, amount:   65.00, category: 'Entretenimiento',  type: 'expense', date: '2026-05-06', paymentMethod: 'credito',  cardName: 'Oro personal',budgetTag: 'extra'         },
  { id: 8, amount:   45.00, category: 'Servicios',        type: 'expense', date: '2026-05-06', paymentMethod: 'debito',   cardName: null,         budgetTag: 'indispensable'  },
];

const INITIAL_CARDS = ['Visa viajes', 'Oro personal'];

export default function App() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [savedCards, setSavedCards]     = useState(INITIAL_CARDS);
  const [budgetRule, setBudgetRule]     = useState(DEFAULT_RULE);

  function handleAdd(tx) {
    setTransactions(prev => [tx, ...prev]);
  }

  function handleDeleteTransaction(id) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  function handleSaveCard(name) {
    setSavedCards(prev => prev.includes(name) ? prev : [...prev, name]);
  }

  function handleDeleteCard(name) {
    setSavedCards(prev => prev.filter(c => c !== name));
  }

  const shared = {
    transactions,
    savedCards,
    budgetRule,
    onAdd: handleAdd,
    onDelete: handleDeleteTransaction,
    onSaveCard: handleSaveCard,
    onDeleteCard: handleDeleteCard,
    onRuleChange: setBudgetRule,
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard {...shared} />} />
          <Route path="/transacciones" element={<Transactions transactions={transactions} onDelete={handleDeleteTransaction} budgetRule={budgetRule} />} />
          <Route path="/reportes" element={<Reports transactions={transactions} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
