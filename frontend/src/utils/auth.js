const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Credenciales incorrectas');
  // El backend devuelve { token: { id, name, email } }

  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  localStorage.setItem(TOKEN_KEY, data.token);
  return data.user;
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al registrarse');
  return data;
}

export function logoutUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
