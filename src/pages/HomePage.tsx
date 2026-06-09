import Icon from '@/components/ui/icon';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const features = [
  {
    icon: 'Image',
    title: 'Генерация изображений',
    desc: 'Создавайте уникальные изображения по текстовому описанию. Любой стиль, любая идея.',
    color: 'var(--neon-cyan)',
    tag: 'DALL·E / Stable Diffusion',
  },
  {
    icon: 'FileText',
    title: 'Генерация текстов',
    desc: 'Статьи, посты, описания, сценарии — GPT-4 напишет всё за секунды.',
    color: 'var(--neon-violet)',
    tag: 'GPT-4 Turbo',
  },
  {
    icon: 'Code2',
    title: 'Генерация кода',
    desc: 'Python, JS, Go, Rust и ещё 30+ языков. Объясняет, исправляет, оптимизирует.',
    color: 'var(--neon-green)',
    tag: 'Claude / Codex',
  },
];

const stats = [
  { value: '10M+', label: 'Генераций' },
  { value: '50K+', label: 'Пользователей' },
  { value: '30+', label: 'Языков кода' },
  { value: '99.9%', label: 'Аптайм' },
];

const HomePage = ({ onNavigate }: HomePageProps) => {
  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 relative">

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden">

        {/* Background glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, var(--neon-cyan), transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, var(--neon-violet), transparent)' }} />
        </div>

        {/* Status badge */}
        <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono-plex"
          style={{
            background: 'rgba(0, 229, 255, 0.08)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            color: 'var(--neon-cyan)'
          }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--neon-green)' }} />
          СИСТЕМА АКТИВНА · НЕЙРОСЕТИ ОНЛАЙН
        </div>

        {/* Main heading */}
        <h1 className="animate-fade-in-up delay-100 font-orbitron font-black mb-6 leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', opacity: 0, animationFillMode: 'forwards' }}>
          <span className="gradient-text">НИКОЛА</span>
          <br />
          <span className="text-foreground">ГИМНАЗИСТ</span>
        </h1>

        <p className="animate-fade-in-up delay-200 text-muted-foreground max-w-xl mb-10 text-lg leading-relaxed font-ibm"
          style={{ opacity: 0, animationFillMode: 'forwards' }}>
          Нейросеть прямо в браузере — без API, без ключей. Настоящий ИИ, который учится и генерирует тексты и код.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 mb-16"
          style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <button
            onClick={() => onNavigate('generator')}
            className="neon-btn-solid px-8 py-4 rounded-xl text-base font-orbitron font-bold tracking-wider"
          >
            ЗАПУСТИТЬ ГЕНЕРАТОР
          </button>
          <button
            onClick={() => onNavigate('history')}
            className="neon-btn px-8 py-4 rounded-xl text-base font-orbitron font-semibold tracking-wider"
          >
            МОЯ ИСТОРИЯ
          </button>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up delay-400 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl w-full"
          style={{ opacity: 0, animationFillMode: 'forwards' }}>
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-orbitron font-black text-2xl gradient-text">{s.value}</div>
              <div className="text-muted-foreground text-xs mt-1 font-ibm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs font-mono-plex text-muted-foreground tracking-widest">SCROLL</span>
          <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono-plex mb-4"
            style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', color: 'var(--neon-violet)' }}>
            ВОЗМОЖНОСТИ
          </div>
          <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-4">
            Три инструмента. <span className="gradient-text">Бесконечные идеи.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Всё необходимое для творчества и разработки — в одном интерфейсе.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <button
              key={f.title}
              onClick={() => onNavigate('generator')}
              className="glass-card p-8 rounded-2xl text-left transition-all duration-300 hover-scale group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${f.color}18`, border: `1px solid ${f.color}40` }}>
                <Icon name={f.icon} size={26} style={{ color: f.color }} />
              </div>

              <div className="text-xs font-mono-plex mb-3 opacity-60" style={{ color: f.color }}>
                {f.tag}
              </div>

              <h3 className="font-orbitron font-bold text-lg mb-3 text-foreground">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>

              <div className="mt-6 flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3"
                style={{ color: f.color }}>
                Попробовать <Icon name="ArrowRight" size={14} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 pb-12 max-w-4xl mx-auto">
        <div className="relative rounded-2xl p-10 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.08), rgba(168, 85, 247, 0.08))',
            border: '1px solid rgba(0, 229, 255, 0.2)'
          }}>
          <div className="absolute inset-0 cyber-grid opacity-30" />
          <div className="relative">
            <h2 className="font-orbitron font-bold text-2xl md:text-3xl mb-4">
              Готов к запуску? <span className="gradient-text">Начни сейчас.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Зарегистрируйся и получи 100 бесплатных генераций для старта.
            </p>
            <button
              onClick={() => onNavigate('generator')}
              className="neon-btn-solid px-10 py-4 rounded-xl font-orbitron font-bold text-base tracking-wider"
            >
              НАЧАТЬ БЕСПЛАТНО
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;