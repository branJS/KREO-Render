import { isAuthorized, json, listBookings, options } from "../../live-chat-store";

export async function OPTIONS() {
  return options();
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return json({ error: "Unauthorized" }, 401);
  return json({ bookings: await listBookings() });
}
