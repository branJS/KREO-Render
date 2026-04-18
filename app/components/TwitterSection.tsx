"use client";

const TWITTER_HANDLE = "kreoxi";

export default function TwitterSection() {
  return (
    <section id="twitter" className="section">
      <div className="panel">
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Latest on X</h2>
          <a
            href={`https://x.com/${TWITTER_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn b-black tiny"
          >
            @{TWITTER_HANDLE} ↗
          </a>
        </div>

        <div
          style={{
            border: "3px solid var(--ink)",
            boxShadow: "6px 6px 0 var(--ink)",
            marginTop: "0.8rem",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <iframe
            src={`https://syndication.twitter.com/srv/timeline-profile/screen-name/${TWITTER_HANDLE}?dnt=true&theme=light`}
            style={{
              width: "100%",
              height: "520px",
              border: "none",
              display: "block",
            }}
            title="Twitter / X Feed"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
