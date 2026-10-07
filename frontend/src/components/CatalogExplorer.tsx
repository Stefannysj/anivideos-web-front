import { useEffect, useMemo, useState } from 'react';
import { t } from '../i18n/i18n.js';
import { resolveApiBaseUrl } from '../config/api.js';
import { defaultCatalogFilters, getCatalogFilterOptions, hasActiveCatalogFilters } from '../models/catalog-filters.js';
import type { CatalogFilters } from '../models/catalog-filters.js';
import type { ContentItem } from '../models/content.js';
import { getCatalog } from '../services/catalog.service.js';
import { getSearchSuggestions } from '../services/search.service.js';
import { ContentCard } from './ContentCard.js';
import { Icon } from './Icon.js';

interface Props { items: readonly ContentItem[]; }
type SearchState = { status: 'idle'|'loading'|'ready'|'error'; items: ContentItem[] };

const categories: Array<{value: CatalogFilters['category']; label: string}> = [
  { value: 'all', label: t('catalog.option.allCategories') },
  { value: 'anime', label: t('category.anime') },
  { value: 'k-drama', label: t('category.k-drama') },
  { value: 'j-drama', label: t('category.j-drama') },
  { value: 'donghua', label: t('category.donghua') },
  { value: 'movie', label: t('category.movie') },
  { value: 'ova', label: t('category.ova') },
];

export function CatalogExplorer({ items }: Props) {
  const [filters, setFilters] = useState<CatalogFilters>(defaultCatalogFilters);
  const [state, setState] = useState<SearchState>({ status: 'idle', items: [] });
  const [suggestions, setSuggestions] = useState<ContentItem[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const options = useMemo(() => getCatalogFilterOptions(items), [items]);
  const active = hasActiveCatalogFilters(filters);
  const baseUrl = useMemo(() => resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD), []);

  useEffect(() => {
    const query = filters.query.trim();
    if (query.length < 2) { setSuggestions([]); setSuggestionsOpen(false); return; }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      void getSearchSuggestions(baseUrl, query, controller.signal)
        .then((result) => { if (!controller.signal.aborted) { setSuggestions(result); setSuggestionsOpen(true); } })
        .catch(() => { if (!controller.signal.aborted) { setSuggestions([]); setSuggestionsOpen(false); } });
    }, 180);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [baseUrl, filters.query]);

  useEffect(() => {
    if (!active) { setState({ status: 'idle', items: [] }); return; }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setState((current) => ({ status: 'loading', items: current.items }));
      void getCatalog(baseUrl, controller.signal, filters)
        .then((results) => { if (!controller.signal.aborted) setState({ status: 'ready', items: results }); })
        .catch(() => { if (!controller.signal.aborted) setState({ status: 'error', items: [] }); });
    }, 280);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [active, baseUrl, filters, reloadKey]);

  const select = <K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <section className="catalog-explorer" id="catalogo" aria-labelledby="catalog-explorer-title">
      <div className="catalog-explorer__header"><div><p className="eyebrow">{t('catalog.search.eyebrow')}</p><h2 id="catalog-explorer-title">{t('catalog.search.title')}</h2><p>{t('catalog.search.body')}</p></div><span className="catalog-explorer__total">{items.length}</span></div>
      <form className="catalog-filters v16-catalog-filters" role="search" onSubmit={(e)=>e.preventDefault()}>
        <div className="v17-search-wrap">
          <div className="catalog-search"><Icon name="search" size={19}/><input type="search" value={filters.query} maxLength={80} autoComplete="off" placeholder={t('catalog.search.placeholder')} onFocus={()=>{ if (suggestions.length) setSuggestionsOpen(true); }} onBlur={()=>window.setTimeout(()=>setSuggestionsOpen(false),120)} onChange={(e)=>select('query', e.target.value)} />{filters.query && <button type="button" className="catalog-search__clear" aria-label={t('catalog.search.clear')} onClick={()=>select('query','')}><Icon name="close" size={16}/></button>}</div>
          {suggestionsOpen && <div className="v17-suggestions" role="listbox" aria-label={t('search.suggestions')}>
            {suggestions.length === 0 ? <p>{t('search.autocomplete.empty')}</p> : suggestions.map((item)=><button type="button" role="option" key={item.id} onMouseDown={(event)=>event.preventDefault()} onClick={()=>{select('query',item.title);setSuggestionsOpen(false);}}><img src={item.artwork} alt="" loading="lazy"/><span><strong>{item.title}</strong><small>{item.categoryLabel} · {item.year ?? '—'} · ★ {item.score.toFixed(1)}</small></span></button>)}
          </div>}
        </div>
        <label className="catalog-filter-field"><span>{t('catalog.filter.category')}</span><select value={filters.category} onChange={(e)=>select('category', e.target.value as CatalogFilters['category'])}>{categories.map((x)=><option key={x.value} value={x.value}>{x.label}</option>)}</select></label>
        <label className="catalog-filter-field"><span>{t('catalog.filter.genre')}</span><select value={filters.genre} onChange={(e)=>select('genre', e.target.value)}><option value="">{t('catalog.option.allGenres')}</option>{options.genres.map((x)=><option key={x}>{x}</option>)}</select></label>
        <label className="catalog-filter-field"><span>{t('catalog.filter.year')}</span><select value={filters.year ?? ''} onChange={(e)=>select('year', e.target.value ? Number(e.target.value) : null)}><option value="">{t('catalog.option.allYears')}</option>{options.years.map((x)=><option key={x} value={x}>{x}</option>)}</select></label>
        <label className="catalog-filter-field"><span>{t('catalog.filter.status')}</span><select value={filters.status} onChange={(e)=>select('status', e.target.value)}><option value="">{t('catalog.option.allStatuses')}</option>{options.statuses.map((x)=><option key={x}>{x}</option>)}</select></label>
        <label className="catalog-filter-field"><span>{t('catalog.filter.format')}</span><select value={filters.format} onChange={(e)=>select('format', e.target.value)}><option value="">{t('catalog.option.allFormats')}</option>{options.formats.map((x)=><option key={x}>{x}</option>)}</select></label>
        <label className="catalog-filter-field"><span>{t('catalog.filter.score')}</span><select value={filters.minScore ?? ''} onChange={(e)=>select('minScore', e.target.value ? Number(e.target.value) : null)}><option value="">{t('catalog.option.anyScore')}</option><option value="8">8.0+</option><option value="8.5">8.5+</option><option value="9">9.0+</option></select></label>
        <label className="catalog-filter-field"><span>{t('catalog.filter.sort')}</span><select value={filters.sort} onChange={(e)=>select('sort', e.target.value as CatalogFilters['sort'])}><option value="featured">{t('catalog.sort.featured')}</option><option value="score-desc">{t('catalog.sort.score')}</option><option value="year-desc">{t('catalog.sort.year')}</option><option value="title-asc">{t('catalog.sort.title')}</option></select></label>
        <button className="catalog-filters__reset" type="button" disabled={!active} onClick={()=>setFilters(defaultCatalogFilters)}>{t('catalog.filter.reset')}</button>
      </form>
      {!active && <div className="catalog-explorer__hint"><Icon name="search" size={21}/><p>{t('catalog.hint')}</p></div>}
      {active && <div className="catalog-results" aria-live="polite" aria-busy={state.status==='loading'}>
        <div className="catalog-results__header"><div><p className="eyebrow">{t('catalog.results')}</p><h3>{state.items.length}</h3></div></div>
        {state.status==='error' && <div className="catalog-results__empty" role="alert"><p>{t('catalog.error')}</p><button className="button button--secondary" type="button" onClick={()=>setReloadKey((v)=>v+1)}>{t('app.retry')}</button></div>}
        {state.status==='ready' && state.items.length===0 && <div className="catalog-results__empty"><h3>{t('catalog.noResults')}</h3></div>}
        {(state.status==='ready'||state.status==='loading') && state.items.length>0 && <div className="catalog-results__grid">{state.items.map((item)=><ContentCard item={item} key={item.id}/>)}</div>}
      </div>}
    </section>
  );
}
