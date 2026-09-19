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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0c]/85 backdrop-blur-3xl border-t border-white/[0.12] shadow-[0_-8px_32px_rgba(0,0,0,0.9)] pb-[max(env(safe-area-inset-bottom),12px)] pt-2 select-none"
      aria-label="Mobile Navigation Bar"
    >
      <div className="grid grid-cols-5 items-center px-2 max-w-md mx-auto">
        {tabs.map(tab => {
          const active = isActive(tab.path);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-transform duration-150 active:scale-95 group relative ${
                active 
                  ? 'text-white' 
                  : 'text-[#8e8e93] hover:text-zinc-200'
              }`}
            >
              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center h-6">
                <Icon 
                  className={`w-[22px] h-[22px] transition-all duration-200 ${
                    active 
                      ? 'stroke-[2.3] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                      : 'stroke-[1.65] text-[#8e8e93]'
                  }`} 
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-3 px-1.5 py-0.2 text-[8px] font-black bg-[#0071e3] text-white rounded-full leading-tight shadow-sm tracking-wider">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] tracking-tight mt-1 leading-none ${
                active ? 'text-white font-semibold' : 'text-[#8e8e93] font-medium'
              }`}>
                {tab.label}
              </span>

              {/* iOS Active Indicator Dot */}
              {active && (
                <span className="w-1 h-1 rounded-full bg-white mt-1 shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-scale-in" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTabBar;
