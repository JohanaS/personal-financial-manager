import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { AppIcon } from '../utils/icons';
import { loginUser, registerUser } from '../utils/auth';

export default function Login({ onLogin }) {
  const { dark, toggle } = useTheme();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  }

  function validate() {
    const errs = {};
    if (mode === 'register' && !form.name.trim()) {
      errs.name = 'El nombre es obligatorio.';
    }
    if (!form.email.trim()) {
      errs.email = 'El correo es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Ingresa un correo válido.';
    }
    if (!form.password) {
      errs.password = 'La contraseña es obligatoria.';
    } else if (form.password.length < 6) {
      errs.password = 'Mínimo 6 caracteres.';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return;}
    setLoading(true);
    setServerError('');

    try {
      if (mode === 'login') {
        const user = await loginUser(form.email, form.password);
        onLogin(user);
      } else {
        await registerUser(form.name, form.email, form.password);
        setSuccessMessage('¡Usuario creado correctamente! Ya puedes iniciar sesión.');
        switchMode('login');
      }
    } catch (error) {
      setServerError(error.message || 'Ocurrió un error. Inténtalo de nuevo.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function switchMode(m) {
    setMode(m);
    setForm({ name: '', email: '', password: '' });
    setErrors({});
    setServerError('');
    if (m !== 'login') setSuccessMessage('');
  }

  return (
    <div className="login-page">
      {/* Theme toggle */}
      <button
        type="button"
        className="login-page__theme-btn theme-toggle"
        onClick={toggle}
        title={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        <AppIcon name={dark ? 'sun' : 'moon'} size={18} color="currentColor" />
      </button>

      <div className="login-card">
        {/* Brand */}
        <div className="login-card__brand">
          <div className="login-card__brand-icon">$</div>
          <span className="login-card__brand-name">Pana financiero</span>
        </div>

        {/* Tab switcher */}
        <div className="login-card__tabs">
          <button
            type="button"
            className={'login-card__tab' + (mode === 'login' ? ' login-card__tab--active' : '')}
            onClick={() => switchMode('login')}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={'login-card__tab' + (mode === 'register' ? ' login-card__tab--active' : '')}
            onClick={() => switchMode('register')}
          >
            Registrarse
          </button>
        </div>

        {/* Heading */}
        <div className="login-card__heading">
          <h1 className="login-card__title">
            {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </h1>
          <p className="login-card__subtitle">
            {mode === 'login'
              ? 'Ingresa tus datos para continuar.'
              : 'Completa el formulario para registrarte.'}
          </p>
        </div>

        {/* Form */}
        <form className="login-card__form" onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                className={'form-input' + (errors.name ? ' form-input--error' : '')}
                placeholder="Tu nombre completo"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              className={'form-input' + (errors.email ? ' form-input--error' : '')}
              placeholder="tu@correo.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className={'form-input' + (errors.password ? ' form-input--error' : '')}
              placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
              value={form.password}
              onChange={handleChange}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {successMessage && (
            <p className="login-card__success">{successMessage}</p>
          )}

          {serverError && (
            <p className="login-card__server-error">{serverError}</p>
          )}

          <button type="submit" className="login-card__submit" disabled={loading}>
            {loading
              ? 'Procesando…'
              : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

        {/* Footer link */}
        <p className="login-card__footer">
          {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button
            type="button"
            className="login-card__footer-link"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}
