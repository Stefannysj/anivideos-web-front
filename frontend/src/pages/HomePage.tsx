import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { t } from '../i18n/i18n.js';
import { CatalogExplorer } from '../components/CatalogExplorer.js';
import { CatalogLane } from '../components/CatalogLane.js';
import { FeaturedCarousel } from '../components/FeaturedCarousel.js';
import { FavoritesLane } from '../components/FavoritesLane.js';
import { RecommendationsLane } from '../components/RecommendationsLane.js';
import { resolveApiBaseUrl } from '../config/api.js';
import type { FeaturedBanner } from '../models/banner.js';
import type { ContentItem } from '../models/content.js';
import { catalogSections, filterContentByCategory } from '../models/content.js';
import { getBanners } from '../services/banner.service.js';
import { getCatalog } from '../services/catalog.service.js';

type State = {status:'loading'}|{status:'error'}|{status:'ready';banners:FeaturedBanner[];catalog:ContentItem[]};

const AniListDevPreview = lazy(async () => {
  const module = await import('../components/AniListDevPreview.js');
  return { default: module.AniListDevPreview };
});

export function HomePage() {
  const [state,setState]=useState<State>({status:'loading'}); const [reloadKey,setReloadKey]=useState(0); const [showAniListDev,setShowAniListDev]=useState(false); const retry=useCallback(()=>setReloadKey(v=>v+1),[]);
  useEffect(()=>{ const controller=new AbortController(); setState({status:'loading'}); const baseUrl=resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL,import.meta.env.PROD); void Promise.all([getBanners(baseUrl,controller.signal),getCatalog(baseUrl,controller.signal)]).then(([banners,catalog])=>{if(!controller.signal.aborted)setState({status:'ready',banners,catalog});}).catch(()=>{if(!controller.signal.aborted)setState({status:'error'});}); return()=>controller.abort();},[reloadKey]);
  if(state.status==='loading') return <main className="home-page"><section className="data-state"><span className="data-state__spinner"/><p>{t('app.loading')}</p></section></main>;
  if(state.status==='error') return <main className="home-page"><section className="data-state data-state--error"><h1>{t('home.loadError.title')}</h1><p>{t('home.loadError.body')}</p><div className="anilist-dev__actions"><button className="button button--primary" onClick={retry}>{t('app.retry')}</button>{import.meta.env.DEV&&<button className="button button--secondary" type="button" onClick={()=>setShowAniListDev(value=>!value)}>{showAniListDev?t('dev.anilist.close'):t('dev.anilist.button')}</button>}</div></section>{import.meta.env.DEV&&showAniListDev&&<Suspense fallback={<section className="anilist-dev"><p>{t('dev.anilist.loading')}</p></section>}><AniListDevPreview/></Suspense>}</main>;
  return <main className="home-page"><div id="inicio" className="home-anchor" aria-hidden="true"/>{state.banners.length>0&&<FeaturedCarousel banners={state.banners}/>}<section className="home-overview"><div className="home-overview__heading"><p className="eyebrow">{t('home.overview.eyebrow')}</p><h2>{t('home.overview.title')}</h2></div><p>{t('home.overview.body')}</p></section><CatalogExplorer items={state.catalog}/><div className="catalog-lanes"><FavoritesLane/><RecommendationsLane/>{catalogSections.map((section)=><CatalogLane key={section.id} section={section} items={filterContentByCategory(state.catalog,section.category)}/>)}</div></main>;
}
