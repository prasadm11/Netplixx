import React from 'react';
import { Download, ExternalLink } from 'lucide-react';

export default function MobileStickyBar({ onDownloadClick }) {
  return (
    <div
      className="mobile-sticky-bottom"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '12px 18px',
        background: 'rgba(5, 5, 8, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: '#ffffff',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '12px',
          }}
        >
          tv
        </div>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>Netplix+</div>
          <div style={{ fontSize: '0.68rem', color: '#71717a' }}>v1.0.0 • 22 MB</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <a
          href="https://netplixx.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ padding: '7px 12px', fontSize: '0.78rem' }}
        >
          <span>Web</span>
        </a>

        <button
          onClick={onDownloadClick}
          className="btn-primary"
          style={{ padding: '7px 14px', fontSize: '0.78rem' }}
        >
          <Download size={13} />
          <span>Download</span>
        </button>
      </div>

      <style>{`
        @media (min-width: 860px) {
          .mobile-sticky-bottom {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
