"use client";

import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   KREO QUOTE BUILDER — 4-step interactive pricing wizard
   Features: 3D tile tilt · live price ticker · easeOut count-up ·
             animated breakdown bars · directional slide transitions ·
             pulsing progress bar · "receipt" result card
═══════════════════════════════════════════════════════════════════════════ */

const SERVICES = [
  { id: "logo",   icon: "◈", label: "Logo Design",     price: 250, sub: "Mark + wordmark" },
  { id: "brand",  icon: "◉", label: "Brand Identity",  price: 700, sub: "Full visual system" },
  { id: "web",    icon: "⬡", label: "Website Design",  price: 900, sub: "Custom build" },
  { id: "motion", icon: "◎", label: "Motion Graphics", price: 450, sub: "Animated assets" },
  { id: "3d",     icon: "⬢", label: "3D Renders",      price: 250, sub: "Product / concept" },
  { id: "print",  icon: "▣", label: "Print Design",    price: 90,  sub: "Flyers, cards, etc." },
  { id: "social", icon: "◫", label: "Social Pack",     price: 200, sub: "Templates + assets" },
];

const QUESTIONS = [
  {
    key: "stage",
    label: "Business stage",
    opts: [
      { val: "new",    text: "Just starting out" },
      { val: "grow",   text: "Growing" },
      { val: "estab",  text: "Established" },
    ],
  },
  {
    key: "assets",
    label: "Existing brand assets",
    opts: [
      { val: "none",   text: "Starting fresh" },
      { val: "some",   text: "Some assets" },
      { val: "full",   text: "Full brand pack" },
    ],
  },
  {
    key: "speed",
    label: "Turnaround needed",
    opts: [
      { val: "relax",  text: "Relaxed  (4+ wks)" },
      { val: "std",    text: "Standard (2–4 wks)" },
      { val: "rush",   text: "Rush  (< 2 wks)" },
    ],
  },
];

// ── Price formula ────────────────────────────────────────────────────────────
function calcRange(ids: string[], scope: Record<string, string>) {
  const base = ids.reduce((s, id) => s + (SERVICES.find(x => x.id === id)?.price ?? 0), 0);
  if (!base) return { low: 0, high: 0 };
  let low = base, high = base * 1.48;
  if (scope.speed === "rush")  { low *= 1.3;  high *= 1.3; }
  if (scope.assets === "none") { low *= 1.08; high *= 1.08; }
  return { low: Math.round(low / 10) * 10, high: Math.round(high / 10) * 10 };
}

// ── easeOut counter ──────────────────────────────────────────────────────────
function useCounter(target: number, active: boolean, ms = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active || !target) { setV(0); return; }
    let start = 0, raf = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / ms, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, ms]);
  return v;
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function QuoteBuilder() {
  const [step, setStep]         = useState(0);
  const [dir,  setDir]          = useState<"fwd" | "bwd">("fwd");
  const [key,  setKey]          = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [scope, setScope]       = useState<Record<string, string>>({});
  const [info, setInfo]         = useState({ name: "", email: "", company: "" });
  const [tilt, setTilt]         = useState<Record<string, [number, number]>>({});
  const [sent, setSent]         = useState(false);

  const ids = [...selected];
  const { low, high } = calcRange(ids, scope);
  const cLow  = useCounter(low,  step === 3, 1300);
  const cHigh = useCounter(high, step === 3, 1600);

  function go(n: number) {
    setDir(n > step ? "fwd" : "bwd");
    setKey(k => k + 1);
    setStep(n);
  }
  function reset() {
    setSelected(new Set());
    setScope({});
    setInfo({ name: "", email: "", company: "" });
    setSent(false);
    setDir("fwd");
    setKey(k => k + 1);
    setStep(0);
  }

  function toggleService(id: string) {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>, id: string) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 16;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -16;
    setTilt(prev => ({ ...prev, [id]: [x, y] }));
  }
  function clearTilt(id: string) { setTilt(prev => ({ ...prev, [id]: [0, 0] })); }

  const canNext = [
    selected.size > 0,
    Object.keys(scope).length === 3,
    info.email.includes("@") && info.name.length > 0,
  ][step] ?? false;

  const liveTicker = low > 0 && step < 3 ? `Est. £${low.toLocaleString()}+` : null;
  const selectedServices = SERVICES.filter(s => selected.has(s.id));
  const totalBase = selectedServices.reduce((a, s) => a + s.price, 0);

  // ── Step 1: Service tiles ───────────────────────────────────────────────
  const renderStep0 = () => (
    <div>
      <p style={{ margin: "0 0 1rem", fontWeight: 600, fontSize: "0.82rem", opacity: 0.55 }}>
        Select everything you need — bundle pricing applied automatically.
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))",
        gap: "0.65rem",
      }}>
        {SERVICES.map(s => {
          const on = selected.has(s.id);
          const [tx, ty] = tilt[s.id] ?? [0, 0];
          return (
            <div
              key={s.id}
              onClick={() => toggleService(s.id)}
              onMouseMove={e => onMouseMove(e, s.id)}
              onMouseLeave={() => clearTilt(s.id)}
              style={{
                border: "3px solid var(--ink)",
                padding: "1rem 0.85rem 0.85rem",
                cursor: "pointer",
                background: on ? "var(--yellow)" : "#fff",
                boxShadow: on ? "6px 6px 0 var(--ink)" : "4px 4px 0 var(--ink)",
                transform: `perspective(600px) rotateX(${ty}deg) rotateY(${tx}deg)${on ? " translate(-2px,-2px)" : ""}`,
                transition: "background 0.12s, box-shadow 0.12s",
                userSelect: "none",
                position: "relative",
                willChange: "transform",
              }}
            >
              {on && (
                <div style={{
                  position: "absolute", top: 5, right: 5,
                  width: 18, height: 18, background: "var(--ink)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem", color: "#fff", fontWeight: 900,
                }}>✓</div>
              )}
              <div style={{ fontSize: "1.3rem", marginBottom: "0.45rem", lineHeight: 1 }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: "0.83rem", lineHeight: 1.25, marginBottom: "0.3rem" }}>{s.label}</div>
              <div style={{ fontSize: "0.68rem", fontWeight: 600, opacity: 0.45 }}>{s.sub}</div>
              <div style={{ fontSize: "0.68rem", fontWeight: 800, marginTop: "0.4rem", fontFamily: "monospace", opacity: 0.7 }}>
                from £{s.price}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── Step 2: Scope questions ─────────────────────────────────────────────
  const renderStep1 = () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {QUESTIONS.map(q => (
        <div key={q.key}>
          <p style={{ margin: "0 0 0.55rem", fontWeight: 800, fontSize: "0.85rem" }}>{q.label}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {q.opts.map(o => {
              const on = scope[q.key] === o.val;
              return (
                <button
                  key={o.val}
                  onClick={() => setScope(p => ({ ...p, [q.key]: o.val }))}
                  style={{
                    border: "2.5px solid var(--ink)",
                    padding: "0.45rem 1rem",
                    fontWeight: 700, fontSize: "0.78rem",
                    cursor: "pointer", fontFamily: "inherit",
                    color: "var(--ink)",
                    background: on ? "var(--yellow)" : "#fff",
                    boxShadow: on ? "4px 4px 0 var(--ink)" : "3px 3px 0 var(--ink)",
                    transform: on ? "translate(-2px,-2px)" : "none",
                    transition: "all 0.12s",
                  }}
                >{o.text}</button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  // ── Step 3: Contact ─────────────────────────────────────────────────────
  const renderStep2 = () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      {(["name", "email", "company"] as const).map((f, i) => (
        <div key={f}>
          <label style={{
            display: "block", fontWeight: 800, fontSize: "0.72rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            opacity: 0.6, marginBottom: "0.3rem",
          }}>
            {f === "name" ? "Your Name *" : f === "email" ? "Email Address *" : "Company / Project"}
          </label>
          <input
            type={f === "email" ? "email" : "text"}
            value={info[f]}
            autoFocus={i === 0}
            placeholder={f === "email" ? "hello@yourcompany.com" : f === "name" ? "First & last name" : "Optional"}
            onChange={e => setInfo(p => ({ ...p, [f]: e.target.value }))}
            onFocus={e => (e.target.style.boxShadow = "5px 5px 0 var(--yellow)")}
            onBlur={e => (e.target.style.boxShadow = "5px 5px 0 var(--ink)")}
            style={{
              width: "100%", boxSizing: "border-box",
              border: "3px solid var(--ink)",
              boxShadow: "5px 5px 0 var(--ink)",
              padding: "0.75rem 0.9rem",
              fontSize: "0.9rem", fontFamily: "inherit", fontWeight: 600,
              background: "#fff", outline: "none",
              transition: "box-shadow 0.15s",
            }}
          />
        </div>
      ))}
      <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 600, opacity: 0.4 }}>
        No spam. Just your estimate and a quick hello from KREO.
      </p>
    </div>
  );

  // ── Step 4: Results ─────────────────────────────────────────────────────
  const renderStep3 = () => (
    <div style={{ animation: "qbReceiptIn 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
      {/* Price card */}
      <div style={{
        border: "3px solid var(--ink)",
        boxShadow: "10px 10px 0 var(--ink)",
        background: "var(--yellow)",
        padding: "2rem 1.6rem 1.6rem",
        textAlign: "center",
        marginBottom: "1.2rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative corner marks */}
        {[[0,0],[1,0],[0,1],[1,1]].map(([r,b], i) => (
          <div key={i} style={{
            position: "absolute",
            top: r ? "auto" : 6, bottom: r ? 6 : "auto",
            left: b ? "auto" : 6, right: b ? 6 : "auto",
            width: 8, height: 8,
            border: "2px solid var(--ink)",
            borderRight: b ? "2px solid var(--ink)" : "none",
            borderBottom: r ? "2px solid var(--ink)" : "none",
            borderLeft: b ? "none" : "2px solid var(--ink)",
            borderTop: r ? "none" : "2px solid var(--ink)",
          }} />
        ))}

        <div style={{
          fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.18em",
          textTransform: "uppercase", opacity: 0.55, marginBottom: "0.6rem",
        }}>
          {info.name ? `${info.name}'s Estimate` : "Your Estimate"} · KREO Studio
        </div>

        <div style={{
          fontSize: "clamp(1.8rem, 5vw, 3rem)",
          fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.1,
        }}>
          £{cLow.toLocaleString()} – £{cHigh.toLocaleString()}
        </div>

        <div style={{
          fontSize: "0.73rem", fontWeight: 600, opacity: 0.55,
          marginTop: "0.55rem", lineHeight: 1.5,
        }}>
          Exact scope confirmed on your free discovery call.<br />No obligation, no pressure.
        </div>
      </div>

      {/* Breakdown bars */}
      <div style={{
        border: "3px solid var(--ink)", background: "#fff",
        boxShadow: "6px 6px 0 var(--ink)", padding: "1rem 1.2rem",
        marginBottom: "1.1rem",
      }}>
        <div style={{ fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.5, marginBottom: "0.8rem" }}>
          Breakdown
        </div>
        {selectedServices.map((s, i) => (
          <div key={s.id} style={{ marginBottom: i < selectedServices.length - 1 ? "0.7rem" : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 700, fontSize: "0.8rem" }}>{s.label}</span>
              <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.8rem" }}>£{s.price}</span>
            </div>
            <div style={{ height: 7, background: "rgba(0,0,0,0.07)", border: "1.5px solid var(--ink)", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                background: i % 2 === 0 ? "var(--yellow)" : "var(--ink)",
                width: totalBase ? `${(s.price / totalBase) * 100}%` : "0%",
                transition: `width 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.08 + 0.3}s`,
              }} />
            </div>
          </div>
        ))}
        {scope.speed === "rush" && (
          <div style={{ marginTop: "0.7rem", padding: "0.4rem 0.6rem", background: "rgba(220,50,50,0.08)", border: "1.5px solid rgba(220,50,50,0.3)", fontSize: "0.72rem", fontWeight: 700, color: "#c03030" }}>
            ⚡ Rush surcharge applied (+30%)
          </div>
        )}
      </div>

      {/* CTA */}
      <a
        href="/#contact"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "0.5rem",
          background: "var(--ink)", color: "#fff",
          fontWeight: 800, fontSize: "0.92rem",
          padding: "0.95rem 1.4rem",
          border: "3px solid var(--ink)",
          boxShadow: "6px 6px 0 rgba(0,0,0,0.25)",
          textDecoration: "none",
          letterSpacing: "0.04em",
          marginBottom: "0.65rem",
          transition: "transform 0.12s, box-shadow 0.12s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "8px 8px 0 rgba(0,0,0,0.25)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 rgba(0,0,0,0.25)"; }}
      >
        Book a Free Discovery Call →
      </a>
      <button
        onClick={reset}
        style={{
          display: "block", width: "100%",
          background: "none", border: "none",
          fontWeight: 700, fontSize: "0.78rem",
          color: "var(--ink)", opacity: 0.45,
          cursor: "pointer", fontFamily: "inherit",
          padding: "0.35rem", textAlign: "center",
        }}
      >
        ↩ Start over
      </button>
    </div>
  );

  const STEPS = [renderStep0, renderStep1, renderStep2, renderStep3];
  const TITLES = ["What do you need?", "About your project", "A bit about you", "Your KREO estimate"];
  const SUBS   = [
    "Multiple selections welcome",
    "Helps us scope accurately",
    "We'll send your quote here",
    `Prepared for ${info.name || "you"} · ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`,
  ];

  return (
    <section id="quote" style={{ background: "var(--cream)", borderTop: "3px solid var(--ink)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "3.5rem 1.2rem 4rem" }}>

        {/* Section header */}
        <div className="panel-head" style={{ marginBottom: "2rem" }}>
          <h2 className="section-title" style={{ margin: 0 }}>Quote Builder</h2>
          <span className="btn b-yellow tiny" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}>
            Instant Estimate
          </span>
        </div>

        {/* Main panel */}
        <div className="panel" style={{ position: "relative", overflow: "hidden" }}>

          {/* Live price ticker */}
          {liveTicker && (
            <div
              key={liveTicker}
              style={{
                position: "absolute", top: "1.2rem", right: "1.4rem",
                fontFamily: "monospace", fontWeight: 800, fontSize: "0.75rem",
                background: "var(--yellow)",
                border: "2px solid var(--ink)",
                boxShadow: "3px 3px 0 var(--ink)",
                padding: "0.2rem 0.55rem",
                zIndex: 5,
                animation: "qbTickerPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >{liveTicker}</div>
          )}

          {/* Progress bar — 4 segments */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "1.8rem" }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ flex: 1, height: 5, position: "relative", overflow: "hidden", background: "rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.15)" }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: i < step ? "var(--ink)" : i === step ? "var(--yellow)" : "transparent",
                  transition: "background 0.3s",
                }} />
                {i === step && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                    animation: "qbShimmer 1.5s ease infinite",
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Step header */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", opacity: 0.4, marginBottom: "0.2rem" }}>
              STEP 0{step + 1} / 04
            </div>
            <h3 style={{ margin: 0, fontSize: "clamp(1.1rem,3vw,1.6rem)", fontWeight: 900, lineHeight: 1.1 }}>
              {TITLES[step]}
            </h3>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.78rem", fontWeight: 600, opacity: 0.5 }}>
              {SUBS[step]}
            </p>
          </div>

          {/* Animated step content */}
          <div
            key={key}
            style={{
              animation: `${dir === "fwd" ? "qbInRight" : "qbInLeft"} 0.38s cubic-bezier(0.16,1,0.3,1) both`,
            }}
          >
            {STEPS[step]()}
          </div>

          {/* Navigation */}
          {step < 3 && (
            <div style={{ display: "flex", gap: "0.65rem", marginTop: "1.8rem" }}>
              {step > 0 && (
                <button
                  onClick={() => go(step - 1)}
                  style={{
                    border: "2.5px solid var(--ink)",
                    padding: "0.6rem 1rem",
                    fontWeight: 700, fontSize: "0.8rem",
                    cursor: "pointer", fontFamily: "inherit",
                    color: "var(--ink)", background: "transparent",
                    boxShadow: "3px 3px 0 var(--ink)",
                    transition: "all 0.12s",
                  }}
                >← Back</button>
              )}
              <button
                onClick={() => canNext && go(step + 1)}
                disabled={!canNext}
                style={{
                  border: "2.5px solid var(--ink)",
                  padding: "0.6rem 1.4rem",
                  fontWeight: 800, fontSize: "0.85rem",
                  cursor: canNext ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  color: canNext ? "var(--ink)" : "rgba(0,0,0,0.3)",
                  background: canNext ? "var(--yellow)" : "rgba(0,0,0,0.05)",
                  boxShadow: canNext ? "4px 4px 0 var(--ink)" : "none",
                  transition: "all 0.15s",
                  transform: canNext ? "none" : "none",
                }}
              >
                {step === 2 ? "Get My Estimate →" : "Next →"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* All keyframes in one place */}
      <style>{`
        @keyframes qbInRight {
          from { opacity: 0; transform: translateX(36px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes qbInLeft {
          from { opacity: 0; transform: translateX(-36px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes qbReceiptIn {
          from { opacity: 0; transform: translateY(16px) scaleY(0.97); }
          to   { opacity: 1; transform: translateY(0) scaleY(1); }
        }
        @keyframes qbTickerPop {
          from { opacity: 0; transform: translateY(-6px) scale(0.88); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes qbShimmer {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        #quote .panel { transition: none; }
      `}</style>
    </section>
  );
}
