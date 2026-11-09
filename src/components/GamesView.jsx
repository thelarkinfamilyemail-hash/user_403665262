import React, { useState, useMemo } from 'react';
import { Search, Heart, Play, Gamepad2, Sparkles, Flame, Shield, ArrowUpDown } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Sports & Racing',
  'Action',
  'Casual',
  'Strategy',
  'Puzzle',
  'Retro Arcade'
];

export function GamesView({
  games,
  onSelectGame,
  favorites,
  onToggleFavorite,
  filterFavoritesOnly = false
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'rating' | 'az'

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts = { All: games.length };
    games.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return counts;
  }, [games]);

  const filteredGames = useMemo(() => {
    let result = games.filter((game) => {
      if (filterFavoritesOnly && !favorites.includes(game.id)) {
        return false;
      }
      if (selectedCategory !== 'All' && game.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(q);
        const matchesDesc = game.description.toLowerCase().includes(q);
        const matchesTags = game.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTags) {
          return false;
        }
      }
      return true;
    });

    if (sortBy === 'rating') {
      result.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortBy === 'az') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Popular (featured first, then higher plays)
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return parseFloat(b.plays) - parseFloat(a.plays);
      });
    }

    return result;
  }, [games, selectedCategory, searchQuery, filterFavoritesOnly, favorites, sortBy]);

  const featuredGames = useMemo(() => {
    return games.filter((g) => g.featured).slice(0, 6);
  }, [games]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Spacious, Modern & Breathable Header */}
      {!filterFavoritesOnly && (
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0e2718] to-[#07170e] border border-[#1b4829] p-6 sm:p-10 shadow-2xl overflow-hidden">
          {/* Subtle background ambient glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-xs font-semibold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Official Unblocked Games</span>
              <span className="text-emerald-600">·</span>
              <span>Zero Ads</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
              DILL PICKLE ARCADE
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Play {games.length} genuine games in full-screen unblocked iframes. Optimized for school Chromebooks with built-in Linewise bypasses and instant panic decoy cloaking.
            </p>

            {/* Quick Stats Pill Strip */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 bg-[#06140b]/80 border border-[#163e23] px-3.5 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-emerald-300">{games.length} Real Games Loaded</span>
              </div>

              <div className="flex items-center gap-2 bg-[#06140b]/80 border border-[#163e23] px-3.5 py-1.5 rounded-xl">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Linewise Whitelisted Engine</span>
              </div>

              <div className="flex items-center gap-2 bg-[#06140b]/80 border border-[#163e23] px-3.5 py-1.5 rounded-xl text-slate-400">
                <span>Emergency Decoy:</span>
                <kbd className="px-1.5 py-0.5 bg-black/60 rounded text-[10px] font-mono border border-slate-700 text-slate-200">
                  ESC
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Spotlight Quick Row (Only if showing all) */}
      {!filterFavoritesOnly && !searchQuery && selectedCategory === 'All' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider font-display">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Trending Hits</span>
            </div>
            <span className="text-xs text-slate-400">Most played today</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {featuredGames.map((game) => (
              <button
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="group p-3 bg-[#0a1e12] hover:bg-[#102d1b] border border-[#194025] hover:border-emerald-500 rounded-2xl text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider truncate mb-1">
                    {game.category}
                  </div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                    {game.title}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>★ {Number(game.rating).toFixed(1)}</span>
                  <Play className="w-3 h-3 text-emerald-400 fill-current opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Search Bar, Sorting & Category Filters */}
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Spacious Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 67+ games by name, genre, or tag (e.g. Retro Bowl, Slope, Mario)..."
              className="w-full pl-11 pr-10 py-3 bg-[#091e12] border border-[#1b4728] focus:border-emerald-500 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector & Count */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-[#091e12] border border-[#1a4427] rounded-xl px-3 py-2 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-emerald-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="popular" className="bg-[#091e12] text-white">Popularity</option>
                <option value="rating" className="bg-[#091e12] text-white">Highest Rated</option>
                <option value="az" className="bg-[#091e12] text-white">Name (A-Z)</option>
              </select>
            </div>

            <div className="text-xs text-slate-400 font-mono hidden sm:block">
              <span className="text-emerald-400 font-bold">{filteredGames.length}</span> games
            </div>
          </div>
        </div>

        {/* Clean, Breathable Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-950/40'
                    : 'bg-[#091c10] border-[#183e23] text-slate-300 hover:bg-[#0e2a18] hover:text-white'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-black/20 text-black font-mono' : 'bg-black/30 text-slate-400 font-mono'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Spacious, Modern Game Cards Grid */}
      {filteredGames.length === 0 ? (
        <div className="py-20 text-center bg-[#08180e] border border-[#163a21] rounded-3xl p-10 space-y-4">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white font-display">No Games Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            {filterFavoritesOnly
              ? "You haven't added any favorite games yet. Click the heart icon on any game card to bookmark it!"
              : `No games match "${searchQuery}". Try selecting another category or resetting filters.`}
          </p>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => {
            const isFav = favorites.includes(game.id);
            return (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="group relative bg-[#091b10]/90 border border-[#183e24] hover:border-emerald-500/80 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-950/50 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header: Category & Favorite */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      {game.category}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(game.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-[#133720] text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      title={isFav ? 'Remove favorite' : 'Add favorite'}
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isFav ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title & HOT Tag */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors font-display line-clamp-1">
                        {game.title}
                      </h3>
                      {game.featured && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/60 font-bold font-mono">
                          HOT
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {game.tags && game.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {game.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-slate-400 bg-[#06140b] border border-[#14361e] px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Bar: Plays & Play CTA */}
                <div className="pt-4 mt-4 border-t border-[#12311c] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-amber-400 font-bold">★ {Number(game.rating).toFixed(1)}</span>
                    <span>·</span>
                    <span className="font-mono text-[11px]">{game.plays}</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500 text-emerald-400 group-hover:text-black font-bold transition-all shadow-xs">
                    <span>Play</span>
                    <Play className="w-3 h-3 fill-current" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
