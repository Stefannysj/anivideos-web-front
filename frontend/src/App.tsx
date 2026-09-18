import { AuthProvider } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { SiteFooter } from './components/SiteFooter.js';
import { HomePage } from './pages/HomePage.js';

export function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Navbar />
        <HomePage />
        <SiteFooter />
      </div>
    </AuthProvider>
  );
}
