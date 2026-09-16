import { useRef } from 'react';
import type { CatalogSection, ContentItem } from '../models/content.js';
import { ContentCard } from './ContentCard.js';
import { Icon } from './Icon.js';

interface CatalogLaneProps {
  section: CatalogSection;
  items: readonly ContentItem[];
}

/** Carril horizontal accesible para explorar una categoría sin provocar scroll horizontal en la página. */
export function CatalogLane({ section, items }: CatalogLaneProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1): void {
    const track = trackRef.current;
    if (!track) return;

    const distance = Math.max(track.clientWidth * 0.82, 280);
    track.scrollBy({ left: direction * distance, behavior: 'smooth' });
  }

  return (
    <section className="catalog-lane" id={section.id} aria-labelledby={`${section.id}-title`}>
      <div className="catalog-lane__header">
        <div className="catalog-lane__heading">
          <p className="eyebrow">{section.eyebrow}</p>
          <div className="catalog-lane__title-row">
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            <span className="catalog-lane__count">{items.length} títulos</span>
          </div>
          <p>{section.description}</p>
        </div>

        <div className="catalog-lane__controls" aria-label={`Mover catálogo de ${section.title}`}>
          <button type="button" onClick={() => scroll(-1)} aria-label={`Ver títulos anteriores de ${section.title}`}>
            <Icon name="chevron-left" size={20} />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={`Ver más títulos de ${section.title}`}>
            <Icon name="chevron-right" size={20} />
          </button>
        </div>
      </div>

      <div className="catalog-track" ref={trackRef} tabIndex={0} aria-label={`Catálogo de ${section.title}`}>
        {items.map((item) => <ContentCard item={item} key={item.id} />)}
      </div>
    </section>
  );
}
