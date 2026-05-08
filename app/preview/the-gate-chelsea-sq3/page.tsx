'use client';

import Image from 'next/image';
import { useState } from 'react';

const images = [
  {
    src: '/preview/the-gate/THE_GATE_Still_01_Entrance.png',
    alt: 'The Gate entrance, Chelsea Square SW3',
    label: 'Arrival',
    note: 'Street-level presence and first impression',
  },
  {
    src: '/preview/the-gate/THE_GATE_Still_02_Principal_Reception.png',
    alt: 'The Gate principal reception, Chelsea Square SW3',
    label: 'Reception',
    note: 'Principal room with cinematic staging',
  },
  {
    src: '/preview/the-gate/THE_GATE_Still_03_Communal_Gardens.png',
    alt: 'The Gate communal gardens, Chelsea Square SW3',
    label: 'Gardens',
    note: 'Private green outlook and resident amenity',
  },
];

const stats = [
  ['Location', 'Chelsea Square SW3'],
  ['Audience', 'Private buyers / investors'],
  ['Format', 'Cinematic preview deck'],
  ['Assets', 'Film, stills, pitch PDFs'],
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
        <PreviewStyles />
        <main className="gate-lock">
          <div className="gate-lock-bg" />
          <div className="gate-lock-panel">
            <div className="gate-lock-meta">
              <span>KREO Studio</span>
              <span>Confidential</span>
            </div>

            <div className="gate-lock-title">
              <p>Private property preview</p>
              <h1>THE GATE</h1>
              <span>Chelsea Square / SW3</span>
            </div>

            <form className="gate-lock-form" onSubmit={handleUnlock}>
              <label htmlFor="gate-pw">Access code</label>
              <input
                id="gate-pw"
                type="password"
                className={`${error ? 'is-error' : ''} ${shake ? 'is-shaking' : ''}`}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(false);
                }}
                autoComplete="off"
                autoFocus
                placeholder="Private code"
              />
              <button type="submit">Enter Preview</button>
              <p>{error ? 'Incorrect access code. Please try again.' : 'Not for distribution.'}</p>
            </form>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <PreviewStyles />

      {lightbox !== null && (
        <button className="gate-lightbox" onClick={() => setLightbox(null)} aria-label="Close image preview">
          <Image src={images[lightbox].src} alt={images[lightbox].alt} fill sizes="100vw" priority style={{ objectFit: 'contain' }} />
          <span>Close</span>
        </button>
      )}

      <main className="gate-page">
        <header className="gate-nav">
          <span>KREO Studio</span>
          <span>Private Preview / SW3</span>
        </header>

        <section className="gate-hero">
          <Image
            src={images[1].src}
            alt={images[1].alt}
            fill
            priority
            sizes="100vw"
            className="gate-hero-img"
          />
          <div className="gate-hero-scrim" />
          <div className="gate-hero-content">
            <p className="gate-kicker">Private cinematic property presentation</p>
            <h1>THE GATE</h1>
            <div className="gate-hero-bottom">
              <p>
                Chelsea Square SW3, presented as a quiet luxury preview for attention before the viewing,
                investment conversation, or launch moment.
              </p>
              <a href="#documents">View Documents</a>
            </div>
          </div>
        </section>

        <section className="gate-stat-band" aria-label="Project metadata">
          {stats.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </section>

        <section className="gate-intro">
          <div>
            <p className="gate-kicker">Built for confidence</p>
            <h2>Authentic atmosphere, investor-grade clarity.</h2>
          </div>
          <p>
            This preview frames The Gate as more than a property asset. The visual system uses composed
            stills, restrained movement, and private-deck pacing to communicate trust, scarcity, and
            considered value without needing to over-explain the opportunity.
          </p>
        </section>

        <section className="gate-film">
          <div className="gate-section-head">
            <p className="gate-kicker">Preview film</p>
            <h2>Principal Reception</h2>
          </div>
          <div className="gate-video">
            <iframe
              src="https://www.youtube.com/embed/UFi5dTCAc0w"
              title="The Gate principal reception preview film"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="gate-caption">
            <span>Cinematic render / Chelsea Square</span>
            <span>KREO Studio 2025</span>
          </div>
        </section>

        <section className="gate-gallery">
          <div className="gate-section-head">
            <p className="gate-kicker">Selected stills</p>
            <h2>A controlled first impression.</h2>
          </div>
          <div className="gate-gallery-grid">
            {images.map((img, index) => (
              <button key={img.src} className={`gate-shot gate-shot-${index + 1}`} onClick={() => setLightbox(index)}>
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 760px) 100vw, 50vw" />
                <span>{img.label}</span>
                <p>{img.note}</p>
              </button>
            ))}
          </div>
        </section>

        <section id="documents" className="gate-docs">
          <div>
            <p className="gate-kicker">Private documents</p>
            <h2>Prepared for selective review.</h2>
            <p>
              The pitch sheet is kept concise, premium, and ready to share when the conversation
              moves from interest to action.
            </p>
          </div>
          <div className="gate-doc-links">
            <a href="/preview/the-gate/THE_GATE_Pitch_Sheet.pdf" target="_blank" rel="noopener noreferrer">
              <span>01</span>
              Download Pitch Sheet
            </a>
          </div>
        </section>

        <footer className="gate-footer">
          <span>Produced by KREO Studio</span>
          <span>Confidential / Not for distribution</span>
        </footer>
      </main>
    </>
  );
}

function PreviewStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

      :root {
        --gate-black: #050505;
        --gate-ink: #0d0c0a;
        --gate-panel: #14110d;
        --gate-cream: #f0e7d7;
        --gate-muted: rgba(240,231,215,0.62);
        --gate-faint: rgba(240,231,215,0.18);
        --gate-gold: #c8a96e;
        --gate-gold-soft: rgba(200,169,110,0.24);
        --gate-teal: #123c39;
      }

      * { box-sizing: border-box; }

      body { margin: 0; background: var(--gate-black); }

      .gate-page,
      .gate-lock {
        min-height: 100vh;
        background:
          radial-gradient(circle at 20% 0%, rgba(200,169,110,0.11), transparent 34rem),
          linear-gradient(180deg, #050505 0%, #11100d 48%, #050505 100%);
        color: var(--gate-cream);
        font-family: Inter, system-ui, sans-serif;
      }

      .gate-lock {
        position: relative;
        display: grid;
        place-items: center;
        padding: 1.5rem;
        overflow: hidden;
      }

      .gate-lock-bg {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(90deg, rgba(0,0,0,0.8), rgba(0,0,0,0.24), rgba(0,0,0,0.88)),
          url('/preview/the-gate/THE_GATE_Still_01_Entrance.png') center/cover;
        filter: saturate(0.75) brightness(0.45);
        transform: scale(1.04);
      }

      .gate-lock-panel {
        position: relative;
        width: min(100%, 480px);
        border: 1px solid rgba(200,169,110,0.36);
        background: rgba(5,5,5,0.78);
        box-shadow: 0 32px 120px rgba(0,0,0,0.7);
        backdrop-filter: blur(18px);
        padding: clamp(1.3rem, 5vw, 2.2rem);
      }

      .gate-lock-meta,
      .gate-nav,
      .gate-caption,
      .gate-footer {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        color: rgba(240,231,215,0.5);
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .gate-lock-title {
        margin: clamp(2.4rem, 8vw, 4rem) 0 2rem;
      }

      .gate-lock-title p,
      .gate-kicker {
        margin: 0 0 0.8rem;
        color: var(--gate-gold);
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.2em;
        text-transform: uppercase;
      }

      .gate-lock-title h1,
      .gate-hero h1,
      .gate-intro h2,
      .gate-section-head h2,
      .gate-docs h2 {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-weight: 600;
      }

      .gate-lock-title h1 {
        margin: 0;
        font-size: clamp(3.6rem, 16vw, 7rem);
        line-height: 0.82;
        letter-spacing: 0.04em;
      }

      .gate-lock-title span {
        display: block;
        margin-top: 0.9rem;
        color: var(--gate-muted);
        letter-spacing: 0.18em;
        text-transform: uppercase;
        font-size: 0.75rem;
      }

      .gate-lock-form {
        display: grid;
        gap: 0.8rem;
      }

      .gate-lock-form label {
        color: rgba(240,231,215,0.54);
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .gate-lock-form input,
      .gate-lock-form button {
        width: 100%;
        border: 1px solid rgba(200,169,110,0.32);
        background: rgba(255,255,255,0.045);
        color: var(--gate-cream);
        padding: 1rem;
        font: inherit;
        font-weight: 700;
        letter-spacing: 0.08em;
        outline: none;
      }

      .gate-lock-form input:focus {
        border-color: var(--gate-gold);
        box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
      }

      .gate-lock-form input.is-error {
        border-color: #8f4940;
      }

      .gate-lock-form button {
        background: var(--gate-gold);
        color: #080705;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        transition: transform 0.2s ease, background 0.2s ease;
      }

      .gate-lock-form button:hover {
        transform: translateY(-2px);
        background: #e0c38b;
      }

      .gate-lock-form p {
        min-height: 1em;
        margin: 0;
        color: rgba(240,231,215,0.45);
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      @keyframes gate-shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-7px); }
        40% { transform: translateX(7px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }

      .is-shaking {
        animation: gate-shake 0.45s cubic-bezier(0.36,0.07,0.19,0.97) both;
      }

      .gate-nav {
        position: fixed;
        z-index: 20;
        top: 0;
        left: 0;
        right: 0;
        padding: 1rem clamp(1rem, 4vw, 2.4rem);
        background: linear-gradient(180deg, rgba(5,5,5,0.78), transparent);
        pointer-events: none;
      }

      .gate-hero {
        position: relative;
        min-height: 100svh;
        display: flex;
        align-items: flex-end;
        overflow: hidden;
      }

      .gate-hero-img {
        object-fit: cover;
        filter: saturate(0.78) contrast(1.06) brightness(0.72);
        transform: scale(1.02);
      }

      .gate-hero-scrim {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(90deg, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.52) 42%, rgba(5,5,5,0.2) 100%),
          linear-gradient(0deg, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.4) 46%, rgba(5,5,5,0.2) 100%);
      }

      .gate-hero-content {
        position: relative;
        width: min(100%, 1280px);
        padding: clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 4rem) clamp(2rem, 6vw, 4rem);
      }

      .gate-hero h1 {
        margin: 0;
        font-size: clamp(5.4rem, 18vw, 17rem);
        line-height: 0.72;
        letter-spacing: 0.015em;
        color: #f7eddd;
        text-shadow: 0 24px 80px rgba(0,0,0,0.72);
      }

      .gate-hero-bottom {
        width: min(100%, 760px);
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1rem;
        margin-top: clamp(1.5rem, 4vw, 3rem);
        border-top: 1px solid var(--gate-gold-soft);
        padding-top: 1rem;
      }

      .gate-hero-bottom p,
      .gate-intro > p,
      .gate-docs p {
        margin: 0;
        color: var(--gate-muted);
        font-size: clamp(0.95rem, 1.8vw, 1.12rem);
        line-height: 1.8;
      }

      .gate-hero-bottom a,
      .gate-doc-links a {
        color: var(--gate-cream);
        border: 1px solid rgba(200,169,110,0.42);
        background: rgba(255,255,255,0.035);
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.72rem;
        font-weight: 800;
        padding: 0.8rem 1rem;
        white-space: nowrap;
        transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
      }

      .gate-hero-bottom a:hover,
      .gate-doc-links a:hover {
        background: var(--gate-gold);
        color: #080705;
        transform: translateY(-2px);
      }

      .gate-stat-band {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        border-top: 1px solid var(--gate-gold-soft);
        border-bottom: 1px solid var(--gate-gold-soft);
        background: rgba(5,5,5,0.74);
      }

      .gate-stat-band div {
        min-height: 116px;
        padding: 1.25rem;
        border-right: 1px solid rgba(200,169,110,0.18);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .gate-stat-band div:last-child {
        border-right: 0;
      }

      .gate-stat-band span {
        color: rgba(240,231,215,0.42);
        font-size: 0.62rem;
        font-weight: 800;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .gate-stat-band strong {
        color: var(--gate-cream);
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: clamp(1.25rem, 2.5vw, 2rem);
        font-weight: 600;
        line-height: 1.05;
      }

      .gate-intro,
      .gate-film,
      .gate-gallery,
      .gate-docs {
        width: min(100%, 1320px);
        margin: 0 auto;
        padding: clamp(3rem, 7vw, 6.5rem) clamp(1rem, 4vw, 2.4rem);
      }

      .gate-intro {
        display: grid;
        grid-template-columns: minmax(0, 0.92fr) minmax(280px, 0.72fr);
        gap: clamp(2rem, 6vw, 6rem);
        align-items: end;
      }

      .gate-intro h2,
      .gate-section-head h2,
      .gate-docs h2 {
        margin: 0;
        color: #f7eddd;
        font-size: clamp(2.4rem, 7vw, 6.2rem);
        line-height: 0.94;
      }

      .gate-section-head {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .gate-film {
        padding-top: 0;
      }

      .gate-video {
        position: relative;
        aspect-ratio: 16 / 9;
        border: 1px solid rgba(200,169,110,0.36);
        background: #000;
        box-shadow: 0 28px 90px rgba(0,0,0,0.48);
        overflow: hidden;
      }

      .gate-video::before,
      .gate-video::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: clamp(20px, 4vw, 44px);
        z-index: 1;
        pointer-events: none;
        background: rgba(0,0,0,0.88);
        border-color: rgba(200,169,110,0.2);
      }

      .gate-video::before {
        top: 0;
        border-bottom: 1px solid rgba(200,169,110,0.2);
      }

      .gate-video::after {
        bottom: 0;
        border-top: 1px solid rgba(200,169,110,0.2);
      }

      .gate-video iframe {
        width: 100%;
        height: 100%;
        border: 0;
        display: block;
      }

      .gate-caption {
        margin-top: 0.8rem;
      }

      .gate-gallery {
        padding-top: 0;
      }

      .gate-gallery-grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 0.75rem;
      }

      .gate-shot {
        position: relative;
        min-height: 420px;
        border: 1px solid rgba(200,169,110,0.28);
        background: #090806;
        color: var(--gate-cream);
        overflow: hidden;
        cursor: zoom-in;
        padding: 0;
        text-align: left;
      }

      .gate-shot-1,
      .gate-shot-2 {
        grid-column: span 6;
      }

      .gate-shot-3 {
        grid-column: span 12;
        min-height: 520px;
      }

      .gate-shot img {
        object-fit: cover;
        filter: saturate(0.72) brightness(0.72);
        transition: transform 0.75s ease, filter 0.75s ease;
      }

      .gate-shot:hover img {
        transform: scale(1.045);
        filter: saturate(0.9) brightness(0.9);
      }

      .gate-shot::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(0deg, rgba(5,5,5,0.88), transparent 48%);
      }

      .gate-shot span,
      .gate-shot p {
        position: absolute;
        z-index: 1;
        left: 1.1rem;
        right: 1.1rem;
      }

      .gate-shot span {
        bottom: 3.4rem;
        color: var(--gate-gold);
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.2em;
        text-transform: uppercase;
      }

      .gate-shot p {
        bottom: 1.1rem;
        margin: 0;
        color: rgba(240,231,215,0.72);
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: clamp(1.3rem, 2.6vw, 2.2rem);
        line-height: 1;
      }

      .gate-docs {
        display: grid;
        grid-template-columns: minmax(0, 0.8fr) minmax(280px, 0.62fr);
        gap: clamp(2rem, 6vw, 5rem);
        align-items: center;
        border-top: 1px solid rgba(200,169,110,0.22);
      }

      .gate-docs h2 {
        margin-bottom: 1rem;
      }

      .gate-doc-links {
        display: grid;
        gap: 0.75rem;
      }

      .gate-doc-links a {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.1rem;
      }

      .gate-doc-links span {
        color: var(--gate-gold);
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 1.7rem;
        line-height: 1;
      }

      .gate-footer {
        border-top: 1px solid rgba(200,169,110,0.18);
        padding: 1.3rem clamp(1rem, 4vw, 2.4rem);
      }

      .gate-lightbox {
        position: fixed;
        inset: 0;
        z-index: 100;
        border: 0;
        background: rgba(0,0,0,0.94);
        cursor: zoom-out;
      }

      .gate-lightbox span {
        position: fixed;
        top: 1rem;
        right: 1rem;
        border: 1px solid rgba(200,169,110,0.4);
        color: var(--gate-cream);
        background: rgba(5,5,5,0.72);
        padding: 0.65rem 0.8rem;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      @media (max-width: 900px) {
        .gate-stat-band {
          grid-template-columns: repeat(2, 1fr);
        }

        .gate-stat-band div:nth-child(2) {
          border-right: 0;
        }

        .gate-intro,
        .gate-docs {
          grid-template-columns: 1fr;
        }

        .gate-hero-bottom {
          align-items: flex-start;
          flex-direction: column;
        }

        .gate-shot-1,
        .gate-shot-2,
        .gate-shot-3 {
          grid-column: span 12;
          min-height: 360px;
        }
      }

      @media (max-width: 560px) {
        .gate-nav,
        .gate-lock-meta,
        .gate-caption,
        .gate-footer {
          font-size: 0.56rem;
          letter-spacing: 0.12em;
        }

        .gate-hero {
          min-height: 86svh;
        }

        .gate-hero h1 {
          font-size: clamp(4.5rem, 28vw, 8rem);
        }

        .gate-stat-band {
          grid-template-columns: 1fr;
        }

        .gate-stat-band div {
          min-height: 96px;
          border-right: 0;
          border-bottom: 1px solid rgba(200,169,110,0.18);
        }

        .gate-stat-band div:last-child {
          border-bottom: 0;
        }

        .gate-shot {
          min-height: 300px;
        }
      }
    `}</style>
  );
}
