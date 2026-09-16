import type { FeaturedBanner as FeaturedBannerModel } from '../models/banner.js';
import { Icon } from './Icon.js';

interface FeaturedBannerProps {
  banner: FeaturedBannerModel;
  position: number;
  total: number;
}

/** Presenta un banner editorial sin HTML dinámico; todo el contenido se renderiza como texto de React. */
export function FeaturedBanner({ banner, position, total }: FeaturedBannerProps) {
  return (
    <article
      className="featured-banner"
      aria-label={`${banner.title}, destacado ${position} de ${total}`}
    >
      <img
        className="featured-banner__artwork"
        src={banner.artwork}
        alt=""
        width="1600"
        height="900"
        decoding="async"
        fetchPriority="high"
      />
      <div className="featured-banner__scrim" aria-hidden="true" />

      <div className="featured-banner__content">
        <p className="featured-banner__eyebrow">{banner.eyebrow}</p>
        <p className="featured-banner__category">{banner.category}</p>
        <h1>{banner.title}</h1>

        <div className="featured-banner__metadata" aria-label="Información del título">
          <span>{banner.year}</span>
          <span className="featured-banner__rating">{banner.ageRating}</span>
          <span>{banner.format}</span>
        </div>

        <p className="featured-banner__synopsis">{banner.synopsis}</p>

        <ul className="featured-banner__genres" aria-label="Géneros">
          {banner.genres.map((genre) => <li key={genre}>{genre}</li>)}
        </ul>

        <div className="featured-banner__actions">
          <a className="button button--primary" href={banner.sectionHref}>
            <Icon name="play" size={18} />
            Explorar {banner.category}
          </a>
          <button
            className="button button--glass"
            type="button"
            disabled
            title="La página de detalles se implementará en la etapa 12"
          >
            <Icon name="info" size={19} />
            Más información
          </button>
        </div>

        <p className="featured-banner__demo-note">Título y arte ficticios para desarrollo.</p>
      </div>
    </article>
  );
}
