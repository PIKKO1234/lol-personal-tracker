import React from 'react';
import { 
  Trophy, 
  Flame, 
  Crosshair, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  History, 
  PlusCircle, 
  Activity, 
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { MatchesManager } from '../utils/storage';

export default function Dashboard({ onNavigateToTracker, onNavigateToHistory, onSelectChampionForTracker }) {
  const aggregate = MatchesManager.getAggregateStats();
  const matches = MatchesManager.getMatches();
  const recentMatches = matches.slice(0, 4);

  const handleSeedDemoData = () => {
    MatchesManager.seedDemoMatches();
    window.location.reload();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl void-glass border border-void-500/40 p-6 sm:p-8 shadow-void-card">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-void-neon/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-void-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-800/80 border border-void-500/50 text-void-neon text-xs font-mono">
              <Activity className="w-3.5 h-3.5" />
              PANEL DOWODZENIA PUSTKI (v0.1)
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl tracking-wider text-white">
              Witaj w <span className="text-transparent bg-clip-text bg-gradient-to-r from-void-200 via-void-neon to-void-300">VoidTracker</span>
            </h1>
            <p className="text-xs sm:text-sm text-void-300 leading-relaxed">
              Twój prywatny system monitorowania wydajności w League of Legends. Analizuj mecze z algorytmem oceny ról, wyłapuj błędy, rozwijaj dyscyplinę taktyczną i śledź ewolucję swojej gry.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={onNavigateToTracker}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-void-600 via-void-500 to-void-neon hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-void hover:shadow-void-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Dodaj Nowy Mecz
            </button>
            {aggregate.totalMatches === 0 && (
              <button
                onClick={handleSeedDemoData}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-void-800/80 hover:bg-void-700/80 border border-void-600/60 text-void-200 text-xs font-semibold transition-all"
              >
                <Sparkles className="w-4 h-4 text-void-neon" />
                Wgraj Przykładowe Gry
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Winrate */}
        <div className="void-glass rounded-2xl p-5 border border-void-600/40 relative overflow-hidden group hover:border-void-neon/60 transition-all">
          <div className="flex items-center justify-between text-void-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Win Rate</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-black font-mono ${aggregate.winRate >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {aggregate.winRate}%
            </span>
            <span className="text-xs text-void-400 font-mono">
              ({aggregate.wins}W / {aggregate.losses}L)
            </span>
          </div>
          <div className="mt-2.5 w-full bg-void-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${aggregate.winRate}%` }}
            />
          </div>
        </div>

        {/* Avg KDA */}
        <div className="void-glass rounded-2xl p-5 border border-void-600/40 relative overflow-hidden group hover:border-void-neon/60 transition-all">
          <div className="flex items-center justify-between text-void-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Średnie KDA</span>
            <Crosshair className="w-4 h-4 text-void-neon" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">
              {aggregate.avgKda}
            </span>
            <span className="text-xs text-void-400">współczynnik</span>
          </div>
          <div className="text-[11px] text-void-300 mt-2 flex items-center gap-1">
            <Target className="w-3 h-3 text-void-neon" />
            <span>Mecze łącznie: <strong className="text-white">{aggregate.totalMatches}</strong></span>
          </div>
        </div>

        {/* Avg CS/min */}
        <div className="void-glass rounded-2xl p-5 border border-void-600/40 relative overflow-hidden group hover:border-void-neon/60 transition-all">
          <div className="flex items-center justify-between text-void-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Farma (CS/min)</span>
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-black font-mono ${aggregate.avgCsPerMin >= 7 ? 'text-emerald-400' : 'text-void-200'}`}>
              {aggregate.avgCsPerMin}
            </span>
            <span className="text-xs text-void-400 font-mono">CS / min</span>
          </div>
          <div className="text-[11px] text-void-300 mt-2">
            Cel rankingowy: <span className="font-mono text-emerald-400 font-bold">≥ 8.0</span>
          </div>
        </div>

        {/* Avg DPM */}
        <div className="void-glass rounded-2xl p-5 border border-void-600/40 relative overflow-hidden group hover:border-void-neon/60 transition-all">
          <div className="flex items-center justify-between text-void-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Średnie DPM</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-300">
              {aggregate.avgDpm}
            </span>
            <span className="text-xs text-void-400 font-mono">Dmg / min</span>
          </div>
          <div className="text-[11px] text-void-300 mt-2">
            Wizja: <span className="font-mono text-white font-bold">{aggregate.avgVisionPerMin}</span> VPM
          </div>
        </div>
      </div>

      {/* Middle Section: Top Champions & Recent Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Champions (5 cols) */}
        <div className="lg:col-span-5 void-glass rounded-2xl p-6 border border-void-600/40 space-y-4 shadow-void-card">
          <div className="flex items-center justify-between pb-3 border-b border-void-800">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-void-neon" />
              Najczęściej Grani Bohaterowie
            </h2>
            <span className="text-xs text-void-400 font-mono">Top 5</span>
          </div>

          {aggregate.topChampions.length > 0 ? (
            <div className="space-y-3">
              {aggregate.topChampions.map((champ, idx) => (
                <div
                  key={champ.name}
                  onClick={() => onSelectChampionForTracker && onSelectChampionForTracker(champ.name)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-void-900/60 hover:bg-void-800/80 border border-void-700/50 hover:border-void-neon cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold font-mono text-void-500 w-4">
                      #{idx + 1}
                    </span>
                    {champ.iconUrl ? (
                      <img
                        src={champ.iconUrl}
                        alt={champ.name}
                        className="w-9 h-9 rounded-lg border border-void-600 object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-void-800 border border-void-600 flex items-center justify-center text-xs font-bold text-white">
                        {champ.name.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-void-neon transition-colors">
                        {champ.name}
                      </div>
                      <div className="text-[10px] text-void-400">
                        {champ.count} {champ.count === 1 ? 'mecz' : 'mecze'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xs font-bold font-mono ${champ.winRate >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {champ.winRate}% WR
                    </div>
                    <div className="text-[10px] text-void-400 font-mono">
                      {champ.wins}W - {champ.count - champ.wins}L
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-void-400 text-xs">
              Brak rozegranych meczów. Dodaj swój pierwszy mecz!
            </div>
          )}
        </div>

        {/* Recent Matches Preview (7 cols) */}
        <div className="lg:col-span-7 void-glass rounded-2xl p-6 border border-void-600/40 space-y-4 shadow-void-card">
          <div className="flex items-center justify-between pb-3 border-b border-void-800">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
              <History className="w-4 h-4 text-void-neon" />
              Ostatnie Występy
            </h2>
            <button
              onClick={onNavigateToHistory}
              className="text-xs text-void-neon hover:text-white flex items-center gap-1 font-semibold transition-colors"
            >
              Zobacz wszystkie <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentMatches.length > 0 ? (
            <div className="space-y-2.5">
              {recentMatches.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-void-900/70 border border-void-700/60 hover:border-void-500 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.champion?.iconUrl}
                      alt={m.champion?.name}
                      className="w-10 h-10 rounded-xl border border-void-600 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{m.champion?.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          m.result === 'VICTORY'
                            ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                            : 'bg-rose-950/60 border border-rose-500/50 text-rose-300'
                        }`}>
                          {m.result === 'VICTORY' ? 'WIN' : 'LOSS'}
                        </span>
                      </div>
                      <div className="text-[11px] text-void-400 font-mono mt-0.5">
                        {m.kills}/{m.deaths}/{m.assists} • {m.cs} CS ({m.evaluation?.metrics?.csPerMin || 0}/m)
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                      <div className="text-xs font-mono text-void-200">
                        KP {m.evaluation?.metrics?.kpPercentage || 0}%
                      </div>
                      <div className="text-[10px] text-void-400 font-mono">
                        {Math.round(m.durationMinutes)} min
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-lg border ${m.evaluation?.gradeColor || 'border-void-500 text-white'}`}>
                      {m.evaluation?.grade || 'B'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <p className="text-xs text-void-400">
                Nie zarejestrowano jeszcze żadnego meczu w pamięci Pustki.
              </p>
              <button
                onClick={onNavigateToTracker}
                className="px-4 py-2 rounded-xl bg-void-800 hover:bg-void-700 text-void-neon text-xs font-semibold transition-colors"
              >
                Wpisz swój pierwszy mecz teraz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
