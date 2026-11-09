import React from 'react';
import { Gamepad2, Compass, Heart, PlusCircle, ShieldAlert, Glasses } from 'lucide-react';

export function Navbar({
  activeTab,
  onSelectTab,
  onOpenAddGame,
  onOpenCloak,
  onTriggerPanic,
  favoritesCount,
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#07130b]/95 backdrop-blur-md border-b border-[#183d23] px-4 md:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Brand logo & title */}
        <div
          onClick={() => onSelectTab('games')}
          className="flex items-center gap-3 cursor-pointer whitespace-nowrap shrink-0 group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🥒</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white font-display group-hover:text-emerald-400 transition-colors">
              DILL PICKLE
            </span>
          </div>
        </div>

        {/* Center Nav tabs: clean, spacious, modern */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-semibold">
          <button
            onClick={() => onSelectTab('games')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'games'
                ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-950/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0e2718]'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Games</span>
          </button>

          <button
            onClick={() => onSelectTab('browser')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'browser'
                ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-950/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0e2718]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Unblocked Browser</span>
          </button>

          <button
            onClick={() => onSelectTab('favorites')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-950/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0e2718]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                activeTab === 'favorites' ? 'bg-black/20 text-black font-bold' : 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>

          <div className="h-5 w-px bg-[#183d23] mx-1" />

          <button
            onClick={onOpenAddGame}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#0e2718] transition-colors cursor-pointer text-xs"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Add Game</span>
          </button>

          <button
            onClick={onOpenCloak}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#0e2718] transition-colors cursor-pointer text-xs"
            title="Disguise tab name & icon (Google Classroom, Docs, etc.)"
          >
            <Glasses className="w-4 h-4 text-emerald-400" />
            <span>Stealth Cloak</span>
          </button>
        </nav>

        {/* Right Action: Panic button & mobile controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile quick tabs */}
          <div className="flex md:hidden items-center gap-1 bg-[#091e11] p-1 rounded-xl border border-[#1b4426]">
            <button
              onClick={() => onSelectTab('games')}
              className={`p-2 rounded-lg transition-colors ${activeTab === 'games' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-300'}`}
              title="Games"
            >
              <Gamepad2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('browser')}
              className={`p-2 rounded-lg transition-colors ${activeTab === 'browser' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-300'}`}
              title="Browser"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('favorites')}
              className={`p-2 rounded-lg transition-colors ${activeTab === 'favorites' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-300'}`}
              title="Favorites"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onTriggerPanic}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 active:scale-95 rounded-xl shadow-md shadow-red-950/60 flex items-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            title="Press [ESC] anytime to show history decoy worksheet"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Panic Key</span>
            <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 bg-red-800/80 rounded text-[10px] font-mono border border-red-400/40">
              ESC
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
