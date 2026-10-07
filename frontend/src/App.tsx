import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { FavoritesProvider } from './context/FavoritesContext.js';
import { Navbar } from './components/Navbar.js';
import { SiteFooter } from './components/SiteFooter.js';
import { HomePage } from './pages/HomePage.js';
import { t } from './i18n/i18n.js';

const ContentDetailPage=lazy(async()=>({default:(await import('./pages/ContentDetailPage.js')).ContentDetailPage}));
const BlogPage=lazy(async()=>({default:(await import('./pages/BlogPage.js')).BlogPage}));
const BlogArticlePage=lazy(async()=>({default:(await import('./pages/BlogArticlePage.js')).BlogArticlePage}));
const LegalPage=lazy(async()=>({default:(await import('./pages/LegalPage.js')).LegalPage}));

type Route={kind:'home'}|{kind:'detail';id:string}|{kind:'blog'}|{kind:'article';slug:string}|{kind:'legal';page:'terms'|'privacy'|'dmca'};
function route(path:string):Route{let m=/^\/contenido\/([a-z0-9-]{1,120})\/?$/.exec(path);if(m)return{kind:'detail',id:m[1]};m=/^\/blog\/([a-z0-9-]{1,120})\/?$/.exec(path);if(m)return{kind:'article',slug:m[1]};if(/^\/blog\/?$/.test(path))return{kind:'blog'};if(/^\/terminos\/?$/.test(path))return{kind:'legal',page:'terms'};if(/^\/privacidad\/?$/.test(path))return{kind:'legal',page:'privacy'};if(/^\/dmca\/?$/.test(path))return{kind:'legal',page:'dmca'};return{kind:'home'};}

export function App(){const current=route(window.location.pathname);let page;if(current.kind==='detail')page=<ContentDetailPage contentId={current.id}/>;else if(current.kind==='blog')page=<BlogPage/>;else if(current.kind==='article')page=<BlogArticlePage slug={current.slug}/>;else if(current.kind==='legal')page=<LegalPage kind={current.page}/>;else page=<HomePage/>;return <AuthProvider><FavoritesProvider><div className="app-shell"><Navbar/><Suspense fallback={<main className="v16-page"><p>{t('app.loading')}</p></main>}>{page}</Suspense><SiteFooter/></div></FavoritesProvider></AuthProvider>;}
