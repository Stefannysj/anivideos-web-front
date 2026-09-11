export interface NavigationItem {
  label: string;
  href: `#${string}`;
}

/** Navegación principal compartida entre desktop y móvil para evitar mantener dos menús distintos. */
export const navigationItems = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Anime', href: '#anime' },
  { label: 'K-Dramas', href: '#k-dramas' },
  { label: 'Series', href: '#series' },
  { label: 'Películas', href: '#peliculas' },
] as const satisfies readonly NavigationItem[];
