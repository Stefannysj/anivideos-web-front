import { useEffect, useMemo, useState } from 'react';
import { resolveApiBaseUrl } from '../config/api.js';
import { useAuth } from '../context/AuthContext.js';
import { useFavorites } from '../context/FavoritesContext.js';
import { t } from '../i18n/i18n.js';
import type { ContentItem } from '../models/content.js';
import { getRecommendations } from '../services/recommendation.service.js';
import { ContentCard } from './ContentCard.js';

export function RecommendationsLane() {
  const { status: authStatus } = useAuth();
  const { entries } = useFavorites();
  const [items, setItems] = useState<ContentItem[]>([]);
  const baseUrl = useMemo(()=>resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD),[]);
  useEffect(()=>{
    if(authStatus!=='authenticated'){setItems([]);return;}
    const controller=new AbortController();
    void getRecommendations(baseUrl,controller.signal).then((result)=>{if(!controller.signal.aborted)setItems(result);}).catch(()=>{if(!controller.signal.aborted)setItems([]);});
    return()=>controller.abort();
  },[authStatus,baseUrl,entries]);
  if(authStatus!=='authenticated')return null;
  return <section className="catalog-lane v17-recommendations"><div className="catalog-lane__header"><div className="catalog-lane__heading"><p className="eyebrow">{t('recommendations.eyebrow')}</p><h2>{t('recommendations.title')}</h2></div></div>{items.length===0?<div className="favorites-empty"><p>{t('recommendations.empty')}</p></div>:<div className="catalog-results__grid">{items.map((item)=><ContentCard item={item} key={item.id}/>)}</div>}</section>;
}
