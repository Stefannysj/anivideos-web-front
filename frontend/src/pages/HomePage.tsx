import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { getActiveLocale, t } from '../i18n/i18n.js';
import { routeHref } from '../i18n/routes.js';
import { CatalogExplorer } from '../components/CatalogExplorer.js';
import { CatalogLane } from '../components/CatalogLane.js';
import { ExperienceHero } from '../components/ExperienceHero.js';
import { FavoritesLane } from '../components/FavoritesLane.js';
import { Icon } from '../components/Icon.js';
import { RecommendationsLane } from '../components/RecommendationsLane.js';
import { resolveApiBaseUrl } from '../config/api.js';
import type { ContentItem } from '../models/content.js';
import { catalogSections, filterContentByCategory } from '../models/content.js';
import { getCatalog } from '../services/catalog.service.js';

type State = { status: 'loading' } | { status: 'error' } | { status: 'ready'; catalog: ContentItem[] };

const AniListDevPreview = lazy(async () => {
  const module = await import('../components/AniListDevPreview.js');
  return { default: module.AniListDevPreview };
});

export function HomePage() {
  const calendarHref = routeHref(getActiveLocale(), { kind: 'calendar' });
  const [state, setState] = useState<State>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);
  const [showAniListDev, setShowAniListDev] = useState(false);
  const retry = useCallback(() => setReloadKey((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    const baseUrl = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD);

    void getCatalog(baseUrl, controller.signal)
      .then((catalog) => {
        if (!controller.signal.aborted) {
          setState({ status: 'ready', catalog: catalog.filter((item) => item.source === 'anilist') });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: 'error' });
      });

    return () => controller.abort();
  }, [reloadKey]);

  const catalog = state.status === 'ready' ? state.catalog : [];
  const visibleSections = useMemo(
    () => catalogSections.filter((section) => section.category === 'anime' || section.category === 'ova'),
    [],
  );

  return (
    <main className="home-page v18-home">
      <div id="inicio" className="home-anchor" aria-hidden="true" />
      <ExperienceHero />

      <section className="experience-shortcuts" aria-label={t('nav.sections')}>
        <a href="#catalogo"><span><Icon name="search" size={20} /></span><strong>{t('nav.catalog')}</strong><Icon name="arrow-right" size={18} /></a>
        <a href="#favoritos"><span><Icon name="heart" size={20} /></span><strong>{t('nav.list')}</strong><Icon name="arrow-right" size={18} /></a>
        <a href={calendarHref}><span><Icon name="info" size={20} /></span><strong>{t('calendar.nav')}</strong><Icon name="arrow-right" size={18} /></a>
      </section>

      <section className="experience-intro">
        <div>
          <p className="eyebrow">AniVideos</p>
          <h2>{t('home.overview.title')}</h2>
        </div>
        <p>{t('home.overview.body')}</p>
      </section>

      <div id="catalogo" className="home-anchor" aria-hidden="true" />

      {state.status === 'ready' ? (
        <>
          <CatalogExplorer items={catalog} />
          <div className="catalog-lanes">
            <FavoritesLane />
            <RecommendationsLane />
            {visibleSections.map((section) => (
              <CatalogLane key={section.id} section={section} items={filterContentByCategory(catalog, section.category)} />
            ))}
          </div>
        </>
      ) : (
        <section className="v18-catalog-fallback" aria-live="polite">
          {state.status === 'loading' ? (
            <><span className="data-state__spinner" aria-hidden="true" /><h2>{t('app.loading')}</h2></>
          ) : (
            <>
              <p className="eyebrow">{t('source.anilist')}</p>
              <h2>{t('home.loadError.title')}</h2>
              <p>{t('home.loadError.body')}</p>
              <div className="anilist-dev__actions">
                <button className="button button--primary" type="button" onClick={retry}>{t('app.retry')}</button>
                {import.meta.env.DEV && <button className="button button--secondary" type="button" onClick={() => setShowAniListDev((value) => !value)}>{showAniListDev ? t('dev.anilist.close') : t('dev.anilist.button')}</button>}
              </div>
            </>
          )}
        </section>
      )}

      {import.meta.env.DEV && showAniListDev && (
        <Suspense fallback={<section className="anilist-dev"><p>{t('dev.anilist.loading')}</p></section>}>
          <AniListDevPreview />
        </Suspense>
      )}
    </main>
  );
}
