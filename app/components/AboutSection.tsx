export default function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="panel">
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>About Brandon</h2>
          <span className="btn b-teal tiny" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}>
            Plymouth, UK
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)",
            gap: "1.2rem",
            marginTop: "0.8rem",
          }}
          className="about-grid"
        >
          <div>
            <p style={{ fontWeight: 700, lineHeight: 1.7, margin: "0 0 0.8rem" }}>
              KREO is the personal studio of Brandon Allen, an independent creative technologist and designer based in Plymouth, UK.
            </p>
            <p style={{ fontWeight: 600, lineHeight: 1.7, color: "var(--muted)", margin: "0 0 0.8rem" }}>
              The work sits between brand direction, full-stack web development, AI-assisted production workflows, cinematic property marketing, 3D, motion and pitch-ready visual systems.
            </p>

            <div style={{
              borderLeft: "3px solid var(--yellow)",
              paddingLeft: "0.85rem",
              marginBottom: "1rem",
            }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "0.82rem", lineHeight: 1.7, color: "var(--muted)" }}>
                You are not passed through layers of account management. You work directly with <strong style={{ color: "var(--ink)" }}>Brandon Allen</strong>, the person shaping the visual direction, building the systems and preparing the work for launch. The value is in that integration: commercial taste, technical depth and a clear understanding of how modern creative work needs to move.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "1rem" }}>
              {["Brand Systems", "Web Applications", "AI Workflows", "Property Marketing", "3D / CGI", "Pitch Decks"].map((skill) => (
                <span key={skill} className="btn tiny outline" style={{ fontSize: "0.75rem", boxShadow: "3px 3px 0 var(--ink)" }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.6rem", gridTemplateColumns: "1fr 1fr" }}>
            {[
              { label: "Years Active", value: "5+", color: "var(--yellow)" },
              { label: "Core Lead", value: "1", color: "var(--teal)" },
              { label: "Disciplines", value: "6+", color: "var(--green)" },
              { label: "Based In", value: "UK", color: "var(--blue)" },
            ].map(({ label, value, color }) => (
              <div key={label} className="card" style={{ textAlign: "center", borderTop: `6px solid ${color}`, padding: "0.8rem 0.5rem" }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--muted)", marginTop: "0.3rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
