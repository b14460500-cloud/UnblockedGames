/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeGame = () => {
    setSelectedGame(null);
    setIsFullscreen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-4 border-black bg-[#ffde00] p-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setSelectedGame(null)}
          >
            <div className="bg-black p-2 brutalist-border">
              <Gamepad2 className="text-[#ffde00] w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">
              Unblocked Arcade
            </h1>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
            <input
              type="text"
              placeholder="SEARCH GAMES..."
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black font-bold focus:outline-none focus:ring-4 focus:ring-black/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={closeGame}
                  className="brutalist-button flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  BACK TO ARCADE
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="brutalist-button p-2"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <a 
                    href={selectedGame.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="brutalist-button p-2"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={closeGame}
                    className="brutalist-button p-2 bg-red-500 text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className={`relative bg-black border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 m-0' : 'aspect-video w-full'}`}>
                {isFullscreen && (
                  <button 
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-4 right-4 z-[60] brutalist-button bg-white p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="autoplay; fullscreen; keyboard"
                />
              </div>

              <div className="brutalist-card mt-4">
                <h2 className="text-3xl font-black uppercase mb-2">{selectedGame.title}</h2>
                <p className="text-lg font-medium opacity-80">{selectedGame.description}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase border-b-4 border-black inline-block">
                  {searchQuery ? `SEARCH RESULTS: ${filteredGames.length}` : 'POPULAR GAMES'}
                </h2>
              </div>

              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      layoutId={game.id}
                      className="brutalist-card flex flex-col group cursor-pointer"
                      onClick={() => handleGameSelect(game)}
                    >
                      <div className="aspect-video mb-4 overflow-hidden border-2 border-black relative">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-[#ffde00] p-3 border-2 border-black font-black uppercase">
                            PLAY NOW
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-black uppercase mb-1">{game.title}</h3>
                      <p className="text-sm font-medium opacity-70 line-clamp-2">{game.description}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="brutalist-card text-center py-20">
                  <p className="text-2xl font-black uppercase">No games found for "{searchQuery}"</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 brutalist-button"
                  >
                    CLEAR SEARCH
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white p-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-black p-1 brutalist-border">
              <Gamepad2 className="text-[#ffde00] w-5 h-5" />
            </div>
            <span className="font-black uppercase tracking-tighter">Unblocked Arcade</span>
          </div>
          <p className="font-mono text-xs font-bold opacity-60">
            © {new Date().getFullYear()} UNBLOCKED ARCADE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4">
            <a href="#" className="font-bold uppercase text-sm hover:underline">Privacy</a>
            <a href="#" className="font-bold uppercase text-sm hover:underline">Terms</a>
            <a href="#" className="font-bold uppercase text-sm hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
