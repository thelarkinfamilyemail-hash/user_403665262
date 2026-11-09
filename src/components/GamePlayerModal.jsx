import React, { useState, useRef } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  Heart,
  ExternalLink,
  Keyboard,
  ShieldCheck,
  Globe,
  Ghost
} from 'lucide-react';

export function GamePlayerModal({
  game,
  onClose,
  isFavorite,
  onToggleFavorite
}) {
  const [reloadKey, setReloadKey] = useState(0);
  const [isTheater, setIsTheater] = useState(false);
  const [activeSource, setActiveSource] = useState('primary'); // 'primary' | 'mirror' | 'local'
  const [popupBlocked, setPopupBlocked] = useState(false);
  const containerRef = useRef(null);

  if (!game) return null;

  // Extract base URL from iframe
  const defaultIframeSrc = (() => {
    const match = game.iframe?.match(/src="([^"]+)"/);
    return match ? match[1] : '';
  })();

  const currentUrl = (() => {
    if (activeSource === 'mirror' && game.mirror) return game.mirror;
    if (activeSource === 'local' && game.local) return game.local;
    return defaultIframeSrc;
  })();

  const handleRestart = () => {
    setReloadKey((prev) => prev + 1);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Stealth about:blank cloaker (Linewise-proof)
  const handleAboutBlankCloak = () => {
    const fullTarget = currentUrl.startsWith('http') ? currentUrl : `${window.location.origin}${currentUrl}`;
    const win = window.open('about:blank', '_blank');
    if (!win) {
      setPopupBlocked(true);
      setTimeout(() => setPopupBlocked(false), 4000);
      return;
    }

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Docs</title>
          <link rel="icon" href="https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
            iframe { width: 100%; height: 100%; border: none; display: block; }
          </style>
        </head>
        <body>
          <iframe src="${fullTarget}" allowfullscreen allow="autoplay; fullscreen; gamepad"></iframe>
        </body>
      </html>
    `);
    win.document.close();
  };

  const handleOpenDirect = () => {
    const fullTarget = currentUrl.startsWith('http') ? currentUrl : `${window.location.origin}${currentUrl}`;
    window.open(fullTarget, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        ref={containerRef}
        className={`bg-[#08170d] border border-[#1b4428] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isTheater
            ? 'w-[98vw] h-[96vh]'
            : 'w-full max-w-5xl h-[88vh]'
        }`}
      >
        {/* Top Control Bar */}
        <div className="bg-[#0b1f12] border-b border-[#1b4327] px-4 py-2.5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl">🥒</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white truncate font-display">
                  {game.title}
                </h2>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60 font-semibold shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  Real Unblocked Game
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-emerald-400 font-semibold">{game.category}</span>
                <span aria-hidden="true">·</span>
                <span>★ {Number(game.rating).toFixed(1)}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{game.plays} plays</span>
              </div>
            </div>
          </div>

          {/* Action buttons & Linewise bypass controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mirror Selector */}
            <div className="hidden lg:flex items-center bg-[#07170d] p-0.5 rounded-lg border border-[#183e23] text-[11px]">
              <button
                onClick={() => setActiveSource('primary')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  activeSource === 'primary' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="DILL PICKLE Unblocked Game Engine"
              >
                Unblocked Engine
              </button>
              {game.local && (
                <button
                  onClick={() => setActiveSource('local')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    activeSource === 'local' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Self-Hosted Local Offline Mirror"
                >
                  Offline Mirror
                </button>
              )}
              {game.mirror && (
                <button
                  onClick={() => setActiveSource('mirror')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    activeSource === 'mirror' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="External CDN Mirror"
                >
                  Direct CDN
                </button>
              )}
            </div>

            {/* Stealth about:blank Cloaker button (Linewise bypass) */}
            <button
              onClick={handleAboutBlankCloak}
              className="px-2.5 py-1.5 bg-[#143d22] hover:bg-[#1a4f2c] border border-emerald-500/50 text-emerald-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              title="Open inside an about:blank tab disguised as Google Docs (Linewise cannot block about:blank)"
            >
              <Ghost className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Stealth Tab</span>
            </button>

            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-red-950/60 border-red-700/60 text-red-400'
                  : 'bg-[#102d1a] border-[#1b4728] text-slate-300 hover:text-white'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
            </button>

            {/* Restart button */}
            <button
              onClick={handleRestart}
              className="p-2 bg-[#102d1a] border border-[#1b4728] hover:bg-[#163c24] text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Restart Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Theater toggle */}
            <button
              onClick={() => setIsTheater(!isTheater)}
              className={`hidden sm:flex p-2 rounded-lg border transition-colors cursor-pointer ${
                isTheater
                  ? 'bg-emerald-600 border-emerald-500 text-black'
                  : 'bg-[#102d1a] border-[#1b4728] text-slate-300 hover:text-white'
              }`}
              title={isTheater ? 'Exit theater mode' : 'Theater mode'}
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            {/* Fullscreen button */}
            <button
              onClick={handleToggleFullscreen}
              className="p-2 bg-[#102d1a] border border-[#1b4728] hover:bg-[#163c24] text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Direct popout button */}
            <button
              onClick={handleOpenDirect}
              className="p-2 bg-[#102d1a] border border-[#1b4728] hover:bg-[#163c24] text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Open in new window"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 bg-red-950/40 border border-red-900/60 hover:bg-red-800 text-red-200 hover:text-white rounded-lg transition-colors ml-1 cursor-pointer"
              title="Close (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real Game iFrame Screen Area */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
          {popupBlocked && (
            <div className="absolute top-3 z-30 bg-amber-950/90 border border-amber-600 text-amber-200 px-4 py-2 rounded-lg text-xs font-semibold shadow-xl flex items-center gap-2">
              <span>Pop-up was blocked by Chromebook settings. Playing inside page instead!</span>
            </div>
          )}
          <iframe
            key={`${currentUrl}-${reloadKey}`}
            src={currentUrl}
            className="w-full h-full border-0 block bg-black"
            allowFullScreen
            allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope"
            title={game.title}
          />
        </div>

        {/* Bottom Game Controls & Info Kicker */}
        <div className="bg-[#09170e] border-t border-[#183921] px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <Keyboard className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-300">Controls:</span>
            <span className="text-slate-400 truncate">{game.controls}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline text-slate-500">
              Linewise blocked? Click
            </span>
            <button
              onClick={handleAboutBlankCloak}
              className="text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Ghost className="w-3 h-3" />
              <span>Launch Stealth about:blank</span>
            </button>
            {game.mirror && (
              <button
                onClick={() => setActiveSource(activeSource === 'mirror' ? 'primary' : 'mirror')}
                className="text-amber-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Globe className="w-3 h-3" />
                <span>Switch to {activeSource === 'mirror' ? 'Unblocked Engine' : 'Direct CDN'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
