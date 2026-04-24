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

/* ---------------- Why KREO ---------------- */
function WhyKreo() {
  return (
    <section id="why-kreo" className="section">
      <div className="panel" style={{ background: "var(--yellow)", borderColor: "var(--ink)" }}>
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Why KREO</h2>
          <span className="btn tiny outline" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}>
            The Lore
          </span>
        </div>

        <p style={{
          fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
          fontWeight: 800,
          lineHeight: 1.3,
          margin: "0 0 1.5rem",
          maxWidth: "680px",
          letterSpacing: "-0.01em",
        }}>
          The freelancer who treats your brand like it&apos;s their own.
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
              heading: "Direct line. No middlemen.",
              body: "Most agencies hand your project to a junior. At KREO, every brief lands directly with me — one designer, fully invested, from first conversation to final file.",
            },
            {
              num: "02",
              heading: "One studio. Every medium.",
              body: "I work across branding, motion, 3D and web because good design rarely lives in just one medium. Whether you need a logo that moves or a website that sells, the thinking stays consistent.",
            },
            {
              num: "03",
              heading: "Plymouth-based. UK-wide. Remote-ready.",
              body: "If you're a business that cares about how it looks and what that communicates — we'll get on. Pick up the phone, drop a message, let's make something worth talking about.",
            },
          ].map(({ num, heading, body }) => (
            <div key={num} style={{
              background: "var(--cream)",
              border: "3px solid var(--ink)",
              boxShadow: "5px 5px 0 var(--ink)",
              padding: "1.4rem 1.2rem",
            }}>
              <span style={{
                display: "block",
                fontFamily: "monospace",
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.18em",
                opacity: 0.4,
                marginBottom: "0.5rem",
              }}>{num}</span>
              <h3 style={{ margin: "0 0 0.6rem", fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.01em" }}>
                {heading}
              </h3>
              <p style={{ margin: 0, fontSize: "0.87rem", lineHeight: 1.7, color: "var(--muted)" }}>
                {body}
              </p>
            </div>
          ))}
        </div>

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

      {/* PROJECTS */}
      <ProjectsSection />

      {/* ABOUT */}
      <AboutSection />

      {/* WHY KREO */}
      <WhyKreo />

      {/* REVIEWS */}
      <ReviewsSection />

      {/* JOURNAL / BLOG */}
      <BlogSection />

      {/* QUOTE BUILDER */}
      <QuoteBuilder />

      {/* PRICING */}
      <PricingSection />

      {/* CONTACT — bottom of page */}
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
          <ContactForm />
        </div>
      </section>

      <Footer />

    </main>
  );
}
