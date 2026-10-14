import { getActiveLocale, t } from '../i18n/i18n.js';
import { routeHref } from '../i18n/routes.js';
import { ApiStatus } from './ApiStatus.js';
import { Brand } from './Brand.js';

export function SiteFooter(){
  const locale=getActiveLocale();
  return <footer className="site-footer">
    <div className="site-footer__main"><Brand compact/><span>{t('footer.stage.v18')}</span></div>
    <nav className="v16-footer-links" aria-label={t('footer.legalNav')}>
      <a href={routeHref(locale,{kind:'legal',page:'terms'})}>{t('footer.legal.terms')}</a>
      <a href={routeHref(locale,{kind:'legal',page:'privacy'})}>{t('footer.legal.privacy')}</a>
      <a href={routeHref(locale,{kind:'legal',page:'dmca'})}>{t('footer.legal.dmca')}</a>
      <a href={routeHref(locale,{kind:'blog'})}>{t('nav.blog')}</a>
    </nav>
    <div className="v16-credits">
      <p><a href="https://anilist.co" target="_blank" rel="noreferrer">{t('footer.credits.anilist')}</a></p>
    </div>
    <details className="technical-panel"><summary>{t('footer.status')}</summary><ApiStatus/></details>
  </footer>;
}
