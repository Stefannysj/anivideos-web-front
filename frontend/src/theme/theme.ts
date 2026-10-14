export type Theme='dark'|'light';
const STORAGE_KEY='anivideos.theme';
export function detectTheme():Theme{try{const stored=localStorage.getItem(STORAGE_KEY);if(stored==='dark'||stored==='light')return stored;}catch{}return typeof matchMedia!=='undefined'&&matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}
export function applyTheme(theme:Theme):void{document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;const meta=document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');if(meta)meta.content=theme==='dark'?'#08090d':'#f5f4fb';}
export function persistTheme(theme:Theme):void{try{localStorage.setItem(STORAGE_KEY,theme);}catch{}}
