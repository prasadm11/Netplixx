import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-white/[0.08] bg-black text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-3.5 inline-flex group">
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-extrabold text-xs shadow-sm">
                <span className="font-display font-extrabold text-xs">tv</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-display">
                Netplix<span className="text-[#2997ff] font-light">+</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-xs max-w-md leading-relaxed">
              Stream thousands of cinema releases, high definition TV series, and Apple Originals. Designed for the ultimate streaming experience across your devices.
            </p>
            <div className="mt-4 flex items-center gap-2 text-zinc-500 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
              <span>Ad-free • Multi-Server Redundancy • Full HD 1080p / 4K</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-widest mb-3.5">
              Explore Titles
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Discover</Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-white transition-colors">Movies Catalog</Link>
              </li>
              <li>
                <Link to="/series" className="hover:text-white transition-colors">TV Series</Link>
              </li>
              <li>
                <Link to="/shorts" className="hover:text-white transition-colors">Preview Shorts</Link>
              </li>
              <li>
                <Link to="/continue-watching" className="hover:text-white transition-colors">Up Next</Link>
              </li>
            </ul>
          </div>

          {/* Settings & Support */}
          <div>
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-widest mb-3.5">
              Preferences
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">Player Preferences</Link>
              </li>
              <li>
                <Link to="/lists" className="hover:text-white transition-colors">My Library</Link>
              </li>
              <li>
                <a href="#disclaimer" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#disclaimer" className="hover:text-white transition-colors">DMCA Disclaimer</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div id="disclaimer" className="pt-8 border-t border-white/[0.06] text-center text-zinc-500 text-[11px] leading-relaxed">
          <p className="max-w-3xl mx-auto mb-3">
            <strong>Disclaimer:</strong> Netplix does not host, upload or store media files. All streams are provided by independent third-party video APIs.
          </p>
          <p className="text-zinc-600">
            Copyright © {new Date().getFullYear()} Netplix. All rights reserved. Apple TV and Apple Originals are registered trademarks of Apple Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

