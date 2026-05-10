export default function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="panel">
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>About</h2>
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
          {/* Bio */}
          <div>
            <p style={{ fontWeight: 600, lineHeight: 1.7, margin: "0 0 0.8rem" }}>
              KREO is a creative studio based in Plymouth, UK — built around branding, 3D, motion, and digital design that cuts through the noise.
            </p>
            <p style={{ fontWeight: 600, lineHeight: 1.7, color: "var(--muted)", margin: "0 0 0.8rem" }}>
              Five years across print, digital, and motion have shaped a sharp visual language. The studio&apos;s reach extends into full-stack web development, custom AI workflows, and purpose-built applications engineered from the ground up.
            </p>

            {/* Transparency note */}
            <div style={{
              borderLeft: "3px solid var(--yellow)",
              paddingLeft: "0.85rem",
              marginBottom: "1rem",
            }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "0.82rem", lineHeight: 1.7, color: "var(--muted)" }}>
                My name is <strong style={{ color: "var(--ink)" }}>Brandon</strong> — I&apos;m 28, originally from Manchester, and the sole force behind KREO. I designed and built this website front to back. I work with LLMs, AI pipelines, and production servers daily — designing and engineering tools and workflows that didn&apos;t exist before. Alongside my Graphic Design degree at the <strong style={{ color: "var(--ink)" }}>University of Plymouth</strong>, I&apos;m building toward becoming one of Britain&apos;s leading AI technologists. You know exactly who you&apos;re working with.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "1rem" }}>
              {["Branding", "Motion", "3D", "Full-Stack", "AI Workflows", "UI/UX"].map((skill) => (
                <span key={skill} className="btn tiny outline" style={{ fontSize: "0.75rem", boxShadow: "3px 3px 0 var(--ink)" }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gap: "0.6rem", gridTemplateColumns: "1fr 1fr" }}>
            {[
              { label: "Years Active", value: "5+", color: "var(--yellow)" },
              { label: "Projects", value: "100+", color: "var(--teal)" },
              { label: "Happy Clients", value: "50+", color: "var(--green)" },
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
