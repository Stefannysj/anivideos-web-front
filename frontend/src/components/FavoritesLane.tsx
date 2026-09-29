import { useAuth } from '../context/AuthContext.js';
import { useFavorites } from '../context/FavoritesContext.js';
import { CatalogLane } from './CatalogLane.js';
import { Icon } from './Icon.js';

const favoritesSection = {
  id: 'favoritos',
  eyebrow: 'Tu colección',
  title: 'Mi lista',
  description: 'Los títulos que guardes se sincronizan con tu cuenta y permanecen disponibles al volver a iniciar sesión.',
} as const;

/** Personalized catalog lane shown only to authenticated users. */
export function FavoritesLane() {
  const { status: authStatus } = useAuth();
  const { status, items, error, refresh } = useFavorites();

  if (authStatus !== 'authenticated') return null;

  if (status === 'loading' || status === 'idle') {
    return (
      <section className="favorites-state" id="favoritos" aria-live="polite">
        <span className="data-state__spinner" aria-hidden="true" />
        <div><p className="eyebrow">Tu colección</p><p>Cargando favoritos...</p></div>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="favorites-state favorites-state--error" id="favoritos" role="alert">
        <Icon name="heart" size={22} />
        <div>
          <p className="eyebrow">Mi lista</p>
          <p>{error ?? 'No fue posible cargar tus favoritos.'}</p>
        </div>
        <button className="button button--secondary" type="button" onClick={() => void refresh()}>Reintentar</button>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="favorites-empty" id="favoritos" aria-labelledby="favorites-empty-title">
        <div className="favorites-empty__icon" aria-hidden="true"><Icon name="heart" size={26} /></div>
        <div>
          <p className="eyebrow">Tu colección</p>
          <h2 id="favorites-empty-title">Mi lista está vacía</h2>
          <p>Usa el corazón de cualquier tarjeta para guardar un título en tu cuenta.</p>
        </div>
      </section>
    );
  }

  return <CatalogLane section={favoritesSection} items={items} />;
}
