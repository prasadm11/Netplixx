import React from 'react';
import { Download, ExternalLink } from 'lucide-react';

export default function Navbar({ onDownloadClick }) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '16px 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              background: '#ffffff',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '14px',
              letterSpacing: '-0.5px',
            }}
          >
            tv
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Netplix
            </span>
            <span style={{ color: '#2997ff', fontWeight: 500, fontSize: '1.15rem' }}>+</span>
          </div>
        </a>

        {/* Direct Action Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a
            href="https://netplixx.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-web-link desktop-only"
          >
            <span>Watch on Web</span>
            <ExternalLink size={13} style={{ opacity: 0.7 }} />
          </a>

          <button
            onClick={onDownloadClick}
            className="btn-download"
            style={{
              padding: '8px 14px',
              fontSize: '0.82rem',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
            }}
          >
            <Download size={13} />
            <span className="desktop-btn-text">Download APK</span>
            <span className="mobile-btn-text">Download</span>
          </button>
        </div>
      </div>

    </header>
  );
}
