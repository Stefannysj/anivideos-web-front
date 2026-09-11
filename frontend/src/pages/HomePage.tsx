import { HomeLane } from '../components/HomeLane.js';
import { Icon } from '../components/Icon.js';

const homeLanes = [
  {
    id: 'anime',
    eyebrow: 'Animación japonesa',
    title: 'Anime',
    description: 'Espacio preparado para estrenos, temporadas y títulos destacados.',
    variant: 1,
  },
  {
    id: 'k-dramas',
    eyebrow: 'Historias de Corea',
    title: 'K-Dramas',
    description: 'Sección destinada a romance, thriller, comedia y producciones coreanas.',
    variant: 2,
  },
  {
    id: 'series',
    eyebrow: 'Para maratonear',
    title: 'Series',
    description: 'Una zona flexible para organizar series por género, popularidad y novedades.',
    variant: 3,
  },
  {
    id: 'peliculas',
    eyebrow: 'Pantalla grande',
    title: 'Películas',
    description: 'Preparado para largometrajes, colecciones y futuros filtros del catálogo.',
    variant: 4,
  },
] as const;

/** Página inicial de AniVideos. En esta etapa define jerarquía y navegación sin cargar aún catálogo real. */
export function HomePage() {
  return (
    <main className="home-page">
      <section className="home-intro" id="inicio" aria-labelledby="home-title">
        <div className="home-intro__copy">
          <p className="eyebrow">Tu entretenimiento, organizado</p>
          <h1 id="home-title">
            Encuentra tu próxima
            <span> historia favorita.</span>
          </h1>
          <p className="home-intro__lead">
            AniVideos reúne una experiencia pensada para descubrir Anime, K-Dramas, Series y Películas desde cualquier dispositivo.
          </p>
          <div className="home-intro__actions">
            <a className="button button--primary" href="#anime">
              Explorar secciones
              <Icon name="arrow-right" size={19} />
            </a>
            <span className="stage-pill">Etapa 03</span>
          </div>
        </div>

        <div className="home-intro__visual" aria-hidden="true">
          <div className="screen-mockup">
            <div className="screen-mockup__topbar">
              <span className="screen-mockup__brand">A</span>
              <span />
              <span />
              <span />
            </div>
            <div className="screen-mockup__hero">
              <span className="screen-mockup__badge">PRÓXIMAMENTE</span>
              <span className="screen-mockup__title" />
              <span className="screen-mockup__copy" />
              <span className="screen-mockup__button" />
            </div>
            <div className="screen-mockup__rail">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="home-intro__orb home-intro__orb--one" />
          <div className="home-intro__orb home-intro__orb--two" />
        </div>
      </section>

      <section className="home-overview" aria-labelledby="overview-title">
        <div className="home-overview__heading">
          <p className="eyebrow">Inicio organizado</p>
          <h2 id="overview-title">Una portada preparada para crecer</h2>
        </div>
        <p>
          Esta etapa establece el Home y la navegación. Los banners, tarjetas y datos del catálogo se incorporarán en las siguientes fases.
        </p>
      </section>

      <div className="home-lanes">
        {homeLanes.map((lane) => (
          <HomeLane {...lane} key={lane.id} />
        ))}
      </div>
    </main>
  );
}
