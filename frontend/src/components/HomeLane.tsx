interface HomeLaneProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  variant: 1 | 2 | 3 | 4;
}

/** Reserva el espacio visual de cada categoría sin adelantar aún tarjetas ni datos reales del catálogo. */
export function HomeLane({ id, eyebrow, title, description, variant }: HomeLaneProps) {
  return (
    <section className="home-lane" id={id} aria-labelledby={`${id}-title`}>
      <div className="home-lane__header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <p>{description}</p>
      </div>

      <div className="home-lane__preview" aria-label={`${title}: vista previa de estructura`}>
        {Array.from({ length: 5 }, (_, index) => (
          <div
            className={`preview-tile preview-tile--${variant}`}
            key={`${id}-${index}`}
            aria-hidden="true"
          >
            <span className="preview-tile__glow" />
            <span className="preview-tile__line preview-tile__line--short" />
            <span className="preview-tile__line" />
          </div>
        ))}
      </div>
    </section>
  );
}
