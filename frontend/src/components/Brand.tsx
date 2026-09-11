interface BrandProps {
  compact?: boolean;
}

/** Identidad reutilizable de AniVideos para cabeceras y pantallas de acceso futuras. */
export function Brand({ compact = false }: BrandProps) {
  return (
    <div className={compact ? 'brand brand--compact' : 'brand'} aria-label="AniVideos">
      <span className="brand__ani">Ani</span>
      <span className="brand__videos">Videos</span>
    </div>
  );
}
