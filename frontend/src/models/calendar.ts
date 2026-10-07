import { parseCatalogResponse } from './content.js';
import type { ContentItem } from './content.js';

export type SeasonName='winter'|'spring'|'summer'|'fall';
export interface CalendarEntry{content:ContentItem;airingAt:string;episodeNumber:number|null;}
export interface WeeklyCalendar{weekStart:string;items:CalendarEntry[];}
export interface SeasonCalendar{season:SeasonName;year:number;items:ContentItem[];}
function isRecord(value:unknown):value is Record<string,unknown>{return typeof value==='object'&&value!==null;}
export function parseWeeklyCalendar(value:unknown):WeeklyCalendar{if(!isRecord(value)||typeof value.weekStart!=='string'||!Array.isArray(value.items))throw new Error('Calendario inválido.');return{weekStart:value.weekStart,items:value.items.map((entry)=>{if(!isRecord(entry)||typeof entry.airingAt!=='string'||!(entry.episodeNumber===null||typeof entry.episodeNumber==='number'))throw new Error('Entrada de calendario inválida.');const content=parseCatalogResponse({items:[entry.content]})[0];if(!content)throw new Error('Contenido de calendario inválido.');return{content,airingAt:entry.airingAt,episodeNumber:entry.episodeNumber as number|null};})};}
export function parseSeasonCalendar(value:unknown):SeasonCalendar{if(!isRecord(value)||!['winter','spring','summer','fall'].includes(String(value.season))||typeof value.year!=='number'||!Array.isArray(value.items))throw new Error('Temporada inválida.');return{season:value.season as SeasonName,year:value.year,items:parseCatalogResponse({items:value.items})};}
