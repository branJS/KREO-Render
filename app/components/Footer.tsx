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
            className="kreo-footer-logo"
            style={{ height: "28px", width: "auto" }}
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
              href="https://x.com/messages/compose?recipient_id=kreoxi"
              target="_blank"
              rel="noopener noreferrer"
              className="btn tiny b-yellow"
              style={{ fontSize: "0.72rem", boxShadow: "3px 3px 0 var(--ink)" }}
            >
              DM on X ↗
            </a>
          </div>
        </div>

        {/* Services + Coverage */}
        <div style={{
          display: "flex", gap: "2.5rem", flexWrap: "wrap",
          marginBottom: "1.4rem",
        }}>
          {/* Services */}
          <div>
            <p style={{
              margin: "0 0 0.5rem",
              fontWeight: 800, fontSize: "0.65rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              opacity: 0.4,
            }}>
              Services
            </p>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "0.25rem 0.8rem",
              maxWidth: "520px",
            }}>
              {[
                "Website Design", "Graphic Design", "Identity & Branding",
                "Logo Design", "Label & Packaging", "Flyer & Brochure Design",
                "Business Card Design", "Social Media Design", "More on request",
              ].map((s) => (
                <span key={s} style={{
                  fontSize: "0.72rem", fontWeight: 600, opacity: 0.5,
                  whiteSpace: "nowrap",
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Coverage */}
          <div style={{ marginLeft: "auto" }}>
            <p style={{
              margin: "0 0 0.5rem",
              fontWeight: 800, fontSize: "0.65rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              opacity: 0.4,
            }}>
              Studio Coverage
            </p>
            <p style={{
              margin: 0, fontSize: "0.72rem", fontWeight: 600,
              opacity: 0.5, lineHeight: 1.7, maxWidth: "300px",
            }}>
              Based in Plymouth, Devon — working with clients across Cornwall, the South West, Manchester, London and throughout the UK &amp; Europe.
            </p>
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
