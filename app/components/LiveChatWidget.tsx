"use client";

import { useEffect, useMemo, useState } from "react";

type ChatMessage = {
  role: "visitor" | "operator" | "system";
  text: string;
  id?: string;
};

type Presence = {
  online: boolean;
  operatorName?: string;
  error?: string;
};

const relayUrl = (process.env.NEXT_PUBLIC_KREO_CHAT_RELAY_URL || "").replace(/\/+$/, "");

export default function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [presence, setPresence] = useState<Presence>({ online: false });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [visitorId, setVisitorId] = useState("");
  const [operatorTyping, setOperatorTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      text: "Tell me what you are planning and I will pick it up through KREO Intelligence."
    }
  ]);

  const configured = Boolean(relayUrl);
  const conversationStarted = messages.some((message) => message.role === "visitor" || message.role === "operator");
  const statusText = useMemo(() => {
    if (!configured) return "Leave a message";
    return presence.online ? "Online now" : "Leave a message";
  }, [configured, presence.online]);

  useEffect(() => {
    const stored = window.localStorage.getItem("kreo-chat-visitor-id");
    if (stored) {
      setVisitorId(stored);
      return;
    }
    const next = `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem("kreo-chat-visitor-id", next);
    setVisitorId(next);
  }, []);

  useEffect(() => {
    if (!configured) return;

    let alive = true;
    async function checkPresence() {
      try {
        const response = await fetch(`${relayUrl}/api/widget/status`, { cache: "no-store" });
        if (!response.ok) throw new Error("Relay status unavailable");
        const data = (await response.json()) as Presence;
        if (alive) setPresence({ online: Boolean(data.online), operatorName: data.operatorName });
      } catch {
        if (alive) setPresence({ online: false, error: "Relay unavailable" });
      }
    }

    checkPresence();
    const timer = window.setInterval(checkPresence, 15000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [configured]);

  useEffect(() => {
    if (!configured || !open || !visitorId) return;

    let alive = true;
    const seenReplyIds = new Set(messages.filter((message) => message.id).map((message) => message.id));
    async function pollThread() {
      try {
        const [replyResponse, typingResponse] = await Promise.all([
          fetch(`${relayUrl}/api/widget/replies?visitorId=${encodeURIComponent(visitorId)}`, { cache: "no-store" }),
          fetch(`${relayUrl}/api/widget/typing?visitorId=${encodeURIComponent(visitorId)}`, { cache: "no-store" })
        ]);
        if (typingResponse.ok) {
          const typingData = (await typingResponse.json()) as { typing?: boolean };
          if (alive) setOperatorTyping(Boolean(typingData.typing));
        }
        if (!replyResponse.ok) return;
        const data = (await replyResponse.json()) as { replies?: Array<{ id: string; message: string; operatorName?: string }> };
        const fresh = (data.replies || []).filter((reply) => !seenReplyIds.has(reply.id)).reverse();
        if (!alive || !fresh.length) return;
        fresh.forEach((reply) => seenReplyIds.add(reply.id));
        setOperatorTyping(false);
        setMessages((items) => [
          ...items,
          ...fresh.map((reply) => ({
            role: "operator" as const,
            id: reply.id,
            text: reply.message
          }))
        ]);
      } catch {
        return;
      }
    }

    pollThread();
    const timer = window.setInterval(pollThread, 2500);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [configured, open, visitorId, messages]);

  async function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setSending(true);
    setMessages((items) => [...items, { role: "visitor", text }]);
    setDraft("");

    try {
      if (!configured) throw new Error("Chat relay is not configured yet.");
      await sendToRelay({
        visitorId,
        name: name.trim(),
        email: email.trim(),
        message: text,
        pageUrl: window.location.href,
        online: presence.online
      });
      setMessages((items) => [
        ...items,
        {
          role: "system",
          text: presence.online
            ? "Sent to Brandon in KREO Intelligence. If he is at the desk, he can reply here."
            : "Message saved for Brandon. He will see this when KREO Intelligence is next online."
        }
      ]);
    } catch {
      setMessages((items) => [
        ...items,
        {
          role: "system",
          text: "I could not reach the live chat relay. Please use the contact form below and I will still get your enquiry."
        }
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="kreo-chat" data-open={open ? "true" : "false"}>
      {open && (
        <section className="kreo-chat-panel" aria-label="KREO live chat">
          <div className="kreo-chat-head">
            <div>
              <span className={presence.online ? "kreo-chat-dot online" : "kreo-chat-dot"} />
              <strong>KREO Studio</strong>
              <p>{presence.online ? `${presence.operatorName || "Brandon"} is online` : "Studio message desk"}</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </div>

          <div className="kreo-chat-messages">
            {messages.map((message, index) => (
              <div className={`kreo-chat-message ${message.role}`} key={`${message.role}-${index}`}>
                {message.text}
              </div>
            ))}
            {operatorTyping && (
              <div className="kreo-chat-typing">
                <span />
                <span />
                <span />
                Brandon is typing
              </div>
            )}
          </div>

          <div className="kreo-chat-fields">
            {!conversationStarted && (
              <>
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" aria-label="Name" />
                <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" aria-label="Email" />
              </>
            )}
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={conversationStarted ? "Write a reply..." : "Tell me about the project..."}
              aria-label="Message"
            />
            <button type="button" onClick={sendMessage} disabled={sending || !draft.trim()}>
              {sending ? "Sending..." : conversationStarted ? "Send message" : presence.online ? "Send live message" : "Leave message"}
            </button>
          </div>
        </section>
      )}

      {!open && presence.online && (
        <div className="kreo-chat-invite" role="status">
          Our studio is online and ready to chat.
        </div>
      )}

      <button className="kreo-chat-launcher" type="button" onClick={() => setOpen((value) => !value)} aria-label="Open KREO chat">
        <span className={presence.online ? "kreo-chat-dot online" : "kreo-chat-dot"} />
        <span>{statusText}</span>
      </button>
    </div>
  );
}

async function sendToRelay(payload: Record<string, unknown>) {
  const response = await fetch(`${relayUrl}/api/widget/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (response.ok) return;
  if (response.status !== 404) throw new Error("Relay rejected message");

  const fallback = await fetch(`${relayUrl}/api/widget/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!fallback.ok) throw new Error("Relay rejected message");
}
