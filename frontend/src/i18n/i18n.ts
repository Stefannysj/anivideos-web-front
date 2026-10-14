import { dictionaries, locales } from './translations.js';
import type { Locale, TranslationKey } from './translations.js';

const STORAGE_KEY='anivideos.locale';
let activeLocale:Locale='es';

export function isLocale(value:string|undefined|null):value is Locale{return !!value&&locales.includes(value as Locale);}
export function setActiveLocale(locale:Locale):void{activeLocale=locale;if(typeof document!=='undefined')document.documentElement.lang=locale==='pt'?'pt-BR':locale;}
export function getActiveLocale():Locale{return activeLocale;}
export function localeFromPath(pathname:string):Locale|null{const segment=pathname.split('/').filter(Boolean)[0];return isLocale(segment)?segment:null;}
export function detectLocale():Locale{try{const stored=localStorage.getItem(STORAGE_KEY);if(isLocale(stored))return stored;}catch{}const candidates=typeof navigator==='undefined'?[]:navigator.languages;for(const candidate of candidates){const base=candidate.toLowerCase().split('-')[0];if(isLocale(base))return base;}return 'es';}
export function persistLocale(locale:Locale):void{try{localStorage.setItem(STORAGE_KEY,locale);}catch{}}
export function t(key:TranslationKey,variables?:Record<string,string|number>):string{let value=dictionaries[activeLocale][key]??dictionaries.es[key]??key;if(!variables)return value;for(const [name,replacement] of Object.entries(variables))value=value.replaceAll(`{{${name}}}`,String(replacement));return value;}
export function intlLocale(locale:Locale=activeLocale):string{return locale==='es'?'es-PE':locale==='pt'?'pt-BR':locale==='fr'?'fr-FR':'en-US';}
export function formatDate(value:string|number|Date,options:Intl.DateTimeFormatOptions={dateStyle:'medium'}):string{return new Intl.DateTimeFormat(intlLocale(),options).format(new Date(value));}
export function formatDateTime(value:string|number|Date):string{return new Intl.DateTimeFormat(intlLocale(),{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));}
export function formatNumber(value:number,options?:Intl.NumberFormatOptions):string{return new Intl.NumberFormat(intlLocale(),options).format(value);}
