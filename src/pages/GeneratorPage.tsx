import { useState } from 'react';
import Icon from '@/components/ui/icon';

type GenType = 'text' | 'code' | 'image';

const codeLanguages = ['Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Java', 'C++', 'Swift', 'Kotlin', 'PHP', 'SQL', 'Bash'];

const textStyles = ['Статья', 'Пост для соцсетей', 'Email', 'Сценарий', 'Описание товара', 'Идеи и брейншторм'];

const mockCodeResult = `def fibonacci(n: int) -> list[int]:
    """Генерирует последовательность Фибоначчи до n элементов."""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    
    return sequence

# Пример использования
result = fibonacci(10)
print(f"Последовательность: {result}")
# → [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`;

const mockTextResult = `# Искусственный интеллект: революция уже началась

Мы живём в эпоху, когда границы между возможным и невозможным стремительно исчезают. Нейросети научились писать код, создавать картины и вести осмысленные диалоги...

**Что изменится в ближайшие 5 лет?**

По прогнозам аналитиков, к 2030 году ИИ будет участвовать в создании более 70% цифрового контента. Это не угроза — это инструмент для тех, кто умеет им пользоваться.`;

const GeneratorPage = () => {
  const [activeType, setActiveType] = useState<GenType>('text');
  const [prompt, setPrompt] = useState('');
  const [selectedLang, setSelectedLang] = useState('Python');
  const [selectedStyle, setSelectedStyle] = useState('Статья');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [progress, setProgress] = useState(0);

  const tabs: { id: GenType; label: string; icon: string; color: string }[] = [
    { id: 'text', label: 'Текст', icon: 'FileText', color: 'var(--neon-violet)' },
    { id: 'code', label: 'Код', icon: 'Code2', color: 'var(--neon-green)' },
    { id: 'image', label: 'Изображение', icon: 'Image', color: 'var(--neon-cyan)' },
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult('');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 95) { clearInterval(interval); return p; }
        return p + Math.random() * 12;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsGenerating(false);
      if (activeType === 'code') setResult(mockCodeResult);
      else if (activeType === 'text') setResult(mockTextResult);
    }, 2500);
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="py-8 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-plex mb-4"
            style={{ background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.2)', color: 'var(--neon-cyan)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--neon-green)' }} />
            НЕЙРОСЕТЬ ГОТОВА
          </div>
          <h1 className="font-orbitron font-bold text-3xl md:text-4xl gradient-text">ГЕНЕРАТОР</h1>
        </div>

        {/* Type Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl w-fit"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveType(tab.id); setResult(''); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeType === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              style={activeType === tab.id ? {
                background: `${tab.color}15`,
                border: `1px solid ${tab.color}50`,
                color: tab.color
              } : {}}
            >
              <Icon name={tab.icon} size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Left: Input Panel */}
          <div className="md:col-span-2 space-y-4">

            {/* Options */}
            {activeType === 'code' && (
              <div className="glass-card rounded-xl p-4">
                <label className="text-xs font-mono-plex text-muted-foreground mb-3 block tracking-wider">ЯЗЫК ПРОГРАММИРОВАНИЯ</label>
                <div className="grid grid-cols-3 gap-2">
                  {codeLanguages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-mono-plex transition-all duration-200 ${
                        selectedLang === lang ? 'text-black font-bold' : 'text-muted-foreground hover:text-foreground'
                      }`}
                      style={selectedLang === lang ? {
                        background: 'linear-gradient(135deg, var(--neon-green), var(--neon-cyan))'
                      } : { background: 'rgba(255,255,255,0.04)' }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeType === 'text' && (
              <div className="glass-card rounded-xl p-4">
                <label className="text-xs font-mono-plex text-muted-foreground mb-3 block tracking-wider">СТИЛЬ ТЕКСТА</label>
                <div className="space-y-2">
                  {textStyles.map(style => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        selectedStyle === style ? 'neon-text-violet' : 'text-muted-foreground hover:text-foreground'
                      }`}
                      style={selectedStyle === style ? {
                        background: 'rgba(168, 85, 247, 0.1)',
                        border: '1px solid rgba(168, 85, 247, 0.3)'
                      } : { background: 'rgba(255,255,255,0.03)' }}
                    >
                      {style}
                      {selectedStyle === style && <Icon name="Check" size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeType === 'image' && (
              <div className="glass-card rounded-xl p-4">
                <label className="text-xs font-mono-plex text-muted-foreground mb-3 block tracking-wider">СТИЛЬ ИЗОБРАЖЕНИЯ</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Реализм', 'Аниме', 'Цифровое искусство', '3D рендер', 'Фото', 'Абстракция'].map(s => (
                    <button key={s}
                      className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Prompt Input */}
            <div className="glass-card rounded-xl p-4">
              <label className="text-xs font-mono-plex text-muted-foreground mb-3 block tracking-wider">
                {activeType === 'image' ? 'ОПИСАНИЕ ИЗОБРАЖЕНИЯ' : activeType === 'code' ? 'ЗАДАЧА' : 'ТЕМА / ЗАДАНИЕ'}
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={
                  activeType === 'code'
                    ? `Напиши функцию на ${selectedLang}...`
                    : activeType === 'image'
                    ? 'Опиши что хочешь увидеть...'
                    : `Напиши ${selectedStyle.toLowerCase()} о...`
                }
                rows={5}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none leading-relaxed"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-xs text-muted-foreground font-mono-plex">{prompt.length} симв.</span>
                <button
                  onClick={() => setPrompt('')}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Очистить
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 rounded-xl font-orbitron font-bold text-sm tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              style={!isGenerating && prompt.trim() ? {
                background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))',
                color: '#000',
                boxShadow: '0 0 30px rgba(0, 229, 255, 0.3)'
              } : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  ГЕНЕРИРУЮ...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Zap" size={16} />
                  СГЕНЕРИРОВАТЬ
                </span>
              )}
            </button>

            {/* Progress bar */}
            {isGenerating && (
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full progress-neon transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Right: Result Panel */}
          <div className="md:col-span-3">
            <div className="glass-card rounded-xl overflow-hidden h-full min-h-[480px] flex flex-col">
              {/* Result header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: result ? 'var(--neon-green)' : 'rgba(255,255,255,0.2)' }} />
                  <span className="text-xs font-mono-plex text-muted-foreground">РЕЗУЛЬТАТ</span>
                </div>
                {result && (
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs neon-btn">
                      <Icon name="Copy" size={12} />
                      Копировать
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs neon-btn">
                      <Icon name="Download" size={12} />
                      Сохранить
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 p-5 overflow-auto">
                {!result && !isGenerating && (
                  <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-16">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center animate-float"
                      style={{ background: 'rgba(0, 229, 255, 0.06)', border: '1px solid rgba(0, 229, 255, 0.15)' }}>
                      <Icon name="Sparkles" size={36} style={{ color: 'var(--neon-cyan)', opacity: 0.5 }} />
                    </div>
                    <div>
                      <p className="font-orbitron text-sm text-muted-foreground mb-1">ОЖИДАЮ ЗАПРОС</p>
                      <p className="text-xs text-muted-foreground opacity-60">Введи описание и нажми «Сгенерировать»</p>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <div className="h-full flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full animate-spin-slow"
                        style={{ background: 'conic-gradient(var(--neon-cyan), var(--neon-violet), transparent)' }} />
                      <div className="absolute inset-1 rounded-full flex items-center justify-center"
                        style={{ background: 'hsl(220, 20%, 7%)' }}>
                        <Icon name="Bot" size={24} style={{ color: 'var(--neon-cyan)' }} />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-mono-plex text-sm neon-text-cyan mb-1">НЕЙРОСЕТЬ РАБОТАЕТ</p>
                      <p className="text-xs text-muted-foreground">{Math.round(progress)}% завершено</p>
                    </div>
                  </div>
                )}

                {result && activeType !== 'image' && (
                  <pre className={`text-sm leading-relaxed whitespace-pre-wrap text-foreground ${activeType === 'code' ? 'font-mono-plex code-block p-4' : 'font-ibm'}`}>
                    {result}
                  </pre>
                )}

                {result && activeType === 'image' && (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-full aspect-square max-w-sm rounded-xl overflow-hidden"
                      style={{ border: '1px solid rgba(0, 229, 255, 0.2)' }}>
                      <img src="/placeholder.svg" alt="Generated" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;
