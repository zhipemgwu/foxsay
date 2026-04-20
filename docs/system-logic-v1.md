# FoxSay 一站式恋爱宝典 · 系统逻辑文档 v1.0

> 文档目的：面向后端开发对齐前端现状、补齐业务逻辑、统一数据模型与 API 契约。
> 编写依据：`c:\FoxSay\src` 当前源码实现 + 头部产品（探探 / Keep / 薄荷阅读 / Duolingo / 多邻国语言 / 网易云音乐等级体系 / B 站大会员）的成熟设计模式。
> 规则约定：① 每一节都遵循「模块定位 → 数据模型 → 交互流程 → 业务规则 → 后端接口建议」五段；② 所有数值都是初版建议，可 A/B；③ 前端当前很多是硬编码 mock，文档标注 `[需后端返回]` 的字段必须由接口驱动。

---

## 0. 通用约定

### 0.1 术语

| 名词 | 含义 |
|---|---|
| 恋商 EQ（EQScore） | 用户在情感能力方面的综合分数，0-100 |
| 5 维能力 | 开场白 / 共情力 / 观察力 / 话题力 / 安全感 |
| 关卡 Level | 训练关（剧情关 + 挑战关 + AI 对话关）的最小单元 |
| 章节 Chapter | 若干关卡的集合，有封面和剧情线 |
| XP | 经验值，用于计算等级与徽章 |
| Level（等级）| 玩家等级，10 档头衔 |
| 徽章 Badge | 赛季成就标识，社区可见，不随赛季清零，但需赛季内完成指定任务才能获得 |
| 赛季 Season | 30 天一个赛季，每月 1 日凌晨 4 点刷新 |
| PRO / 会员 | 付费订阅用户，权益在 §2 定义 |

### 0.2 时间 & 时区
- 所有日期字段一律 UTC+8，存 ISO8601 字符串；今日判定以 `Asia/Shanghai` 00:00 为界。
- 今日状态 key 统一为 `YYYY-MM-DD`。

### 0.3 前后端数据契约基本原则
1. 前端现在硬编码的任何 **数字 / 文案 / 图片 / 标签** 都视为可被后端覆盖，以接口为准；接口无数据时 fallback 到内置默认，不得白屏。
2. 所有列表接口必须分页（page/size, 默认 size=20）。
3. 所有写操作必须幂等（带 client_request_id），前端会在弱网下自动重试。
4. 时间比较统一用服务端时间，客户端时间只作 UX。

---

## 1. 核心数据模型

### 1.1 User（用户）
```
{
  "user_id": "u_xxxxxxxx",        // 唯一 ID
  "name": "小鹿",
  "avatar_url": "...",
  "avatar_frame_id": "default",   // default/flame/ocean/golden/rainbow/sakura
  "skin_id": "classic",           // 主题皮肤
  "species_id": "laosihu",        // 恋爱物种 §5.6
  "level": 12,
  "title": "恋爱学徒",             // 等级对应头衔
  "xp": 340,
  "xp_total_season": 340,         // 本赛季 XP（徽章依据）
  "xp_total_all": 15240,          // 终身 XP（等级依据）
  "streak_days": 23,
  "last_checkin_date": "2026-04-16",
  "eq_score": 82,
  "eq_dims": {                    // 5 维
    "opener": 85, "empathy": 92, "observe": 78, "topic": 88, "safety": 70
  },
  "followers": 128,
  "following": 56,
  "profile_views": 259,
  "is_vip": true,
  "sub_plan": "year",             // monthly/quarter/year/lifetime
  "sub_expire_at": 1798675200000, // ms 时间戳
  "sub_channel": "wechat",        // wechat/alipay
  "sub_auto_renew": true,
  "season_id": "2026-04",
  "badge_ids": ["starter","consistency_30"]
}
```

### 1.2 经济/成长字段（写入规则见 §2）
- `xp` 当期可消耗/升级经验（升级后按 Level 曲线清零保留余数）。
- `xp_total_season` 当赛季累计 XP，赛季结算后归零。
- `xp_total_all` 终身 XP，永不清零，仅用于 Level 曲线。
- `streak_days` 连续打卡天数，任意一天 0 活跃（无打卡无任何主动操作）归零；VIP 可用「连签补卡券」跳过 1 天。

### 1.3 订阅（已经实现，仅再重申）
| 档位 | 价格 | 时长 | 续费 |
|---|---|---|---|
| monthly 月卡 | ¥28 | 30d | 自动 |
| quarter 季卡 | ¥68 | 90d | 自动 |
| year 年卡 | ¥198 | 365d | 自动（默认推荐） |
| lifetime 永久 | ¥498 | ∞ | 一次性 |

---

## 2. 成长经济系统（核心，决定徽章获取节奏）

### 2.1 设计目标
- 普通用户：**即使每天满勤，赛季内刷满所有关卡才刚好拿到赛季徽章**（≈ 30 天）。
- 普通用户不刷满任务：超过 1 个月也拿不到徽章。
- VIP 用户：**XP 上限系数 × 1.4，但不提供绝对捷径**；全满分情况下 ≈ 15–17 天拿到徽章。
- 核心卡点：**每日 XP 软上限 + 赛季总 XP 硬门槛**。

### 2.2 赛季徽章门槛
```
赛季徽章所需 XP = 3000
赛季周期 = 30 天（每月 1 日 04:00 结算）
```

### 2.3 每日 XP 软上限（Daily Cap）
| 身份 | 每日可获 XP 上限 | 高强度全刷预估达标天数 |
|---|---|---|
| 普通用户 | **100 XP / 天** | 3000 ÷ 100 = **30 天** |
| VIP 用户 | **180 XP / 天** | 3000 ÷ 180 ≈ **16.7 天 → 17 天** |
| 试用期（首 3 天） | 120 XP / 天 | — |

> 所有 XP 来源加和超过上限后仍可完成任务，但只计到上限；UI 显示「今日已达上限，明日继续」。

### 2.4 XP 来源与单次经验值

| 来源 | 单次 XP | 日频次限制 | 普通用户日贡献 | VIP 日贡献 |
|---|---|---|---|---|
| 每日签到 | 20 (+10 streak 累进上限 +20) | 1 | 20–40 | 20–40 |
| 完成 1 个今日任务 | 15 | 5 个任务 | ≤ 75 | ≤ 75 |
| 完成今日热度卡 | 25 | 1 | 25 | 25 |
| 完成 1 次 AI 对话演练 | 30 | ≤ 3 / 日 | ≤ 90 | ≤ 90 |
| 通关剧情关卡（首通） | 40 | 无 | 首通算 | 首通算 |
| 通关剧情关卡（刷满星） | +20 | 每关 1 次 | — | — |
| 完成关系诊断测评 | 50 | 7 天 1 次 | — | — |
| 社区发帖（原创 ≥ 20 字） | 10 | 3 | ≤ 30 | ≤ 30 |
| 社区有效互动（获赞 ≥ 3） | 5 | 10 | ≤ 50 | ≤ 50 |
| 约会锦囊完成一次复盘 | 25 | 1 | 25 | 25 |
| 连续 7/14/21/28 天打卡 | +50/100/150/200 | 赛季内不重复 | — | — |

> ⚠️ 普通用户即使把以上全部"理论可做"事项叠加到上限 100，也必须 **30 天全勤**；VIP 有 180 的缓冲，但需要 **≥ 17 天全勤**。任一天"偷懒"都会延后达标。

### 2.5 等级曲线（`level` 从 1 → 30）
```
required_xp(L) = round(80 * pow(L, 1.45))
例：
Lv.1 → 80, Lv.5 → 820, Lv.10 → 2240, Lv.15 → 4160, Lv.20 → 6570, Lv.30 → 12480
```
- 等级头衔（每 5 级一跳）：恋爱小白 / 恋爱新手 / 恋爱学徒 / 恋爱达人 / 恋爱导师 / 恋爱大师。
- 等级不随赛季重置。

### 2.6 徽章体系

#### 2.6.1 赛季徽章（核心商业卡点）
| 徽章 | 条件 | 获得节奏 |
|---|---|---|
| 🏅 赛季之星 | 赛季内累计 XP ≥ 3000 | 普通 30d / VIP 17d |
| 🏆 赛季全能王 | 赛季内累计 XP ≥ 4500 且 5 维均 ≥ 85 | VIP 才有现实可能 |

#### 2.6.2 永久徽章（不随赛季刷新）
- 🌱 启程：完成 1 次 AI 对话
- 🔥 热情：累计 10 次 AI 对话
- 💯 百 XP 俱乐部：累计 100 XP
- 📅 月度达人：累计 30 天打卡
- 🌈 全能：5 维任意一次均 ≥ 80
- 👑 大师：综合恋商 ≥ 95

#### 2.6.3 稀有徽章（活动/限定）
- 🎃 万圣树洞 / 🎄 圣诞礼物派 等：节日活动期限定。

### 2.7 赛季结算流程
1. 每月最后一天 23:59 锁定，04:00 结算：
   - `xp_total_season → 0`；`badge_ids` 按达标条件 **追加**（不删）。
   - 未达标用户发推送「还有 X XP 就能拿到徽章，下赛季继续加油」。
2. 结算完成后写 `season_snapshot` 表快照，支持申诉补发。

### 2.8 后端接口建议
- `POST /api/xp/grant` body={source, ref_id} → 由服务端决定是否计入（防刷）。
- `GET /api/user/season` → 返回 `{xp_total_season, xp_daily, daily_cap, progress_percent, badges_pending}`。
- `GET /api/badges/me` → 已获得徽章。
- `GET /api/config/economy` → 返回当前 `daily_cap / xp_by_source / threshold` 全量配置（便于运营调参无需发版）。

---

## 3. 五维能力 & 标签映射（所有推荐的基础）

### 3.1 5 维定义

| 维度 | 代码 | 定义 | 初始值 | 最大值 |
|---|---|---|---|---|
| 开场白 | opener | 破冰开场的吸引力与自然度 | 60 | 100 |
| 共情力 | empathy | 理解对方情绪、给予回应的能力 | 60 | 100 |
| 观察力 | observe | 从细节推测对方偏好与真实意图 | 60 | 100 |
| 话题力 | topic | 制造/延续话题、避免冷场 | 60 | 100 |
| 安全感 | safety | 让对方信任、避免焦虑/PUA 风险 | 60 | 100 |

### 3.2 关卡标签 → 维度映射
每个关卡携带 `tags: string[]`，每个标签对 5 维贡献权重（0-1），完成关卡时按权重提升对应维度分数。

| 标签 | opener | empathy | observe | topic | safety |
|---|---|---|---|---|---|
| `破冰` | 0.8 | 0.1 | 0.1 | 0.2 | 0.0 |
| `开场` | 0.9 | 0.0 | 0.1 | 0.2 | 0.0 |
| `幽默` | 0.5 | 0.1 | 0.0 | 0.6 | 0.0 |
| `话题` | 0.1 | 0.1 | 0.1 | 0.9 | 0.0 |
| `共情` | 0.0 | 0.9 | 0.2 | 0.2 | 0.2 |
| `情绪降温` | 0.0 | 0.8 | 0.1 | 0.0 | 0.5 |
| `冷战` | 0.0 | 0.7 | 0.2 | 0.1 | 0.6 |
| `挽回` | 0.0 | 0.6 | 0.3 | 0.2 | 0.5 |
| `细节观察` | 0.2 | 0.3 | 0.9 | 0.2 | 0.1 |
| `画像` | 0.1 | 0.3 | 0.8 | 0.3 | 0.1 |
| `避雷` | 0.0 | 0.2 | 0.4 | 0.0 | 0.9 |
| `边界感` | 0.0 | 0.3 | 0.2 | 0.1 | 0.8 |
| `表白` | 0.4 | 0.5 | 0.2 | 0.3 | 0.4 |
| `暧昧` | 0.4 | 0.3 | 0.3 | 0.6 | 0.1 |
| `长期关系` | 0.0 | 0.5 | 0.3 | 0.3 | 0.6 |
| `吵架` | 0.0 | 0.7 | 0.2 | 0.2 | 0.7 |
| `自信建立` | 0.3 | 0.1 | 0.0 | 0.2 | 0.6 |

> 一个标签可能对多维有影响。后端维护这张 **tag_effect** 映射表，前端不需要写死。

### 3.3 维度更新公式（通关结算）
```
完成关卡 L，得分 score ∈ [0,100]：
for each tag in L.tags:
  for each dim in {opener, empathy, observe, topic, safety}:
    Δ = tag_effect[tag][dim] * (score - 60) * 0.08
    user.eq_dims[dim] = clamp(0, 100, user.eq_dims[dim] + Δ)
```
- 系数 0.08 让单次最大约 +3.2 分，防止速刷。
- score < 60 时会负向调整（惩罚乱选），底线 0。

### 3.4 综合恋商 EQScore
```
eq_score = round(
  0.22*opener + 0.24*empathy + 0.18*observe + 0.20*topic + 0.16*safety
)
```
- 上限 100；展示「超过 X% 的用户」由每日汇总分位数得出。

---

## 4. AI 提升建议逻辑（首页 / 恋商页都复用）

### 4.1 触发
- 每次进入首页或恋商页、每完成一次测评，都重新计算。

### 4.2 输入
- `user.eq_dims`（5 维当前分）
- `user.recent_logs`（近 7 天关卡记录、AI 对话日志）
- `user.species_id`（物种）
- 关卡库 `levels`，每个关卡已 `tags` + `difficulty(1-5)` + `is_vip`。

### 4.3 算法步骤
```
1) 找出 user.eq_dims 里最低的 3 个维度 → weak_dims = [d1, d2, d3]
2) 计算每个关卡的推荐分 score_rec(L)：
   base = Σ(dim in weak_dims) tag_effect[L.tag][dim] * (100 - user.dim)
   penalty_completed = -40 * (L.id in last_30d_completed)   // 近期已通关降权
   penalty_vip = -10 if L.is_vip and !user.is_pro else 0
   penalty_difficulty = -5 * |L.difficulty - suggested_diff|
     其中 suggested_diff = clamp(1, 5, round(user.level/4))
   score_rec(L) = base + penalty_completed + penalty_vip + penalty_difficulty
3) 按 score_rec 降序取 Top-3 关卡作为"推荐关卡"
4) 同时生成文案建议（每个 weak_dim 一条）：
   - 从 suggestion_templates[dim] 挑选最契合用户物种的模板
   - 附带关联关卡的跳转 Deep Link
```

### 4.4 前端展示示例
```
🧠 AI 提升建议
你在 安全感 (70) / 观察力 (78) / 话题力 (88) 上还有成长空间。
建议先从 [边界感练习·第3关] 入手，配合每天 1 次「避雷针」检测，
预计 2 周内安全感可提升到 82。

推荐关卡：
1. 💎 边界感练习·第3关（安全感 +4.2）
2. 🔥 细节观察·第5关（观察力 +3.6）
3. ☕ 轻松话题发起·第2关（话题力 +3.1）
```

### 4.5 后端接口
- `GET /api/recommend/levels?k=3` → 返回 Top-3 推荐关卡 + 预估提升量 + 跳转 link。
- `GET /api/insight/daily` → 返回今日 5 条洞察（DiagnosticStream 轮播用）。

---

## 5. 模块逐项逻辑

### 5.1 首页 Home

#### 5.1.1 问候区 GreetingSection
- **文案**：根据服务器时间小时 `getHours()` 判断：<6 凌晨好 / 6–11 早安 / 11–13 午安 / 13–18 下午好 / 18–24 晚安。
- **XP 进度条**：`xp / required_xp(user.level+1)` × 100%。
- **头衔**：来自等级对照表。
- **接口**：`GET /api/user/profile` 返回 xp/level/title。

#### 5.1.2 今日场景卡 TodayScene
- **数据源**：`GET /api/scenes/today` 返回每日服务端按权重挑选的 1 张主卡 + N 张备选。
- **「热门」角标判定**（用户提到的核心问题）：
  ```
  scene.is_hot = (
    scene.last_7d_complete_count >= 500
    AND scene.last_7d_complete_count >= 全站 scene 的 Top 20%
  )
  ```
  即：近 7 天被 ≥ 500 个用户完成过，且进入全站场景热度 Top 20%。该字段 **后端每小时批处理** 一次。
- **「4.95 分」由来**：
  ```
  scene.rating = round2(
    Σ(user_rating_1_to_5) / count
  )
  显示规则：rating_count >= 100 才显示；否则显示「新场景」。
  评分入口：用户完成场景的对话演练后弹出 1-5 星评价浮层（可跳过）。
  ```
  即 **用户主动打分**（非系统根据通关次数算的）。
- **参与人数**：近 30 天独立用户完成数（跨账号去重）。
- **标签**：场景人工打的 `tags`（2-3 个），同时参与 §3.2 的维度映射。
- **AI 模拟器**：`POST /api/scene/{id}/chat` 维护对话上下文，使用 `OpenAI function calling` 或自研 LLM，返回 1 条助手回复 + 1-3 条快捷回复建议。

#### 5.1.3 今日任务 TodayTaskList
- **5 项任务**（固定）：签到 / AI 演练 1 次 / 学 1 个开场白 / 热度卡 / 社区留言。
- **完成判定**：
  - 签到：`POST /api/checkin/today`（一天一次，服务端校验时区）。
  - AI 演练：训练页完成一次有 `total_messages >= 6` 的对话。
  - 开场白：打开开场白库并浏览任意 1 条 ≥ 3 秒。
  - 热度卡：完成今日热度卡。
  - 社区留言：在任意帖下留言 ≥ 8 字。
- **XP 下发**：完成任一项立即 `+15 XP`（受 §2.3 软上限）。
- **重置**：每日 04:00 重置。

#### 5.1.4 今日热度卡 HeatUpCard
- 3 道题 × 5 选项，`score = Σ(option_weight)`，映射 3 档结果（65/78/85 HC）。
- **专家寄语** 根据档位切不同专家（汪俊豪/余水/占方剑）。
- 完成 +25 XP（覆盖前端现写的 +15）。

#### 5.1.5 诊断流 DiagnosticStream
- 5 条洞察轮播，由 `/api/insight/daily` 决定。

### 5.2 恋商 Tab DiagnosticPage

#### 5.2.1 综合恋商
- 总分来自 §3.4；本周 +4 来自 `this_week.eq_score - last_week.eq_score`。
- "超过 76% 用户"：后端维护 `percentile_table`，每小时重算。

#### 5.2.2 五维雷达
- 取 `user.eq_dims`。

#### 5.2.3 周报 weeklyHistory
- 取近 7 天每日 `eq_score` 快照（由系统每日凌晨结算写入 `eq_daily_snapshot` 表）。

#### 5.2.4 本周数据
- AI 对话次数、连续打卡、XP 增量。全部来自 `eq_daily_snapshot`。

#### 5.2.5 AI 提升建议 aiSuggestions（重点）
见 §4，服务端下发 3 条（文案 + 关联关卡 ID + 预期提升）。

#### 5.2.6 性格画像 traitData
- 6 项：外向度、沟通直接度、情绪敏感度、决策理性度、依恋类型、冲突应对。
- 数据来源：用户完成物种测评 + 问卷题累积得分。

#### 5.2.7 恋爱物种鉴定
- **触发条件**：注册时引导做一次；或用户主动在恋商页点「重新测一下」（每 30 天限 1 次）。
- **算法**：6 题 × 6 选项 → 对应 12 个物种。旧前端用 `Σanswer % 12`（简单 hash）；**后端应改为阵营权重**：
  ```
  camp_score = {fire:0, ignore:0, selfmove:0, harmless:0}
  for answer in answers:
    camp_score[answer.camp] += answer.weight
  dominant_camp = argmax(camp_score)
  species = camp_to_species_pool[dominant_camp][hash(user_id) % 3]
  ```
- **匹配度** = 100 - Σ|answer.weight - ideal[species]|×系数，范围 85–99。
- **升级线**：每 +500 XP 进化至下一物种，服务端维护 `species_evolution_tree`。

### 5.3 心动 Tab PracticePage（训练/关卡）

#### 5.3.1 剧情章节 storyChapters
- 5 章 × 6 关 = 30 关。
- 每章有 `cover_image / immersive_image / narrative / synopsis / partners[]`。
- 每关有 `id / name / difficulty / tags / is_vip / description / dialogue_script`。
- **进度**：`GET /api/user/progress` 返回 `{chapter_id: {completed_level_ids, star_count}}`。
- **关卡状态徽章**（前端已实现 4 态）：
  - ◆ 会员专享（`level.is_vip && !user.is_pro`）
  - ✦ 已破关（`level.id in completed`）
  - ● 进行中（`chapter_id == user.current_chapter && !completed`）
  - ○ 未开始
- **通关结算**：`POST /api/level/{id}/complete` body={score, duration, dialogues}
  - 服务端：写入 `completion_log`、按 §3.3 更新 eq_dims、按 §2.4 下发 XP、触发任务/徽章检查。

#### 5.3.2 挑战关 challengeGroups
- 5 组 × 6 关 = 30 关，结构同剧情关，但 `mode=challenge` 且引入 AI 打分更严（+10% 难度系数）。

#### 5.3.3 章节沉浸页 ChapterImmersiveView
- 搭档选择：`enablePartnerPicker=true` 时可滑动选择角色。
- 确认后 `POST /api/chapter/{id}/set_partner` body={partner_id}。

#### 5.3.4 AI 对话演练
- 5 步流程：idle → scene → matching → matched → playing → result。
- **匹配算法**：
  ```
  1) 根据用户选场景 + 当前薄弱维度，从搭档池筛候选
  2) 候选按"人设匹配度 × 新鲜度"排序（新鲜度=近30天该搭档被匹配的频次倒数）
  3) 随机抽 1 个（带温度）
  ```
- **评分规则**：每轮 AI 对用户消息打 `intimacy(亲密度)/tone(语气)/topic(话题推进)` 三维 0-100，总分 = 三项平均。
  - `score >= 85` 优秀 / 70-85 良好 / <70 合格以下。
  - XP 换算：`xp = floor(total * 0.6)` 并受软上限。

#### 5.3.5 4 位导师 coaches
- 评分 `coach.rating`：由历史用户在咨询结束后 1-5 打分汇总 **[用户打，非系统算]**。
- 咨询人数 `coach.serve_count`：订单累计数。
- **是否在线**：导师后台状态实时更新，超过 30 分钟无心跳 → offline。

### 5.4 快捷工具 FeatureGrid

#### 5.4.1 聊天翻译机 ChatTranslator
- **输入** ：多图 ≤ 5 张 / 纯文本。
- **后端流程**：
  1. 图片 OCR → 抽取对话结构（发送人 A/B、时间）；
  2. 上下文编码 + 用户关系阶段 `context` 传 LLM prompt；
  3. 返回三块：`subtext[]` (TA 潜台词 3 条) / `replies{gentle,humor,smart}` / `analysis`；
  4. 日志 `POST /api/translator/log` 保存 50 条。
- **接口**：`POST /api/translator/analyze`。
- **权限**：免费用户每天 3 次；PRO 无限次（`CHAT_TRANSLATOR_DEEP` feature）。

#### 5.4.2 约会锦囊 DatePlanner
三大模式：准备 / 急救 / 复盘，全部 **[派生]** 自用户输入。
- **准备流程**：4 步 wizard → `POST /api/date/plan` → 返回 venues/icebreakers/topics/outfit/timeline/planB/tips。
- **复盘**：`POST /api/date/review` 带 3 维打分 + 标签，返回 analysis + goods + improves + next_steps；消耗 +25 XP。
- **权限**：PRO 才有「复盘」功能（`DATE_PLANNER_REVIEW`）。

#### 5.4.3 恋爱避雷针 RedFlagDetector
- **渣值公式**（已实现）：`min(100, reds*14 + yellows*7 + greens*3)`，floor 5。
- **红绿灯阈值**：≥60 红 / ≥30 黄 / 其他 绿。
- **主/副模式判定**（6 种操控模式 `PUA / 面包屑 / Love Bombing / 回避型 / 养鱼 / 情绪寄生虫`）：
  ```
  for pattern in patterns:
    pattern.score = Σ(user_checked_behavior.tags ∩ pattern.signal_tags) × weight
  primary = argmax; secondary = second argmax if score > threshold
  ```
- 输出含 4 条「止损建议」+ 1 条「灵魂金句」，模板由运营维护。
- **接口**：`POST /api/redflag/detect` body={mode, behaviors|text|screenshots}。

#### 5.4.4 朋友圈助手 MomentsAssistant
- **文案生成**：`POST /api/moments/generate` body={scene, style} → 返回 3 条候选。
- **人设诊断**：`POST /api/moments/persona` body={answers[4]} → 返回 S/A/B/C 档 + 3 条改进。
- **发圈策略**：静态内容，CDN 配置。

### 5.5 社区 Tab CommunityPage

#### 5.5.1 专栏 Articles
- **文章列表**：`GET /api/articles?tab=column&page=`，按 `editor_pick DESC, hot_score DESC`。
- **热度分 `hot_score`**：
  ```
  hot_score = reads*0.4 + likes*2 + comments*3 + collects*4 - age_days*10
  ```
- **付费逻辑**：
  - `article.is_paid=true` + `user.is_pro=false` + `!user.unlocked_articles.has(id)` → 免费读前 3 段，其余付费。
  - 点击「开通会员解锁」→ `sub.open('community_article')`；或支持单篇 ¥6.9–¥15.9 购买（`POST /api/article/{id}/purchase`）。

#### 5.5.2 讨论 Posts
- 4 个热门话题 tag + 帖子流（`GET /api/posts?tab=discuss&filter=`）。
- **匿名树洞**：发帖 `POST /api/post/anonymous` body={mood, content, identity_animal}；animal 8 种随机或用户选择。
- **互动按钮**：抱抱 / 打气 / 感同身受 3 种，`POST /api/post/{id}/react` body={type}；每用户每帖每类型 1 次。

#### 5.5.3 导师详情弹窗
- 咨询价 ¥299/次（`coach.price`）。
- 预约 → `POST /api/coach/{id}/book` → 服务端入队 10 分钟内匹配 → 异步消息推送 `coach_booked`。
- 前端收到 WS/轮询后 `bookCoach()` 写入本地缓存 + unread+1 + 事件 `foxsay_coach_booked`。

### 5.6 我的 Tab ProfilePage

#### 5.6.1 顶部资料卡
- 头像框 6 种，其中 `rainbow` 需 Lv.15 解锁、`sakura` 限定活动。
- 「看过我」：`GET /api/user/profile_views`（30 天滚动）。

#### 5.6.2 VIP 横幅
- 非 PRO：`sub.open('profile_banner')`。
- PRO：打开 `SubscriptionManageSheet`。

#### 5.6.3 3 张数据卡（成就数 / 恋商 / 连续天数）
- 全来自 user profile。

#### 5.6.4 7 个菜单
| 菜单 | 入口行为 |
|---|---|
| 我的帖子 | 打开 MyPostsPage（`GET /api/me/posts`） |
| 导师私信 | 打开 CoachChatPage；badge=未读数聚合 |
| 我的成就 | 弹窗显示 §2.6 徽章列表 |
| 学习记录 | `GET /api/me/timeline?days=7` |
| 打卡日历 | 当月 streak，补签券（VIP 权益） |
| 我的收藏 | `GET /api/me/collects` |
| 导师咨询 | 跳企业微信或内嵌咨询页 |

#### 5.6.5 设置
- 深色模式 toggle → `storage.set('dark_mode', '1')`。
- 通知权限 → 调用系统权限 API。
- 退出登录 → 清 `user_state` + `followed_names` + `runStorageMigration` flag 保留。

### 5.7 辅助键盘页 AssistKeyboardPage
- 6 功能介绍 + 评价 4 条（`GET /api/keyboard/reviews`，服务端精选）。
- 4 Demo 脚本（静态）。
- **开通引导**：
  - 非 PRO → `sub.open('keyboard')`。
  - PRO → 3 步系统设置指引，复制路径到剪贴板，+toast。

### 5.8 个人主页 SocialPage
- 3 Tab：瞬间 / 头像框 / 主题皮肤。
- **瞬间**：`GET /api/user/{id}/moments?page=`，类型包含关卡完成、发帖、打卡、等级提升。
- **头像框**：`POST /api/me/avatar_frame` body={id} 切换；前端实时反映。
- **主题皮肤**：同理；skin 切换时改 CSS 变量 root，不刷新。

### 5.9 我的帖子 MyPostsPage
- 5 条初始帖为 mock，接入后：`GET /api/me/posts?sort=time|hot`。
- 点赞 / 收藏 / 编辑 / 删除 / 举报 全走标准 RESTful。

### 5.10 VIP 页 VIPPage
- 3 档 × 3 周期价格矩阵（当前硬编码和 lib/subscription 并存）。
- **建议收敛**：后端只维护一套 plans，VIPPage 展示时通过 plans 自由组合生成 3×3 矩阵。
- **社会证明**：`GET /api/vip/stats` → 用户数 / 3 条精选好评。

### 5.11 订阅弹窗（已实现）
- `SubscriptionSheet` 统一收银台。
- `SubscriptionManageSheet` 查看 / 续费 / 取消自动续费（二次确认 → `payService.cancelAutoRenew()` → `POST /api/subscription/cancel_autorenew`）。

---

## 6. 按钮级交互清单（高频按钮）

| 位置 | 按钮 | 行为 | 接口 |
|---|---|---|---|
| Header | 🔔 通知 | 打开通知中心 | `GET /api/notifications` |
| Header | 订阅 / 会员 | PRO→管理；非 PRO→打开订阅表 | — |
| 首页 | 签到 | 写今日打卡 + XP | `POST /api/checkin/today` |
| 首页 | 热度卡选项 | 本地记录，提交后 +XP | `POST /api/heatup/submit` |
| 首页 | 今日任务某项 | 跳转对应页；完成时异步回调 +XP | — |
| 首页 | 场景「开始对话」 | 进入 AI 模拟 | `POST /api/scene/{id}/chat` |
| 恋商 | 重新测物种 | 每 30d 允许 1 次 | `POST /api/species/quiz` |
| 恋商 | AI 建议→关卡 | Deep link 跳训练 | — |
| 练习 | 关卡点击 | VIP 关非会员 → 订阅表；否则进入沉浸页 | — |
| 练习 | 开始对话 | 建立 AI 会话 | `POST /api/practice/{id}/start` |
| 练习 | 结束对话 | 结算 | `POST /api/level/{id}/complete` |
| 快捷工具 | 翻译机「生成」 | 发起分析 | `POST /api/translator/analyze` |
| 快捷工具 | 约会计划「生成」 | | `POST /api/date/plan` |
| 快捷工具 | 避雷针「检测」 | | `POST /api/redflag/detect` |
| 快捷工具 | 朋友圈助手 | 3 类接口 | 同 §5.4.4 |
| 社区 | 点赞 / 收藏 / 评论 / 转发 | 标准 CRUD | `POST /api/post/{id}/like` 等 |
| 社区 | 付费解锁 | 跳订阅表 或 单篇购买 | `POST /api/article/{id}/purchase` |
| 社区 | 导师预约 | 入队 | `POST /api/coach/{id}/book` |
| 我的 | VIP 横幅 | PRO→管理；否则开通 | — |
| 我的 | 辅助键盘入口 | 打开键盘推广页 | — |
| 我的 | 编辑昵称 | 本地+服务端 | `PATCH /api/me` |
| 我的 | 切头像框/皮肤 | 立即切换+保存 | `PATCH /api/me` |
| 我的 | 退出登录 | 清 token + 跳登录 | `POST /api/auth/logout` |

---

## 7. 事件 & 存储总表

### 7.1 localStorage（全部 `foxsay:` 前缀）
| key | 用途 |
|---|---|
| `foxsay:user_state` | 用户快照 |
| `foxsay:followed_names` | 关注昵称列表 |
| `foxsay:dark_mode` | 深色模式 |
| `foxsay:heatup:YYYY-MM-DD` | 今日热度卡完成 |
| `foxsay:tasks:YYYY-MM-DD` | 今日任务完成 ids |
| `foxsay:checkin:YYYY-MM-DD` | 打卡 |
| `foxsay:booked_coaches` | 导师预约 ids |
| `foxsay:coach_chats` | 导师聊天 |
| `foxsay:coach_unread` | 导师未读数 |
| `foxsay:chat_translator_history` | 翻译机历史 50 条 |
| `foxsay:__migrated_v1` | 迁移标记 |

### 7.2 自定义事件
| event | 发出 | 订阅 |
|---|---|---|
| `foxsay_checkin_done` | 打卡成功 | 首页 streak 刷新 |
| `foxsay_coach_booked` | 预约导师 | 个人页徽章刷新 |
| `foxsay_coach_unread_change` | 新消息 | 菜单红点 |
| `foxsay:open-vip` | 旧版兼容 | VIP 页打开 |

---

## 8. 核心后端接口汇总（建议最小集）

### 8.1 用户
- `POST /api/auth/login|logout|refresh`
- `GET  /api/me` / `PATCH /api/me`
- `GET  /api/user/{id}/profile`
- `GET  /api/user/season`
- `GET  /api/user/profile_views`

### 8.2 经济
- `POST /api/xp/grant`
- `POST /api/checkin/today`
- `GET  /api/badges/me`
- `GET  /api/config/economy`

### 8.3 关卡 & 训练
- `GET  /api/chapters` / `GET /api/chapters/{id}`
- `GET  /api/levels/{id}`
- `POST /api/level/{id}/complete`
- `POST /api/practice/{id}/start` / `POST /api/practice/{id}/turn` / `POST /api/practice/{id}/finish`
- `GET  /api/recommend/levels`

### 8.4 恋商
- `GET  /api/eq/daily`
- `POST /api/species/quiz`
- `GET  /api/eq/weekly_history`

### 8.5 快捷工具
- `POST /api/translator/analyze`
- `POST /api/date/plan|review`
- `POST /api/redflag/detect`
- `POST /api/moments/generate|persona`

### 8.6 社区
- `GET  /api/articles` / `GET /api/article/{id}`
- `POST /api/article/{id}/purchase|like|collect`
- `GET  /api/posts` / `POST /api/post` / `POST /api/post/{id}/react|reply`
- `POST /api/post/anonymous`
- `GET  /api/coaches` / `POST /api/coach/{id}/book`

### 8.7 订阅
- `GET  /api/plans`
- `POST /api/pay/create` → 返回预下单参数（调起微信 / 支付宝 SDK）
- `POST /api/pay/notify` → 微信/支付宝服务端回调（签名校验）
- `POST /api/subscription/cancel_autorenew`
- `GET  /api/subscription/me`

### 8.8 通知 & 事件
- `GET  /api/notifications?unread=true`
- `WS   /api/ws` → 推送 `coach_message / xp_update / badge_unlock / system_announce`

---

## 9. 赛季（月度）运营流程

### 9.1 周期
- 每月 1 日 00:00 开始，月末最后一天 23:59 结束，01 日 04:00 结算。

### 9.2 结算
1. 快照 `xp_total_season`、5 维分数、任务完成率。
2. 发放徽章（§2.6.1）。
3. 生成"赛季战报"页面（可分享海报）：对比上赛季、同比排名。
4. 清零 `xp_total_season`。

### 9.3 运营动作
- 赛季前 3 天：主题预热 Banner + PUSH。
- 赛季内：每周五推送"离徽章还差 X XP"。
- 赛季末 3 天：倒计时 Banner + 会员 50% off 促销（针对未达标用户，转化期）。

---

## 10. 安全与反作弊

### 10.1 XP 反刷
- 所有 XP grant 必须带服务端校验的 `source + ref_id`，例如：
  - 签到：`ref_id = YYYY-MM-DD + user_id`，唯一索引。
  - 关卡通关：`ref_id = level_id + session_id`。
- 每日 XP 软上限在服务端强制，客户端仅展示。

### 10.2 AI 对话反刷
- 每次对话需至少 6 轮且平均思考间隔 ≥ 2 秒才发 XP。
- 同一 level 24h 内重复通关不加 XP。

### 10.3 社区反刷
- 同一 IP + 同一设备指纹 30 分钟内 ≤ 3 帖。
- 留言 < 8 字 / 重复内容检测 → 不计任务。

### 10.4 支付
- 所有支付回调必须服务端验签，不信任客户端。
- 订阅状态以 `/api/subscription/me` 为唯一真值，客户端 isPro 只用于 UX。

---

## 11. 关键问答（对齐文档开头用户提出的疑问）

**Q1：今日场景左上角「热门」是根据什么判断的？**
A：见 §5.1.2。近 7 天该场景被 ≥ 500 人完成，且进入全站场景热度 Top 20%，由后端每小时离线批处理打标 `is_hot=true`。

**Q2：4.95 评分是用户打的还是系统根据通关次数算的？**
A：**用户主动打分**。完成一次场景对话演练后弹 1–5 星评价浮层，可跳过。`rating = avg(所有评分) / rating_count`，四舍五入 2 位；评分数 < 100 不显示，显示「新场景」。

**Q3：AI 提升建议根据哪个数值推荐关卡？标签怎么关联？**
A：见 §4 完整流程。**取 5 维最低的 3 维**，结合 §3.2 的 tag→dim 映射计算每个关卡 `score_rec`，降权近期已通关、难度偏离、VIP 锁，按分数 Top-3 推荐。每个标签对 5 维的权重由 `tag_effect` 表维护（§3.2）。

**Q4：通关评分怎么打？**
A：AI 对话每轮评三项：亲密度 / 语气 / 话题推进（各 0-100），结束时平均为总分 0-100。总分决定 §3.3 对 5 维的增量，并决定 XP (`xp = floor(total * 0.6)`)。

**Q5：普通用户拿徽章要多久？**
A：赛季（1 月）徽章门槛 = 3000 XP；普通用户日软上限 100 XP → **必须 30 天全勤**；VIP 日上限 180 XP → **17 天全勤可达**。不刷满任务/关卡都会拉长时间，这正是经济系统的卡点设计。

---

> **文档版本**：v1.0（初版）
> **编辑日期**：2026-04-17
> **后续**：任何数值（daily_cap / 徽章门槛 / tag_effect 权重）都建议上线后通过 A/B 实验调参；前端统一走 `/api/config/economy` 下发热更新。
