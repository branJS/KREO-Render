import { addBooking, json, options, readBody } from "../../live-chat-store";

export async function OPTIONS() {
  return options();
}

export async function POST(request: Request) {
  try {
    const booking = await addBooking(await readBody(request));
    return json({ ok: true, booking });
  } catch (error) {
    return json({ ok: false, error: error instanceof Error ? error.message : "Booking failed." }, 400);
  }
}
