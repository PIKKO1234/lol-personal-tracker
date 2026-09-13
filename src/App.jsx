import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VoidParticles from './components/VoidParticles';
import LoginModal from './components/LoginModal';
import Dashboard from './components/Dashboard';
import MatchTracker from './components/MatchTracker';
import ChampionsDatabase from './components/ChampionsDatabase';
import MatchHistory from './components/MatchHistory';
import { AuthManager, MatchesManager } from './utils/storage';
import { Shield, Sparkles, Heart, Code2 } from 'lucide-react';


export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userSession, setUserSession] = useState(() => AuthManager.getSession());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [preselectedChampion, setPreselectedChampion] = useState(null);

  // Initialize demo data if brand new user
  useEffect(() => {
    const existing = MatchesManager.getMatches();
    if (!existing || existing.length === 0) {
      MatchesManager.seedDemoMatches();
    }
  }, []);

  const handleLoginSuccess = (session) => {
    setUserSession(session);
  };

  const handleLogout = () => {
    AuthManager.logout();
    setUserSession(null);
  };

  const handleSelectChampionForTracker = (champion) => {
    setPreselectedChampion(champion);
    setActiveTab('tracker');
  };

  return (
    <div className="relative min-h-screen bg-void-950 text-void-100 flex flex-col selection:bg-void-500 selection:text-white">
      {/* Background Void Canvas Particles */}
      <VoidParticles />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userSession={userSession}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigateToTracker={() => setActiveTab('tracker')}
            onNavigateToHistory={() => setActiveTab('history')}
            onSelectChampionForTracker={(champName) => {
              setActiveTab('champions');
            }}
          />
        )}

        {activeTab === 'tracker' && (
          <MatchTracker
            preselectedChampion={preselectedChampion}
            onMatchSaved={() => {
              // Switch to history tab after saving
              setActiveTab('history');
            }}
          />
        )}

        {activeTab === 'champions' && (
          <ChampionsDatabase
            onSelectForTracker={handleSelectChampionForTracker}
          />
        )}

        {activeTab === 'history' && (
          <MatchHistory
            onNavigateToTracker={() => setActiveTab('tracker')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 void-glass border-t border-void-800/80 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-void-400">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white tracking-wider">VOIDTRACKER</span>
            <span>•</span>
            <span className="font-mono">v0.1 Personal Tracker</span>
            <span>•</span>
            <span className="text-void-neon font-mono">173 Bohaterów (Patch 16.18.1)</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/PIKKO1234/lol-personal-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-void-300 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub: PIKKO1234/lol-personal-tracker</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
