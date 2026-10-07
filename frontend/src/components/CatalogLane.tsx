import { useRef } from 'react';
import { t } from '../i18n/i18n.js';
import type { TranslationKey } from '../i18n/translations.js';
import type { ContentItem } from '../models/content.js';
import { ContentCard } from './ContentCard.js';
import { Icon } from './Icon.js';

interface LaneSection { id: string; labelKey?: TranslationKey; title?: string; eyebrow?: string; description?: string; }
interface Props { section: LaneSection; items: readonly ContentItem[]; }

export function CatalogLane({ section, items }: Props) {
  const track = useRef<HTMLDivElement>(null);
  if (items.length === 0) return null;
  const move = (direction: number) => track.current?.scrollBy({ left: direction * Math.max(280, track.current.clientWidth * .75), behavior: 'smooth' });
  const title = section.labelKey ? t(section.labelKey) : section.title ?? '';
  return (
    <section className="catalog-lane" id={section.id}>
      <div className="catalog-lane__header">
        <div className="catalog-lane__heading"><p className="eyebrow">{section.eyebrow ?? t('home.overview.eyebrow')}</p><h2>{title}</h2>{section.description && <p>{section.description}</p>}</div>
        <div className="catalog-lane__controls"><button type="button" onClick={() => move(-1)} aria-label="Anterior"><Icon name="chevron-left" size={18}/></button><button type="button" onClick={() => move(1)} aria-label="Siguiente"><Icon name="chevron-right" size={18}/></button></div>
      </div>
      <div className="catalog-track" ref={track}>{items.map((item) => <ContentCard item={item} key={item.id}/>)}</div>
    </section>
  );
}
