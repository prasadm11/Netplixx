import React, { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Why is Netplix free with no subscription tiers?',
      a: 'Netplix is designed as an open media indexer and client. It searches public metadata via TMDB and resolves video playback from distributed third-party servers. We do not charge subscription fees or require paid memberships.'
    },
    {
      q: 'Why is the Android app provided as a direct APK rather than on Google Play?',
      a: 'Google Play policies restrict unthrottled streaming aggregators and custom multi-server resolvers. Distributing directly via signed APK gives users unrestricted 4K HDR playback, native Picture-in-Picture, and immediate updates without third-party store delays.'
    },
    {
      q: 'Can I stream on iPhone, iPad, Mac, or Windows PC?',
      a: (
        <span>
          Yes. The progressive web app version runs in any browser at{' '}
          <a
            href="https://netplixx.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2997ff', textDecoration: 'underline' }}
          >
            netplixx.netlify.app
          </a>
          . It features the same 50,000+ title catalog, full keyboard shortcuts, and responsive layout across desktop and tablets.
        </span>
      )
    },
    {
      q: 'How does multi-server failover work during playback?',
      a: 'Netplix integrates 6 distinct media resolvers (VidLink, VidSrc Pro, AutoEmbed, AnyEmbed, 2Embed, Cinejoy PK). If one server experiences high traffic or buffering, the client lets you switch mirrors instantly without losing your timestamp.'
    },
    {
      q: 'Can I install this on Android TV, Google TV, or Amazon Firestick?',
      a: 'Yes. You can sideload the APK onto Android TV and Fire OS using the Downloader app. The layout is optimized for big-screen viewing and responds to standard TV remote D-Pad navigation.'
    },
    {
      q: 'Does Netplix collect any personal viewing history or telemetry?',
      a: 'No. The app uses an on-device SQLite Room database. Your watchlist, continue-watching progress, and preferences stay strictly on your local device storage. No account login is required.'
    }
  ];

  return (
    <section id="faq" style={{ padding: '80px 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="subtle-badge" style={{ marginBottom: '12px' }}>
            <span>Documentation & FAQ</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginBottom: '10px' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Details regarding playback, security, platforms, and installation.
          </p>
        </div>

        {/* Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="panel"
                style={{
                  overflow: 'hidden',
                  borderColor: isOpen ? 'rgba(255, 255, 255, 0.18)' : 'var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left',
                    color: '#ffffff',
                    fontSize: '0.98rem',
                    fontWeight: 600,
                  }}
                  aria-expanded={isOpen}
                >
                  <span style={{ paddingRight: '16px' }}>{item.q}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: isOpen ? '#2997ff' : '#71717a',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 22px 20px 22px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      paddingTop: '14px',
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
