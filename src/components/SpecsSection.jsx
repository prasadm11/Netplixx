import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Lock, Terminal } from 'lucide-react';

export default function SpecsSection() {
  const [copied, setCopied] = useState(false);
  const sha256 = '61c2893b9118849aed7049722846770bf588b28ca469edd1791f0cad61ee7299';

  const copySha = () => {
    navigator.clipboard.writeText(sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const manifest = [
    { key: 'Package Identifier', val: 'com.netplixx.app' },
    { key: 'Version Name / Code', val: '1.0.0 (Version Code 1)' },
    { key: 'Target SDK', val: 'API 35 (Android 15)' },
    { key: 'Minimum SDK', val: 'API 24 (Android 7.0 Nougat)' },
    { key: 'Binary Architectures', val: 'arm64-v8a, armeabi-v7a, x86_64 (Universal)' },
    { key: 'Binary Size', val: '22.2 MB (23,252,933 bytes)' },
    { key: 'Build Engine', val: 'Android Gradle Plugin 8.7 • Kotlin 2.0 • Compose BOM' },
    { key: 'Video Engine', val: 'AndroidX Media3 ExoPlayer 1.5.0' },
  ];

  return (
    <section id="checksums" style={{ padding: '80px 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '640px', marginBottom: '36px' }}>
          <div className="subtle-badge" style={{ marginBottom: '12px' }}>
            <span>Release Manifest & Integrity</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', marginBottom: '12px' }}>
            Cryptographic Verification
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6 }}>
            Verify the integrity of your downloaded package before installation using standard SHA-256 tools.
          </p>
        </div>

        {/* SHA-256 Box */}
        <div
          className="panel"
          style={{
            padding: '24px',
            marginBottom: '32px',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
              SHA-256 CHECKSUM (netplixx-v1.0.0.apk)
            </span>
            <button
              onClick={copySha}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.06)',
                color: copied ? '#34c759' : '#cbd5e1',
                fontSize: '0.78rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Checksum Copied' : 'Copy Hash'}</span>
            </button>
          </div>

          <code
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: '#38bdf8',
              wordBreak: 'break-all',
              background: 'rgba(0,0,0,0.5)',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {sha256}
          </code>

          <div style={{ marginTop: '14px', fontSize: '0.78rem', color: '#71717a' }}>
            Verify in terminal: <code className="code-chip" style={{ color: '#cbd5e1' }}>shasum -a 256 netplixx-v1.0.0.apk</code>
          </div>
        </div>

        {/* Technical Specs Table */}
        <div
          className="panel"
          style={{
            padding: '32px',
            overflowX: 'auto',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Build Specifications</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {manifest.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div style={{ fontSize: '0.74rem', color: '#71717a', marginBottom: '4px' }}>{item.key}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f5f5f7' }}>{item.val}</div>
              </div>
            ))}
          </div>

          {/* Declared Permissions */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '10px' }}>
              DECLARED ANDROID PERMISSIONS (3 TOTAL — ZERO INVASIVE ACCESS)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span className="code-chip" style={{ color: '#34c759' }}>android.permission.INTERNET (HLS streaming)</span>
              <span className="code-chip" style={{ color: '#34c759' }}>android.permission.ACCESS_NETWORK_STATE (Failover)</span>
              <span className="code-chip" style={{ color: '#34c759' }}>android.permission.VIBRATE (UI Haptics)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
