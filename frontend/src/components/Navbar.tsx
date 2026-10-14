import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { getActiveLocale, t } from '../i18n/i18n.js';
import { parseRoute, routeHref } from '../i18n/routes.js';
import { navigationItems } from '../models/navigation.js';
import type { AuthMode } from './AuthModal.js';
import { Brand } from './Brand.js';
import { Icon } from './Icon.js';
import { LanguageSelector } from './LanguageSelector.js';
import { ThemeToggle } from './ThemeToggle.js';

const AuthModal = lazy(async () => ({ default: (await import('./AuthModal.js')).AuthModal }));
const ProfileModal = lazy(async () => ({ default: (await import('./ProfileModal.js')).ProfileModal }));

export function Navbar() {
  const { status, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const locale = getActiveLocale();
  const parsed = parseRoute(window.location.pathname);
  const isHomeRoute = parsed?.route.kind === 'home';
  const homeHref = routeHref(locale, { kind: 'home' });
  const calendarHref = routeHref(locale, { kind: 'calendar' });
  const [activeHref, setActiveHref] = useState<string>(() =>
    navigationItems.some((item) => item.href === window.location.hash) ? window.location.hash : '#inicio',
  );
  const closeAuth = useCallback(() => setAuthMode(null), []);

  useEffect(() => {
    function key(event: KeyboardEvent): void { if (event.key === 'Escape') setIsMenuOpen(false); }
    function viewport(event: MediaQueryListEvent): void { if (event.matches) setIsMenuOpen(false); }
    const query = window.matchMedia('(min-width: 56rem)');
    document.addEventListener('keydown', key);
    query.addEventListener('change', viewport);
    return () => {
      document.removeEventListener('keydown', key);
      query.removeEventListener('change', viewport);
    };
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [isMenuOpen]);

  function closeMenu(): void { setIsMenuOpen(false); }
  function selectSection(href: string): void { setActiveHref(href); closeMenu(); }
  function openAuth(mode: AuthMode): void { closeMenu(); setAuthMode(mode); }
  function openProfile(): void { closeMenu(); setProfileOpen(true); }
  async function signOut(): Promise<void> {
    setLogoutBusy(true);
    try { await logout(); closeMenu(); } finally { setLogoutBusy(false); }
  }

  const sectionHref = (hash: string): string => isHomeRoute ? hash : `${homeHref}${hash}`;

  return (
    <>
      <header className="navbar-shell v18-navbar-shell">
        <nav className="navbar" aria-label={t('nav.main')}>
          <a className="navbar__brand" href={sectionHref('#inicio')} onClick={() => selectSection('#inicio')} aria-label={t('nav.brandHome')}>
            <Brand compact />
          </a>

          <div className="navbar__links" aria-label={t('nav.sections')}>
            {navigationItems.map((item) => (
              <a
                className={activeHref === item.href && isHomeRoute ? 'navbar__link navbar__link--active' : 'navbar__link'}
                href={sectionHref(item.href)}
                key={item.href}
                aria-current={activeHref === item.href && isHomeRoute ? 'location' : undefined}
                onClick={() => selectSection(item.href)}
              >
                {t(item.labelKey)}
              </a>
            ))}
            <a className={parsed?.route.kind === 'calendar' ? 'navbar__link navbar__link--active' : 'navbar__link'} href={calendarHref}>
              {t('calendar.nav')}
            </a>
          </div>

          <div className="navbar__actions">
            <div className="v18-preferences"><LanguageSelector /><ThemeToggle /></div>
            {status === 'authenticated' && user ? (
              <div className="navbar__session">
                <a className="navbar__favorites-link" href={sectionHref('#favoritos')} aria-label={t('nav.list.open')}>
                  <Icon name="heart" size={16} /><span>{t('nav.list')}</span>
                </a>
                <button className="navbar__user" type="button" onClick={openProfile} aria-label={t('nav.profile.open')}>
                  <Icon name="user" size={17} /><span>{user.displayName || user.username}</span>
                </button>
                <button className="navbar__logout" type="button" disabled={logoutBusy} onClick={() => void signOut()}>
                  {logoutBusy ? t('nav.logoutBusy') : t('nav.logout')}
                </button>
              </div>
            ) : (
              <button className="navbar__account" type="button" onClick={() => openAuth('login')}>
                <Icon name="user" size={18} />
                <span>{t('nav.login')}</span>
                {status === 'checking' && <span className="navbar__auth-pulse" aria-label={t('nav.verifying')} />}
              </button>
            )}

            <button className="navbar__menu-button" type="button" aria-expanded={isMenuOpen} aria-controls="mobile-navigation" aria-label={isMenuOpen ? t('nav.menu.close') : t('nav.menu.open')} onClick={() => setIsMenuOpen((value) => !value)}>
              <Icon name={isMenuOpen ? 'close' : 'menu'} size={23} />
            </button>
          </div>
        </nav>

        <div className={isMenuOpen ? 'mobile-navigation mobile-navigation--open' : 'mobile-navigation'} id="mobile-navigation" aria-hidden={!isMenuOpen}>
          <div className="mobile-navigation__panel">
            <p className="mobile-navigation__eyebrow">{t('nav.explore')}</p>
            {navigationItems.map((item) => (
              <a className={activeHref === item.href && isHomeRoute ? 'mobile-navigation__link mobile-navigation__link--active' : 'mobile-navigation__link'} href={sectionHref(item.href)} key={item.href} tabIndex={isMenuOpen ? 0 : -1} onClick={() => selectSection(item.href)}>
                <span>{t(item.labelKey)}</span><Icon name="arrow-right" size={18} />
              </a>
            ))}
            <a className="mobile-navigation__link" href={calendarHref} tabIndex={isMenuOpen ? 0 : -1} onClick={closeMenu}>
              <span>{t('calendar.nav')}</span><Icon name="arrow-right" size={18} />
            </a>
            <div className="v18-preferences v18-preferences--mobile"><LanguageSelector /><ThemeToggle /></div>
            <div className="mobile-auth">
              {status === 'authenticated' && user ? (
                <>
                  <p className="mobile-auth__user">{t('nav.session')} <strong>{user.displayName || user.username}</strong></p>
                  <a className="button button--secondary mobile-auth__favorites" href={sectionHref('#favoritos')} onClick={closeMenu}><Icon name="heart" size={17} />{t('nav.list')}</a>
                  <button className="button button--primary" type="button" onClick={openProfile}>{t('nav.profile')}</button>
                  <button className="button button--secondary" type="button" disabled={logoutBusy} onClick={() => void signOut()}>{logoutBusy ? t('nav.logoutBusy') : t('nav.logout')}</button>
                </>
              ) : (
                <>
                  <button className="button button--primary" type="button" onClick={() => openAuth('login')}>{t('nav.login')}</button>
                  <button className="button button--secondary" type="button" onClick={() => openAuth('register')}>{t('nav.register')}</button>
                </>
              )}
            </div>
          </div>
          <button className="mobile-navigation__backdrop" type="button" aria-label={t('nav.menu.close')} tabIndex={isMenuOpen ? 0 : -1} onClick={closeMenu} />
        </div>
      </header>

      <Suspense fallback={null}>
        {authMode && <AuthModal mode={authMode} onModeChange={setAuthMode} onClose={closeAuth} />}
        {profileOpen && status === 'authenticated' && user && <ProfileModal onClose={() => setProfileOpen(false)} />}
      </Suspense>
    </>
  );
}
