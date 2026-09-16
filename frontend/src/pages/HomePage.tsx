import { FeaturedCarousel } from '../components/FeaturedCarousel.js';
import { HomeLane } from '../components/HomeLane.js';
import { featuredBanners } from '../data/featured-banners.js';

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

/** Home de AniVideos con banners destacados y espacios preparados para las próximas tarjetas del catálogo. */
export function HomePage() {
  return (
    <main className="home-page">
      <div id="inicio" className="home-anchor" aria-hidden="true" />
      <FeaturedCarousel banners={featuredBanners} />

      <section className="home-overview" aria-labelledby="overview-title">
        <div className="home-overview__heading">
          <p className="eyebrow">Explora por categoría</p>
          <h2 id="overview-title">Historias para cada momento</h2>
        </div>
        <p>
          Los banners destacados ya forman parte del Home. En la siguiente etapa estas secciones incorporarán tarjetas de contenido reutilizables.
        </p>
      </section>

      <div className="home-lanes">
        {homeLanes.map((lane) => <HomeLane {...lane} key={lane.id} />)}
      </div>
    </main>
  );
}
