import { useEffect, useMemo, useState } from 'react';
import { resolveApiBaseUrl } from '../config/api.js';
import {
  defaultCatalogFilters,
  getCatalogFilterOptions,
  hasActiveCatalogFilters,
} from '../models/catalog-filters.js';
import type { CatalogFilters } from '../models/catalog-filters.js';
import type { ContentItem } from '../models/content.js';
import { getCatalog } from '../services/catalog.service.js';
import { ContentCard } from './ContentCard.js';
import { Icon } from './Icon.js';

interface CatalogExplorerProps {
  items: readonly ContentItem[];
}

type SearchState =
  | { status: 'idle'; items: ContentItem[] }
  | { status: 'loading'; items: ContentItem[] }
  | { status: 'ready'; items: ContentItem[] }
  | { status: 'error'; items: ContentItem[] };

const categoryOptions = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'anime', label: 'Anime' },
  { value: 'k-drama', label: 'K-Dramas' },
  { value: 'series', label: 'Series' },
  { value: 'movie', label: 'Películas' },
] as const;

/** Server-backed catalog explorer with debounced text search and composable filters. */
export function CatalogExplorer({ items }: CatalogExplorerProps) {
  const [filters, setFilters] = useState<CatalogFilters>(defaultCatalogFilters);
  const [state, setState] = useState<SearchState>({ status: 'idle', items: [] });
  const [reloadKey, setReloadKey] = useState(0);
  const options = useMemo(() => getCatalogFilterOptions(items), [items]);
  const active = hasActiveCatalogFilters(filters);

  useEffect(() => {
    if (!active) {
      setState({ status: 'idle', items: [] });
      return undefined;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setState((current) => ({ status: 'loading', items: current.items }));

      const baseUrl = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD);
      void getCatalog(baseUrl, controller.signal, filters)
        .then((results) => {
          if (!controller.signal.aborted) setState({ status: 'ready', items: results });
        })
        .catch(() => {
          if (!controller.signal.aborted) setState({ status: 'error', items: [] });
        });
    }, 280);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [active, filters, reloadKey]);

  function resetFilters(): void {
    setFilters(defaultCatalogFilters);
  }

  return (
    <section className="catalog-explorer" id="catalogo" aria-labelledby="catalog-explorer-title">
      <div className="catalog-explorer__header">
        <div>
          <p className="eyebrow">Buscador y filtros</p>
          <h2 id="catalog-explorer-title">Explora AniVideos a tu manera</h2>
          <p>Busca por título o género y combina categoría, año, puntuación y orden.</p>
        </div>
        <span className="catalog-explorer__total">{items.length} títulos disponibles</span>
      </div>

      <form className="catalog-filters" role="search" onSubmit={(event) => event.preventDefault()}>
        <div className="catalog-search">
          <label className="sr-only" htmlFor="catalog-search-input">Buscar título o género</label>
          <Icon name="search" size={19} />
          <input
            id="catalog-search-input"
            type="search"
            value={filters.query}
            maxLength={80}
            autoComplete="off"
            placeholder="Buscar título o género..."
            onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
          />
          {filters.query && (
            <button
              type="button"
              className="catalog-search__clear"
              aria-label="Limpiar búsqueda"
              onClick={() => setFilters((current) => ({ ...current, query: '' }))}
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>

        <label className="catalog-filter-field">
          <span>Categoría</span>
          <select
            value={filters.category}
            onChange={(event) => setFilters((current) => ({
              ...current,
              category: event.target.value as CatalogFilters['category'],
            }))}
          >
            {categoryOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
          </select>
        </label>

        <label className="catalog-filter-field">
          <span>Género</span>
          <select
            value={filters.genre}
            onChange={(event) => setFilters((current) => ({ ...current, genre: event.target.value }))}
          >
            <option value="">Todos los géneros</option>
            {options.genres.map((genre) => <option value={genre} key={genre}>{genre}</option>)}
          </select>
        </label>

        <label className="catalog-filter-field">
          <span>Año</span>
          <select
            value={filters.year ?? ''}
            onChange={(event) => setFilters((current) => ({
              ...current,
              year: event.target.value ? Number(event.target.value) : null,
            }))}
          >
            <option value="">Todos los años</option>
            {options.years.map((year) => <option value={year} key={year}>{year}</option>)}
          </select>
        </label>

        <label className="catalog-filter-field">
          <span>Puntuación</span>
          <select
            value={filters.minScore ?? ''}
            onChange={(event) => setFilters((current) => ({
              ...current,
              minScore: event.target.value ? Number(event.target.value) : null,
            }))}
          >
            <option value="">Cualquier puntuación</option>
            <option value="8">8.0 o más</option>
            <option value="8.5">8.5 o más</option>
            <option value="9">9.0 o más</option>
          </select>
        </label>

        <label className="catalog-filter-field">
          <span>Ordenar</span>
          <select
            value={filters.sort}
            onChange={(event) => setFilters((current) => ({
              ...current,
              sort: event.target.value as CatalogFilters['sort'],
            }))}
          >
            <option value="featured">Destacados</option>
            <option value="score-desc">Mayor puntuación</option>
            <option value="year-desc">Más recientes</option>
            <option value="title-asc">Título A-Z</option>
          </select>
        </label>

        <button className="catalog-filters__reset" type="button" disabled={!active} onClick={resetFilters}>
          Limpiar filtros
        </button>
      </form>

      {!active && (
        <div className="catalog-explorer__hint">
          <Icon name="search" size={21} />
          <p>Escribe una búsqueda o selecciona un filtro. Las colecciones completas continúan disponibles debajo.</p>
        </div>
      )}

      {active && (
        <div className="catalog-results" aria-live="polite" aria-busy={state.status === 'loading'}>
          <div className="catalog-results__header">
            <div>
              <p className="eyebrow">Resultados</p>
              <h3>
                {state.status === 'loading' && state.items.length === 0
                  ? 'Buscando...'
                  : `${state.items.length} ${state.items.length === 1 ? 'resultado' : 'resultados'}`}
              </h3>
            </div>
            {state.status === 'loading' && <span className="catalog-results__loading">Actualizando...</span>}
          </div>

          {state.status === 'error' && (
            <div className="catalog-results__empty" role="alert">
              <p>No fue posible consultar los filtros en este momento.</p>
              <button className="button button--secondary" type="button" onClick={() => setReloadKey((value) => value + 1)}>Reintentar</button>
            </div>
          )}

          {state.status === 'ready' && state.items.length === 0 && (
            <div className="catalog-results__empty">
              <Icon name="search" size={25} />
              <h3>No encontramos coincidencias</h3>
              <p>Prueba otra palabra o reduce la cantidad de filtros activos.</p>
            </div>
          )}

          {(state.status === 'ready' || state.status === 'loading') && state.items.length > 0 && (
            <div className="catalog-results__grid">
              {state.items.map((item) => <ContentCard item={item} key={item.id} />)}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
