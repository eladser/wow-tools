import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ChevronLeft } from 'lucide-react';
import { TOOLS, GROUPS, GROUP_META } from './tools/registry';
import { Panel } from './components/Panel';
import { useSeason, useNews, useNotice, useLiveAffix } from './lib/content';
import { version } from '../package.json';

const ART = import.meta.env.BASE_URL + 'art/';
const GROUP_ART: Record<string, string> = {
  'Mythic+': ART + 'mplus.jpg',
  Raid: ART + 'raid.jpg',
  PvP: ART + 'pvp.jpg',
};

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const HOME = 'home';
const hallId = (group: string) => 'hall-' + group.toLowerCase().replace(/[^a-z]/g, '');

function toolFromHash(): string {
  const id = window.location.hash.replace(/^#\/?/, '');
  return TOOLS.some(t => t.id === id) ? id : HOME;
}

export default function App() {
  const [activeId, setActiveId] = useState(toolFromHash);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const season = useSeason();
  const liveAffix = useLiveAffix();
  const week = season.currentWeek();
  const rot = season.rotationForWeek(week);
  // prefer the live affix (accurate) over the guessed rotation
  const bargain = liveAffix?.affix_details[0]?.name.split(':').pop()?.trim() ?? rot.bargain;
  const second = liveAffix
    ? (liveAffix.title.includes('Tyrannical') ? 'Tyrannical' : 'Fortified')
    : rot.second;
  const ws = { week, bargain, second };

  useEffect(() => {
    const onHash = () => { setActiveId(toolFromHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const editing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      if (((e.ctrlKey || e.metaKey) && e.key === 'k') || (e.key === '/' && !editing)) {
        e.preventDefault();
        setPaletteOpen(true);
        setTimeout(() => searchRef.current?.focus(), 0);
      }
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const active = TOOLS.find(t => t.id === activeId) ?? null;

  const filtered = useMemo(() => {
    if (!query.trim()) return TOOLS;
    const q = query.toLowerCase();
    return TOOLS.filter(t => t.name.toLowerCase().includes(q) || t.keywords.includes(q) || t.desc.toLowerCase().includes(q));
  }, [query]);

  const go = (id: string) => {
    window.location.hash = id === HOME ? '' : id;
    setActiveId(id);
    setPaletteOpen(false);
    setQuery('');
  };

  const goHall = (group: string) => {
    const onHome = !TOOLS.some(t => t.id === activeId);
    go(HOME);
    // wait for home to render if we were inside a tool
    setTimeout(() => {
      document.getElementById(hallId(group))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, onHome ? 0 : 60);
  };

  return (
    <div className="min-h-dvh">
      <div className="grain" aria-hidden="true" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="max-w-340 mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <button onClick={() => go(HOME)} className="flex items-center group" aria-label="WoW Tools home">
            <img src={`${ART}wordmark.png`} alt=""
              className="h-8 w-auto opacity-95 group-hover:opacity-100 transition-opacity" />
          </button>

          <nav className="hidden md:flex items-center gap-1 ml-2">
            {GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => goHall(g)}
                className="px-2.5 py-1 text-sm text-muted hover:text-fg transition-colors font-heading tracking-wide"
                onMouseEnter={(e) => { e.currentTarget.style.color = GROUP_META[g].color; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
              >
                {g}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-faint border border-border rounded-md px-2.5 py-1">
              <span className="text-arcane">●</span>
              <span className="text-muted">{season.season.name}</span>
              <span>· wk {ws.week}</span>
              <span className="text-gold-bright">{ws.bargain}</span>
            </div>
            <button onClick={() => { setPaletteOpen(true); setTimeout(() => searchRef.current?.focus(), 0); }}
              className="flex items-center gap-2 text-muted hover:text-fg transition-colors" aria-label="Search tools">
              <Search className="w-4 h-4" />
              <kbd className="hidden lg:inline font-mono text-[11px] border border-border rounded px-1 text-faint">/</kbd>
            </button>
            <a href="https://github.com/eladser/wow-tools" target="_blank" rel="noopener noreferrer"
              className="text-faint hover:text-fg transition-colors" aria-label="GitHub">
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {active ? <ToolView toolId={active.id} onGo={go} /> : <Home onGo={go} ws={ws} seasonName={season.season.name} />}

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-340 mx-auto px-4 sm:px-6 py-6 flex items-center justify-between font-mono text-xs text-faint">
          <span>v{version} · data from raider.io</span>
          <span>Not affiliated with Blizzard Entertainment</span>
        </div>
      </footer>

      {/* Command palette */}
      {paletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 bg-bg/70 backdrop-blur-sm"
          onClick={() => setPaletteOpen(false)}>
          <Panel className="w-full max-w-xl" >
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <Search className="w-4 h-4 text-faint" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && filtered[0]) go(filtered[0].id); }}
                  placeholder="Search tools"
                  className="flex-1 bg-transparent text-fg placeholder:text-faint focus:outline-none font-mono text-sm"
                />
                <button onClick={() => setPaletteOpen(false)} className="text-faint hover:text-fg">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto py-1">
                {filtered.map((t) => (
                  <button key={t.id} onClick={() => go(t.id)}
                    className="w-full flex items-baseline gap-3 px-4 py-2 text-left hover:bg-elevated transition-colors">
                    <span className="text-sm text-fg">{t.name}</span>
                    <span className="font-mono text-[11px]" style={{ color: GROUP_META[t.group].color }}>{t.group}</span>
                    <span className="text-xs text-faint truncate ml-auto">{t.desc}</span>
                  </button>
                ))}
                {filtered.length === 0 && <p className="px-4 py-3 font-mono text-xs text-faint">No match</p>}
              </div>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}

function Home({ onGo, ws, seasonName }: {
  onGo: (id: string) => void;
  ws: { week: number; bargain: string; second: string };
  seasonName: string;
}) {
  const news = useNews();
  const notice = useNotice();

  return (
    <main>
      {/* Hero with art */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0" aria-hidden="true">
          <img src={`${ART}hero.jpg`} alt=""
            className="w-full h-full object-cover object-center opacity-60" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,9,19,0.55) 0%, rgba(11,9,19,0.75) 55%, var(--color-bg) 100%)' }} />
        </div>

        <div className="relative max-w-340 mx-auto px-4 sm:px-6 pt-20 pb-14 text-center">
          <p className="font-heading text-xs sm:text-sm tracking-[0.34em] uppercase text-arcane mb-4 animate-fade-in"
            style={{ textShadow: '0 0 20px rgba(176,107,255,0.6)' }}>
            {seasonName}
          </p>
          <h1 className="animate-rise">
            <img src={`${ART}wordmark.png`} alt="WoW Tools"
              className="mx-auto w-[min(560px,82vw)] h-auto"
              style={{ filter: 'drop-shadow(0 0 60px rgba(176,107,255,0.45))' }} />
          </h1>
          <p className="mt-6 text-base sm:text-lg text-fg/80 max-w-xl mx-auto animate-rise" style={{ animationDelay: '80ms' }}>
            Score planning, vault and upgrade math, affixes, and PvP goals. All in the browser, all current season.
          </p>

          <div className="mt-9 inline-flex items-center animate-rise" style={{ animationDelay: '160ms' }}>
            <div className="codex-panel rounded-sm px-5 py-2.5 flex items-center gap-4 font-mono text-sm">
              <span className="text-faint">Week {ws.week}</span>
              <span style={{ width: 1, height: 16, background: 'var(--color-border-strong)' }} />
              <span className="text-gold-bright">{ws.bargain}</span>
              <span className="text-muted">·</span>
              <span className="text-muted">{ws.second}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Notice banner */}
      {notice && (
        <div className="max-w-340 mx-auto px-4 sm:px-6 pt-6">
          <div className="codex-panel rounded-sm px-4 py-2.5 text-sm flex items-center gap-2"
            style={{ borderColor: notice.tone === 'warn' ? 'color-mix(in oklch, var(--color-warn) 50%, transparent)' : undefined }}>
            <span className={notice.tone === 'warn' ? 'text-warn' : 'text-arcane'}>◆</span>
            <span className="text-fg">{notice.text}</span>
          </div>
        </div>
      )}

      {/* Category halls */}
      <div className="max-w-340 mx-auto px-4 sm:px-6 py-12 space-y-12">
        {GROUPS.map((group, gi) => {
          const meta = GROUP_META[group];
          const tools = TOOLS.filter(t => t.group === group);
          return (
            <section key={group} id={hallId(group)} className="scroll-mt-20 animate-rise" style={{ animationDelay: `${gi * 90}ms` }}>
              {/* banner header */}
              <div className="relative rounded-sm overflow-hidden mb-4 border border-border"
                style={{ boxShadow: `inset 0 0 80px -28px ${meta.color}` }}>
                <img src={GROUP_ART[group]} alt="" aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover opacity-25" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, var(--color-bg) 14%, color-mix(in oklch, var(--color-bg) 55%, transparent) 65%, transparent)` }} />
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: meta.color, boxShadow: `0 0 16px ${meta.color}` }} />
                <div className="relative flex items-center gap-3.5 px-5 sm:px-6 py-4 sm:py-5">
                  <span className="grid place-items-center w-12 h-12 rounded-md font-display font-bold text-xl shrink-0"
                    style={{ color: meta.color, background: 'rgba(11,9,19,0.6)', boxShadow: `0 0 24px -4px ${meta.color}`, border: `1px solid color-mix(in oklch, ${meta.color} 55%, transparent)` }}>
                    {meta.sigil}
                  </span>
                  <div>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-wide" style={{ color: meta.color, textShadow: `0 0 26px ${meta.color}88` }}>{group}</h2>
                    <p className="text-sm text-muted mt-0.5">{meta.blurb}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tools.map((t) => (
                  <button key={t.id} onClick={() => onGo(t.id)}
                    className="group text-left codex-panel rounded-sm px-4 py-3.5 transition-transform duration-200 hover:-translate-y-0.5"
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(232,209,138,0.18), 0 0 0 1px color-mix(in oklch, ${meta.color} 45%, transparent), 0 14px 30px -14px ${meta.color}88`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ''; }}>
                    <span className="corner-bracket border-t border-l top-1 left-1" />
                    <span className="corner-bracket border-t border-r top-1 right-1" />
                    <span className="corner-bracket border-b border-l bottom-1 left-1" />
                    <span className="corner-bracket border-b border-r bottom-1 right-1" />
                    <h3 className="font-heading font-semibold text-fg tracking-wide group-hover:text-gold-bright transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-[13px] text-muted leading-snug mt-1">{t.desc}</p>
                  </button>
                ))}
              </div>
            </section>
          );
        })}

        {/* Dispatches */}
        {news.length > 0 && (
          <section className="animate-rise">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-display font-bold text-xl tracking-wide text-gold-bright">Dispatches</h2>
              <div className="rule-arcane flex-1" />
            </div>
            <div className="space-y-2.5">
              {news.map((n, i) => (
                <article key={i} className="codex-panel rounded-sm px-5 py-3.5">
                  <span className="corner-bracket border-t border-l top-1 left-1" />
                  <span className="corner-bracket border-b border-r bottom-1 right-1" />
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-arcane">{n.tag}</span>
                    <h3 className="font-heading font-semibold text-fg">{n.title}</h3>
                    <span className="font-mono text-xs text-faint ml-auto">{n.date}</span>
                  </div>
                  <p className="text-sm text-muted mt-1.5 leading-relaxed max-w-3xl">{n.body}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function ToolView({ toolId, onGo }: { toolId: string; onGo: (id: string) => void }) {
  const tool = TOOLS.find(t => t.id === toolId)!;
  const meta = GROUP_META[tool.group];
  const Body = tool.component;
  const siblings = TOOLS.filter(t => t.group === tool.group && t.id !== tool.id);

  return (
    <main className="max-w-340 mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => onGo(HOME)}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-gold-bright transition-colors mb-4 font-heading tracking-wide">
        <ChevronLeft className="w-4 h-4" />
        <span style={{ color: meta.color }}>{tool.group}</span>
      </button>

      <Panel>
        <div className="px-5 sm:px-7 py-4 border-b border-border flex items-baseline gap-3 flex-wrap"
          style={{ background: `linear-gradient(90deg, color-mix(in oklch, ${meta.color} 8%, transparent), transparent)` }}>
          <h1 className="font-display font-bold text-xl tracking-wide" style={{ color: meta.color }}>{tool.name}</h1>
          <p className="text-sm text-muted">{tool.desc}</p>
        </div>
        <div className="@container px-5 sm:px-7 py-6 animate-fade-in">
          <Body />
        </div>
      </Panel>

      {siblings.length > 0 && (
        <div className="mt-6">
          <div className="font-heading text-xs uppercase tracking-[0.2em] text-faint mb-2">More {tool.group}</div>
          <div className="flex flex-wrap gap-2">
            {siblings.map((s) => (
              <button key={s.id} onClick={() => onGo(s.id)} className="btn-secondary text-xs">
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
