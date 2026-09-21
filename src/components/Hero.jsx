import React, { useState } from 'react';
import { Download, ExternalLink, QrCode, ShieldCheck, Smartphone, Laptop } from 'lucide-react';

export default function Hero({ onOpenQr, onDownloadClick }) {
  const [viewTab, setViewTab] = useState('cid'); // 'cid' | 'player'

  return (
    <section style={{ paddingTop: '50px', paddingBottom: '70px', overflowX: 'hidden' }}>
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Purpose-Driven Presentation */}
          <div className="hero-text-col">
            {/* Minimal Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.82rem',
                color: '#94a3b8',
                marginBottom: '22px',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#34c759',
                  boxShadow: '0 0 8px #34c759',
                }}
              />
              <span style={{ color: '#ffffff', fontWeight: 600 }}>Netplix v1.0.0</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
              <span>Free & Ad-Free</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(1.85rem, 5vw, 3.6rem)',
                lineHeight: 1.12,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                marginBottom: '18px',
                color: '#ffffff',
                wordBreak: 'break-word',
              }}
            >
              Stream movies & series without limits.
            </h1>

            {/* Clear, focused description */}
            <p
              style={{
                fontSize: '1rem',
                color: '#94a3b8',
                lineHeight: 1.6,
                maxWidth: '520px',
                marginBottom: '28px',
              }}
            >
              Watch your favorite entertainment instantly. No subscription fees, no intrusive ads, and no sign-up required. Available as a dedicated Android app and on the web.
            </p>

            {/* Action Buttons */}
            <div
              className="hero-actions"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                alignItems: 'center',
                marginBottom: '28px',
              }}
            >
              <button
                onClick={onDownloadClick}
                className="btn-download"
                id="hero-download-apk"
              >
                <Download size={18} />
                <span className="desktop-btn-text">Download Android APK</span>
                <span className="mobile-btn-text">Download APK</span>
                <span style={{ opacity: 0.6, fontSize: '0.82rem', fontWeight: 400 }}>22 MB</span>
              </button>

              <a
                href="https://netplixx.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-web"
              >
                <span>Watch on Web</span>
                <ExternalLink size={15} style={{ opacity: 0.7 }} />
              </a>

              <button
                onClick={onOpenQr}
                className="btn-web"
                style={{ padding: '14px 18px', color: '#94a3b8' }}
                title="Scan QR code with phone"
              >
                <QrCode size={18} />
              </button>
            </div>

            {/* Safe & Verified Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontSize: '0.82rem',
                color: '#64748b',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34c759' }}>
                <ShieldCheck size={16} />
                <span style={{ fontWeight: 500 }}>Verified Safe & Clean</span>
              </div>
              <span>•</span>
              <span>Requires Android 8.0+</span>
              <span>•</span>
              <span>Package: com.netplixx.app</span>
            </div>
          </div>

          {/* Right Column: Real App Feed inside Phone Frame */}
          <div className="hero-device-col">
            {/* View switcher: C.I.D. Featured vs Video Player */}
            <div
              style={{
                display: 'inline-flex',
                padding: '4px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '9999px',
                marginBottom: '16px',
              }}
            >
              <button
                onClick={() => setViewTab('cid')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: viewTab === 'cid' ? '#000000' : '#94a3b8',
                  background: viewTab === 'cid' ? '#ffffff' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                Featured (C.I.D.)
              </button>
              <button
                onClick={() => setViewTab('player')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: viewTab === 'player' ? '#000000' : '#94a3b8',
                  background: viewTab === 'player' ? '#ffffff' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                Mobile Player
              </button>
            </div>

            {/* Display user's perfect C.I.D. banner */}
            {viewTab === 'cid' ? (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '315px',
                  margin: '0 auto',
                  transition: 'transform 0.3s ease',
                }}
                className="cid-phone-container"
              >
                <img
                  src="/screenshots/cid_banner_mockup.png"
                  alt="Netplix C.I.D. Live Banner"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '42px',
                    boxShadow: '0 24px 70px -15px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.15)',
                  }}
                />
              </div>
            ) : (
              <div className="device-wrapper">
                <div className="device-bezel">
                  <div className="camera-notch" />
                  <div className="device-screen-scroll">
                    <img
                      src="/screenshots/mobile_live_player_hd.png"
                      alt="Netplix Mobile Player"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '14px', fontSize: '0.78rem', color: '#64748b', textAlign: 'center' }}>
              Live feed captured from <a href="https://netplixx.netlify.app" target="_blank" rel="noopener noreferrer" style={{ color: '#2997ff', textDecoration: 'underline' }}>netplixx.netlify.app</a>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
