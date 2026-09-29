import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { resolveApiBaseUrl } from '../config/api.js';
import { useAuth } from '../context/AuthContext.js';
import type { FeaturedBanner } from '../models/banner.js';
import type { BannerComment } from '../models/comment.js';
import { validateCommentBody } from '../models/comment.js';
import {
  CommentRequestError,
  deleteBannerComment,
  getBannerComments,
  publishBannerComment,
} from '../services/comment.service.js';
import { Icon } from './Icon.js';

interface BannerCommentsModalProps {
  banner: FeaturedBanner;
  onClose: () => void;
}

function formatCommentDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function BannerCommentsModal({ banner, onClose }: BannerCommentsModalProps) {
  const { status: authStatus, user } = useAuth();
  const [comments, setComments] = useState<BannerComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(() => new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const baseUrl = useMemo(
    () => resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD),
    [],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape' && !publishing && deletingIds.size === 0) onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [deletingIds.size, onClose, publishing]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError(null);
    getBannerComments(baseUrl, banner.id, controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setComments(items);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setLoadError(error instanceof Error ? error.message : 'No fue posible cargar los comentarios.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [banner.id, baseUrl, user?.id]);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (authStatus !== 'authenticated' || !user || publishing) return;
    const validationError = validateCommentBody(draft);
    if (validationError) {
      setRequestError(validationError);
      return;
    }

    setPublishing(true);
    setRequestError(null);
    try {
      const created = await publishBannerComment(baseUrl, banner.id, draft.trim());
      setComments((current) => [created, ...current.filter((item) => item.id !== created.id)]);
      setDraft('');
      textareaRef.current?.focus();
    } catch (error) {
      setRequestError(error instanceof CommentRequestError ? error.message : 'No fue posible publicar el comentario.');
    } finally {
      setPublishing(false);
    }
  }

  async function remove(comment: BannerComment): Promise<void> {
    if (!comment.isOwner || deletingIds.has(comment.id)) return;
    if (!window.confirm('¿Eliminar este comentario?')) return;

    setDeletingIds((current) => new Set(current).add(comment.id));
    setRequestError(null);
    try {
      await deleteBannerComment(baseUrl, banner.id, comment.id);
      setComments((current) => current.filter((item) => item.id !== comment.id));
    } catch (error) {
      setRequestError(error instanceof CommentRequestError ? error.message : 'No fue posible eliminar el comentario.');
    } finally {
      setDeletingIds((current) => {
        const next = new Set(current);
        next.delete(comment.id);
        return next;
      });
    }
  }

  return createPortal(
    <div className="comments-modal" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !publishing && deletingIds.size === 0) onClose();
    }}>
      <section className="comments-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="comments-title">
        <header className="comments-modal__header">
          <div>
            <p className="eyebrow">Comentarios del destacado</p>
            <h2 id="comments-title">{banner.title}</h2>
            <p>Cada banner mantiene su propia conversación.</p>
          </div>
          <button className="comments-modal__close" type="button" aria-label="Cerrar comentarios" onClick={onClose} disabled={publishing || deletingIds.size > 0}>
            <Icon name="close" size={20} />
          </button>
        </header>

        {authStatus === 'authenticated' && user ? (
          <form className="comment-composer" onSubmit={(event) => void submit(event)}>
            <label htmlFor={`comment-${banner.id}`}>Comentar como <strong>@{user.username}</strong></label>
            <textarea
              ref={textareaRef}
              id={`comment-${banner.id}`}
              value={draft}
              rows={4}
              maxLength={1000}
              placeholder="Comparte tu opinión sobre este destacado..."
              disabled={publishing}
              onChange={(event) => setDraft(event.target.value)}
            />
            <div className="comment-composer__footer">
              <span>{draft.length}/1000</span>
              <button className="button button--primary" type="submit" disabled={publishing || !draft.trim()}>
                {publishing ? 'Publicando...' : 'Publicar comentario'}
              </button>
            </div>
          </form>
        ) : (
          <div className="comment-auth-note">
            <Icon name="user" size={18} />
            <p>Inicia sesión o crea una cuenta para publicar comentarios.</p>
          </div>
        )}

        {requestError && <p className="auth-error" role="alert">{requestError}</p>}

        <div className="comments-list" aria-live="polite">
          {loading && <p className="comments-state">Cargando comentarios...</p>}
          {!loading && loadError && <p className="comments-state comments-state--error" role="alert">{loadError}</p>}
          {!loading && !loadError && comments.length === 0 && (
            <div className="comments-empty">
              <Icon name="message" size={24} />
              <strong>Aún no hay comentarios</strong>
              <p>Sé la primera persona en comentar este banner.</p>
            </div>
          )}
          {!loading && !loadError && comments.map((comment) => {
            const visibleName = comment.author.displayName || comment.author.username;
            const deleting = deletingIds.has(comment.id);
            return (
              <article className="comment-card" key={comment.id}>
                <div className="comment-card__topline">
                  <div>
                    <strong>{visibleName}</strong>
                    <span>@{comment.author.username}</span>
                  </div>
                  <time dateTime={comment.createdAt}>{formatCommentDate(comment.createdAt)}</time>
                </div>
                <p className="comment-card__body">{comment.body}</p>
                {comment.isOwner && (
                  <button className="comment-card__delete" type="button" disabled={deleting} onClick={() => void remove(comment)}>
                    <Icon name="trash" size={15} />
                    {deleting ? 'Eliminando...' : 'Eliminar'}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>,
    document.body,
  );
}
