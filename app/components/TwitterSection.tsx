"use client";

import Script from "next/script";

// ← Update this to your actual X / Twitter handle
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
            maxHeight: "480px",
            overflow: "hidden",
            border: "3px solid var(--ink)",
            boxShadow: "6px 6px 0 var(--ink)",
            marginTop: "0.8rem",
          }}
        >
          <a
            className="twitter-timeline"
            data-height="476"
            data-theme="light"
            data-chrome="noheader nofooter noborders transparent"
            data-tweet-limit="4"
            href={`https://twitter.com/${TWITTER_HANDLE}`}
          >
            Loading tweets…
          </a>
        </div>

        <Script
          src="https://platform.twitter.com/widgets.js"
          strategy="lazyOnload"
        />
      </div>
    </section>
  );
}
