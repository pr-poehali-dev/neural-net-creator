import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ProfilePageProps {
  user: { name: string; email: string } | null;
  onLogin: (user: { name: string; email: string }) => void;
  onLogout: () => void;
}

const usageStats = [
  { label: 'Текстов', value: 42, max: 100, color: 'var(--neon-violet)', icon: 'FileText' },
  { label: 'Кода', value: 28, max: 100, color: 'var(--neon-green)', icon: 'Code2' },
  { label: 'Изображений', value: 15, max: 50, color: 'var(--neon-cyan)', icon: 'Image' },
];

const achievements = [
  { icon: '🚀', title: 'Первый запуск', desc: 'Первая генерация', unlocked: true },
  { icon: '⚡', title: 'Быстрый старт', desc: '10 генераций', unlocked: true },
  { icon: '🔥', title: 'На волне', desc: '7 дней подряд', unlocked: true },
  { icon: '💎', title: 'Мастер кода', desc: '50 кодов', unlocked: false },
  { icon: '🎨', title: 'Художник', desc: '20 изображений', unlocked: false },
  { icon: '🌌', title: 'Nexus Pro', desc: 'Премиум план', unlocked: false },
];

const ProfilePage = ({ user, onLogin, onLogout }: ProfilePageProps) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPass, setFormPass] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

  const handleSubmit = () => {
    if (!formEmail.trim()) return;
    onLogin({ name: formName || formEmail.split('@')[0], email: formEmail });
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-sm">
          {/* Auth Card */}
          <div className="glass-card rounded-2xl p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(168, 85, 247, 0.2))', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
                <Icon name="User" size={28} style={{ color: 'var(--neon-cyan)' }} />
              </div>
              <h2 className="font-orbitron font-bold text-xl gradient-text">
                {authMode === 'login' ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {authMode === 'login' ? 'Добро пожаловать обратно' : 'Создай аккаунт NEXUS'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-lg mb-6"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              {(['login', 'register'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setAuthMode(mode)}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                    authMode === mode ? 'text-black' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  style={authMode === mode ? {
                    background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))'
                  } : {}}
                >
                  {mode === 'login' ? 'Войти' : 'Регистрация'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-mono-plex text-muted-foreground mb-2 block tracking-wider">ИМЯ</label>
                  <input
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="Твоё имя"
                    className="w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(0, 229, 255, 0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-mono-plex text-muted-foreground mb-2 block tracking-wider">EMAIL</label>
                <input
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0, 229, 255, 0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <div>
                <label className="text-xs font-mono-plex text-muted-foreground mb-2 block tracking-wider">ПАРОЛЬ</label>
                <input
                  value={formPass}
                  onChange={e => setFormPass(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0, 229, 255, 0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3.5 rounded-xl font-orbitron font-bold text-sm tracking-wider neon-btn-solid mt-2"
              >
                {authMode === 'login' ? 'ВОЙТИ' : 'СОЗДАТЬ АККАУНТ'}
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              При входе вы соглашаетесь с условиями использования
            </p>
          </div>

          {/* Free tokens badge */}
          <div className="mt-4 text-center px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(0, 255, 136, 0.06)', border: '1px solid rgba(0, 255, 136, 0.2)', color: 'var(--neon-green)' }}>
            🎁 Новым пользователям — <strong>100 бесплатных генераций</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Profile Header */}
        <div className="py-8">
          <div className="glass-card rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black font-orbitron"
                  style={{ background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))', color: '#000' }}>
                  {user.name[0].toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--neon-green)', boxShadow: '0 0 8px var(--neon-green)' }}>
                  <Icon name="Check" size={10} color="#000" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="font-orbitron font-bold text-2xl gradient-text">{user.name}</h1>
                <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono-plex"
                    style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--neon-cyan)', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
                    FREE PLAN
                  </span>
                  <span className="text-xs text-muted-foreground">· 15 генераций использовано</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors hover:bg-white/5"
              >
                <Icon name="LogOut" size={14} />
                Выйти
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { id: 'overview', label: 'Обзор', icon: 'LayoutDashboard' },
            { id: 'settings', label: 'Настройки', icon: 'Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'settings')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id ? 'tab-active' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Usage */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-orbitron font-bold text-sm mb-5 text-muted-foreground tracking-wider">ИСПОЛЬЗОВАНИЕ В ЭТОМ МЕСЯЦЕ</h3>
              <div className="space-y-5">
                {usageStats.map(stat => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon name={stat.icon} size={14} style={{ color: stat.color }} />
                        <span className="text-sm font-semibold">{stat.label}</span>
                      </div>
                      <span className="text-sm font-mono-plex" style={{ color: stat.color }}>
                        {stat.value} / {stat.max}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${(stat.value / stat.max) * 100}%`,
                          background: `linear-gradient(90deg, ${stat.color}, ${stat.color}88)`,
                          boxShadow: `0 0 8px ${stat.color}60`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-orbitron font-bold text-sm mb-5 text-muted-foreground tracking-wider">ДОСТИЖЕНИЯ</h3>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map(ach => (
                  <div
                    key={ach.title}
                    className="p-3 rounded-xl text-center transition-all duration-300"
                    style={{
                      background: ach.unlocked ? 'rgba(0, 229, 255, 0.06)' : 'rgba(255,255,255,0.02)',
                      border: ach.unlocked ? '1px solid rgba(0, 229, 255, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                      opacity: ach.unlocked ? 1 : 0.4
                    }}
                  >
                    <div className="text-2xl mb-1">{ach.icon}</div>
                    <div className="text-xs font-bold font-orbitron" style={{ color: ach.unlocked ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.5)' }}>
                      {ach.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 opacity-70">{ach.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade Banner */}
            <div className="relative rounded-2xl p-6 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(0, 229, 255, 0.1))', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10 blur-2xl rounded-full"
                style={{ background: 'var(--neon-violet)' }} />
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="font-orbitron font-bold text-lg gradient-text mb-1">NEXUS PRO</div>
                  <p className="text-sm text-muted-foreground">Безлимитные генерации, приоритет и эксклюзивные модели</p>
                </div>
                <button className="neon-btn-solid px-5 py-2.5 rounded-xl text-sm font-orbitron font-bold whitespace-nowrap">
                  UPGRADE
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <h3 className="font-orbitron font-bold text-sm text-muted-foreground tracking-wider">НАСТРОЙКИ ПРОФИЛЯ</h3>

            {[
              { label: 'ИМЯ ПОЛЬЗОВАТЕЛЯ', value: user.name, type: 'text' },
              { label: 'EMAIL', value: user.email, type: 'email' },
            ].map(field => (
              <div key={field.label}>
                <label className="text-xs font-mono-plex text-muted-foreground mb-2 block tracking-wider">{field.label}</label>
                <input
                  defaultValue={field.value}
                  type={field.type}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none text-foreground"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0, 229, 255, 0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            ))}

            <button className="neon-btn-solid px-6 py-3 rounded-xl text-sm font-orbitron font-bold">
              СОХРАНИТЬ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
