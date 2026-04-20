export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Please fill in all fields." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to    = process.env.CONTACT_TO;
    const from  = process.env.CONTACT_FROM || "KREO Studio <onboarding@resend.dev>";

    if (!apiKey || !to) {
      return NextResponse.json(
        { ok: false, error: "Mail server not configured." },
        { status: 500 }
      );
    }

    // Use Resend REST API directly — no SDK, no version conflicts
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to:       [to],
        reply_to: email,
        subject:  `New enquiry from ${name}`,
        text:     `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html:     `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, "<br/>")}</p>`,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", json);
      return NextResponse.json(
        { ok: false, error: json?.message || "Failed to send." },
        { status: 500 }
      );
    }

    console.log("Email sent:", json.id);
    return NextResponse.json({ ok: true, msg: "Thank you!" });

  } catch (err: unknown) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
