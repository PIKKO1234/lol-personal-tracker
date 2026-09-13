// VoidTracker - Zaawansowany Algorytm Analizy i Oceny Meczów LoL

export const ROLE_DEFINITIONS = {
  TOP: { label: 'Góra (Top)', icon: '🛡️' },
  JUNGLE: { label: 'Dżungla (Jungle)', icon: '🌲' },
  MID: { label: 'Środek (Mid)', icon: '⚡' },
  BOT: { label: 'Dół (Bot/ADC)', icon: '🏹' },
  SUPPORT: { label: 'Wsparcie (Support)', icon: '👁️' }
};

export const MENTAL_TAGS = [
  { id: 'focused', label: 'Maksymalne Skupienie', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' },
  { id: 'calm', label: 'Spokojny / Stabilny', color: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30' },
  { id: 'tired', label: 'Zmęczenie / Niski refleks', color: 'text-amber-400 bg-amber-950/40 border-amber-500/30' },
  { id: 'tilted', label: 'Tilt / Frustracja', color: 'text-rose-400 bg-rose-950/40 border-rose-500/30' },
  { id: 'autopilot', label: 'Autopilot / Brak planu', color: 'text-purple-400 bg-purple-950/40 border-purple-500/30' }
];

const BENCHMARKS = {
  TOP: {
    weights: { cs: 0.25, dmg: 0.25, kp: 0.15, kda: 0.15, vis: 0.10, surv: 0.10 },
    cs: [4.0, 9.5],
    dpm: [280, 820],
    kp: [25, 70],
    kda: [1.0, 5.0],
    vpm: [0.4, 1.2]
  },
  JUNGLE: {
    weights: { cs: 0.15, dmg: 0.15, kp: 0.30, kda: 0.15, vis: 0.15, surv: 0.10 },
    cs: [3.5, 7.8],
    dpm: [240, 720],
    kp: [40, 80],
    kda: [1.2, 5.5],
    vpm: [0.7, 1.7]
  },
  MID: {
    weights: { cs: 0.25, dmg: 0.30, kp: 0.20, kda: 0.15, vis: 0.05, surv: 0.05 },
    cs: [4.5, 10.0],
    dpm: [380, 950],
    kp: [35, 75],
    kda: [1.2, 5.5],
    vpm: [0.4, 1.2]
  },
  BOT: {
    weights: { cs: 0.30, dmg: 0.35, kp: 0.15, kda: 0.10, vis: 0.05, surv: 0.05 },
    cs: [5.0, 10.2],
    dpm: [450, 1050],
    kp: [35, 70],
    kda: [1.2, 5.2],
    vpm: [0.4, 1.1]
  },
  SUPPORT: {
    weights: { cs: 0.02, dmg: 0.08, kp: 0.35, kda: 0.20, vis: 0.30, surv: 0.05 },
    cs: [0.2, 2.0],
    dpm: [120, 500],
    kp: [45, 85],
    kda: [1.5, 6.0],
    vpm: [1.2, 2.7]
  }
};

function clamp(val, min = 0, max = 100) {
  return Math.min(Math.max(val, min), max);
}

function scaleScore(val, [minBench, maxBench]) {
  if (val <= minBench) return Math.max(0, (val / minBench) * 35);
  if (val >= maxBench) return 100;
  return clamp(35 + ((val - minBench) / (maxBench - minBench)) * 65, 0, 100);
}

export function evaluateMatchPerformance(stats) {
  const duration = Math.max(stats.durationMinutes || 1, 5);
  const kills = Number(stats.kills) || 0;
  const deaths = Number(stats.deaths) || 0;
  const assists = Number(stats.assists) || 0;
  const cs = Number(stats.cs) || 0;
  const damage = Number(stats.damage) || 0;
  const vision = Number(stats.visionScore) || 0;
  const gold = Number(stats.gold) || 0;
  const teamKills = Math.max(Number(stats.teamKills) || (kills + assists), kills + assists, 1);
  const role = BENCHMARKS[stats.role] ? stats.role : 'MID';
  const roleBench = BENCHMARKS[role];

  // Derived per-minute metrics
  const csPerMin = Number((cs / duration).toFixed(2));
  const dpm = Math.round(damage / duration);
  const vpm = Number((vision / duration).toFixed(2));
  const gpm = Math.round(gold / duration);
  const kdaRatio = Number(((kills + assists) / Math.max(1, deaths)).toFixed(2));
  const kpPercentage = Number(Math.min(100, Math.round(((kills + assists) / teamKills) * 100)));
  const dmgToGold = gold > 0 ? Number((damage / gold).toFixed(2)) : 0;
  const deathInterval = deaths > 0 ? Number((duration / deaths).toFixed(1)) : duration;

  // Individual Sub-scores (0 - 100)
  const csScore = scaleScore(csPerMin, roleBench.cs);
  const dmgScore = scaleScore(dpm, roleBench.dpm);
  const kpScore = scaleScore(kpPercentage, roleBench.kp);
  const kdaScore = scaleScore(kdaRatio, roleBench.kda);
  const visScore = scaleScore(vpm, roleBench.vpm);
  const survScore = clamp(100 - (deaths * 9.5), 0, 100);

  // 5 Pillars
  const pillars = {
    farming: Math.round(role === 'SUPPORT' ? clamp(visScore * 0.4 + csScore * 0.6) : csScore),
    combat: Math.round((dmgScore * 0.55 + kpScore * 0.45)),
    survivability: Math.round((survScore * 0.7 + Math.min(100, deathInterval * 12) * 0.3)),
    vision: Math.round(visScore),
    consistency: Math.round((kdaScore * 0.6 + survScore * 0.4))
  };

  // Weighted base score
  const w = roleBench.weights;
  let baseScore = (
    csScore * w.cs +
    dmgScore * w.dmg +
    kpScore * w.kp +
    kdaScore * w.kda +
    visScore * w.vis +
    survScore * w.surv
  );

  // Outcome Modifier
  if (stats.result === 'VICTORY') {
    baseScore += 3.5;
  }

  // Death Penalties
  if (deaths >= 8) {
    baseScore -= (deaths - 7) * 3;
  }

  // Dominance Bonus (Ace/MVP)
  if (kpPercentage >= 65 && kdaRatio >= 4.5) {
    baseScore += 4;
  }

  let finalScore = clamp(Math.round(baseScore * 10) / 10, 0, 100);

  // Hard Cap for Heavy Feeding
  if (deaths >= 11 && finalScore > 50) {
    finalScore = 49.5;
  }

  // Grade mapping
  let grade = 'B';
  let gradeColor = 'text-void-300 border-void-500/50 bg-void-900/80';
  let gradeTier = 'Średni występ';

  if (finalScore >= 95.0) {
    grade = 'S+';
    gradeColor = 'text-amber-300 border-amber-400 bg-amber-950/40 shadow-void-lg';
    gradeTier = 'MVP Dominacja Pustki';
  } else if (finalScore >= 90.0) {
    grade = 'S';
    gradeColor = 'text-amber-400 border-amber-500/80 bg-amber-950/30';
    gradeTier = 'Wybitny Występ';
  } else if (finalScore >= 85.0) {
    grade = 'S-';
    gradeColor = 'text-void-neon border-void-neon/80 bg-purple-950/30';
    gradeTier = 'Świetny Mecz';
  } else if (finalScore >= 80.0) {
    grade = 'A+';
    gradeColor = 'text-emerald-400 border-emerald-500/80 bg-emerald-950/30';
    gradeTier = 'Wyraźnie Powyżej Średniej';
  } else if (finalScore >= 74.0) {
    grade = 'A';
    gradeColor = 'text-emerald-400 border-emerald-500/60 bg-emerald-950/20';
    gradeTier = 'Bardzo Solidna Gra';
  } else if (finalScore >= 68.0) {
    grade = 'A-';
    gradeColor = 'text-teal-400 border-teal-500/60 bg-teal-950/20';
    gradeTier = 'Dobra Gra z Detalami';
  } else if (finalScore >= 62.0) {
    grade = 'B+';
    gradeColor = 'text-cyan-400 border-cyan-500/60 bg-cyan-950/20';
    gradeTier = 'Przyzwoity Poziom';
  } else if (finalScore >= 56.0) {
    grade = 'B';
    gradeColor = 'text-void-200 border-void-400/50 bg-void-900/40';
    gradeTier = 'Standardowy Średni Występ';
  } else if (finalScore >= 50.0) {
    grade = 'B-';
    gradeColor = 'text-void-300 border-void-500/40 bg-void-900/30';
    gradeTier = 'Drobne Braki';
  } else if (finalScore >= 43.0) {
    grade = 'C+';
    gradeColor = 'text-amber-500 border-amber-600/50 bg-amber-950/20';
    gradeTier = 'Poniżej Oczekiwań';
  } else if (finalScore >= 36.0) {
    grade = 'C';
    gradeColor = 'text-orange-500 border-orange-600/50 bg-orange-950/20';
    gradeTier = 'Słaba Gra / Sporo Błędów';
  } else if (finalScore >= 28.0) {
    grade = 'C-';
    gradeColor = 'text-rose-400 border-rose-600/50 bg-rose-950/30';
    gradeTier = 'Duża Strata na Linii';
  } else if (finalScore >= 18.0) {
    grade = 'D+';
    gradeColor = 'text-rose-500 border-rose-700/60 bg-rose-950/40';
    gradeTier = 'Ciężki Mecz / Porażka';
  } else if (finalScore >= 10.0) {
    grade = 'D';
    gradeColor = 'text-red-500 border-red-700/80 bg-red-950/50';
    gradeTier = 'Krytyczny Feed';
  } else {
    grade = 'D-';
    gradeColor = 'text-red-600 border-red-800 bg-red-950/80';
    gradeTier = 'Katastrofa / Sabotaż';
  }

  // Badges calculation
  const badges = [];
  if (role !== 'SUPPORT' && csPerMin >= 8.5) {
    badges.push({ text: 'CS Maszyna', type: 'positive', icon: '🌾', desc: 'Znakomita farma ≥ 8.5 CS/min' });
  }
  if (kpPercentage >= 68 && kdaRatio >= 3.5) {
    badges.push({ text: 'Filar Walki', type: 'positive', icon: '⚡', desc: 'Ogromny wpływ na teamfighty (KP ≥ 68%)' });
  }
  if ((role === 'SUPPORT' && vpm >= 2.2) || (role !== 'SUPPORT' && vpm >= 1.2)) {
    badges.push({ text: 'Władca Wizji', type: 'positive', icon: '👁️', desc: 'Wysoka kontrola mgły wojny' });
  }
  if (deaths <= 1 && duration >= 22) {
    badges.push({ text: 'Niezabijalny', type: 'positive', icon: '👑', desc: 'Maksymalnie 1 śmierć w meczu' });
  }
  if (dpm >= (role === 'BOT' ? 900 : 750)) {
    badges.push({ text: 'Maszyna do Obrażeń', type: 'positive', icon: '💥', desc: 'Topowe obrażenia na minutę' });
  }
  if (kills >= 12) {
    badges.push({ text: 'Rzeźnik', type: 'positive', icon: '⚔️', desc: 'Ponad 12 zabójstw' });
  }
  if (finalScore >= 92) {
    badges.push({ text: 'Void MVP', type: 'positive', icon: '🌌', desc: 'Główny carry spotkania' });
  }

  // Flaw badges
  if (role !== 'SUPPORT' && csPerMin < 5.0 && duration >= 15) {
    badges.push({ text: 'Głodny Farmy', type: 'negative', icon: '⚠️', desc: 'Zbyt mało CS na minutę (< 5.0)' });
  }
  if (deaths >= 8) {
    badges.push({ text: 'Ostrzeżenie Feedera', type: 'negative', icon: '💀', desc: '8 lub więcej śmierci oddanych wrogom' });
  }
  if ((role === 'SUPPORT' && vpm < 1.2) || (role !== 'SUPPORT' && vpm < 0.5)) {
    badges.push({ text: 'Ślepa Mapa', type: 'negative', icon: '🌫️', desc: 'Zaniedbana kontrola wizji i wardów' });
  }
  if (kpPercentage < 30 && duration >= 20) {
    badges.push({ text: 'Izolacja', type: 'negative', icon: '🏝️', desc: 'Udział w zabójstwach drużyny poniżej 30%' });
  }
  if (stats.mentalTag === 'tilted') {
    badges.push({ text: 'Zaburzony Mental', type: 'warning', icon: '🔥', desc: 'Gra pod wpływem tiltu' });
  }

  // Actionable Coaching Tips
  const coachingTips = [];
  if (role !== 'SUPPORT' && csPerMin < 6.5) {
    coachingTips.push('Twoje tempo farmy (CS/min) było zbyt niskie. Skup się na łapaniu bocznych fal (side-lanes) po fazie laningowej zamiast bezcelowego chodzenia środkiem.');
  }
  if (deaths >= 6) {
    coachingTips.push(`Oddałeś ${deaths} śmierci. Zastanów się przed walką o obiekty: czy wrogi zespół nie ma przewagi liczebnej i czy posiadasz niezbędną wizję.`);
  }
  if (vpm < 0.8 && role !== 'SUPPORT') {
    coachingTips.push('Kupuj przynajmniej 1-2 Control Wardy przy każdym powrocie do bazy po 15. minucie i wymieniaj żółtego trinketa na Farsight/Oracle w zależności od roli.');
  }
  if (role === 'SUPPORT' && vpm < 1.8) {
    coachingTips.push('Jako Support twój priorytet to kontrola wizji. Zmieniaj trinket na Soczewkę Wyroczni (Sweeper) natychmiast po ukończeniu questu na wardy.');
  }
  if (kpPercentage < 40 && duration > 22) {
    coachingTips.push('Niski Kill Participation (KP). Zwracaj większą uwagę na minimapę i rotuj szybciej do potyczek o Smoka, Barona i Grubs.');
  }
  if (coachingTips.length === 0) {
    coachingTips.push('Świetnie zrównoważona gra! Utrzymuj tę dyscyplinę taktyczną i skupienie w kolejnych meczach rankingowych.');
  }

  return {
    finalScore,
    grade,
    gradeColor,
    gradeTier,
    metrics: {
      csPerMin,
      dpm,
      vpm,
      gpm,
      kdaRatio,
      kpPercentage,
      dmgToGold,
      deathInterval
    },
    pillars,
    badges,
    coachingTips
  };
}
