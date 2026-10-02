import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { navigationItems } from '../models/navigation.js';
import type { AuthMode } from './AuthModal.js';
import { Brand } from './Brand.js';
import { Icon } from './Icon.js';

const AuthModal = lazy(async () => {
  const module = await import('./AuthModal.js');
  return { default: module.AuthModal };
});
const ProfileModal = lazy(async () => {
  const module = await import('./ProfileModal.js');
  return { default: module.ProfileModal };
});

/** Responsive header with authenticated profile and favorites navigation. */
export function Navbar() {
  const { status, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const isHomeRoute = window.location.pathname === '/';
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
  function openProfile(): void { closeMenu(); setProfileOpen(true); }

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
          <a className="navbar__brand" href={isHomeRoute ? '#inicio' : '/#inicio'} onClick={() => selectSection('#inicio')} aria-label="AniVideos - Ir al inicio">
            <Brand compact />
          </a>

          <div className="navbar__links" aria-label="Secciones principales">
            {navigationItems.map((item) => (
              <a
                className={activeHref === item.href ? 'navbar__link navbar__link--active' : 'navbar__link'}
                href={isHomeRoute ? item.href : `/${item.href}`}
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
                <a className="navbar__favorites-link" href={isHomeRoute ? '#favoritos' : '/#favoritos'} aria-label="Ir a Mi lista"><Icon name="heart" size={16} /><span>Mi lista</span></a>
                <button className="navbar__user" type="button" onClick={openProfile} aria-label="Abrir mi perfil"><Icon name="user" size={17} /><span>{user.displayName || user.username}</span></button>
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
              <a className={activeHref === item.href ? 'mobile-navigation__link mobile-navigation__link--active' : 'mobile-navigation__link'} href={isHomeRoute ? item.href : `/${item.href}`} key={item.href} aria-current={activeHref === item.href ? 'location' : undefined} tabIndex={isMenuOpen ? 0 : -1} onClick={() => selectSection(item.href)}>
                <span>{item.label}</span><Icon name="arrow-right" size={18} />
              </a>
            ))}

            <div className="mobile-auth">
              {status === 'authenticated' && user ? (
                <>
                  <p className="mobile-auth__user">Sesión iniciada como <strong>{user.displayName || user.username}</strong></p>
                  <a className="button button--secondary mobile-auth__favorites" href={isHomeRoute ? '#favoritos' : '/#favoritos'} onClick={closeMenu}><Icon name="heart" size={17} />Mi lista</a>
                  <button className="button button--primary" type="button" onClick={openProfile}>Mi perfil</button>
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

      <Suspense fallback={null}>
        {authMode && <AuthModal mode={authMode} onModeChange={setAuthMode} onClose={closeAuth} />}
        {profileOpen && status === 'authenticated' && user && <ProfileModal onClose={() => setProfileOpen(false)} />}
      </Suspense>
    </>
  );
}
