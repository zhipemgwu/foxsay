/**
 * @file sanitize.ts
 * @desc 文本 XSS 过滤 — 在渲染前去除潜在的 HTML/Script 标签
 */

const TAG_RE = /<\/?[^>]+(>|$)/g;
const ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

/** 去除 HTML 标签（保留文本内容） */
export function stripTags(s: string): string {
  if (typeof s !== 'string') return '';
  return s.replace(TAG_RE, '');
}

/** HTML 实体转义 */
export function escapeHtml(s: string): string {
  if (typeof s !== 'string') return '';
  return s.replace(/[&<>"']/g, ch => ENTITY_MAP[ch] || ch);
}

/** 安全化字符串：去标签 + 限长 */
export function sanitizeText(s: unknown, maxLen = 5000): string {
  if (typeof s !== 'string') return '';
  return stripTags(s).slice(0, maxLen);
}
