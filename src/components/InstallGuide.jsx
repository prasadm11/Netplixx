import React, { useState } from 'react';
import { Download, ShieldCheck, Smartphone, Tv, ExternalLink, Terminal, ArrowRight } from 'lucide-react';

export default function InstallGuide({ onDownloadClick }) {
  const [deviceTab, setDeviceTab] = useState('phone');

  return (
    <section id="install" style={{ padding: '80px 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '640px', marginBottom: '36px' }}>
          <div className="subtle-badge" style={{ marginBottom: '12px' }}>
            <span>Deployment Guide</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', marginBottom: '12px' }}>
            Sideloading Instructions
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6 }}>
            Direct APK installation allows unthrottled streaming and multi-mirror video playback without store restrictions.
          </p>
        </div>

        {/* Device Switcher */}
        <div style={{ marginBottom: '32px' }}>
          <div className="segmented-control">
            <button
              className={`segmented-btn ${deviceTab === 'phone' ? 'active' : ''}`}
              onClick={() => setDeviceTab('phone')}
            >
              Android Phone & Tablet
            </button>
            <button
              className={`segmented-btn ${deviceTab === 'tv' ? 'active' : ''}`}
              onClick={() => setDeviceTab('tv')}
            >
              Android TV & Firestick
            </button>
          </div>
        </div>

        {/* Step-by-Step for Phone & Tablet */}
        {deviceTab === 'phone' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '36px',
            }}
          >
            {/* Step 1 */}
            <div className="panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="code-chip" style={{ color: '#2997ff', fontWeight: 700 }}>01</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Download APK</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.55, marginBottom: '16px' }}>
                Tap the Download button below. The package <code style={{ color: '#cbd5e1' }}>netplixx-v1.0.0.apk</code> (22.2 MB) will be saved to your device.
              </p>
              <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', color: '#71717a' }}>
                File: netplixx-v1.0.0.apk • 22.2 MB
              </div>
            </div>

            {/* Step 2 */}
            <div className="panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="code-chip" style={{ color: '#2997ff', fontWeight: 700 }}>02</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Confirm Prompt</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.55, marginBottom: '16px' }}>
                If your browser shows standard security notice <em>"File might be harmful"</em>, tap <strong>Download anyway</strong>. This appears on all non-Play Store APKs.
              </p>
              <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', color: '#71717a' }}>
                Status: Verified Clean (Zero permissions)
              </div>
            </div>

            {/* Step 3 */}
            <div className="panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="code-chip" style={{ color: '#2997ff', fontWeight: 700 }}>03</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Enable Source</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.55, marginBottom: '16px' }}>
                Open the downloaded file. If prompted, go to Settings and switch <strong>Allow from this source</strong> to ON for your browser or file manager.
              </p>
              <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', color: '#71717a' }}>
                Settings → Apps → Special app access
              </div>
            </div>

            {/* Step 4 */}
            <div className="panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="code-chip" style={{ color: '#34c759', fontWeight: 700 }}>04</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Launch & Stream</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.55, marginBottom: '16px' }}>
                Tap <strong>Install</strong>. Once completed, launch Netplix from your app drawer. No registration or credentials needed to begin.
              </p>
              <div style={{ padding: '10px 12px', background: 'rgba(52, 199, 89, 0.08)', borderRadius: '8px', border: '1px solid rgba(52, 199, 89, 0.2)', fontSize: '0.75rem', color: '#34c759', fontWeight: 600 }}>
                Ready to stream immediately
              </div>
            </div>
          </div>
        )}

        {/* Step-by-Step for Android TV & Firestick */}
        {deviceTab === 'tv' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '36px',
            }}
          >
            {/* TV Step 1 */}
            <div className="panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="code-chip" style={{ color: '#38bdf8', fontWeight: 700 }}>01</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Install Downloader App</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.55 }}>
                Search for <strong>Downloader by AFTVnews</strong> in the Google Play Store (on Android TV) or Amazon Appstore (on Fire TV) and install it.
              </p>
            </div>

            {/* TV Step 2 */}
            <div className="panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="code-chip" style={{ color: '#38bdf8', fontWeight: 700 }}>02</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Enter Download URL</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.55, marginBottom: '10px' }}>
                Open Downloader and enter the direct APK URL:
              </p>
              <code style={{ display: 'block', padding: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', fontSize: '0.76rem', color: '#38bdf8', wordBreak: 'break-all' }}>
                https://netplixx.netlify.app/downloads/netplixx-v1.0.0.apk
              </code>
            </div>

            {/* TV Step 3 */}
            <div className="panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="code-chip" style={{ color: '#34c759', fontWeight: 700 }}>03</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Install & Use Remote</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.55 }}>
                When the download finishes, select Install. Use your TV remote directional D-pad to browse categories and start streaming in full 4K.
              </p>
            </div>
          </div>
        )}

        {/* Quick Action Footer in Install Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            padding: '20px 24px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34c759' }} />
            <span style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
              Latest release: <strong>netplixx-v1.0.0.apk</strong> (SHA-256 verified)
            </span>
          </div>

          <button
            onClick={onDownloadClick}
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.86rem' }}
          >
            <Download size={14} />
            <span>Download APK Now</span>
          </button>
        </div>
      </div>
    </section>
  );
}
