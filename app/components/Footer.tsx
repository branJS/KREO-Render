export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "3px solid var(--ink)",
        background: "var(--cream)",
        padding: "2rem 1.2rem 1.5rem",
        position: "relative",
        zIndex: 3,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Top row */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: "1rem", marginBottom: "1.2rem",
        }}>
          <img
            src="/logos/kreo-black-crop.png"
            alt="KREO"
            style={{ height: "28px", width: "auto", display: "block" }}
          />
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <a
              href="https://x.com/kreoxi"
              target="_blank" rel="noopener noreferrer"
              className="btn tiny b-black"
              style={{ fontSize: "0.72rem", boxShadow: "3px 3px 0 var(--ink)" }}
            >
              X / Twitter ↗
            </a>
            <a
              href="#contact"
              className="btn tiny b-yellow"
              style={{ fontSize: "0.72rem", boxShadow: "3px 3px 0 var(--ink)" }}
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "2px solid var(--ink)", margin: "0 0 1rem" }} />

        {/* Bottom row */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: "0.6rem",
        }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.78rem" }}>
            © {year} KREO. All rights reserved.
          </p>

          {/* Plymouth location — low opacity */}
          <p style={{
            margin: 0, fontWeight: 700,
            fontSize: "0.72rem", letterSpacing: "0.14em",
            opacity: 0.3, textTransform: "uppercase",
          }}>
            Plymouth, Devon · UK
          </p>

          <p style={{ margin: 0, fontWeight: 600, fontSize: "0.72rem", opacity: 0.5 }}>
            Graphic Design &amp; Motion · Plymouth &amp; Manchester
          </p>
        </div>

      </div>
    </footer>
  );
}
