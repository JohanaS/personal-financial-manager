import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { AppIcon } from '../utils/icons';

export default function Header({ user, onLogout }) {
  const { dark, toggle } = useTheme();

  return (
    <header className="header">
      <div className="header__inner">
        <NavLink to="/" className="header__brand">
          <div className="header__brand-icon">$</div>
          <span className="header__title">Personal Financial</span>
        </NavLink>

        <nav className="header__nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              'header__nav-link' + (isActive ? ' header__nav-link--active' : '')
            }
          >
            <AppIcon name="Home" size={18} className="header__nav-icon" />
            <span>Inicio</span>
          </NavLink>
          <NavLink
            to="/transacciones"
            className={({ isActive }) =>
              'header__nav-link' + (isActive ? ' header__nav-link--active' : '')
            }
          >
            <AppIcon name="list" size={18} className="header__nav-icon" />
            <span>Transacciones</span>
          </NavLink>
          <NavLink
            to="/reportes"
            className={({ isActive }) =>
              'header__nav-link' + (isActive ? ' header__nav-link--active' : '')
            }
          >
            <AppIcon name="chart" size={18} className="header__nav-icon" />
            <span>Reportes</span>
          </NavLink>
        </nav>

        <div className="header__right">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggle}
            title={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            <AppIcon name={dark ? 'sun' : 'moon'} size={18} color="currentColor" />
          </button>
          <div className="header__avatar" title={user?.name ?? 'Perfil de usuario'}>
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'JA'}
          </div>
          {onLogout && (
            <button
              type="button"
              className="header__logout"
              onClick={onLogout}
              title="Cerrar sesión"
            >
              Salir
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
