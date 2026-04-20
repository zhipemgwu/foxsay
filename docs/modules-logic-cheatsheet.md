# FoxSay · 前端核心模块逻辑速查手册

> 面向开发：每个模块给出**模块定位 → 触发规则/条件 → 数据源 → 示例文案/输出 → 关键代码位置**。
> 格式参考 DiagnosticStream 推送逻辑表：一眼能看懂"什么时候做什么，读的是哪份数据"。
> 本手册只覆盖前端已实现部分；系统性业务契约见 `docs/system-logic-v1.md`。

---

## 1. 今日洞察推送（DiagnosticStream）

**模块定位**：首页顶部"今日洞察流"，每天根据用户状态动态生成 3–5 条短洞察卡片，用途是**拉回日活 + 指路下一步**。

**规则**：6 条规则按优先级动态命中，最多保留 5 条：

| 优先级 | 规则 | 触发条件 | 数据源 |
|:-:|---|---|---|
| 100 | 未 check-in 提醒 | 今天还没做 check-in | `localStorage.foxsay_checkin_done_{today}` |
| 80 | 能力弱项建议 | 最低能力分 < 40 | `user.abilityScores` |
| 75 | 趋势下降警示 | 最近两次对比某维 ≥5 分跌幅 | `localStorage.foxsay_heatup_history` |
| 75 | 2 天倒数 | `streak === 2` | `user.streak` |
| 70 | streak 里程碑倒计时 | 距 7/14/30 天节点 | `user.streak` |
| 65 | 趋势上升表扬 | 最近两次对比某维 ≥5 分涨幅 | `localStorage.foxsay_heatup_history` |
| 60 | 能力强项肯定 | 最高能力分 ≥ 70 | `user.abilityScores` |
| 55 | 任务即将完成 | 剩 ≤2 项 | `localStorage.foxsay_tasks_{today}` |
| 50 | 任务全部完成 | `done === total` | `localStorage.foxsay_tasks_{today}` |
| 40 | 物种话术 | 有 `speciesName` | `user.speciesName` |
| 10 | 兜底 3 条新手引导 | 以上全部没命中 | — |

**实时性**：
- 监听 `foxsay_checkin_done` 事件（check-in 弹窗发过来）→ 立即刷新
- 监听 `storage` 事件（其他标签页改数据）→ 刷新
- 30 秒兜底轮询 → 勾任务后也能感知

**代码位置**：`src/components/DiagnosticStream.tsx`

---

## 2. Check-in 今日打卡（独立于今日任务）

**模块定位**：首页入口弹出的 5 题心情问答，**和今日任务解耦**，单独作为一道"每日签到"。

| 字段 | 值 |
|---|---|
| 触发 | 点击首页顶部"check-in"按钮 |
| 存储 Key | `localStorage.foxsay_checkin_done_{YYYY-MM-DD}` = `"1"` |
| 完成信号 | `window.dispatchEvent(new Event('foxsay_checkin_done'))` |
| 消费方 | DiagnosticStream 监听此事件刷新；其他模块不依赖 |
| 跨模块影响 | **无** — 不增加 XP、不计入 streak、不计入任务进度 |

**代码位置**：`src/components/TodayTaskList.tsx`（已去除 check-in 包装卡）、`src/components/CheckinModal.tsx`

---

## 3. Onboarding 登录 & 首次引导合流

**模块定位**：把原三屏引导 + 欢迎页 + 性别/年龄/目标表单，压缩成"**两屏 → 登录 → AI 开场聊 4 轮同时收集画像**"。

| 阶段 | 操作 | 收集字段 | 实现 |
|---|---|---|---|
| 欢迎 | 2 张轮播卡 | — | `OnboardingScreen.tsx`（原 3 张合并 2 张） |
| 登录 | 点"开启恋爱之旅" → 手机号登录 | phone | `AuthScreen.tsx` |
| AI 聊天 p1 | AI 问性别 | `profile.gender` | `onboardingChat.ts` turn `p1_gender` |
| AI 聊天 p2 | AI 问年龄段 | `profile.ageRange` | turn `p2_age` |
| AI 聊天 p3 | AI 问想提升什么 | `profile.goals[]` | turn `p3_goal` |
| AI 聊天 q1-q4 | 物种测试 4 道 | `speciesName` | turn `q1..q4` |
| 回调 | `onFinish(result)` | `extractProfile(result.answers)` 统一抽字段 | — |

**选项条固定高度**：`minHeight: 268px`，防止选项数变化时 UI 上下抖动。

**代码位置**：`src/components/OnboardingScreen.tsx`、`AuthScreen.tsx`、`OnboardingChat.tsx`、`src/data/onboardingChat.ts`

---

## 4. 搭档系统（Partner） & 角色卡绑定

**模块定位**：剧情关卡沉浸页里"5 个候选搭档"的人设、立绘、聊天性格——**直接读取 `data/role-cards.json` 的 R001–R030 角色卡**，展示层与聊天 prompt 层共用同一份数据。

| 环节 | 逻辑 | 数据源 |
|---|---|---|
| 候选池生成 | 按 `levelId` 哈希从 30 个 KID 稳定抽 5 个不重复 | `getAllRoleKids()` |
| 立绘映射 | `R001 → /chapters/roles/role-01.jpg`（补零到 2 位） | `getRoleImage(kid)` |
| 卡片展示字段 | `name / age / signature / traits[3]`  | `roleCardToPartnerInfo(kid)`：`core.name / core.age / core.one_line_summary / personality.surface_traits+core_traits` 前 3 条 |
| 锁定选择 | 用户在沉浸页左右滑 + "确认搭档" | `levelPartners[lv.id] = partner`（含 kid） |
| 进入聊天 | `startChat(dialogueKey, title, partner)` | partner 带 kid 进入 `chatPartner` state |
| system prompt 注入 | 有 kid → 用完整角色卡；无 kid → 回退简版标签 | `buildRolePersonaPrompt(kid)` |

**完整人设包含字段**（`buildRolePersonaPrompt` 拍平到 prompt）：
```
core: name/age/gender/identities/one_line_summary
personality: core_traits/surface_traits/inner_traits/temperament/biggest_fear/biggest_desire
communication: speak_style/phrases(前4)/reply_speed
attachment_style: type/description
love_language: receiving
ai_instruction: do(前5)/dont(前5)
```

**代码位置**：`src/services/roleCards.ts`（新建）、`src/data/role-cards.json`（新建，同步自 `data/role-cards.json`）、`src/components/PracticePage.tsx` 中 `getPartnerCandidates / sendMessage`、`src/components/ChapterImmersiveView.tsx`（`PartnerInfo.kid?`）

---

## 5. AI 聊天（DeepSeek 流式）

**模块定位**：PracticePage 关卡对话、恋爱急诊室、onboarding 开场白的底层统一接入点。

| 项 | 配置 |
|---|---|
| 模型 | `deepseek-reasoner` |
| 传输 | SSE 流式 |
| 前端入口 | `chatStream(messages, onChunk, onDone, onError): AbortController` |
| 后端路由 | `POST /api/chat`（vite 代理到 `localhost:3001`） |
| 鉴权 | `.env.DEEPSEEK_API_KEY`（35 字符，仅 server 端读） |
| 超时/取消 | `abortRef.current.abort()` 在发下一条时自动打断旧流 |

**System Prompt 组装顺序**（PracticePage `sendMessage`）：
1. `你正在和用户进行恋爱场景的角色扮演。场景：${chatTitle}`
2. `背景：${sceneHint}`（取当前 messages 里的 system 消息）
3. **搭档人设段**（优先 `buildRolePersonaPrompt(kid)`，无 kid 回退简版）
4. **对话硬性规则 5 条**：
   - 你是真人聊天，不是剧本演员
   - 禁止 `（）【】` 包裹的动作/表情描写（例："（稍显犹豫但保持微笑）"一律不允）
   - 禁止"评分/分/提示/建议/你可以..."等上帝视角
   - 第一人称，像微信对话，每次 1–3 句
   - Emoji/语气词可以，但不写 `(笑)`

**兜底过滤**：流结束后 `stripRolePlayMarkers(text)` 再扫一次括号旁白，关键词包含 "微笑/皱眉/叹气/低头/眨眼/神情..." 等命中即删除。

**代码位置**：`src/services/ai.ts`、`src/components/PracticePage.tsx` (`sendMessage`)、`server.cjs`

---

## 6. 今日推荐 & 今日精选体验（两入口同逻辑）

**模块定位**：主动把用户导到具体的某一关（精确到第几章第几节），而不是丢到关卡大列表。

| 入口 | 位置 | 数据源 | 点击行为 |
|---|---|---|---|
| 首页"今日推荐" | `TodayScene.tsx` | `storyLevelPool + encounterLevelPool`，按 `dayOfYear % N` 选 1 剧情 + 1 邂逅 | `onPracticeAction({ type:'openLevel', mode, chapterId, levelIndex })` → App 转发 → PracticePage 打开沉浸页 |
| 练习页"今日精选体验" | `PracticePage.tsx` L767+ | `_storyLevels.find(l => !l.completed && !l.vip) ?? _storyLevels[0]` | `setLevelImmersive({ chapterId: todayRecommend.chapter, index: todayRecommend.idxInChapter })` → 同一个沉浸页 |

**关卡一致性保证**：卡片展示用 `todayRecommend` 对象，跳转后沉浸页按 `chapterId + idxInChapter` 定位**同一个 level**，封面/标题/搭档池完全一致，不会出现"卡片显示 A 进去变 B"。

**代码位置**：`src/components/TodayScene.tsx`、`src/components/PracticePage.tsx` (§2 今日精选体验 & `ChapterImmersiveView` 调用)

---

## 7. 沉浸页（ChapterImmersiveView）

**模块定位**：全屏卡片式关卡预览，**唯一**的关卡开始入口（由 §6 两处 & 关卡列表点击 3 处触发）。

| 组件能力 | 说明 |
|---|---|
| 左右滑切关卡 | 同章 6 关循环 |
| 下滑关闭 | PanInfo 手势 |
| 搭档选择器（可选） | `enablePartnerPicker={true}`，左右滑 5 个候选 |
| "切换搭档" 按钮 | 显式切换，右上角 Shuffle icon |
| 确认搭档回调 | `onConfirmPartner(chapterId, partner)` → PracticePage `setLevelPartners` |
| "开始这一关" CTA | `onStart(levelId)` → `startChat(id, title, levelPartners[id])` |
| VIP 关卡 | 覆盖锁 icon，CTA 变"升级解锁"，点击触发 `onOpenVIP` |
| 柔光入场 | `entranceEffect={true}` 从推荐入口进入时触发 |

**代码位置**：`src/components/ChapterImmersiveView.tsx`

---

## 8. 聊天消息结构 & UI

**模块定位**：PracticePage AI 对话页消息流。

| 角色 | 渲染 | 作用 |
|---|---|---|
| `system` | 顶部灰底场景卡 | 场景背景（仅显示，不进 API 的 messages） |
| `user` | 右侧气泡 | 玩家发言 |
| `ai` | 左侧气泡 + 头像 | NPC 回复，空字符串时显示打字指示器 |

**流处理**：每个 chunk 追加到最后一条 `role:'ai'` 消息的 text；onDone 时做一次 `stripRolePlayMarkers` 兜底。

**取消策略**：用户连点发送时，`abortRef.current?.abort()` 立刻打断旧流，新流接管最后的空 AI 消息。

---

## 9. 数据持久化一览

全部使用 `localStorage`（前端无登录态前提下的临时方案，后端接入后迁移到 API）。

| Key | 写入 | 读取 | 含义 |
|---|---|---|---|
| `foxsay_checkin_done_{YYYY-MM-DD}` | CheckinModal 完成时 | DiagnosticStream | 今日已 check-in |
| `foxsay_tasks_{YYYY-MM-DD}` | TodayTaskList 勾选 | DiagnosticStream、Profile | 任务进度 `{done,total,items}` |
| `foxsay_heatup_history` | HeatUpCard 提交时 | DiagnosticStream | 最近 N 次能力快照，做趋势对比 |
| `foxsay_user_profile` | Onboarding 完成 / Profile 修改 | 所有模块 | 用户画像（gender/age/goals/species） |
| `foxsay_streak` | Check-in/任务完成时 | Header、DiagnosticStream | 连续天数 |
| `foxsay_level_partners` *(待接入)* | ChapterImmersiveView 确认搭档 | PracticePage | 各关锁定的搭档 kid |

---

## 10. 新手 → 沉浸页 → 开始一关 · 完整闭环

```
OnboardingScreen (2 slides)
      ↓
AuthScreen (phone login)
      ↓
OnboardingChat (p1/p2/p3 画像 + q1-q4 物种)
      ↓  onFinish → extractProfile
UserContext.profile 写入
      ↓
HomePage
 ├─ DiagnosticStream（6 规则命中 5 条）
 ├─ TodayScene（今日推荐 2 张关卡卡） ──┐
 └─ TodayTaskList（3 道任务）         │
                                      ↓ onPracticeAction({openLevel})
                              PracticePage
                               ├─ 今日精选体验（点击 = 同一个沉浸页）
                               └─ 关卡列表
                                      ↓ setLevelImmersive
                              ChapterImmersiveView
                               ├─ 左右滑 6 关
                               ├─ 选 5 个候选搭档（R001–R030）
                               └─ "开始这一关" → onStart(levelId)
                                      ↓
                          startChat(id, title, partner{kid})
                                      ↓
                          sendMessage → buildRolePersonaPrompt(kid)
                                      ↓
                          chatStream → DeepSeek /api/chat
                                      ↓
                          onDone → stripRolePlayMarkers 兜底过滤括号旁白
```

---

## 11. 关键文件索引

| 路径 | 作用 |
|---|---|
| `src/services/ai.ts` | DeepSeek 流式封装 |
| `src/services/roleCards.ts` | 角色卡 R001–R030 访问层 + prompt 构造 |
| `src/data/role-cards.json` | 30 张角色卡（与 `data/role-cards.json` 同步） |
| `src/components/DiagnosticStream.tsx` | 今日洞察规则引擎 |
| `src/components/TodayScene.tsx` | 首页今日推荐 |
| `src/components/TodayTaskList.tsx` | 今日任务（已与 check-in 解耦） |
| `src/components/PracticePage.tsx` | 练习中心主页 |
| `src/components/ChapterImmersiveView.tsx` | 关卡沉浸式预览 + 搭档选择 |
| `src/components/OnboardingScreen.tsx` | 2 屏引导 |
| `src/components/AuthScreen.tsx` | 登录 |
| `src/components/OnboardingChat.tsx` | 首次 AI 问答（画像 + 物种测试） |
| `data/role-cards.json` | 角色卡源（server/数据工具用） |
| `data/level-cards.json` | 关卡卡源 |
| `data-loader.cjs` | server 端数据装载 + prompt 拼装 |
| `server.cjs` | DeepSeek 代理（port 3001） |

---

## 12. 实时刷新事件表

| 事件名 | 发送方 | 接收方 | 作用 |
|---|---|---|---|
| `foxsay_checkin_done` | CheckinModal | DiagnosticStream | 立即刷掉"未 check-in"洞察 |
| `foxsay_task_done` *(可选)* | TodayTaskList | DiagnosticStream | 勾任务后 0 延迟更新 |
| `storage` | 浏览器原生 | DiagnosticStream、Header | 跨 Tab 同步 |

---

_最近一次更新：2026-04-20_
_维护：配合 `system-logic-v1.md`（偏业务契约）一起阅读；本文档偏"代码在哪、数据在哪、规则在哪"。_


---

## 13. AI 聊天五件套（2026-04 新增）

关卡聊天从"自由练习"升级为带数值、阶段、结局、奖励的正式副本。

### 13.1 总览

```
startChat(levelKid,mode)
                                          免费 5 次/关/日；仅第1次给 XP
[beginAttempt]  attemptLimit.ts     Pro 10 次，前 2 次给 XP
                                          Pro+ 20 次，前 3 次给 XP
[initAffinity]  affinity.ts   story: 每关重置 40/40/40/40
                                 challenge: 按 partner.kid 累积（localStorage）
[buildLevelScenePrompt]  levelCards.ts  注入 world/scene/story_node/NPC/player_role
   
  每轮：system 追加 4 维好感 + 轮次阶段(opening/developing/climax/closing)
       + 要求输出 <meta>{"deltas":{...},"mood":"","inner_os":"","suggest_end":false}</meta>
   
[parseChatMeta]  chatMeta.ts  从流里剥 meta，正文展示，JSON 解析 deltas
   
[applyDelta]    更新 4 维  主好感 (心动+暧昧)/2*0.6 + (信任+理解)/2*0.4
   
  结束触发：turnsUsedmax_turns / 主好感<20 且>4轮 / suggest_end 且min_turns_for_good
   
[scoreLevel]  levelScore.ts  AI主观0.6 + 硬规则0.4  total/star/ending
   
ChatSummary 弹层  retry/next
```

### 13.2 文件索引

| 文件 | 角色 |
|---|---|
| [src/data/level-cards.json](../src/data/level-cards.json) | 30 关完整配置（dialogue/scoring/endings/world/scene） |
| [src/services/levelCards.ts](../src/services/levelCards.ts) | 关卡卡访问层；`buildLevelScenePrompt` 扁平化 system 文本 |
| [src/services/affinity.ts](../src/services/affinity.ts) | 4 维 State + 主好感公式 + storage（challenge 累积） |
| [src/services/chatMeta.ts](../src/services/chatMeta.ts) | `<meta></meta>` JSON 尾解析 + 流中片段剥离 |
| [src/services/attemptLimit.ts](../src/services/attemptLimit.ts) | 每日每关次数 + XP 发放次数（按 VipTier） |
| [src/services/levelScore.ts](../src/services/levelScore.ts) | 三星评分 + 结局判定 + XP 奖励表 |
| [src/components/ChatSummary.tsx](../src/components/ChatSummary.tsx) | 结束弹层（好感曲线+4维+星级+回放+奖励+CTA） |
| [src/components/PracticePage.tsx](../src/components/PracticePage.tsx) | `startChat/sendMessage/finalizeChat` 串联 |

### 13.3 关键决策

| 议题 | 决策 |
|---|---|
| 轮数来源 | 直接读 `level-cards.json` 的 `dialogue.max_turns` / `min_turns_for_good_ending` |
| 好感度重置 | 剧情每关重置；人物邂逅按 `partner.kid` 累积到 localStorage |
| 内心 OS | 默认关；**仅 Pro+ 能开**（VIP/Pro 也看不到） |
| 次数 | 免费 5/关/日，仅第 1 次给 XP；Pro 10/2；Pro+ 20/3 |
| 结构化输出 | JSON tail（不是 function calling）；`<meta>{...}</meta>` |

### 13.4 存储 Key 追加

| Key | 含义 |
|---|---|
| `foxsay_affinity_by_kid` | `{[kid]: {heart,trust,mind,spark,updated_at}}` 累积好感 |
| `foxsay_attempts_{levelKid}_{YYYY-MM-DD}` | `{tries, xp_granted}` 当日尝试计数 |

### 13.5 AI system prompt 硬规则（摘要）

1. 你是真人聊天，严禁括号动作/表情旁白。
2. 严禁"评分/提示/建议/你可以..."上帝视角。
3. 每次回复 1-3 句，微信口语化。
4. 必须在正文后追加 `<meta>` JSON：`deltas`(4 维 -10~+10 整数)、`mood`、`inner_os`、`suggest_end`。
5. 根据 **当前好感度** 调整态度（高则亲昵、低则冷淡/抽离）。
