import { getOperator, isOperatorOnline, json, options } from "../../live-chat-store";

export async function GET() {
  const operator = await getOperator();
  return json({
    online: await isOperatorOnline(),
    operatorName: operator.operatorName,
    lastHeartbeatAt: operator.lastHeartbeatAt ? new Date(operator.lastHeartbeatAt).toISOString() : null
  });
}

export function OPTIONS() {
  return options();
}
