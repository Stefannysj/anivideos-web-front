import { t } from './i18n.js';
import type { TranslationKey } from './translations.js';
import type { ContentCategory } from '../models/content.js';
const categoryKeys:Record<ContentCategory,TranslationKey>={'anime':'category.anime','k-drama':'category.k-drama','j-drama':'category.j-drama','donghua':'category.donghua','movie':'category.movie','ova':'category.ova'};
const statusKeys:Record<string,TranslationKey>={'airing':'status.airing','finished':'status.finished','upcoming':'status.upcoming','cancelled':'status.cancelled','hiatus':'status.hiatus','unknown':'status.unknown','RELEASING':'status.airing','FINISHED':'status.finished','NOT_YET_RELEASED':'status.upcoming','CANCELLED':'status.cancelled','HIATUS':'status.hiatus'};
const sectionCategories:Record<string,ContentCategory>={'#anime':'anime','#k-dramas':'k-drama','#j-dramas':'j-drama','#donghua':'donghua','#peliculas':'movie','#ovas':'ova'};
export function categoryLabel(category:ContentCategory):string{return t(categoryKeys[category]);}
export function categoryLabelFromSection(sectionHref:string,fallback:string):string{const category=sectionCategories[sectionHref];return category?categoryLabel(category):fallback;}
export function statusLabel(status:string):string{return statusKeys[status]?t(statusKeys[status]):status;}
