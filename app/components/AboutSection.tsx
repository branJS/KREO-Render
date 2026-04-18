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
        >
          {/* Bio */}
          <div>
            <p style={{ fontWeight: 600, lineHeight: 1.7, margin: "0 0 0.8rem" }}>
              I&apos;m Brandon Allen — a freelance graphic designer and motion artist based in Plymouth, UK.
              I specialise in branding, 3D renders, motion graphics, and digital design that stands out.
            </p>
            <p style={{ fontWeight: 600, lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
              With years of experience across print, digital, and motion — I help businesses and creators
              build bold visual identities that leave a lasting impression.
            </p>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "1rem" }}>
              {["Branding", "Motion", "3D Renders", "Print", "UI/UX", "Photoshop"].map((skill) => (
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
