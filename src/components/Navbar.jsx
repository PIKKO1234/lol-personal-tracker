import React from 'react';
import { Eye, LayoutDashboard, Crosshair, BookOpen, History, LogIn, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, userSession, onOpenLogin, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Pulpit', icon: LayoutDashboard },
    { id: 'tracker', label: 'Analizator Meczu', icon: Crosshair },
    { id: 'champions', label: 'Baza Bohaterów (173)', icon: BookOpen },
    { id: 'history', label: 'Historia Gier', icon: History }
  ];

  return (
    <header className="sticky top-0 z-40 w-full void-glass border-b border-void-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-void-700 to-void-900 border border-void-500/50 shadow-void group-hover:border-void-neon group-hover:shadow-void-lg transition-all">
              <Eye className="w-6 h-6 text-void-neon animate-pulse-slow" />
              <div className="absolute inset-0 rounded-xl bg-void-neon/10 blur-sm -z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl sm:text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-void-200 to-void-neon">
                  VOID<span className="text-void-neon">TRACKER</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-void-800 border border-void-600/60 text-void-300">
                  v0.1
                </span>
              </div>
              <p className="text-[11px] text-void-400 font-medium hidden sm:block tracking-wide">
                League of Legends Personal Performance Tracker
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-void-700/80 to-void-600/80 text-white border border-void-500 shadow-void'
                      : 'text-void-300 hover:text-white hover:bg-void-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-void-neon' : 'text-void-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User / Auth section */}
          <div className="flex items-center gap-3">
            {userSession ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-void-900/90 border border-emerald-500/40 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-emerald-300 leading-none">
                      {userSession.user.displayName}
                    </div>
                    <div className="text-[9px] text-void-400 font-mono mt-0.5">
                      login: {userSession.user.login}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Wyloguj się"
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-void-900/80 hover:bg-rose-950/40 border border-void-700 hover:border-rose-500/50 text-void-300 hover:text-rose-300 transition-all text-xs flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Wyloguj</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-void-700 to-void-600 hover:from-void-600 hover:to-void-500 border border-void-500/60 text-white text-xs font-semibold shadow-void hover:shadow-void-lg transition-all"
              >
                <LogIn className="w-4 h-4 text-void-neon" />
                <span>Zaloguj (Admin)</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-void-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-all ${
                  isActive ? 'text-void-neon' : 'text-void-400 hover:text-void-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
