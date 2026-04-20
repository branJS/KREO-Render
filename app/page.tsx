/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useEditMode } from "./providers";
import ContactForm from "./components/ContactForm";
import ProjectsSection from "./components/ProjectsSection";
import TwitterSection from "./components/TwitterSection";
import ClientsSection from "./components/ClientsSection";
import ShopSection from "./components/ShopSection";
import SoftwareSection from "./components/SoftwareSection";
import DownloadsSection from "./components/DownloadsSection";
import AboutSection from "./components/AboutSection";
import ReviewsSection from "./components/ReviewsSection";
import IntroScreen from "./components/IntroScreen";
import Footer from "./components/Footer";
import LighthouseWidget from "./components/LighthouseWidget";
import PricingSection from "./components/PricingSection";

const WorldScene = dynamic(() => import("./WorldScene"), { ssr: false });

const SECTIONS = ["home","projects","twitter","clients","shop","software","downloads","about","reviews","pricing","contact"] as const;

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
    // Exclude hero panel (already visible)
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
    return () => io.disconnect();
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

/* ---------------- HUD ---------------- */
function HUD() {
  const [time, setTime] = useState("");
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

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
          {SECTIONS.map((s) => (
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
          ))}
        </nav>
      </div>
      <div className="hud-right">
        <span className="hud-time">{time}</span>
      </div>
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
      <WorldScene sections={["home","projects","twitter","clients","shop","software","downloads","about","reviews","contact"]} />
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
            <p className="subtitle" style={{ marginTop: "0.6rem", marginBottom: "0.8rem" }}>VISUALS, MOTION & INTERACTION — PLYMOUTH, UK</p>
            <div className="chip-row nav-chips">
              <a href="#home"      className="chip c-yellow" title="Home">Y</a>
              <a href="#projects"  className="chip c-teal"   title="Projects">T</a>
              <a href="#shop"      className="chip c-red"    title="Shop">R</a>
              <a href="#downloads" className="chip c-pink"   title="Downloads">P</a>
            </div>
            <div className="cta-row">
              <a href="#projects" className="btn b-yellow" data-magnetic>Explore Projects</a>
              <a href="#contact"  className="btn b-blue outline" data-magnetic>Get in Touch</a>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <ProjectsSection />

      {/* TWITTER / X FEED */}
      <TwitterSection />

      {/* CLIENT LOGOS MARQUEE */}
      <ClientsSection />

      {/* SHOP */}
      <ShopSection />

      {/* SOFTWARE PORTFOLIO */}
      <SoftwareSection />

      {/* DOWNLOADS */}
      <DownloadsSection />

      {/* ABOUT */}
      <AboutSection />

      {/* REVIEWS */}
      <ReviewsSection />

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
