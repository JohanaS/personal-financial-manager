import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { AppIcon } from '../utils/icons';

export default function Header({ user, onLogout }) {
  const { dark, toggle } = useTheme();
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPopupOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className="header__avatar-wrap" ref={popupRef}>
            <button
              type="button"
              className="header__avatar"
              onClick={() => setPopupOpen(o => !o)}
              title={user?.name ?? 'Perfil de usuario'}
              aria-haspopup="true"
              aria-expanded={popupOpen}
            >
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'JA'}
            </button>
            {popupOpen && (
              <div className="header__user-popup">
                <div className="header__user-popup-info">
                  <p className="header__user-popup-name">{user?.name}</p>
                  <p className="header__user-popup-email">{user?.email}</p>
                </div>
                <div className="header__user-popup-divider" />
                {onLogout && (
                  <button
                    type="button"
                    className="header__user-popup-logout"
                    onClick={() => { setPopupOpen(false); onLogout(); }}
                  >
                    <AppIcon name="logout" size={16} />
                    Cerrar sesión
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
