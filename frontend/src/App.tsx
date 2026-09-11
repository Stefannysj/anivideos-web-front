import { ApiStatus } from './components/ApiStatus.js';

export function App() {
  return (
    <main className="shell">
      <header className="intro">
        <p className="eyebrow">Etapa 01 / Estructura inicial</p>
        <h1>Ani<span>Videos</span></h1>
        <p className="lead">La base de tu próxima plataforma de entretenimiento.</p>
        <p>Anime, K-Dramas, Series y Películas. Desarrollo paso a paso.</p>
      </header>
      <div className="panels">
        <section className="panel" aria-labelledby="frontend-title">
          <p className="eyebrow">Interfaz independiente</p>
          <h2 id="frontend-title">Frontend</h2>
          <p>React + Vite + TypeScript. Esta pantalla permite comprobar el arranque del proyecto.</p>
          <p className="status status--available">
            <span className="status-dot" aria-hidden="true" />
            Interfaz cargada
          </p>
        </section>
        <ApiStatus />
      </div>
      <footer>
        <p>Supabase, catálogo y cuentas de usuario todavía no están implementados.</p>
        <p>Próxima etapa: diseño base.</p>
      </footer>
    </main>
  );
}
