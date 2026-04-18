"use client";

const TWITTER_HANDLE = "kreoxi";
const TWITTER_URL = `https://x.com/${TWITTER_HANDLE}`;

const PREVIEW_TWEETS = [
  { text: "New project dropping soon 👀 — branding, motion, the works. Stay locked.", time: "2h" },
  { text: "3D render workflow update — switched up my lighting pipeline and the results are insane.", time: "1d" },
  { text: "If your brand doesn't make people stop scrolling, it's not working hard enough.", time: "3d" },
];

export default function TwitterSection() {
  return (
    <section id="twitter" className="section">
      <div className="panel">
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Latest on X</h2>
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn b-black tiny"
          >
            @{TWITTER_HANDLE} ↗
          </a>
        </div>

        <div style={{ marginTop: "0.8rem", display: "grid", gap: "0.6rem" }}>
          {PREVIEW_TWEETS.map((tweet, i) => (
            <a
              key={i}
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "3px solid var(--ink)",
                  boxShadow: "4px 4px 0 var(--ink)",
                  padding: "0.9rem 1rem",
                  display: "flex",
                  gap: "0.8rem",
                  alignItems: "flex-start",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  cursor: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "7px 7px 0 var(--ink)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(0,0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 var(--ink)";
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: "36px", height: "36px", flexShrink: 0,
                  background: "#0D0D0D", border: "2px solid var(--ink)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: "0.85rem",
                }}>
                  K
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>KREO</span>
                    <span style={{ color: "var(--muted)", fontWeight: 600, fontSize: "0.78rem" }}>{tweet.time}</span>
                  </div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem", lineHeight: 1.5 }}>
                    {tweet.text}
                  </p>
                </div>
              </div>
            </a>
          ))}

          {/* Follow CTA */}
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn b-black"
            style={{ textAlign: "center", display: "block", marginTop: "0.2rem", cursor: "none" }}
          >
            Follow @{TWITTER_HANDLE} on X →
          </a>
        </div>
      </div>
    </section>
  );
}
