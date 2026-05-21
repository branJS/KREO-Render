/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEditMode } from "./providers";
import ContactForm from "./components/ContactForm";
import KreoScheduler from "./components/KreoScheduler";
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

const SECTIONS = ["home","hire-brandon","work-with-kreo","projects","about","why-kreo","reviews","blog","pricing","contact"] as const;

const SECTION_LABELS: Record<string, string> = {
  home: "Home",
  "hire-brandon": "Hire Brandon",
  "work-with-kreo": "Work With KREO",
  projects: "Portfolio",
  about: "About",
  "why-kreo": "Capabilities",
  reviews: "Proof",
  blog: "Journal",
  pricing: "Services",
  contact: "Contact",
};

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
            href="#contact"
            className="btn outline"
            style={{ background: "var(--cream)" }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Book a free 30-min call ↗
          </a>
        </div>
      </div>
    </section>
  );
}

function AudiencePathways() {
  const paths = [
    {
      title: "Hire Brandon",
      eyebrow: "For employers / collaborators",
      body: "Evaluate Brandon as a high-level creative technologist: AI workflow thinking, full-stack web applications, data interfaces, product judgement and visual systems.",
      href: "#hire-brandon",
      cta: "See hire proof",
      color: "var(--yellow)",
    },
    {
      title: "Work with KREO",
      eyebrow: "For clients / founders",
      body: "Explore portfolio work, case studies and services for brand systems, web builds, cinematic property marketing, CGI, motion and pitch-ready launch assets.",
      href: "#work-with-kreo",
      cta: "See client track",
      color: "var(--teal)",
    },
  ];

  return (
    <section className="section" style={{ paddingTop: "1.4rem", paddingBottom: "0.4rem" }}>
      <div className="panel" style={{ maxWidth: 1120 }}>
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Choose Your Path</h2>
          <span className="btn b-yellow tiny" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}>
            Two Audiences
          </span>
        </div>
        <p style={{ margin: "0.2rem 0 1.1rem", maxWidth: 700, color: "var(--muted)", fontWeight: 650, lineHeight: 1.65 }}>
          The same work tells two stories. One is Brandon as a standout hire and technical creative partner. The other is KREO as a premium studio for client projects.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}>
          {paths.map((path) => (
            <a
              key={path.title}
              href={path.href}
              className="card"
              data-magnetic
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(path.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{
                textDecoration: "none",
                color: "var(--ink)",
                display: "block",
                borderTop: `7px solid ${path.color}`,
                padding: "1rem",
                minHeight: 220,
              }}
            >
              <span style={{
                display: "inline-block",
                fontFamily: "monospace",
                fontSize: "0.62rem",
                fontWeight: 900,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.65rem",
              }}>
                {path.eyebrow}
              </span>
              <h3 style={{ margin: "0 0 0.6rem", fontSize: "clamp(1.35rem, 3vw, 2rem)", lineHeight: 1, fontWeight: 900 }}>
                {path.title}
              </h3>
              <p style={{ margin: "0 0 1.1rem", color: "var(--muted)", fontWeight: 650, lineHeight: 1.6 }}>
                {path.body}
              </p>
              <span className="btn tiny b-black" style={{ fontSize: "0.74rem", boxShadow: "3px 3px 0 var(--ink)" }}>
                {path.cta}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function HireBrandonSection() {
  const proofs = [
    {
      title: "Plymouth Signal",
      challenge: "Make a city feel readable through one calm civic intelligence surface.",
      built: "A real-time dashboard concept with transport, weather, marine, events, webcam, source health and map-led interfaces.",
      impact: "Shows product thinking, data-interface craft, live-source design and a polished technical UI language.",
      tag: "Web app / civic intelligence",
    },
    {
      title: "KREO Studio Platform",
      challenge: "Build a personal studio site that acts as portfolio, booking funnel, live chat surface and SEO engine.",
      built: "A Next.js site with project systems, Sanity content, booking/contact flows, preview routes, analytics and structured SEO.",
      impact: "Demonstrates end-to-end ownership across brand, frontend, content architecture, deployment and conversion thinking.",
      tag: "Full-stack / brand system",
    },
    {
      title: "Private Property Preview Systems",
      challenge: "Present property work with premium confidence while keeping sensitive material controlled.",
      built: "Private preview routes, cinematic case-study language, request-only portfolio cards and investor-facing visual structures.",
      impact: "Shows judgement around confidentiality, commercial presentation and high-trust client experiences.",
      tag: "Property / access control",
    },
    {
      title: "AI-Assisted Production Workflow",
      challenge: "Move faster across visual direction, copy, systems thinking and build execution without losing taste.",
      built: "Practical AI-assisted workflows around concepting, interface planning, asset direction and implementation support.",
      impact: "Shows the ability to integrate modern tools into real production rather than treating AI as a gimmick.",
      tag: "AI workflow / creative tech",
    },
  ];

  return (
    <section id="hire-brandon" className="section">
      <div className="panel" style={{ background: "var(--ink)", color: "#fff" }}>
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0, color: "#fff" }}>Hire Brandon</h2>
          <span className="btn b-yellow tiny" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 rgba(255,255,255,0.25)" }}>
            High-Level Hire Track
          </span>
        </div>
        <p style={{ margin: "0 0 1.4rem", maxWidth: 760, color: "rgba(255,255,255,0.68)", fontWeight: 650, lineHeight: 1.7 }}>
          Brandon is useful where design, technical build and AI-literate product thinking need to meet. This track is for teams looking for someone who can understand the problem, shape the interface, build the system and communicate the outcome.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginBottom: "1.4rem",
        }}>
          {proofs.map((item) => (
            <div key={item.title} style={{
              border: "1px solid rgba(245,193,0,0.35)",
              background: "rgba(255,255,255,0.055)",
              padding: "1rem",
              minHeight: "100%",
            }}>
              <span style={{
                display: "inline-block",
                fontFamily: "monospace",
                fontSize: "0.58rem",
                fontWeight: 900,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--yellow)",
                marginBottom: "0.55rem",
              }}>
                {item.tag}
              </span>
              <h3 style={{ margin: "0 0 0.75rem", fontSize: "1.1rem", fontWeight: 900 }}>{item.title}</h3>
              <p style={{ margin: "0 0 0.55rem", fontSize: "0.84rem", lineHeight: 1.6, color: "rgba(255,255,255,0.66)" }}>
                <strong style={{ color: "#fff" }}>Challenge:</strong> {item.challenge}
              </p>
              <p style={{ margin: "0 0 0.55rem", fontSize: "0.84rem", lineHeight: 1.6, color: "rgba(255,255,255,0.66)" }}>
                <strong style={{ color: "#fff" }}>Built:</strong> {item.built}
              </p>
              <p style={{ margin: 0, fontSize: "0.84rem", lineHeight: 1.6, color: "rgba(255,255,255,0.66)" }}>
                <strong style={{ color: "#fff" }}>Impact:</strong> {item.impact}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "0.65rem",
          marginBottom: "1.4rem",
        }}>
          {["AI workflow design", "Full-stack web apps", "Data-led interfaces", "Visual systems", "Product thinking", "Commercial presentation"].map((skill) => (
            <div key={skill} style={{
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.045)",
              padding: "0.65rem 0.75rem",
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "rgba(255,255,255,0.82)",
            }}>
              {skill}
            </div>
          ))}
        </div>

        <a
          href="#contact"
          className="btn b-yellow"
          data-magnetic
          style={{ boxShadow: "5px 5px 0 rgba(255,255,255,0.28)" }}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          Discuss a role or collaboration
        </a>
      </div>
    </section>
  );
}

function WorkWithKreoIntro() {
  return (
    <section id="work-with-kreo" className="section" style={{ paddingBottom: "0.2rem" }}>
      <div className="panel">
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Work With KREO</h2>
          <span className="btn b-teal tiny" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}>
            Client Track
          </span>
        </div>
        <p style={{ margin: "0 0 1rem", maxWidth: 720, color: "var(--muted)", fontWeight: 650, lineHeight: 1.7 }}>
          For clients, KREO is a direct creative partner for premium brand systems, web experiences, cinematic property marketing and pitch-ready launch assets. The portfolio below is the proof layer.
        </p>
        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
          <a
            href="#projects"
            className="btn b-yellow"
            data-magnetic
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            View portfolio
          </a>
          <a
            href="#pricing"
            className="btn outline"
            data-magnetic
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            See services
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Capability Receipts ---------------- */
function CapabilityReceipts() {
  const capabilities = [
    {
      num: "01",
      heading: "Brand identity systems",
      body: "Positioning, logo direction, visual rules and launch-ready assets built to make a business look established fast.",
      accent: "var(--yellow)",
    },
    {
      num: "02",
      heading: "Web applications and dashboards",
      body: "Full-stack product surfaces, live-data interfaces and polished web experiences designed from the user journey through to implementation.",
      accent: "var(--teal)",
    },
    {
      num: "03",
      heading: "Cinematic property marketing",
      body: "Premium visual systems for developments, investor previews, launch decks and private property presentations.",
      accent: "var(--green)",
    },
    {
      num: "04",
      heading: "AI-assisted production workflows",
      body: "Practical AI pipelines, LLM-assisted tools and automation thinking used to move faster without losing creative control.",
      accent: "var(--blue)",
    },
    {
      num: "05",
      heading: "3D, CGI and motion assets",
      body: "Still-led and motion-ready visuals for products, campaigns, concepts and spatial storytelling.",
      accent: "var(--pink)",
    },
    {
      num: "06",
      heading: "Pitch and investor systems",
      body: "Clear presentation structures that help people understand the offer, trust the work and move towards a decision.",
      accent: "var(--yellow)",
    },
  ];

  return (
    <section id="why-kreo" className="section">
      <div className="panel" style={{ background: "var(--yellow)", borderColor: "var(--ink)" }}>
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Capability Receipts</h2>
          <span className="btn tiny outline" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}>
            Brandon Allen / KREO
          </span>
        </div>

        <p style={{
          fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
          fontWeight: 800,
          lineHeight: 1.3,
          margin: "0 0 0.5rem",
          maxWidth: "760px",
          letterSpacing: "-0.01em",
        }}>
          A solo studio with agency-level range: strategy, design, build, motion, AI systems and launch assets under one roof.
        </p>
        <p style={{
          fontSize: "clamp(0.82rem, 1.6vw, 0.96rem)",
          fontWeight: 600,
          color: "var(--ink)",
          opacity: 0.65,
          margin: "0 0 1.8rem",
          maxWidth: "640px",
          lineHeight: 1.65,
        }}>
          Clients work directly with Brandon from first call to final delivery. That means fewer handoffs, faster decisions and creative systems designed to be used, extended and integrated.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}>
          {capabilities.map(({ num, heading, body, accent }) => (
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
            Book a project call
          </a>
          <a
            href="#projects"
            className="btn outline"
            style={{ background: "var(--cream)" }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            View proof of work
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

function PersonalStudioPromise() {
  return (
    <section className="section">
      <div className="panel" style={{ background: "var(--ink)", borderColor: "var(--ink)" }}>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" as const }}>
          <h2 className="section-title" style={{ margin: 0, color: "#fff" }}>Direct With Brandon</h2>
          <span className="btn tiny" style={{
            fontSize: "0.7rem", background: "var(--yellow)",
            boxShadow: "3px 3px 0 rgba(255,255,255,0.3)",
          }}>
            Personal Studio
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
          Work directly with Brandon from first call to final delivery.
        </p>

        <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", fontWeight: 600, margin: "0 0 1.8rem", maxWidth: 560, lineHeight: 1.65 }}>
          KREO is intentionally small: one accountable lead, a direct line of communication and a practical mix of visual direction, technical build and AI workflow thinking.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "0.8rem",
          marginBottom: "2rem",
        }}>
          {[
            { icon: "✓", label: "Direct access to the person doing the work" },
            { icon: "✓", label: "Commercial thinking before visuals" },
            { icon: "✓", label: "Design and implementation in one workflow" },
            { icon: "✓", label: "Built for launch, handoff and future use" },
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
          Book a project call
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
                <Link
                  key={s}
                  href="/blog"
                  className={`hud-link${activeSection === s ? " active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/blog");
                  }}
                >
                  JOURNAL
                </Link>
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
                {SECTION_LABELS[s] ?? s.toUpperCase()}
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
      <WorldScene sections={["home","hire-brandon","work-with-kreo","projects","about","why-kreo","reviews","blog","pricing","contact"]} />
      <Cursor />
      <HUD />
      <CinemaOverlay state={cinemaState} onClose={closeCinema} />
      <LighthouseWidget />

      {/* HERO */}
      <section id="home" className="section hero visible">
        <div className="panel hero-panel center">
          <div className="hero-content">
            <h1 style={{ margin: 0, lineHeight: 1, padding: 0 }}>
              <img
                src="/logos/kreo-black-crop.png"
                alt="KREO"
                className="kreo-logo-hero"
                style={{
                  width: "min(560px, 82vw)",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </h1>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "0.85rem",
              padding: "0.35rem 0.7rem",
              border: "2px solid var(--ink)",
              boxShadow: "3px 3px 0 var(--ink)",
              background: "var(--yellow)",
              fontFamily: "monospace",
              fontSize: "0.68rem",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Brandon Allen / KREO Studio
            </div>
            <p className="subtitle" style={{
              margin: "0.7rem auto 0.45rem",
              maxWidth: 760,
              fontSize: "clamp(1.05rem, 2.7vw, 1.65rem)",
              lineHeight: 1.25,
              fontWeight: 800,
              letterSpacing: "0.01em",
            }}>
              Independent creative technologist, designer and full-stack builder for brands that need to look serious and move intelligently.
            </p>
            <p className="hero-services" style={{
              margin: "0 0 1rem",
              fontSize: "clamp(0.72rem, 1.5vw, 0.85rem)",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
              opacity: 0.7,
            }}>
              <span className="hero-services-copy">Premium brand, web, AI and cinematic visual systems - Plymouth, UK</span>
            </p>
            <div className="cta-row">
              <a href="#hire-brandon" className="btn b-yellow" data-magnetic>Hire Brandon</a>
              <a href="#work-with-kreo"  className="btn b-blue outline" data-magnetic>Work with KREO</a>
            </div>
          </div>
        </div>
      </section>

      {/* SHORT BIO — intro under hero */}
      <div style={{ padding: "1.4rem 1.2rem 0.2rem", maxWidth: "980px", margin: "0 auto" }}>
        <p style={{
          fontWeight: 600,
          lineHeight: 1.75,
          fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)",
          color: "var(--muted)",
          margin: "0 0 1rem",
        }}>
          I&apos;m Brandon Allen, the person behind KREO. I combine visual direction, full-stack implementation and AI workflow thinking to create brand, web and cinematic systems that are polished, practical and ready to use.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "0.7rem",
        }}>
          {[
            ["Solo studio", "Direct with Brandon from first call to delivery."],
            ["Integrated skillset", "Brand, web, AI, 3D, motion and pitch systems."],
            ["Ready to work", "Commercially focused, fast-moving and implementation minded."],
          ].map(([label, body]) => (
            <div key={label} style={{
              border: "3px solid var(--ink)",
              boxShadow: "4px 4px 0 var(--ink)",
              background: "var(--cream)",
              padding: "0.8rem 0.9rem",
            }}>
              <div style={{
                fontFamily: "monospace",
                fontSize: "0.62rem",
                fontWeight: 900,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "0.35rem",
              }}>
                {label}
              </div>
              <p style={{ margin: 0, fontSize: "0.82rem", lineHeight: 1.55, fontWeight: 650, color: "var(--muted)" }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CLIENT LOGOS BAND — social proof immediately below hero */}
      <AudiencePathways />

      <ClientLogos />

      <HireBrandonSection />

      <WorkWithKreoIntro />

      {/* PROJECTS */}
      <ProjectsSection />

      {/* ABOUT */}
      <AboutSection />

      {/* CAPABILITY RECEIPTS */}
      <CapabilityReceipts />

      {/* DIRECT WITH BRANDON */}
      <PersonalStudioPromise />

      {/* SOCIAL PROOF — hidden until real testimonials are added; uncomment when ready */}
      {/* <SocialProof /> */}

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
            You are speaking directly with Brandon. Book a focused project call, or send the brief and I&apos;ll come back with the clearest next step.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "0.8rem",
            marginBottom: "1.5rem",
          }}>
            {[
              ["Hiring / collaboration", "For roles, partnerships, technical creative projects or AI/product opportunities.", "Discuss a role"],
              ["Client project", "For brand, web, property marketing, pitch decks, CGI, motion or ongoing studio support.", "Book a project call"],
            ].map(([label, body, cta]) => (
              <a
                key={label}
                href="#contact"
                className="card"
                style={{ textDecoration: "none", color: "inherit", display: "block", padding: "0.9rem 1rem" }}
              >
                <div style={{ fontWeight: 900, fontSize: "0.94rem", marginBottom: "0.35rem" }}>{label}</div>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", lineHeight: 1.55, color: "var(--muted)", fontWeight: 650 }}>
                  {body}
                </p>
                <span className="btn tiny b-yellow" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}>
                  {cta}
                </span>
              </a>
            ))}
          </div>

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
              <KreoScheduler />
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
