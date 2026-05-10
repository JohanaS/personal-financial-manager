
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Login from './pages/Login';
import { ThemeProvider } from './context/ThemeContext';

const DEFAULT_RULE = { indispensable: 50, ahorro: 30, extra: 20 };

const INITIAL_TRANSACTIONS = [];

const INITIAL_CARDS = [];

export default function App() {
  const [user, setUser]                 = useState(null); // { email, name }
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [savedCards, setSavedCards]     = useState(INITIAL_CARDS);
  const [budgetRule, setBudgetRule]     = useState(DEFAULT_RULE);

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleLogout() {
    setUser(null);
  }

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
    user,
    onAdd: handleAdd,
    onDelete: handleDeleteTransaction,
    onSaveCard: handleSaveCard,
    onDeleteCard: handleDeleteCard,
    onRuleChange: setBudgetRule,
    onLogout: handleLogout,
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard {...shared} />} />
              <Route path="/transacciones" element={<Transactions transactions={transactions} onDelete={handleDeleteTransaction} budgetRule={budgetRule} user={user} onLogout={handleLogout} />} />
              <Route path="/reportes" element={<Reports transactions={transactions} user={user} onLogout={handleLogout} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
