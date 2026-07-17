import type { A2UIPayload } from '../types/a2ui';

interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export type SSEEvent =
  | { type: 'agent_start'; agent: string }
  | { type: 'agent_complete'; agent: string; token_usage: TokenUsage }
  | { type: 'payload'; payload: A2UIPayload; total_tokens: TokenUsage }
  | { type: 'error'; message: string }
  | { type: 'done' };

const API_BASE = '/api';  // Proxied by Vite to localhost:8000

async function* parseSSE(response: Response): AsyncGenerator<SSEEvent> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    let eventType = '';
    let eventData = '';

    for (const line of lines) {
      if (line.startsWith('event: ')) {
        eventType = line.slice(7).trim();
      } else if (line.startsWith('data: ')) {
        eventData = line.slice(6);
      } else if (line === '' && eventType && eventData) {
        try {
          const parsed = JSON.parse(eventData);
          yield { type: eventType, ...parsed } as SSEEvent;
        } catch {
          // skip malformed events
        }
        eventType = '';
        eventData = '';
      }
    }
  }
}

export async function* streamChat(
  sessionId: string,
  message: string
): AsyncGenerator<SSEEvent> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message }),
  });

  if (!response.ok) {
    yield { type: 'error', message: `HTTP ${response.status}: ${response.statusText}` };
    return;
  }

  yield* parseSSE(response);
}

export async function* streamAction(
  sessionId: string,
  action: string,
  data: Record<string, unknown>
): AsyncGenerator<SSEEvent> {
  const response = await fetch(`${API_BASE}/chat/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, action, data }),
  });

  if (!response.ok) {
    yield { type: 'error', message: `HTTP ${response.status}: ${response.statusText}` };
    return;
  }

  yield* parseSSE(response);
}
