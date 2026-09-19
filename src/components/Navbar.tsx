import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Settings } from 'lucide-react';
import SearchModal from './SearchModal';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global hotkey Ctrl+K or Cmd+K or / to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/browse/movie' },
    { label: 'TV Shows', path: '/browse/tv' },
    { label: 'Anime', path: '/anime', badge: 'NEW' },
    { label: 'Discover', path: '/discover' },
    { label: 'Shorts', path: '/shorts', badge: 'REELS' },
    { label: 'My Library', path: '/lists' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled
          ? 'apple-glass-nav py-2.5 sm:py-3.5 shadow-2xl'
          : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-3 sm:py-5'
          } pt-[max(env(safe-area-inset-top),12px)]`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Apple TV-style Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group active:scale-95 transition-transform">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white text-black flex items-center justify-center font-black tracking-tighter text-sm shadow-apple-button group-hover:scale-105 transition-transform duration-300">
              <span className="font-display font-extrabold text-[13px] sm:text-[15px] leading-none">tv</span>
            </div>
            <div className="flex items-baseline gap-1 leading-none">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white font-display">
                Netplix<span className="text-[#2997ff] font-light text-sm sm:text-base">+</span>
              </span>
            </div>
          </Link>

          {/* Desktop Apple-style Segmented Nav (hidden on mobile, mobile uses iOS TabBar) */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.06] backdrop-blur-2xl px-2 py-1.5 rounded-full border border-white/[0.08] shadow-apple-glass">
            {navLinks.map(link => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-normal transition-all duration-300 flex items-center gap-1.5 relative ${active
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${active ? 'bg-black text-white' : 'bg-white/20 text-white'
                      }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Spotlight Search & Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Apple Spotlight Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:gap-2 bg-white/[0.12] hover:bg-white/[0.18] active:scale-90 border border-white/[0.14] hover:border-white/25 sm:px-3.5 sm:py-1.5 rounded-full text-zinc-300 hover:text-white transition-all text-xs font-medium backdrop-blur-xl group"
              title="Search Apple Originals, Movies & Series (⌘K)"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 text-zinc-300 group-hover:text-white transition-colors" />
              <span className="hidden sm:inline text-zinc-300">Search</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 bg-white/10 text-zinc-400 px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/10">
                ⌘K
              </kbd>
            </button>

            {/* Settings / Preferences */}
            <Link
              to="/settings"
              className="w-8 h-8 sm:w-auto sm:h-auto p-2 rounded-full bg-white/[0.12] hover:bg-white/[0.18] active:scale-90 text-zinc-300 hover:text-white transition-all border border-white/[0.14] backdrop-blur-xl flex items-center justify-center"
              title="Player Settings & Preferences"
              aria-label="Settings"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Apple Spotlight Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />


    </>
  );
};

export default Navbar;

