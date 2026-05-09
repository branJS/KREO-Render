import { addMessage, json, options, readBody } from "../../live-chat-store";

export async function POST(request: Request) {
  try {
    const message = await addMessage(await readBody(request));
    return json({ ok: true, messageId: message.id, visitorId: message.visitorId });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 400);
  }
}

export function OPTIONS() {
  return options();
}
