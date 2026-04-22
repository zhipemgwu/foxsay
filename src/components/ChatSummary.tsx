/**
 * 关卡总结页（ChatSummary）
 * ------------------------------------------
 * 对话结束后弹出的全屏卡片：
 *  - 结局标题（Perfect/Good/Neutral/Bad）+ NPC 告别台词
 *  - 好感度变化：起点 → 终点 + 增量数字
 *  - 4 维小雷达（心动/信任/理解/暧昧）
 *  - 3 星评分 + 总分
 *  - XP & 能力奖励（仅首通/仍在 xpGrantedTimes 配额内时）
 *  - 精彩回放（好感增量 Top3）/ 踩雷回看（好感扣分 Top2）
 *  - 再聊一次 / 下一关 两个 CTA
 * ------------------------------------------
 */
import { motion } from 'motion/react';
import { Sparkles, Heart, Star, X, RotateCcw, ArrowRight } from 'lucide-react';
import type { AffinityState } from '../services/affinity';
import { mainAffinity } from '../services/affinity';
import type { ScoringResult } from '../services/levelScore';

export interface SummaryHighlight {
  userText: string;   // 用户当时那句话
  aiReply?: string;   // AI 的回应片段
  deltaMain: number;  // 主好感增量
}

interface Props {
  open: boolean;
  levelTitle: string;
  partnerName?: string;
  partnerImg?: string;
  affinityStart: AffinityState;
  affinityEnd: AffinityState;
  scoring: ScoringResult;
  xpGranted: number;        // 0 或 正数
  abilityGained?: number;   // 能力点数，仅 3 星给
  ending: {
    title: string;
    description: string;
  };
  highlights: SummaryHighlight[];   // 最多 3 条
  regrets: SummaryHighlight[];      // 最多 2 条
  /** AI 教练点评（异步生成中为 null，失败为 ''） */
  coachReview?: {
    overall: string;       // 整体点评 1-2 句
    strengths: string[];   // 你做得好的点
    improvements: string[];// 可以提升的点
    betterLines?: string[];// 参考更好的回复示例
  } | null;
  attemptInfo?: { used: number; max: number; willGrantXPNext: boolean };
  onRetry: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function ChatSummary({
  open,
  levelTitle,
  partnerName,
  partnerImg,
  affinityStart,
  affinityEnd,
  scoring,
  xpGranted,
  abilityGained,
  ending,
  highlights,
  regrets,
  coachReview,
  attemptInfo,
  onRetry,
  onNext,
  onClose,
}: Props) {
  if (!open) return null;

  const mainStart = mainAffinity(affinityStart);
  const mainEnd = mainAffinity(affinityEnd);
  const mainDelta = mainEnd - mainStart;

  const endingColor = (() => {
    switch (scoring.ending) {
      case 'perfect': return 'linear-gradient(135deg,#FFD93D 0%,#FF8A80 100%)';
      case 'good':    return 'linear-gradient(135deg,#FF8A80 0%,#EC407A 100%)';
      case 'neutral': return 'linear-gradient(135deg,#9B7EDE 0%,#7C4DFF 100%)';
      case 'bad':     return 'linear-gradient(135deg,#607D8B 0%,#37474F 100%)';
    }
  })();

  const starEmoji = '⭐'.repeat(scoring.star) + '☆'.repeat(3 - scoring.star);

  return (
    <motion.div
      className="fixed inset-0 z-[1100] flex flex-col"
      style={{ background: 'rgba(25,18,40,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4" style={{ paddingTop: 'env(safe-area-inset-top, 44px)', height: 'calc(env(safe-area-inset-top, 44px) + 44px)' }}>
        <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: 13 }}>本局结束 · {levelTitle}</span>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}><X size={22} color="rgba(245,239,232,0.6)" /></motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32">
        {/* 结局卡 */}
        <motion.div
          className="relative overflow-hidden mb-4"
          style={{ borderRadius: 20, background: endingColor, padding: '24px 20px' }}
          initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
        >
          {partnerImg && (
            <div style={{
              position: 'absolute', right: -20, top: -10, width: 160, height: 200,
              backgroundImage: `url(${partnerImg})`, backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: 0.55, maskImage: 'linear-gradient(to left, black 30%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 30%, transparent 100%)',
              borderRadius: 16, pointerEvents: 'none',
            }} />
          )}
          <div className="relative" style={{ maxWidth: '70%' }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} color="#fff" />
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
                {scoring.ending === 'perfect' ? 'PERFECT ENDING' :
                 scoring.ending === 'good' ? 'GOOD ENDING' :
                 scoring.ending === 'neutral' ? 'NEUTRAL ENDING' : 'BAD ENDING'}
              </span>
            </div>
            <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>{ending.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 1.6 }}>{ending.description}</p>
          </div>
        </motion.div>

        {/* 好感度变化 */}
        <motion.div
          className="mb-4 p-4"
          style={{ background: '#453a60', borderRadius: 16 }}
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Heart size={14} color="#FF8A80" fill="#FF8A80" />
              <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>{partnerName || '对方'}的好感度</span>
            </div>
            <span style={{
              color: mainDelta >= 0 ? '#4ECDC4' : '#FF6B6B',
              fontSize: 14, fontWeight: 700,
            }}>
              {mainDelta >= 0 ? '+' : ''}{mainDelta}
            </span>
          </div>
          {/* 进度条 start → end */}
          <div style={{ position: 'relative', height: 10, background: 'rgba(245,239,232,0.08)', borderRadius: 5, overflow: 'hidden' }}>
            <motion.div
              style={{ position: 'absolute', left: 0, top: 0, bottom: 0, background: 'linear-gradient(90deg,#FF8A80,#EC407A)', borderRadius: 5 }}
              initial={{ width: `${mainStart}%` }}
              animate={{ width: `${mainEnd}%` }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>起点 {mainStart}</span>
            <span style={{ color: '#FF8A80', fontSize: 11, fontWeight: 600 }}>终点 {mainEnd}</span>
          </div>
        </motion.div>

        {/* 4 维雷达 */}
        <motion.div
          className="mb-4 p-4"
          style={{ background: '#453a60', borderRadius: 16 }}
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
        >
          <div className="mb-3" style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>本次表现</div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { key: 'heart', label: '心动', color: '#FF6B9D', val: affinityEnd.heart },
              { key: 'trust', label: '信任', color: '#4ECDC4', val: affinityEnd.trust },
              { key: 'mind',  label: '理解', color: '#9B7EDE', val: affinityEnd.mind },
              { key: 'spark', label: '暧昧', color: '#FFD93D', val: affinityEnd.spark },
            ].map((d, i) => (
              <motion.div key={d.key} className="text-center p-2.5" style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 10 }}
                initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>
                <div style={{ color: d.color, fontSize: 18, fontWeight: 700 }}>{d.val}</div>
                <div style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11, marginTop: 2 }}>{d.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 总分与星级 */}
        <motion.div
          className="mb-4 p-4 text-center"
          style={{ background: '#453a60', borderRadius: 16 }}
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
        >
          <div style={{ fontSize: 28, marginBottom: 4, letterSpacing: 3 }}>{starEmoji}</div>
          <div style={{ color: '#FFD93D', fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{scoring.total}<span style={{ fontSize: 14, color: 'rgba(245,239,232,0.5)' }}> 分</span></div>
          <div className="flex justify-center gap-1.5 mt-2 flex-wrap">
            {scoring.dims.map(d => (
              <span key={d.name} style={{
                padding: '3px 8px', background: 'rgba(245,239,232,0.06)', borderRadius: 6,
                color: 'rgba(245,239,232,0.75)', fontSize: 11, fontWeight: 500,
              }}>
                {d.name} {d.score}
              </span>
            ))}
          </div>
        </motion.div>

        {/* 奖励 */}
        {(xpGranted > 0 || (abilityGained ?? 0) > 0) && (
          <motion.div
            className="mb-4 p-4"
            style={{ background: 'linear-gradient(135deg,rgba(255,217,61,0.18),rgba(255,138,128,0.08))', borderRadius: 16, border: '1px solid rgba(255,217,61,0.25)' }}
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Star size={14} color="#FFD93D" fill="#FFD93D" />
              <span style={{ color: '#FFD93D', fontSize: 13, fontWeight: 700 }}>本次奖励</span>
            </div>
            <div className="flex items-center gap-3">
              {xpGranted > 0 && <span style={{ color: '#f5efe8', fontSize: 13 }}>+{xpGranted} XP</span>}
              {(abilityGained ?? 0) > 0 && <span style={{ color: '#FF8A80', fontSize: 13 }}>能力 +{abilityGained}</span>}
            </div>
          </motion.div>
        )}

        {xpGranted === 0 && attemptInfo && attemptInfo.used > 1 && (
          <div className="mb-4 p-3 text-center" style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 12 }}>
            <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: 12 }}>
              本次不计 XP（今天已获得过奖励）· 今日剩余 {Math.max(0, attemptInfo.max - attemptInfo.used)} 次练习
            </span>
          </div>
        )}

        {/* AI 教练点评 */}
        <motion.div
          className="mb-4 p-4"
          style={{ background: 'linear-gradient(135deg, #3a4560 0%, #453a60 100%)', borderRadius: 16, border: '1px solid rgba(255,217,102,0.18)' }}
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
        >
          <div className="mb-3 flex items-center gap-2" style={{ color: '#FFD966', fontSize: 13, fontWeight: 600 }}>
            <span>🦊 小狐狸教练点评</span>
          </div>
          {coachReview === null || coachReview === undefined ? (
            <div style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12.5, lineHeight: 1.6 }}>
              正在整理这场对话的复盘……
            </div>
          ) : !coachReview.overall && coachReview.strengths.length === 0 && coachReview.improvements.length === 0 ? (
            <div style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12.5 }}>
              点评生成失败，换个网络试试。
            </div>
          ) : (
            <div className="space-y-3">
              {coachReview.overall && (
                <div style={{ color: '#f5efe8', fontSize: 13, lineHeight: 1.6 }}>
                  {coachReview.overall}
                </div>
              )}
              {coachReview.strengths.length > 0 && (
                <div>
                  <div style={{ color: '#4ECDC4', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>你做得好的：</div>
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    {coachReview.strengths.map((s, i) => (
                      <li key={i} style={{ color: 'rgba(245,239,232,0.78)', fontSize: 12.5, lineHeight: 1.55, marginBottom: 2 }}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {coachReview.improvements.length > 0 && (
                <div>
                  <div style={{ color: '#FFB080', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>可以再优化：</div>
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    {coachReview.improvements.map((s, i) => (
                      <li key={i} style={{ color: 'rgba(245,239,232,0.78)', fontSize: 12.5, lineHeight: 1.55, marginBottom: 2 }}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {coachReview.betterLines && coachReview.betterLines.length > 0 && (
                <div>
                  <div style={{ color: '#B8A4E8', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>下次可以这样说：</div>
                  <div className="space-y-1.5">
                    {coachReview.betterLines.map((s, i) => (
                      <div key={i} style={{ background: 'rgba(184,164,232,0.08)', color: 'rgba(245,239,232,0.85)', fontSize: 12, lineHeight: 1.55, padding: '6px 10px', borderRadius: 8 }}>
                        "{s}"
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* 精彩回放 */}
        {highlights.length > 0 && (
          <motion.div
            className="mb-4 p-4"
            style={{ background: '#453a60', borderRadius: 16 }}
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}
          >
            <div className="mb-3" style={{ color: '#4ECDC4', fontSize: 13, fontWeight: 600 }}>✨ 精彩回放</div>
            <div className="space-y-2">
              {highlights.slice(0, 3).map((h, i) => (
                <div key={i} className="p-2.5" style={{ background: 'rgba(78,205,196,0.08)', borderRadius: 10 }}>
                  <div style={{ color: '#f5efe8', fontSize: 12, marginBottom: 3 }}>你："{h.userText}"</div>
                  {h.aiReply && <div style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11 }}>Ta：{h.aiReply}</div>}
                  <div style={{ color: '#4ECDC4', fontSize: 11, marginTop: 3 }}>+{h.deltaMain} 好感</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 踩雷回看 */}
        {regrets.length > 0 && (
          <motion.div
            className="mb-4 p-4"
            style={{ background: '#453a60', borderRadius: 16 }}
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.65 }}
          >
            <div className="mb-3" style={{ color: '#FF6B6B', fontSize: 13, fontWeight: 600 }}>⚠️ 需要改进</div>
            <div className="space-y-2">
              {regrets.slice(0, 2).map((h, i) => (
                <div key={i} className="p-2.5" style={{ background: 'rgba(255,107,107,0.08)', borderRadius: 10 }}>
                  <div style={{ color: '#f5efe8', fontSize: 12, marginBottom: 3 }}>你："{h.userText}"</div>
                  {h.aiReply && <div style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11 }}>Ta：{h.aiReply}</div>}
                  <div style={{ color: '#FF6B6B', fontSize: 11, marginTop: 3 }}>{h.deltaMain} 好感</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 底部按钮 */}
      <div className="absolute left-0 right-0 bottom-0 px-5 pb-6 pt-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 12px) + 16px)', background: 'linear-gradient(180deg, transparent, rgba(25,18,40,0.92) 30%)' }}
      >
        <div className="flex gap-3">
          <motion.button
            className="flex-1 flex items-center justify-center gap-2 py-3.5"
            style={{ background: 'rgba(245,239,232,0.08)', border: '1px solid rgba(245,239,232,0.14)', borderRadius: 14, color: '#f5efe8', fontSize: 14, fontWeight: 600 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRetry}
          >
            <RotateCcw size={14} color="#f5efe8" /> 再聊一次
          </motion.button>
          <motion.button
            className="flex-1 flex items-center justify-center gap-2 py-3.5"
            style={{ background: 'linear-gradient(135deg,#FF8A80,#EC407A)', borderRadius: 14, color: '#fff', fontSize: 14, fontWeight: 700, boxShadow: '0 6px 18px rgba(236,64,122,0.35)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
          >
            下一关 <ArrowRight size={14} color="#fff" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
