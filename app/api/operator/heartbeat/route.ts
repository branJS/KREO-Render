import { isAuthorized, json, options, readBody, setOperator } from "../../live-chat-store";

export async function POST(request: Request) {
  if (!isAuthorized(request)) return json({ error: "Unauthorized" }, 401);
  const body = await readBody(request);
  const operatorName = String(body.operatorName || "Brandon").trim() || "Brandon";
  await setOperator({
    online: Boolean(body.online ?? true),
    operatorName,
    lastHeartbeatAt: Date.now()
  });
  return json({ ok: true, online: true, operatorName });
}

export function OPTIONS() {
  return options();
}
