import { useAuth } from '../context/AuthContext.js';
import { useFavorites } from '../context/FavoritesContext.js';
import type { ContentItem } from '../models/content.js';
import { Icon } from './Icon.js';

interface ContentCardProps {
  item: ContentItem;
}

/** Reusable catalog card with account-backed favorite state. */
export function ContentCard({ item }: ContentCardProps) {
  const { status: authStatus } = useAuth();
  const { isFavorite, isBusy, toggleFavorite } = useFavorites();
  const favorite = isFavorite(item.id);
  const busy = isBusy(item.id);
  const canFavorite = authStatus === 'authenticated';
  const favoriteLabel = favorite ? `Quitar ${item.title} de Mi lista` : `Agregar ${item.title} a Mi lista`;

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

        <button
          className={favorite ? 'content-card__favorite content-card__favorite--active' : 'content-card__favorite'}
          type="button"
          aria-label={canFavorite ? favoriteLabel : 'Inicia sesión para guardar favoritos'}
          aria-pressed={canFavorite ? favorite : undefined}
          title={canFavorite ? favoriteLabel : 'Inicia sesión para guardar este título'}
          disabled={!canFavorite || busy}
          onClick={() => void toggleFavorite(item)}
        >
          <Icon name="heart" size={18} />
        </button>

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
