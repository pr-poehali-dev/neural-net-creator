import { useState } from 'react';
import Icon from '@/components/ui/icon';

type FilterType = 'all' | 'text' | 'code' | 'image';

const mockHistory = [
  {
    id: 1, type: 'code' as const,
    prompt: 'Напиши функцию сортировки пузырьком на Python',
    preview: 'def bubble_sort(arr): ...',
    lang: 'Python', date: '08 июн, 14:32', tokens: 320, liked: true,
  },
  {
    id: 2, type: 'text' as const,
    prompt: 'Статья об искусственном интеллекте в медицине',
    preview: 'Искусственный интеллект трансформирует здравоохранение...',
    lang: null, date: '08 июн, 13:10', tokens: 850, liked: false,
  },
  {
    id: 3, type: 'image' as const,
    prompt: 'Космический город будущего, неоновые огни, кибerpunk',
    preview: '/placeholder.svg',
    lang: null, date: '08 июн, 11:45', tokens: 0, liked: true,
  },
  {
    id: 4, type: 'code' as const,
    prompt: 'REST API на FastAPI с JWT авторизацией',
    preview: 'from fastapi import FastAPI, Depends...',
    lang: 'Python', date: '07 июн, 20:15', tokens: 1240, liked: false,
  },
  {
    id: 5, type: 'text' as const,
    prompt: 'Email-рассылка для запуска нового продукта',
    preview: 'Тема: Это изменит всё. Привет! Мы рады сообщить...',
    lang: null, date: '07 июн, 17:08', tokens: 420, liked: false,
  },
  {
    id: 6, type: 'code' as const,
    prompt: 'Компонент кнопки на React с анимацией',
    preview: 'const Button = ({ onClick, children }) => {...',
    lang: 'TypeScript', date: '07 июн, 09:00', tokens: 280, liked: true,
  },
];

const typeConfig = {
  text: { icon: 'FileText', label: 'Текст', color: 'var(--neon-violet)' },
  code: { icon: 'Code2', label: 'Код', color: 'var(--neon-green)' },
  image: { icon: 'Image', label: 'Изображение', color: 'var(--neon-cyan)' },
};

const HistoryPage = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState<Set<number>>(new Set([1, 3, 6]));

  const filtered = mockHistory.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.prompt.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleLike = (id: number) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filters: { id: FilterType; label: string; icon: string }[] = [
    { id: 'all', label: 'Все', icon: 'Grid3x3' },
    { id: 'text', label: 'Тексты', icon: 'FileText' },
    { id: 'code', label: 'Код', icon: 'Code2' },
    { id: 'image', label: 'Изображения', icon: 'Image' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-plex mb-4"
            style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.2)', color: 'var(--neon-violet)' }}>
            <Icon name="History" size={11} />
            ИСТОРИЯ ГЕНЕРАЦИЙ
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-orbitron font-bold text-3xl md:text-4xl gradient-text">ИСТОРИЯ</h1>
            <span className="text-muted-foreground text-sm font-mono-plex">{mockHistory.length} записей</span>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по истории..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          <div className="flex gap-1 p-1 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  filter === f.id ? 'tab-active' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={f.icon} size={12} />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Icon name="SearchX" size={28} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-ibm">Ничего не найдено</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item, i) => {
              const cfg = typeConfig[item.type];
              const isLiked = liked.has(item.id);
              return (
                <div
                  key={item.id}
                  className="glass-card rounded-xl p-5 cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'backwards' }}
                >
                  <div className="flex items-start gap-4">
                    {/* Type icon */}
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}30` }}>
                      <Icon name={cfg.icon} size={16} style={{ color: cfg.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono-plex opacity-60" style={{ color: cfg.color }}>
                          {cfg.label}{item.lang ? ` · ${item.lang}` : ''}
                        </span>
                        <span className="text-muted-foreground text-xs opacity-40">·</span>
                        <span className="text-xs text-muted-foreground font-mono-plex">{item.date}</span>
                      </div>

                      <p className="text-sm font-semibold text-foreground mb-2 truncate">{item.prompt}</p>

                      {item.type !== 'image' ? (
                        <p className="text-xs text-muted-foreground truncate font-mono-plex opacity-60">{item.preview}</p>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg overflow-hidden"
                            style={{ border: '1px solid rgba(0,229,255,0.2)' }}>
                            <img src={item.preview} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-muted-foreground opacity-60">Изображение</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.tokens > 0 && (
                        <span className="text-xs font-mono-plex text-muted-foreground opacity-50 hidden sm:block">
                          {item.tokens} токенов
                        </span>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); toggleLike(item.id); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                        style={{ color: isLiked ? '#ff4466' : 'rgba(255,255,255,0.2)' }}
                      >
                        <Icon name={isLiked ? 'Heart' : 'Heart'} size={15} />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-white/5"
                        style={{ color: 'rgba(255,255,255,0.3)' }}>
                        <Icon name="MoreHorizontal" size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load more */}
        {filtered.length > 0 && (
          <div className="text-center mt-8">
            <button className="neon-btn px-8 py-3 rounded-xl text-sm font-semibold">
              Загрузить ещё
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
