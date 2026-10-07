import { t } from '../i18n/i18n.js';
import { ApiStatus } from './ApiStatus.js';
import { Brand } from './Brand.js';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main"><Brand compact /><span>{t('footer.stage.v17')}</span></div>
      <nav className="v16-footer-links" aria-label="Legal"><a href="/terminos">{t('footer.legal.terms')}</a><a href="/privacidad">{t('footer.legal.privacy')}</a><a href="/dmca">{t('footer.legal.dmca')}</a><a href="/blog">{t('nav.blog')}</a></nav>
      <div className="v16-credits">
        <p><a href="https://anilist.co" target="_blank" rel="noreferrer">{t('footer.credits.anilist')}</a></p>
        <p><a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">TMDB</a> — {t('footer.credits.tmdbEs')}</p>
        <p>{t('footer.credits.tmdb')}</p>
      </div>
      <details className="technical-panel"><summary>{t('footer.status')}</summary><ApiStatus /></details>
    </footer>
  );
}
