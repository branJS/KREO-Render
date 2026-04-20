"use client";

const SERVICES = [
  { name: "Logo Design",           from: "£250",  color: "var(--yellow)", note: "Primary mark + variations" },
  { name: "Brand Identity",        from: "£700",  color: "var(--teal)",   note: "Logo · guidelines · asset pack" },
  { name: "Website Design",        from: "£900",  color: "var(--blue)",   note: "Design + build, custom layouts" },
  { name: "Label & Packaging",     from: "£350",  color: "var(--green)",  note: "Print-ready, full artwork" },
  { name: "Motion Graphics",       from: "£450",  color: "var(--pink)",   note: "Animated assets & reels" },
  { name: "3D Renders",            from: "£250",  color: "var(--yellow)", note: "Product · arch · concept" },
  { name: "Social Media Pack",     from: "£180",  color: "var(--teal)",   note: "Sized & ready to post" },
  { name: "Flyer / Brochure",      from: "£90",   color: "var(--blue)",   note: "Print-ready PDF supplied" },
  { name: "Business Card",         from: "£90",   color: "var(--green)",  note: "Both sides, print-ready" },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="section">
      <div className="panel">

        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Pricing</h2>
          <span className="btn b-yellow tiny" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}>
            Starting From
          </span>
        </div>

        <p style={{
          color: "var(--muted)", fontWeight: 600, fontSize: "0.88rem",
          margin: "0.4rem 0 1.2rem", lineHeight: 1.6,
        }}>
          Every project is different — these are starting points. Get in touch for a quote tailored to your brief.
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
                fontWeight: 900, fontSize: "1.1rem",
                whiteSpace: "nowrap", flexShrink: 0,
              }}>
                {from}
                <span style={{ fontSize: "0.64rem", fontWeight: 600, color: "var(--muted)", display: "block", textAlign: "right" }}>
                  from
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: "1.2rem", display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            className="btn b-yellow"
            style={{ boxShadow: "4px 4px 0 var(--ink)" }}
            data-magnetic
            onClick={() => {
              window.dispatchEvent(new CustomEvent("kreo:cinema-open"));
            }}
          >
            Get a Quote
          </button>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "0.8rem", color: "var(--muted)" }}>
            Rush jobs, retainers &amp; ongoing work — rates on request.
          </p>
        </div>

      </div>
    </section>
  );
}
