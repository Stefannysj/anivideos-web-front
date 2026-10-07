import { memo } from 'react';
import type { ContentItem } from '../models/content.js';
import { useAuth } from '../context/AuthContext.js';
import { useFavorites } from '../context/FavoritesContext.js';
import { Icon } from './Icon.js';

interface Props { item: ContentItem; }

export const ContentCard = memo(function ContentCard({ item }: Props) {
  const { status } = useAuth();
  const { isFavorite, isBusy, toggleFavorite } = useFavorites();
  const favorite = isFavorite(item.id);
  const busy = isBusy(item.id);
  return (
    <article className="content-card">
      <div className="content-card__poster">
        <img src={item.artwork} alt={`Portada de ${item.title}`} loading="lazy" decoding="async" width="500" height="750" />
        <a className="content-card__detail-link" href={`/contenido/${item.id}`} aria-label={`Ver detalles de ${item.title}`} />
        <div className="content-card__topline"><span>{item.categoryLabel}</span><span>★ {item.score.toFixed(1)}</span></div>
        <button
          className={favorite ? 'content-card__favorite content-card__favorite--active' : 'content-card__favorite'}
          type="button" disabled={status !== 'authenticated' || busy}
          aria-pressed={status === 'authenticated' ? favorite : undefined}
          onClick={() => void toggleFavorite(item)}
        ><Icon name="heart" size={17} /></button>
      </div>
      <div className="content-card__body">
        <h3><a href={`/contenido/${item.id}`}>{item.title}</a></h3>
        <p>{[item.year, item.format, item.status].filter(Boolean).join(' · ')}</p>
      </div>
    </article>
  );
});
