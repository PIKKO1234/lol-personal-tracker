import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Sparkles, 
  Trophy, 
  Flame, 
  Eye, 
  Coins, 
  Clock, 
  Brain,
  Award
} from 'lucide-react';
import { ROLE_DEFINITIONS } from '../utils/analyzer';

export default function MatchCard({ match, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const evalData = match.evaluation || {};
  const metrics = evalData.metrics || {};
  const pillars = evalData.pillars || {};
  const badges = evalData.badges || [];
  const tips = evalData.coachingTips || [];

  const roleInfo = ROLE_DEFINITIONS[match.role] || { label: match.role, icon: '⚔️' };
  const formattedDate = new Date(match.createdAt).toLocaleDateString('pl-PL', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="void-glass rounded-2xl border border-void-700/60 hover:border-void-500/80 transition-all overflow-hidden shadow-void-card">
      {/* Card Header (Summary Bar) */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Champion & Result */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={match.champion?.iconUrl}
              alt={match.champion?.name}
              className="w-12 h-12 rounded-xl border border-void-500/60 object-cover shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 text-xs px-1 rounded-md bg-void-950 border border-void-700 text-white font-bold">
              {roleInfo.icon}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-white">
                {match.champion?.name || 'Bohater'}
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  match.result === 'VICTORY'
                    ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                }`}
              >
                {match.result === 'VICTORY' ? 'Zwycięstwo' : 'Porażka'}
              </span>
            </div>
            <div className="text-xs text-void-300 flex items-center gap-2 mt-0.5 font-mono">
              <span>{roleInfo.label}</span>
              <span>•</span>
              <span>{Math.round(match.durationMinutes)} min</span>
              <span>•</span>
              <span className="text-void-400">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Center: Core stats */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
          <div>
            <div className="text-[10px] text-void-400">KDA</div>
            <div className="text-sm font-bold text-white">
              {match.kills} / <span className="text-rose-400">{match.deaths}</span> / {match.assists}
            </div>
            <div className="text-[10px] text-void-400">
              {metrics.kdaRatio ? `${metrics.kdaRatio}:1` : ''}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-void-400">CS / Farma</div>
            <div className="text-sm font-bold text-white">
              {match.cs} <span className="text-xs text-void-400">({metrics.csPerMin || 0}/m)</span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="text-[10px] text-void-400">Obrażenia</div>
            <div className="text-sm font-bold text-white">
              {Number(match.damage || 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Right: Grade & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="text-center">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-display font-black text-xl border-2 ${
                evalData.gradeColor || 'border-void-500 text-white'
              }`}
            >
              {evalData.grade || 'B'}
            </div>
            <div className="text-[9px] font-mono text-void-400 mt-0.5">
              {evalData.finalScore ? `${evalData.finalScore} pkt` : ''}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl bg-void-800/60 hover:bg-void-700/60 border border-void-700/50 text-void-300 hover:text-white transition-colors"
              title={isExpanded ? 'Zwiń' : 'Rozwiń szczegóły'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(match.id)}
                className="p-2 rounded-xl bg-void-800/60 hover:bg-rose-950/60 border border-void-700/50 hover:border-rose-500/50 text-void-400 hover:text-rose-400 transition-colors"
                title="Usuń mecz z pamięci"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="p-5 border-t border-void-800/80 bg-void-950/50 space-y-5 animate-fadeIn">
          {/* Per-minute and advanced grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-void-900/60 border border-void-800">
              <div className="text-[10px] text-void-400 font-mono">DPM</div>
              <div className="font-bold font-mono text-white">{metrics.dpm || 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-void-900/60 border border-void-800">
              <div className="text-[10px] text-void-400 font-mono">Wizja (VPM)</div>
              <div className="font-bold font-mono text-white">{metrics.vpm || 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-void-900/60 border border-void-800">
              <div className="text-[10px] text-void-400 font-mono">Złoto (GPM)</div>
              <div className="font-bold font-mono text-white">{metrics.gpm || 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-void-900/60 border border-void-800">
              <div className="text-[10px] text-void-400 font-mono">Kill Part. (KP%)</div>
              <div className="font-bold font-mono text-cyan-300">{metrics.kpPercentage || 0}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-void-900/60 border border-void-800">
              <div className="text-[10px] text-void-400 font-mono">Czas na Zgon</div>
              <div className="font-bold font-mono text-white">{metrics.deathInterval || 0} min</div>
            </div>
            <div className="p-2.5 rounded-xl bg-void-900/60 border border-void-800">
              <div className="text-[10px] text-void-400 font-mono">Wydajność Złota</div>
              <div className="font-bold font-mono text-white">{metrics.dmgToGold || 0} dmg/$</div>
            </div>
          </div>

          {/* 5 Pillars Bars */}
          {pillars && (
            <div className="space-y-2">
              <h4 className="text-xs font-display font-bold uppercase tracking-wider text-void-300">
                Oceny Filarów Gry
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                {Object.entries({
                  'Farma': pillars.farming || 50,
                  'Walka': pillars.combat || 50,
                  'Przeżywalność': pillars.survivability || 50,
                  'Wizja': pillars.vision || 50,
                  'Dyscyplina': pillars.consistency || 50
                }).map(([name, score]) => (
                  <div key={name} className="p-2.5 rounded-xl bg-void-900/50 border border-void-800">
                    <div className="flex justify-between text-[10px] text-void-300 mb-1">
                      <span>{name}</span>
                      <span className="font-mono font-bold text-white">{score}%</span>
                    </div>
                    <div className="w-full bg-void-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-void-500 to-void-neon h-full rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {badges.map((b, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                    b.type === 'positive'
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                      : b.type === 'warning'
                      ? 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                      : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <span>{b.icon}</span>
                  <span>{b.text}</span>
                </span>
              ))}
            </div>
          )}

          {/* Tactical Note & Void Coach Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {match.note && (
              <div className="p-3 rounded-xl bg-void-900/70 border border-void-800">
                <div className="text-[11px] font-bold text-void-300 mb-1 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-void-neon" />
                  Notatka Gracza / Wnioski:
                </div>
                <p className="text-xs text-void-200 italic leading-relaxed">
                  "{match.note}"
                </p>
              </div>
            )}

            {tips.length > 0 && (
              <div className="p-3 rounded-xl bg-void-900/70 border border-void-800">
                <div className="text-[11px] font-bold text-void-neon mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-void-neon" />
                  Rekomendacja Void Coacha:
                </div>
                <ul className="text-xs text-void-200 space-y-1 list-disc list-inside">
                  {tips.map((t, idx) => (
                    <li key={idx} className="leading-relaxed">{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
