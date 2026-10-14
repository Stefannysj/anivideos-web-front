import { getActiveLocale, persistLocale, t } from '../i18n/i18n.js';
import { translateCurrentPath } from '../i18n/routes.js';
import type { Locale, TranslationKey } from '../i18n/translations.js';
const options:Array<{value:Locale;key:TranslationKey}>=[{value:'es',key:'language.es'},{value:'en',key:'language.en'},{value:'pt',key:'language.pt'},{value:'fr',key:'language.fr'}];
export function LanguageSelector(){const locale=getActiveLocale();return <label className="v18-language"><span className="sr-only">{t('language.label')}</span><select aria-label={t('language.label')} value={locale} onChange={(event)=>{const next=event.target.value as Locale;persistLocale(next);window.location.assign(translateCurrentPath(next));}}>{options.map((item)=><option value={item.value} key={item.value}>{t(item.key)}</option>)}</select></label>;}
