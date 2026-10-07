import { t } from '../i18n/i18n.js';
import type { TranslationKey } from '../i18n/translations.js';

type LegalKind='terms'|'privacy'|'dmca';
const sections: Record<LegalKind,{title:TranslationKey;paragraphs:TranslationKey[]}>={
  terms:{title:'legal.terms.title',paragraphs:['legal.terms.1','legal.terms.2','legal.terms.3']},
  privacy:{title:'legal.privacy.title',paragraphs:['legal.privacy.1','legal.privacy.2','legal.privacy.3','legal.privacy.4']},
  dmca:{title:'legal.dmca.title',paragraphs:['legal.dmca.1','legal.dmca.2','legal.dmca.3']},
};
export function LegalPage({kind}:{kind:LegalKind}){const data=sections[kind];return <main className="v16-page v16-legal"><header><p className="eyebrow">AniVideos</p><h1>{t(data.title)}</h1><p className="v16-legal__draft">{t('legal.draft')}</p></header>{data.paragraphs.map((key)=><p key={key}>{t(key)}</p>)}</main>;}
