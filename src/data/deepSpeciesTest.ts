/**
 * 深度恋爱物种测试 —— 31 题精准定位
 *
 * 基于依恋理论(Attachment Theory)、五种爱语(Five Love Languages)
 * 以及 FoxSay 自有的 5 维模型(opener/empathy/observe/topic/safety)
 * 设计的恋爱人格深度诊断。
 *
 * 题型：单选情境题 ×20 | 二选一极端题 ×6 | 滑杆量表题 ×4 | 综合大场景题 ×1
 * 维度：A-聊天力(6) B-吸引力(6) C-主动力(6) D-共情力(6) E-掌控力(6) F-综合(1)
 */

import { speciesAbilityHint as _speciesAbilityHint } from './onboardingChat';
import type { AbilityScores } from '../services/ability';

/* ---------- types ---------- */

export type DeepQuestionType = 'choice' | 'binary' | 'slider' | 'composite';

export interface ChoiceOption {
  id: string;
  emoji: string;
  label: string;
  scores: Record<string, number>;
}

export interface CompositeStep {
  prompt: string;
  options: ChoiceOption[];
}

export interface DeepQuestion {
  id: string;
  /** 所属维度模块 */
  module: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  moduleName: string;
  type: DeepQuestionType;
  prompt: string;
  /** choice / binary */
  options?: ChoiceOption[];
  /** slider 两端标签 */
  sliderLabels?: [string, string];
  /** slider 低端(0)时的物种得分 */
  sliderLowScores?: Record<string, number>;
  /** slider 高端(100)时的物种得分 */
  sliderHighScores?: Record<string, number>;
  /** composite 多步 */
  steps?: CompositeStep[];
}

/* ---------- 31 questions ---------- */

export const deepTestQuestions: DeepQuestion[] = [
  /* ===== Module A: 聊天力 (6) ===== */
  {
    id: 'dA1', module: 'A', moduleName: '聊天力', type: 'choice',
    prompt: '你和刚认识的人聊天，发现话题快要断了，你会？',
    options: [
      { id: 'dA1a', emoji: '💬', label: '主动抛出一个有趣的新话题', scores: { laosihu: 2, haiwanghu: 3 } },
      { id: 'dA1b', emoji: '❓', label: '问对方一个开放式问题', scores: { caonihu: 2, xinjihu: 2, tiantianhu: 1 } },
      { id: 'dA1c', emoji: '😂', label: '发个表情包缓解尴尬', scores: { songsonghu: 2, tiantianhu: 1, xiaochouhu: 1 } },
      { id: 'dA1d', emoji: '🤐', label: '等对方先说，实在不行就算了', scores: { zhiwuhu: 3, zhuangsihu: 2 } },
    ],
  },
  {
    id: 'dA2', module: 'A', moduleName: '聊天力', type: 'choice',
    prompt: '对方给你发了一条很长的消息诉苦，你的第一反应？',
    options: [
      { id: 'dA2a', emoji: '📝', label: '认真读完，回复同样长的安慰', scores: { tiantianhu: 3, beiweihu: 2 } },
      { id: 'dA2b', emoji: '🤗', label: '先回一句「抱抱」再慢慢看', scores: { caonihu: 2, lianfeihu: 1, xiaochouhu: 1 } },
      { id: 'dA2c', emoji: '🧠', label: '挑关键点回复，顺便给建议', scores: { laosihu: 2, xinjihu: 2 } },
      { id: 'dA2d', emoji: '😶', label: '觉得有点沉重，过一阵再回', scores: { zhuangsihu: 2, zhiwuhu: 2, haiwanghu: 1, songsonghu: 1 } },
    ],
  },
  {
    id: 'dA3', module: 'A', moduleName: '聊天力', type: 'choice',
    prompt: '你和喜欢的人约好聊天，对方一直偏离话题，你？',
    options: [
      { id: 'dA3a', emoji: '🎯', label: '自然地把话题引回来', scores: { laosihu: 2, xinjihu: 2 } },
      { id: 'dA3b', emoji: '😊', label: '配合聊，聊什么都开心', scores: { tiantianhu: 2, lianfeihu: 2, beiweihu: 1 } },
      { id: 'dA3c', emoji: '🫖', label: '暗示一下原本想聊的内容', scores: { lvchahu: 2, caonihu: 2 } },
      { id: 'dA3d', emoji: '😞', label: '算了，可能对方不想聊那个', scores: { songsonghu: 2, beiweihu: 2 } },
    ],
  },
  {
    id: 'dA4', module: 'A', moduleName: '聊天力', type: 'binary',
    prompt: '如果只能二选一：',
    options: [
      { id: 'dA4a', emoji: '📢', label: '宁可话多被嫌烦', scores: { laosihu: 2, haiwanghu: 2, lianfeihu: 2, xiaochouhu: 1 } },
      { id: 'dA4b', emoji: '🤫', label: '宁可沉默被忘记', scores: { zhiwuhu: 3, zhuangsihu: 2, songsonghu: 2 } },
    ],
  },
  {
    id: 'dA5', module: 'A', moduleName: '聊天力', type: 'choice',
    prompt: '群聊里大家在热烈讨论你不太懂的话题，你？',
    options: [
      { id: 'dA5a', emoji: '🙋', label: '大胆插话，不懂就问', scores: { laosihu: 2, xiaochouhu: 2, lianfeihu: 1 } },
      { id: 'dA5b', emoji: '👀', label: '默默围观，偶尔发个表情', scores: { zhiwuhu: 2, songsonghu: 2 } },
      { id: 'dA5c', emoji: '🔍', label: '先搜索了解后再参与', scores: { xinjihu: 2, lvchahu: 2 } },
      { id: 'dA5d', emoji: '🔄', label: '转移到自己擅长的话题', scores: { haiwanghu: 2, caonihu: 1 } },
    ],
  },
  {
    id: 'dA6', module: 'A', moduleName: '聊天力', type: 'choice',
    prompt: '你最擅长的聊天方式是？',
    options: [
      { id: 'dA6a', emoji: '🎭', label: '幽默段子手，随时逗人笑', scores: { laosihu: 2, haiwanghu: 2, xiaochouhu: 1 } },
      { id: 'dA6b', emoji: '👂', label: '认真倾听，让对方感觉被理解', scores: { tiantianhu: 3, beiweihu: 2 } },
      { id: 'dA6c', emoji: '🌙', label: '若即若离，留点神秘感', scores: { lvchahu: 3, caonihu: 2 } },
      { id: 'dA6d', emoji: '💎', label: '真诚直接，有什么说什么', scores: { xiaochouhu: 2, lianfeihu: 1, songsonghu: 1 } },
    ],
  },

  /* ===== Module B: 吸引力 (6) ===== */
  {
    id: 'dB1', module: 'B', moduleName: '吸引力', type: 'choice',
    prompt: '第一次见面，你最希望给对方留下什么印象？',
    options: [
      { id: 'dB1a', emoji: '✨', label: '自信有魅力的', scores: { laosihu: 2, haiwanghu: 3 } },
      { id: 'dB1b', emoji: '🧸', label: '温暖可靠的', scores: { tiantianhu: 2, caonihu: 2, beiweihu: 1 } },
      { id: 'dB1c', emoji: '🎪', label: '有趣特别的', scores: { xiaochouhu: 3, lianfeihu: 1 } },
      { id: 'dB1d', emoji: '🏖', label: '无所谓，做自己就好', scores: { zhiwuhu: 2, zhuangsihu: 2 } },
    ],
  },
  {
    id: 'dB2', module: 'B', moduleName: '吸引力', type: 'choice',
    prompt: '朋友圈/社交媒体，你通常怎么经营？',
    options: [
      { id: 'dB2a', emoji: '📐', label: '精心运营，内容和时机都有讲究', scores: { lvchahu: 3, xinjihu: 2 } },
      { id: 'dB2b', emoji: '🌊', label: '随心发，想发什么就发', scores: { laosihu: 1, xiaochouhu: 2, lianfeihu: 1 } },
      { id: 'dB2c', emoji: '🔇', label: '偶尔看看别人的，自己很少发', scores: { songsonghu: 3, zhuangsihu: 2, caonihu: 1 } },
      { id: 'dB2d', emoji: '🚫', label: '设仅自己可见或根本不用', scores: { zhiwuhu: 3, beiweihu: 1 } },
    ],
  },
  {
    id: 'dB3', module: 'B', moduleName: '吸引力', type: 'binary',
    prompt: '你更接近哪一种？',
    options: [
      { id: 'dB3a', emoji: '💅', label: '外表精致但内心紧张', scores: { lvchahu: 3, xinjihu: 2, beiweihu: 1 } },
      { id: 'dB3b', emoji: '🏕', label: '外表随意但内心坦然', scores: { laosihu: 2, zhiwuhu: 2, caonihu: 1 } },
    ],
  },
  {
    id: 'dB4', module: 'B', moduleName: '吸引力', type: 'choice',
    prompt: '在社交场合发现有人在偷偷看你，你？',
    options: [
      { id: 'dB4a', emoji: '😏', label: '大方回看，微笑示意', scores: { laosihu: 2, haiwanghu: 3 } },
      { id: 'dB4b', emoji: '🫣', label: '假装没看到，但内心小鹿乱撞', scores: { caonihu: 2, songsonghu: 2, tiantianhu: 1 } },
      { id: 'dB4c', emoji: '🪞', label: '立刻低头检查自己哪里不对', scores: { beiweihu: 2, songsonghu: 2, xiaochouhu: 1 } },
      { id: 'dB4d', emoji: '🗿', label: '无所谓，继续做自己的事', scores: { zhuangsihu: 2, zhiwuhu: 2 } },
    ],
  },
  {
    id: 'dB5', module: 'B', moduleName: '吸引力', type: 'choice',
    prompt: '你觉得最能吸引人的特质是？',
    options: [
      { id: 'dB5a', emoji: '🗣', label: '会说话，情商高', scores: { laosihu: 2, xinjihu: 2, lvchahu: 1 } },
      { id: 'dB5b', emoji: '💛', label: '善良体贴，有同理心', scores: { tiantianhu: 3, beiweihu: 2 } },
      { id: 'dB5c', emoji: '🏔', label: '独立自信，有自己的世界', scores: { zhuangsihu: 1, caonihu: 2, haiwanghu: 1 } },
      { id: 'dB5d', emoji: '🌫', label: '神秘感，让人想了解更多', scores: { lvchahu: 3, haiwanghu: 1 } },
    ],
  },
  {
    id: 'dB6', module: 'B', moduleName: '吸引力', type: 'slider',
    prompt: '你对自己外在形象的在意程度？',
    sliderLabels: ['完全不在意', '极度在意'],
    sliderLowScores: { zhiwuhu: 3, zhuangsihu: 2, songsonghu: 1 },
    sliderHighScores: { lvchahu: 3, haiwanghu: 2, xinjihu: 2 },
  },

  /* ===== Module C: 主动力 (6) ===== */
  {
    id: 'dC1', module: 'C', moduleName: '主动力', type: 'choice',
    prompt: '你很喜欢一个人但不确定对方态度，你会？',
    options: [
      { id: 'dC1a', emoji: '🚀', label: '直接表白，不喜欢拖泥带水', scores: { laosihu: 2, lianfeihu: 2 } },
      { id: 'dC1b', emoji: '🎣', label: '创造机会接近，暗中试探', scores: { xinjihu: 3, lvchahu: 2 } },
      { id: 'dC1c', emoji: '🌸', label: '默默关注，等对方发现我', scores: { songsonghu: 2, beiweihu: 3 } },
      { id: 'dC1d', emoji: '🚪', label: '告诉自己算了然后继续暗恋', scores: { zhuangsihu: 2, zhiwuhu: 2, songsonghu: 1 } },
    ],
  },
  {
    id: 'dC2', module: 'C', moduleName: '主动力', type: 'choice',
    prompt: '聊天时发现对方回复越来越慢，你的反应？',
    options: [
      { id: 'dC2a', emoji: '🤷', label: '照常发消息，不受影响', scores: { laosihu: 2, haiwanghu: 2 } },
      { id: 'dC2b', emoji: '📱', label: '发更多消息想把对方拉回来', scores: { lianfeihu: 3, xiaochouhu: 2 } },
      { id: 'dC2c', emoji: '⚖', label: '也放慢节奏，保持对等', scores: { xinjihu: 2, caonihu: 3 } },
      { id: 'dC2d', emoji: '🧊', label: '直接不发了，等对方主动', scores: { zhuangsihu: 3, zhiwuhu: 1 } },
    ],
  },
  {
    id: 'dC3', module: 'C', moduleName: '主动力', type: 'binary',
    prompt: '如果只能二选一：',
    options: [
      { id: 'dC3a', emoji: '🏃', label: '追到手再说，大不了丢脸', scores: { laosihu: 2, lianfeihu: 2, xiaochouhu: 3 } },
      { id: 'dC3b', emoji: '🐢', label: '宁可错过，不想被拒绝', scores: { songsonghu: 3, zhuangsihu: 2, beiweihu: 2 } },
    ],
  },
  {
    id: 'dC4', module: 'C', moduleName: '主动力', type: 'choice',
    prompt: '约会完你觉得氛围很好，接下来你会？',
    options: [
      { id: 'dC4a', emoji: '💌', label: '当晚就发消息说「今天很开心」', scores: { tiantianhu: 2, lianfeihu: 2 } },
      { id: 'dC4b', emoji: '😎', label: '等第二天，装作不经意提起', scores: { caonihu: 2, lvchahu: 3 } },
      { id: 'dC4c', emoji: '♟', label: '看对方先不先发，谁先谁输', scores: { xinjihu: 3, zhuangsihu: 1 } },
      { id: 'dC4d', emoji: '📷', label: '发朋友圈暗示，看对方反应', scores: { xiaochouhu: 2, haiwanghu: 1, lvchahu: 1 } },
    ],
  },
  {
    id: 'dC5', module: 'C', moduleName: '主动力', type: 'choice',
    prompt: '你的恋爱主动性最接近哪种？',
    options: [
      { id: 'dC5a', emoji: '🦁', label: '我是猎人，看上了就行动', scores: { laosihu: 2, haiwanghu: 3 } },
      { id: 'dC5b', emoji: '🕸', label: '我是钓手，布线等鱼上钩', scores: { xinjihu: 3, lvchahu: 2 } },
      { id: 'dC5c', emoji: '🐰', label: '我是被动方，等别人来追', scores: { zhuangsihu: 1, beiweihu: 2, tiantianhu: 1 } },
      { id: 'dC5d', emoji: '🐛', label: '反复纠结，最终还是没行动', scores: { songsonghu: 3, xiaochouhu: 1 } },
    ],
  },
  {
    id: 'dC6', module: 'C', moduleName: '主动力', type: 'choice',
    prompt: '面对拒绝，你通常的恢复速度？',
    options: [
      { id: 'dC6a', emoji: '🔁', label: '很快，对方不识货我换下一个', scores: { haiwanghu: 3, laosihu: 2 } },
      { id: 'dC6b', emoji: '🎭', label: '受伤很久，但不会表现出来', scores: { caonihu: 2, beiweihu: 2, zhuangsihu: 1 } },
      { id: 'dC6c', emoji: '🌀', label: '崩溃一阵，然后疯狂分析哪里错了', scores: { xiaochouhu: 2, lianfeihu: 3 } },
      { id: 'dC6d', emoji: '😶', label: '无所谓，本来就没抱期待', scores: { zhiwuhu: 3, zhuangsihu: 2 } },
    ],
  },

  /* ===== Module D: 共情力 (6) ===== */
  {
    id: 'dD1', module: 'D', moduleName: '共情力', type: 'choice',
    prompt: '对方情绪低落时，你觉得最好的安慰方式是？',
    options: [
      { id: 'dD1a', emoji: '🫂', label: '陪在旁边，什么都不说', scores: { caonihu: 2, beiweihu: 2, tiantianhu: 1 } },
      { id: 'dD1b', emoji: '💡', label: '说开导的话，帮TA分析问题', scores: { laosihu: 1, xinjihu: 2, lvchahu: 1 } },
      { id: 'dD1c', emoji: '🍰', label: '做贴心小事（买吃的、帮忙）', scores: { tiantianhu: 3, beiweihu: 2 } },
      { id: 'dD1d', emoji: '🎢', label: '转移注意力，带TA去做开心的事', scores: { haiwanghu: 2, xiaochouhu: 1, laosihu: 1 } },
    ],
  },
  {
    id: 'dD2', module: 'D', moduleName: '共情力', type: 'choice',
    prompt: '你觉得「太过在意对方感受」这件事？',
    options: [
      { id: 'dD2a', emoji: '💕', label: '这是爱的表现，完全没问题', scores: { tiantianhu: 3, beiweihu: 3 } },
      { id: 'dD2b', emoji: '😮‍💨', label: '有时候太累了，会压抑自己', scores: { caonihu: 2, lianfeihu: 2, songsonghu: 1 } },
      { id: 'dD2c', emoji: '⚖', label: '适度就好，不能失去自我', scores: { laosihu: 1, xinjihu: 2, lvchahu: 1 } },
      { id: 'dD2d', emoji: '🤷', label: '我很少在意别人感受', scores: { zhiwuhu: 3, haiwanghu: 1 } },
    ],
  },
  {
    id: 'dD3', module: 'D', moduleName: '共情力', type: 'binary',
    prompt: '感情里你更怕哪个？',
    options: [
      { id: 'dD3a', emoji: '😰', label: '更怕伤害别人', scores: { tiantianhu: 3, beiweihu: 2, caonihu: 1 } },
      { id: 'dD3b', emoji: '🛡', label: '更怕被别人伤害', scores: { songsonghu: 2, zhuangsihu: 2, lianfeihu: 2 } },
    ],
  },
  {
    id: 'dD4', module: 'D', moduleName: '共情力', type: 'choice',
    prompt: '朋友和对象闹矛盾来找你诉苦，你？',
    options: [
      { id: 'dD4a', emoji: '🔥', label: '完全站朋友这边，骂对方', scores: { xiaochouhu: 3, lianfeihu: 1 } },
      { id: 'dD4b', emoji: '📊', label: '两边的立场都分析一下', scores: { xinjihu: 2, laosihu: 2 } },
      { id: 'dD4c', emoji: '💆', label: '先安抚情绪，不急着给建议', scores: { tiantianhu: 2, caonihu: 2, beiweihu: 1 } },
      { id: 'dD4d', emoji: '🚶', label: '觉得烦，不想掺和别人的事', scores: { zhiwuhu: 2, zhuangsihu: 2, haiwanghu: 1 } },
    ],
  },
  {
    id: 'dD5', module: 'D', moduleName: '共情力', type: 'choice',
    prompt: '在亲密关系中你更容易？',
    options: [
      { id: 'dD5a', emoji: '🫠', label: '过度共情，把对方的情绪当自己的', scores: { tiantianhu: 3, beiweihu: 2, lianfeihu: 1 } },
      { id: 'dD5b', emoji: '🧐', label: '察言观色，精准判断对方情绪', scores: { caonihu: 2, xinjihu: 2, lvchahu: 2 } },
      { id: 'dD5c', emoji: '❓', label: '有时候完全读不懂对方想什么', scores: { zhiwuhu: 2, xiaochouhu: 2, laosihu: 1 } },
      { id: 'dD5d', emoji: '🚶', label: '能感知到但选择不介入', scores: { zhuangsihu: 2, haiwanghu: 2, songsonghu: 1 } },
    ],
  },
  {
    id: 'dD6', module: 'D', moduleName: '共情力', type: 'slider',
    prompt: '你在感情中的安全感需求？',
    sliderLabels: ['完全不需要', '极度需要'],
    sliderLowScores: { haiwanghu: 3, zhiwuhu: 2, zhuangsihu: 2 },
    sliderHighScores: { tiantianhu: 3, lianfeihu: 2, beiweihu: 2, xiaochouhu: 1 },
  },

  /* ===== Module E: 掌控力 (6) ===== */
  {
    id: 'dE1', module: 'E', moduleName: '掌控力', type: 'choice',
    prompt: '「谁更在乎谁就输了」这句话你怎么看？',
    options: [
      { id: 'dE1a', emoji: '♟', label: '完全同意，所以我从不先认输', scores: { xinjihu: 2, lvchahu: 3 } },
      { id: 'dE1b', emoji: '🎮', label: '不同意，但我确实会控制节奏', scores: { caonihu: 2, laosihu: 1, haiwanghu: 1 } },
      { id: 'dE1c', emoji: '💗', label: '不同意，真心就不存在输赢', scores: { tiantianhu: 2, beiweihu: 2, lianfeihu: 1 } },
      { id: 'dE1d', emoji: '🤡', label: '我就是那个「输」的人', scores: { lianfeihu: 3, xiaochouhu: 2 } },
    ],
  },
  {
    id: 'dE2', module: 'E', moduleName: '掌控力', type: 'choice',
    prompt: '对方做了让你不舒服的事，你会？',
    options: [
      { id: 'dE2a', emoji: '🗣', label: '当场说出来，直接沟通', scores: { laosihu: 2, haiwanghu: 1 } },
      { id: 'dE2b', emoji: '😤', label: '不说，但会用行动表示不满', scores: { caonihu: 2, lvchahu: 2 } },
      { id: 'dE2c', emoji: '😣', label: '忍着，怕说了影响关系', scores: { beiweihu: 3, tiantianhu: 2 } },
      { id: 'dE2d', emoji: '📋', label: '默默记在心里，以后再算总账', scores: { xinjihu: 2, lianfeihu: 1, songsonghu: 2 } },
    ],
  },
  {
    id: 'dE3', module: 'E', moduleName: '掌控力', type: 'binary',
    prompt: '恋爱中你更像：',
    options: [
      { id: 'dE3a', emoji: '👑', label: '掌控全局的人', scores: { xinjihu: 3, laosihu: 2, lvchahu: 2 } },
      { id: 'dE3b', emoji: '🌿', label: '更习惯跟随对方', scores: { beiweihu: 3, tiantianhu: 2, songsonghu: 2 } },
    ],
  },
  {
    id: 'dE4', module: 'E', moduleName: '掌控力', type: 'choice',
    prompt: '你对恋爱中「仪式感」的态度？',
    options: [
      { id: 'dE4a', emoji: '🎂', label: '非常重要，必须有惊喜和纪念日', scores: { lianfeihu: 2, tiantianhu: 2, xiaochouhu: 1 } },
      { id: 'dE4b', emoji: '🍃', label: '偶尔需要，适度即可', scores: { caonihu: 2, laosihu: 1 } },
      { id: 'dE4c', emoji: '🤷', label: '无所谓，顺其自然', scores: { zhiwuhu: 3, zhuangsihu: 2, songsonghu: 1 } },
      { id: 'dE4d', emoji: '🎬', label: '我是那个策划惊喜的人', scores: { xinjihu: 2, lvchahu: 2, haiwanghu: 1 } },
    ],
  },
  {
    id: 'dE5', module: 'E', moduleName: '掌控力', type: 'choice',
    prompt: '分手后你通常会？',
    options: [
      { id: 'dE5a', emoji: '✂', label: '快速走出来，删掉联系方式', scores: { haiwanghu: 3, laosihu: 1 } },
      { id: 'dE5b', emoji: '🔁', label: '反复纠缠，很难放手', scores: { lianfeihu: 3, xiaochouhu: 2 } },
      { id: 'dE5c', emoji: '🔍', label: '表面没事，暗地里偷偷看TA社交', scores: { caonihu: 2, songsonghu: 2, lvchahu: 1 } },
      { id: 'dE5d', emoji: '🕳', label: '长期走不出来，但不会联系', scores: { beiweihu: 2, zhuangsihu: 2, songsonghu: 2 } },
    ],
  },
  {
    id: 'dE6', module: 'E', moduleName: '掌控力', type: 'slider',
    prompt: '你在感情中对「掌控感」的需求？',
    sliderLabels: ['完全顺其自然', '希望一切在掌控中'],
    sliderLowScores: { zhiwuhu: 2, tiantianhu: 2, beiweihu: 2, songsonghu: 1 },
    sliderHighScores: { xinjihu: 3, lvchahu: 2, laosihu: 2 },
  },

  /* ===== Module F: 综合情境 (1 composite) ===== */
  {
    id: 'dF1', module: 'F', moduleName: '综合情境', type: 'composite',
    prompt: '🎬 综合情境题（共4步）',
    steps: [
      {
        prompt: '在朋友的聚会上遇到了一个让你心动的人，你的第一反应？',
        options: [
          { id: 'dF1s1a', emoji: '🚀', label: '直接走过去搭话', scores: { laosihu: 2, haiwanghu: 1 } },
          { id: 'dF1s1b', emoji: '🕵', label: '找朋友了解TA的情况', scores: { xinjihu: 2, lvchahu: 1 } },
          { id: 'dF1s1c', emoji: '🤝', label: '和TA身边的人先聊起来', scores: { lvchahu: 2, caonihu: 1 } },
          { id: 'dF1s1d', emoji: '👀', label: '远远看着，不敢靠近', scores: { songsonghu: 2, beiweihu: 1 } },
        ],
      },
      {
        prompt: '你们开始聊天了，你会聊什么？',
        options: [
          { id: 'dF1s2a', emoji: '☕', label: '聊聚会本身，轻松话题', scores: { laosihu: 2, haiwanghu: 1 } },
          { id: 'dF1s2b', emoji: '🎯', label: '找共同兴趣话题深入聊', scores: { caonihu: 2, xinjihu: 1 } },
          { id: 'dF1s2c', emoji: '👂', label: '以倾听为主，多问少说', scores: { tiantianhu: 2, beiweihu: 1 } },
          { id: 'dF1s2d', emoji: '😂', label: '开点玩笑活跃气氛', scores: { xiaochouhu: 2, lianfeihu: 1 } },
        ],
      },
      {
        prompt: '聚会结束，你想继续联系，你会？',
        options: [
          { id: 'dF1s3a', emoji: '📱', label: '直接要微信', scores: { laosihu: 2, haiwanghu: 2 } },
          { id: 'dF1s3b', emoji: '📸', label: '先加TA的社交媒体默默关注', scores: { songsonghu: 1, lvchahu: 2 } },
          { id: 'dF1s3c', emoji: '🤝', label: '请朋友帮忙介绍', scores: { beiweihu: 1, xinjihu: 2 } },
          { id: 'dF1s3d', emoji: '🎲', label: '等缘分，不主动要', scores: { zhuangsihu: 2, zhiwuhu: 2 } },
        ],
      },
      {
        prompt: '对方加了你但没主动聊天，一周后你？',
        options: [
          { id: 'dF1s4a', emoji: '💬', label: '找个理由主动发消息', scores: { laosihu: 2, lianfeihu: 2 } },
          { id: 'dF1s4b', emoji: '📷', label: '在朋友圈发精致内容等对方注意', scores: { lvchahu: 3, xinjihu: 1 } },
          { id: 'dF1s4c', emoji: '🧊', label: '也不主动，等对方来', scores: { zhuangsihu: 2, caonihu: 1 } },
          { id: 'dF1s4d', emoji: '💨', label: '心里已经放弃了', scores: { zhiwuhu: 2, songsonghu: 1 } },
        ],
      },
    ],
  },

  /* === 补充滑杆题 (Module A) === */
  {
    id: 'dA7', module: 'A', moduleName: '聊天力', type: 'slider',
    prompt: '你的「聊天主动性」在什么位置？',
    sliderLabels: ['从不主动发消息', '总是主动找人聊天'],
    sliderLowScores: { zhiwuhu: 3, zhuangsihu: 2, songsonghu: 2 },
    sliderHighScores: { laosihu: 3, haiwanghu: 2, lianfeihu: 2, xiaochouhu: 1 },
  },
];

/* ---------- 模块维度 → 能力映射 ---------- */

const moduleToAbility: Record<string, string> = {
  A: 'chat', B: 'charm', C: 'courage', D: 'empathy', E: 'control',
};

/* ---------- 物种中文名 ---------- */

export const speciesNameMap: Record<string, string> = {
  laosihu: '老司狐', haiwanghu: '海王狐', tiantianhu: '甜甜狐',
  zhuangsihu: '装死狐', songsonghu: '怂怂狐', zhiwuhu: '植物狐',
  xiaochouhu: '小丑狐', lianfeihu: '恋废狐', caonihu: '草泥狐',
  lvchahu: '绿茶狐', xinjihu: '心机狐', beiweihu: '卑微狐',
};

export const speciesEmojiMap: Record<string, string> = {
  laosihu: '🦊', haiwanghu: '🐋', tiantianhu: '🍬',
  zhuangsihu: '💀', songsonghu: '🐔', zhiwuhu: '🌵',
  xiaochouhu: '🤡', lianfeihu: '💔', caonihu: '🦙',
  lvchahu: '🍵', xinjihu: '🧠', beiweihu: '🥺',
};

/* ---------- 物种描述 ---------- */

export const speciesDescriptionMap: Record<string, { title: string; desc: string; strengths: string; weakness: string }> = {
  laosihu: { title: '老司狐', desc: '恋爱老手，自信从容，能在任何社交场合游刃有余。', strengths: '聊天技巧拉满，主动性强，面对拒绝恢复极快', weakness: '容易忽视对方真实感受，共情力不足' },
  haiwanghu: { title: '海王狐', desc: '魅力四射，享受追逐的过程多于结果。', strengths: '极强吸引力，社交能力顶级，恢复力满点', weakness: '难以专注于一段感情，缺乏深度情感连接' },
  tiantianhu: { title: '甜甜狐', desc: '温柔体贴的共情大师，总是把对方放在第一位。', strengths: '共情力极强，善于倾听和照顾，治愈力满分', weakness: '容易失去自我，在意他人评价，掌控力弱' },
  zhuangsihu: { title: '装死狐', desc: '遇到感情问题第一反应是回避，情绪稳定到麻木。', strengths: '不易受伤，情绪稳定，给人很大空间', weakness: '主动力极低，容易错过真爱，回避型依恋' },
  songsonghu: { title: '怂怂狐', desc: '内心渴望爱但害怕被拒绝，总在纠结中错过。', strengths: '内心敏感细腻，对感情认真谨慎', weakness: '主动性极低，过度内耗，总在纠结' },
  zhiwuhu: { title: '植物狐', desc: '佛系恋爱选手，情绪极度稳定，对感情不温不火。', strengths: '极度独立，不被情绪左右，给人安全感', weakness: '缺乏恋爱激情，聊天和主动性都很低' },
  xiaochouhu: { title: '小丑狐', desc: '全力付出但常常用力过猛，勇气可嘉但方向常偏。', strengths: '勇气满分，真诚直接，不怕付出', weakness: '容易误读信号，用力过猛适得其反' },
  lianfeihu: { title: '恋废狐', desc: '恋爱脑本脑，一谈恋爱就疯狂上头停不下来。', strengths: '情感投入度极高，仪式感拉满', weakness: '过度依赖感情，分手恢复极慢，容易纠缠' },
  caonihu: { title: '草泥狐', desc: '嘴上说着「无所谓」但其实什么都在意。', strengths: '情感察觉力强，表达克制得体', weakness: '容易压抑真实想法，让对方猜不透' },
  lvchahu: { title: '绿茶狐', desc: '表面清纯无害，实则深谙社交之道。', strengths: '高情商经营关系，善于形象管理', weakness: '过于注重形象，计算太多失去真诚' },
  xinjihu: { title: '心机狐', desc: '恋爱中的战略家，每一步都精心计算。', strengths: '掌控力极强，能把握关系节奏', weakness: '过度计算让感情失去自然，缺乏真诚' },
  beiweihu: { title: '卑微狐', desc: '总在关系中处于弱势，习惯性自我贬低和退让。', strengths: '善解人意，包容力极强', weakness: '自我价值感低，容易在关系中失去自我' },
};

/* ---------- 计算逻辑 ---------- */

export interface DeepTestResult {
  /** 主物种 id */
  mainSpecies: string;
  /** 副物种 id */
  subSpecies: string;
  /** 匹配度 70-99 */
  matchRate: number;
  /** 5 维能力值 0-100 */
  abilities: AbilityScores;
  /** 12 物种原始得分 */
  rawScores: Record<string, number>;
}

/**
 * 根据 31 题答案计算深度测试结果
 * @param answers Map<questionId, optionId | number(slider) | string[](composite optionIds)>
 */
export function computeDeepResult(answers: Map<string, string | number | string[]>): DeepTestResult {
  const totals: Record<string, number> = {};
  const allSpecies = Object.keys(speciesNameMap);
  for (const sp of allSpecies) totals[sp] = 0;

  // 按模块累计维度得分
  const moduleScores: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  const moduleCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };

  for (const q of deepTestQuestions) {
    const ans = answers.get(q.id);
    if (ans === undefined || ans === null) continue;

    if (q.type === 'choice' || q.type === 'binary') {
      const optId = ans as string;
      const opt = q.options?.find(o => o.id === optId);
      if (opt) {
        for (const [sp, sc] of Object.entries(opt.scores)) {
          totals[sp] = (totals[sp] || 0) + sc;
        }
        // 模块得分: 选项得分之和 / 理论最高(3) → 归一化
        if (q.module !== 'F') {
          const maxOpt = Math.max(...Object.values(opt.scores));
          moduleScores[q.module] += maxOpt;
          moduleCounts[q.module]++;
        }
      }
    } else if (q.type === 'slider') {
      const val = ans as number; // 0-100
      const t = val / 100;
      const low = q.sliderLowScores || {};
      const high = q.sliderHighScores || {};
      const allKeys = new Set([...Object.keys(low), ...Object.keys(high)]);
      for (const sp of allKeys) {
        const lowSc = low[sp] || 0;
        const highSc = high[sp] || 0;
        const score = lowSc * (1 - t) + highSc * t;
        totals[sp] = (totals[sp] || 0) + Math.round(score * 10) / 10;
      }
      if (q.module !== 'F') {
        moduleScores[q.module] += t > 0.5 ? 2 : 1;
        moduleCounts[q.module]++;
      }
    } else if (q.type === 'composite') {
      const optIds = ans as string[];
      for (const optId of optIds) {
        for (const step of q.steps || []) {
          const opt = step.options.find(o => o.id === optId);
          if (opt) {
            for (const [sp, sc] of Object.entries(opt.scores)) {
              totals[sp] = (totals[sp] || 0) + sc;
            }
          }
        }
      }
    }
  }

  // 排序得到主物种和副物种
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const mainSpecies = sorted[0][0];
  const subSpecies = sorted[1][0];
  const topScore = sorted[0][1];

  // 计算理论最大分数 (每个 choice 最高 3 × ~27 个 choice/binary 题 + slider ~3×4 + composite ~2×4 ≈ 100)
  const maxPossible = 100;
  const matchRate = Math.min(99, Math.round(70 + (topScore / maxPossible) * 29));

  // 5 维能力值：基于物种基础值 + 模块答题偏向
  const baseAbilities = {
    opener: 25, empathy: 25, observe: 25, topic: 25, safety: 25,
  };

  const mainAbil = _speciesAbilityHint[mainSpecies] || baseAbilities;
  const subAbil = _speciesAbilityHint[subSpecies] || baseAbilities;

  const abilities = {
    opener: Math.round(mainAbil.opener * 0.7 + subAbil.opener * 0.3),
    empathy: Math.round(mainAbil.empathy * 0.7 + subAbil.empathy * 0.3),
    observe: Math.round(mainAbil.observe * 0.7 + subAbil.observe * 0.3),
    topic: Math.round(mainAbil.topic * 0.7 + subAbil.topic * 0.3),
    safety: Math.round(mainAbil.safety * 0.7 + subAbil.safety * 0.3),
  };

  return { mainSpecies, subSpecies, matchRate, abilities, rawScores: totals };
}
