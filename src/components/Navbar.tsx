import Icon from '@/components/ui/icon';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  user: { name: string; email: string } | null;
  onAuthOpen: () => void;
}

const navItems = [
  { id: 'home', label: 'Главная', icon: 'Zap' },
  { id: 'generator', label: 'Генератор', icon: 'Bot' },
  { id: 'history', label: 'История', icon: 'History' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];

const Navbar = ({ activePage, setActivePage, user, onAuthOpen }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Glow line */}
      <div className="h-px w-full" style={{
        background: 'linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-violet), transparent)',
        boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)'
      }} />

      <div className="flex items-center justify-between px-6 py-3" style={{
        background: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 229, 255, 0.1)'
      }}>
        {/* Logo */}
        <button
          onClick={() => setActivePage('home')}
          className="flex items-center gap-2 group"
        >
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full animate-pulse-neon"
              style={{ background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))', padding: '2px' }}>
              <div className="w-full h-full rounded-full flex items-center justify-center"
                style={{ background: 'hsl(220, 20%, 4%)' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--neon-cyan)' }} />
              </div>
            </div>
          </div>
          <span className="font-orbitron font-black text-lg gradient-text tracking-wider">НИКОЛА</span>
        </button>

        {/* Nav Items */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activePage === item.id
                  ? 'tab-active font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon name={item.icon} size={15} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Auth Button */}
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => setActivePage('profile')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-white/5"
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-orbitron"
                style={{ background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))', color: '#000' }}>
                {user.name[0].toUpperCase()}
              </div>
              <span className="text-sm text-muted-foreground hidden md:block">{user.name}</span>
            </button>
          ) : (
            <button
              onClick={onAuthOpen}
              className="neon-btn px-4 py-1.5 rounded-lg text-sm font-semibold font-ibm"
            >
              Войти
            </button>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around px-4 py-3 z-50"
        style={{
          background: 'rgba(5, 8, 15, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0, 229, 255, 0.15)'
        }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all duration-300 ${
              activePage === item.id ? 'neon-text-cyan' : 'text-muted-foreground'
            }`}
          >
            <Icon name={item.icon} size={20} />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;