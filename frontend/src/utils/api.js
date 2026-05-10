const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error en la solicitud');
  return data;
}

export async function createTransaction(payload) {
  return request('/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getTransactions(userId) {
  return request(`/transactions/user/${userId}`);
}
