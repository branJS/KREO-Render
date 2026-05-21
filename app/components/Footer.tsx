import Link from "next/link";

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
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: "1rem", marginBottom: "1.2rem",
        }}>
          <div>
            <img
              src="/logos/kreo-black-crop.png"
              alt="KREO Studio by Brandon Allen"
              className="kreo-footer-logo"
              style={{ height: "28px", width: "auto", display: "block", marginBottom: "0.45rem" }}
            />
            <p style={{
              margin: 0,
              fontWeight: 800,
              fontSize: "0.76rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>
              KREO Studio by Brandon Allen
            </p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", fontWeight: 650, color: "var(--muted)" }}>
              Independent creative studio, Plymouth UK.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <a
              href="https://x.com/kreoxi"
              target="_blank" rel="noopener noreferrer"
              className="btn tiny b-black"
              style={{ fontSize: "0.72rem", boxShadow: "3px 3px 0 var(--ink)" }}
            >
              X / Twitter
            </a>
            <a
              href="#contact"
              className="btn tiny b-yellow"
              style={{ fontSize: "0.72rem", boxShadow: "3px 3px 0 var(--ink)" }}
            >
              Book a Call
            </a>
          </div>
        </div>

        <div style={{
          display: "flex", gap: "2.5rem", flexWrap: "wrap",
          marginBottom: "1.4rem",
        }}>
          <div>
            <p style={{
              margin: "0 0 0.5rem",
              fontWeight: 800, fontSize: "0.65rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              opacity: 0.4,
            }}>
              Capabilities
            </p>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "0.25rem 0.8rem",
              maxWidth: "620px",
            }}>
              {[
                "Brand Identity", "Web Applications", "AI Workflows",
                "Cinematic Property Marketing", "3D / CGI", "Motion Assets",
                "Pitch Decks", "Visual Systems",
              ].map((s) => (
                <span key={s} style={{
                  fontSize: "0.72rem", fontWeight: 600, opacity: 0.55,
                  whiteSpace: "nowrap",
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

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
              opacity: 0.55, lineHeight: 1.7, maxWidth: "320px",
            }}>
              Based in Plymouth, Devon - working with clients across the South West, Manchester, London and the wider UK.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <p style={{
            margin: "0 0 0.45rem", fontWeight: 800, fontSize: "0.65rem",
            letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.4,
          }}>
            Plymouth Services
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem 0.8rem" }}>
            {[
              { href: "/graphic-design-plymouth", label: "Graphic Design Plymouth" },
              { href: "/web-design-plymouth", label: "Web Design Plymouth" },
              { href: "/logo-design-plymouth", label: "Logo Design Plymouth" },
              { href: "/blog", label: "Design Journal" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                fontSize: "0.72rem", fontWeight: 700, opacity: 0.55,
                whiteSpace: "nowrap", color: "var(--ink)", textDecoration: "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.55")}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "2px solid var(--ink)", margin: "0 0 1rem" }} />

        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: "0.6rem",
        }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.78rem" }}>
            © {year} KREO Studio. Led by Brandon Allen.
          </p>

          <p style={{
            margin: 0, fontWeight: 700,
            fontSize: "0.72rem", letterSpacing: "0.14em",
            opacity: 0.3, textTransform: "uppercase",
          }}>
            Plymouth, Devon · UK
          </p>

          <p style={{ margin: 0, fontWeight: 600, fontSize: "0.72rem", opacity: 0.5 }}>
            Brand · Web · AI · Cinematic Visual Systems
          </p>
        </div>
      </div>
    </footer>
  );
}
