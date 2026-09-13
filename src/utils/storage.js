// VoidTracker - LocalStorage Layer & Auth Management

const AUTH_KEY = 'voidtracker_auth';
const MATCHES_KEY = 'voidtracker_matches_v1';
const SETTINGS_KEY = 'voidtracker_settings';

// Hardcoded Admin Credentials as requested
export const ADMIN_CREDENTIALS = {
  login: 'admin',
  password: 'Krecik1234',
  displayName: 'Władca Pustki (Admin)',
  role: 'Administrator'
};

export const AuthManager = {
  login(login, password) {
    if (login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
      const session = {
        isAuthenticated: true,
        user: {
          login: ADMIN_CREDENTIALS.login,
          displayName: ADMIN_CREDENTIALS.displayName,
          role: ADMIN_CREDENTIALS.role,
          loginAt: new Date().toISOString()
        }
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return { success: true, session };
    }
    return { success: false, error: 'Nieprawidłowy login lub hasło Pustki.' };
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
  },

  getSession() {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return parsed.isAuthenticated ? parsed : null;
    } catch {
      return null;
    }
  }
};

export const MatchesManager = {
  getMatches() {
    try {
      const raw = localStorage.getItem(MATCHES_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading matches from localStorage:', e);
      return [];
    }
  },

  saveMatch(match) {
    const current = this.getMatches();
    const newMatch = {
      ...match,
      id: match.id || `match_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: match.createdAt || new Date().toISOString()
    };
    const updated = [newMatch, ...current];
    localStorage.setItem(MATCHES_KEY, JSON.stringify(updated));
    return newMatch;
  },

  deleteMatch(matchId) {
    const current = this.getMatches();
    const updated = current.filter(m => m.id !== matchId);
    localStorage.setItem(MATCHES_KEY, JSON.stringify(updated));
    return updated;
  },

  clearAllMatches() {
    localStorage.removeItem(MATCHES_KEY);
  },

  // Compute aggregate stats across all saved matches
  getAggregateStats() {
    const matches = this.getMatches();
    if (!matches || matches.length === 0) {
      return {
        totalMatches: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        avgKda: 0,
        avgCsPerMin: 0,
        avgDpm: 0,
        avgVisionPerMin: 0,
        topChampions: [],
        recentGrades: []
      };
    }

    const total = matches.length;
    const wins = matches.filter(m => m.result === 'VICTORY').length;
    const losses = matches.filter(m => m.result === 'DEFEAT').length;
    const winRate = Math.round((wins / total) * 100);

    let totalKills = 0;
    let totalDeaths = 0;
    let totalAssists = 0;
    let sumCsPerMin = 0;
    let sumDpm = 0;
    let sumVpm = 0;

    const champCount = {};

    matches.forEach(m => {
      totalKills += Number(m.kills) || 0;
      totalDeaths += Number(m.deaths) || 0;
      totalAssists += Number(m.assists) || 0;
      sumCsPerMin += Number(m.evaluation?.metrics?.csPerMin) || (m.cs / Math.max(m.durationMinutes, 1));
      sumDpm += Number(m.evaluation?.metrics?.dpm) || 0;
      sumVpm += Number(m.evaluation?.metrics?.vpm) || 0;

      const cName = m.champion?.name || m.championName || 'Nieznany';
      const cIcon = m.champion?.iconUrl || '';
      if (!champCount[cName]) {
        champCount[cName] = { name: cName, count: 0, iconUrl: cIcon, wins: 0 };
      }
      champCount[cName].count++;
      if (m.result === 'VICTORY') champCount[cName].wins++;
    });

    const avgKda = Number(((totalKills + totalAssists) / Math.max(1, totalDeaths)).toFixed(2));
    const avgCsPerMin = Number((sumCsPerMin / total).toFixed(1));
    const avgDpm = Math.round(sumDpm / total);
    const avgVisionPerMin = Number((sumVpm / total).toFixed(2));

    const topChampions = Object.values(champCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(c => ({
        ...c,
        winRate: Math.round((c.wins / c.count) * 100)
      }));

    const recentGrades = matches.slice(0, 10).map(m => ({
      id: m.id,
      grade: m.evaluation?.grade || 'B',
      result: m.result,
      score: m.evaluation?.finalScore || 50,
      champion: m.champion?.name || 'Champ',
      icon: m.champion?.iconUrl
    }));

    return {
      totalMatches: total,
      wins,
      losses,
      winRate,
      avgKda,
      avgCsPerMin,
      avgDpm,
      avgVisionPerMin,
      topChampions,
      recentGrades
    };
  },

  seedDemoMatches() {
    const demoMatches = [
      {
        id: 'demo_1',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        champion: {
          id: 'Kaisa',
          name: "Kai'Sa",
          title: "Córa Pustki",
          iconUrl: "https://ddragon.leagueoflegends.com/cdn/16.18.1/img/champion/Kaisa.png"
        },
        role: 'BOT',
        result: 'VICTORY',
        durationMinutes: 28.5,
        kills: 14,
        deaths: 2,
        assists: 9,
        cs: 252,
        damage: 34500,
        visionScore: 28,
        gold: 16800,
        teamKills: 32,
        focusLevel: 5,
        mentalTag: 'focused',
        note: 'Świetny laning, dominacja teamfightów wokół Barona, zachowany Flash na ulti Nautilusa.',
        evaluation: {
          finalScore: 96.4,
          grade: 'S+',
          gradeColor: 'text-amber-300 border-amber-400 bg-amber-950/40 shadow-void-lg',
          gradeTier: 'MVP Dominacja Pustki',
          metrics: {
            csPerMin: 8.84,
            dpm: 1211,
            vpm: 0.98,
            gpm: 589,
            kdaRatio: 11.5,
            kpPercentage: 72,
            dmgToGold: 2.05,
            deathInterval: 14.3
          },
          pillars: {
            farming: 92,
            combat: 98,
            survivability: 88,
            vision: 74,
            consistency: 95
          },
          badges: [
            { text: 'CS Maszyna', type: 'positive', icon: '🌾', desc: 'Znakomita farma ≥ 8.5 CS/min' },
            { text: 'Filar Walki', type: 'positive', icon: '⚡', desc: 'Wysokie KP% (72%)' },
            { text: 'Rzeźnik', type: 'positive', icon: '⚔️', desc: '14 zabójstw' },
            { text: 'Void MVP', type: 'positive', icon: '🌌', desc: 'Główny carry spotkania' }
          ],
          coachingTips: [
            'Wzorowy mecz! Utrzymuj tę dyscyplinę taktyczną i skupienie w kolejnych grach rankingowych.'
          ]
        }
      },
      {
        id: 'demo_2',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        champion: {
          id: 'Kassadin',
          name: "Kassadin",
          title: "Wędrowiec Pustki",
          iconUrl: "https://ddragon.leagueoflegends.com/cdn/16.18.1/img/champion/Kassadin.png"
        },
        role: 'MID',
        result: 'VICTORY',
        durationMinutes: 32.0,
        kills: 11,
        deaths: 3,
        assists: 6,
        cs: 265,
        damage: 29800,
        visionScore: 24,
        gold: 15400,
        teamKills: 26,
        focusLevel: 4,
        mentalTag: 'calm',
        note: 'Cierpliwa gra do 16. poziomu, potem flanki na wrogiego ADC.',
        evaluation: {
          finalScore: 89.2,
          grade: 'S-',
          gradeColor: 'text-void-neon border-void-neon/80 bg-purple-950/30',
          gradeTier: 'Świetny Mecz',
          metrics: {
            csPerMin: 8.28,
            dpm: 931,
            vpm: 0.75,
            gpm: 481,
            kdaRatio: 5.67,
            kpPercentage: 65,
            dmgToGold: 1.94,
            deathInterval: 10.7
          },
          pillars: {
            farming: 84,
            combat: 89,
            survivability: 79,
            vision: 62,
            consistency: 85
          },
          badges: [
            { text: 'Filar Walki', type: 'positive', icon: '⚡', desc: 'Wysokie KP%' },
            { text: 'Maszyna do Obrażeń', type: 'positive', icon: '💥', desc: 'Topowe DPM' }
          ],
          coachingTips: [
            'Kupuj przynajmniej 1-2 Control Wardy po 15. minucie, aby zabezpieczać wejścia do wrogiej dżungli przed flankami.'
          ]
        }
      },
      {
        id: 'demo_3',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        champion: {
          id: 'Belveth',
          name: "Bel'Veth",
          title: "Cesarzowa Pustki",
          iconUrl: "https://ddragon.leagueoflegends.com/cdn/16.18.1/img/champion/Belveth.png"
        },
        role: 'JUNGLE',
        result: 'DEFEAT',
        durationMinutes: 24.0,
        kills: 4,
        deaths: 7,
        assists: 3,
        cs: 120,
        damage: 13200,
        visionScore: 19,
        gold: 8900,
        teamKills: 15,
        focusLevel: 2,
        mentalTag: 'tilted',
        note: 'Przegrany early skirmish przy Rift Heraldzie, wrogi leśnik zdominował mapę.',
        evaluation: {
          finalScore: 42.1,
          grade: 'C',
          gradeColor: 'text-orange-500 border-orange-600/50 bg-orange-950/20',
          gradeTier: 'Słaba Gra / Sporo Błędów',
          metrics: {
            csPerMin: 5.0,
            dpm: 550,
            vpm: 0.79,
            gpm: 371,
            kdaRatio: 1.0,
            kpPercentage: 47,
            dmgToGold: 1.48,
            deathInterval: 3.4
          },
          pillars: {
            farming: 45,
            combat: 42,
            survivability: 25,
            vision: 48,
            consistency: 30
          },
          badges: [
            { text: 'Ostrzeżenie Feedera', type: 'negative', icon: '💀', desc: '7 śmierci' },
            { text: 'Zaburzony Mental', type: 'warning', icon: '🔥', desc: 'Gra pod wpływem tiltu' }
          ],
          coachingTips: [
            'Oddałeś 7 śmierci w 24 minuty. Gdy wrogi leśnik ma przewagę, unikaj walki o obiekty 1v1 i graj po przeciwnej stronie mapy.',
            'Wykryto tilt! Zrób 10-15 minut przerwy przed kolejną grą, by zresetować mental.'
          ]
        }
      }
    ];
    localStorage.setItem(MATCHES_KEY, JSON.stringify(demoMatches));
    return demoMatches;
  }
};
