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
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
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
              className="hud-link"
              onClick={(e) => {
                e.preventDefault();
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
  const { isEditing } = useEditMode();

  return (
    <main className="kreo">
      <IntroScreen />
      <WorldScene sections={["home","projects","twitter","clients","shop","software","downloads","about","reviews","contact"]} />
      <HUD />
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
      <section id="contact" className="section">
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
