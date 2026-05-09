import { isAuthorized, json, listMessages, listReplies, options } from "../../live-chat-store";

export async function GET(request: Request) {
  if (!isAuthorized(request)) return json({ error: "Unauthorized" }, 401);
  return json({
    messages: await listMessages(),
    replies: await listReplies()
  });
}

export function OPTIONS() {
  return options();
}
