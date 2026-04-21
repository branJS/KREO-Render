"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { BlogPost } from "../../../lib/blog";
import InkCanvas from "./InkCanvas";
import { useKreoNav } from "../../components/KreoTransition";

/* ════════════════════════════════════════════════════════════════════════════
   KREO ARTICLE VIEW — Immersive reading experience
   Features:
   · Ink particle canvas background
   · Reading progress bar (thick, brush-stroke style, fixed top)
   · Time remaining countdown (updates as you scroll)
   · Drop cap on first paragraph
   · Pull quote (blockquote) dramatic styling
   · Sticky article meta with progress %
   · Next article reveal at bottom
   · Copy link share button
════════════════════════════════════════════════════════════════════════════ */

const WORDS_PER_MIN = 230;

function wordCount(html: string) {
  return html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
}

export default function ArticleView({
  post,
  nextPost,
}: {
  post: BlogPost;
  nextPost: BlogPost | null;
}) {
  const [progress, setProgress]       = useState(0);
  const [minsLeft, setMinsLeft]       = useState<number | null>(null);
  const [copied, setCopied]           = useState(false);
  const [nextVisible, setNextVisible] = useState(false);
  const articleRef  = useRef<HTMLElement>(null);
  const nextRef     = useRef<HTMLDivElement>(null);
  const { navigate } = useKreoNav();

  const totalWords = wordCount(post.content);
  const totalMins  = Math.ceil(totalWords / WORDS_PER_MIN);

  // Reading progress + time remaining
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const top    = el.offsetTop;
      const height = el.scrollHeight;
      const vh     = window.innerHeight;
      const p      = Math.max(0, Math.min(1, (window.scrollY - top + vh * 0.4) / (height - vh * 0.3)));
      setProgress(p);
      setMinsLeft(Math.max(0, Math.round(totalMins * (1 - p))));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [totalMins]);

  // Next article reveal on scroll
  useEffect(() => {
    if (!nextRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => setNextVisible(e.isIntersecting),
      { threshold: 0.15 }
    );
    io.observe(nextRef.current);
    return () => io.disconnect();
  }, []);

  const share = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const progressPct = Math.round(progress * 100);
  const accent = post.accentColor ?? "var(--yellow)";

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh", color: "var(--ink)", position: "relative" }}>
      <InkCanvas />

      {/* ── READING PROGRESS BAR ──────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, left: 0,
        width: `${progressPct}%`, height: 5,
        background: accent,
        zIndex: 100,
        transition: "width 0.1s linear",
        borderRight: progressPct > 0 && progressPct < 100 ? "3px solid var(--ink)" : "none",
      }} />

      {/* ── STICKY NAV ──────────────────────────────────────────────────── */}
      <nav style={{
        borderBottom: "3px solid var(--ink)",
        padding: "0.75rem 1.2rem",
        display: "flex", alignItems: "center", gap: "0.8rem",
        background: "rgba(242,236,227,0.92)",
        backdropFilter: "blur(8px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        {/* KREO → portfolio with cinematic transition */}
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); navigate("/"); }}
          style={{
            fontWeight: 900, fontSize: "0.85rem", letterSpacing: "0.14em",
            textDecoration: "none", color: "var(--ink)",
            border: "2.5px solid var(--ink)", padding: "0.3rem 0.7rem",
            boxShadow: "3px 3px 0 var(--ink)", cursor: "pointer",
          }}
        >
          KREO
        </a>
        <Link href="/blog" style={{
          fontWeight: 700, fontSize: "0.78rem", opacity: 0.5,
          letterSpacing: "0.08em", textDecoration: "none", color: "var(--ink)",
        }}>/ Journal</Link>
        <span style={{ fontWeight: 600, fontSize: "0.72rem", opacity: 0.35 }}>
          / {post.tags[0]}
        </span>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.7rem" }}>
          {/* Time remaining */}
          {minsLeft !== null && (
            <span style={{
              fontFamily: "monospace", fontSize: "0.68rem", fontWeight: 700,
              opacity: minsLeft === 0 ? 0.7 : 0.45,
              background: minsLeft === 0 ? accent : "transparent",
              border: minsLeft === 0 ? "2px solid var(--ink)" : "none",
              padding: minsLeft === 0 ? "0.15rem 0.4rem" : "0",
              color: "var(--ink)",
              transition: "all 0.3s",
            }}>
              {minsLeft === 0 ? "✓ done" : `~${minsLeft} min left`}
            </span>
          )}

          {/* Progress % */}
          <span style={{
            fontFamily: "monospace", fontSize: "0.65rem", fontWeight: 800,
            opacity: 0.4, minWidth: 36, textAlign: "right",
          }}>
            {progressPct}%
          </span>

          {/* Share button */}
          <button
            onClick={share}
            title="Copy link"
            style={{
              border: "2px solid var(--ink)",
              padding: "0.25rem 0.6rem",
              background: copied ? "var(--ink)" : "transparent",
              color: copied ? "#fff" : "var(--ink)",
              fontWeight: 700, fontSize: "0.68rem",
              cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s",
              letterSpacing: "0.05em",
            }}
          >
            {copied ? "✓ Copied" : "⎘ Share"}
          </button>
        </div>
      </nav>

      {/* ── ARTICLE ──────────────────────────────────────────────────────── */}
      <article
        ref={articleRef}
        style={{ maxWidth: 760, margin: "0 auto", padding: "3.5rem 1.2rem 4rem", position: "relative", zIndex: 1 }}
      >
        {/* Header */}
        <header style={{ marginBottom: "2.5rem" }}>
          {/* Tags */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {post.tags.map(t => (
              <span key={t} style={{
                fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: accent,
                border: "2px solid var(--ink)", padding: "0.15rem 0.55rem",
                boxShadow: "2px 2px 0 var(--ink)",
              }}>{t}</span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{
            margin: "0 0 1.2rem",
            fontSize: "clamp(1.7rem, 5vw, 3rem)",
            fontWeight: 900, lineHeight: 1.12,
            letterSpacing: "0.01em",
          }}>
            {post.title}
          </h1>

          {/* Meta strip */}
          <div style={{
            display: "flex", gap: "0", flexWrap: "wrap",
            border: "3px solid var(--ink)",
            boxShadow: "5px 5px 0 var(--ink)",
            background: "#fff",
            overflow: "hidden",
          }}>
            {[
              { label: "Published", value: new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
              { label: "Read time", value: post.readTime },
              { label: "Words",    value: `${totalWords.toLocaleString()} words` },
              { label: "Author",   value: "KREO Studio" },
            ].map((m, i) => (
              <div key={m.label} style={{
                padding: "0.6rem 1rem",
                borderRight: i < 3 ? "2px solid var(--ink)" : "none",
                flex: "1 1 auto",
              }}>
                <div style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.45, marginBottom: "0.15rem" }}>
                  {m.label}
                </div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>{m.value}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Article body */}
        <div
          className="kreo-prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* ── CTA BLOCK ────────────────────────────────────────────────── */}
        <div style={{
          marginTop: "3.5rem",
          border: "3px solid var(--ink)",
          background: "var(--yellow)",
          boxShadow: "8px 8px 0 var(--ink)",
          padding: "1.6rem 1.8rem",
        }}>
          <p style={{ margin: "0 0 0.5rem", fontWeight: 900, fontSize: "1.05rem" }}>
            Work with KREO Studio
          </p>
          <p style={{ margin: "0 0 1.1rem", fontWeight: 600, fontSize: "0.84rem", opacity: 0.75, lineHeight: 1.6 }}>
            Logo design, brand identity, websites, motion graphics, 3D renders and print — from Plymouth to the wider UK.
          </p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <a
              href="/#contact"
              onClick={(e) => { e.preventDefault(); navigate("/#contact"); }}
              style={{
                background: "var(--ink)", color: "#fff", fontWeight: 800,
                border: "2.5px solid var(--ink)", padding: "0.7rem 1.2rem",
                textDecoration: "none", boxShadow: "4px 4px 0 rgba(0,0,0,0.25)",
                fontSize: "0.88rem", cursor: "pointer",
              }}
            >
              Start a Project →
            </a>
            <Link href="/blog" style={{
              background: "transparent", color: "var(--ink)", fontWeight: 800,
              border: "2.5px solid var(--ink)", padding: "0.7rem 1.2rem",
              textDecoration: "none", boxShadow: "4px 4px 0 var(--ink)",
              fontSize: "0.88rem",
            }}>
              ← All Articles
            </Link>
          </div>
        </div>

        {/* ── NEXT ARTICLE ─────────────────────────────────────────────── */}
        {nextPost && (
          <div
            ref={nextRef}
            style={{
              marginTop: "2.5rem",
              opacity: nextVisible ? 1 : 0,
              transform: nextVisible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div style={{
              fontFamily: "monospace", fontSize: "0.65rem", fontWeight: 800,
              letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.45,
              marginBottom: "0.6rem",
            }}>
              Next Article
            </div>
            <Link
              href={`/blog/${nextPost.slug}`}
              style={{
                display: "block",
                border: "3px solid var(--ink)",
                background: nextPost.accentColor ?? "var(--cream)",
                boxShadow: "6px 6px 0 var(--ink)",
                padding: "1.2rem 1.4rem",
                textDecoration: "none",
                color: "var(--ink)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "9px 9px 0 var(--ink)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 var(--ink)"; }}
            >
              <p style={{ margin: "0 0 0.3rem", fontWeight: 800, fontSize: "0.72rem", opacity: 0.5, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {nextPost.tags[0]} · {nextPost.readTime}
              </p>
              <h3 style={{ margin: "0", fontWeight: 900, fontSize: "1.1rem", lineHeight: 1.3 }}>
                {nextPost.title} →
              </h3>
            </Link>
          </div>
        )}
      </article>

      {/* ── PROSE STYLES ─────────────────────────────────────────────────── */}
      <style>{`
        .kreo-prose {
          font-size: 0.97rem;
          line-height: 1.82;
          font-weight: 500;
          color: var(--ink);
        }

        /* Drop cap on first paragraph */
        .kreo-prose > p:first-of-type::first-letter {
          float: left;
          font-size: 4rem;
          font-weight: 900;
          line-height: 0.8;
          margin: 0.06em 0.1em 0 0;
          padding: 0 0.06em;
          color: var(--ink);
          border: 3px solid var(--ink);
          background: ${accent};
          box-shadow: 3px 3px 0 var(--ink);
        }

        .kreo-prose p {
          margin: 0 0 1.4em;
        }

        .kreo-prose h2 {
          font-size: 1.5rem;
          font-weight: 900;
          line-height: 1.2;
          margin: 2.5em 0 0.7em;
          padding-bottom: 0.4em;
          border-bottom: 3px solid var(--ink);
        }

        .kreo-prose h3 {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 2em 0 0.5em;
          letter-spacing: 0.01em;
        }

        .kreo-prose strong {
          font-weight: 900;
          background: ${accent}55;
          padding: 0 2px;
        }

        .kreo-prose em {
          font-style: italic;
          opacity: 0.85;
        }

        /* Pull quote — dramatic */
        .kreo-prose blockquote {
          margin: 2.5em 0;
          padding: 1.4rem 1.6rem;
          border-left: 6px solid ${accent};
          border-top: 3px solid var(--ink);
          border-right: 3px solid var(--ink);
          border-bottom: 3px solid var(--ink);
          background: var(--ink);
          color: #fff;
          box-shadow: 8px 8px 0 rgba(0,0,0,0.2);
          position: relative;
          font-size: 1.08rem;
          font-weight: 700;
          line-height: 1.7;
          font-style: italic;
        }
        .kreo-prose blockquote::before {
          content: """;
          position: absolute;
          top: -0.3em;
          left: 0.5rem;
          font-size: 5rem;
          line-height: 1;
          font-weight: 900;
          color: ${accent};
          font-style: normal;
          opacity: 0.6;
        }
        .kreo-prose blockquote p {
          margin: 0;
          position: relative;
          z-index: 1;
        }

        .kreo-prose ul, .kreo-prose ol {
          padding-left: 0;
          margin: 1.2em 0 1.6em;
          list-style: none;
        }

        .kreo-prose ul li, .kreo-prose ol li {
          padding: 0.5em 0.8em 0.5em 1em;
          margin-bottom: 0.4em;
          border-left: 4px solid ${accent};
          border-bottom: 1.5px solid rgba(0,0,0,0.08);
          font-weight: 600;
          position: relative;
        }

        .kreo-prose a {
          color: var(--ink);
          font-weight: 700;
          text-decoration: underline;
          text-decoration-color: ${accent};
          text-underline-offset: 3px;
          text-decoration-thickness: 2px;
          transition: background 0.12s;
        }
        .kreo-prose a:hover {
          background: ${accent}44;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .kreo-prose > p:first-of-type::first-letter {
            font-size: 3rem;
          }
          .kreo-prose h2 { font-size: 1.25rem; }
          .kreo-prose blockquote { font-size: 0.95rem; }
        }
      `}</style>
    </div>
  );
}
