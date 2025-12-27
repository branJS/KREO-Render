"use client";

import { useState } from "react";

/*
 * ContactForm component
 *
 * Renders a simple contact form with name, email, and message fields. On
 * submission, it posts the data to the API route at `/api/contact`. The
 * form provides user feedback while sending and displays a success or
 * error message upon completion. After a successful send, the form
 * resets and shows a "Thank you" message.
 */

export default function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.ok) {
        setMessage("Thank you!");
        // reset form
        (e.currentTarget as HTMLFormElement).reset();
      } else {
        setMessage(json.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to send. Please try again later.");
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
      {message && <div style={{ marginTop: "0.25rem", fontWeight: 600 }}>{message}</div>}
    </form>
  );
}