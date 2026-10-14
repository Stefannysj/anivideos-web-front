import { useMemo, useState } from 'react';
import { t } from '../i18n/i18n.js';
import { useAuth } from '../context/AuthContext.js';
import { useFavorites } from '../context/FavoritesContext.js';
import type { ProgressStatus } from '../models/library.js';
import type { TranslationKey } from '../i18n/translations.js';
import { ContentCard } from './ContentCard.js';
import { Icon } from './Icon.js';
type Tab='favorites'|ProgressStatus;
const tabs:Array<{id:Tab;key:TranslationKey}>=[{id:'favorites',key:'library.tab.favorites'},{id:'watching',key:'library.tab.watching'},{id:'completed',key:'library.tab.completed'},{id:'planned',key:'library.tab.planned'}];
export function FavoritesLane(){const {status:authStatus}=useAuth();const {status,entries,error,refresh}=useFavorites();const [tab,setTab]=useState<Tab>('favorites');const visible=useMemo(()=>entries.filter((entry)=>tab==='favorites'?entry.isFavorite:entry.progressStatus===tab),[entries,tab]);if(authStatus!=='authenticated')return null;return <section className="v17-library" id="favoritos" aria-labelledby="v17-library-title"><div className="v17-library__header"><div><p className="eyebrow">{t('library.eyebrow')}</p><h2 id="v17-library-title">{t('library.title')}</h2></div><div className="v17-library__tabs" role="tablist">{tabs.map((item)=><button key={item.id} type="button" role="tab" aria-selected={tab===item.id} className={tab===item.id?'is-active':''} onClick={()=>setTab(item.id)}>{t(item.key)}</button>)}</div></div>{(status==='loading'||status==='idle')&&<div className="favorites-state"><span className="data-state__spinner" aria-hidden="true"/></div>}{status==='error'&&<div className="favorites-state favorites-state--error" role="alert"><Icon name="heart" size={22}/><p>{error}</p><button className="button button--secondary" type="button" onClick={()=>void refresh()}>{t('app.retry')}</button></div>}{status==='ready'&&visible.length===0&&<div className="favorites-empty"><p>{t('library.empty')}</p></div>}{visible.length>0&&<div className="catalog-results__grid">{visible.map((entry)=><ContentCard item={entry.content} key={entry.content.id}/>)}</div>}</section>;}
