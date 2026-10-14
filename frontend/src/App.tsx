import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { FavoritesProvider } from './context/FavoritesContext.js';
import { Navbar } from './components/Navbar.js';
import { SiteFooter } from './components/SiteFooter.js';
import { HomePage } from './pages/HomePage.js';
import { t } from './i18n/i18n.js';
import { parseRoute } from './i18n/routes.js';
import type { AppRoute } from './i18n/routes.js';
import { applyRouteMetadata } from './seo/metadata.js';

const ContentDetailPage=lazy(async()=>({default:(await import('./pages/ContentDetailPage.js')).ContentDetailPage}));
const BlogPage=lazy(async()=>({default:(await import('./pages/BlogPage.js')).BlogPage}));
const BlogArticlePage=lazy(async()=>({default:(await import('./pages/BlogArticlePage.js')).BlogArticlePage}));
const LegalPage=lazy(async()=>({default:(await import('./pages/LegalPage.js')).LegalPage}));
const CalendarPage=lazy(async()=>({default:(await import('./pages/CalendarPage.js')).CalendarPage}));

export function App(){
  const parsed=parseRoute(window.location.pathname);
  const current:AppRoute=parsed?.route??{kind:'home'};
  applyRouteMetadata(current);
  let page;
  if(current.kind==='detail')page=<ContentDetailPage contentId={current.id}/>;
  else if(current.kind==='blog')page=<BlogPage/>;
  else if(current.kind==='article')page=<BlogArticlePage slug={current.slug}/>;
  else if(current.kind==='legal')page=<LegalPage kind={current.page}/>;
  else if(current.kind==='calendar')page=<CalendarPage/>;
  else page=<HomePage/>;
  return <AuthProvider><FavoritesProvider><div className="app-shell"><Navbar/><Suspense fallback={<main className="v16-page"><p>{t('app.loading')}</p></main>}>{page}</Suspense><SiteFooter/></div></FavoritesProvider></AuthProvider>;
}
