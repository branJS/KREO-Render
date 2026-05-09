import { json, listReplies, options } from "../../live-chat-store";

export async function GET(request: Request) {
  const visitorId = new URL(request.url).searchParams.get("visitorId") || "";
  const replies = (await listReplies()).filter((reply) => reply.visitorId === visitorId);
  return json({ replies });
}

export function OPTIONS() {
  return options();
}
