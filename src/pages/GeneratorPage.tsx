import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { generate } from '@/lib/generator';

type GenType = 'text' | 'code' | 'image';

const codeLanguages = ['Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Java', 'C++', 'Swift', 'PHP', 'SQL', 'Bash'];
const textStyles = ['Статья', 'Пост для соцсетей', 'Email', 'Сценарий', 'Описание товара', 'Идеи и брейншторм'];

const RUNNABLE_IN_BROWSER = ['JavaScript', 'TypeScript'];

const GeneratorPage = () => {
  const [activeType, setActiveType] = useState<GenType>('text');
  const [prompt, setPrompt] = useState('');
  const [selectedLang, setSelectedLang] = useState('Python');
  const [selectedStyle, setSelectedStyle] = useState('Статья');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [tokensUsed, setTokensUsed] = useState(0);
  const [runOutput, setRunOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const tabs: { id: GenType; label: string; icon: string; color: string }[] = [
    { id: 'text', label: 'Текст', icon: 'FileText', color: 'var(--neon-violet)' },
    { id: 'code', label: 'Код', icon: 'Code2', color: 'var(--neon-green)' },
    { id: 'image', label: 'Изображение', icon: 'Image', color: 'var(--neon-cyan)' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult('');
    setError('');
    setRunOutput('');
    setTokensUsed(0);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(p => p < 85 ? p + Math.random() * 8 : p);
    }, 300);

    try {
      const data = await generate(
        activeType === 'image' ? 'text' : activeType,
        prompt,
        selectedStyle,
        selectedLang,
      );
      setResult(data.result);
      setTokensUsed(data.tokens);
    } catch (e) {
      setError(String(e));
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setIsGenerating(false);
    }
  };

  const handleRunJS = () => {
    setIsRunning(true);
    setRunOutput('');

    // Собираем HTML конкатенацией чтобы </script> не закрыл тег раньше времени
    const scriptOpen = '<scr' + 'ipt>';
    const scriptClose = '</scr' + 'ipt>';
    const userCode = result;

    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>'
      + scriptOpen
      + `
      const logs = [];
      console.log = (...a) => { logs.push('▶ ' + a.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(' ')); };
      console.error = (...a) => { logs.push('✖ ' + a.map(String).join(' ')); };
      console.warn = (...a) => { logs.push('⚠ ' + a.map(String).join(' ')); };
      try {
        ${userCode}
        window.parent.postMessage({ type: 'nexus-run', logs: logs, error: null }, '*');
      } catch(e) {
        window.parent.postMessage({ type: 'nexus-run', logs: logs, error: e.message }, '*');
      }
      `
      + scriptClose
      + '</body></html>';

    const onMsg = (e: MessageEvent) => {
      if (e.data?.type !== 'nexus-run') return;
      window.removeEventListener('message', onMsg);
      const { logs, error: runErr } = e.data as { logs: string[]; error: string | null };
      if (runErr) {
        setRunOutput('✖ Ошибка: ' + runErr);
      } else if (logs.length > 0) {
        setRunOutput(logs.join('\n'));
      } else {
        setRunOutput('✓ Выполнено без вывода в консоль\n(добавь console.log() чтобы увидеть результат)');
      }
      setIsRunning(false);
    };

    window.addEventListener('message', onMsg);
    if (iframeRef.current) iframeRef.current.srcdoc = html;
    setTimeout(() => { window.removeEventListener('message', onMsg); setIsRunning(false); }, 10000);
  };

  const handleRunPython = () => {
    const prints = result.match(/print\(([^)]+)\)/g) || [];
    const output = prints.length > 0
      ? prints.map(m => '▶ ' + m.replace(/^print\(['"]?/, '').replace(/['"]?\)$/, '')).join('\n')
      : '✓ Нет print() — добавь вывод в код';
    setRunOutput(`⚙ Симуляция Python (браузер не поддерживает CPython):\n\n${output}`);
  };

  const handleRun = () => {
    if (RUNNABLE_IN_BROWSER.includes(selectedLang)) {
      handleRunJS();
    } else {
      handleRunPython();
    }
  };

  const copyResult = () => { if (result) navigator.clipboard.writeText(result); };
  const canRun = activeType === 'code' && !!result;

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="py-8 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-plex mb-4"
            style={{ background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.2)', color: 'var(--neon-cyan)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--neon-green)' }} />
            NEXUSGEN · ЛОКАЛЬНО · БЕЗ API
          </div>
          <h1 className="font-orbitron font-bold text-3xl md:text-4xl gradient-text">ГЕНЕРАТОР</h1>
        </div>

        {/* Type Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl w-fit"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveType(tab.id); setResult(''); setRunOutput(''); setError(''); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeType === tab.id ? '' : 'text-muted-foreground hover:text-foreground'
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

            {activeType === 'code' && (
              <div className="glass-card rounded-xl p-4">
                <label className="text-xs font-mono-plex text-muted-foreground mb-3 block tracking-wider">ЯЗЫК</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {codeLanguages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => { setSelectedLang(lang); setRunOutput(''); }}
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
                {RUNNABLE_IN_BROWSER.includes(selectedLang) && (
                  <p className="mt-3 text-xs font-mono-plex opacity-50" style={{ color: 'var(--neon-green)' }}>
                    ⚡ {selectedLang} поддерживает RUN в браузере
                  </p>
                )}
              </div>
            )}

            {activeType === 'text' && (
              <div className="glass-card rounded-xl p-4">
                <label className="text-xs font-mono-plex text-muted-foreground mb-3 block tracking-wider">ФОРМАТ</label>
                <div className="space-y-1.5">
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
                <label className="text-xs font-mono-plex text-muted-foreground mb-3 block tracking-wider">СТИЛЬ</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Реализм', 'Аниме', 'Цифровое', '3D рендер', 'Фото', 'Абстракция'].map(s => (
                    <button key={s}
                      className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Prompt */}
            <div className="glass-card rounded-xl p-4">
              <label className="text-xs font-mono-plex text-muted-foreground mb-3 block tracking-wider">
                {activeType === 'code' ? 'ЗАДАЧА' : activeType === 'image' ? 'ОПИСАНИЕ' : 'ТЕМА'}
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGenerate(); }}
                placeholder={
                  activeType === 'code'
                    ? `Напиши на ${selectedLang}: функцию для...`
                    : activeType === 'image'
                    ? 'Космический город, неоновые огни...'
                    : `${selectedStyle} о...`
                }
                rows={5}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none leading-relaxed"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-xs text-muted-foreground font-mono-plex opacity-50">
                  {prompt.length} симв. · Ctrl+Enter
                </span>
                <button onClick={() => setPrompt('')}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors">
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

            {isGenerating && (
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full progress-neon transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>

          {/* Right: Result Panel */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <div className="glass-card rounded-xl overflow-hidden flex flex-col" style={{ minHeight: 360 }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full transition-all duration-500" style={{
                    background: error ? '#ff4444' : result ? 'var(--neon-green)' : 'rgba(255,255,255,0.2)',
                    boxShadow: result && !error ? '0 0 8px var(--neon-green)' : 'none'
                  }} />
                  <span className="text-xs font-mono-plex text-muted-foreground">
                    РЕЗУЛЬТАТ{tokensUsed > 0 ? ` · ${tokensUsed} токенов` : ''}
                  </span>
                </div>
                {result && (
                  <div className="flex items-center gap-2">
                    {canRun && (
                      <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold font-mono-plex tracking-wider transition-all duration-200 disabled:opacity-50"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0,255,136,0.25), rgba(0,200,100,0.15))',
                          border: '1px solid rgba(0, 255, 136, 0.6)',
                          color: 'var(--neon-green)',
                          boxShadow: isRunning ? 'none' : '0 0 16px rgba(0, 255, 136, 0.3)',
                        }}
                      >
                        {isRunning
                          ? <><Icon name="Loader2" size={12} className="animate-spin" />  ЗАПУСК</>
                          : <><Icon name="Play" size={13} />  RUN</>
                        }
                      </button>
                    )}
                    <button onClick={copyResult}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs neon-btn">
                      <Icon name="Copy" size={12} />
                      Копировать
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-5 overflow-auto">
                {!result && !isGenerating && !error && (
                  <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-16">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center animate-float"
                      style={{ background: 'rgba(0, 229, 255, 0.06)', border: '1px solid rgba(0, 229, 255, 0.15)' }}>
                      <Icon name="Sparkles" size={36} style={{ color: 'var(--neon-cyan)', opacity: 0.5 }} />
                    </div>
                    <p className="font-orbitron text-sm text-muted-foreground">ОЖИДАЮ ЗАПРОС</p>
                    <p className="text-xs text-muted-foreground opacity-50">Введи описание и нажми «Сгенерировать»</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="h-full flex flex-col items-center justify-center gap-6">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full animate-spin-slow"
                        style={{ background: 'conic-gradient(var(--neon-cyan), var(--neon-violet), transparent)' }} />
                      <div className="absolute inset-1 rounded-full flex items-center justify-center"
                        style={{ background: 'hsl(220, 20%, 7%)' }}>
                        <Icon name="Bot" size={24} style={{ color: 'var(--neon-cyan)' }} />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-mono-plex text-sm neon-text-cyan mb-1">NEXUSGEN РАБОТАЕТ</p>
                      <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
                    </div>
                  </div>
                )}

                {error && !isGenerating && (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-10">
                    <Icon name="AlertTriangle" size={36} style={{ color: '#ff4444' }} />
                    <div>
                      <p className="font-orbitron text-sm mb-2" style={{ color: '#ff4444' }}>ОШИБКА</p>
                      <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
                    </div>
                  </div>
                )}

                {result && !error && activeType !== 'image' && (
                  <pre className={`text-sm leading-relaxed whitespace-pre-wrap text-foreground ${
                    activeType === 'code' ? 'font-mono-plex code-block p-4' : 'font-ibm'
                  }`}>
                    {result}
                  </pre>
                )}

                {activeType === 'image' && !isGenerating && (
                  <div className="flex flex-col items-center justify-center h-full gap-5 py-10">
                    <div className="relative w-64 h-64 rounded-2xl overflow-hidden"
                      style={{ border: '1px solid rgba(0,229,255,0.25)' }}>
                      <img src="/placeholder.svg" alt="Generated" className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                        style={{ background: 'rgba(5,8,15,0.7)' }}>
                        <Icon name="Image" size={40} style={{ color: 'var(--neon-cyan)', opacity: 0.5 }} />
                        <p className="font-orbitron text-xs text-center px-4" style={{ color: 'var(--neon-cyan)', opacity: 0.7 }}>
                          ГЕНЕРАЦИЯ ИЗОБРАЖЕНИЙ<br/>ТРЕБУЕТ API-КЛЮЧ
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center max-w-xs opacity-60">
                      Для работы этого раздела нужен ключ DALL·E или Stable Diffusion.
                      Пока используй вкладки «Текст» или «Код».
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Console Output */}
            {activeType === 'code' && (runOutput || isRunning) && (
              <div className="rounded-xl overflow-hidden animate-fade-in"
                style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,255,136,0.25)' }}>
                <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: 'var(--neon-green)', boxShadow: '0 0 6px var(--neon-green)' }} />
                  </div>
                  <span className="text-xs font-mono-plex text-muted-foreground">
                    console · {selectedLang}
                    {RUNNABLE_IN_BROWSER.includes(selectedLang) && (
                      <span className="ml-2 opacity-50">· live sandbox</span>
                    )}
                  </span>
                </div>
                <div className="p-4 min-h-12">
                  {isRunning ? (
                    <span className="text-xs font-mono-plex flex items-center gap-2" style={{ color: 'var(--neon-green)' }}>
                      <Icon name="Loader2" size={12} className="animate-spin" />
                      Выполняю...
                    </span>
                  ) : (
                    <pre className="text-xs font-mono-plex leading-relaxed whitespace-pre-wrap"
                      style={{ color: runOutput.startsWith('✖') ? '#ff6b6b' : 'var(--neon-green)' }}>
                      {runOutput}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {/* Hidden sandbox iframe */}
            <iframe ref={iframeRef} sandbox="allow-scripts" title="nexus-runner" className="hidden" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;