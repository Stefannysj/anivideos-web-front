import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Icon.js';
import { resolveApiBaseUrl } from '../config/api.js';
import { useAuth } from '../context/AuthContext.js';
import { useFavorites } from '../context/FavoritesContext.js';
import type { ContentDetail } from '../models/content.js';
import { getContentDetail } from '../services/catalog.service.js';

interface ContentDetailPageProps {
  contentId: string;
}

type DetailState =
  | { status: 'loading' }
  | { status: 'ready'; item: ContentDetail }
  | { status: 'error'; message: string };

/** Public detail view backed by one SQL catalog record. */
export function ContentDetailPage({ contentId }: ContentDetailPageProps) {
  const [state, setState] = useState<DetailState>({ status: 'loading' });
  const { status: authStatus } = useAuth();
  const { isFavorite, isBusy, toggleFavorite } = useFavorites();
  const baseUrl = useMemo(
    () => resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD),
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    void getContentDetail(baseUrl, contentId, controller.signal)
      .then((item) => {
        if (!controller.signal.aborted) {
          document.title = `${item.title} | AniVideos`;
          setState({ status: 'ready', item });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'No fue posible cargar este titulo.',
          });
        }
      });

    return () => {
      controller.abort();
      document.title = 'AniVideos';
    };
  }, [baseUrl, contentId]);

  if (state.status === 'loading') {
    return (
      <main className="content-detail-page">
        <section className="data-state" aria-live="polite">
          <span className="data-state__spinner" aria-hidden="true" />
          <p>Cargando detalles...</p>
        </section>
      </main>
    );
  }

  if (state.status === 'error') {
    return (
      <main className="content-detail-page">
        <section className="data-state data-state--error" role="alert">
          <p className="eyebrow">Detalle no disponible</p>
          <h1>No pudimos abrir este titulo</h1>
          <p>{state.message}</p>
          <a className="button button--primary" href="/">Volver al catalogo</a>
        </section>
      </main>
    );
  }

  const { item } = state;
  const favorite = isFavorite(item.id);
  const busy = isBusy(item.id);
  const canFavorite = authStatus === 'authenticated';

  return (
    <main className="content-detail-page">
      <nav className="content-detail__breadcrumb" aria-label="Ruta de navegacion">
        <a href="/"><Icon name="chevron-left" size={17} /> Volver al catalogo</a>
        <span aria-hidden="true">/</span>
        <span>{item.categoryLabel}</span>
      </nav>

      <article className="content-detail">
        <div className="content-detail__poster">
          <img
            src={item.artwork}
            alt={`Arte promocional ficticio de ${item.title}`}
            width="720"
            height="960"
            decoding="async"
          />
        </div>

        <div className="content-detail__content">
          <div className="content-detail__heading">
            <p className="eyebrow">{item.categoryLabel} &middot; Ficha de contenido</p>
            <h1>{item.title}</h1>
            <div className="content-detail__meta" aria-label="Datos principales">
              <span>{item.year}</span>
              <span>{item.maturity}</span>
              <span>{item.format}</span>
              <span className="content-detail__score"><span aria-hidden="true">&#9733;</span> {item.score.toFixed(1)}</span>
            </div>
          </div>

          <p className="content-detail__synopsis">{item.synopsis}</p>

          <ul className="content-detail__genres" aria-label="Generos">
            {item.genres.map((genre) => <li key={genre}>{genre}</li>)}
          </ul>

          <dl className="content-detail__facts">
            <div><dt>Origen</dt><dd>{item.origin}</dd></div>
            <div><dt>Estado</dt><dd>{item.status}</dd></div>
            <div><dt>Formato</dt><dd>{item.format}</dd></div>
            <div><dt>Clasificacion</dt><dd>{item.maturity}</dd></div>
          </dl>

          <div className="content-detail__actions">
            <button
              className={favorite ? 'button button--primary content-detail__favorite content-detail__favorite--active' : 'button button--secondary content-detail__favorite'}
              type="button"
              disabled={!canFavorite || busy}
              aria-pressed={canFavorite ? favorite : undefined}
              title={canFavorite ? undefined : 'Inicia sesion para guardar este titulo'}
              onClick={() => void toggleFavorite(item)}
            >
              <Icon name="heart" size={19} />
              {busy ? 'Actualizando...' : favorite ? 'Guardado en Mi lista' : 'Agregar a Mi lista'}
            </button>
            <a className="button button--glass" href={`/#${item.category === 'k-drama' ? 'k-dramas' : item.category === 'movie' ? 'peliculas' : item.category}`}>
              Ver mas de {item.categoryLabel}
            </a>
          </div>

          {!canFavorite && <p className="content-detail__note">Inicia sesion para guardar este titulo. Los datos y el arte son ficticios y se usan solo para desarrollo.</p>}
          {canFavorite && <p className="content-detail__note">Datos y arte ficticios para desarrollo. AniVideos no distribuye contenido protegido desde esta ficha.</p>}
        </div>
      </article>
    </main>
  );
}
