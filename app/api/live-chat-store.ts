import { randomUUID } from "node:crypto";

export type LiveChatMessage = {
  id: string;
  visitorId: string;
  name: string;
  email: string;
  message: string;
  pageUrl: string;
  createdAt: string;
};

export type LiveChatReply = {
  id: string;
  visitorId: string;
  operatorName: string;
  message: string;
  createdAt: string;
};

export type KreoBooking = {
  id: string;
  name: string;
  email: string;
  businessName: string;
  phone: string;
  meetingType: string;
  projectType: string;
  selectedDate: string;
  selectedTime: string;
  timezone: string;
  durationMinutes: number;
  notes: string;
  status: "new" | "confirmed" | "cancelled";
  createdAt: string;
};

type OperatorState = {
  online: boolean;
  operatorName: string;
  lastHeartbeatAt: number;
};

type TypingState = {
  at: number;
  operatorName: string;
};

const heartbeatWindowMs = Number(process.env.KREO_CHAT_HEARTBEAT_WINDOW_MS || 30000);
const operatorKey = "kreo:chat:operator";
const messagesKey = "kreo:chat:messages";
const repliesKey = "kreo:chat:replies";
const typingKey = "kreo:chat:typing";
const bookingsKey = "kreo:calendar:bookings";

const memory = globalThis as typeof globalThis & {
  __kreoChatStore?: {
    operator: OperatorState;
    messages: LiveChatMessage[];
    replies: LiveChatReply[];
    typingByVisitor: Record<string, TypingState>;
    bookings: KreoBooking[];
  };
};

function memoryStore() {
  memory.__kreoChatStore ||= {
    operator: { online: false, operatorName: "Brandon", lastHeartbeatAt: 0 },
    messages: [],
    replies: [],
    typingByVisitor: {},
    bookings: []
  };
  memory.__kreoChatStore.bookings ||= [];
  return memory.__kreoChatStore;
}

export function operatorApiKey() {
  return process.env.KREO_CHAT_API_KEY || "local-kreo-chat-dev-key";
}

export function isAuthorized(request: Request) {
  return request.headers.get("authorization") === `Bearer ${operatorApiKey()}`;
}

export async function getOperator() {
  return (await getJson<OperatorState>(operatorKey)) || memoryStore().operator;
}

export async function setOperator(operator: OperatorState) {
  memoryStore().operator = operator;
  await setJson(operatorKey, operator);
}

export async function isOperatorOnline() {
  const operator = await getOperator();
  return operator.online && Date.now() - operator.lastHeartbeatAt < heartbeatWindowMs;
}

export async function listMessages() {
  return (await getJson<LiveChatMessage[]>(messagesKey)) || memoryStore().messages;
}

type JsonBody = Record<string, unknown>;

export async function addMessage(body: JsonBody) {
  const messages = await listMessages();
  const message: LiveChatMessage = {
    id: randomUUID(),
    visitorId: cleanText(body.visitorId) || randomUUID(),
    name: cleanText(body.name),
    email: cleanText(body.email),
    message: cleanText(body.message),
    pageUrl: cleanText(body.pageUrl),
    createdAt: new Date().toISOString()
  };
  if (!message.message) throw new Error("Message is required.");
  const next = [message, ...messages].slice(0, 200);
  memoryStore().messages = next;
  await setJson(messagesKey, next);
  return message;
}

export async function listReplies() {
  return (await getJson<LiveChatReply[]>(repliesKey)) || memoryStore().replies;
}

export async function addReply(body: JsonBody) {
  const replies = await listReplies();
  const reply: LiveChatReply = {
    id: randomUUID(),
    visitorId: cleanText(body.visitorId),
    operatorName: cleanText(body.operatorName) || "Brandon",
    message: cleanText(body.message),
    createdAt: new Date().toISOString()
  };
  if (!reply.visitorId || !reply.message) throw new Error("visitorId and message are required.");
  const next = [reply, ...replies].slice(0, 400);
  memoryStore().replies = next;
  await setJson(repliesKey, next);
  await setTyping(reply.visitorId, false, reply.operatorName);
  return reply;
}

export async function getTyping(visitorId: string) {
  const typingByVisitor = (await getJson<Record<string, TypingState>>(typingKey)) || memoryStore().typingByVisitor;
  const typing = typingByVisitor[visitorId];
  return {
    typing: Boolean(typing && Date.now() - typing.at < 6000),
    operatorName: typing?.operatorName || (await getOperator()).operatorName
  };
}

export async function setTyping(visitorId: string, typing: boolean, operatorName = "Brandon") {
  const typingByVisitor = (await getJson<Record<string, TypingState>>(typingKey)) || memoryStore().typingByVisitor;
  if (typing) {
    typingByVisitor[visitorId] = { at: Date.now(), operatorName };
  } else {
    delete typingByVisitor[visitorId];
  }
  memoryStore().typingByVisitor = typingByVisitor;
  await setJson(typingKey, typingByVisitor);
}

export async function listBookings() {
  return ((await getJson<KreoBooking[]>(bookingsKey)) || memoryStore().bookings).sort(
    (a, b) => `${a.selectedDate} ${a.selectedTime}`.localeCompare(`${b.selectedDate} ${b.selectedTime}`)
  );
}

export async function addBooking(body: JsonBody) {
  const bookings = await listBookings();
  const booking: KreoBooking = {
    id: randomUUID(),
    name: cleanText(body.name).slice(0, 140),
    email: cleanText(body.email).slice(0, 180),
    businessName: cleanText(body.businessName).slice(0, 180),
    phone: cleanText(body.phone).slice(0, 80),
    meetingType: cleanText(body.meetingType).slice(0, 80) || "Discovery Call",
    projectType: cleanText(body.projectType).slice(0, 120),
    selectedDate: cleanText(body.selectedDate).slice(0, 10),
    selectedTime: cleanText(body.selectedTime).slice(0, 5),
    timezone: cleanText(body.timezone).slice(0, 80) || "Europe/London",
    durationMinutes: Number(body.durationMinutes || 30),
    notes: cleanText(body.notes),
    status: "new",
    createdAt: new Date().toISOString()
  };
  if (!booking.name) throw new Error("Name is required.");
  if (!/^\S+@\S+\.\S+$/.test(booking.email)) throw new Error("A valid email is required.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(booking.selectedDate) || !/^\d{2}:\d{2}$/.test(booking.selectedTime)) {
    throw new Error("Choose a valid booking slot.");
  }
  const taken = bookings.some(
    (item) => item.status !== "cancelled" && item.selectedDate === booking.selectedDate && item.selectedTime === booking.selectedTime
  );
  if (taken) throw new Error("That slot has just been taken. Please choose another time.");
  const next = [booking, ...bookings].slice(0, 300);
  memoryStore().bookings = next;
  await setJson(bookingsKey, next);
  return booking;
}

export function json(payload: unknown, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
    }
  });
}

export function options() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
    }
  });
}

export async function readBody(request: Request) {
  return request.json().catch(() => ({})) as Promise<JsonBody>;
}

function cleanText(value: unknown) {
  return String(value || "").trim().slice(0, 2000);
}

async function getJson<T>(key: string): Promise<T | null> {
  const raw = await redisCommand<string | null>(["GET", key]);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function setJson(key: string, value: unknown) {
  await redisCommand(["SET", key, JSON.stringify(value)]);
}

async function redisCommand<T>(command: unknown[]): Promise<T | null> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { result?: T };
  return data.result ?? null;
}
