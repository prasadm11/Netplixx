import React from 'react';
import { Smartphone, Laptop, Tv, ExternalLink, ArrowRight, Play } from 'lucide-react';

const CATALOG = [
  { id: 1, title: 'Dune: Part Two', year: '2024', quality: '4K HDR', lang: 'English • Hindi', poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg' },
  { id: 2, title: 'Oppenheimer', year: '2023', quality: '4K UHD', lang: 'Dolby Atmos', poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' },
  { id: 3, title: 'Mirzapur', year: 'Season 3', quality: '1080p', lang: 'Hindi Original', poster: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg' },
  { id: 4, title: 'Stranger Things', year: 'Complete', quality: '4K HDR', lang: 'English • Multi', poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' },
  { id: 5, title: 'Demon Slayer', year: 'Hashira Arc', quality: '1080p 60fps', lang: 'Japanese • Eng Sub', poster: 'https://image.tmdb.org/t/p/w500/xU00oxQjDk3WkR8y8QZ3h9A1yH3.jpg' },
  { id: 6, title: 'Panchayat', year: 'Season 3', quality: '1080p', lang: 'Hindi', poster: 'https://image.tmdb.org/t/p/w500/9y6U9M3b0C0pT3P3b3zH4zH6r6f.jpg' },
  { id: 7, title: 'Interstellar', year: '2014', quality: '4K IMAX', lang: 'English • Hindi', poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { id: 8, title: 'Breaking Bad', year: 'Complete', quality: '4K UHD', lang: 'English 5.1', poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
  { id: 9, title: 'Kalki 2898 AD', year: '2024', quality: '4K UHD', lang: 'Telugu • Hindi • Tamil', poster: 'https://image.tmdb.org/t/p/w500/tLp5tMhRk4m3y1L5D2w4F5zB6v4.jpg' },
  { id: 10, title: 'Money Heist', year: 'Complete', quality: '4K UHD', lang: 'Spanish • English', poster: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbk5r6iKiEjNaRbP.jpg' },
];

export default function ContentMarquee() {
  return (
    <section id="platform" style={{ padding: '70px 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
          <div className="subtle-badge" style={{ marginBottom: '12px' }}>
            <span>Cross-Platform Ecosystem</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', marginBottom: '12px' }}>
            Choose your streaming environment.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6 }}>
            Whether you want hardware-accelerated playback on an Android device or instant browser streaming on desktop, Netplix adapts to your setup.
          </p>
        </div>

        {/* Dual Cards: Web vs Native Android */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}
        >
          {/* Card 1: Web App */}
          <div
            className="panel"
            style={{
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Laptop size={20} color="#ffffff" />
                </div>
                <span className="code-chip">netplixx.netlify.app</span>
              </div>

              <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Progressive Web App</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                No installation needed. Stream directly from Chrome, Safari, or Firefox on macOS, Windows, Linux, iPad, and iOS. Features full keyboard shortcuts and instant responsive layout.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                <span className="code-chip">Space: Play/Pause</span>
                <span className="code-chip">F: Fullscreen</span>
                <span className="code-chip">J/L: ±10s</span>
                <span className="code-chip">M: Mute</span>
              </div>
            </div>

            <a
              href="https://netplixx.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ justifyContent: 'center', width: '100%' }}
            >
              <span>Launch Web Client</span>
              <ExternalLink size={14} style={{ opacity: 0.6 }} />
            </a>
          </div>

          {/* Card 2: Native Android APK */}
          <div
            className="panel"
            style={{
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderColor: 'rgba(41, 151, 255, 0.25)',
              background: 'linear-gradient(180deg, rgba(41, 151, 255, 0.04) 0%, rgba(18, 18, 22, 0.65) 100%)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(41, 151, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2997ff' }}>
                  <Smartphone size={20} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#34c759' }}>v1.0.0 Recommended</span>
              </div>

              <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Native Android Client</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                Engineered with Android Media3 ExoPlayer for efficient hardware decoding, lower battery draw, native Picture-in-Picture (PiP), lockscreen playback controls, and encrypted SQLite watchlists.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                <span className="code-chip">Media3 HLS</span>
                <span className="code-chip">System PiP</span>
                <span className="code-chip">Android TV / D-Pad</span>
                <span className="code-chip">Room SQLite</span>
              </div>
            </div>

            <a
              href="#install"
              className="btn-secondary"
              style={{ justifyContent: 'center', width: '100%', borderColor: 'rgba(41, 151, 255, 0.3)', color: '#ffffff' }}
            >
              <span>View Sideload Instructions</span>
              <ArrowRight size={14} style={{ opacity: 0.6 }} />
            </a>
          </div>
        </div>

        {/* Live Catalog Preview */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            CURRENTLY STREAMING (50,000+ CATALOG VIA TMDB)
          </span>
          <a
            href="https://netplixx.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.8rem', color: '#2997ff', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>Browse Full Library</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Infinite Marquee Poster Row */}
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {CATALOG.concat(CATALOG).map((item, idx) => (
            <a
              key={`${item.id}-${idx}`}
              href="https://netplixx.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '180px',
                flexShrink: 0,
                display: 'block',
                textDecoration: 'none',
              }}
              className="catalog-card"
            >
              <div
                style={{
                  width: '100%',
                  height: '260px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid var(--border-subtle)',
                  background: '#111216',
                }}
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.3s ease',
                  }}
                  className="poster-img"
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(6px)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: '#e2e8f0',
                  }}
                >
                  {item.quality}
                </div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f5f5f7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
                  {item.year} • {item.lang}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .catalog-card:hover .poster-img {
          transform: scale(1.04);
        }
      `}</style>
    </section>
  );
}
