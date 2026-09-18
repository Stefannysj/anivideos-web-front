import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { navigationItems } from '../models/navigation.js';
import { AuthModal } from './AuthModal.js';
import type { AuthMode } from './AuthModal.js';
import { Brand } from './Brand.js';
import { Icon } from './Icon.js';

/** Cabecera responsive con navegación y acceso a la sesión implementada en la etapa 07. */
export function Navbar() {
  const { status, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [activeHref, setActiveHref] = useState<string>(() => {
    const currentHash = window.location.hash;
    return navigationItems.some((item) => item.href === currentHash) ? currentHash : '#inicio';
  });

  const closeAuth = useCallback(() => setAuthMode(null), []);

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
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isMenuOpen]);

  function closeMenu(): void { setIsMenuOpen(false); }
  function selectSection(href: string): void { setActiveHref(href); closeMenu(); }
  function openAuth(mode: AuthMode): void { closeMenu(); setAuthMode(mode); }

  async function signOut(): Promise<void> {
    setLogoutBusy(true);
    try {
      await logout();
      closeMenu();
    } finally {
      setLogoutBusy(false);
    }
  }

  return (
    <>
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
            {status === 'authenticated' && user ? (
              <div className="navbar__session">
                <span className="navbar__user"><Icon name="user" size={17} /><span>{user.username}</span></span>
                <button className="navbar__logout" type="button" disabled={logoutBusy} onClick={() => void signOut()}>{logoutBusy ? 'Saliendo...' : 'Salir'}</button>
              </div>
            ) : (
              <button className="navbar__account" type="button" disabled={status === 'checking'} onClick={() => openAuth('login')}>
                <Icon name="user" size={18} />
                <span>{status === 'checking' ? 'Verificando...' : 'Ingresar'}</span>
              </button>
            )}

            <button className="navbar__menu-button" type="button" aria-expanded={isMenuOpen} aria-controls="mobile-navigation" aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setIsMenuOpen((current) => !current)}>
              <Icon name={isMenuOpen ? 'close' : 'menu'} size={23} />
            </button>
          </div>
        </nav>

        <div className={isMenuOpen ? 'mobile-navigation mobile-navigation--open' : 'mobile-navigation'} id="mobile-navigation" aria-hidden={!isMenuOpen}>
          <div className="mobile-navigation__panel">
            <p className="mobile-navigation__eyebrow">Explorar AniVideos</p>
            {navigationItems.map((item) => (
              <a className={activeHref === item.href ? 'mobile-navigation__link mobile-navigation__link--active' : 'mobile-navigation__link'} href={item.href} key={item.href} aria-current={activeHref === item.href ? 'location' : undefined} tabIndex={isMenuOpen ? 0 : -1} onClick={() => selectSection(item.href)}>
                <span>{item.label}</span><Icon name="arrow-right" size={18} />
              </a>
            ))}

            <div className="mobile-auth">
              {status === 'authenticated' && user ? (
                <>
                  <p className="mobile-auth__user">Sesión iniciada como <strong>{user.username}</strong></p>
                  <button className="button button--secondary" type="button" disabled={logoutBusy} onClick={() => void signOut()}>{logoutBusy ? 'Cerrando sesión...' : 'Cerrar sesión'}</button>
                </>
              ) : (
                <>
                  <button className="button button--primary" type="button" disabled={status === 'checking'} onClick={() => openAuth('login')}>Ingresar</button>
                  <button className="button button--secondary" type="button" disabled={status === 'checking'} onClick={() => openAuth('register')}>Crear cuenta</button>
                </>
              )}
            </div>
          </div>
          <button className="mobile-navigation__backdrop" type="button" aria-label="Cerrar menú" tabIndex={isMenuOpen ? 0 : -1} onClick={closeMenu} />
        </div>
      </header>

      {authMode && <AuthModal mode={authMode} onModeChange={setAuthMode} onClose={closeAuth} />}
    </>
  );
}
