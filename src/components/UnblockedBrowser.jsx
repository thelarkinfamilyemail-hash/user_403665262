import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Home,
  Plus,
  X,
  ExternalLink,
  ShieldCheck,
  Bookmark as BookmarkIcon,
  Globe,
  Trash2,
  Lock,
  Clock,
  Ghost,
  Calculator,
  Search,
  BookOpen
} from 'lucide-react';

const FEATURED_DESTINATIONS = [
  {
    id: 'b-wiki',
    title: 'Wikipedia',
    description: 'The free encyclopedia with millions of articles on science, history, and culture.',
    url: 'https://en.m.wikipedia.org',
    category: 'Reference',
    icon: '🌐'
  },
  {
    id: 'b-ddg',
    title: 'DuckDuckGo Search',
    description: 'Private web search without user tracking or invasive ad profiling.',
    url: 'https://html.duckduckgo.com/html/',
    category: 'Search',
    icon: '🦆'
  },
  {
    id: 'b-desmos',
    title: 'Desmos Graphing Math',
    description: 'Premier interactive scientific and graphing calculator for math class.',
    url: 'https://www.desmos.com/calculator',
    category: 'Math',
    icon: '📈'
  },
  {
    id: 'b-archive',
    title: 'Internet Archive',
    description: 'Explore the Wayback Machine to view past versions of websites.',
    url: 'https://web.archive.org',
    category: 'History',
    icon: '🏛️'
  },
  {
    id: 'b-devdocs',
    title: 'DevDocs Documentation',
    description: 'Fast, offline-capable API documentation for HTML, CSS, JavaScript, and Python.',
    url: 'https://devdocs.io',
    category: 'Coding',
    icon: '💻'
  },
  {
    id: 'b-scratch',
    title: 'Scratch Community',
    description: 'Create and explore community games, stories, and animations.',
    url: 'https://scratch.mit.edu/explore/projects/all',
    category: 'Creative',
    icon: '🐱'
  }
];

export function UnblockedBrowser() {
  const [tabs, setTabs] = useState([
    {
      id: 'tab-1',
      title: 'Wikipedia',
      url: 'https://en.m.wikipedia.org',
      useProxy: true
    },
    {
      id: 'tab-2',
      title: 'DuckDuckGo Search',
      url: 'https://html.duckduckgo.com/html/',
      useProxy: true
    }
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [addressInput, setAddressInput] = useState('https://en.m.wikipedia.org');
  const [searchEngine, setSearchEngine] = useState('duckduckgo');
  const [useProxyMode, setUseProxyMode] = useState(true);
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('dp_bookmarks');
      return saved ? JSON.parse(saved) : FEATURED_DESTINATIONS;
    } catch {
      return FEATURED_DESTINATIONS;
    }
  });
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('dp_history');
      return saved ? JSON.parse(saved) : ['https://en.m.wikipedia.org'];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [iframeKey, setIframeKey] = useState(0);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const extractHost = (url) => {
    try {
      const u = new URL(url);
      return u.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const computeEmbedUrl = (rawUrl, proxyActive) => {
    if (!rawUrl) return 'https://en.m.wikipedia.org';
    if (proxyActive) {
      return `/api/proxy?url=${encodeURIComponent(rawUrl)}`;
    }
    return rawUrl;
  };

  const handleNavigate = (targetUrl, overrideProxy = useProxyMode) => {
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl) return;

    const isUrl = /^(https?:\/\/|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/.test(cleanUrl) && !cleanUrl.includes(' ');

    if (!isUrl) {
      if (searchEngine === 'duckduckgo') {
        cleanUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(cleanUrl)}`;
      } else if (searchEngine === 'wikipedia') {
        cleanUrl = `https://en.m.wikipedia.org/w/index.php?search=${encodeURIComponent(cleanUrl)}`;
      } else if (searchEngine === 'archive') {
        cleanUrl = `https://web.archive.org/web/*/${encodeURIComponent(cleanUrl)}`;
      } else {
        cleanUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanUrl)}`;
      }
    } else {
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
    }

    setAddressInput(cleanUrl);

    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              url: cleanUrl,
              title: extractHost(cleanUrl),
              useProxy: overrideProxy
            }
          : tab
      )
    );

    setHistory((prev) => {
      const updated = [cleanUrl, ...prev.filter((u) => u !== cleanUrl)].slice(0, 30);
      localStorage.setItem('dp_history', JSON.stringify(updated));
      return updated;
    });

    setIframeKey((prev) => prev + 1);
  };

  const handleNewTab = () => {
    const newId = 'tab-' + Date.now();
    const newTab = {
      id: newId,
      title: 'New Tab',
      url: 'https://en.m.wikipedia.org',
      useProxy: true
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
    setAddressInput(newTab.url);
  };

  const handleCloseTab = (tabId, e) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const nextTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(nextTabs);
    if (activeTabId === tabId) {
      setActiveTabId(nextTabs[0].id);
      setAddressInput(nextTabs[0].url);
    }
  };

  const handleStealthCloak = () => {
    const url = activeTab?.url || 'https://en.m.wikipedia.org';
    const target = useProxyMode ? `${window.location.origin}/api/proxy?url=${encodeURIComponent(url)}` : url;
    const win = window.open('about:blank', '_blank');
    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Google Docs</title>
            <link rel="icon" href="https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              html, body { width: 100%; height: 100%; overflow: hidden; background: #fff; }
              iframe { width: 100%; height: 100%; border: none; display: block; }
            </style>
          </head>
          <body>
            <iframe src="${target}" allowfullscreen allow="autoplay; clipboard-write; encrypted-media"></iframe>
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  const handleOpenDirect = () => {
    if (activeTab?.url) {
      window.open(activeTab.url, '_blank');
    }
  };

  const handleToggleBookmark = () => {
    if (!activeTab?.url) return;
    const exists = bookmarks.some((b) => b.url === activeTab.url);
    let updated;
    if (exists) {
      updated = bookmarks.filter((b) => b.url !== activeTab.url);
    } else {
      updated = [
        ...bookmarks,
        {
          id: 'b-' + Date.now(),
          title: activeTab.title || extractHost(activeTab.url),
          url: activeTab.url,
          category: 'Saved'
        }
      ];
    }
    setBookmarks(updated);
    localStorage.setItem('dp_bookmarks', JSON.stringify(updated));
  };

  const isCurrentBookmarked = bookmarks.some((b) => b.url === activeTab?.url);

  const calculate = () => {
    try {
      // Safe math evaluation
      const sanitized = calcInput.replace(/[^0-9+\-*/().^ ]/g, '');
      // eslint-disable-next-line no-eval
      const res = Function(`'use strict'; return (${sanitized})`)();
      setCalcResult(String(res));
    } catch {
      setCalcResult('Error');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] bg-[#07130b] text-slate-100 overflow-hidden">
      {/* 1. Spacious Clean Tab Bar */}
      <div className="bg-[#050e08] border-b border-[#14331e] px-4 pt-2.5 flex items-center gap-2 overflow-x-auto shrink-0 select-none">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTabId(tab.id);
                setAddressInput(tab.url);
              }}
              className={`group max-w-[220px] min-w-[140px] h-10 px-3.5 flex items-center justify-between gap-2.5 rounded-t-xl text-xs font-semibold cursor-pointer border-t border-x transition-all ${
                isActive
                  ? 'bg-[#0d2617] border-[#225734] text-emerald-300 shadow-md'
                  : 'bg-[#08170e]/70 border-transparent text-slate-400 hover:bg-[#0c1f13] hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{tab.title}</span>
              </div>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className="p-1 rounded-md hover:bg-black/40 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={handleNewTab}
          className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-[#0d2617] rounded-lg transition-colors ml-1 cursor-pointer shrink-0"
          title="New Tab"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Sleek Omnibox Toolbar */}
      <div className="bg-[#0b2114] border-b border-[#173e23] px-4 py-2.5 flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 text-slate-300">
          <button
            onClick={() => handleNavigate(history[1] || activeTab.url)}
            className="p-2 rounded-lg hover:bg-[#133520] hover:text-white transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIframeKey((k) => k + 1)}
            className="p-2 rounded-lg hover:bg-[#133520] hover:text-white transition-colors cursor-pointer"
            title="Reload Page"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleNavigate('https://en.m.wikipedia.org')}
            className="p-2 rounded-lg hover:bg-[#133520] hover:text-white transition-colors cursor-pointer"
            title="Browser Home"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Search Engine Selector */}
        <select
          value={searchEngine}
          onChange={(e) => setSearchEngine(e.target.value)}
          className="bg-[#07170d] border border-[#1b4327] rounded-lg text-xs text-emerald-400 font-semibold px-2.5 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer hidden sm:block shrink-0"
          title="Search Provider"
        >
          <option value="duckduckgo">DuckDuckGo</option>
          <option value="wikipedia">Wikipedia</option>
          <option value="google">Google</option>
          <option value="archive">Archive</option>
        </select>

        {/* Omnibox URL Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNavigate(addressInput);
          }}
          className="flex-1 flex items-center bg-[#07170d] border border-[#1c4929] focus-within:border-emerald-500 rounded-xl px-3.5 py-2 gap-2.5 transition-all shadow-inner"
        >
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="Search the web or enter URL (e.g., wikipedia.org, desmos.com)..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
          />
          <button
            type="submit"
            className="text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 px-3 py-1 rounded-md transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            Go
          </button>
        </form>

        {/* Actions & Tools */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Proxy Mode Toggle */}
          <button
            onClick={() => {
              const nextMode = !useProxyMode;
              setUseProxyMode(nextMode);
              handleNavigate(activeTab.url, nextMode);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              useProxyMode
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                : 'bg-[#08180e] border-[#183d23] text-slate-400 hover:text-white'
            }`}
            title="Toggle Unblock Proxy: strips X-Frame-Options to embed external web pages"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">{useProxyMode ? 'Proxy: ON' : 'Proxy: OFF'}</span>
          </button>

          {/* Stealth Tab Cloaker */}
          <button
            onClick={handleStealthCloak}
            className="p-2 bg-[#102d1a] border border-[#1b4728] hover:bg-[#163c24] text-emerald-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Open page in Stealth about:blank tab disguised as Google Docs"
          >
            <Ghost className="w-4 h-4" />
          </button>

          {/* Calculator Tool Toggle */}
          <button
            onClick={() => setShowCalc(!showCalc)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              showCalc
                ? 'bg-emerald-600 border-emerald-500 text-black'
                : 'bg-[#102d1a] border-[#1b4728] text-slate-300 hover:text-white'
            }`}
            title="Quick Math Calculator"
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isCurrentBookmarked
                ? 'bg-amber-950/60 border-amber-600/70 text-amber-400'
                : 'bg-[#102d1a] border-[#1b4728] text-slate-300 hover:text-white'
            }`}
            title={isCurrentBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
          >
            <BookmarkIcon className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Direct Popout Button */}
          <button
            onClick={handleOpenDirect}
            className="p-2 bg-[#102d1a] border border-[#1b4728] hover:bg-[#163c24] text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Open Direct in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* History Toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              showHistory
                ? 'bg-[#163e25] border-emerald-500 text-emerald-300'
                : 'bg-[#102d1a] border-[#1b4728] text-slate-300 hover:text-white'
            }`}
            title="Browsing History"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Clean Quick Dial Bookmarks Bar */}
      <div className="bg-[#08180e] border-b border-[#13351e] px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0 text-xs">
        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-2 shrink-0">
          Unblocked Hub:
        </span>
        {bookmarks.slice(0, 8).map((bm) => (
          <button
            key={bm.id}
            onClick={() => handleNavigate(bm.url)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0c2214] border border-[#183e23] hover:border-emerald-500 text-slate-300 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 font-medium cursor-pointer shadow-xs"
          >
            <span>{bm.icon || '🌐'}</span>
            <span>{bm.title}</span>
          </button>
        ))}
      </div>

      {/* 4. Main Iframe Viewport + Calculator Overlay + History Drawer */}
      <div className="flex-1 relative flex overflow-hidden">
        <div className="flex-1 bg-white relative flex flex-col">
          {/* Subtle Linewise Guidance strip */}
          <div className="bg-[#08170e] border-b border-[#143820] px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">DILL PICKLE Engine</span>
              <span>·</span>
              <span className="truncate">Active: {extractHost(activeTab?.url)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-slate-500">Need Google Docs disguise?</span>
              <button
                onClick={handleStealthCloak}
                className="text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Ghost className="w-3 h-3" />
                <span>Launch in Stealth Window</span>
              </button>
            </div>
          </div>

          <iframe
            key={`${iframeKey}-${activeTab?.url}-${useProxyMode}`}
            src={computeEmbedUrl(activeTab?.url, useProxyMode)}
            className="w-full flex-1 border-0 bg-white"
            title="Unblocked Web View"
            sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Quick Calculator Tool Widget */}
        {showCalc && (
          <div className="absolute top-4 right-4 w-72 bg-[#091b10] border border-[#1b4728] rounded-2xl shadow-2xl p-4 z-30 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#14331e] mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-display">
                <Calculator className="w-4 h-4" />
                <span>Stealth Calculator</span>
              </div>
              <button
                onClick={() => setShowCalc(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-[#050e08] p-3 rounded-xl border border-[#14331e] text-right font-mono">
                <div className="text-xs text-slate-400 h-4 truncate">{calcInput || '0'}</div>
                <div className="text-lg font-bold text-emerald-400 h-7 truncate">
                  {calcResult || '= 0'}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
                {['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '^', '='].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => {
                      if (btn === 'C') {
                        setCalcInput('');
                        setCalcResult('');
                      } else if (btn === '=') {
                        calculate();
                      } else {
                        setCalcInput((prev) => prev + btn);
                      }
                    }}
                    className={`py-2 rounded-lg transition-colors cursor-pointer ${
                      btn === '='
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold col-span-1'
                        : btn === 'C'
                        ? 'bg-red-950/60 hover:bg-red-900 text-red-200'
                        : ['/', '*', '-', '+'].includes(btn)
                        ? 'bg-[#143521] text-emerald-300 hover:bg-[#1a442b]'
                        : 'bg-[#0d2215] text-white hover:bg-[#12311f]'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History Slide-in Panel */}
        {showHistory && (
          <div className="w-80 bg-[#091a10] border-l border-[#194025] flex flex-col p-4 z-20 shadow-2xl animate-in slide-in-from-right duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#14331e] mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                  Browsing History
                </h3>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {history.length === 0 ? (
                <div className="text-xs text-slate-500 py-8 text-center">No history recorded</div>
              ) : (
                history.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      handleNavigate(url);
                      setShowHistory(false);
                    }}
                    className="p-2.5 rounded-xl bg-[#0d2617] hover:bg-[#133721] cursor-pointer text-xs text-slate-300 hover:text-emerald-300 transition-colors border border-[#194026] truncate"
                    title={url}
                  >
                    <div className="font-semibold text-white truncate">{extractHost(url)}</div>
                    <div className="text-[10px] text-slate-400 truncate font-mono mt-0.5">{url}</div>
                  </div>
                ))
              )}
            </div>

            {history.length > 0 && (
              <div className="pt-3 border-t border-[#14331e] mt-2">
                <button
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem('dp_history');
                  }}
                  className="w-full py-2 px-3 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Browsing History</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
