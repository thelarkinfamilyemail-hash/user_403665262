import React, { useState } from 'react';
import { X, Plus, Code2 } from 'lucide-react';

export function AddGameModal({ isOpen, onClose, onAddGame }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Retro Arcade');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [iframeInput, setIframeInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }
    if (!iframeInput.trim()) {
      setError('Please provide an iframe embed snippet or game URL.');
      return;
    }

    // Process iframe input: If it is already an <iframe ...> tag, use it. If it's a URL, wrap in <iframe>
    let finalIframe = iframeInput.trim();
    if (!finalIframe.startsWith('<iframe')) {
      let url = finalIframe;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      finalIframe = `<iframe src="${url}" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; fullscreen; gamepad"></iframe>`;
    }

    const newGame = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      category,
      description: description.trim() || 'Custom added web game iframe.',
      controls: controls.trim() || 'Mouse and Keyboard controls',
      rating: 5.0,
      plays: '1',
      featured: false,
      iframe: finalIframe,
      author: 'You',
      custom: true,
      tags: ['Custom', category]
    };

    onAddGame(newGame);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0b1c11] border border-[#1e4a2d] w-full max-w-lg rounded-xl shadow-2xl p-6 text-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#163821] mb-5">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-display">Add Custom Game iFrame</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-[#143521] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-950/80 border border-red-800 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Game Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Pixel Adventure 3"
              className="w-full px-3 py-2 text-xs bg-[#07170d] border border-[#1b4327] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#07170d] border border-[#1b4327] rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Retro Arcade">Retro Arcade</option>
                <option value="Action">Action</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Casual">Casual</option>
                <option value="Sports & Racing">Sports & Racing</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Controls Guide</label>
              <input
                type="text"
                value={controls}
                onChange={(e) => setControls(e.target.value)}
                placeholder="e.g. Arrow keys to steer, Space to jump"
                className="w-full px-3 py-2 text-xs bg-[#07170d] border border-[#1b4327] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary of game mechanics and story..."
              className="w-full px-3 py-2 text-xs bg-[#07170d] border border-[#1b4327] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Game iFrame Embed Code or Game URL
            </label>
            <textarea
              rows={4}
              required
              value={iframeInput}
              onChange={(e) => setIframeInput(e.target.value)}
              placeholder='<iframe src="https://example.com/game" width="100%" height="100%"></iframe>  or  https://...'
              className="w-full p-2.5 text-xs font-mono bg-[#07170d] border border-[#1b4327] rounded-lg text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Stored directly as an iframe embed code in your library JSON data.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-[#143521] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-black bg-emerald-500 hover:bg-emerald-400 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Save to Game Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
