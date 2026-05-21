"use client";

const SERVICES = [
  { name: "Brand Identity System", from: "£700", color: "var(--yellow)", note: "Positioning, logo direction, visual rules and launch assets" },
  { name: "Website / Web App", from: "£900", color: "var(--blue)", note: "Custom design and build for polished digital experiences" },
  { name: "Property Marketing Deck", from: "£650", color: "var(--teal)", note: "Cinematic previews, launch decks and investor-facing visuals" },
  { name: "AI Workflow / Automation", from: "£450", color: "var(--green)", note: "Practical AI-assisted systems, prompts, tooling and pipelines" },
  { name: "CGI / 3D Visuals", from: "£250", color: "var(--yellow)", note: "Product, concept, architectural and campaign visuals" },
  { name: "Motion / Launch Assets", from: "£450", color: "var(--pink)", note: "Animated campaign pieces, reels and branded motion assets" },
  { name: "Pitch Deck / Presentation", from: "£350", color: "var(--blue)", note: "Commercial story, layout and decision-ready presentation design" },
  { name: "Ongoing Studio Support", from: "on request", color: "var(--teal)", note: "Retainers, fast-turnaround work and integrated creative support" },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="section">
      <div className="panel">

        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Ways to Work</h2>
          <span className="btn b-yellow tiny" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}>
            Starting Points
          </span>
        </div>

        <p style={{
          color: "var(--muted)", fontWeight: 600, fontSize: "0.88rem",
          margin: "0.4rem 0 1.2rem", lineHeight: 1.6,
          maxWidth: 640,
        }}>
          KREO is built for serious, practical creative work: brand systems, web builds, cinematic property marketing, AI workflows and launch-ready assets. These are starting points so you can understand fit before we shape the right scope.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "0.7rem",
        }}>
          {SERVICES.map(({ name, from, color, note }) => (
            <div
              key={name}
              className="card"
              style={{
                borderTop: `5px solid ${color}`,
                padding: "0.9rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.6rem",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.92rem" }}>{name}</div>
                <div style={{ fontWeight: 600, fontSize: "0.74rem", color: "var(--muted)", marginTop: "0.15rem" }}>
                  {note}
                </div>
              </div>
              <div style={{
                fontWeight: 900, fontSize: from === "on request" ? "0.82rem" : "1.1rem",
                whiteSpace: "nowrap", flexShrink: 0, textAlign: "right",
              }}>
                {from}
                {from !== "on request" && (
                  <span style={{ fontSize: "0.64rem", fontWeight: 600, color: "var(--muted)", display: "block", textAlign: "right" }}>
                    from
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "1.2rem", display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            className="btn b-yellow"
            style={{ boxShadow: "4px 4px 0 var(--ink)" }}
            data-magnetic
            onClick={() => {
              window.dispatchEvent(new CustomEvent("kreo:cinema-open"));
            }}
          >
            Book a Project Call
          </button>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "0.8rem", color: "var(--muted)" }}>
            Scope, pace and budget are shaped directly with Brandon.
          </p>
        </div>

      </div>
    </section>
  );
}
