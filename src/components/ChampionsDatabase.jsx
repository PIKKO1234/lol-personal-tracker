import React, { useState, useMemo } from 'react';
import { Search, Filter, Shield, Sparkles, BookOpen, ExternalLink, Zap, Crosshair, X } from 'lucide-react';
import championsData from '../data/champions.json';

const TAG_TRANSLATIONS = {
  All: 'Wszyscy',
  Assassin: 'Zabójca',
  Fighter: 'Wojownik',
  Mage: 'Mag',
  Marksman: 'Strzelec',
  Support: 'Wsparcie',
  Tank: 'Obrońca'
};

export default function ChampionsDatabase({ onSelectForTracker }) {
  const allChampions = championsData.champions || [];
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeChampionModal, setActiveChampionModal] = useState(null);

  const filteredChampions = useMemo(() => {
    return allChampions.filter((champ) => {
      const matchesSearch =
        champ.name.toLowerCase().includes(search.toLowerCase()) ||
        champ.title.toLowerCase().includes(search.toLowerCase());

      const matchesTag =
        selectedTag === 'All' ||
        (champ.tags && champ.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });
  }, [allChampions, search, selectedTag]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header & Stats Banner */}
      <div className="void-glass rounded-2xl p-6 sm:p-7 border border-void-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-void-card">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-800/80 border border-void-500/50 text-void-neon text-xs font-mono mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            LOKALNA BAZA DANYCH RIOT DATA DRAGON (PL)
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-wider text-white">
            Kodeks Bohaterów League of Legends
          </h1>
          <p className="text-xs sm:text-sm text-void-300 mt-1 max-w-2xl">
            Pełny zbiór wszystkich <strong className="text-void-neon">{allChampions.length} bohaterów</strong> z oficjalnymi portretami, polską lokalizacją, rolami i wskaźnikami bojowymi.
          </p>
        </div>

        <div className="text-right shrink-0 px-4 py-2.5 rounded-xl bg-void-900/80 border border-void-700/60 font-mono text-xs text-void-300">
          <div>Wersja patcha: <span className="text-white font-bold">{championsData.version}</span></div>
          <div className="text-[10px] text-void-400 mt-0.5">Znaleziono: {filteredChampions.length} postaci</div>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-void-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj bohatera (np. Kai'Sa, Yasuo)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-void-900/90 border border-void-700/70 text-sm text-white placeholder-void-500 focus:outline-none focus:border-void-neon focus:ring-1 focus:ring-void-neon transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-void-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tag Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {Object.entries(TAG_TRANSLATIONS).map(([tagKey, tagLabel]) => {
            const isActive = selectedTag === tagKey;
            return (
              <button
                key={tagKey}
                onClick={() => setSelectedTag(tagKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-void-600 to-void-500 text-white border border-void-neon shadow-void'
                    : 'bg-void-900/70 border border-void-800 text-void-400 hover:text-white hover:bg-void-800'
                }`}
              >
                {tagLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Champions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {filteredChampions.map((c) => (
          <div
            key={c.id}
            onClick={() => setActiveChampionModal(c)}
            className="group relative overflow-hidden rounded-2xl void-glass border border-void-700/50 hover:border-void-neon/80 p-3 flex flex-col items-center text-center cursor-pointer transition-all hover:scale-[1.03] hover:shadow-void"
          >
            {/* Champion Icon */}
            <div className="relative mb-2">
              <img
                src={c.iconUrl}
                alt={c.name}
                loading="lazy"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-void-600/70 object-cover group-hover:border-void-neon transition-colors shadow-md"
              />
              <div className="absolute inset-0 rounded-xl bg-void-neon/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Name & Title */}
            <div className="w-full">
              <h3 className="text-xs font-bold text-white group-hover:text-void-neon transition-colors truncate">
                {c.name}
              </h3>
              <p className="text-[10px] text-void-400 truncate mt-0.5">
                {c.title}
              </p>
            </div>

            {/* Tags badges */}
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {c.tags?.slice(0, 1).map((t) => (
                <span
                  key={t}
                  className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-void-800/80 border border-void-600/50 text-void-300"
                >
                  {TAG_TRANSLATIONS[t] || t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredChampions.length === 0 && (
        <div className="text-center py-16 void-glass rounded-2xl border border-void-800">
          <p className="text-void-400 text-sm">Nie znaleziono bohatera o nazwie "{search}".</p>
        </div>
      )}

      {/* Champion Detail Modal */}
      {activeChampionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl void-glass rounded-3xl border border-void-500/50 overflow-hidden shadow-void-lg">
            {/* Close Button */}
            <button
              onClick={() => setActiveChampionModal(null)}
              className="absolute top-4 right-4 z-20 p-2 text-void-300 hover:text-white rounded-full bg-void-950/60 hover:bg-void-900 border border-void-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Splash Art Banner */}
            <div className="relative h-48 sm:h-64 w-full overflow-hidden">
              <img
                src={activeChampionModal.splashUrl}
                alt={activeChampionModal.name}
                className="w-full h-full object-cover object-top filter brightness-75 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0417] via-void-950/40 to-transparent" />
              
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={activeChampionModal.iconUrl}
                    alt={activeChampionModal.name}
                    className="w-16 h-16 rounded-2xl border-2 border-void-400 object-cover shadow-void"
                  />
                  <div>
                    <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                      {activeChampionModal.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-void-neon font-medium">
                      {activeChampionModal.title}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex gap-1.5">
                  {activeChampionModal.tags?.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono uppercase bg-void-900/90 border border-void-500/50 text-void-200"
                    >
                      {TAG_TRANSLATIONS[t] || t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Lore blurb */}
              <div>
                <h4 className="text-xs font-display font-bold uppercase tracking-wider text-void-400 mb-1.5">
                  Biografia i Przeznaczenie
                </h4>
                <p className="text-xs sm:text-sm text-void-200 leading-relaxed italic">
                  "{activeChampionModal.blurb}"
                </p>
              </div>

              {/* Combat Meters (Attack, Defense, Magic, Difficulty) */}
              {activeChampionModal.info && (
                <div>
                  <h4 className="text-xs font-display font-bold uppercase tracking-wider text-void-400 mb-3">
                    Profil Taktyczny (Riot Combat Rating)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-void-900/80 border border-void-800">
                      <div className="flex justify-between text-[11px] text-void-400 mb-1">
                        <span>Atak</span>
                        <span className="font-bold text-white">{activeChampionModal.info.attack} / 10</span>
                      </div>
                      <div className="w-full bg-void-950 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: `${activeChampionModal.info.attack * 10}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-void-900/80 border border-void-800">
                      <div className="flex justify-between text-[11px] text-void-400 mb-1">
                        <span>Obrona</span>
                        <span className="font-bold text-white">{activeChampionModal.info.defense} / 10</span>
                      </div>
                      <div className="w-full bg-void-950 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${activeChampionModal.info.defense * 10}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-void-900/80 border border-void-800">
                      <div className="flex justify-between text-[11px] text-void-400 mb-1">
                        <span>Magia</span>
                        <span className="font-bold text-white">{activeChampionModal.info.magic} / 10</span>
                      </div>
                      <div className="w-full bg-void-950 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-500 h-full rounded-full"
                          style={{ width: `${activeChampionModal.info.magic * 10}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-void-900/80 border border-void-800">
                      <div className="flex justify-between text-[11px] text-void-400 mb-1">
                        <span>Trudność</span>
                        <span className="font-bold text-white">{activeChampionModal.info.difficulty} / 10</span>
                      </div>
                      <div className="w-full bg-void-950 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-500 h-full rounded-full"
                          style={{ width: `${activeChampionModal.info.difficulty * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action: Use in Tracker */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-void-800">
                <button
                  type="button"
                  onClick={() => setActiveChampionModal(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-void-300 hover:text-white transition-colors"
                >
                  Zamknij
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectForTracker(activeChampionModal);
                    setActiveChampionModal(null);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-void-600 via-void-500 to-void-neon hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-void transition-all"
                >
                  <Crosshair className="w-4 h-4" />
                  Wybierz do Analizatora Meczu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
