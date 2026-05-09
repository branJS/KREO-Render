import { getTyping, json, options } from "../../live-chat-store";

export async function GET(request: Request) {
  const visitorId = new URL(request.url).searchParams.get("visitorId") || "";
  return json(await getTyping(visitorId));
}

export function OPTIONS() {
  return options();
}
