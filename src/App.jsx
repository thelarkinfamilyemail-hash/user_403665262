import React, { useState, useEffect } from 'react';
import { defaultGames } from './data/games.js';
import { Navbar } from './components/Navbar.jsx';
import { GamesView } from './components/GamesView.jsx';
import { GamePlayerModal } from './components/GamePlayerModal.jsx';
import { UnblockedBrowser } from './components/UnblockedBrowser.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { CloakModal } from './components/CloakModal.jsx';
import { DecoyScreen } from './components/DecoyScreen.jsx';

export default function App() {
  const [games, setGames] = useState(() => {
    try {
      const savedCustom = localStorage.getItem('dp_custom_games');
      const customGames = savedCustom ? JSON.parse(savedCustom) : [];
      return [...customGames, ...defaultGames];
    } catch {
      return defaultGames;
    }
  });

  const [activeTab, setActiveTab] = useState('games');
  const [selectedGame, setSelectedGame] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('dp_favorites');
      return saved ? JSON.parse(saved) : ['slope', 'retro-bowl', 'cookie-clicker', 'subway-surfers'];
    } catch {
      return ['slope', 'retro-bowl'];
    }
  });

  const [isPanicActive, setIsPanicActive] = useState(false);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [isCloakOpen, setIsCloakOpen] = useState(false);
  const [activeCloakPreset, setActiveCloakPreset] = useState('default');

  // Load from /public/games.json to guarantee sync with the requested JSON file
  useEffect(() => {
    fetch('/games.json')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((jsonGames) => {
        if (Array.isArray(jsonGames) && jsonGames.length > 0) {
          const savedCustom = localStorage.getItem('dp_custom_games');
          const customGames = savedCustom ? JSON.parse(savedCustom) : [];
          const map = new Map();
          customGames.forEach((g) => map.set(g.id, g));
          defaultGames.forEach((g) => map.set(g.id, g));
          jsonGames.forEach((g) => {
            if (g.iframe) map.set(g.id, { ...map.get(g.id), ...g });
          });
          setGames(Array.from(map.values()));
        }
      })
      .catch(() => {
        // Fallback already loaded from defaultGames
      });
  }, []);

  // Global Panic Key Listener (ESC)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Escape') {
        if (selectedGame && !isPanicActive) {
          setSelectedGame(null);
        } else {
          setIsPanicActive((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGame, isPanicActive]);

  // Apply Tab Cloaking to DOM
  const handleApplyCloakPreset = (preset) => {
    setActiveCloakPreset(preset.id);
    document.title = preset.title;

    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = preset.favicon;
  };

  const handleToggleFavorite = (gameId) => {
    setFavorites((prev) => {
      const next = prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId];
      localStorage.setItem('dp_favorites', JSON.stringify(next));
      return next;
    });
  };

  const handleAddGame = (newGame) => {
    setGames((prev) => [newGame, ...prev]);
    try {
      const savedCustom = localStorage.getItem('dp_custom_games');
      const customGames = savedCustom ? JSON.parse(savedCustom) : [];
      const updated = [newGame, ...customGames];
      localStorage.setItem('dp_custom_games', JSON.stringify(updated));
    } catch {}
  };

  if (isPanicActive) {
    return <DecoyScreen onDeactivate={() => setIsPanicActive(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#07130b] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* 3-Zone Top Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenAddGame={() => setIsAddGameOpen(true)}
        onOpenCloak={() => setIsCloakOpen(true)}
        onTriggerPanic={() => setIsPanicActive(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'browser' ? (
          <UnblockedBrowser />
        ) : activeTab === 'favorites' ? (
          <GamesView
            games={games}
            onSelectGame={(g) => setSelectedGame(g)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            filterFavoritesOnly={true}
          />
        ) : (
          <GamesView
            games={games}
            onSelectGame={(g) => setSelectedGame(g)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>

      {/* Footer */}
      {activeTab !== 'browser' && (
        <footer className="border-t border-[#13321d] bg-[#050e08] py-8 px-4 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-display text-white font-bold">
              <span>🥒</span>
              <span>DILL PICKLE</span>
              <span className="text-slate-500 font-normal">· Real Unblocked Games & Web Browser</span>
            </div>

            <div className="flex items-center gap-6 text-slate-400">
              <button
                onClick={() => setActiveTab('games')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Arcade
              </button>
              <button
                onClick={() => setActiveTab('browser')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Browser
              </button>
              <button
                onClick={() => setIsAddGameOpen(true)}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Add Game
              </button>
              <button
                onClick={() => setIsCloakOpen(true)}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Cloak Tab
              </button>
            </div>

            <div className="text-slate-500 font-mono text-[11px]">
              Stored as JSON iframes · 100% JavaScript · Zero AI
            </div>
          </div>
        </footer>
      )}

      {/* Active Game Player Modal */}
      <GamePlayerModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        isFavorite={selectedGame ? favorites.includes(selectedGame.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Add Custom Game iFrame Modal */}
      <AddGameModal
        isOpen={isAddGameOpen}
        onClose={() => setIsAddGameOpen(false)}
        onAddGame={handleAddGame}
      />

      {/* Stealth Tab Cloaker Modal */}
      <CloakModal
        isOpen={isCloakOpen}
        onClose={() => setIsCloakOpen(false)}
        activePresetId={activeCloakPreset}
        onApplyPreset={handleApplyCloakPreset}
      />
    </div>
  );
}
