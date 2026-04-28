/**
 * FoxSay AI 对话客户端
 * 支持流式（SSE）和非流式两种模式
 */

const API_URL = '/api/chat';

/**
 * 角色卡接口
 */
export interface RoleCard {
  name: string;           // 角色名
  personality: string;    // 性格描述
  background: string;     // 背景故事
  speakStyle: string;     // 说话风格
  relationship: string;   // 与用户的关系
  stage: string;          // 当前阶段（如：初遇、暧昧）
  extra?: string;         // 附加设定
}

/**
 * 将角色卡转为 system prompt
 */
export function buildSystemPrompt(role: RoleCard, scenario?: string): string {
  let prompt = `你现在扮演一个叫"${role.name}"的角色。\n\n`;
  prompt += `【性格】${role.personality}\n`;
  prompt += `【背景】${role.background}\n`;
  prompt += `【说话风格】${role.speakStyle}\n`;
  prompt += `【与用户的关系】${role.relationship}\n`;
  prompt += `【当前阶段】${role.stage}\n`;
  if (role.extra) prompt += `【补充设定】${role.extra}\n`;
  prompt += `\n请始终保持角色，用自然、口语化的方式回复。每次回复控制在 2-4 句话之内，像真实聊天一样。`;
  if (scenario) {
    prompt += `\n\n【当前场景】${scenario}`;
  }
  return prompt;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * 流式对话 — 逐字回调
 * @param messages  完整对话历史（含 system）
 * @param onChunk   每收到一段文字时回调
 * @param onDone    结束时回调（传入完整回复）
 * @param onError   出错时回调
 * @returns AbortController（可用于取消请求）
 */
export function chatStream(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  onDone: (fullText: string) => void,
  onError?: (err: Error) => void,
  opts?: { model?: 'deepseek-chat' | 'deepseek-reasoner'; temperature?: number; max_tokens?: number },
): AbortController {
  const controller = new AbortController();
  let fullText = '';

  (async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          stream: true,
          ...(opts?.model ? { model: opts.model } : {}),
          ...(opts?.temperature !== undefined ? { temperature: opts.temperature } : {}),
          ...(opts?.max_tokens !== undefined ? { max_tokens: opts.max_tokens } : {}),
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`API 错误 ${res.status}: ${errBody}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            // deepseek-reasoner 可能有 reasoning_content
            const delta = json.choices?.[0]?.delta;
            const text = delta?.content || '';
            if (text) {
              fullText += text;
              onChunk(text);
            }
          } catch {
            // 忽略不完整的 JSON 行
          }
        }
      }

      onDone(fullText);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      onError?.(err);
    }
  })();

  return controller;
}

/**
 * 非流式对话 — 一次性返回
 */
/**
 * 非流式对话 — 一次性返回
 * @param messages 对话消息
 * @param opts.model 可选模型覆盖：'deepseek-chat'（快）或 'deepseek-reasoner'（慢）
 */
export async function chatOnce(
  messages: ChatMessage[],
  opts?: { model?: 'deepseek-chat' | 'deepseek-reasoner'; temperature?: number; max_tokens?: number },
): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      stream: false,
      ...(opts?.model ? { model: opts.model } : {}),
      ...(opts?.temperature !== undefined ? { temperature: opts.temperature } : {}),
      ...(opts?.max_tokens !== undefined ? { max_tokens: opts.max_tokens } : {}),
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`API 错误 ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

/* =========================================================
 *  关卡对话 API — 根据关卡 KID 自动加载角色卡和剧情
 * ========================================================= */

export interface LevelOpening {
  opening: string;
  choices: string[];
  levelTitle: string;
}

/**
 * 获取关卡开场白
 */
export async function getLevelOpening(levelKid: string): Promise<LevelOpening> {
  const res = await fetch('/api/level-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ levelKid, history: [] }),
  });
  if (!res.ok) throw new Error(`获取开场白失败: ${res.status}`);
  return res.json();
}

/**
 * 关卡流式对话
 * @param levelKid  关卡 KID（如 L001）
 * @param history   对话历史（不含 system 和 opening，只含 user/assistant 轮次）
 * @param onChunk   每收到文字时回调
 * @param onDone    结束时回调
 * @param onError   出错时回调
 */
export function levelChatStream(
  levelKid: string,
  history: ChatMessage[],
  onChunk: (text: string) => void,
  onDone: (fullText: string) => void,
  onError?: (err: Error) => void,
): AbortController {
  const controller = new AbortController();
  let fullText = '';

  (async () => {
    try {
      const res = await fetch('/api/level-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ levelKid, history, stream: true }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`API 错误 ${res.status}: ${errBody}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta;
            const text = delta?.content || '';
            if (text) {
              fullText += text;
              onChunk(text);
            }
          } catch {
            // 忽略不完整的 JSON 行
          }
        }
      }

      onDone(fullText);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      onError?.(err);
    }
  })();

  return controller;
}

/**
 * 获取关卡详情（不调用 AI）
 */
export async function getLevelInfo(levelKid: string) {
  const res = await fetch(`/api/level/${levelKid}`);
  if (!res.ok) throw new Error(`关卡不存在: ${levelKid}`);
  return res.json();
}

/**
 * 热重载数据（开发时修改 JSON 后调用）
 */
export async function reloadData() {
  const res = await fetch('/api/reload', { method: 'POST' });
  return res.json();
}
