import { ApiStatus } from './components/ApiStatus.js';
import { Brand } from './components/Brand.js';
import { FoundationPanel } from './components/FoundationPanel.js';

const categories = ['Anime', 'K-Dramas', 'Series', 'Películas'] as const;

export function App() {
  return (
    <main className="app-shell">
      <section className="foundation-hero" aria-labelledby="page-title">
        <div className="foundation-hero__copy">
          <p className="eyebrow">Etapa 02 / Diseño base</p>
          <h1 id="page-title" className="sr-only">AniVideos</h1>
          <Brand />
          <p className="lead">
            Una base visual oscura, adaptable y preparada para construir la experiencia de entretenimiento.
          </p>
          <div className="category-list" aria-label="Categorías previstas">
            {categories.map((category) => (
              <span className="category-chip" key={category}>{category}</span>
            ))}
          </div>
        </div>

        <div className="foundation-hero__visual" aria-hidden="true">
          <div className="visual-orb visual-orb--one" />
          <div className="visual-orb visual-orb--two" />
          <div className="visual-frame">
            <span className="visual-frame__tag">AniVideos UI</span>
            <div className="visual-frame__line visual-frame__line--wide" />
            <div className="visual-frame__line" />
            <div className="visual-frame__actions">
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      <section className="foundation-grid" aria-label="Estado de la base del proyecto">
        <FoundationPanel
          eyebrow="Sistema visual"
          title="Frontend preparado"
          description="Variables de diseño, tipografía fluida, superficies, controles y espaciado responsive sin dependencias visuales externas."
        >
          <div className="status status--available">
            <span className="status-dot" aria-hidden="true" />
            Base visual cargada
          </div>
        </FoundationPanel>

        <ApiStatus />
      </section>

      <section className="foundation-notes" aria-label="Principios del diseño">
        <div>
          <span className="foundation-notes__number">01</span>
          <p>Desktop, tablet y móvil desde la misma estructura.</p>
        </div>
        <div>
          <span className="foundation-notes__number">02</span>
          <p>Contraste, foco visible y movimiento reducido cuando el sistema lo solicita.</p>
        </div>
        <div>
          <span className="foundation-notes__number">03</span>
          <p>Sin scroll horizontal y con componentes preparados para crecer.</p>
        </div>
      </section>

      <footer className="app-footer">
        <p>Supabase y las funciones de usuario siguen pendientes.</p>
        <p>Siguiente etapa: Home y Navbar.</p>
      </footer>
    </main>
  );
}
