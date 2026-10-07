import { useEffect, useMemo, useState } from 'react';
import { resolveApiBaseUrl } from '../config/api.js';
import { useAuth } from '../context/AuthContext.js';
import { t } from '../i18n/i18n.js';
import type { ReviewItem, ReviewReportReason } from '../models/review.js';
import { deleteReview, getReviews, reportReview, saveReview } from '../services/review.service.js';

interface Props { contentId: string; }

export function ReviewsPanel({ contentId }: Props) {
  const { status: authStatus } = useAuth();
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [count, setCount] = useState(0);
  const [average, setAverage] = useState(0);
  const [rating, setRating] = useState(8);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [reportingId, setReportingId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState<ReviewReportReason>('spam');
  const [reportDetail, setReportDetail] = useState('');
  const baseUrl = useMemo(() => resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD), []);

  async function load(): Promise<void> {
    const result = await getReviews(baseUrl, contentId);
    setItems(result.items);
    setCount(result.count);
    setAverage(result.averageRating);
    const mine = result.items.find((item) => item.isOwner);
    if (mine) { setRating(mine.rating); setBody(mine.body); }
  }

  useEffect(() => {
    const controller = new AbortController();
    void getReviews(baseUrl, contentId, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setItems(result.items); setCount(result.count); setAverage(result.averageRating);
        const mine = result.items.find((item) => item.isOwner);
        if (mine) { setRating(mine.rating); setBody(mine.body); }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [baseUrl, contentId]);

  async function submit(): Promise<void> {
    setBusy(true); setMessage('');
    try { await saveReview(baseUrl, contentId, rating, body); await load(); }
    catch { setMessage(t('reviews.error')); }
    finally { setBusy(false); }
  }

  async function remove(): Promise<void> {
    setBusy(true); setMessage('');
    try { await deleteReview(baseUrl, contentId); setBody(''); setRating(8); await load(); }
    catch { setMessage(t('reviews.error')); }
    finally { setBusy(false); }
  }

  async function sendReport(reviewId: number): Promise<void> {
    setBusy(true); setMessage('');
    try {
      await reportReview(baseUrl, reviewId, reportReason, reportDetail);
      setMessage(t('reviews.reported')); setReportingId(null); setReportDetail(''); setReportReason('spam');
    } catch { setMessage(t('reviews.error')); }
    finally { setBusy(false); }
  }

  const mine = items.find((item) => item.isOwner);
  return (
    <section className="v17-reviews">
      <div className="v17-reviews__heading">
        <div><p className="eyebrow">{t('reviews.title')}</p><h2>{average.toFixed(1)} / 10</h2></div>
        <p>{t('reviews.average')}: {average.toFixed(1)} · {count} {t('reviews.count')}</p>
      </div>

      {authStatus === 'authenticated' ? (
        <div className="v17-review-form">
          <label><span>{t('reviews.rating')}</span><select value={rating} onChange={(event) => setRating(Number(event.target.value))}>{Array.from({ length: 10 }, (_, index) => index + 1).map((value) => <option value={value} key={value}>{value}/10</option>)}</select></label>
          <label><span>{t('reviews.body')}</span><textarea maxLength={2000} value={body} placeholder={t('reviews.placeholder')} onChange={(event) => setBody(event.target.value)} /></label>
          <div><button className="button button--primary" type="button" disabled={busy} onClick={() => void submit()}>{busy ? t('reviews.saving') : t('reviews.save')}</button>{mine && <button className="button button--secondary" type="button" disabled={busy} onClick={() => void remove()}>{t('reviews.delete')}</button>}</div>
        </div>
      ) : <p className="content-detail__note">{t('reviews.login')}</p>}

      {message && <p className="v17-review-message">{message}</p>}
      <div className="v17-review-list">
        {items.length === 0 ? <p>{t('reviews.empty')}</p> : items.map((item) => (
          <article key={item.id} className="v17-review-card">
            <header><strong>{item.author.displayName || item.author.username}</strong><span>★ {item.rating}/10</span></header>
            {item.body && <p>{item.body}</p>}
            {authStatus === 'authenticated' && !item.isOwner && (
              <>
                <button type="button" onClick={() => setReportingId((current) => current === item.id ? null : item.id)}>{t('reviews.report')}</button>
                {reportingId === item.id && <div className="v17-report-form"><label><span>{t('reviews.report.reason')}</span><select value={reportReason} onChange={(event) => setReportReason(event.target.value as ReviewReportReason)}><option value="spam">{t('reviews.report.spam')}</option><option value="abuse">{t('reviews.report.abuse')}</option><option value="spoiler">{t('reviews.report.spoiler')}</option><option value="other">{t('reviews.report.other')}</option></select></label><label><span>{t('reviews.report.detail')}</span><textarea maxLength={500} value={reportDetail} onChange={(event) => setReportDetail(event.target.value)} /></label><button className="button button--secondary" type="button" disabled={busy} onClick={() => void sendReport(item.id)}>{t('reviews.report.send')}</button></div>}
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
