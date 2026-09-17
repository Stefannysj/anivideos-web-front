import { useCallback, useEffect, useState } from 'react';
import { CatalogLane } from '../components/CatalogLane.js';
import { FeaturedCarousel } from '../components/FeaturedCarousel.js';
import { resolveApiBaseUrl } from '../config/api.js';
import type { FeaturedBanner } from '../models/banner.js';
import type { ContentItem } from '../models/content.js';
import { catalogSections, filterContentByCategory } from '../models/content.js';
import { getBanners } from '../services/banner.service.js';
import { getCatalog } from '../services/catalog.service.js';

type HomeDataState =
  | { status: 'loading' }
  | { status: 'ready'; banners: FeaturedBanner[]; catalog: ContentItem[] }
  | { status: 'error' };

/** Home backed by the Python API and SQL catalog introduced in stage 06. */
export function HomePage() {
  const [state, setState] = useState<HomeDataState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);
  const retry = useCallback(() => setReloadKey((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    async function loadHome(): Promise<void> {
      try {
        const baseUrl = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD);
        const [banners, catalog] = await Promise.all([
          getBanners(baseUrl, controller.signal),
          getCatalog(baseUrl, controller.signal),
        ]);
        if (!controller.signal.aborted) setState({ status: 'ready', banners, catalog });
      } catch {
        if (!controller.signal.aborted) setState({ status: 'error' });
      }
    }

    void loadHome();
    return () => controller.abort();
  }, [reloadKey]);

  if (state.status === 'loading') {
    return (
      <main className="home-page">
        <section className="data-state" aria-live="polite">
          <span className="data-state__spinner" aria-hidden="true" />
          <p>Cargando catálogo desde AniVideos API...</p>
        </section>
      </main>
    );
  }

  if (state.status === 'error') {
    return (
      <main className="home-page">
        <section className="data-state data-state--error" role="alert">
          <p className="eyebrow">Conexión requerida</p>
          <h1>No fue posible cargar AniVideos</h1>
          <p>Verifica que el backend Python este iniciado en el puerto 3001.</p>
          <button className="button button--primary" type="button" onClick={retry}>Reintentar</button>
        </section>
      </main>
    );
  }

  return (
    <main className="home-page">
      <div id="inicio" className="home-anchor" aria-hidden="true" />
      <FeaturedCarousel banners={state.banners} />

      <section className="home-overview" aria-labelledby="overview-title">
        <div className="home-overview__heading">
          <p className="eyebrow">Explora el catálogo</p>
          <h2 id="overview-title">Encuentra tu próxima historia</h2>
        </div>
        <p>
          El catálogo y los banners ahora se consultan desde una base SQL mediante la API Python. El arte permanece local en el frontend.
        </p>
      </section>

      <div className="catalog-lanes">
        {catalogSections.map((section) => (
          <CatalogLane
            key={section.id}
            section={section}
            items={filterContentByCategory(state.catalog, section.category)}
          />
        ))}
      </div>
    </main>
  );
}
