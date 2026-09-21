import React from 'react';
import { Layers, ShieldCheck, Database, Tv, Cpu, Radio, Film, CheckCircle2 } from 'lucide-react';

export default function FeaturesBento() {
  return (
    <section id="architecture" style={{ padding: '80px 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '640px', marginBottom: '44px' }}>
          <div className="subtle-badge" style={{ marginBottom: '12px' }}>
            <span>Architecture & Capabilities</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', marginBottom: '12px' }}>
            Built for streaming stability.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6 }}>
            Every component in the Netplix stack—from the Compose rendering layer to the multi-server media resolvers—is optimized for zero-interruption playback.
          </p>
        </div>

        {/* Engineering Highlights Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Item 1: Multi-Mirror Failover */}
          <div className="panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Radio size={18} color="#2997ff" />
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>Multi-CDN Failover Routing</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Pulls streams across 6 independent media mirrors: VidLink 4K, VidSrc Pro, AutoEmbed, AnyEmbed, 2Embed, and Cinejoy PK. If a node fails or throttles, the client switches server dynamically.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="code-chip">VidLink (Direct)</span>
              <span className="code-chip">VidSrc Pro</span>
              <span className="code-chip">AutoEmbed</span>
              <span className="code-chip">AnyEmbed</span>
            </div>
          </div>

          {/* Item 2: Media3 ExoPlayer */}
          <div className="panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={18} color="#34c759" />
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>Hardware HLS Decoding</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '16px' }}>
              The Android app leverages AndroidX Media3 ExoPlayer with direct hardware acceleration. Drastically reduces device temperature, battery consumption, and dropped frames during 4K 60fps playback.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="code-chip">Media3 1.5+</span>
              <span className="code-chip">Hardware H.264/HEVC</span>
              <span className="code-chip">Adaptive Bitrate</span>
            </div>
          </div>

          {/* Item 3: Local SQLite (Room) */}
          <div className="panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={18} color="#f5c518" />
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>Local SQLite Persistence</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Your watchlist and resume positions are stored locally on your device via Room SQLite. No account creation required, no personal viewing habits uploaded to third-party tracking clouds.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="code-chip">Room DB</span>
              <span className="code-chip">Zero Accounts</span>
              <span className="code-chip">100% On-Device</span>
            </div>
          </div>

          {/* Item 4: Picture-in-Picture & Gestures */}
          <div className="panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={18} color="#ff2a54" />
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>Native Android PiP & Gestures</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Seamlessly switch to floating Picture-in-Picture mode on swipe up. Supports dual vertical swipe gesture controls for quick volume and screen brightness adjustments during playback.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="code-chip">System PiP</span>
              <span className="code-chip">Swipe Brightness/Vol</span>
              <span className="code-chip">Double-tap Seek</span>
            </div>
          </div>

          {/* Item 5: Android TV Sideloading */}
          <div className="panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tv size={18} color="#38bdf8" />
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>Android TV & Firestick Sideload</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Compatible with Android TV OS, Google TV, and Amazon Fire TV devices. Sideload via USB or the Downloader app for big-screen streaming with remote control directional navigation.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="code-chip">Android TV 8.0+</span>
              <span className="code-chip">Fire OS 7+</span>
              <span className="code-chip">D-Pad Focus</span>
            </div>
          </div>

          {/* Item 6: Pan-Indian & Global Languages */}
          <div className="panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Film size={18} color="#a855f7" />
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>Multilingual Audio & Dubs</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Curated access to Indian regional cinema across Hindi (Bollywood), Telugu, Tamil, Malayalam, and Kannada alongside global Hollywood hits and anime with subtitle support.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="code-chip">Hindi</span>
              <span className="code-chip">Telugu</span>
              <span className="code-chip">Tamil</span>
              <span className="code-chip">English</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
