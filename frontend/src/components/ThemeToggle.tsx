import { useState } from 'react';
import { t } from '../i18n/i18n.js';
import { applyTheme, detectTheme, persistTheme } from '../theme/theme.js';
import type { Theme } from '../theme/theme.js';
export function ThemeToggle(){const [theme,setTheme]=useState<Theme>(()=>detectTheme());const next=theme==='dark'?'light':'dark';return <button className="v18-theme-toggle" type="button" aria-label={next==='dark'?t('theme.toDark'):t('theme.toLight')} title={next==='dark'?t('theme.toDark'):t('theme.toLight')} onClick={()=>{setTheme(next);applyTheme(next);persistTheme(next);}}><span aria-hidden="true">{theme==='dark'?'☾':'☀'}</span><span className="v18-theme-toggle__label">{theme==='dark'?t('theme.dark'):t('theme.light')}</span></button>;}
