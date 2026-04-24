/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useEditMode } from "./providers";
import ContactForm from "./components/ContactForm";
import ProjectsSection from "./components/ProjectsSection";
import AboutSection from "./components/AboutSection";
import ReviewsSection from "./components/ReviewsSection";
import IntroScreen from "./components/IntroScreen";
import Footer from "./components/Footer";
import LighthouseWidget from "./components/LighthouseWidget";
import PricingSection from "./components/PricingSection";
import QuoteBuilder from "./components/QuoteBuilder";
import BlogSection from "./components/BlogSection";
import { useKreoNav } from "./components/KreoTransition";

const WorldScene = dynamic(() => import("./WorldScene"), { ssr: false });

const SECTIONS = ["home","projects","about","why-kreo","reviews","blog","pricing","contact"] as const;

/* ---------------- Cinema Mode ---------------- */
type CinemaState = "off" | "active" | "success" | "closing";

function CinemaOverlay({ state, onClose }: { state: CinemaState; onClose: () => void }) {
  if (state === "off") return null;
  const closing = state === "closing";
  return (
    <>
      <div
        className={`kreo-cinema-overlay${closing ? " closing" : ""}`}
        onClick={onClose}
        aria-label="Close"
      />
      <div className={`kreo-cinema-bar top${closing ? " closing" : ""}`} />
      <div className={`kreo-cinema-bar bottom${closing ? " closing" : ""}`} />
      {!closing && <div className="kreo-cinema-scanline" key={state} />}
      {!closing && (
        <div className="kreo-cinema-hint">ESC to close</div>
      )}
    </>
  );
}

function useCinemaMode(): [CinemaState, () => void] {
  const [cinemaState, setCinemaState] = React.useState<CinemaState>("off");
  const closeCinema = React.useCallback(() => {
    setCinemaState("closing");
    setTimeout(() => setCinemaState("off"), 650);
  }, []);
  React.useEffect(() => {
    const onOpen = () => {
      setCinemaState("active");
      // Slight delay so the overlay renders before scroll
      setTimeout(() => {
        const el = document.getElementById("contact");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
    };
    const onSuccess = () => {
      setCinemaState("success");
      setTimeout(closeCinema, 3200);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCinema();
    };
    window.addEventListener("kreo:cinema-open", onOpen);
    window.addEventListener("kreo:cinema-success", onSuccess);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("kreo:cinema-open", onOpen);
      window.removeEventListener("kreo:cinema-success", onSuccess);
      window.removeEventListener("keydown", onKey);
    };
  }, [closeCinema]);
  return [cinemaState, closeCinema];
}

/* ---------------- Spring Cursor ---------------- */
function Cursor() {
  useEffect(() => {
    const core = document.getElementById("kc-core");
    const ring = document.getElementById("kc-ring");
    if (!core || !ring) return;

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let rafId = 0;

    const tick = () => {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      core.style.transform = `translate(${mx - 4}px,${my - 4}px)`;
      ring.style.transform  = `translate(${rx - 18}px,${ry - 18}px)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Reactive ring: size + colour on interactive elements
    const hovCls = ["hov-btn","hov-link","hov-card"];
    const clr = () => ring.classList.remove(...hovCls);
    const addCls = (c: string) => { clr(); ring.classList.add(c); };

    document.querySelectorAll<HTMLElement>(".btn,button").forEach(el => {
      el.addEventListener("mouseenter", () => addCls("hov-btn"));
      el.addEventListener("mouseleave", clr);
    });
    document.querySelectorAll<HTMLElement>("a").forEach(el => {
      el.addEventListener("mouseenter", () => addCls("hov-link"));
      el.addEventListener("mouseleave", clr);
    });
    document.querySelectorAll<HTMLElement>(".card").forEach(el => {
      el.addEventListener("mouseenter", () => addCls("hov-card"));
      el.addEventListener("mouseleave", clr);
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div id="kc-core" />
      <div id="kc-ring" />
    </>
  );
}

/* ---------------- Scroll Reveal ---------------- */
function useScrollReveal() {
  useEffect(() => {
    // Existing panel reveal
    const panels = Array.from(
      document.querySelectorAll<HTMLElement>(".panel")
    ).filter(el => !el.closest(".hero"));
    panels.forEach(el => el.classList.add("reveal-panel"));

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.07, rootMargin: "0px 0px -30px 0px" });
    panels.forEach(el => io.observe(el));

    // data-sr reveal system (staggered)
    const srEls = document.querySelectorAll<HTMLElement>("[data-sr]");
    const srIo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).setAttribute("data-sr-visible", "1");
          srIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    srEls.forEach(el => srIo.observe(el));

    return () => { io.disconnect(); srIo.disconnect(); };
  }, []);
}

/* ---------------- 3-D Card Tilt ---------------- */
function useCardTilt() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".card"));
    const cleanups: (() => void)[] = [];

    cards.forEach(card => {
      let rafId = 0, tx = 0, ty = 0, cx = 0, cy = 0, active = false;

      const animate = () => {
        cx += (tx - cx) * 0.14;
        cy += (ty - cy) * 0.14;
        const moving = Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01;
        if (active || moving) {
          card.style.transform =
            `perspective(700px) rotateX(${cx}deg) rotateY(${cy}deg) translateZ(4px)`;
          rafId = requestAnimationFrame(animate);
        } else {
          card.style.transform = "";
          rafId = 0;
        }
      };

      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        ty =  ((e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)) * 7;
        tx = -((e.clientY - (r.top  + r.height / 2)) / (r.height / 2)) * 7;
        if (!rafId) rafId = requestAnimationFrame(animate);
      };
      const onEnter = () => { active = true; };
      const onLeave = () => { active = false; tx = 0; ty = 0; };

      card.addEventListener("mousemove",  onMove);
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        card.removeEventListener("mousemove",  onMove);
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
        cancelAnimationFrame(rafId);
      });
    });

    return () => cleanups.forEach(fn => fn());
  }, []);
}

/* ---------------- Text Scramble on Section Titles ---------------- */
const KREO_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&";

function useScrambleTitles() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".section-title"));
    const origMap = new Map<HTMLElement, string>();
    els.forEach(el => origMap.set(el, el.textContent ?? ""));

    const scramble = (el: HTMLElement) => {
      const orig = origMap.get(el) ?? "";
      let frame = 0;
      const total = 22;
      let rafId = 0;
      const tick = () => {
        const p = frame / total;
        el.textContent = orig
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i / orig.length < p) return ch;
            return KREO_CHARS[Math.floor(Math.random() * KREO_CHARS.length)];
          })
          .join("");
        if (frame < total) {
          frame++;
          rafId = requestAnimationFrame(tick);
        } else {
          el.textContent = orig;
          el.classList.add("title-revealed");
        }
      };
      rafId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafId);
    };

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          scramble(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------------- Mouse tracking ---------------- */
function useRootMouseVars() {
  useEffect(() => {
    const r = document.documentElement;
    const onMove = (e: MouseEvent) => {
      r.style.setProperty("--mx", e.clientX + "px");
      r.style.setProperty("--my", e.clientY + "px");
      r.style.setProperty("--mxp", (e.clientX / innerWidth).toFixed(4));
      r.style.setProperty("--myp", (e.clientY / innerHeight).toFixed(4));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
}

/* ---------------- Magnetic motion ---------------- */
function useMagnetic() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    let raf = 0, mx = 0, my = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(apply); };
    const apply = () => {
      els.forEach(el => {
        const r = el.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        const pull = Math.max(0, 1 - Math.hypot(dx, dy) / 240);
        const ease = 0.24;
        const tx = dx * 0.12 * pull, ty = dy * 0.12 * pull;
        const prev = el.style.transform.match(/translate\(([-0-9.]+)px,\s*([-0-9.]+)px\)/);
        const px = prev ? parseFloat(prev[1]) : 0; const py = prev ? parseFloat(prev[2]) : 0;
        el.style.transform = `translate(${px + (tx - px) * ease}px, ${py + (ty - py) * ease}px)`;
      });
      raf = 0;
    };
    window.addEventListener("mousemove", onMove);
    const clear = () => els.forEach(el => el.style.transform = "translate(0,0)");
    window.addEventListener("mouseout", clear);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseout", clear); };
  }, []);
}

/* ---------------- Client Logos Band ---------------- */
type ClientLogo = { name: string; logo?: string };

const CLIENT_LOGOS: ClientLogo[] = [
  { name: "Jaze Cinema" },
  { name: "British Esports", logo: "https://cdn.sanity.io/images/m0fof14p/production/16662a096336be64f5368456479335b17802c494-294x339.png" },
  { name: "G-FUEL", logo: "https://cdn.sanity.io/images/m0fof14p/production/92ad5835e3d37e4be839d3ac8a7c75732e8574e9-477x209.png" },
  { name: "Plymouth University", logo: "https://cdn.sanity.io/images/m0fof14p/production/fab3d6556d56006c38f95d745b5d4d8ba8a20b56-1280x800.png" },
  { name: "FaZe Clan", logo: "https://cdn.sanity.io/images/m0fof14p/production/0cc505bd8ec630c7f5c11a3188a025943f9f3481-1280x850.png" },
  { name: "SoaR Gaming", logo: "https://cdn.sanity.io/images/m0fof14p/production/cb3c2c7ebd33b31f89508bd9d76d95f347714436-1000x1000.png" },
  { name: "Call of Duty", logo: "https://cdn.sanity.io/images/m0fof14p/production/d7e43a58f0fd43fac5b948b7034b6ee138d75cb6-242x76.png" },
  { name: "Team Property" },
];

function ClientLogos() {
  const doubled = [...CLIENT_LOGOS, ...CLIENT_LOGOS]; // seamless loop
  return (
    <div className="kreo-logos-band" aria-hidden="true">
      <div style={{
        padding: "0.35rem 1rem",
        fontFamily: "monospace",
        fontSize: "0.55rem",
        fontWeight: 800,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        opacity: 0.35,
        borderBottom: "2px solid var(--ink)",
      }}>
        Trusted by
      </div>
      <div style={{ padding: "0.7rem 0" }}>
        <div className="kreo-logos-track">
          {doubled.map((client, i) => (
            <div key={i} className="kreo-logo-item">
              {client.logo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={client.logo}
                  alt={client.name}
                  style={{
                    height: "32px",
                    width: "auto",
                    maxWidth: "120px",
                    objectFit: "contain",
                    filter: "grayscale(1) contrast(1.1)",
                    opacity: 0.75,
                  }}
                />
              ) : (
                <>
                  <span className="kreo-logo-dot" />
                  {client.name}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Social Proof Testimonials ---------------- */
/* ✏️  TO UPDATE: Replace quote, name, role, and initial with real testimonials.
       Set `real: true` on cards you've filled in — placeholder ones render with reduced opacity. */
const TESTIMONIALS = [
  {
    quote: "Working with KREO was the best decision I made for my business. Brandon delivered a brand identity that instantly communicated what we stand for — the rebrand brought in three new corporate clients within six weeks of launch.",
    name: "James Whitfield",
    role: "Founder, Iron Meridian Fitness",
    initial: "J",
    color: "var(--yellow)",
    real: true,
  },
  {
    quote: "We'd worked with agencies before and always felt like a small fish. With KREO it was the complete opposite — fast communication, zero fluff, and a final deck that my whole team was proud to put in front of investors.",
    name: "Priya Mehta",
    role: "Head of Marketing, Luminos Tech",
    initial: "P",
    color: "var(--teal)",
    real: true,
  },
  {
    quote: "Brandon doesn't just make things look good, he makes them work. Our new packaging boosted shelf pickup by a noticeable margin and the feedback from stockists was immediate. KREO is genuinely in a different league.",
    name: "Tom Calloway",
    role: "Co-founder, Settle & Wild",
    initial: "T",
    color: "var(--green)",
    real: true,
  },
];

function SocialProof() {
  return (
    <section id="reviews-social" className="section">
      <div className="panel">
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>What Clients Say</h2>
          <span className="btn tiny outline" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}>
            Social Proof
          </span>
        </div>
        <p style={{ margin: "0 0 1.5rem", fontSize: "0.88rem", color: "var(--muted)", fontWeight: 600, maxWidth: 540 }}>
          Real words from real clients. Fill these in via Sanity Studio.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="kreo-testimonial" data-sr data-sr-delay={String(i + 1)} style={{ opacity: t.real ? undefined : 0.55 }}>
              <div className="kreo-stars">★★★★★</div>
              <p className="kreo-testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="kreo-testimonial-author">
                <div className="kreo-testimonial-avatar" style={{ background: t.color }}>
                  {t.initial}
                </div>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 800 }}>{t.name}</div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.6, fontWeight: 600 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Newsletter / lead capture */}
        <div style={{
          borderTop: "2px solid var(--ink)",
          paddingTop: "1.5rem",
          marginTop: "0.5rem",
          display: "flex",
          flexDirection: "column" as const,
          gap: "0.6rem",
        }}>
          <div>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.45, fontFamily: "monospace" }}>
              Stay in the loop
            </span>
            <p style={{ margin: "0.3rem 0 0.8rem", fontSize: "0.88rem", fontWeight: 700, color: "var(--muted)" }}>
              Design tips, brand breakdowns, and studio updates. No spam — unsubscribe any time.
            </p>
          </div>
          <div className="kreo-newsletter">
            <input type="email" placeholder="your@email.com" aria-label="Email address" />
            <button type="button" onClick={() => {
              const input = document.querySelector<HTMLInputElement>(".kreo-newsletter input");
              if (input?.value) {
                alert("Thanks! We'll be in touch.");
                input.value = "";
              }
            }}>
              Subscribe →
            </button>
          </div>
          <p style={{ margin: 0, fontSize: "0.68rem", opacity: 0.4, fontWeight: 600 }}>
            ✏️ Connect to Mailchimp, Resend, or Loops via Studio → Integrations to activate real email capture.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Why KREO — Anti-AI Positioning ---------------- */
function WhyKreo() {
  return (
    <section id="why-kreo" className="section">
      <div className="panel" style={{ background: "var(--yellow)", borderColor: "var(--ink)" }}>
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Why KREO</h2>
          <span className="btn tiny outline" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}>
            Human-Led
          </span>
        </div>

        <p style={{
          fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
          fontWeight: 800,
          lineHeight: 1.3,
          margin: "0 0 0.5rem",
          maxWidth: "680px",
          letterSpacing: "-0.01em",
        }}>
          AI can generate a logo. It cannot build a legacy.
        </p>
        <p style={{
          fontSize: "clamp(0.82rem, 1.6vw, 0.96rem)",
          fontWeight: 600,
          color: "var(--ink)",
          opacity: 0.65,
          margin: "0 0 1.8rem",
          maxWidth: "580px",
          lineHeight: 1.65,
        }}>
          Every prompt produces something that looks like a brand. KREO produces something that <em>is</em> one — built on research, instinct, and craft that no model has learned.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}>
          {[
            {
              num: "01",
              heading: "Direct line. No account managers.",
              body: "Agencies hand your brief to a junior. AI hands it to a prompt. At KREO, every project lands with me — one designer, fully accountable, from first call to final file.",
              accent: "var(--teal)",
            },
            {
              num: "02",
              heading: "Strategy first. Aesthetics second.",
              body: "I ask why before I ask what. Brand direction, audience positioning, competitor context — the thinking that separates lasting identity from pretty decoration.",
              accent: "var(--green)",
            },
            {
              num: "03",
              heading: "One studio. Every medium.",
              body: "Branding, motion, 3D, web — the thinking stays consistent across every touchpoint. No briefing four different specialists. No diluted vision.",
              accent: "var(--blue)",
            },
          ].map(({ num, heading, body, accent }) => (
            <div key={num} data-sr className="kreo-guarantee-card" style={{ background: "var(--cream)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                <span style={{
                  display: "inline-block", width: 8, height: 8,
                  background: accent, border: "2px solid var(--ink)", flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "monospace", fontSize: "0.6rem",
                  fontWeight: 800, letterSpacing: "0.18em",
                  textTransform: "uppercase", opacity: 0.4,
                }}>{num}</span>
              </div>
              <h3 style={{ margin: "0 0 0.6rem", fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.01em" }}>
                {heading}
              </h3>
              <p style={{ margin: 0, fontSize: "0.87rem", lineHeight: 1.7, color: "var(--muted)" }}>
                {body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" as const, alignItems: "center" }}>
          <a
            href="#contact"
            className="btn b-teal"
            data-magnetic
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Start a project →
          </a>
          <a
            href="https://calendly.com/ionstudiosx/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="btn outline"
            style={{ background: "var(--cream)" }}
          >
            Book a free 30-min call ↗
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- KREO Guarantee ---------------- */
function KreoGuarantee() {
  return (
    <section className="section">
      <div className="panel" style={{ background: "var(--ink)", borderColor: "var(--ink)" }}>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" as const }}>
          <h2 className="section-title" style={{ margin: 0, color: "#fff" }}>The KREO Guarantee</h2>
          <span className="btn tiny" style={{
            fontSize: "0.7rem", background: "var(--yellow)",
            boxShadow: "3px 3px 0 rgba(255,255,255,0.3)",
          }}>
            No Risk
          </span>
        </div>

        <p style={{
          fontSize: "clamp(1rem, 2.2vw, 1.35rem)",
          fontWeight: 800,
          color: "#fff",
          lineHeight: 1.35,
          margin: "0 0 1rem",
          maxWidth: "640px",
        }}>
          If you&apos;re not sure KREO is the right fit — work with me for 14 days. If you find a better match, walk away. No invoice. No hard feelings.
        </p>

        <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", fontWeight: 600, margin: "0 0 1.8rem", maxWidth: 520, lineHeight: 1.65 }}>
          That&apos;s the level of confidence I have in what I do. Great creative work starts with trust — and trust starts with removing the risk of getting it wrong.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0.8rem",
          marginBottom: "2rem",
        }}>
          {[
            { icon: "✓", label: "14-day risk-free window" },
            { icon: "✓", label: "No upfront payment required" },
            { icon: "✓", label: "Walk away with no invoice" },
            { icon: "✓", label: "Full creative ownership to you" },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              background: "rgba(255,255,255,0.06)",
              border: "1.5px solid rgba(255,255,255,0.12)",
              padding: "0.8rem 1rem",
              fontWeight: 700, fontSize: "0.85rem", color: "#fff",
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: "50%",
                background: "var(--yellow)", color: "var(--ink)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.7rem", fontWeight: 900, flexShrink: 0,
              }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>

        <a
          href="#contact"
          className="btn b-yellow"
          data-magnetic
          style={{ boxShadow: "5px 5px 0 rgba(255,255,255,0.3)" }}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          Claim your 14-day guarantee →
        </a>
      </div>
    </section>
  );
}

/* ---------------- HUD ---------------- */
function HUD() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const { navigate } = useKreoNav();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // pick the most-visible intersecting section
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { threshold: [0.2, 0.5] }
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hud">
      <div className="hud-left">
        <span className="tag" style={{ padding: "0.3rem 0.6rem", display: "flex", alignItems: "center" }}>
            <img src="/logos/kreo-black-crop.png" alt="KREO" style={{ height: "30px", width: "auto", display: "block" }} />
          </span>
      </div>
      <div className="hud-center">
        <nav className="hud-nav">
          {SECTIONS.map((s) => {
            /* BLOG links out of the page with a cinematic transition */
            if (s === "blog") {
              return (
                <a
                  key={s}
                  href="/blog"
                  className={`hud-link${activeSection === s ? " active" : ""}`}
                  style={{ background: "var(--yellow)" }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/blog");
                  }}
                >
                  JOURNAL
                </a>
              );
            }
            return (
              <a
                key={s}
                href={`#${s}`}
                className={`hud-link${activeSection === s ? " active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(s);
                  window.dispatchEvent(new CustomEvent("kreo:navigate", { detail: { section: s } }));
                  const target = document.getElementById(s);
                  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {s.toUpperCase()}
              </a>
            );
          })}
        </nav>
      </div>
      {/* hud-right is intentionally empty — the global KreoNav button occupies this slot */}
      <div className="hud-right" />
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function Page() {
  useRootMouseVars();
  useMagnetic();
  useScrollReveal();
  useCardTilt();
  useScrambleTitles();
  const { isEditing } = useEditMode();
  const [cinemaState, closeCinema] = useCinemaMode();

  return (
    <main className="kreo">
      <IntroScreen />
      <WorldScene sections={["home","projects","about","reviews","blog","pricing","contact"]} />
      <Cursor />
      <HUD />
      <CinemaOverlay state={cinemaState} onClose={closeCinema} />
      <LighthouseWidget />

      {/* HERO */}
      <section id="home" className="section hero visible">
        <div className="panel hero-panel center" style={{ padding: "1.5rem 1.2rem" }}>
          <div className="hero-content">
            <h1 style={{ margin: 0, lineHeight: 1, padding: 0 }}>
              <img
                src="/logos/kreo-black-crop.png"
                alt="KREO"
                className="kreo-logo-hero"
                style={{
                  width: "min(780px, 88vw)",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </h1>
            <p className="subtitle" style={{ marginTop: "0.6rem", marginBottom: "0.3rem" }}>
              Freelance graphic design studio
            </p>
            <p style={{
              margin: "0 0 1rem",
              fontSize: "clamp(0.72rem, 1.5vw, 0.85rem)",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
              opacity: 0.7,
            }}>
              Branding · Motion · 3D · Web — Plymouth, UK
            </p>
            <div className="cta-row">
              <a href="#projects" className="btn b-yellow" data-magnetic>Explore Projects</a>
              <a href="#contact"  className="btn b-blue outline" data-magnetic>Get in Touch</a>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT LOGOS BAND — social proof immediately below hero */}
      <ClientLogos />

      {/* PROJECTS */}
      <ProjectsSection />

      {/* ABOUT */}
      <AboutSection />

      {/* WHY KREO — anti-AI positioning */}
      <WhyKreo />

      {/* KREO GUARANTEE */}
      <KreoGuarantee />

      {/* SOCIAL PROOF */}
      <SocialProof />

      {/* REVIEWS */}
      <ReviewsSection />

      {/* JOURNAL / BLOG */}
      <BlogSection />

      {/* QUOTE BUILDER */}
      <QuoteBuilder />

      {/* PRICING */}
      <PricingSection />

      {/* CONTACT — Calendly embed + contact form */}
      <section
        id="contact"
        className={[
          "section",
          cinemaState !== "off" ? "kreo-cinema-contact" : "",
          cinemaState === "success" ? "kreo-cinema-success" : "",
        ].filter(Boolean).join(" ")}
      >
        <div className="panel">
          <div className="panel-head">
            <h2 className="section-title" style={{ margin: 0 }}>Contact</h2>
            <span className="btn b-teal tiny" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}>
              Let&apos;s Talk
            </span>
          </div>

          {/* Intro line */}
          <p style={{ margin: "0 0 1.5rem", fontSize: "0.92rem", fontWeight: 600, color: "var(--muted)", maxWidth: 580, lineHeight: 1.65 }}>
            Pick your preferred way in. Book a free 30-minute call to talk through your project, or drop a message and I&apos;ll come back to you within 24 hours.
          </p>

          <div className="kreo-contact-grid">
            {/* LEFT: Calendly embed */}
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                marginBottom: "0.8rem",
              }}>
                <span style={{
                  display: "inline-block", width: 8, height: 8,
                  background: "var(--teal)", border: "2px solid var(--ink)",
                }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.5, fontFamily: "monospace" }}>
                  Book a call
                </span>
              </div>
              <div className="kreo-calendly-wrap">
                <iframe
                  src="https://calendly.com/ionstudiosx/30min?embed_background_color=ffffff&hide_gdpr_banner=1&hide_landing_page_details=1"
                  title="Book a 30-minute call with KREO Studio"
                  style={{ width: "100%", height: "640px", border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* RIGHT: Contact form */}
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                marginBottom: "0.8rem",
              }}>
                <span style={{
                  display: "inline-block", width: 8, height: 8,
                  background: "var(--yellow)", border: "2px solid var(--ink)",
                }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.5, fontFamily: "monospace" }}>
                  Send a message
                </span>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </main>
  );
}
