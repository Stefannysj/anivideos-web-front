import { ApiStatus } from './ApiStatus.js';
import { Brand } from './Brand.js';

/** Pie del sitio con información mínima del producto y una comprobación técnica discreta para desarrollo. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <Brand compact />
        <p>Anime, K-Dramas, Series y Películas. Plataforma en desarrollo.</p>
        <span>Etapa 06 · Python + SQL</span>
      </div>

      <details className="technical-panel">
        <summary>Estado técnico</summary>
        <ApiStatus />
      </details>
    </footer>
  );
}
