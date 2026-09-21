import React from 'react';
import { Download, CheckCircle2, Settings, Play } from 'lucide-react';

export default function InstallSteps({ onDownloadClick }) {
  const steps = [
    {
      step: '1',
      title: 'Download APK',
      desc: 'Tap the download button to get the netplixx-v1.0.0.apk file (22 MB).',
      icon: <Download size={18} color="#2997ff" />,
    },
    {
      step: '2',
      title: 'Allow Installation',
      desc: 'If Android prompts "File might be harmful", tap Download Anyway, then enable "Install unknown apps".',
      icon: <Settings size={18} color="#2997ff" />,
    },
    {
      step: '3',
      title: 'Open & Enjoy',
      desc: 'Launch Netplix from your app drawer. Start streaming your favorite movies and series immediately.',
      icon: <Play size={18} color="#2997ff" />,
    },
  ];

  return (
    <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px', color: '#ffffff' }}>
            How to Install on Android
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            3 simple steps to get Netplix running on your phone or tablet.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '36px',
          }}
        >
          {steps.map((s) => (
            <div
              key={s.step}
              className="card-minimal"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(41, 151, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {s.icon}
                </div>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#64748b',
                  }}
                >
                  STEP {s.step}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>
                {s.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div
          style={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <button onClick={onDownloadClick} className="btn-download">
            <Download size={16} />
            <span>Download APK (22 MB)</span>
          </button>

          <a
            href="https://netplixx.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-web"
          >
            <span>Or Watch on Web</span>
          </a>
        </div>
      </div>
    </section>
  );
}
