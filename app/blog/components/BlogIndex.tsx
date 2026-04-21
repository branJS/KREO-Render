"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import type { BlogPost } from "../../../lib/blog";
import InkCanvas from "./InkCanvas";
import { useKreoNav } from "../../components/KreoTransition";

/* ════════════════════════════════════════════════════════════════════════════
   KREO JOURNAL — Revolutionary blog index
   Features:
   · Ink particle canvas background
   · Featured hero post (newest)
   · Tag filter with animated morphing
   · 3D-tilt post cards (mousemove-driven)
   · Letter-scramble on title hover
   · Grid ↔ List view toggle
════════════════════════════════════════════════════════════════════════════ */

const KREO_CHARS = "KREO◈◉⬡◎⬢▣◫✦●■◆";

function useScramble(text: string) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef(0);

  const scramble = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    let frame = 0;
    const total = 14;
    const tick = () => {
      const p = frame / total;
      setDisplay(
        text.split("").map((ch, i) => {
          if (ch === " ") return " ";
          if (i / text.length < p) return ch;
          return KREO_CHARS[Math.floor(Math.random() * KREO_CHARS.length)];
        }).join("")
      );
      if (frame < total) { frame++; rafRef.current = requestAnimationFrame(tick); }
      else setDisplay(text);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [text]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setDisplay(text);
  }, [text]);

  return { display, scramble, reset };
}

// ── Individual Post Card ──────────────────────────────────────────────────
function PostCard({ post, listView }: { post: BlogPost; listView: boolean }) {
  const { display, scramble, reset } = useScramble(post.title);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -14;
    el.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg) translateZ(6px) translate(-3px,-3px)`;
    el.style.boxShadow = `12px 12px 0 var(--ink)`;
  };

  const onMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.boxShadow = "";
    reset();
  };

  const accent = post.accentColor ?? "var(--yellow)";

  if (listView) {
    return (
      <Link
        ref={cardRef}
        href={`/blog/${post.slug}`}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseEnter={scramble}
        style={{
          display: "grid",
          gridTemplateColumns: "4px 1fr auto",
          gap: "0 1.2rem",
          alignItems: "center",
          border: "3px solid var(--ink)",
          background: "#fff",
          boxShadow: "6px 6px 0 var(--ink)",
          textDecoration: "none",
          color: "var(--ink)",
          padding: "1.1rem 1.4rem 1.1rem 0",
          transition: "transform 0.18s cubic-bezier(0.16,1,0.3,1), box-shadow 0.18s",
          willChange: "transform",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Accent stripe */}
        <div style={{ width: 4, alignSelf: "stretch", background: accent, borderRight: "3px solid var(--ink)" }} />

        <div style={{ padding: "0 0 0 0.2rem" }}>
          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
            {post.tags.slice(0, 2).map(t => (
              <span key={t} style={{
                fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em",
                textTransform: "uppercase", background: "var(--cream)",
                border: "1.5px solid var(--ink)", padding: "0.1rem 0.4rem",
              }}>{t}</span>
            ))}
          </div>
          <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 900, lineHeight: 1.25, fontFamily: "monospace" }}>
            {display}
          </h2>
          <p style={{ margin: "0.3rem 0 0", fontSize: "0.78rem", fontWeight: 600, opacity: 0.55, lineHeight: 1.5 }}>
            {post.description}
          </p>
        </div>

        <div style={{ textAlign: "right", minWidth: 90 }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, opacity: 0.4, fontFamily: "monospace" }}>
            {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, opacity: 0.3, marginTop: "0.2rem" }}>
            {post.readTime}
          </div>
          <div style={{ marginTop: "0.5rem", fontSize: "1rem", fontWeight: 800, opacity: 0.4 }}>→</div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      ref={cardRef}
      href={`/blog/${post.slug}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={scramble}
      style={{
        display: "block",
        border: "3px solid var(--ink)",
        background: "#fff",
        boxShadow: "6px 6px 0 var(--ink)",
        textDecoration: "none",
        color: "var(--ink)",
        transition: "transform 0.18s cubic-bezier(0.16,1,0.3,1), box-shadow 0.18s",
        willChange: "transform",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {/* Thumbnail or top accent bar */}
      {post.thumbnail ? (
        <div style={{ position: "relative", height: 160, overflow: "hidden", borderBottom: "3px solid var(--ink)" }}>
          <img
            src={post.thumbnail}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: accent }} />
        </div>
      ) : (
        <div style={{ height: 5, background: accent, borderBottom: "3px solid var(--ink)" }} />
      )}

      <div style={{ padding: "1.2rem 1.2rem 1.4rem" }}>
        {/* Category + tags */}
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.7rem" }}>
          {post.tags.slice(0, 3).map(t => (
            <span key={t} style={{
              fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em",
              textTransform: "uppercase", background: "var(--cream)",
              border: "1.5px solid var(--ink)", padding: "0.1rem 0.4rem",
            }}>{t}</span>
          ))}
        </div>

        {/* Title with scramble */}
        <h2 style={{
          margin: "0 0 0.55rem",
          fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
          fontWeight: 900, lineHeight: 1.3,
        }}>
          {display}
        </h2>

        {/* Excerpt */}
        <p style={{
          margin: "0 0 1rem",
          fontSize: "0.8rem", fontWeight: 600, opacity: 0.6, lineHeight: 1.6,
        }}>
          {post.description}
        </p>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, opacity: 0.4, fontFamily: "monospace" }}>
            {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            &nbsp;·&nbsp;{post.readTime}
          </div>
          <div style={{
            fontWeight: 800, fontSize: "0.75rem",
            border: "2px solid var(--ink)", padding: "0.2rem 0.5rem",
            background: accent,
          }}>→</div>
        </div>
      </div>
    </Link>
  );
}

// ── Featured Hero Post ────────────────────────────────────────────────────
function FeaturedPost({ post }: { post: BlogPost }) {
  const { display, scramble, reset } = useScramble(post.title);

  return (
    <Link
      href={`/blog/${post.slug}`}
      onMouseEnter={scramble}
      onMouseLeave={reset}
      style={{
        display: "block",
        border: "3px solid var(--ink)",
        background: "var(--ink)",
        boxShadow: "10px 10px 0 rgba(0,0,0,0.3)",
        textDecoration: "none",
        color: "#fff",
        padding: post.thumbnail ? 0 : "2.5rem 2rem",
        marginBottom: "2.5rem",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1)",
      }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 6;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * -6;
        e.currentTarget.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translate(-3px,-3px)`;
      }}
    >
      {/* Thumbnail background for featured post */}
      {post.thumbnail && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src={post.thumbnail} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 100%)" }} />
        </div>
      )}

      {/* Background typography watermark */}
      <div style={{
        position: "absolute", bottom: -20, right: -10,
        fontSize: "clamp(6rem, 18vw, 14rem)",
        fontWeight: 900, opacity: 0.04, letterSpacing: "-0.05em",
        lineHeight: 1, pointerEvents: "none", userSelect: "none",
        color: "#fff",
        zIndex: 1,
      }}>
        KREO
      </div>

      <div style={{ position: "relative", zIndex: 2, padding: "2.5rem 2rem" }}>
        {/* Badge */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{
            background: post.accentColor ?? "var(--yellow)",
            color: "var(--ink)", fontWeight: 800, fontSize: "0.65rem",
            letterSpacing: "0.14em", textTransform: "uppercase",
            padding: "0.2rem 0.6rem", border: "2px solid rgba(255,255,255,0.2)",
          }}>
            Featured
          </span>
          {post.tags.slice(0, 2).map(t => (
            <span key={t} style={{
              fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.1em",
              textTransform: "uppercase", opacity: 0.5, border: "1.5px solid rgba(255,255,255,0.2)",
              padding: "0.15rem 0.4rem",
            }}>{t}</span>
          ))}
        </div>

        {/* Title */}
        <h2 style={{
          margin: "0 0 0.8rem",
          fontSize: "clamp(1.4rem, 4vw, 2.4rem)",
          fontWeight: 900, lineHeight: 1.15,
          maxWidth: 680,
        }}>
          {display}
        </h2>

        {/* Description */}
        <p style={{
          margin: "0 0 1.5rem",
          fontSize: "0.88rem", fontWeight: 600,
          opacity: 0.7, lineHeight: 1.65, maxWidth: 560,
        }}>
          {post.description}
        </p>

        {/* Footer */}
        <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 700, opacity: 0.45 }}>
            {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          <span style={{ fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 700, opacity: 0.45 }}>
            {post.readTime}
          </span>
          <span style={{
            marginLeft: "auto",
            background: post.accentColor ?? "var(--yellow)",
            color: "var(--ink)",
            fontWeight: 800, fontSize: "0.82rem",
            padding: "0.45rem 1rem",
            border: "2px solid rgba(255,255,255,0.15)",
          }}>
            Read Article →
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Main BlogIndex Component ─────────────────────────────────────────────
export default function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [listView, setListView] = useState(false);
  const { navigate } = useKreoNav();

  // Collect all tags
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).sort();

  // Split featured + grid
  const [featured, ...rest] = posts;

  const filtered = activeTag
    ? rest.filter(p => p.tags.includes(activeTag))
    : rest;

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh", color: "var(--ink)", position: "relative" }}>
      <InkCanvas />

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav style={{
        borderBottom: "3px solid var(--ink)",
        padding: "0.75rem 1.2rem",
        display: "flex", alignItems: "center", gap: "1rem",
        background: "rgba(242,236,227,0.92)",
        backdropFilter: "blur(8px)",
        position: "sticky", top: 0, zIndex: 20,
      }}>
        {/* KREO logo → portfolio with cinematic transition */}
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); navigate("/"); }}
          style={{
            fontWeight: 900, fontSize: "0.85rem", letterSpacing: "0.14em",
            textDecoration: "none", color: "var(--ink)",
            border: "2.5px solid var(--ink)", padding: "0.3rem 0.7rem",
            boxShadow: "3px 3px 0 var(--ink)",
            cursor: "pointer",
          }}
        >
          KREO
        </a>
        <span style={{ fontWeight: 700, fontSize: "0.8rem", opacity: 0.45, letterSpacing: "0.1em" }}>
          / JOURNAL
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: "0.4rem", alignItems: "center" }}>
          {/* Back to Portfolio link */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate("/"); }}
            style={{
              fontWeight: 700, fontSize: "0.72rem",
              border: "2px solid var(--ink)", padding: "0.28rem 0.6rem",
              background: "var(--ink)", color: "#fff",
              cursor: "pointer", textDecoration: "none",
              letterSpacing: "0.04em",
              boxShadow: "2px 2px 0 var(--yellow)",
            }}
          >
            ← Portfolio
          </a>

          {/* Grid/List toggle */}
          {[false, true].map((lv) => (
            <button
              key={String(lv)}
              onClick={() => setListView(lv)}
              title={lv ? "List view" : "Grid view"}
              style={{
                border: "2px solid var(--ink)",
                padding: "0.3rem 0.55rem",
                background: listView === lv ? "var(--ink)" : "transparent",
                color: listView === lv ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                fontWeight: 700,
                transition: "all 0.12s",
              }}
            >
              {lv ? "≡" : "⊞"}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 1.2rem 5rem", position: "relative", zIndex: 1 }}>

        {/* ── MASTHEAD ──────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap" }}>
            <h1 style={{
              margin: 0,
              fontSize: "clamp(3rem, 10vw, 6.5rem)",
              fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 0.9,
            }}>
              Journal
            </h1>
            <div style={{
              display: "flex", flexDirection: "column", gap: "0.2rem",
              paddingBottom: "0.4rem",
            }}>
              <span style={{
                fontFamily: "monospace", fontSize: "0.68rem", fontWeight: 700,
                letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.4,
              }}>
                {posts.length} articles
              </span>
              <span style={{
                background: "var(--yellow)", border: "2.5px solid var(--ink)",
                boxShadow: "3px 3px 0 var(--ink)",
                padding: "0.15rem 0.5rem",
                fontWeight: 800, fontSize: "0.65rem", letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}>
                Design · Branding · Plymouth
              </span>
            </div>
          </div>
          <p style={{
            margin: "1rem 0 0",
            fontWeight: 600, opacity: 0.55,
            maxWidth: 500, lineHeight: 1.65, fontSize: "0.88rem",
          }}>
            Design thinking, brand strategy, and plain-English guidance for businesses that want to look better and perform harder.
          </p>
        </div>

        {/* ── FEATURED POST ────────────────────────────────────────────── */}
        {featured && <FeaturedPost post={featured} />}

        {/* ── TAG FILTER ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: "1.6rem", display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.65rem", fontWeight: 800, opacity: 0.4, marginRight: "0.2rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Filter:
          </span>
          <button
            onClick={() => setActiveTag(null)}
            style={{
              border: "2px solid var(--ink)",
              padding: "0.25rem 0.7rem",
              fontWeight: 700, fontSize: "0.7rem",
              cursor: "pointer", fontFamily: "inherit",
              background: !activeTag ? "var(--ink)" : "transparent",
              color: !activeTag ? "#fff" : "var(--ink)",
              transition: "all 0.12s",
              letterSpacing: "0.05em",
            }}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              style={{
                border: "2px solid var(--ink)",
                padding: "0.25rem 0.7rem",
                fontWeight: 700, fontSize: "0.7rem",
                cursor: "pointer", fontFamily: "inherit",
                background: activeTag === tag ? "var(--yellow)" : "transparent",
                color: "var(--ink)",
                boxShadow: activeTag === tag ? "3px 3px 0 var(--ink)" : "none",
                transform: activeTag === tag ? "translate(-1px,-1px)" : "none",
                transition: "all 0.12s",
                letterSpacing: "0.05em",
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* ── POST GRID / LIST ─────────────────────────────────────────── */}
        <div
          key={`${activeTag}-${listView}`}
          style={{
            display: listView ? "grid" : "grid",
            gridTemplateColumns: listView ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
            animation: "blogGridIn 0.4s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {filtered.length === 0 ? (
            <div style={{
              gridColumn: "1 / -1",
              padding: "3rem", textAlign: "center",
              border: "3px dashed rgba(0,0,0,0.2)",
              fontWeight: 700, opacity: 0.5,
            }}>
              No posts with tag "{activeTag}".
            </div>
          ) : (
            filtered.map(p => (
              <PostCard key={p.slug} post={p} listView={listView} />
            ))
          )}
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <div style={{
          marginTop: "3.5rem",
          border: "3px solid var(--ink)",
          background: "var(--yellow)",
          boxShadow: "8px 8px 0 var(--ink)",
          padding: "1.6rem 1.8rem",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <p style={{ margin: "0 0 0.25rem", fontWeight: 900, fontSize: "1rem" }}>
              Ready to work with KREO?
            </p>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.82rem", opacity: 0.7 }}>
              Branding, motion, web &amp; print — Plymouth &amp; UK-wide.
            </p>
          </div>
          <Link href="/#contact" style={{
            background: "var(--ink)", color: "#fff",
            fontWeight: 800, border: "2.5px solid var(--ink)",
            padding: "0.75rem 1.3rem",
            textDecoration: "none", boxShadow: "4px 4px 0 rgba(0,0,0,0.3)",
            fontSize: "0.9rem",
          }}>
            Get a Quote →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes blogGridIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
