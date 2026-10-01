import { AuthProvider } from './context/AuthContext.js';
import { FavoritesProvider } from './context/FavoritesContext.js';
import { Navbar } from './components/Navbar.js';
import { SiteFooter } from './components/SiteFooter.js';
import { ContentDetailPage } from './pages/ContentDetailPage.js';
import { HomePage } from './pages/HomePage.js';

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
          {contentId ? <ContentDetailPage contentId={contentId} /> : <HomePage />}
          <SiteFooter />
        </div>
      </FavoritesProvider>
    </AuthProvider>
  );
}
