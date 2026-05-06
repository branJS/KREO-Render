'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, ReactNode } from 'react';

// ─── Password ───────────────────────────────────────────────────────────────
const CORRECT_PASSWORD = 'KREO-CUBE-2026';

// ─── Fade-in wrapper using IntersectionObserver ──────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.72s ease ${delay}ms, transform 0.72s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div
      style={{
        height: '1px',
        background: 'rgba(201,169,110,0.2)',
        margin: '0 0 0 0',
      }}
    />
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  children,
  style = {},
}: {
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <section
      style={{
        padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)',
        maxWidth: '960px',
        margin: '0 auto',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </section>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        margin: '0 0 2rem',
        fontSize: '0.62rem',
        fontWeight: 700,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: '#c9a96e',
        opacity: 0.8,
      }}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        margin: '0 0 1.8rem',
        fontSize: 'clamp(1.4rem,3.5vw,2.2rem)',
        fontWeight: 700,
        letterSpacing: '0.04em',
        color: '#f5f0e8',
        lineHeight: 1.2,
      }}
    >
      {children}
    </h2>
  );
}

function BodyText({
  children,
  style = {},
}: {
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <p
      style={{
        margin: '0 0 1.2rem',
        fontSize: 'clamp(0.92rem,1.8vw,1.05rem)',
        fontWeight: 400,
        lineHeight: 1.85,
        color: '#b8b0a4',
        ...style,
      }}
    >
      {children}
    </p>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function CaseStudyPage() {
  const [locked, setLocked] = useState(true);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() === CORRECT_PASSWORD) {
      setLocked(false);
      setError(false);
    } else {
      setError(true);
      setShake(true);
      setInput('');
      setTimeout(() => setShake(false), 500);
    }
  }

  // ── PASSWORD GATE ───────────────────────────────────────────────────────────
  if (locked) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
          *{box-sizing:border-box;margin:0;padding:0;}
          .cs-lock{
            min-height:100vh;background:#0a0a0a;
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            font-family:'Space Grotesk',system-ui,sans-serif;padding:2rem;
          }
          .cs-lock-inner{
            width:100%;max-width:400px;
            display:flex;flex-direction:column;align-items:center;gap:2.2rem;
          }
          .cs-lock-wordmark{
            font-size:0.68rem;font-weight:800;letter-spacing:0.26em;
            text-transform:uppercase;color:#3a3630;
          }
          .cs-lock-rule{width:1px;height:48px;background:#1e1c19;}
          .cs-lock-title{text-align:center;}
          .cs-lock-title h1{
            font-size:clamp(1.8rem,7vw,2.6rem);font-weight:800;
            letter-spacing:0.1em;text-transform:uppercase;
            color:#f5f0e8;line-height:1.1;
          }
          .cs-lock-title .cs-lock-sub{
            margin-top:0.5rem;font-size:0.6rem;font-weight:600;
            letter-spacing:0.2em;color:#3a3630;text-transform:uppercase;
          }
          .cs-lock-badge{
            font-size:0.58rem;font-weight:700;letter-spacing:0.18em;
            text-transform:uppercase;color:#6a5c3a;
            border:1px solid #2a2410;padding:0.35rem 0.8rem;
          }
          .cs-lock-form{width:100%;display:flex;flex-direction:column;gap:0.8rem;}
          .cs-lock-label{
            font-size:0.58rem;font-weight:700;letter-spacing:0.2em;
            text-transform:uppercase;color:#4a4540;
          }
          .cs-lock-input-wrap{position:relative;}
          .cs-lock-input{
            width:100%;background:#0d0c0b;border:1px solid #2a2825;
            color:#e8e2d9;padding:0.9rem 1rem;
            font-size:0.9rem;font-family:inherit;font-weight:600;
            letter-spacing:0.12em;outline:none;transition:border-color 0.2s;
          }
          .cs-lock-input:focus{border-color:#c9a96e;}
          .cs-lock-input.err{border-color:#7a3535;}
          @keyframes cs-shake{
            0%,100%{transform:translateX(0);}
            20%{transform:translateX(-6px);}
            40%{transform:translateX(6px);}
            60%{transform:translateX(-4px);}
            80%{transform:translateX(4px);}
          }
          .cs-lock-shake{animation:cs-shake 0.45s cubic-bezier(0.36,0.07,0.19,0.97) both;}
          .cs-lock-btn{
            width:100%;background:transparent;border:1px solid #2a2825;
            color:#e8e2d9;padding:0.9rem 1rem;
            font-size:0.7rem;font-family:inherit;font-weight:700;
            letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;
            transition:border-color 0.2s,color 0.2s;
          }
          .cs-lock-btn:hover{border-color:#c9a96e;color:#c9a96e;}
          .cs-lock-err-msg{
            font-size:0.58rem;font-weight:700;letter-spacing:0.14em;
            text-transform:uppercase;color:#7a3535;text-align:center;min-height:1em;
          }
          .cs-lock-footer{
            font-size:0.56rem;font-weight:600;letter-spacing:0.14em;
            text-transform:uppercase;color:#1e1c19;
          }
        `}</style>

        <div className="cs-lock">
          <div className="cs-lock-inner">
            <span className="cs-lock-wordmark">KREO Studio</span>
            <div className="cs-lock-rule" />

            <div className="cs-lock-title">
              <h1>THE GATE<br />Case Study</h1>
              <p className="cs-lock-sub">Private Funding Review · KREO Studio</p>
            </div>

            <span className="cs-lock-badge">Restricted Access · Enter Code to Continue</span>

            <form className="cs-lock-form" onSubmit={handleUnlock}>
              <label className="cs-lock-label" htmlFor="cs-pw">Access Code</label>
              <div className={`cs-lock-input-wrap${shake ? ' cs-lock-shake' : ''}`}>
                <input
                  id="cs-pw"
                  type="password"
                  className={`cs-lock-input${error ? ' err' : ''}`}
                  value={input}
                  onChange={e => { setInput(e.target.value); setError(false); }}
                  autoComplete="off"
                  autoFocus
                  placeholder="· · · · · · · · · · · · · ·"
                />
              </div>
              <button type="submit" className="cs-lock-btn">Enter</button>
              <p className="cs-lock-err-msg">
                {error ? 'Incorrect access code — please try again' : ''}
              </p>
            </form>

            <span className="cs-lock-footer">Confidential · Not for public distribution</span>
          </div>
        </div>
      </>
    );
  }

  // ── PAGE CONTENT ────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#0f0f0f;}

        .cs-page{
          min-height:100vh;
          background:#0f0f0f;
          color:#f5f0e8;
          font-family:'Space Grotesk',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
          overflow-x:hidden;
        }

        /* ── Bullet list styling ── */
        .cs-bullets{
          list-style:none;padding:0;margin:0;
          display:flex;flex-direction:column;gap:0.65rem;
        }
        .cs-bullets li{
          display:flex;align-items:flex-start;gap:0.7rem;
          font-size:clamp(0.9rem,1.8vw,1.02rem);
          line-height:1.75;color:#b8b0a4;
        }
        .cs-bullets li::before{
          content:'·';color:#c9a96e;flex-shrink:0;
          font-size:1.2rem;line-height:1.55;
        }

        /* ── Numbered list ── */
        .cs-numbered{
          list-style:none;padding:0;margin:0;
          display:flex;flex-direction:column;gap:1.6rem;
        }
        .cs-numbered li{display:flex;gap:1.4rem;align-items:flex-start;}
        .cs-numbered-num{
          font-size:0.62rem;font-weight:800;letter-spacing:0.18em;
          color:#c9a96e;opacity:0.6;flex-shrink:0;padding-top:0.25rem;
          min-width:1.4rem;
        }
        .cs-numbered-body{}
        .cs-numbered-body strong{
          display:block;font-size:0.9rem;font-weight:700;
          letter-spacing:0.04em;color:#f5f0e8;margin-bottom:0.3rem;
        }
        .cs-numbered-body p{
          font-size:0.92rem;line-height:1.75;color:#8a8278;
        }

        /* ── Snapshot grid ── */
        .cs-snapshot-grid{
          display:grid;
          grid-template-columns:1fr 2fr;
          gap:0;
        }
        .cs-snapshot-row{
          display:contents;
        }
        .cs-snapshot-key,
        .cs-snapshot-val{
          padding:0.85rem 0;
          border-bottom:1px solid rgba(201,169,110,0.12);
          font-size:clamp(0.82rem,1.6vw,0.94rem);
          line-height:1.6;
        }
        .cs-snapshot-key{
          font-weight:700;letter-spacing:0.04em;
          color:#7a7268;padding-right:2rem;
        }
        .cs-snapshot-val{
          color:#b8b0a4;
        }
        @media(max-width:560px){
          .cs-snapshot-grid{grid-template-columns:1fr;}
          .cs-snapshot-key{border-bottom:none;padding-bottom:0.2rem;color:#c9a96e;font-size:0.72rem;letter-spacing:0.16em;text-transform:uppercase;}
          .cs-snapshot-val{padding-top:0;}
        }

        /* ── Gallery grid ── */
        .cs-gallery{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:0.6rem;
        }
        @media(max-width:680px){
          .cs-gallery{grid-template-columns:1fr;}
        }
        .cs-gallery-item{
          display:flex;flex-direction:column;gap:0.5rem;
        }
        .cs-gallery-img{
          position:relative;
          aspect-ratio:4/3;
          overflow:hidden;
          background:#111;
        }
        .cs-gallery-img img{
          transition:transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94),
                      filter 0.65s ease;
          filter:brightness(0.92) saturate(0.88);
        }
        .cs-gallery-img:hover img{
          transform:scale(1.04);
          filter:brightness(1.0) saturate(1.0);
        }
        .cs-gallery-caption{
          font-size:0.58rem;font-weight:700;letter-spacing:0.18em;
          text-transform:uppercase;color:#5a5248;
        }

        /* ── Service tier cards ── */
        .cs-tier-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:1px;
          background:rgba(201,169,110,0.15);
          margin-top:1.5rem;
        }
        @media(max-width:680px){.cs-tier-grid{grid-template-columns:1fr;}}
        .cs-tier-card{
          background:#0f0f0f;
          padding:1.6rem 1.4rem;
        }
        .cs-tier-label{
          font-size:0.58rem;font-weight:800;letter-spacing:0.22em;
          text-transform:uppercase;color:#c9a96e;margin-bottom:0.8rem;
          opacity:0.7;
        }
        .cs-tier-name{
          font-size:0.95rem;font-weight:700;letter-spacing:0.03em;
          color:#f5f0e8;line-height:1.3;
        }

        /* ── Funding category ── */
        .cs-funding-cat{
          margin-bottom:2rem;
        }
        .cs-funding-cat-title{
          font-size:0.68rem;font-weight:800;letter-spacing:0.22em;
          text-transform:uppercase;color:#c9a96e;opacity:0.75;
          margin-bottom:0.9rem;
        }

        /* ── Steps ── */
        .cs-steps{
          display:flex;flex-direction:column;gap:0;
          counter-reset:step;
        }
        .cs-step{
          display:flex;gap:1.4rem;
          padding:1.2rem 0;
          border-bottom:1px solid rgba(201,169,110,0.1);
        }
        .cs-step:last-child{border-bottom:none;}
        .cs-step-num{
          font-size:0.58rem;font-weight:800;letter-spacing:0.16em;
          color:#c9a96e;opacity:0.5;flex-shrink:0;padding-top:0.18rem;
          min-width:2rem;
        }
        .cs-step-body{flex:1;}
        .cs-step-body strong{
          display:block;font-size:0.9rem;font-weight:700;
          color:#f5f0e8;margin-bottom:0.25rem;
        }
        .cs-step-body p{
          font-size:0.88rem;line-height:1.75;color:#7a7268;
        }

        /* ── Privacy badge in hero ── */
        .cs-privacy-badge{
          display:inline-flex;align-items:center;gap:0.5rem;
          margin-top:2rem;
          font-size:0.6rem;font-weight:700;letter-spacing:0.18em;
          text-transform:uppercase;color:#7a6a4a;
          border:1px solid #2a2010;padding:0.4rem 0.9rem;
        }
        .cs-privacy-dot{
          width:5px;height:5px;border-radius:50%;
          background:#c9a96e;opacity:0.6;flex-shrink:0;
        }

        /* ── Concept anchor words ── */
        .cs-anchor-words{
          display:flex;flex-wrap:wrap;gap:0.5rem 1.5rem;
          margin:1.4rem 0;
        }
        .cs-anchor-word{
          font-size:0.72rem;font-weight:700;letter-spacing:0.22em;
          text-transform:uppercase;color:#c9a96e;opacity:0.6;
        }

        /* ── Quote block ── */
        .cs-pull-quote{
          border-left:2px solid rgba(201,169,110,0.4);
          padding-left:1.6rem;
          margin:1.8rem 0;
        }
        .cs-pull-quote p{
          font-size:clamp(1rem,2.2vw,1.2rem);
          font-weight:600;line-height:1.65;
          color:#d4cfc6;font-style:italic;
          letter-spacing:0.01em;
        }

        /* ── Responsive ── */
        @media(max-width:640px){
          .cs-hero-title{font-size:clamp(3.5rem,18vw,6rem) !important;}
        }
      `}</style>

      <div className="cs-page">

        {/* ── HEADER ───────────────────────────────────────────────────── */}
        <header
          style={{
            padding: '2rem clamp(1.5rem,5vw,4rem) 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: '0.78rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#f5f0e8',
              opacity: 0.85,
            }}
          >
            KREO Studio
          </span>
          <span
            style={{
              fontSize: '0.58rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#6a5c3a',
              border: '1px solid #2a2010',
              padding: '0.3rem 0.7rem',
            }}
          >
            Private · Funding Review
          </span>
        </header>

        <div
          style={{
            height: '1px',
            background: 'linear-gradient(to right,transparent,rgba(201,169,110,0.2) 20%,rgba(201,169,110,0.2) 80%,transparent)',
            margin: '0 clamp(1.5rem,5vw,4rem)',
          }}
        />

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 1 — HERO                                              */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: 'clamp(4rem,10vw,8rem) clamp(1.5rem,5vw,4rem) clamp(3rem,6vw,5rem)',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          <FadeIn>
            <p
              style={{
                margin: '0 0 1.5rem',
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#c9a96e',
                opacity: 0.7,
              }}
            >
              Private Funding-Focused Case Study · KREO Studio
            </p>

            <h1
              className="cs-hero-title"
              style={{
                margin: 0,
                fontSize: 'clamp(4.5rem,14vw,10rem)',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                lineHeight: 0.9,
                color: '#f5f0e8',
              }}
            >
              THE<br />GATE
            </h1>

            <p
              style={{
                margin: '1.6rem 0 0',
                fontSize: 'clamp(1rem,2.2vw,1.25rem)',
                fontWeight: 500,
                letterSpacing: '0.1em',
                color: '#7a7268',
              }}
            >
              AI-Enhanced Property Campaign Concept
            </p>

            <p
              style={{
                margin: '1.2rem 0 0',
                fontSize: 'clamp(0.92rem,1.8vw,1.05rem)',
                fontWeight: 400,
                lineHeight: 1.8,
                color: '#6a6460',
                maxWidth: '640px',
              }}
            >
              A private speculative concept study based on a high-value Chelsea Square listing.
            </p>

            <div className="cs-privacy-badge">
              <span className="cs-privacy-dot" />
              Private proof-of-work page. Not for public distribution.
            </div>
          </FadeIn>
        </section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 2 — PROJECT SNAPSHOT                                  */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>01 — Project Snapshot</SectionLabel>
            <div className="cs-snapshot-grid">
              {[
                ['Sector', 'Luxury property / architecture marketing'],
                ['Type', 'Private speculative proof-of-concept'],
                ['Location Context', 'Chelsea Square, SW3'],
                ['Output', 'Teaser film · Campaign stills · Pitch sheet · Preview page · Outreach package'],
                ['Tools', 'Photoshop · Runway · ComfyUI · Topaz · After Effects / Premiere · ChatGPT · Claude · Gemini'],
                ['Role', 'Independent creator / designer / AI visual producer'],
                ['Status', 'Private · Watermarked · Not publicly distributed'],
                ['Business Status', 'Preparing to formalise through HMRC or Companies House guidance'],
              ].map(([k, v]) => (
                <div className="cs-snapshot-row" key={k}>
                  <div className="cs-snapshot-key">{k}</div>
                  <div className="cs-snapshot-val">{v}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 3 — THE CHALLENGE                                     */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>02 — The Challenge</SectionLabel>
            <SectionTitle>Beyond the Brochure</SectionTitle>
            <BodyText>
              High-value property listings often rely heavily on static photography and brochure
              assets, even when the property has a strong emotional story. The challenge was to
              explore how a luxury property could be transformed into a cinematic, emotionally
              engaging campaign experience using design, AI-enhanced motion, sound, and storytelling.
            </BodyText>
            <BodyText style={{ margin: 0 }}>
              This challenge points to a larger market opportunity: high-value clients who deserve
              more than static assets, and a growing gap between what traditional agencies deliver
              and what AI-enhanced studios can now produce independently.
            </BodyText>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 4 — THE OPPORTUNITY                                   */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>03 — The Opportunity</SectionLabel>
            <SectionTitle>A New Creative Production Layer</SectionTitle>
            <BodyText>
              KREO Studio identified an opportunity to build a new type of campaign system for
              property, architecture, and premium brands — one where:
            </BodyText>
            <ul className="cs-bullets" style={{ margin: '0.5rem 0 1.6rem' }}>
              {[
                'Static assets become cinematic teasers',
                'Floor plans become animated storytelling tools',
                'Still photography becomes premium campaign frames',
                'AI-enhanced motion adds atmosphere without misrepresenting the property',
                'Private preview pages create polished, professional client presentation experiences',
              ].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <BodyText style={{ margin: 0 }}>
              This is not about replacing photographers or agents. It is about building a creative
              production layer that currently does not exist at this level for most independent
              property and brand campaigns.
            </BodyText>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 5 — THE CONCEPT                                       */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>04 — The Concept</SectionLabel>
            <SectionTitle>THE GATE</SectionTitle>
            <BodyText>
              The campaign was built around one defining detail: the property sits directly opposite
              a communal garden gate — a rare and private amenity in one of London's most prestigious
              addresses.
            </BodyText>
            <BodyText>The gate became the conceptual anchor.</BodyText>

            <div className="cs-anchor-words">
              {['Arrival', 'Privacy', 'Access', 'Legacy', 'Threshold', 'Next chapter'].map(w => (
                <span className="cs-anchor-word" key={w}>{w}</span>
              ))}
            </div>

            <div className="cs-pull-quote">
              <p>
                Rather than leading with square footage and specification, the campaign leads with
                feeling. The gate is not just an entrance — it is the emotional proposition of the
                property itself.
              </p>
            </div>

            <BodyText style={{ margin: 0 }}>
              This is the kind of narrative thinking that separates a campaign from a brochure.
            </BodyText>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 6 — WHAT WAS PRODUCED                                 */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>05 — What Was Produced</SectionLabel>
            <SectionTitle>End-to-End, Independently</SectionTitle>
            <BodyText>
              Working independently, KREO Studio produced the following as a private proof-of-concept:
            </BodyText>
            <ul className="cs-bullets">
              {[
                'Short watermarked teaser film',
                'Three cinematic still campaign frames',
                'One-page private pitch sheet',
                'Password-protected private preview page',
                'Campaign copy and positioning',
                'Sound direction',
                'Outreach email',
                'Phone script',
                'Client delivery plan',
              ].map(item => <li key={item}>{item}</li>)}
            </ul>
            <BodyText style={{ marginTop: '1.4rem', margin: '1.4rem 0 0' }}>
              This project was produced independently, demonstrating end-to-end capability across
              research, design direction, AI video production, editing, sound direction, pitch
              packaging and client outreach.
            </BodyText>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 7 — TEASER VIDEO                                      */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)',
            maxWidth: '1100px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <FadeIn>
            <SectionLabel>06 — Teaser Film</SectionLabel>
            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                background: '#111',
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/UFi5dTCAc0w"
                title="THE GATE — Watermarked Private Teaser Film"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>
            <p
              style={{
                marginTop: '0.8rem',
                fontSize: '0.62rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#4a4540',
                lineHeight: 1.6,
              }}
            >
              Watermarked private proof-of-concept teaser. Produced to demonstrate campaign
              direction, visual tone and commercial potential. Not for public distribution.
            </p>
          </FadeIn>
        </section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 8 — STILL FRAMES                                      */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <FadeIn>
            <SectionLabel>07 — Campaign Stills</SectionLabel>
          </FadeIn>
          <div className="cs-gallery">
            {[
              {
                src: '/preview/the-gate/THE_GATE_Still_01_Entrance.png',
                alt: 'The Gate — Entrance, Chelsea Square SW3',
                caption: 'Still 01 · The Entrance · Arrival',
              },
              {
                src: '/preview/the-gate/THE_GATE_Still_02_Principal_Reception.png',
                alt: 'The Gate — Principal Reception, Chelsea Square SW3',
                caption: 'Still 02 · Principal Reception · Proportion & Light',
              },
              {
                src: '/preview/the-gate/THE_GATE_Still_03_Communal_Gardens.png',
                alt: 'The Gate — Communal Gardens, Chelsea Square SW3',
                caption: 'Still 03 · Communal Gardens · The View Beyond',
              },
            ].map((img, i) => (
              <FadeIn key={img.src} delay={i * 100}>
                <div className="cs-gallery-item">
                  <div className="cs-gallery-img">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width:680px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      priority={i === 0}
                    />
                  </div>
                  <p className="cs-gallery-caption">{img.caption}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 9 — PROCESS OVERVIEW                                  */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>08 — Process Overview</SectionLabel>
            <SectionTitle>Seven Stages, One Creator</SectionTitle>
            <BodyText>
              The following steps were completed independently, without external creative direction
              or agency brief:
            </BodyText>
          </FadeIn>

          <div className="cs-steps">
            {[
              {
                num: '01',
                title: 'Research & opportunity identification',
                body: 'Identifying a suitable high-value listing and assessing its campaign potential.',
              },
              {
                num: '02',
                title: 'Property facts and buyer psychology',
                body: 'Understanding what makes this specific property emotionally compelling beyond its specification.',
              },
              {
                num: '03',
                title: 'Visual direction and campaign concept',
                body: 'Developing a clear creative direction — tone, colour, typography, narrative positioning.',
              },
              {
                num: '04',
                title: 'AI motion testing and production',
                body: 'Producing AI-enhanced motion sequences to build atmosphere and cinematic quality.',
              },
              {
                num: '05',
                title: 'Edit, typography and sound direction',
                body: 'Assembling the teaser with considered editorial pacing, typographic treatment and audio mood.',
              },
              {
                num: '06',
                title: 'Pitch sheet and private preview delivery',
                body: 'Packaging the work into a professional, shareable format suitable for a private client conversation.',
              },
              {
                num: '07',
                title: 'Outreach to relevant contact',
                body: 'Creating and sending a professional outreach package to the relevant agent contact.',
              },
            ].map((step, i) => (
              <FadeIn key={step.num} delay={i * 60}>
                <div className="cs-step">
                  <span className="cs-step-num">{step.num}</span>
                  <div className="cs-step-body">
                    <strong>{step.title}</strong>
                    <p>{step.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={500}>
            <BodyText
              style={{
                marginTop: '2rem',
                fontStyle: 'italic',
                color: '#6a6460',
                margin: '2rem 0 0',
              }}
            >
              Each stage was completed by a single independent creator. No agency. No brief. No budget.
            </BodyText>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 10 — RESPONSIBLE AI APPROACH                          */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>09 — Responsible AI Approach</SectionLabel>
            <SectionTitle>Built with Integrity</SectionTitle>
            <BodyText>
              KREO Studio takes a considered and responsible approach to AI in creative production.
            </BodyText>
            <ul className="cs-bullets" style={{ marginBottom: '1.6rem' }}>
              {[
                'AI was used to enhance presentation and atmosphere — not to mislead or misrepresent the property',
                'All teaser content remains private and watermarked',
                'No public distribution has occurred without consent',
                'No claim of official commission or vendor approval is made',
                'Future visualisation work will be clearly labelled where AI has been used',
                "The property's architecture and identity remain truthful throughout",
              ].map(item => <li key={item}>{item}</li>)}
            </ul>
            <div className="cs-pull-quote">
              <p>
                Responsible AI use is not a legal disclaimer — it is a core part of KREO Studio's
                value. As AI visual production becomes more common, clients will need to trust that
                their creative partners are using these tools with integrity. That trust is built
                now, from the beginning.
              </p>
            </div>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 11 — COMMERCIAL POTENTIAL                             */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>10 — Commercial Potential</SectionLabel>
            <SectionTitle>Who This Serves</SectionTitle>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem 1rem',
                marginBottom: '2.5rem',
              }}
            >
              {[
                'Estate agents',
                'Property developers',
                'Architects',
                'Interior designers',
                'Luxury brands',
                'Student accommodation developers',
                'Private landlords',
                'Premium hospitality',
                'Local and national property businesses',
              ].map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#8a8278',
                    border: '1px solid #1e1c1a',
                    padding: '0.3rem 0.75rem',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <SectionTitle>Possible Services</SectionTitle>
            <ul className="cs-bullets" style={{ marginBottom: '2.5rem' }}>
              {[
                'Cinematic property teaser film',
                'Animated floor plan',
                'AI-enhanced concept visuals and campaign stills',
                'Social media campaign versions',
                'Private client preview pages',
                'Pitch decks and investor/vendor presentation assets',
              ].map(item => <li key={item}>{item}</li>)}
            </ul>

            <SectionTitle>Service Tiers</SectionTitle>
            <p style={{ fontSize: '0.72rem', color: '#5a5248', letterSpacing: '0.08em', marginBottom: 0 }}>
              Indicative, not fixed
            </p>

            <div className="cs-tier-grid">
              {[
                { label: 'Tier One', name: 'Starter Proof-of-Concept Package' },
                { label: 'Tier Two', name: 'Full Cinematic Campaign Package' },
                { label: 'Tier Three', name: 'Premium Campaign & Visualisation Package' },
              ].map(tier => (
                <div className="cs-tier-card" key={tier.label}>
                  <p className="cs-tier-label">{tier.label}</p>
                  <p className="cs-tier-name">{tier.name}</p>
                </div>
              ))}
            </div>

            <BodyText style={{ marginTop: '1.8rem', margin: '1.8rem 0 0' }}>
              The market for this type of work exists and is growing. AI-enhanced creative production
              is moving quickly from experimentation into commercial expectation, especially where
              brands need faster, more cinematic visual content.
            </BodyText>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 12 — WHAT FUNDING WOULD UNLOCK                        */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>11 — What Funding Would Unlock</SectionLabel>
            <SectionTitle>From Proof of Concept to Scalable Studio</SectionTitle>
            <BodyText>
              KREO Studio has already proven the concept. Funding would accelerate the execution.
            </BodyText>
            <BodyText>
              With the right support, KREO Studio could move from single proof-of-concept projects
              to a repeatable, scalable creative production service.
            </BodyText>
            <BodyText>Funding would support:</BodyText>
          </FadeIn>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.4rem', marginTop: '0.5rem' }}>
            {[
              {
                category: 'Faster Production',
                items: [
                  'New GPU for faster local AI video generation',
                  'Upgraded workstation processor',
                  'Cloud GPU / rendering credits',
                ],
                outcome: 'shorter render times, faster turnaround and capacity for more client work.',
              },
              {
                category: 'Professional Quality',
                items: [
                  'Professional colour-accurate monitor',
                  'Drawing tablet and input hardware',
                  'Professional printer / print testing',
                ],
                outcome: 'stronger visual precision and more polished digital and print outputs.',
              },
              {
                category: 'Business Infrastructure',
                items: [
                  'Hosting services and private preview infrastructure',
                  'External storage and backup systems',
                  'Legal templates and licence agreements',
                ],
                outcome: 'safer, more professional client delivery.',
              },
              {
                category: 'Market Validation',
                items: [
                  'Outreach campaigns and marketing materials',
                  'Future pilot projects and case studies',
                  'Improved website and service pages',
                ],
                outcome: 'stronger client pipeline and clearer commercial proof.',
              },
            ].map((cat, i) => (
              <FadeIn key={cat.category} delay={i * 80}>
                <div className="cs-funding-cat">
                  <p className="cs-funding-cat-title">{cat.category}</p>
                  <ul className="cs-bullets">
                    {cat.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                  <p style={{ marginTop: '0.6rem', fontSize: '0.88rem', fontStyle: 'italic', color: '#7a7268', lineHeight: 1.6 }}>
                    Outcome: {cat.outcome}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400}>
            <div className="cs-pull-quote" style={{ marginTop: '2rem' }}>
              <p>
                This is not a list of wish-list purchases. Each item directly improves the quality,
                speed, or professionalism of KREO Studio's output — and therefore its ability to
                win and deliver commercial work.
              </p>
            </div>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 13 — FOUNDER CAPABILITY                               */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>12 — Founder Capability</SectionLabel>
            <SectionTitle>Brandon Allen · Creative Director, KREO Studio</SectionTitle>
            <BodyText>
              Brandon is a UK-based multidisciplinary graphic designer and AI creative technologist,
              currently studying Graphic Design in Plymouth.
            </BodyText>
            <BodyText>
              Originally from Manchester, where he lived for 25 years before relocating to Plymouth.
              Holds a full UK driving licence.
            </BodyText>
            <BodyText>
              Brandon developed strong computer discipline from a young age, building a long-term
              foundation in Photoshop, design, motion, and creative technology. He is now applying
              that foundation to AI-enhanced visual production — combining traditional design craft
              with emerging tools to produce commercial-quality work independently.
            </BodyText>
            <BodyText style={{ margin: 0 }}>
              KREO Studio is his vehicle for building a future-facing design and AI visual production
              studio — one that can serve clients at a professional level from day one, and scale
              with the right support.
            </BodyText>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 14 — WHY THIS MATTERS FOR FUNDING                     */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>13 — Why This Matters for Funding Support</SectionLabel>
            <div className="cs-pull-quote">
              <p>This is more than an idea. It is evidence.</p>
            </div>

            <BodyText>KREO Studio has already:</BodyText>
            <ul className="cs-bullets" style={{ marginBottom: '2rem' }}>
              {[
                'Identified a real commercial opportunity',
                'Researched and understood the target market',
                'Produced professional-quality campaign assets independently',
                'Built a responsible, considered approach to AI production',
                'Created client-ready deliverables including preview pages, pitch sheets and outreach materials',
                'Demonstrated the ability to take a project from concept to delivery without external support',
              ].map(item => <li key={item}>{item}</li>)}
            </ul>

            <BodyText>The right funding and enterprise support would help KREO Studio:</BodyText>
            <ul className="cs-bullets" style={{ marginBottom: '2rem' }}>
              {[
                'Produce higher quality assets faster',
                'Serve clients more professionally',
                'Develop a repeatable, scalable commercial service',
                'Build a genuine business from a proven creative capability',
              ].map(item => <li key={item}>{item}</li>)}
            </ul>

            <BodyText style={{ margin: 0 }}>
              This aligns design, technology and entrepreneurship — and represents a strong student
              enterprise opportunity with a clear path to commercial viability.
            </BodyText>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION — FUNDING ROUTE FIT                                    */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>FUNDING ROUTE FIT</SectionLabel>
            <BodyText>
              KREO Studio is currently seeking guidance on the most suitable University of Plymouth
              enterprise route: Kickstart support for further validation, or Scale Up support once
              the venture is formally registered and ready to grow.
            </BodyText>
            <BodyText>
              This case study demonstrates that the project has moved beyond idea stage into practical
              proof-of-concept: the offer has been researched, tested, packaged, and presented to a
              real market contact.
            </BodyText>
            <BodyText style={{ margin: 0 }}>
              The next step is to formalise KREO Studio's business structure, refine the service
              packages, and use funding support to develop repeatable pilot campaigns.
            </BodyText>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION — FIVE-MINUTE PITCH READINESS                         */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>FIVE-MINUTE PITCH READINESS</SectionLabel>
            <BodyText>
              This case study can be converted into a five-minute funding pitch covering:
            </BodyText>
            <ul className="cs-bullets">
              {[
                'What KREO Studio does',
                'The problem it solves',
                'Why funding matters',
                'What impact funding would have',
                'How the project can become a repeatable commercial service',
              ].map(item => <li key={item}>{item}</li>)}
            </ul>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* FUNDING SUPPORT SOUGHT                                         */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>Funding Support Sought</SectionLabel>
            <BodyText>
              KREO Studio is seeking early-stage enterprise support, mentorship and funding to
              improve production capacity, formalise service packages, develop further pilot projects
              and turn this proof-of-concept into a repeatable commercial offer for property,
              architecture and premium brand clients.
            </BodyText>
            <BodyText style={{ margin: 0 }}>
              This case study has been prepared to support conversations around University of Plymouth
              enterprise support, including The Cube funding routes, expert appointments and
              Santander-backed growth support where appropriate.
            </BodyText>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 15 — NEXT STEPS                                       */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Section>
          <FadeIn>
            <SectionLabel>14 — Next Steps</SectionLabel>
            <SectionTitle>The Path Forward</SectionTitle>
          </FadeIn>
          <div className="cs-steps">
            {[
              { num: '01', title: 'Refine the case study and service offer', body: '' },
              {
                num: '02',
                title: 'Develop 2–3 additional pilot projects across property, architecture and premium brands',
                body: '',
              },
              { num: '03', title: 'Formalise service packages and pricing structure', body: '' },
              {
                num: '04',
                title: 'Apply for University of Plymouth / The Cube enterprise support',
                body: '',
              },
              {
                num: '05',
                title: 'Approach property, architecture and premium brand clients',
                body: '',
              },
              {
                num: '06',
                title: 'Build KREO Studio into a scalable AI visual production studio',
                body: '',
              },
            ].map((step, i) => (
              <FadeIn key={step.num} delay={i * 60}>
                <div className="cs-step">
                  <span className="cs-step-num">{step.num}</span>
                  <div className="cs-step-body">
                    <strong>{step.title}</strong>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={420}>
            <p
              style={{
                marginTop: '2.4rem',
                fontSize: 'clamp(0.88rem,1.7vw,1rem)',
                fontWeight: 500,
                lineHeight: 1.8,
                color: '#8a7a54',
                fontStyle: 'italic',
                letterSpacing: '0.02em',
                borderLeft: '2px solid rgba(201,169,110,0.25)',
                paddingLeft: '1.2rem',
              }}
            >
              The next milestone is to produce 2–3 additional pilot campaigns, secure the first
              paid client, and formalise KREO Studio’s AI-enhanced campaign packages.
            </p>
          </FadeIn>
        </Section>

        <div style={{ margin: '0 clamp(1.5rem,5vw,4rem)' }}><Divider /></div>

        {/* ── FOOTER ─────────────────────────────────────────────────────── */}
        <footer
          style={{
            padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)',
            maxWidth: '960px',
            margin: '0 auto',
          }}
        >
          <FadeIn>
            <p
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#c9a96e',
                opacity: 0.5,
                marginBottom: '1.8rem',
              }}
            >
              KREO Studio
            </p>

            <div
              style={{
                borderTop: '1px solid rgba(201,169,110,0.15)',
                paddingTop: '1.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}
            >
              <p
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 400,
                  lineHeight: 1.9,
                  color: '#4a4540',
                  letterSpacing: '0.04em',
                }}
              >
                This page is a private proof-of-work document produced for funding and capability
                review purposes only.
                <br />
                It is not publicly distributed and does not represent an official commission or
                approved campaign.
                <br />
                Campaign concept, edit structure, design treatment, AI-enhanced outputs and presentation materials are produced by KREO Studio. Source listing materials remain the property of their respective rights holders.
                <br />
                A private speculative concept study. Selected private review only.
              </p>

              <p
                style={{
                  marginTop: '0.8rem',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#3a3630',
                }}
              >
                © KREO Studio · kreostudio.co.uk
              </p>
            </div>
          </FadeIn>
        </footer>
      </div>
    </>
  );
}
