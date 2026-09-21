import React from 'react';
import { X, QrCode, Smartphone, Download, ShieldCheck } from 'lucide-react';

export default function QRModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://netplixx.netlify.app';
  const fullDownloadUrl = `${currentHost}/downloads/netplixx-v1.0.0.apk`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={onClose}
    >
      <div
        className="panel"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '28px',
          position: 'relative',
          background: '#0d0e12',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#a1a1aa',
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(41, 151, 255, 0.12)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            color: '#2997ff',
          }}
        >
          <QrCode size={22} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
          Install via Phone Camera
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '20px', lineHeight: 1.5 }}>
          Point your Android camera at the QR code to download <strong style={{ color: '#fff' }}>netplixx-v1.0.0.apk</strong> directly.
        </p>

        {/* QR Code Container */}
        <div
          style={{
            background: '#ffffff',
            padding: '16px',
            borderRadius: '14px',
            display: 'inline-block',
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullDownloadUrl)}&bgcolor=ffffff&color=050608&margin=0`}
            alt="Netplix APK Download QR Code"
            width="180"
            height="180"
            style={{ display: 'block' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '0.78rem', color: '#71717a', marginBottom: '20px' }}>
          <span>22.2 MB</span>
          <span>•</span>
          <span>Android 7.0+</span>
          <span>•</span>
          <span style={{ color: '#34c759' }}>Verified Safe</span>
        </div>

        <a
          href="/downloads/netplixx-v1.0.0.apk"
          download="netplixx-v1.0.0.apk"
          className="btn-secondary"
          style={{ width: '100%', fontSize: '0.88rem' }}
        >
          <Download size={14} />
          <span>Save APK to Computer</span>
        </a>
      </div>
    </div>
  );
}
