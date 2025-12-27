import { NextResponse } from "next/server";
import { Resend } from "resend";

// Create a single Resend instance using the API key from environment
const resend = new Resend(process.env.RESEND_API_KEY || "");

/**
 * POST /api/contact
 *
 * Accepts JSON payloads with { name, email, message } and sends
 * an email via Resend. You must set RESEND_API_KEY, CONTACT_TO
 * and CONTACT_FROM environment variables in .env.local (and on
 * your deployment platform) for this route to work. On success
 * returns { ok: true, msg: "Thank you!" }. On error returns
 * { ok: false, error: string } with an appropriate HTTP status.
 */
export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    // Basic validation: ensure all fields are present and non-empty
    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Please provide your name, email and message." },
        { status: 400 }
      );
    }
    // Compose email details
    const to = process.env.CONTACT_TO;
    const from = process.env.CONTACT_FROM || "Portfolio <noreply@example.com>";
    if (!process.env.RESEND_API_KEY || !to) {
      console.error(
        "Missing RESEND_API_KEY or CONTACT_TO env variables. Email cannot be sent."
      );
      return NextResponse.json(
        { ok: false, error: "Mail server not configured." },
        { status: 500 }
      );
    }
    // Send email using Resend
    await resend.emails.send({
      from,
      to: [to],
      subject: `New portfolio inquiry from ${name}`,
      reply_to: email,
      text: message,
    });
    return NextResponse.json({ ok: true, msg: "Thank you!" });
  } catch (err: any) {
    console.error("Failed to send contact form", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send message." },
      { status: 500 }
    );
  }
}