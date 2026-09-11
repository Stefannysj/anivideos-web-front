import { useEffect, useState } from 'react';
import { navigationItems } from '../models/navigation.js';
import { Brand } from './Brand.js';
import { Icon } from './Icon.js';

/** Cabecera principal responsive con navegación compartida, menú móvil y bloqueo de scroll al abrirlo. */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>(() => {
    const currentHash = window.location.hash;
    return navigationItems.some((item) => item.href === currentHash) ? currentHash : '#inicio';
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') setIsMenuOpen(false);
    }

    function handleViewportChange(event: MediaQueryListEvent): void {
      if (event.matches) setIsMenuOpen(false);
    }

    const desktopQuery = window.matchMedia('(min-width: 56rem)');
    document.addEventListener('keydown', handleKeyDown);
    desktopQuery.addEventListener('change', handleViewportChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      desktopQuery.removeEventListener('change', handleViewportChange);
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isMenuOpen) document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  function closeMenu(): void {
    setIsMenuOpen(false);
  }

  function selectSection(href: string): void {
    setActiveHref(href);
    closeMenu();
  }

  return (
    <header className="navbar-shell">
      <nav className="navbar" aria-label="Navegación principal">
        <a className="navbar__brand" href="#inicio" onClick={() => selectSection('#inicio')} aria-label="AniVideos - Ir al inicio">
          <Brand compact />
        </a>

        <div className="navbar__links" aria-label="Secciones principales">
          {navigationItems.map((item) => (
            <a
              className={activeHref === item.href ? 'navbar__link navbar__link--active' : 'navbar__link'}
              href={item.href}
              key={item.href}
              aria-current={activeHref === item.href ? 'location' : undefined}
              onClick={() => selectSection(item.href)}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="navbar__actions">
          <button
            className="navbar__account"
            type="button"
            disabled
            title="Disponible en la etapa de autenticación"
          >
            <Icon name="user" size={18} />
            <span>Ingresar</span>
          </button>

          <button
            className="navbar__menu-button"
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} size={23} />
          </button>
        </div>
      </nav>

      <div
        className={isMenuOpen ? 'mobile-navigation mobile-navigation--open' : 'mobile-navigation'}
        id="mobile-navigation"
        aria-hidden={!isMenuOpen}
      >
        <div className="mobile-navigation__panel">
          <p className="mobile-navigation__eyebrow">Explorar AniVideos</p>
          {navigationItems.map((item) => (
            <a
              className={activeHref === item.href ? 'mobile-navigation__link mobile-navigation__link--active' : 'mobile-navigation__link'}
              href={item.href}
              key={item.href}
              aria-current={activeHref === item.href ? 'location' : undefined}
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={() => selectSection(item.href)}
            >
              <span>{item.label}</span>
              <Icon name="arrow-right" size={18} />
            </a>
          ))}
          <p className="mobile-navigation__note">Inicio de sesión disponible en una etapa posterior.</p>
        </div>
        <button
          className="mobile-navigation__backdrop"
          type="button"
          aria-label="Cerrar menú"
          tabIndex={isMenuOpen ? 0 : -1}
          onClick={closeMenu}
        />
      </div>
    </header>
  );
}
