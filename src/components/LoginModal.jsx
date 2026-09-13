import React, { useState } from 'react';
import { Shield, Key, User, X, Sparkles, AlertCircle } from 'lucide-react';
import { AuthManager, ADMIN_CREDENTIALS } from '../utils/storage';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = AuthManager.login(login.trim(), password);
      setLoading(false);
      if (res.success) {
        onLoginSuccess(res.session);
        onClose();
      } else {
        setError(res.error);
      }
    }, 300);
  };

  const handleFillDemoAdmin = () => {
    setLogin(ADMIN_CREDENTIALS.login);
    setPassword(ADMIN_CREDENTIALS.password);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md void-glass rounded-2xl border border-void-500/40 p-6 sm:p-8 shadow-void-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-void-300 hover:text-white rounded-lg hover:bg-void-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-void-600/40 to-void- neon/20 border border-void-500/50 shadow-void mb-3">
            <Shield className="w-8 h-8 text-void-neon" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-wider text-white">
            Wrota Pustki
          </h2>
          <p className="text-xs text-void-300 mt-1">
            Zaloguj się do osobistego systemu analitycznego
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-void-200 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-void-400" />
              Identyfikator (Login)
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Wpisz login..."
              required
              className="w-full px-4 py-2.5 rounded-xl bg-void-900/90 border border-void-700/60 text-white placeholder-void-500 focus:outline-none focus:border-void-neon focus:ring-1 focus:ring-void-neon transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-void-200 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-void-400" />
              Hasło Pustki
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-void-900/90 border border-void-700/60 text-white placeholder-void-500 focus:outline-none focus:border-void-neon focus:ring-1 focus:ring-void-neon transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm tracking-wide bg-gradient-to-r from-void-600 via-void-500 to-void-neon text-white shadow-void hover:shadow-void-lg hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? 'Weryfikacja energii...' : 'Otwórz Wrota (Zaloguj)'}
          </button>
        </form>

        {/* Admin Demo helper */}
        <div className="mt-6 pt-5 border-t border-void-800/80 text-center">
          <div className="text-xs text-void-400 mb-2">
            Wersja v0.1 • Domyślne konto administratora:
          </div>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-void-800/60 hover:bg-void-700/60 border border-void-600/40 text-[11px] text-void-200 hover:text-white transition-colors"
          >
            <Sparkles className="w-3 h-3 text-void-neon" />
            Uzupełnij: <span className="font-mono text-void-neon font-bold">admin</span> / <span className="font-mono text-void-neon font-bold">Krecik1234</span>
          </button>
        </div>
      </div>
    </div>
  );
}
