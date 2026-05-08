import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { AppIcon } from '../utils/icons';

export default function Header() {
  const { dark, toggle } = useTheme();

  return (
    <header className="header">
      <div className="header__inner">
        <NavLink to="/" className="header__brand">
          <div className="header__brand-icon">$</div>
          <span className="header__title">Personal Financial Manager</span>
        </NavLink>

        <nav className="header__nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              'header__nav-link' + (isActive ? ' header__nav-link--active' : '')
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/transacciones"
            className={({ isActive }) =>
              'header__nav-link' + (isActive ? ' header__nav-link--active' : '')
            }
          >
            Transacciones
          </NavLink>
          <NavLink
            to="/reportes"
            className={({ isActive }) =>
              'header__nav-link' + (isActive ? ' header__nav-link--active' : '')
            }
          >
            Reportes
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
          <div className="header__avatar" title="Perfil de usuario">JA</div>
        </div>
      </div>
    </header>
  );
}
