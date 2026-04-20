/**
 * AI 结构化 meta 解析
 * ------------------------------------------
 * DeepSeek 被要求在流的最后以如下格式附带元信息：
 *   <meta>{"deltas":{"heart":2,"trust":0,"mind":1,"spark":3},"mood":"愉快","inner_os":"她其实在笑","suggest_end":false}</meta>
 * 前端在流结束后：
 *  1. 用正则把 meta 块从正文里抠出来
 *  2. 解析 JSON，失败时 fallback 到空 delta
 *  3. 返回 { cleanText, meta }
 * ------------------------------------------
 */

export interface ChatMeta {
  deltas: { heart: number; trust: number; mind: number; spark: number };
  mood?: string;
  inner_os?: string;
  suggest_end?: boolean;
  ending?: 'perfect' | 'good' | 'neutral' | 'bad' | null;
}

const META_REGEX = /<meta>([\s\S]*?)<\/meta>/i;

function clampDelta(v: unknown): number {
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return 0;
  // 单次最多 +-10，避免模型偶尔给 +50
  return Math.max(-10, Math.min(10, Math.round(n)));
}

export function parseChatMeta(raw: string): { cleanText: string; meta: ChatMeta } {
  const m = raw.match(META_REGEX);
  let meta: ChatMeta = { deltas: { heart: 0, trust: 0, mind: 0, spark: 0 } };
  let cleanText = raw;
  if (m) {
    cleanText = raw.replace(META_REGEX, '').trim();
    try {
      const obj = JSON.parse(m[1]);
      const d = obj?.deltas || {};
      meta = {
        deltas: {
          heart: clampDelta(d.heart),
          trust: clampDelta(d.trust),
          mind:  clampDelta(d.mind),
          spark: clampDelta(d.spark),
        },
        mood: typeof obj?.mood === 'string' ? obj.mood : undefined,
        inner_os: typeof obj?.inner_os === 'string' ? obj.inner_os : undefined,
        suggest_end: Boolean(obj?.suggest_end),
        ending: ['perfect', 'good', 'neutral', 'bad'].includes(obj?.ending) ? obj.ending : null,
      };
    } catch {
      // 解析失败就空 meta
    }
  }
  return { cleanText, meta };
}

/** 清理所有可能出现在流中的 meta 标签碎片（防止流中还没闭合的 meta 漏到 UI） */
export function stripMetaFragments(raw: string): string {
  // 完整闭合的
  let out = raw.replace(META_REGEX, '');
  // 未闭合的起始标签（流途中）
  const openIdx = out.search(/<meta>/i);
  if (openIdx >= 0) out = out.slice(0, openIdx);
  return out;
}
