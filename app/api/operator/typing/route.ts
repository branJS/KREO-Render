import { isAuthorized, json, options, readBody, setTyping } from "../../live-chat-store";

export async function POST(request: Request) {
  if (!isAuthorized(request)) return json({ error: "Unauthorized" }, 401);
  const body = await readBody(request);
  const visitorId = String(body.visitorId || "").trim();
  if (!visitorId) return json({ error: "visitorId is required." }, 400);
  await setTyping(visitorId, Boolean(body.typing), String(body.operatorName || "Brandon").trim() || "Brandon");
  return json({ ok: true });
}

export function OPTIONS() {
  return options();
}
