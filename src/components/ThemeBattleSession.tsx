import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronLeft, Send } from 'lucide-react';
import { CATEGORY_META, shuffle, touchStreak, type Question } from '../services/quiz';
import { type ThemeBattleChallenge } from '../data/themeBattleChallenges';
import type { QuizSessionResult } from './QuizSession';

type BattleReactionTone = 'steady' | 'attack' | 'appease' | 'avoid' | 'pressure';

interface BattleMoodState {
  trust: number;
  tension: number;
  warmth: number;
}

interface ChoiceImpact {
  trust: number;
  tension: number;
  warmth: number;
  tone: BattleReactionTone;
}

const INITIAL_BATTLE_STATE: BattleMoodState = { trust: 50, tension: 34, warmth: 46 };

interface ThemeBattleSessionProps {
  challenge: ThemeBattleChallenge;
  title: string;
  onExit: (partial?: QuizSessionResult) => void;
  onFinish: (result: QuizSessionResult) => void;
}

interface SceneChoiceRecord {
  question: Question;
  selectedIndex: number;
  correct: boolean;
  stateAfter: BattleMoodState;
  reactionTone: BattleReactionTone;
  followUp?: SceneFollowUp;
}

interface SceneFollowUp {
  context: string;
  text?: string;
  tone: BattleReactionTone;
}

const CHAT_NODE_MERGES: Record<string, string> = {
  'ambiguous-late-night-1': 'ambiguous-late-night-2',
  'emotion-tired-1': 'emotion-tired-2',
  'emotion-silent-1': 'emotion-silent-2',
  'refuse-persistent-1': 'refuse-persistent-2',
  'refuse-exit-date-1': 'refuse-exit-date-2',
  'recover-first-message-1': 'recover-first-message-2',
  'recover-past-question-1': 'recover-past-question-2',
  'love-cold-war-1': 'love-cold-war-2',
};

interface ChatProfile {
  name: string;
  status: string;
  avatar: string;
}

export function ThemeBattleSession({ challenge, onExit, onFinish }: ThemeBattleSessionProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [draftIndex, setDraftIndex] = useState(0);
  const [history, setHistory] = useState<SceneChoiceRecord[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [battleNodes, setBattleNodes] = useState<Question[]>(() => buildThemeBattleRunNodes(challenge));
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const currentScene = battleNodes[sceneIndex];
  const currentBattleState = getCurrentBattleState(history);
  const category = CATEGORY_META[challenge.category];
  const chatProfile = getChatProfile(challenge);

  useEffect(() => {
    if (finishTimerRef.current) window.clearTimeout(finishTimerRef.current);
    setBattleNodes(buildThemeBattleRunNodes(challenge));
    setSceneIndex(0);
    setDraftIndex(0);
    setHistory([]);
    setIsFinishing(false);
  }, [challenge]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [sceneIndex, history.length]);

  useEffect(() => () => {
    if (finishTimerRef.current) window.clearTimeout(finishTimerRef.current);
  }, []);

  useEffect(() => {
    setDraftIndex(0);
  }, [currentScene?.id]);

  const buildResult = (completed: boolean, records = history): QuizSessionResult => {
    const attempts = records.map(record => ({ question: record.question, correct: record.correct }));
    return {
      total: attempts.length,
      correct: attempts.filter(attempt => attempt.correct).length,
      wrong: attempts.filter(attempt => !attempt.correct).map(attempt => attempt.question),
      combo: getMaxCombo(records),
      attempts,
      completed,
      plannedTotal: battleNodes.length,
    };
  };

  const handleExit = () => {
    if (history.length > 0) {
      const confirmed = window.confirm('确定退出这个实战副本吗？已完成的剧情选择会保存；未通关整套副本不会结算能力成长。');
      if (!confirmed) return;
    }
    onExit(history.length > 0 ? buildResult(false) : undefined);
  };

  const handleChoose = (index: number) => {
    if (isFinishing || !currentScene) return;
    const option = currentScene.options?.[index];
    if (!option) return;
    const impact = getChoiceImpact(currentScene, option);
    const nextState = applyBattleImpact(currentBattleState, impact);
    const record: SceneChoiceRecord = {
      question: currentScene,
      selectedIndex: index,
      correct: option.isCorrect,
      stateAfter: nextState,
      reactionTone: impact.tone,
    };
    const nextScene = battleNodes[sceneIndex + 1];
    const followUp = nextScene ? buildSceneFollowUp(nextScene, record, history) : undefined;
    const nextHistory = [...history, followUp ? { ...record, followUp } : record];
    setHistory(nextHistory);
    touchStreak();

    if (sceneIndex + 1 >= battleNodes.length) {
      setIsFinishing(true);
      finishTimerRef.current = window.setTimeout(() => {
        onFinish(buildResult(true, nextHistory));
      }, 650);
      return;
    }

    setSceneIndex(indexValue => indexValue + 1);
    setDraftIndex(0);
  };

  const rotateDraft = (direction: number) => {
    const draftCount = currentScene.options?.length ?? 0;
    if (draftCount <= 0) return;
    setDraftIndex(index => (index + direction + draftCount) % draftCount);
  };

  if (!currentScene) return null;

  const drafts = currentScene.options || [];
  const activeDraft = drafts[draftIndex] ?? drafts[0];
  const previousRecords = history.slice(0, sceneIndex);
  const currentRecord = history.find(record => record.question.id === currentScene.id);
  const currentIncomingMessage = sceneIndex === 0 ? getBaseIncomingMessage(currentScene) : '';
  const shouldShowCurrentSceneBlock = sceneIndex === 0 || !!currentRecord;

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex flex-col"
      style={chatShellStyle}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
    >
      <div style={chatHeaderStyle}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleExit} style={headerBackStyle}>
          <ChevronLeft size={24} />
        </motion.button>
        <img src={chatProfile.avatar} alt={chatProfile.name} style={headerAvatarStyle} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={headerNameStyle}>{chatProfile.name}</div>
          <div style={headerStatusStyle}>{getBattleStateStatus(currentBattleState, chatProfile.status)}</div>
        </div>
      </div>

      <div ref={scrollRef} style={chatBodyStyle}>
        <SystemMessage text={`${CATEGORY_META[challenge.category].label} · ${challenge.title}`} />

        {previousRecords.map((record, index) => {
          const openingMessage = index === 0 ? getBaseIncomingMessage(record.question) : '';
          return (
            <div key={record.question.id} style={sceneBlockStyle}>
              {index === 0 && <SceneContext question={record.question} />}
              {openingMessage && <IncomingBubble profile={chatProfile} text={openingMessage} />}
              <OutgoingBubble text={getSelectedText(record)} />
              {record.followUp?.context && <SystemMessage text={record.followUp.context} />}
              {record.followUp?.text && <IncomingBubble profile={chatProfile} text={record.followUp.text} tone={record.followUp.tone} />}
            </div>
          );
        })}

        {shouldShowCurrentSceneBlock && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24 }}
            style={sceneBlockStyle}
          >
            {sceneIndex === 0 && <SceneContext question={currentScene} />}
            {currentIncomingMessage && <IncomingBubble profile={chatProfile} text={currentIncomingMessage} />}
            {currentRecord && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <OutgoingBubble text={getSelectedText(currentRecord)} />
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {!isFinishing && !currentRecord && (
        <div style={composerPanelStyle}>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={composerMetaStyle}>
              <span>{getComposerHint(currentBattleState)}</span>
              <div aria-hidden="true" style={draftDotsStyle}>
                {drafts.map((_, index) => (
                  <span key={index} style={draftDotStyle(index === draftIndex, category.color)} />
                ))}
              </div>
            </div>
            <div style={inputRowStyle}>
              <motion.button whileTap={{ scale: 0.94 }} onClick={() => rotateDraft(-1)} style={draftRotateButtonStyle}>
                <ChevronLeft size={20} />
              </motion.button>
              <motion.div
                key={`${currentScene.id}-${draftIndex}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                style={fakeInputStyle}
              >
                {activeDraft?.text}
              </motion.div>
              <motion.button whileTap={{ scale: 0.94 }} onClick={() => rotateDraft(1)} style={draftRotateButtonStyle}>
                <ArrowRight size={20} />
              </motion.button>
              <motion.button whileTap={{ scale: 0.94 }} onClick={() => handleChoose(draftIndex)} style={sendDraftButtonStyle(category.color)}>
                <Send size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function getCurrentBattleState(records: SceneChoiceRecord[]): BattleMoodState {
  return records[records.length - 1]?.stateAfter || INITIAL_BATTLE_STATE;
}

function applyBattleImpact(state: BattleMoodState, impact: ChoiceImpact): BattleMoodState {
  return {
    trust: clampMood(state.trust + impact.trust),
    tension: clampMood(state.tension + impact.tension),
    warmth: clampMood(state.warmth + impact.warmth),
  };
}

function clampMood(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getChoiceImpact(question: Question, option: NonNullable<Question['options']>[number]): ChoiceImpact {
  const text = `${option.text} ${option.explain || ''} ${question.prompt || ''} ${question.tags?.join(' ') || ''}`;
  if (option.isCorrect) {
    return { trust: 12, tension: -10, warmth: 8, tone: 'steady' };
  }
  if (/攻击|指责|反击|威胁|审问|逼|必须|离谱|有病|烦|冷血|残忍|不欠|随便你|爱找不找|别再/.test(text)) {
    return { trust: -12, tension: 16, warmth: -9, tone: 'attack' };
  }
  if (/讨好|过度道歉|道歉|求|证明|保证|让步|顺从|马上|现在过去|给你看|都听你|我改|补偿|借你|红包/.test(text)) {
    return { trust: -9, tension: 8, warmth: -3, tone: 'appease' };
  }
  if (/回避|沉默|假装|算了|不回|不说|没看到|早点睡|看情况|下次|随便|慢慢看|不打扰/.test(text)) {
    return { trust: -7, tension: 10, warmth: -7, tone: 'avoid' };
  }
  return { trust: -8, tension: 12, warmth: -5, tone: 'pressure' };
}

function getBattleStateStatus(state: BattleMoodState, fallback: string): string {
  if (state.tension >= 72) return '防备明显升高';
  if (state.trust <= 32) return '信任正在变低';
  if (state.trust >= 66 && state.warmth >= 56) return '愿意继续聊';
  if (state.warmth >= 62) return '情绪开始放松';
  if (state.tension <= 26) return '语气缓和中';
  return fallback;
}

function getComposerHint(state: BattleMoodState): string {
  if (state.tension >= 70) return '对方有点防备，下一句要降压';
  if (state.trust <= 34) return '先别急着推进，把话说真实';
  if (state.warmth >= 62) return '窗口打开了，轻轻推进';
  return '正在输入';
}

function buildThemeBattleRunNodes(challenge: ThemeBattleChallenge): Question[] {
  return mergeChatBattleNodes(challenge.nodes || []).map(shuffleThemeBattleOptions);
}

function mergeChatBattleNodes(nodes: Question[]): Question[] {
  const nodeById = new Map(nodes.map(question => [question.id, question]));
  const consumedIds = new Set<string>();
  const mergedNodes: Question[] = [];

  for (const question of nodes) {
    if (consumedIds.has(question.id)) continue;
    const replyNodeId = CHAT_NODE_MERGES[question.id];
    const replyNode = replyNodeId ? nodeById.get(replyNodeId) : undefined;
    if (replyNode) {
      consumedIds.add(replyNode.id);
      mergedNodes.push({
        ...question,
        prompt: replyNode.prompt,
        options: replyNode.options,
        overallExplain: replyNode.overallExplain,
        tags: Array.from(new Set([...(question.tags || []), ...(replyNode.tags || [])])),
      });
      continue;
    }
    mergedNodes.push(question);
  }
  return mergedNodes;
}

function shuffleThemeBattleOptions(question: Question): Question {
  return {
    ...question,
    options: question.options ? shuffle(question.options) : question.options,
  };
}

function SceneContext({ question }: { question: Question }) {
  const context = getSceneContext(question);
  if (!context) return null;
  return <SystemMessage text={context} />;
}

function IncomingBubble({ profile, text, tone = 'steady' }: { profile: ChatProfile; text: string; tone?: BattleReactionTone }) {
  return (
    <div style={incomingRowStyle}>
      <img src={profile.avatar} alt={profile.name} style={messageAvatarStyle} />
      <div style={{ display: 'grid', gap: 4, maxWidth: '78%' }}>
        <div style={messageNameStyle}>{profile.name}</div>
        <div style={incomingBubbleStyle(tone)}>{text}</div>
      </div>
    </div>
  );
}

function OutgoingBubble({ text }: { text: string }) {
  return (
    <div style={outgoingRowStyle}>
      <div style={outgoingBubbleStyle}>{text}</div>
      <img src={USER_AVATAR} alt="我" style={messageAvatarStyle} />
    </div>
  );
}

function SystemMessage({ text, compact = false, tone = 'normal' }: { text: string; compact?: boolean; tone?: 'normal' | 'good' | 'warn' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={systemMessageStyle(compact, tone)}>{text}</div>
    </div>
  );
}

function getMaxCombo(records: SceneChoiceRecord[]): number {
  let currentCombo = 0;
  let maxCombo = 0;
  for (const record of records) {
    currentCombo = record.correct ? currentCombo + 1 : 0;
    maxCombo = Math.max(maxCombo, currentCombo);
  }
  return maxCombo;
}

function getSelectedText(record: SceneChoiceRecord): string {
  return record.question.options?.[record.selectedIndex]?.text || '';
}

function buildSceneFollowUp(nextQuestion: Question, record: SceneChoiceRecord, previousRecords: SceneChoiceRecord[]): SceneFollowUp | undefined {
  const previousReplyText = previousRecords[previousRecords.length - 1]?.followUp?.text || '';
  const text = getIncomingMessage(nextQuestion, record, previousReplyText);
  const context = getSceneContext(nextQuestion);
  if (!text && !context) return undefined;
  return {
    context,
    text,
    tone: record.reactionTone,
  };
}

function getIncomingMessage(question: Question, previousRecord?: SceneChoiceRecord, previousReplyText = ''): string {
  const baseMessage = getBaseIncomingMessage(question);
  if (!previousRecord) return baseMessage;
  return avoidRepeatedIncoming(getSpecificIncomingBranch(question, previousRecord) || baseMessage, previousReplyText);
}

function getBaseIncomingMessage(question: Question): string {
  const scenario = question.scenario || '';
  const quotedMessages = Array.from(scenario.matchAll(/“([^”]+)”/g));
  const latestQuotedMessage = quotedMessages[quotedMessages.length - 1]?.[1];
  if (latestQuotedMessage) return latestQuotedMessage;
  return '';
}

function getSpecificIncomingBranch(currentQuestion: Question, previousRecord: SceneChoiceRecord): string {
  const selectedText = getSelectedText(previousRecord);

  if (currentQuestion.id === 'ambiguous-late-night-3') {
    if (/想我了/.test(selectedText)) return '没有啦，就是突然睡不着。';
    if (/这么晚找我干嘛|不在/.test(selectedText)) return '也没什么，就是突然睡不着。你不用这么防备。';
  }

  if (currentQuestion.id === 'redflag-isolation-4') {
    if (/当然你更重要/.test(selectedText)) return '那你就证明一下，以后少跟他们出去，这样我才知道你真的把我放第一。';
    if (/朋友更重要/.test(selectedText)) return '所以在你心里朋友就是比我重要，对吗？';
    if (/看情况/.test(selectedText)) return '你看，你连一句明确的话都不愿意给我。';
  }
  return '';
}

function avoidRepeatedIncoming(text: string, previousReplyText: string): string {
  if (!text || text !== previousReplyText) return text;
  return '';
}

function getSceneContext(question: Question): string {
  const override = SCENE_CONTEXT_OVERRIDES[question.id];
  if (override) return override;

  const scenario = question.scenario || '';
  if (!scenario) return '';
  const quoteIndex = scenario.lastIndexOf('“');
  const rawContext = quoteIndex < 0 ? scenario : scenario.slice(0, quoteIndex).replace(/“[^”]+”/g, '');
  const context = polishSceneContext(rawContext);
  if (!context || /^(对方|她|他)(继续|追问|回|说)?$/.test(context)) return '';
  return context;
}

function polishSceneContext(rawContext: string): string {
  const context = rawContext
    .replace(/你发[：:]?/g, '')
    .replace(/(对方|她|他)?\s*(回|回复|说)[：:]?$/, '')
    .replace(/[：:]?$/, '')
    .replace(/说$/, '')
    .replace(/对方$/, '')
    .replace(/她$/, '')
    .replace(/他$/, '')
    .trim();

  if (!context) return '';
  if (/^(你准备|你决定|你想|你问|第一步|先判断|最重要|这时|面对|下一步|最后|收束)/.test(context)) return '';
  if (/气氛|空气|正确|错误|风险|判断|更稳|最稳|最合适|最不该|最重要/.test(context)) return '';
  return context.replace(/[。.]$/, '');
}

function getChatProfile(challenge: ThemeBattleChallenge): ChatProfile {
  const profiles: Record<string, ChatProfile> = {
    'anti-pua': { name: '林澈', status: '边界正在被试探', avatar: '/avatars/face3.png' },
    icebreak: { name: '夏柚', status: '刚刚在线', avatar: '/avatars/face1.jpg' },
    ambiguous: { name: '晚晚', status: '正在输入中', avatar: '/avatars/face2.png' },
    love: { name: '夏柚', status: '情绪还没完全落下', avatar: '/avatars/yushui.jpg' },
    redflag: { name: '周然', status: '关系信号复杂', avatar: '/avatars/face4.png' },
    'emotion-catch': { name: '小鹿', status: '低电量模式', avatar: '/avatars/face5.webp' },
    refuse: { name: '顾言', status: '持续发来消息', avatar: '/avatars/face6.png' },
    recover: { name: '前任', status: '回应窗口很小', avatar: '/avatars/avatar6.jpg' },
  };
  return profiles[challenge.category] || { name: '对方', status: challenge.focus, avatar: '/avatars/avatar1.png' };
}

const USER_AVATAR = '/avatars/avatar1.png';

const SCENE_CONTEXT_OVERRIDES: Record<string, string> = {
  'anti-phone-boundary-4': '他盯着手机沉默了一会儿，语气没那么冲了',
  'anti-guilt-trip-4': '他停了几秒，像是终于把委屈说出口',
  'icebreak-first-meet-4': '她笑了一下，指尖还停在杯沿上',
  'icebreak-cold-reply-2': '屏幕安静了几秒，你删掉刚才那句，重新打字',
  'ambiguous-hot-cold-4': '聊天框亮着，你看着她那句试探停了一会儿',
  'love-late-birthday-4': '回去的路上，她靠着车窗，声音比刚才轻了',
  'emotion-tired-2': '她那条消息停在屏幕上，后面再没有新的字',
  'emotion-silent-2': '她把话收了回去，聊天框里只剩一阵沉默',
  'recover-first-message-2': '你在输入框里停了很久，删掉了那段长消息',
  'recover-past-question-2': '她的质疑停在屏幕上，你没有立刻解释',
};

const chatShellStyle: CSSProperties = {
  backgroundColor: '#ededed',
  backgroundImage: 'linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)',
  backgroundSize: '28px 28px',
  color: '#203027',
};

const chatHeaderStyle: CSSProperties = {
  position: 'relative',
  zIndex: 3,
  minHeight: 76,
  padding: 'calc(8px + env(safe-area-inset-top, 24px)) 14px 10px',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  background: 'rgba(245,247,243,0.92)',
  borderBottom: '1px solid rgba(70,82,72,0.14)',
  boxShadow: '0 4px 18px rgba(70,82,72,0.12)',
  backdropFilter: 'blur(16px)',
};

const headerBackStyle: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 12,
  border: 'none',
  background: 'rgba(57,70,62,0.08)',
  color: '#203027',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const headerAvatarStyle: CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 14,
  objectFit: 'cover',
  border: '1px solid rgba(57,70,62,0.12)',
};

const headerNameStyle: CSSProperties = {
  fontSize: 16,
  lineHeight: 1.2,
  fontWeight: 900,
  color: '#1f2a24',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const headerStatusStyle: CSSProperties = {
  marginTop: 3,
  fontSize: 11,
  fontWeight: 700,
  color: 'rgba(31,42,36,0.54)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const chatBodyStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '14px 14px 148px',
  WebkitOverflowScrolling: 'touch',
};

const sceneBlockStyle: CSSProperties = {
  display: 'grid',
  gap: 10,
  marginTop: 12,
};

const incomingRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 9,
};

const outgoingRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  gap: 9,
};

const messageAvatarStyle: CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 11,
  objectFit: 'cover',
  boxShadow: '0 4px 10px rgba(57,70,62,0.14)',
};

const messageNameStyle: CSSProperties = {
  paddingLeft: 2,
  fontSize: 10,
  color: 'rgba(31,42,36,0.5)',
  fontWeight: 800,
};

const incomingBubbleStyle = (tone: BattleReactionTone): CSSProperties => ({
  borderRadius: '5px 18px 18px 18px',
  padding: '10px 12px',
  background: tone === 'steady' ? '#fff' : tone === 'attack' ? '#fff1ed' : tone === 'appease' ? '#fff8e6' : '#f7f5f1',
  color: '#1f2a24',
  fontSize: 14,
  lineHeight: 1.65,
  border: tone === 'steady' ? 'none' : tone === 'attack' ? '1px solid rgba(184,84,64,0.16)' : '1px solid rgba(176,131,61,0.14)',
  boxShadow: '0 8px 18px rgba(57,70,62,0.12)',
});

const outgoingBubbleStyle: CSSProperties = {
  maxWidth: '78%',
  borderRadius: '18px 5px 18px 18px',
  padding: '10px 12px',
  background: '#95ec69',
  color: '#162015',
  fontSize: 14,
  lineHeight: 1.65,
  fontWeight: 750,
  boxShadow: '0 8px 18px rgba(57,70,62,0.14)',
};

const systemMessageStyle = (compact: boolean, tone: 'normal' | 'good' | 'warn'): CSSProperties => ({
  maxWidth: '86%',
  padding: compact ? '4px 9px' : '6px 10px',
  borderRadius: 999,
  background: tone === 'good' ? 'rgba(65,138,108,0.13)' : tone === 'warn' ? 'rgba(176,103,63,0.14)' : 'rgba(57,70,62,0.1)',
  color: tone === 'good' ? '#256447' : tone === 'warn' ? '#8b4c26' : 'rgba(31,42,36,0.58)',
  fontSize: compact ? 10 : 11,
  lineHeight: 1.45,
  fontWeight: 800,
  textAlign: 'center',
});

const composerPanelStyle: CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  padding: '9px 12px calc(10px + env(safe-area-inset-bottom, 0px))',
  background: 'rgba(245,247,243,0.96)',
  borderTop: '1px solid rgba(70,82,72,0.14)',
  boxShadow: '0 -8px 24px rgba(57,70,62,0.14)',
  backdropFilter: 'blur(18px)',
};

const composerMetaStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 2px',
  color: 'rgba(31,42,36,0.5)',
  fontSize: 11,
  fontWeight: 900,
};

const draftDotsStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
};

const draftDotStyle = (active: boolean, color: string): CSSProperties => ({
  width: active ? 14 : 5,
  height: 5,
  borderRadius: 999,
  background: active ? color : 'rgba(31,42,36,0.22)',
  transition: 'all 160ms ease',
});

const inputRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '38px 1fr 38px 44px',
  alignItems: 'stretch',
  gap: 8,
};

const draftRotateButtonStyle: CSSProperties = {
  minHeight: 52,
  borderRadius: 14,
  border: 'none',
  background: 'rgba(57,70,62,0.08)',
  color: '#203027',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const fakeInputStyle: CSSProperties = {
  minHeight: 50,
  borderRadius: 18,
  padding: '10px 13px',
  display: 'flex',
  alignItems: 'center',
  background: '#fff',
  border: '1px solid rgba(57,70,62,0.12)',
  color: '#1f2a24',
  fontSize: 13,
  lineHeight: 1.55,
  fontWeight: 750,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
};

const sendDraftButtonStyle = (color: string): CSSProperties => ({
  minHeight: 50,
  borderRadius: 16,
  border: 'none',
  cursor: 'pointer',
  background: `linear-gradient(135deg, ${color}, #7fd7bf)`,
  color: '#10231d',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 18px rgba(57,70,62,0.16)',
});

