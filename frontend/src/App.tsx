import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { FavoritesProvider } from './context/FavoritesContext.js';
import { Navbar } from './components/Navbar.js';
import { SiteFooter } from './components/SiteFooter.js';
import { HomePage } from './pages/HomePage.js';

const ContentDetailPage = lazy(async () => {
  const module = await import('./pages/ContentDetailPage.js');
  return { default: module.ContentDetailPage };
});

function detailIdFromPath(pathname: string): string | null {
  const match = /^\/contenido\/([a-z0-9-]{1,80})\/?$/.exec(pathname);
  return match?.[1] ?? null;
}

export function App() {
  const contentId = detailIdFromPath(window.location.pathname);

  return (
    <AuthProvider>
      <FavoritesProvider>
        <div className="app-shell">
          <Navbar />
          {contentId ? (
            <Suspense fallback={<main className="content-detail-page"><section className="data-state" aria-live="polite"><span className="data-state__spinner" aria-hidden="true" /><p>Cargando ficha...</p></section></main>}>
              <ContentDetailPage contentId={contentId} />
            </Suspense>
          ) : <HomePage />}
          <SiteFooter />
        </div>
      </FavoritesProvider>
    </AuthProvider>
  );
}
