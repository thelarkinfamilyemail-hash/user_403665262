import React, { useState } from 'react';
import { X, Check, ShieldCheck, Sparkles } from 'lucide-react';

export const CLOAK_PRESETS = [
  {
    id: 'default',
    name: 'Dill Pickle (Normal)',
    title: 'DILL PICKLE',
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M30,25 C15,45 18,75 35,88 C50,98 75,90 82,75 C90,60 85,35 70,20 C55,5 40,10 30,25 Z' fill='%2322c55e'/></svg>"
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes — Google Classroom',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard | Canvas LMS',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico'
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    favicon: 'https://www.desmos.com/favicon.ico'
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    favicon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico'
  }
];

export function CloakModal({
  isOpen,
  onClose,
  activePresetId,
  onApplyPreset
}) {
  const [customTitle, setCustomTitle] = useState('');
  const [customFavicon, setCustomFavicon] = useState('');

  if (!isOpen) return null;

  const handleCustomApply = () => {
    if (!customTitle.trim()) return;
    onApplyPreset({
      id: 'default',
      name: 'Custom',
      title: customTitle,
      favicon: customFavicon || 'https://www.google.com/favicon.ico'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0b1c11] border border-[#1e4a2d] w-full max-w-md rounded-xl shadow-2xl p-6 text-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#163821] mb-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-display">Stealth Tab Cloaker</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-[#143521] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Disguise your browser tab instantly! Changing your tab title and favicon makes the tab appear as an educational or productive app in your browser history and tab bar.
        </p>

        <div className="space-y-2 mb-6">
          {CLOAK_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onApplyPreset(preset);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[#153e24] border-emerald-500 text-white shadow-xs'
                    : 'bg-[#0f2818] border-[#1a4427] text-slate-300 hover:bg-[#133520] hover:border-emerald-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={preset.favicon}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded object-contain shrink-0"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">{preset.name}</div>
                    <div className="text-xs text-slate-400 truncate max-w-[240px]">{preset.title}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-[#163821] space-y-3">
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Cloak</span>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Custom Tab Title (e.g. Google Docs)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#08170d] border border-[#1b4327] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="url"
              placeholder="Custom Favicon URL (optional)"
              value={customFavicon}
              onChange={(e) => setCustomFavicon(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#08170d] border border-[#1b4327] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleCustomApply}
              disabled={!customTitle.trim()}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Apply Custom Cloak
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
