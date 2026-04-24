"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useKreoNav } from "./KreoTransition";

/* ═══════════════════════════════════════════════════════════════════════════
   KREO GLOBAL NAVIGATION
   ─────────────────────────────────────────────────────────────────────────
   A floating hamburger button (bottom-right) that opens a full-screen
   overlay menu, accessible from every page of the site.

   On portfolio  (/)      → section links scroll in-page
   On blog       (/blog*) → section links navigate to portfolio with hash
═══════════════════════════════════════════════════════════════════════════ */

const PORTFOLIO_SECTIONS = [
  { id: "home",      label: "Home",      color: "var(--yellow)" },
  { id: "projects",  label: "Projects",  color: "var(--teal)" },
  { id: "about",     label: "About",     color: "var(--green)" },
  { id: "why-kreo",  label: "Why KREO",  color: "var(--yellow)" },
  { id: "pricing",   label: "Pricing",   color: "var(--blue)" },
  { id: "contact",   label: "Contact",   color: "var(--ink)" },
];

export default function KreoNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { navigate } = useKreoNav();

  const isOnPortfolio = pathname === "/" || pathname === "";

  /* Close on ESC */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  /* Lock body scroll while menu is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Close on route change */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleSectionClick = useCallback(
    (sectionId: string) => {
      setOpen(false);
      if (isOnPortfolio) {
        /* Scroll in-page */
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      } else {
        /* Navigate to portfolio with hash */
        navigate(`/#${sectionId}`);
      }
    },
    [isOnPortfolio, navigate]
  );

  const handleBlogClick = useCallback(() => {
    setOpen(false);
    if (pathname.startsWith("/blog")) {
      /* Already on blog — no-op or scroll to top */
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/blog");
    }
  }, [pathname, navigate]);

  return (
    <>
      {/* ── Floating hamburger button ── */}
      <button
        className="kreo-nav-btn"
        onClick={() => setOpen(v => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        data-open={open}
      >
        <span className="kreo-nav-ham">
          <span />
          <span />
          <span />
        </span>
      </button>

      {/* ── Full-screen overlay ── */}
      <div
        className={`kreo-nav-overlay${open ? " is-open" : ""}`}
        aria-hidden={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="kreo-nav-inner">

          {/* Header row */}
          <div className="kreo-nav-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <img
                src="/logos/kreo-black-crop.png"
                alt="KREO"
                style={{ height: 28, width: "auto", filter: "invert(1)" }}
              />
            </div>
            <button
              className="kreo-nav-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Section grid */}
          <nav className="kreo-nav-sections">
            <p className="kreo-nav-label">Portfolio</p>
            <div className="kreo-nav-grid">
              {PORTFOLIO_SECTIONS.map((s, i) => (
                <button
                  key={s.id}
                  className="kreo-nav-item"
                  style={{
                    "--accent": s.color,
                    animationDelay: `${i * 40}ms`,
                  } as React.CSSProperties}
                  onClick={() => handleSectionClick(s.id)}
                >
                  <span className="kreo-nav-item-dot" style={{ background: s.color }} />
                  {s.label}
                </button>
              ))}
            </div>

            <p className="kreo-nav-label" style={{ marginTop: "2rem" }}>Journal</p>
            <button
              className="kreo-nav-item kreo-nav-journal"
              onClick={handleBlogClick}
            >
              <span className="kreo-nav-item-dot" style={{ background: "var(--yellow)" }} />
              KREO Journal
              <span style={{ marginLeft: "auto", fontSize: "0.65rem", opacity: 0.5 }}>
                Design · Brand · Strategy
              </span>
            </button>
          </nav>

          {/* Footer */}
          <div className="kreo-nav-footer">
            <a
              href="https://x.com/kreoxi"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "monospace", fontSize: "0.6rem", opacity: 0.3,
                letterSpacing: "0.1em", color: "#fff", textDecoration: "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.3")}
            >
              @kreoxi · kreostudio.co.uk
            </a>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Hamburger button — sits in the top-right HUD slot ── */
        .kreo-nav-btn {
          position: fixed;
          top: 0.5rem;
          right: 0.9rem;
          z-index: 9997;
          width: 44px;
          height: 44px;
          background: var(--cream);
          border: 3px solid var(--ink);
          box-shadow: 4px 4px 0 var(--ink);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s cubic-bezier(0.16,1,0.3,1), box-shadow 0.15s, background 0.15s;
        }
        .kreo-nav-btn:hover {
          transform: translate(-2px,-2px);
          box-shadow: 6px 6px 0 var(--ink);
        }
        .kreo-nav-btn[data-open="true"] {
          background: var(--yellow);
          box-shadow: 4px 4px 0 var(--ink);
        }

        /* Hamburger lines */
        .kreo-nav-ham {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 20px;
        }
        .kreo-nav-ham span {
          display: block;
          width: 100%;
          height: 2.5px;
          background: var(--ink);
          transition: all 0.22s cubic-bezier(0.16,1,0.3,1);
          transform-origin: center;
        }
        .kreo-nav-btn[data-open="true"] .kreo-nav-ham span {
          background: var(--ink);
        }
        .kreo-nav-btn[data-open="true"] .kreo-nav-ham span:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        .kreo-nav-btn[data-open="true"] .kreo-nav-ham span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .kreo-nav-btn[data-open="true"] .kreo-nav-ham span:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        /* ── Overlay ── */
        .kreo-nav-overlay {
          position: fixed;
          inset: 0;
          z-index: 9996;
          background: rgba(13,13,13,0.96);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .kreo-nav-overlay.is-open {
          opacity: 1;
          pointer-events: all;
        }

        /* Inner panel */
        .kreo-nav-inner {
          width: min(420px, 95vw);
          height: 100%;
          background: #111;
          border-left: 3px solid var(--ink);
          padding: 1.4rem 1.6rem 2rem;
          display: flex;
          flex-direction: column;
          transform: translateX(40px);
          opacity: 0;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.35s;
          overflow-y: auto;
          color: #fff;
        }
        .kreo-nav-overlay.is-open .kreo-nav-inner {
          transform: translateX(0);
          opacity: 1;
        }

        /* Header */
        .kreo-nav-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(255,255,255,0.08);
        }
        .kreo-nav-close {
          background: transparent;
          border: 2px solid rgba(255,255,255,0.2);
          color: #fff;
          width: 36px;
          height: 36px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.12s, border-color 0.12s;
        }
        .kreo-nav-close:hover {
          background: var(--yellow);
          border-color: var(--yellow);
          color: var(--ink);
        }

        /* Labels */
        .kreo-nav-label {
          margin: 0 0 0.8rem;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.35;
          font-family: monospace;
        }

        /* Grid of section buttons */
        .kreo-nav-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        /* Individual nav items */
        .kreo-nav-item {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.08);
          color: #fff;
          font-weight: 700;
          font-size: 0.82rem;
          padding: 0.75rem 0.9rem;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: 0.03em;
          transition: background 0.12s, border-color 0.12s, transform 0.12s;
          text-align: left;
        }
        .kreo-nav-item:hover {
          background: rgba(255,255,255,0.09);
          border-color: var(--accent, var(--yellow));
          transform: translate(-1px,-1px);
        }

        .kreo-nav-item-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .kreo-nav-journal {
          grid-column: 1 / -1;
          display: flex;
          width: 100%;
          border-color: rgba(245,193,0,0.3);
        }
        .kreo-nav-journal:hover {
          background: rgba(245,193,0,0.1);
          border-color: var(--yellow);
        }

        /* Footer */
        .kreo-nav-footer {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1.5px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: center;
        }

        @media (max-width: 480px) {
          .kreo-nav-inner { width: 100vw; border-left: none; }
          .kreo-nav-grid  { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
