import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sliders,
  ExternalLink,
  Download,
  Layers,
  Radio,
  Sparkles,
  Check,
  Smartphone,
  Sun,
  Tv
} from 'lucide-react';

const SERVERS = [
  { id: 'vidlink', name: 'VidLink Pro', badge: 'Ultra HD Direct', ping: '18ms', isDirect: true },
  { id: 'vidsrc', name: 'VidSrc Pro', badge: 'Multi Subtitles', ping: '32ms', isDirect: false },
  { id: 'autoembed', name: 'AutoEmbed CDN', badge: 'Fast Zero-Buffer', ping: '22ms', isDirect: false },
  { id: 'cinejoy', name: 'Cinejoy Mirror', badge: 'Regional Boost', ping: '27ms', isDirect: false },
  { id: 'anyembed', name: 'AnyEmbed Backup', badge: 'HD Mirror', ping: '41ms', isDirect: false },
];

export default function MobilePlayerShowcase({ onDownloadClick }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeServer, setActiveServer] = useState(SERVERS[0]);
  const [serverDrawerOpen, setServerDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [currentTime, setCurrentTime] = useState(74);
  const [duration, setDuration] = useState(166);
  const [gestureFeedback, setGestureFeedback] = useState(null);
  const [brightness, setBrightness] = useState(85);
  const [volumeLevel, setVolumeLevel] = useState(80);

  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const seekBy = (delta) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration || 100, videoRef.current.currentTime + delta));
    setGestureFeedback(delta > 0 ? '+10s' : '-10s');
    setTimeout(() => setGestureFeedback(null), 800);
  };

  const handleServerSwitch = (server) => {
    setActiveServer(server);
    setServerDrawerOpen(false);
    setToastMessage(`Switched to ${server.name} (${server.badge}) • ${server.ping}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current && document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.log('PiP Error:', err);
    }
  };

  const handleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <section id="mobile-player" style={{ padding: '80px 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '680px', marginBottom: '40px' }}>
          <div className="subtle-badge" style={{ marginBottom: '12px' }}>
            <span>Native Mobile Player Experience</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', marginBottom: '12px' }}>
            Engineered with Media3 & Touch Gestures
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6 }}>
            Test the live mobile player below. Features instant multi-server failover, picture-in-picture, brightness & volume gestures, and unthrottled hardware video decoding.
          </p>
        </div>

        {/* Player Layout (Grid: Player on left, Server & Gesture controls on right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '32px',
            alignItems: 'start',
          }}
        >
          {/* Main Mobile Player Frame (8 cols on desktop) */}
          <div style={{ gridColumn: 'span 8' }} className="mobile-player-container">
            <div
              ref={playerRef}
              className="panel"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                background: '#040507',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px -10px rgba(41, 151, 255, 0.15)',
              }}
            >
              {/* Toast Notification for Server Switch */}
              {toastMessage && (
                <div
                  style={{
                    position: 'absolute',
                    top: '60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 40,
                    background: 'rgba(10, 14, 22, 0.95)',
                    border: '1px solid #2997ff',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34c759' }} />
                  <span>{toastMessage}</span>
                </div>
              )}

              {/* Gesture Feedback (e.g. +10s / -10s) */}
              {gestureFeedback && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 35,
                    background: 'rgba(0, 0, 0, 0.8)',
                    padding: '12px 24px',
                    borderRadius: '16px',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {gestureFeedback}
                </div>
              )}

              {/* Video Element */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '16 / 9',
                  background: '#000',
                  overflow: 'hidden',
                }}
              >
                <video
                  ref={videoRef}
                  src="https://vjs.zencdn.net/v/oceans.mp4"
                  poster="https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520QIq.jpg"
                  playsInline
                  muted={isMuted}
                  onTimeUpdate={(e) => {
                    setCurrentTime(e.currentTarget.currentTime);
                    if (e.currentTarget.duration) setDuration(e.currentTarget.duration);
                  }}
                  onEnded={() => setIsPlaying(false)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onClick={togglePlay}
                />

                {/* Top Overlay Bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: '14px 18px',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 20,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '10px' }}>
                      tv
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Vishwanath & Sons</span>
                    <span className="code-chip" style={{ fontSize: '0.68rem', color: '#2997ff', borderColor: 'rgba(41, 151, 255, 0.3)' }}>
                      4K HDR
                    </span>
                  </div>

                  {/* Active Server Pill & Switcher Trigger */}
                  <button
                    onClick={() => setServerDrawerOpen(!serverDrawerOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(12px)',
                      color: '#fff',
                      fontSize: '0.76rem',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34c759' }} />
                    <span>{activeServer.name}</span>
                    <Sliders size={12} style={{ opacity: 0.6 }} />
                  </button>
                </div>

                {/* Center Quick Actions (When paused or overlay hovered) */}
                {!isPlaying && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 25,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                    }}
                  >
                    <button
                      onClick={() => seekBy(-10)}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Rewind 10s"
                    >
                      <RotateCcw size={18} />
                    </button>

                    <button
                      onClick={togglePlay}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        color: '#000000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                        transition: 'transform 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      aria-label="Play video"
                    >
                      <Play size={24} fill="#000" style={{ marginLeft: '3px' }} />
                    </button>

                    <button
                      onClick={() => seekBy(10)}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Forward 10s"
                    >
                      <RotateCw size={18} />
                    </button>
                  </div>
                )}

                {/* Server Selection Sheet / Dropdown */}
                {serverDrawerOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '52px',
                      right: '16px',
                      width: '280px',
                      zIndex: 30,
                      background: 'rgba(12, 14, 18, 0.96)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '16px',
                      padding: '12px',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
                    }}
                  >
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '8px', padding: '0 6px' }}>
                      SELECT STREAMING MIRROR
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {SERVERS.map((srv) => (
                        <button
                          key={srv.id}
                          onClick={() => handleServerSwitch(srv)}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            background: activeServer.id === srv.id ? 'rgba(41, 151, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                            border: activeServer.id === srv.id ? '1px solid #2997ff' : '1px solid transparent',
                            color: '#fff',
                            fontSize: '0.8rem',
                            textAlign: 'left',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600 }}>{srv.name}</div>
                            <div style={{ fontSize: '0.68rem', color: '#71717a' }}>{srv.badge}</div>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#34c759' }}>● {srv.ping}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Scrub & Controls Bar */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '12px 18px',
                    background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%)',
                    zIndex: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {/* Timeline Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                      {formatTime(currentTime)}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: '4px',
                        background: 'rgba(255,255,255,0.25)',
                        borderRadius: '2px',
                        position: 'relative',
                        cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        if (videoRef.current) {
                          videoRef.current.currentTime = pos * (videoRef.current.duration || 100);
                        }
                      }}
                    >
                      <div
                        style={{
                          width: `${(currentTime / (duration || 1)) * 100}%`,
                          height: '100%',
                          background: '#2997ff',
                          borderRadius: '2px',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                      {formatTime(duration)}
                    </span>
                  </div>

                  {/* Buttons Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <button onClick={togglePlay} style={{ color: '#fff' }}>
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <button onClick={toggleMute} style={{ color: '#fff' }}>
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                      <span style={{ fontSize: '0.76rem', color: '#a1a1aa' }}>
                        Server: <strong style={{ color: '#fff' }}>{activeServer.name}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={handlePiP}
                        style={{
                          color: '#fff',
                          fontSize: '0.74rem',
                          background: 'rgba(255,255,255,0.1)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                        title="Native Picture-in-Picture"
                      >
                        PiP Mode
                      </button>
                      <button onClick={handleFullscreen} style={{ color: '#fff' }} title="Fullscreen">
                        <Maximize size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Specs Bar */}
              <div
                style={{
                  padding: '16px 20px',
                  background: 'rgba(10, 12, 16, 0.95)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>Codec: <strong>H.264 / HEVC</strong></span>
                  <span>Audio: <strong>Dolby 5.1</strong></span>
                  <span>Container: <strong>HLS / MP4</strong></span>
                </div>

                <a
                  href="https://netplixx.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#2997ff',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Launch Live Fullscreen Web Player</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Native Android Player Features (4 cols) */}
          <div style={{ gridColumn: 'span 4' }} className="mobile-player-sidebar">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Touch Gestures Card */}
              <div className="panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Smartphone size={18} color="#2997ff" />
                  <h4 style={{ fontSize: '0.98rem' }}>Native Touch Gestures</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '14px' }}>
                  During full-screen mobile playback on Android:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                  <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#cbd5e1' }}>Swipe Left Side</span>
                    <span style={{ color: '#f5c518' }}>Brightness (0-100%)</span>
                  </div>
                  <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#cbd5e1' }}>Swipe Right Side</span>
                    <span style={{ color: '#38bdf8' }}>Volume (0-100%)</span>
                  </div>
                  <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#cbd5e1' }}>Double Tap</span>
                    <span style={{ color: '#34c759' }}>Seek ±10s</span>
                  </div>
                </div>
              </div>

              {/* Picture-in-Picture Card */}
              <div className="panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Layers size={18} color="#34c759" />
                  <h4 style={{ fontSize: '0.98rem' }}>System Picture-in-Picture</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  Multitask while watching. In the Android app, simply swipe home or press the PiP icon to float the video over your messages or browser.
                </p>
                <button
                  onClick={handlePiP}
                  className="btn-secondary"
                  style={{ width: '100%', fontSize: '0.82rem', padding: '8px 14px' }}
                >
                  <span>Test Browser PiP Now</span>
                </button>
              </div>

              {/* Direct APK Download CTA */}
              <div
                className="panel"
                style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, rgba(41, 151, 255, 0.08) 0%, rgba(18, 18, 22, 0.6) 100%)',
                  border: '1px solid rgba(41, 151, 255, 0.2)',
                }}
              >
                <h4 style={{ fontSize: '0.98rem', marginBottom: '8px' }}>Get Native ExoPlayer</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '14px' }}>
                  Download the Android APK for full hardware video acceleration and zero-lag streaming.
                </p>
                <button
                  onClick={onDownloadClick}
                  className="btn-primary"
                  style={{ width: '100%', fontSize: '0.84rem', padding: '9px 16px' }}
                >
                  <Download size={14} />
                  <span>Download APK (22 MB)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .mobile-player-container { grid-column: span 12 !important; }
          .mobile-player-sidebar { grid-column: span 12 !important; }
        }
      `}</style>
    </section>
  );
}
