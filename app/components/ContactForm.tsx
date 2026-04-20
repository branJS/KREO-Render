"use client";

import { useState } from "react";

export default function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setStatus("idle");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
      name:    data.get("name")    as string,
      email:   data.get("email")   as string,
      message: data.get("message") as string,
      subject: `New enquiry from ${data.get("name")}`,
    };

    try {
      const res  = await fetch("https://api.web3forms.com/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        setStatus("ok");
        form.reset();
        window.dispatchEvent(new CustomEvent("kreo:cinema-success"));
      } else {
        setErrMsg(json.message || "Something went wrong — please try again.");
        setStatus("err");
      }
    } catch {
      setErrMsg("Network error — please check your connection.");
      setStatus("err");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.5rem", maxWidth: 420 }}>
      <input
        type="text"
        name="name"
        placeholder="Your name"
        required
        className="input"
        style={{ padding: "0.5rem", border: "1px solid var(--muted)", borderRadius: "4px" }}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="input"
        style={{ padding: "0.5rem", border: "1px solid var(--muted)", borderRadius: "4px" }}
      />
      <textarea
        name="message"
        placeholder="Your message"
        required
        rows={5}
        style={{ padding: "0.5rem", border: "1px solid var(--muted)", borderRadius: "4px", resize: "vertical" }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          type="submit"
          className="btn b-teal"
          data-magnetic
          disabled={busy}
          style={{ padding: "0.5rem 1rem" }}
        >
          {busy ? "Sending…" : "Send"}
        </button>
      </div>

      {status === "ok" && (
        <div style={{ marginTop: "0.25rem", fontWeight: 600, color: "var(--teal, #0d9488)" }}>
          ✓ Message sent! I&apos;ll be in touch soon.
        </div>
      )}
      {status === "err" && (
        <div style={{ marginTop: "0.25rem", fontWeight: 600, color: "var(--red, #dc2626)" }}>
          {errMsg}
        </div>
      )}
    </form>
  );
}
// rebuild
