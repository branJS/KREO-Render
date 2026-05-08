import http from "node:http";
import { randomUUID } from "node:crypto";

const port = Number(process.env.PORT || 8787);
const operatorApiKey = process.env.KREO_CHAT_API_KEY || "local-kreo-chat-dev-key";
const allowedOrigin = process.env.KREO_CHAT_ALLOWED_ORIGIN || "*";
const heartbeatWindowMs = Number(process.env.KREO_CHAT_HEARTBEAT_WINDOW_MS || 30000);

let operator = {
  online: false,
  operatorName: "Brandon",
  lastHeartbeatAt: 0,
  typingByVisitor: new Map()
};

const messages = [];
const replies = [];

const server = http.createServer(async (request, response) => {
  setCors(response);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  try {
    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, { ok: true, online: isOperatorOnline() });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/widget/status") {
      sendJson(response, 200, {
        online: isOperatorOnline(),
        operatorName: operator.operatorName,
        lastHeartbeatAt: operator.lastHeartbeatAt ? new Date(operator.lastHeartbeatAt).toISOString() : null
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/widget/replies") {
      const visitorId = String(url.searchParams.get("visitorId") || "");
      sendJson(response, 200, { replies: replies.filter((reply) => reply.visitorId === visitorId) });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/widget/typing") {
      const visitorId = String(url.searchParams.get("visitorId") || "");
      const typing = operator.typingByVisitor.get(visitorId);
      sendJson(response, 200, {
        typing: Boolean(typing && Date.now() - typing.at < 6000),
        operatorName: operator.operatorName
      });
      return;
    }

    if (request.method === "POST" && (url.pathname === "/api/widget/messages" || url.pathname === "/api/widget/message")) {
      const body = await readJson(request);
      const visitorId = cleanText(body.visitorId) || randomUUID();
      const message = {
        id: randomUUID(),
        visitorId,
        name: cleanText(body.name),
        email: cleanText(body.email),
        message: cleanText(body.message),
        pageUrl: cleanText(body.pageUrl),
        createdAt: new Date().toISOString()
      };
      if (!message.message) {
        sendJson(response, 400, { error: "Message is required." });
        return;
      }
      messages.unshift(message);
      trimStore();
      sendJson(response, 200, { ok: true, messageId: message.id, visitorId });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/operator/heartbeat") {
      if (!isAuthorized(request)) return sendJson(response, 401, { error: "Unauthorized" });
      const body = await readJson(request);
      operator = {
        online: Boolean(body.online ?? true),
        operatorName: cleanText(body.operatorName) || "Brandon",
        lastHeartbeatAt: Date.now(),
        typingByVisitor: operator.typingByVisitor
      };
      sendJson(response, 200, { ok: true, online: true, operatorName: operator.operatorName });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/operator/typing") {
      if (!isAuthorized(request)) return sendJson(response, 401, { error: "Unauthorized" });
      const body = await readJson(request);
      const visitorId = cleanText(body.visitorId);
      if (!visitorId) {
        sendJson(response, 400, { error: "visitorId is required." });
        return;
      }
      if (Boolean(body.typing)) {
        operator.typingByVisitor.set(visitorId, { at: Date.now(), operatorName: cleanText(body.operatorName) || operator.operatorName });
      } else {
        operator.typingByVisitor.delete(visitorId);
      }
      sendJson(response, 200, { ok: true });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/operator/messages") {
      if (!isAuthorized(request)) return sendJson(response, 401, { error: "Unauthorized" });
      sendJson(response, 200, { messages, replies });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/operator/reply") {
      if (!isAuthorized(request)) return sendJson(response, 401, { error: "Unauthorized" });
      const body = await readJson(request);
      const reply = {
        id: randomUUID(),
        visitorId: cleanText(body.visitorId),
        operatorName: cleanText(body.operatorName) || operator.operatorName || "Brandon",
        message: cleanText(body.message),
        createdAt: new Date().toISOString()
      };
      if (!reply.visitorId || !reply.message) {
        sendJson(response, 400, { error: "visitorId and message are required." });
        return;
      }
      replies.unshift(reply);
      operator.typingByVisitor.delete(reply.visitorId);
      trimStore();
      sendJson(response, 200, { ok: true, replyId: reply.id });
      return;
    }

    sendJson(response, 404, { error: "Route not found" });
  } catch (error) {
    sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(port, () => {
  console.log(`KREO chat relay running on http://localhost:${port}`);
  console.log(`Operator API key: ${operatorApiKey}`);
});

function isOperatorOnline() {
  return operator.online && Date.now() - operator.lastHeartbeatAt < heartbeatWindowMs;
}

function isAuthorized(request) {
  const header = request.headers.authorization || "";
  return header === `Bearer ${operatorApiKey}`;
}

function setCors(response) {
  response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function cleanText(value) {
  return String(value || "").trim().slice(0, 2000);
}

function trimStore() {
  messages.splice(200);
  replies.splice(400);
}
