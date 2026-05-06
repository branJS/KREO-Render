'use client';

import Image from 'next/image';
import { useState } from 'react';

// ─── Metadata is exported from a separate server component below.
// We use a client component here so hover states work without JS framework overhead.

const images = [
  {
    src: '/preview/the-gate/THE_GATE_Still_01_Entrance.png',
    alt: 'The Gate — Entrance, Chelsea Square SW3',
    label: 'Grand Entrance',
  },
  {
    src: '/preview/the-gate/THE_GATE_Still_02_Principal_Reception.png',
    alt: 'The Gate — Principal Reception, Chelsea Square SW3',
    label: 'Principal Reception',
  },
  {
    src: '/preview/the-gate/THE_GATE_Still_03_Communal_Gardens.png',
    alt: 'The Gate — Communal Gardens, Chelsea Square SW3',
    label: 'Communal Gardens',
  },
];

export default function TheGatePreview() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [locked, setLocked] = useState(true);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim().toLowerCase() === 'john') {
      setLocked(false);
      setError(false);
    } else {
      setError(true);
      setShake(true);
      setInput('');
      setTimeout(() => setShake(false), 500);
    }
  }

  if (locked) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }

          .gate-lock-screen {
            min-height: 100vh;
            background: #0a0a0a;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Space Grotesk', system-ui, sans-serif;
            padding: 2rem;
          }

          .gate-lock-inner {
            width: 100%;
            max-width: 380px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
          }

          .gate-lock-wordmark {
            font-size: 0.7rem;
            font-weight: 800;
            letter-spacing: 0.24em;
            text-transform: uppercase;
            color: #3a3630;
          }

          .gate-lock-rule {
            width: 1px;
            height: 48px;
            background: #1e1c19;
          }

          .gate-lock-title {
            text-align: center;
          }
          .gate-lock-title h1 {
            font-size: clamp(2rem, 8vw, 2.8rem);
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #f0ebe2;
            line-height: 1;
          }
          .gate-lock-title p {
            margin-top: 0.6rem;
            font-size: 0.68rem;
            font-weight: 600;
            letter-spacing: 0.2em;
            color: #3a3630;
            text-transform: uppercase;
          }

          .gate-lock-form {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .gate-lock-label {
            font-size: 0.6rem;
            font-weight: 700;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #4a4540;
          }

          .gate-lock-input-wrap {
            position: relative;
          }

          .gate-lock-input {
            width: 100%;
            background: #0f0e0c;
            border: 1px solid #2a2825;
            color: #e8e2d9;
            padding: 0.9rem 1rem;
            font-size: 0.9rem;
            font-family: inherit;
            font-weight: 600;
            letter-spacing: 0.08em;
            outline: none;
            transition: border-color 0.2s;
            -webkit-text-security: disc;
            text-security: disc;
          }
          .gate-lock-input:focus {
            border-color: #c8a96e;
          }
          .gate-lock-input.gate-lock-error {
            border-color: #7a3535;
          }

          @keyframes gate-shake {
            0%,100% { transform: translateX(0); }
            20%      { transform: translateX(-6px); }
            40%      { transform: translateX(6px); }
            60%      { transform: translateX(-4px); }
            80%      { transform: translateX(4px); }
          }
          .gate-lock-shake {
            animation: gate-shake 0.45s cubic-bezier(0.36,0.07,0.19,0.97) both;
          }

          .gate-lock-btn {
            width: 100%;
            background: transparent;
            border: 1px solid #2a2825;
            color: #e8e2d9;
            padding: 0.9rem 1rem;
            font-size: 0.72rem;
            font-family: inherit;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            cursor: pointer;
            transition: border-color 0.2s, color 0.2s;
          }
          .gate-lock-btn:hover {
            border-color: #c8a96e;
            color: #c8a96e;
          }

          .gate-lock-error-msg {
            font-size: 0.6rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #7a3535;
            text-align: center;
            min-height: 1em;
          }

          .gate-lock-footer {
            font-size: 0.58rem;
            font-weight: 600;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #1e1c19;
          }
        `}</style>

        <div className="gate-lock-screen">
          <div className="gate-lock-inner">
            <span className="gate-lock-wordmark">KREO Studio</span>
            <div className="gate-lock-rule" />

            <div className="gate-lock-title">
              <h1>THE GATE</h1>
              <p>Chelsea Square · SW3 · Private Preview</p>
            </div>

            <form className="gate-lock-form" onSubmit={handleUnlock}>
              <label className="gate-lock-label" htmlFor="gate-pw">
                Access Code
              </label>
              <div className={`gate-lock-input-wrap ${shake ? 'gate-lock-shake' : ''}`}>
                <input
                  id="gate-pw"
                  type="password"
                  className={`gate-lock-input ${error ? 'gate-lock-error' : ''}`}
                  value={input}
                  onChange={e => { setInput(e.target.value); setError(false); }}
                  autoComplete="off"
                  autoFocus
                  placeholder="· · · · · · · ·"
                />
              </div>
              <button type="submit" className="gate-lock-btn">
                Enter
              </button>
              <p className="gate-lock-error-msg">
                {error ? 'Incorrect access code — please try again' : ''}
              </p>
            </form>

            <span className="gate-lock-footer">Confidential · Not for distribution</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ── Lightbox overlay ── */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            padding: '1.5rem',
          }}
        >
          <div style={{ position: 'relative', maxWidth: '1200px', width: '100%', aspectRatio: '16/9' }}>
            <Image
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              fill
              style={{ objectFit: 'contain' }}
              sizes="100vw"
              priority
            />
          </div>
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              letterSpacing: '0',
            }}
          >
            ✕
          </button>
        </div>
      )}

      <main
        style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          color: '#e8e2d9',
          fontFamily: "'Space Grotesk', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          overflowX: 'hidden',
        }}
      >
        {/* ── WORDMARK ── */}
        <header
          style={{
            padding: '2rem 2.5rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: '0.78rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#e8e2d9',
              opacity: 0.9,
            }}
          >
            KREO Studio
          </span>

          {/* Private Preview badge */}
          <span
            style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#7a7570',
              border: '1px solid #2a2825',
              padding: '0.3rem 0.65rem',
              borderRadius: '2px',
            }}
          >
            Private Preview
          </span>
        </header>

        {/* ── RULE ── */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, #2a2825 20%, #2a2825 80%, transparent)',
            margin: '0 2.5rem',
          }}
        />

        {/* ── HERO ── */}
        <section
          style={{
            padding: 'clamp(3rem, 8vw, 7rem) 2.5rem clamp(2rem, 5vw, 4rem)',
            maxWidth: '960px',
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              margin: '0 0 1.2rem',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#5a5550',
            }}
          >
            Residential · London · 2025
          </p>

          {/* Main title */}
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(52px, 11vw, 130px)',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              lineHeight: 0.92,
              color: '#f0ebe2',
            }}
          >
            THE<br />GATE
          </h1>

          {/* Subtitle */}
          <p
            style={{
              margin: '1.4rem 0 0',
              fontSize: 'clamp(0.9rem, 2vw, 1.15rem)',
              fontWeight: 400,
              letterSpacing: '0.12em',
              color: '#6a6460',
            }}
          >
            Chelsea Square&nbsp;&nbsp;·&nbsp;&nbsp;SW3
          </p>
        </section>

        {/* ── GALLERY ── */}
        <section
          style={{
            padding: '0 2rem clamp(3rem, 6vw, 5rem)',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          {/* Top row: 2 images side by side */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            {images.slice(0, 2).map((img, i) => (
              <GalleryImage
                key={img.src}
                img={img}
                index={i}
                priority={true}
                onClick={() => setLightbox(i)}
                aspectStyle={{ aspectRatio: '4/3' }}
              />
            ))}
          </div>

          {/* Bottom row: 1 full-width image */}
          <GalleryImage
            img={images[2]}
            index={2}
            priority={false}
            onClick={() => setLightbox(2)}
            aspectStyle={{ aspectRatio: '21/9' }}
          />
        </section>

        {/* ── DOWNLOAD CTA ── */}
        <section
          style={{
            padding: '0 2.5rem clamp(3rem, 6vw, 6rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#4a4540',
            }}
          >
            Project Documentation
          </p>

          {/* TODO: link to PDF — replace href with the correct public path once uploaded */}
          <a
            href="/preview/the-gate/THE_GATE_Pitch_Sheet.pdf"
            target="_blank"
            rel="noopener noreferrer"
            // TODO: add pitch sheet PDF path here — currently points to /preview/the-gate/THE_GATE_Pitch_Sheet.pdf
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'transparent',
              color: '#e8e2d9',
              border: '1px solid #2f2c28',
              padding: '0.85rem 1.4rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'border-color 0.2s, color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.borderColor = '#c8a96e';
              el.style.color = '#c8a96e';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.borderColor = '#2f2c28';
              el.style.color = '#e8e2d9';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download Pitch Sheet
          </a>
        </section>

        {/* ── FOOTER ── */}
        <footer
          style={{
            borderTop: '1px solid #1a1815',
            padding: '1.5rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: '#3a3630',
              textTransform: 'uppercase',
            }}
          >
            Produced by KREO Studio&nbsp;&nbsp;·&nbsp;&nbsp;kreostudio.co.uk
          </span>
          <span
            style={{
              fontSize: '0.6rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              color: '#2a2825',
              textTransform: 'uppercase',
            }}
          >
            Confidential · Not for distribution
          </span>
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .gate-img-wrap {
          position: relative;
          overflow: hidden;
          cursor: zoom-in;
          background: #111;
        }
        .gate-img-wrap img {
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      filter 0.6s ease;
          filter: brightness(0.95) saturate(0.9);
        }
        .gate-img-wrap:hover img {
          transform: scale(1.04);
          filter: brightness(1.02) saturate(1.05);
        }
        .gate-img-label {
          position: absolute;
          bottom: 0.9rem;
          left: 1rem;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(232, 226, 217, 0.55);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .gate-img-wrap:hover .gate-img-label {
          opacity: 1;
        }

        @media (max-width: 640px) {
          .gate-gallery-top {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

// ── Gallery image sub-component ──
function GalleryImage({
  img,
  index,
  priority,
  onClick,
  aspectStyle,
}: {
  img: { src: string; alt: string; label: string };
  index: number;
  priority: boolean;
  onClick: () => void;
  aspectStyle: React.CSSProperties;
}) {
  return (
    <div
      className="gate-img-wrap"
      onClick={onClick}
      style={aspectStyle}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1400px) 50vw, 700px"
        style={{ objectFit: 'cover' }}
        priority={priority}
      />
      <span className="gate-img-label">{img.label}</span>
    </div>
  );
}
