export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Please provide your name, email and message." },
        { status: 400 }
      );
    }

    const to = process.env.CONTACT_TO;
    const from = process.env.CONTACT_FROM || "Portfolio <noreply@example.com>";

    if (!process.env.RESEND_API_KEY || !to) {
      console.error("Missing RESEND_API_KEY or CONTACT_TO env variables.");
      return NextResponse.json(
        { ok: false, error: "Mail server not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject: `New portfolio inquiry from ${name}`,
      replyTo: email,
      text: message,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    console.log("Email sent:", data?.id);
    return NextResponse.json({ ok: true, msg: "Thank you!" });
  } catch (err: any) {
    console.error("Failed to send contact form", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send message." },
      { status: 500 }
    );
  }
}
