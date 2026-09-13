import React, { useState, useMemo } from 'react';
import { History, Search, Filter, Trash2, PlusCircle, Sparkles, Trophy } from 'lucide-react';
import MatchCard from './MatchCard';
import { MatchesManager } from '../utils/storage';

export default function MatchHistory({ onNavigateToTracker }) {
  const [matches, setMatches] = useState(() => MatchesManager.getMatches());
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const handleDeleteMatch = (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten mecz z kroniki Pustki?')) {
      const updated = MatchesManager.deleteMatch(id);
      setMatches(updated);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Czy na pewno chcesz usunąć całą historię meczów? Tej operacji nie można cofnąć.')) {
      MatchesManager.clearAllMatches();
      setMatches([]);
    }
  };

  const handleSeedDemo = () => {
    const demo = MatchesManager.seedDemoMatches();
    setMatches(demo);
  };

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const champName = m.champion?.name || '';
      const matchesSearch = champName.toLowerCase().includes(search.toLowerCase());
      const matchesResult = resultFilter === 'ALL' || m.result === resultFilter;
      const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
      return matchesSearch && matchesResult && matchesRole;
    });
  }, [matches, search, resultFilter, roleFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="void-glass rounded-2xl p-6 sm:p-7 border border-void-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-void-card">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-800/80 border border-void-500/50 text-void-neon text-xs font-mono mb-2">
            <History className="w-3.5 h-3.5" />
            KRONIKA ROZEGRANYCH MECZÓW
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-wider text-white">
            Historia Gier i Ewolucja Formy
          </h1>
          <p className="text-xs sm:text-sm text-void-300 mt-1 max-w-2xl">
            Przeglądaj wszystkie zapisane mecze, sprawdzaj oceny D- do S+, analizuj wskaźniki per-minuta i wracaj do notatek z gier.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateToTracker}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-void-600 to-void-neon hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-void transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Wpisz Mecz
          </button>
          {matches.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2.5 rounded-xl bg-void-900/80 hover:bg-rose-950/40 border border-void-700/60 hover:border-rose-500/60 text-void-400 hover:text-rose-400 transition-colors"
              title="Wyczyść całą historię"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 void-glass rounded-2xl p-4 border border-void-700/50">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-void-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtruj po postaci..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-void-900/90 border border-void-700 text-xs text-white placeholder-void-500 focus:outline-none focus:border-void-neon"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Result Filter */}
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-void-900/90 border border-void-700 text-xs text-void-200 focus:outline-none focus:border-void-neon"
          >
            <option value="ALL">Wszystkie wyniki</option>
            <option value="VICTORY">Tylko Zwycięstwa (Win)</option>
            <option value="DEFEAT">Tylko Porażki (Loss)</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-void-900/90 border border-void-700 text-xs text-void-200 focus:outline-none focus:border-void-neon"
          >
            <option value="ALL">Wszystkie pozycje</option>
            <option value="TOP">Góra (Top)</option>
            <option value="JUNGLE">Dżungla (Jungle)</option>
            <option value="MID">Środek (Mid)</option>
            <option value="BOT">Dół (Bot/ADC)</option>
            <option value="SUPPORT">Wsparcie (Support)</option>
          </select>

          <span className="text-xs font-mono text-void-400 ml-2">
            Wyniki: {filteredMatches.length} / {matches.length}
          </span>
        </div>
      </div>

      {/* Matches List */}
      {filteredMatches.length > 0 ? (
        <div className="space-y-3.5">
          {filteredMatches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              onDelete={handleDeleteMatch}
            />
          ))}
        </div>
      ) : (
        <div className="void-glass rounded-2xl p-12 border border-void-800 text-center space-y-4">
          <History className="w-12 h-12 mx-auto text-void-500" />
          <h3 className="font-display font-bold text-lg text-white">
            Brak meczów spełniających kryteria
          </h3>
          <p className="text-xs text-void-400 max-w-sm mx-auto">
            {matches.length === 0
              ? 'Nie zarejestrowano jeszcze żadnego meczu. Możesz dodać swój pierwszy mecz lub załadować przykładowe dane demonstracyjne.'
              : 'Zmień filtry lub wyszukiwanie, aby zobaczyć pozostałe mecze.'}
          </p>
          {matches.length === 0 && (
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleSeedDemo}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-void-800 hover:bg-void-700 text-void-200 text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-4 h-4 text-void-neon" />
                Załaduj 3 przykładowe gry
              </button>
              <button
                onClick={onNavigateToTracker}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-void-600 to-void-neon text-white text-xs font-bold transition-transform hover:scale-105"
              >
                <PlusCircle className="w-4 h-4" />
                Wpisz Mecz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
