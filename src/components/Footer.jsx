import React from 'react';
import { Download, ExternalLink } from 'lucide-react';

export default function Footer({ onDownloadClick }) {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '40px 0',
        color: '#64748b',
        fontSize: '0.84rem',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '7px',
              background: '#ffffff',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '11px',
            }}
          >
            tv
          </div>
          <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>Netplix+</span>
          <span style={{ color: '#475569', margin: '0 4px' }}>•</span>
          <span>Stream movies & series free</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a
            href="https://netplixx.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <span>netplixx.netlify.app</span>
            <ExternalLink size={12} />
          </a>

          <button
            onClick={onDownloadClick}
            style={{
              color: '#94a3b8',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <Download size={12} />
            <span>Download APK</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
