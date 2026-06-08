import { useState } from 'react';
import ParticleField from '@/components/ParticleField';
import Navbar from '@/components/Navbar';
import HomePage from './HomePage';
import GeneratorPage from './GeneratorPage';
import HistoryPage from './HistoryPage';
import ProfilePage from './ProfilePage';

type Page = 'home' | 'generator' | 'history' | 'profile';

const Index = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLogin = (u: { name: string; email: string }) => {
    setUser(u);
    setActivePage('profile');
  };

  const handleLogout = () => {
    setUser(null);
    setActivePage('home');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={(p) => setActivePage(p as Page)} />;
      case 'generator':
        return <GeneratorPage />;
      case 'history':
        return <HistoryPage />;
      case 'profile':
        return <ProfilePage user={user} onLogin={handleLogin} onLogout={handleLogout} />;
      default:
        return <HomePage onNavigate={(p) => setActivePage(p as Page)} />;
    }
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'hsl(220, 20%, 4%)' }}>
      <ParticleField />
      <div className="fixed inset-0 cyber-grid pointer-events-none z-0 opacity-40" />
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0, 229, 255, 0.08) 0%, transparent 60%)'
        }}
      />
      <Navbar
        activePage={activePage}
        setActivePage={(p) => setActivePage(p as Page)}
        user={user}
        onAuthOpen={() => setActivePage('profile')}
      />
      <main className="relative z-10">
        {renderPage()}
      </main>
    </div>
  );
};

export default Index;
