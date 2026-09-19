import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tv, Film, Clapperboard, PlaySquare, Bookmark } from 'lucide-react';

interface TabItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const tabs: TabItem[] = [
  { label: 'Watch Now', path: '/', icon: Tv },
  { label: 'Movies', path: '/movies', icon: Film },
  { label: 'TV Shows', path: '/series', icon: Clapperboard },
  { label: 'Shorts', path: '/shorts', icon: PlaySquare, badge: 'NEW' },
  { label: 'Library', path: '/lists', icon: Bookmark }
];

const MobileTabBar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/85 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pb-[max(env(safe-area-inset-bottom),0.65rem)] pt-1.5 select-none"
      aria-label="Mobile Navigation Bar"
    >
      <div className="grid grid-cols-5 items-center px-1 max-w-lg mx-auto">
        {tabs.map(tab => {
          const active = isActive(tab.path);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 group relative ${
                active 
                  ? 'text-white font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active 
                      ? 'stroke-[2.5] scale-105 drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]' 
                      : 'stroke-[1.75]'
                  }`} 
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2.5 px-1 py-0.2 text-[8px] font-black bg-[#2997ff] text-white rounded-full leading-tight shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] tracking-tight mt-1 leading-none ${
                active ? 'text-white font-semibold' : 'text-zinc-400 font-medium'
              }`}>
                {tab.label}
              </span>

              {/* Active Pill Indicator */}
              {active && (
                <span className="w-1 h-1 rounded-full bg-white mt-1 shadow-[0_0_6px_rgba(255,255,255,0.9)] animate-scale-in" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTabBar;
