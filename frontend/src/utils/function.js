export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = String(dateStr).split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function groupByMonth(transactions) {
  return transactions.reduce((acc, tx) => {
    const [year, month] = (tx.date || '').split('-');
    const key = `${year}-${month}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(tx);
    return acc;
  }, {});
}

export function calcSummary(transactions) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}
