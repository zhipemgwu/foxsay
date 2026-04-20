/**
 * @file constants.ts
 * @desc 全局常量 — 动画延迟、超时、魔法数字集中管理
 */

// ─── 动画延迟（ms）───
export const ANIM_TAB_SWITCH = 200;
export const ANIM_HOME_SKELETON = 1200;
export const ANIM_COACH_REPLY_MIN = 1500;
export const ANIM_COACH_REPLY_RAND = 2000;
export const ANIM_TOAST_DURATION = 1800;
export const ANIM_AI_RESPONSE_DELAY = 1200;
export const ANIM_CHECKIN_FEEDBACK = 1800;

// ─── 业务限制 ───
export const MAX_OTP_DIGITS = 6;
export const PHONE_LENGTH = 11;
export const OTP_COUNTDOWN_SEC = 60;
export const MAX_IMAGES = 5;

// ─── 手机号验证 ───
export const PHONE_REGEX = /^1[3-9]\d{9}$/;

// ─── 渐变色 ───
// 已由 CuteIcons.jsx 导出的 gradients 为主，此处仅备注文档化
