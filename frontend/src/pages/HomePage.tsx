import { CatalogLane } from '../components/CatalogLane.js';
import { FeaturedCarousel } from '../components/FeaturedCarousel.js';
import { catalog } from '../data/catalog.js';
import { featuredBanners } from '../data/featured-banners.js';
import { catalogSections, filterContentByCategory } from '../models/content.js';

/** Home de AniVideos con destacados y un catálogo ficticio organizado por categoría. */
export function HomePage() {
  return (
    <main className="home-page">
      <div id="inicio" className="home-anchor" aria-hidden="true" />
      <FeaturedCarousel banners={featuredBanners} />

      <section className="home-overview" aria-labelledby="overview-title">
        <div className="home-overview__heading">
          <p className="eyebrow">Explora el catálogo</p>
          <h2 id="overview-title">Encuentra tu próxima historia</h2>
        </div>
        <p>
          Esta primera versión del catálogo utiliza títulos ficticios y arte local. Las tarjetas ya son reutilizables y están preparadas para conectarse a datos reales en las siguientes etapas.
        </p>
      </section>

      <div className="catalog-lanes">
        {catalogSections.map((section) => (
          <CatalogLane
            key={section.id}
            section={section}
            items={filterContentByCategory(catalog, section.category)}
          />
        ))}
      </div>
    </main>
  );
}
