import { Navbar } from './components/Navbar.js';
import { SiteFooter } from './components/SiteFooter.js';
import { HomePage } from './pages/HomePage.js';

export function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <HomePage />
      <SiteFooter />
    </div>
  );
}
