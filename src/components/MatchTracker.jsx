import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Sword, 
  ShieldAlert, 
  Eye, 
  Coins, 
  Clock, 
  Trophy, 
  Skull, 
  CheckCircle2, 
  Brain, 
  Save, 
  RefreshCw,
  Search,
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { evaluateMatchPerformance, ROLE_DEFINITIONS, MENTAL_TAGS } from '../utils/analyzer';
import { MatchesManager } from '../utils/storage';
import championsData from '../data/champions.json';

export default function MatchTracker({ onMatchSaved, preselectedChampion }) {
  const allChampions = championsData.champions || [];

  // Champion search & selection
  const [championSearch, setChampionSearch] = useState('');
  const [selectedChampion, setSelectedChampion] = useState(
    preselectedChampion || allChampions.find(c => c.id === 'Kaisa') || allChampions[0]
  );
  const [isChampDropdownOpen, setIsChampDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Form inputs
  const [role, setRole] = useState('BOT');
  const [result, setResult] = useState('VICTORY');
  const [queueType, setQueueType] = useState('RANKED_SOLO');
  const [durationMin, setDurationMin] = useState(28);
  const [durationSec, setDurationSec] = useState(30);

  // Combat & Eco stats
  const [kills, setKills] = useState(12);
  const [deaths, setDeaths] = useState(2);
  const [assists, setAssists] = useState(7);
  const [cs, setCs] = useState(240);
  const [damage, setDamage] = useState(31500);
  const [visionScore, setVisionScore] = useState(26);
  const [gold, setGold] = useState(15800);
  const [teamKills, setTeamKills] = useState(28);

  // Mental & notes
  const [mentalTag, setMentalTag] = useState('focused');
  const [focusLevel, setFocusLevel] = useState(5);
  const [note, setNote] = useState('');

  // Evaluation state
  const [evaluation, setEvaluation] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update selected champion if prop changes
  useEffect(() => {
    if (preselectedChampion) {
      setSelectedChampion(preselectedChampion);
      setChampionSearch('');
    }
  }, [preselectedChampion]);

  // Click outside to close champion dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsChampDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredChampions = allChampions.filter(c => 
    c.name.toLowerCase().includes(championSearch.toLowerCase()) ||
    c.title.toLowerCase().includes(championSearch.toLowerCase())
  ).slice(0, 10);

  // Trigger evaluation
  const handleAnalyze = (e) => {
    if (e) e.preventDefault();
    const durationMinutes = Number(durationMin) + (Number(durationSec) / 60);

    const stats = {
      champion: selectedChampion,
      role,
      result,
      queueType,
      durationMinutes: Math.max(durationMinutes, 5),
      kills: Number(kills) || 0,
      deaths: Number(deaths) || 0,
      assists: Number(assists) || 0,
      cs: Number(cs) || 0,
      damage: Number(damage) || 0,
      visionScore: Number(visionScore) || 0,
      gold: Number(gold) || 0,
      teamKills: Number(teamKills) || Math.max(Number(kills) + Number(assists), 1),
      mentalTag,
      focusLevel,
      note
    };

    const evalResult = evaluateMatchPerformance(stats);
    setEvaluation(evalResult);
    setSaveSuccess(false);

    // Trigger celebratory void confetti if high score
    if (evalResult.grade === 'S+' || evalResult.grade === 'S') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#d946ef', '#2dd4bf', '#fbbf24']
      });
    }
  };

  // Save to history
  const handleSaveMatch = () => {
    if (!evaluation) return;
    const durationMinutes = Number(durationMin) + (Number(durationSec) / 60);

    const matchData = {
      champion: selectedChampion,
      role,
      result,
      queueType,
      durationMinutes,
      kills: Number(kills) || 0,
      deaths: Number(deaths) || 0,
      assists: Number(assists) || 0,
      cs: Number(cs) || 0,
      damage: Number(damage) || 0,
      visionScore: Number(visionScore) || 0,
      gold: Number(gold) || 0,
      teamKills: Number(teamKills) || Math.max(Number(kills) + Number(assists), 1),
      mentalTag,
      focusLevel,
      note,
      evaluation
    };

    MatchesManager.saveMatch(matchData);
    setSaveSuccess(true);
    if (onMatchSaved) onMatchSaved();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl void-glass border border-void-500/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-800/80 border border-void-500/40 text-void-300 text-xs font-mono mb-2">
            <Zap className="w-3.5 h-3.5 text-void-neon" />
            ALGORYTM ANALITYCZNY PUSTKI v0.1
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-white">
            Analizator Wyników Meczowych
          </h1>
          <p className="text-sm text-void-300 mt-1 max-w-2xl">
            Wprowadź statystyki z pomeczowego lobby. System przeliczy wskaźniki per-minuta, porówna je ze standardami dla Twojej roli i wygeneruje ocenę od <span className="font-bold text-amber-300">D- do S+</span> wraz ze wskazówkami Void Coacha.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            // Quick Void example (Kai'Sa carry)
            setSelectedChampion(allChampions.find(c => c.id === 'Kaisa') || allChampions[0]);
            setRole('BOT');
            setResult('VICTORY');
            setDurationMin(29);
            setDurationSec(15);
            setKills(13);
            setDeaths(2);
            setAssists(8);
            setCs(264);
            setDamage(33800);
            setVisionScore(29);
            setGold(16400);
            setTeamKills(30);
            setMentalTag('focused');
            setFocusLevel(5);
            setNote('Perfekcyjne pozycjonowanie w teamfightach, wygrana linia ze wsparciem Nautilusa.');
          }}
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-void-800/80 hover:bg-void-700/80 border border-void-500/40 text-void-200 hover:text-white text-xs font-semibold transition-all shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-void-neon" />
          Załaduj Wzorzec (Kai'Sa S+)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT FORM (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleAnalyze} className="void-glass rounded-2xl p-6 sm:p-7 border border-void-500/40 space-y-6 shadow-void-card">
            {/* Section 1: Champion & Role Selection */}
            <div className="space-y-4">
              <h2 className="text-sm font-display font-bold uppercase tracking-wider text-void-200 flex items-center gap-2">
                <Sword className="w-4 h-4 text-void-neon" />
                1. Wybór Bohatera i Pozycji
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Champion Selector */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-xs font-medium text-void-300 mb-1.5">
                    Bohater (Baza 173 postaci)
                  </label>
                  <div 
                    onClick={() => setIsChampDropdownOpen(!isChampDropdownOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl bg-void-900/90 border border-void-700/80 hover:border-void-neon cursor-pointer transition-all"
                  >
                    <img
                      src={selectedChampion.iconUrl}
                      alt={selectedChampion.name}
                      className="w-10 h-10 rounded-lg border border-void-500/50 object-cover shrink-0"
                    />
                    <div className="truncate flex-1">
                      <div className="font-bold text-sm text-white leading-tight truncate">
                        {selectedChampion.name}
                      </div>
                      <div className="text-[11px] text-void-400 truncate">
                        {selectedChampion.title}
                      </div>
                    </div>
                  </div>

                  {/* Dropdown search */}
                  {isChampDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-30 void-glass rounded-xl border border-void-500/60 p-2 shadow-void-lg max-h-72 overflow-y-auto">
                      <div className="relative mb-2">
                        <Search className="w-3.5 h-3.5 text-void-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          autoFocus
                          value={championSearch}
                          onChange={(e) => setChampionSearch(e.target.value)}
                          placeholder="Szukaj bohatera..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-void-950 border border-void-700 text-xs text-white placeholder-void-500 focus:outline-none focus:border-void-neon"
                        />
                      </div>
                      <div className="space-y-1">
                        {filteredChampions.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setSelectedChampion(c);
                              setIsChampDropdownOpen(false);
                            }}
                            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-void-700/60 cursor-pointer transition-colors"
                          >
                            <img src={c.iconUrl} alt={c.name} className="w-8 h-8 rounded border border-void-600 object-cover" />
                            <div>
                              <div className="text-xs font-semibold text-white">{c.name}</div>
                              <div className="text-[10px] text-void-400">{c.title}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Role Picker */}
                <div>
                  <label className="block text-xs font-medium text-void-300 mb-1.5">
                    Pozycja na Mapie (Rola)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-void-900/90 border border-void-700/80 text-sm text-white focus:outline-none focus:border-void-neon"
                  >
                    {Object.entries(ROLE_DEFINITIONS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.icon} {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Match Result & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-void-300 mb-1.5">
                    Wynik Meczu
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setResult('VICTORY')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        result === 'VICTORY'
                          ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-void-900/60 border border-void-800 text-void-400 hover:text-void-200'
                      }`}
                    >
                      Zwycięstwo
                    </button>
                    <button
                      type="button"
                      onClick={() => setResult('DEFEAT')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        result === 'DEFEAT'
                          ? 'bg-rose-600/30 border border-rose-500 text-rose-300 shadow-sm'
                          : 'bg-void-900/60 border border-void-800 text-void-400 hover:text-void-200'
                      }`}
                    >
                      Porażka
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-void-300 mb-1.5">
                    Kolejka
                  </label>
                  <select
                    value={queueType}
                    onChange={(e) => setQueueType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-void-900/90 border border-void-700/80 text-xs text-white focus:outline-none focus:border-void-neon"
                  >
                    <option value="RANKED_SOLO">Ranked Solo/Duo</option>
                    <option value="RANKED_FLEX">Ranked Flex</option>
                    <option value="NORMAL">Normal Draft</option>
                    <option value="ARAM">ARAM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-void-300 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-void-400" />
                    Czas Gry (min : sek)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="5"
                      max="90"
                      value={durationMin}
                      onChange={(e) => setDurationMin(e.target.value)}
                      className="w-1/2 px-2.5 py-1.5 rounded-xl bg-void-900/90 border border-void-700 text-center text-xs font-mono text-white"
                      placeholder="28"
                    />
                    <span className="text-void-400">:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={durationSec}
                      onChange={(e) => setDurationSec(e.target.value)}
                      className="w-1/2 px-2.5 py-1.5 rounded-xl bg-void-900/90 border border-void-700 text-center text-xs font-mono text-white"
                      placeholder="30"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Combat Stats */}
            <div className="space-y-4 pt-4 border-t border-void-800/80">
              <h2 className="text-sm font-display font-bold uppercase tracking-wider text-void-200 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-void-neon" />
                2. Statystyki Bojowe i KDA
              </h2>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-emerald-400 mb-1">
                    Zabójstwa (Kills)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={kills}
                    onChange={(e) => setKills(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-void-900/90 border border-emerald-500/40 text-center font-bold text-sm text-emerald-300 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-rose-400 mb-1">
                    Zgony (Deaths)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={deaths}
                    onChange={(e) => setDeaths(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-void-900/90 border border-rose-500/40 text-center font-bold text-sm text-rose-300 focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-cyan-400 mb-1">
                    Asysty (Assists)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={assists}
                    onChange={(e) => setAssists(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-void-900/90 border border-cyan-500/40 text-center font-bold text-sm text-cyan-300 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-void-300 mb-1" title="Potrzebne do wyliczenia Kill Participation (KP%)">
                    Kille Drużyny
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={teamKills}
                    onChange={(e) => setTeamKills(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-void-900/90 border border-void-600 text-center font-bold text-sm text-white focus:outline-none focus:border-void-neon"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Economy & Vision */}
            <div className="space-y-4 pt-4 border-t border-void-800/80">
              <h2 className="text-sm font-display font-bold uppercase tracking-wider text-void-200 flex items-center gap-2">
                <Coins className="w-4 h-4 text-void-neon" />
                3. Farma, Obrażenia i Wizja
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-void-300 mb-1">
                    CS (Miniony/Potwory)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={cs}
                    onChange={(e) => setCs(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-void-900/90 border border-void-700 text-center font-bold text-sm text-white focus:outline-none focus:border-void-neon"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-void-300 mb-1">
                    Obrażenia (Damage)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={damage}
                    onChange={(e) => setDamage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-void-900/90 border border-void-700 text-center font-bold text-sm text-white focus:outline-none focus:border-void-neon"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-void-300 mb-1">
                    Wynik Wizji (Vision)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={visionScore}
                    onChange={(e) => setVisionScore(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-void-900/90 border border-void-700 text-center font-bold text-sm text-white focus:outline-none focus:border-void-neon"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-void-300 mb-1">
                    Złoto (Gold)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={gold}
                    onChange={(e) => setGold(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-void-900/90 border border-void-700 text-center font-bold text-sm text-white focus:outline-none focus:border-void-neon"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Self-Reflection & Mental */}
            <div className="space-y-4 pt-4 border-t border-void-800/80">
              <h2 className="text-sm font-display font-bold uppercase tracking-wider text-void-200 flex items-center gap-2">
                <Brain className="w-4 h-4 text-void-neon" />
                4. Stan Psychiczny i Wnioski (Personal Context)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-void-300 mb-1.5">
                    Twój Mental podczas gry
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {MENTAL_TAGS.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => setMentalTag(tag.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          mentalTag === tag.id
                            ? `${tag.color} ring-1 ring-white/20 shadow-sm font-bold scale-[1.02]`
                            : 'border-void-800 bg-void-900/50 text-void-400 hover:text-void-200'
                        }`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-void-300 mb-1.5">
                    Poziom skupienia (1 - 5)
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFocusLevel(lvl)}
                        className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                          focusLevel >= lvl
                            ? 'bg-gradient-to-br from-void-500 to-void-neon text-white shadow-void'
                            : 'bg-void-900 border border-void-800 text-void-500'
                        }`}
                      >
                        ★{lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-void-300 mb-1.5">
                  Lekcja na przyszłość / Notatka taktyczna ("One key takeaway")
                </label>
                <textarea
                  rows="2"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Np. Lepiej kontrolować falę przed 3:15, nie gankować bez wizji w rzece, trzymać Flash na Malphite'a..."
                  className="w-full px-3.5 py-2 rounded-xl bg-void-900/90 border border-void-700/80 text-xs text-white placeholder-void-500 focus:outline-none focus:border-void-neon"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-display font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-void-600 via-void-500 to-void-neon text-white shadow-void hover:shadow-void-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              Przeanalizuj Mecz (Pustka Ocenia)
            </button>
          </form>
        </div>

        {/* EVALUATION OUTPUT PANEL (5 cols) */}
        <div className="lg:col-span-5">
          {evaluation ? (
            <div className="void-glass rounded-2xl p-6 border border-void-500/50 space-y-6 shadow-void-card sticky top-24 animate-fadeIn">
              {/* Champion & Grade Header */}
              <div className="flex items-center justify-between pb-4 border-b border-void-800">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={selectedChampion.iconUrl}
                      alt={selectedChampion.name}
                      className="w-14 h-14 rounded-2xl border-2 border-void-400 object-cover shadow-void"
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.5 rounded-full bg-void-950 border border-void-600 text-white font-bold">
                      {ROLE_DEFINITIONS[role]?.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-white">
                      {selectedChampion.name}
                    </h3>
                    <p className="text-xs text-void-300">
                      {ROLE_DEFINITIONS[role]?.label} • {result === 'VICTORY' ? '🏆 Zwycięstwo' : '💀 Porażka'}
                    </p>
                  </div>
                </div>

                {/* Grade Badge */}
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-display font-black text-3xl border-2 ${evaluation.gradeColor}`}>
                    {evaluation.grade}
                  </div>
                  <span className="text-[10px] font-bold text-void-300 tracking-wider block mt-1">
                    {evaluation.finalScore} / 100
                  </span>
                </div>
              </div>

              {/* Performance Tier Label */}
              <div className="p-2.5 rounded-xl bg-void-900/90 border border-void-700/60 text-center">
                <span className="text-xs font-bold text-void-200 tracking-wide">
                  Poziom Występu: <span className="text-void-neon">{evaluation.gradeTier}</span>
                </span>
              </div>

              {/* Per-Minute Normalized Stats Grid */}
              <div>
                <h4 className="text-xs font-display font-bold uppercase tracking-wider text-void-300 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-void-neon" />
                  Wskaźniki Znormalizowane (Per Minuta)
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-void-900/60 border border-void-800">
                    <div className="text-[10px] text-void-400 font-mono">CS / min</div>
                    <div className={`text-base font-bold font-mono ${evaluation.metrics.csPerMin >= 7.5 ? 'text-emerald-400' : 'text-white'}`}>
                      {evaluation.metrics.csPerMin}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-void-900/60 border border-void-800">
                    <div className="text-[10px] text-void-400 font-mono">KDA Ratio</div>
                    <div className={`text-base font-bold font-mono ${evaluation.metrics.kdaRatio >= 3 ? 'text-emerald-400' : 'text-white'}`}>
                      {evaluation.metrics.kdaRatio}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-void-900/60 border border-void-800">
                    <div className="text-[10px] text-void-400 font-mono">KP %</div>
                    <div className={`text-base font-bold font-mono ${evaluation.metrics.kpPercentage >= 50 ? 'text-cyan-400' : 'text-white'}`}>
                      {evaluation.metrics.kpPercentage}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-void-900/60 border border-void-800">
                    <div className="text-[10px] text-void-400 font-mono">DPM (Dmg/min)</div>
                    <div className="text-base font-bold font-mono text-white">
                      {evaluation.metrics.dpm}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-void-900/60 border border-void-800">
                    <div className="text-[10px] text-void-400 font-mono">VPM (Wizja/min)</div>
                    <div className="text-base font-bold font-mono text-white">
                      {evaluation.metrics.vpm}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-void-900/60 border border-void-800">
                    <div className="text-[10px] text-void-400 font-mono">GPM (Złoto/min)</div>
                    <div className="text-base font-bold font-mono text-white">
                      {evaluation.metrics.gpm}
                    </div>
                  </div>
                </div>
              </div>

              {/* 5 Performance Pillars */}
              <div>
                <h4 className="text-xs font-display font-bold uppercase tracking-wider text-void-300 mb-2.5">
                  5 Filarów Wydajności (0 - 100)
                </h4>
                <div className="space-y-2 text-xs">
                  {Object.entries({
                    'Farma i Ekonomia': evaluation.pillars.farming,
                    'Wpływ Bojowy': evaluation.pillars.combat,
                    'Przeżywalność': evaluation.pillars.survivability,
                    'Wizja i Kontrola Mapy': evaluation.pillars.vision,
                    'Spójność i Dyscyplina': evaluation.pillars.consistency
                  }).map(([name, score]) => (
                    <div key={name}>
                      <div className="flex justify-between text-[11px] text-void-300 mb-0.5">
                        <span>{name}</span>
                        <span className="font-mono font-bold text-void-200">{score}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-void-900 border border-void-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-void-500 to-void-neon transition-all duration-500"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges / Strengths & Flaws */}
              {evaluation.badges.length > 0 && (
                <div>
                  <h4 className="text-xs font-display font-bold uppercase tracking-wider text-void-300 mb-2">
                    Odznaki Meczowe
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.badges.map((b, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          b.type === 'positive'
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                            : b.type === 'warning'
                            ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                        }`}
                        title={b.desc}
                      >
                        <span>{b.icon}</span>
                        <span>{b.text}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Void Coach Tips */}
              <div className="p-3.5 rounded-xl bg-void-900/90 border border-void-600/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-void-neon font-display">
                  <Sparkles className="w-4 h-4 text-void-neon" />
                  Rada Void Coacha:
                </div>
                <ul className="text-xs text-void-200 space-y-1.5 list-disc list-inside">
                  {evaluation.coachingTips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Save Button */}
              <div>
                {saveSuccess ? (
                  <div className="w-full py-3 rounded-xl bg-emerald-900/50 border border-emerald-500 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Zapisano Mecz w Pamięci Pustki!
                  </div>
                ) : (
                  <button
                    onClick={handleSaveMatch}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wider uppercase shadow-void flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Save className="w-4 h-4" />
                    Zapisz ten mecz do Historii
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="void-glass rounded-2xl p-8 border border-void-700/50 text-center space-y-4 shadow-void">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-void-800/80 border border-void-600 flex items-center justify-center text-void-400">
                <Eye className="w-8 h-8 text-void-500 animate-pulse-slow" />
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Oko Pustki Czeka na Statystyki
              </h3>
              <p className="text-xs text-void-300 leading-relaxed max-w-sm mx-auto">
                Wypełnij formularz z lewej strony i kliknij <strong className="text-void-neon">"Przeanalizuj Mecz"</strong>, aby odsłonić zaawansowaną ocenę, wskaźniki per-minuta i porady taktyczne.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
