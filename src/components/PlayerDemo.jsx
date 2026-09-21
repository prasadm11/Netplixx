import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Subtitles, Layers, Sparkles, ExternalLink, Shield } from 'lucide-react';

export default function PlayerDemo() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentServer, setCurrentServer] = useState('VidLink (4K UHD)');
  const [currentAudio, setCurrentAudio] = useState('Dolby Atmos 5.1');
  const [subtitle, setSubtitle] = useState('English [CC]');

  return (
    <section id="showcase" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', marginBottom: '12px' }}>
            <span className="badge-pill">
              <Sparkles size={14} style={{ color: '#ff2a54' }} />
              <span>Interactive Streaming Demo</span>
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '14px' }}>
            Next-Gen <span className="gradient-text-cinema">Cinema Player</span> Interface
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', fontSize: '1.05rem' }}>
            Test out the player controls below. Netplix gives you instant server failover, custom audio tracks, and buttery 60fps playback.
          </p>
        </div>

        {/* Player Container */}
        <div
          className="glass-panel"
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.9), 0 0 50px -10px rgba(255, 42, 84, 0.25)',
          }}
        >
          {/* Top Bar of the Mock Player */}
          <div
            style={{
              padding: '14px 20px',
              background: 'rgba(10, 12, 18, 0.9)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#ff2a54',
                  boxShadow: '0 0 8px #ff2a54',
                }}
              />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Dune: Part Two (2024)</span>
              <span
                style={{
                  background: 'rgba(41, 151, 255, 0.2)',
                  color: '#2997ff',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  border: '1px solid rgba(41, 151, 255, 0.3)',
                }}
              >
                4K HDR • IMAX
              </span>
            </div>

            {/* Quick Stream on Web Button */}
            <a
              href="https://netplixx.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#ff4b6e',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <span>Launch Full Web Player</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Interactive Screen Viewport */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '16 / 9',
              maxHeight: '480px',
              width: '100%',
              backgroundImage: 'url(https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520QIq.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Ambient vignette */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: isPlaying
                  ? 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.85) 100%)'
                  : 'rgba(0, 0, 0, 0.65)',
                transition: 'background 0.3s ease',
              }}
            />

            {/* Simulated Live Subtitle */}
            <div
              style={{
                position: 'absolute',
                bottom: '75px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.75)',
                padding: '6px 16px',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 600,
                textAlign: 'center',
                letterSpacing: '0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.15)',
                zIndex: 5,
              }}
            >
              [Paul Atreides]: "Lead them to Paradise!"
            </div>

            {/* Center Play/Pause button */}
            <div
              style={{
                position: 'relative',
                zIndex: 4,
                margin: 'auto',
              }}
            >
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(255, 42, 84, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 0 30px rgba(255, 42, 84, 0.8)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
              </button>
            </div>

            {/* Bottom Controls Bar */}
            <div
              style={{
                position: 'relative',
                zIndex: 4,
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {/* Scrub Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>01:42:15</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '62%', height: '100%', background: '#ff2a54', borderRadius: '2px' }} />
                  <div
                    style={{
                      position: 'absolute',
                      left: '62%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '12px',
                      height: '12px',
                      background: '#fff',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>02:46:00</span>
              </div>

              {/* Control Buttons Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button onClick={() => setIsPlaying(!isPlaying)} style={{ color: '#fff' }}>
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button onClick={() => setIsMuted(!isMuted)} style={{ color: '#fff' }}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Server: {currentServer}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      fontSize: '0.75rem',
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    CC: {subtitle}
                  </span>
                  <button style={{ color: '#fff' }} title="Settings">
                    <Settings size={18} />
                  </button>
                  <button style={{ color: '#fff' }} title="Full Screen">
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Server & Audio Controls Below Player */}
          <div
            style={{
              padding: '20px 24px',
              background: 'rgba(14, 17, 24, 0.95)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Server Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#9aa0a6', marginBottom: '6px', fontWeight: 600 }}>
                ⚡ ACTIVE STREAMING SERVER
              </label>
              <select
                value={currentServer}
                onChange={(e) => setCurrentServer(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              >
                <option value="VidLink (4K UHD)">VidLink Pro (4K UHD Direct)</option>
                <option value="VidSrc Pro (Multi-Sub)">VidSrc Pro (Multi-Subtitles)</option>
                <option value="AutoEmbed (Fast CDN)">AutoEmbed (Ultra Fast)</option>
                <option value="AnyEmbed (HD Mirror)">AnyEmbed (HD Mirror)</option>
                <option value="Cinejoy PK (Regional)">Cinejoy PK (Regional)</option>
              </select>
            </div>

            {/* Audio Track Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#9aa0a6', marginBottom: '6px', fontWeight: 600 }}>
                🔊 AUDIO TRACK & DUB
              </label>
              <select
                value={currentAudio}
                onChange={(e) => setCurrentAudio(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              >
                <option value="Dolby Atmos 5.1">English (Dolby Atmos 5.1)</option>
                <option value="Hindi Dubbed 5.1">Hindi (Bollywood Dubbed 5.1)</option>
                <option value="Telugu Dubbed">Telugu (Tollywood Dubbed)</option>
                <option value="Tamil Dubbed">Tamil (Kollywood Dubbed)</option>
              </select>
            </div>

            {/* Subtitles Track */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#9aa0a6', marginBottom: '6px', fontWeight: 600 }}>
                💬 SUBTITLES & CC
              </label>
              <select
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              >
                <option value="English [CC]">English [CC]</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="Off">Off</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
