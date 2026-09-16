import type { ContentItem } from '../models/content.js';

interface ContentCardProps {
  item: ContentItem;
}

/** Tarjeta reutilizable del catálogo. Las acciones de detalle y favoritos se incorporarán en etapas posteriores. */
export function ContentCard({ item }: ContentCardProps) {
  return (
    <article className="content-card">
      <div className="content-card__poster">
        <img
          src={item.artwork}
          alt={`Arte promocional ficticio de ${item.title}`}
          loading="lazy"
          decoding="async"
          width="720"
          height="960"
        />
        <div className="content-card__shade" aria-hidden="true" />

        <div className="content-card__topline">
          <span className="content-card__category">{item.categoryLabel}</span>
          <span className="content-card__score" aria-label={`Puntuación ${item.score} de 10`}>
            <span aria-hidden="true">★</span> {item.score.toFixed(1)}
          </span>
        </div>

        <div className="content-card__overlay">
          <div className="content-card__meta">
            <span>{item.year}</span>
            <span>{item.maturity}</span>
            <span>{item.format}</span>
          </div>
          <ul className="content-card__genres" aria-label="Géneros">
            {item.genres.slice(0, 2).map((genre) => <li key={genre}>{genre}</li>)}
          </ul>
        </div>
      </div>

      <div className="content-card__body">
        <h3>{item.title}</h3>
        <p>{item.genres.join(' · ')}</p>
      </div>
    </article>
  );
}
