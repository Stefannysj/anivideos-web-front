import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { ensureLocalizedLocation, parseRoute } from './i18n/routes.js';
import { setActiveLocale } from './i18n/i18n.js';
import { applyTheme, detectTheme } from './theme/theme.js';
import './styles/global.css';
import './styles/v16.css';
import './styles/v17.css';
import './styles/v18.css';

const locale=ensureLocalizedLocation();
setActiveLocale(locale);
applyTheme(detectTheme());
const parsed=parseRoute(window.location.pathname);
if(parsed&&parsed.locale!==locale)setActiveLocale(parsed.locale);

if(import.meta.env.PROD&&'serviceWorker' in navigator){window.addEventListener('load',()=>{void navigator.serviceWorker.register('/sw.js');});}
const root=document.getElementById('root');
if(!root)throw new Error('AniVideos root element is missing.');
createRoot(root).render(<StrictMode><App/></StrictMode>);
