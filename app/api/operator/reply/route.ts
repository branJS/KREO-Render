import { addReply, isAuthorized, json, options, readBody } from "../../live-chat-store";

export async function POST(request: Request) {
  if (!isAuthorized(request)) return json({ error: "Unauthorized" }, 401);
  try {
    const reply = await addReply(await readBody(request));
    return json({ ok: true, replyId: reply.id });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 400);
  }
}

export function OPTIONS() {
  return options();
}
