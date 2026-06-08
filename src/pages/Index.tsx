import { useState } from 'react';
import ParticleField from '@/components/ParticleField';
import Navbar from '@/components/Navbar';
import HomePage from './HomePage';
import GeneratorPage from './GeneratorPage';
import HistoryPage from './HistoryPage';
import ProfilePage from './ProfilePage';

type Page = 'home' | 'generator' | 'history' | 'profile';

const CreatorsBadge = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {open && (
        <div
          className="animate-fade-in rounded-2xl px-5 py-4 text-sm"
          style={{
            background: 'rgba(5, 8, 15, 0.95)',
            border: '1px solid rgba(0,229,255,0.25)',
            boxShadow: '0 0 30px rgba(0,229,255,0.1)',
            backdropFilter: 'blur(20px)',
            minWidth: 200,
          }}
        >
          <p className="font-orbitron text-xs mb-2" style={{ color: 'var(--neon-cyan)', letterSpacing: '0.1em' }}>СОЗДАТЕЛЬ</p>
          <p className="font-ibm font-semibold text-foreground text-base">Попов Николай</p>
          <p className="text-muted-foreground text-xs mt-1 opacity-70">из гимназии</p>
          <div className="mt-3 h-px w-full" style={{ background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-violet))' }} />
          <p className="text-xs text-muted-foreground mt-2 opacity-50 font-mono-plex">NEXUS AI · 2025</p>
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold font-ibm transition-all duration-300"
        style={{
          background: open
            ? 'linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))'
            : 'rgba(5,8,15,0.9)',
          border: '1px solid rgba(0,229,255,0.35)',
          color: open ? '#000' : 'var(--neon-cyan)',
          boxShadow: '0 0 20px rgba(0,229,255,0.15)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <span>✦</span>
        Создатели
      </button>
    </div>
  );
};

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
      <CreatorsBadge />
    </div>
  );
};

export default Index;