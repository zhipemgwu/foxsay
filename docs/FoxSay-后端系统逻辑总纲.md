# FoxSay 后端系统逻辑总纲

> 版本 v1.0 · 2026-04-17
> 目标：为后端开发提供**可直接落地**的数据模型、算法公式、触发时机、接口结构。
> 原则：参考行业头部产品（Keep / Soul / 小红书 / 爆鸡 / Duolingo）的量化评分、标签推荐、热度排行、等级经验、社交图谱做法。
> 范围：除**登录/注册/鉴权**以外的所有业务模块。

---

## 目录
- [Part 0. 系统通用基础设施](#part-0-系统通用基础设施)
- [Part 1. 用户中枢：账户 / 等级 / XP / 能力六维](#part-1-用户中枢账户--等级--xp--能力六维)
- [Part 2. 能力雷达：嘴替/心软/抖包袱/树洞/救场/整活 六维计分](#part-2-能力雷达六维计分)
- [Part 3. 标签系统与"标签 → 能力维度"映射](#part-3-标签系统)
- [Part 4. 今日场景（HeroCard/TodayScene）—— 热门徽章 / 评分 / 参与数](#part-4-今日场景)
- [Part 5. AI 提升建议 —— 基于能力短板的智能推荐](#part-5-ai-提升建议)
- [Part 6. 关卡系统（剧情 30 + 人物挑战 30）](#part-6-关卡系统)
- [Part 7. 每日任务（TodayTaskList）+ 打卡日历](#part-7-每日任务--打卡日历)
- [Part 8. 恋爱温度计 HeatUpCard（Daily Check-in）](#part-8-恋爱温度计)
- [Part 9. 物种鉴定 DiagnosticPage](#part-9-物种鉴定)
- [Part 10. 导师系统：资料 / 评分 / 预约 / 私信](#part-10-导师系统)
- [Part 11. 社区：专栏 / 讨论帖 / 匿名树洞 / 评论](#part-11-社区)
- [Part 12. 个人主页 / 社交图谱 / 头像框 / 皮肤](#part-12-个人主页--社交图谱)
- [Part 13. VIP 会员（Lite / Pro / Pro+）](#part-13-vip-会员)
- [Part 14. 工具模块：聊天翻译 / 约会锦囊 / 避雷针 / 朋友圈助手](#part-14-工具模块)
- [Part 15. 成就系统](#part-15-成就系统)
- [Part 16. 搜索 / 热搜 / Feed 排序](#part-16-搜索--feed-排序)
- [Part 17. 通知中心](#part-17-通知中心)
- [Part 18. 事件总线与定时任务](#part-18-事件总线与定时任务)
- [附录 A. 完整数据库实体关系图（ER）](#附录-a-er-图)
- [附录 B. REST API 一览](#附录-b-rest-api-一览)

---

## Part 0. 系统通用基础设施

### 0.1 基础服务
| 服务 | 作用 | 技术建议 |
|------|------|---------|
| MySQL 主库 | 业务主数据 | 事务一致性要求高 |
| Redis | 热度榜、计数、会话、防刷 | ZSet 排行榜 + Hash 计数 |
| MongoDB | AI 对话、诊断 raw 数据 | 非结构化 |
| Elasticsearch | 社区 & 搜索 | 分词 + 评分 |
| OSS / S3 | 头像、聊天截图 | - |
| 消息队列（RocketMQ/Kafka） | 异步事件 | 见 Part 18 |
| 调度平台（XXL-Job） | 每日结算 / 周榜 | Cron |

### 0.2 通用约定
- **时间统一 UTC+8**，字段名 `created_at` / `updated_at` / `deleted_at`（软删）
- **ID**：用户/内容主键用 `BIGINT` 雪花 ID；业务编号（如关卡）可用 `INT` 自增
- **XP / 能力值**：统一 `INT(11)`，最大 `99_999`
- **权重/系数**：DB 不写死，存进 `config_system`（Redis 缓存），运营可后台调
- **所有用户操作**落一条 `user_action_log(user_id, action_type, target_id, ext_json, created_at)`，后续推荐/风控全靠它
- **防刷**：同一 `(user_id, action_type, target_id)` 当日计数 ≤ 阈值

---

## Part 1. 用户中枢：账户 / 等级 / XP / 能力六维

### 1.1 核心表 `user`
```sql
user (
  id             BIGINT PK,
  phone          VARCHAR UNIQUE,
  nickname       VARCHAR(32),
  gender         TINYINT,            -- 0 未填 / 1 男 / 2 女 / 3 其他
  age            TINYINT,
  avatar_url     VARCHAR,
  avatar_frame   VARCHAR(32) DEFAULT 'default',
  skin_id        VARCHAR(32) DEFAULT 'classic',
  species_id     VARCHAR(32),        -- 恋爱物种（见 Part 9）
  signature      VARCHAR(100),
  level          SMALLINT DEFAULT 1,
  xp             INT DEFAULT 0,              -- 总经验
  xp_to_next     INT DEFAULT 100,            -- 当前等级→下级需多少
  vip_tier       TINYINT DEFAULT 0,          -- 0 普通 / 1 Lite / 2 Pro / 3 Pro+
  vip_expire_at  DATETIME,
  followers      INT DEFAULT 0,              -- 冗余计数
  following      INT DEFAULT 0,
  streak_days    SMALLINT DEFAULT 0,         -- 当前连续打卡
  max_streak     SMALLINT DEFAULT 0,
  last_checkin   DATE,
  created_at, updated_at, deleted_at
)
```

### 1.2 等级公式（类 RPG 曲线）
```
Lv n → Lv n+1 所需 XP = 80 + n * 40
  Lv1→Lv2 : 120
  Lv2→Lv3 : 160
  …
  Lv12→Lv13: 560
  Lv20→Lv21: 880
```
实现：
```python
def xp_needed(level):
    return 80 + level * 40
```
每次 XP 变更用事务：`UPDATE user SET xp = xp + Δ` → 触发器 / 业务层检查是否升级 → 发「升级」通知。

### 1.3 XP 发放规则（全系统只在此处定义）
| 行为 | XP | 冷却 | 备注 |
|------|----|------|------|
| 完成 Daily Check-in | +15 | 每日 1 次 | Part 8 |
| 完成今日场景练习 | +50 | 每日 3 次封顶 | Part 4 |
| 完成关卡（剧情） | +30 / +50 / +80 | 章节递增 | Part 6 |
| 完成关卡（人物挑战） | +40 / +60 / +100 | 组别递增 | Part 6 |
| 完成每日任务（1条） | +10 ~ +50 | 见 Part 7 | 全部完成额外 +30 |
| 发布社区帖子 | +10 | 每日 3 次 | - |
| 帖子被点赞（被动） | +2 / 赞 | 每日上限 +100 | - |
| 帖子被收藏（被动） | +5 / 次 | 每日上限 +50 | - |
| 完成避雷针/翻译等工具 | +5 | 每日各 2 次 | - |
| 预约导师指导 | 0（付费） | - | - |
| 被关注（被动） | +3 | 每日 +30 封顶 | - |

> **关键约束**：XP 绝不在前端计算后提交。前端只发"完成事件"，后端按 action_type 查表加分。

### 1.4 能力六维（UserAbility）
```sql
user_ability (
  user_id              BIGINT PK,
  mouth_score          SMALLINT DEFAULT 50,  -- 嘴替指数
  heart_score          SMALLINT DEFAULT 50,  -- 心软指数
  humor_score          SMALLINT DEFAULT 50,  -- 抖包袱值
  listen_score         SMALLINT DEFAULT 50,  -- 树洞指数
  rescue_score         SMALLINT DEFAULT 50,  -- 救场指数
  vibe_score           SMALLINT DEFAULT 50,  -- 整活指数
  updated_at           DATETIME
)

user_ability_weekly (
  user_id   BIGINT,
  week_no   INT,           -- ISO 周
  6 维快照,
  PK (user_id, week_no)
)
```
- 初始值来自 **物种鉴定**（Part 9），之后由行为持续调整
- 单次调整 `Δ ≤ 3`（防止剧烈波动）
- 详细计分规则 → Part 2

---

## Part 2. 能力雷达六维计分

这是**整个系统的"能力货币"**。AI 推荐、关卡门槛、成就解锁都看它。

### 2.1 六维定义与对标
| 维度 | 英文字段 | 对标能力 | 参考行业 |
|------|---------|---------|---------|
| 嘴替指数 | mouth_score | 口才/段子/秒回 | 即兴评论能力 |
| 心软指数 | heart_score | 情感温度/亲密度 | 共情力 |
| 抖包袱值 | humor_score | 幽默/调侃 | 社交润滑 |
| 树洞指数 | listen_score | 倾听/深度 | 共情+耐心 |
| 救场指数 | rescue_score | 危机化解 | 情绪处理 |
| 整活指数 | vibe_score | 氛围制造 | 约会场景策划 |

### 2.2 每个行为如何影响维度（Action × Dimension 矩阵）

> 下表是**核心映射表**，后端写死一张 `ability_delta_rule`：

```
ability_delta_rule (
  action_type VARCHAR,
  dim         VARCHAR,     -- mouth/heart/humor/listen/rescue/vibe
  base_delta  DECIMAL(3,1), -- 单次增量（可以是 0.5）
  score_bonus DECIMAL(3,1), -- AI 评分 > 4.5 的额外奖励
  tag_match   JSON          -- 命中该标签时放大倍数 {"开场白":1.2, "共情":1.5}
)
```

示例填充：

| action_type | mouth | heart | humor | listen | rescue | vibe | 说明 |
|-------------|-------|-------|-------|--------|--------|------|------|
| scene_practice_chat | 1.0 | 0.5 | 0.5 | 0.5 | 0 | 0.5 | 场景对话通用 |
| level_pass_story | 1.5 | 1.0 | 0.5 | 1.0 | 0 | 1.0 | 剧情通关 |
| level_pass_character | 1.0 | 1.5 | 1.0 | 1.5 | 2.0 | 1.0 | 人物挑战 |
| redflag_report_generated | 0 | 1.0 | 0 | 0 | 2.0 | 0 | 避雷针识别危险 |
| translator_used | 1.0 | 0 | 0 | 1.5 | 0.5 | 0 | 聊天翻译（看懂潜台词=树洞+嘴替） |
| dateplanner_generated | 0.5 | 0.5 | 1.0 | 0 | 0 | 2.0 | 策划=整活主维度 |
| community_post_published | 0.5 | 0.5 | 1.5 | 0 | 0 | 0.5 | 发帖=抖包袱 |
| community_comment_liked | 0.5 | 1.0 | 0.5 | 0.5 | 0 | 0 | 被点赞=社交认可 |
| tree_hole_posted | 0 | 2.0 | 0 | 2.0 | 0.5 | 0 | 匿名倾诉=树洞+心软 |
| heatup_checkin | 0.3 | 0.3 | 0.3 | 0.3 | 0.3 | 0.3 | 日常微增 |
| diagnostic_complete | 由诊断结果直接 SET，不是增量 | - | - | - | - | - | 首次定基线 |

### 2.3 标签加权（Tag Match）
当 action 关联的 **内容/关卡带有标签**时，按 `tag_match.mapping` 放大该维度 `base_delta`：

例如用户完成 `scene_practice_chat`，关卡标签=`["深入话题","共情力"]`：
- "深入话题" → listen × 1.5
- "共情力" → heart × 1.5
则 `Δlisten = 0.5 × 1.5 = 0.75`，`Δheart = 0.5 × 1.5 = 0.75`

### 2.4 AI 评分加成
每次场景对话结束，AI 返回 `ai_score ∈ [0, 5.0]`：
```
final_delta = base_delta × tag_multiplier × (1 + (ai_score - 3.5) * 0.1)
```
即 AI 给 5 分 → 放大 15%；给 2 分 → 缩减 15%。

### 2.5 每日/每周封顶（防刷）
- 单维度**单日涨幅上限 = 5 分**
- 单维度**单周涨幅上限 = 20 分**
- 超过部分进入"溢出池"，次日逐步释放（Keep 的做法）

### 2.6 周报生成（每周一 00:05 Cron）
```
this_week = 当前 user_ability 快照
last_week = user_ability_weekly (week_no = 上周)
for each dim:
    delta = this_week - last_week
生成周报 → 发通知 → 更新雷达图
```

---

## Part 3. 标签系统

### 3.1 三类标签
| 类型 | 用途 | 示例 |
|------|------|------|
| `content_tag` | 场景/关卡/文章/帖子打标 | `自然开场`, `深入话题`, `肢体语言` |
| `ability_tag` | 能力维度（Part 2 六维） | `嘴替`, `心软`, `抖包袱` |
| `user_interest_tag` | 用户选择的兴趣（诊断/设置） | `想脱单`, `想挽回`, `社恐` |

### 3.2 标签 → 能力维度映射表 `content_tag_map`
**这是全系统推荐的核心表**，运营可在后台维护：

| content_tag | 主要影响维度 (权重) | 次要维度 (权重) |
|-------------|-------------------|---------------|
| 自然开场 | mouth (1.5) | vibe (0.8) |
| 深入话题 | listen (1.5) | mouth (1.0) |
| 肢体语言 | rescue (1.2) | heart (0.8) |
| 兴趣共鸣 | mouth (1.0) | listen (1.2) |
| 文化话题 | mouth (1.2) | listen (1.0) |
| 运动话题 | vibe (1.2) | mouth (0.8) |
| 邀约技巧 | rescue (1.3) | mouth (1.0) |
| 审美表达 | humor (1.0) | vibe (1.3) |
| 感受分享 | heart (1.5) | listen (1.0) |
| 深度连接 | listen (1.5) | heart (1.3) |
| 边界感 | rescue (1.3) | listen (1.0) |
| 温暖表达 | heart (1.5) | mouth (0.8) |
| 共情力 | heart (1.8) | listen (1.2) |
| 氛围感 | vibe (1.5) | humor (1.0) |
| 话题延展 | mouth (1.3) | listen (1.0) |
| 开场白 | mouth (1.5) | humor (0.8) |

> **用法**：推荐引擎拿到"用户弱项维度"→ 反查此表"哪些 tag 的主权重在此维度"→ 出推荐。详见 Part 5。

---

## Part 4. 今日场景

### 4.1 数据表
```sql
scene (
  id              BIGINT PK,
  code            VARCHAR(32) UNIQUE,  -- coffee_shop, park_stroll…
  title           VARCHAR(64),         -- 公园午后漫步
  subtitle        VARCHAR(128),
  cover_url       VARCHAR,
  duration_min    SMALLINT,            -- 约 10 分钟
  tags            JSON,                -- ["自然开场","深入话题","肢体语言"]
  difficulty      TINYINT,             -- 1 新手 / 2 进阶 / 3 挑战
  ai_script_id    BIGINT,              -- 指向 MongoDB 的对话脚本
  is_vip_only     TINYINT DEFAULT 0,
  status          TINYINT DEFAULT 1,   -- 0 下线 / 1 上线
  published_at    DATETIME,
  created_at, updated_at
)

scene_stat (
  scene_id        BIGINT PK,
  total_plays     INT DEFAULT 0,        -- 总参与人数（去重）
  plays_7d        INT DEFAULT 0,        -- 近 7 日
  plays_today     INT DEFAULT 0,
  rating_sum      INT DEFAULT 0,        -- AI 评分累计
  rating_count    INT DEFAULT 0,
  user_rating_sum INT DEFAULT 0,        -- 用户手动打分累计
  user_rating_cnt INT DEFAULT 0,
  collect_count   INT DEFAULT 0,
  updated_at      DATETIME
)
```

### 4.2 评分计算（前端显示的 4.95 怎么来）
**混合评分 = AI 自动评 + 用户打分加权**，参考豆瓣/大众点评：

```
ai_avg   = rating_sum / rating_count                       (AI 给每次完成一个 0-5 分)
user_avg = user_rating_sum / user_rating_cnt               (用户完成后可选打分)

display_rating = (ai_avg * 0.4 + user_avg * 0.6 * W_user)
  其中 W_user = user_rating_cnt / (user_rating_cnt + 50)   -- 贝叶斯平滑
  当用户打分人数少时，AI 评分权重更大
```
**前端展示**：`toFixed(2)`；<10 次完成时显示 `—`（避免样本太少）。

### 4.3 "热门" / "新上线" 徽章判定
**按优先级 OR 条件**，一次查询全部徽章：
```sql
SELECT scene_id,
  CASE
    WHEN DATEDIFF(NOW(), published_at) <= 7 THEN '新上线'
    WHEN plays_7d_rank <= 5 THEN '热门'
    WHEN display_rating >= 4.9 AND rating_count >= 1000 THEN '口碑神作'
    WHEN collect_count >= 5000 THEN '高收藏'
    ELSE NULL
  END AS badge
FROM scene_stat_view
```
"热门"的精确定义：
> **过去 7 天参与数** ZSet 排名 Top 5，且 `plays_7d ≥ 500`。
> Redis: `ZADD scene:hot:7d  plays_7d scene_id`，每天 Cron 刷新。

### 4.4 "2340 人参与"
= `scene_stat.total_plays`（去重：一个 user_id 对同一 scene 只计 1 次）
实现：用户第一次提交完成 → `INSERT INTO scene_play(user_id, scene_id) ON DUPLICATE KEY UPDATE updated_at=NOW()`，INSERT 命中时 total_plays++。

### 4.5 "每日更新"选场景的算法
每日 00:00 Cron 生成 `daily_scene_feed`（给所有用户共享）：
```
候选池 = 全部上线场景
排序 =
  w1 * norm(plays_7d)           -- 热度 0.3
+ w2 * norm(display_rating)     -- 评分 0.3
+ w3 * freshness_score          -- 新鲜度 0.2 （上线 ≤14 天=1, >30 天=0.3）
+ w4 * diversity_penalty        -- 多样性 0.1 （昨日同类型扣分）
+ w5 * user_gap_score           -- 能力匹配 0.1 （详见 Part 5）
```
取 Top 7 作为"本周池"，再按日轮播。

### 4.6 用户打分入口
场景结束页加一个星星打分（1–5）→ POST `/scene/{id}/rate` → 写 `scene_rating(user_id, scene_id, stars, text)` + 更新 `scene_stat.user_rating_*`。

---

## Part 5. AI 提升建议

### 5.1 推荐原理（整个 App 最重要的智能模块之一）
> 核心思路：**找出用户能力六维的"短板"，反查 content_tag_map，推荐相应标签的关卡/场景/文章**。
> 参考 Duolingo 的技能树 + Keep 的训练推荐。

### 5.2 Step-by-step 算法
```python
def gen_ai_suggestions(user_id, n=2):
    # 1. 取用户六维 & 全站平均
    me     = query_user_ability(user_id)
    avg    = query_global_ability_avg()   # 全站所有用户均值（缓存）

    # 2. 算 "差值"（百分位），越负越弱
    gap = {dim: me[dim] - avg[dim] for dim in DIMS}

    # 3. 找出最弱的 3 个维度
    weakest_3 = sorted(gap.items(), key=lambda x: x[1])[:3]

    # 4. 对每个弱项 dim，反查 content_tag_map 找主权重 ≥1.3 的 tag
    candidate_tags = []
    for dim, _ in weakest_3:
        tags = query_tags_by_primary_dim(dim, min_weight=1.3)
        candidate_tags.extend(tags)

    # 5. 用 candidate_tags 查可推荐内容（场景/关卡/文章）
    items = search_content_by_tags(
        tags=candidate_tags,
        exclude=user_completed_ids(user_id, within_days=14),
        sort_by='recommend_score'
    )

    # 6. 多样性去重：同一 tag 最多出 1 条
    items = deduplicate_by_primary_tag(items)[:n]

    # 7. 生成文案
    return [build_suggestion_card(item, matched_dim) for item in items]
```

### 5.3 推荐卡片的文案模板
| 弱项维度 | 卡片标题 | 描述模板 |
|---------|---------|---------|
| heart | 提升安全感表达 | 练习在对话中传递稳定和可靠的感觉 |
| vibe | 观察力专项训练 | 学习解读微表情和肢体语言 |
| mouth | 话术库扩展 | 收集 20 个有趣的深度话题 |
| listen | 深度倾听训练 | 学会在对方说话时接住情绪 |
| humor | 幽默破冰练习 | 让对话不再冷场 |
| rescue | 矛盾化解专题 | 面对冷战和吵架的沟通技巧 |

### 5.4 API
```
GET /home/ai_suggestions?n=2
→ 200 OK
{
  "suggestions":[
    {
      "card_id":"SUG_001",
      "title":"提升安全感表达",
      "description":"练习在对话中传递稳定和可靠的感觉",
      "icon":"shield",
      "target":{ "type":"scene", "id": 12 },     -- 点击"去练习"的落地
      "matched_dim":"heart",
      "matched_tags":["温暖表达","感受分享"]
    }
  ],
  "generated_at":"2026-04-17T09:00:00+08:00",
  "expire_in": 86400
}
```
- **每天 00:05 Cron 预生成**，结果写 Redis `user:{id}:ai_suggestions`，TTL 24h
- 用户在 6 维任一维度变动 ≥3 时，强制失效缓存，下次请求实时重算

### 5.5 冷启动（新用户无能力数据）
- 走"诊断页"引导先做物种鉴定（Part 9）→ 直接 SET 六维初值
- 未做诊断时，默认推 3 个新手友好的场景（duration≤8min, difficulty=1, rating≥4.8）

---

## Part 6. 关卡系统

### 6.1 数据表
```sql
level (
  id               INT PK,
  series           VARCHAR(16),         -- 'story' / 'character'
  chapter_no       TINYINT,             -- 第几章 1-5
  stage_no         TINYINT,             -- 章内第几关 1-6
  title            VARCHAR(64),
  story            TEXT,
  unlock_condition JSON,                -- {"prev_level":N} 或 {"ability":{"mouth":60}}
  xp_reward        INT,
  ability_reward   JSON,                -- {"mouth":2, "heart":1}  通关额外加能力分
  tags             JSON,
  ai_script_id     BIGINT
)

user_level_progress (
  user_id     BIGINT,
  level_id    INT,
  status      TINYINT,    -- 0 未开 / 1 通关 / 2 满分通关
  best_score  TINYINT,    -- 0-100
  first_pass_at DATETIME,
  last_play_at DATETIME,
  PK(user_id, level_id)
)
```

### 6.2 解锁规则
- 同章内：`stage_no==1` 默认解锁；`stage_no==N (>1)` 需前一关 `status≥1`
- 跨章：需要上一章通关 4 关以上 (`count(status>=1) >= 4`)
- 部分关卡追加能力门槛：`ability_reward.unlock_ability`，如"第 3 章暧昧第 5 关"需 `heart>=60`

### 6.3 分数计算
单关结束时 AI 给出 `ai_score ∈ [0, 5]`：
```
level_final_score = round(ai_score * 20)         # 映射到 0-100
满分定义：level_final_score >= 90
```
XP 发放：按 `level.xp_reward`，**再次通关只给 30%**（防刷）。

### 6.4 人物挑战第 5 组"危险的人"特殊逻辑
- 必须完成避雷针工具使用 ≥ 3 次（精神操纵识别训练）
- 通关后自动给 `rescue_score += 3`
- 解锁"救场指数"专属成就

---

## Part 7. 每日任务 + 打卡日历

### 7.1 每日任务生成 `daily_task_feed`
**每日 00:00 对所有活跃用户（近 7 日登录）预生成**，放 Redis：

```
候选模板池 30 条，标注 dim / 难度 / XP
算法：
  1. 拿用户六维找最弱 2 维
  2. 从候选池挑 2 条带这 2 个 dim 的任务
  3. 加 1 条"今日场景练习"（固定）
  4. 加 1 条"回顾恋商周报"（周一特化）
  5. 加 1 条随机填充任务
共 5 条，各任务有独立 XP 值 10–50
```

### 7.2 完成结算
```
POST /task/{task_id}/complete
→ 后端校验当日该任务是否完成
→ 加 XP、加能力分、写 user_action_log
→ 若 5 条全完成 → 额外 +30 XP + 解锁「全勤」成就
```

### 7.3 打卡日历
```sql
user_checkin (
  user_id    BIGINT,
  checkin_date DATE,
  source     VARCHAR(16),   -- 'auto'(完成check-in触发) / 'manual'(手动点打卡)
  reward_xp  INT,
  PK(user_id, checkin_date)
)
```
**当日打卡判定**：当日有任何一条 `user_checkin` 记录即可。
**连续天数** `streak_days`：
```
每次打卡后：
  if 昨天有 checkin:  streak_days += 1
  else: streak_days = 1
更新 user.streak_days, 若 > max_streak 更新 max_streak
```

### 7.4 手动打卡（新增）
- 端上点"打卡"按钮 → POST `/checkin/manual`
- 后端：
  - 校验当日是否已打卡 → 是则 409
  - 写入 `user_checkin(source='manual', reward_xp=5)`
  - user.xp += 5
  - 可能触发「7/30/100 天连续」成就

---

## Part 8. 恋爱温度计 HeatUpCard

### 8.1 流程
```
每日 1 次 3 题问卷
→ POST /heatup/submit {q1:"甜蜜满满", q2:"每天都聊", q3:"表达心意"}
→ 后端生成报告 (3 块：温度 / 亲密度 / 成长方向)
→ 存 user_heatup_report 表
→ user.xp += 15
→ 自动触发 user_checkin (source=auto)
→ 发布事件 heatup_completed
```

### 8.2 温度计算
```
温度 = 35 + Σ(qi_score)
  问题 1 选项得分: [满分10, 2, -3, -5, -8]  -- "甜蜜满满"→+10
  问题 2:         [10, 5, 0, -5, -10]
  问题 3:         [5, 3, 3, 3, -5]         -- 只要愿意提升就加分
  最终 clamp [0, 100]
```

### 8.3 亲密度等级
- 80-100 → 🔥 炽热
- 60-79 → ☀️ 温暖
- 40-59 → 🌤️ 平稳
- 20-39 → ❄️ 降温
- 0-19 → 🧊 冰点

---

## Part 9. 物种鉴定 DiagnosticPage

### 9.1 12 物种 ID 与阵营
```
species 表：
id: crazy_kelpie (海王狐), sweet_licker (舔舔狐), veteran (老司狐),
    ghost (装死狐), coward (怂怂狐), plant (植物狐),
    clown (小丑狐), waste (恋废狐), kneeler (跪族狐),
    grass (草泥狐), green_tea (绿茶狐), schemer (心机狐)

camp: `crazy` / `ghost` / `clown` / `evil`   (4 阵营，每阵营 3 种)
```

### 9.2 鉴定问卷
- 15-20 题选择题
- 每个选项对 12 物种打分向量 `scores[species_id]`
- 完成后 `winner = argmax(Σscores)`

### 9.3 能力基线映射
每个物种预设 6 维基线，作为用户首次写入 `user_ability`：

| 物种 | mouth | heart | humor | listen | rescue | vibe |
|------|-------|-------|-------|--------|--------|------|
| 海王狐 | 80 | 45 | 75 | 40 | 70 | 85 |
| 舔舔狐 | 70 | 85 | 50 | 60 | 50 | 55 |
| 老司狐 | 85 | 55 | 80 | 55 | 75 | 80 |
| 装死狐 | 40 | 55 | 45 | 65 | 35 | 40 |
| 怂怂狐 | 35 | 70 | 40 | 70 | 30 | 35 |
| 植物狐 | 45 | 60 | 50 | 75 | 40 | 45 |
| 小丑狐 | 75 | 65 | 85 | 50 | 45 | 80 |
| 恋废狐 | 50 | 50 | 50 | 50 | 50 | 50 |
| 跪族狐 | 55 | 90 | 45 | 70 | 40 | 50 |
| 草泥狐 | 60 | 55 | 65 | 55 | 55 | 70 |
| 绿茶狐 | 75 | 60 | 70 | 65 | 70 | 75 |
| 心机狐 | 80 | 50 | 65 | 70 | 80 | 70 |

### 9.4 重测
- 每月可重测 1 次；重测结果与当前 6 维做 **加权平均 (旧 0.4 + 新 0.6)**，不覆盖

---

## Part 10. 导师系统

### 10.1 表
```sql
coach (
  id           INT PK,
  name         VARCHAR(32),  -- 汪俊豪/余水/占方剑/窦国立
  avatar_url   VARCHAR,
  title        VARCHAR(64),  -- 国家二级心理咨询师
  specialties  JSON,          -- ["情感沟通","共情训练",...]
  articles     INT DEFAULT 0,
  followers    INT DEFAULT 0,
  rating_avg   DECIMAL(3,2), -- 4.90
  rating_count INT DEFAULT 0,
  online       TINYINT,
  price_1v1    INT DEFAULT 299,    -- 分，即 ¥299
  status       TINYINT DEFAULT 1
)

coach_booking (
  id           BIGINT PK,
  user_id      BIGINT,
  coach_id     INT,
  booking_time DATETIME,   -- 咨询时间
  status       TINYINT,    -- 0 待开始 / 1 进行中 / 2 完成 / 3 取消
  paid_amount  INT,
  created_at
)

coach_chat_msg (
  id         BIGINT PK,
  booking_id BIGINT,
  user_id    BIGINT,
  coach_id   INT,
  sender     TINYINT,     -- 1 user / 2 coach / 3 system
  content    TEXT,
  read       TINYINT,
  created_at DATETIME
)
```

### 10.2 导师评分
- 用户每次咨询结束强制 1-5 星打分 + 可选评价
- `coach.rating_avg` 用贝叶斯平均：
```
rating_avg = (rating_sum + GLOBAL_AVG * K) / (rating_count + K)
K = 20  -- 先验样本数
```
- 防刷：同一 booking_id 只能评 1 次

### 10.3 预约流程
```
POST /coach/{id}/book
→ 后端：
   1. 校验用户余额/支付
   2. 生成 booking(booking_time = now + 10min, status=0, paid=299)
   3. 自动发送 system 消息到 coach_chat_msg
   4. 发布事件 coach_booked
   5. 前端写 localStorage（当前做法）未来改为拉接口
→ 响应 200 { booking_id, booking_time }
```

### 10.4 在线状态
- 导师端每 30s 心跳更新 `coach.online`
- 12h 无心跳自动置 0

### 10.5 粉丝 & 关注
```sql
follow_rel (
  follower_id  BIGINT,        -- 用户
  followee_id  BIGINT,        -- 用户或导师（用 entity_type 区分）
  entity_type  TINYINT,       -- 1 user / 2 coach
  created_at,
  PK(follower_id, followee_id, entity_type)
)
```
关注/取关 → 更新 `user.following` / `coach.followers` 冗余字段（异步）。

---

## Part 11. 社区

### 11.1 板块
| 板块 | 表前缀 | 特点 |
|------|-------|------|
| 专栏（Column） | `post` (type=column) | 只有认证导师能发，可付费 |
| 讨论（Discuss） | `post` (type=discuss) | 全体用户可发 |
| 匿名树洞（Tree Hole） | `tree_hole` | 单独表，不关联真实昵称 |

### 11.2 帖子表
```sql
post (
  id           BIGINT PK,
  type         TINYINT,             -- 1 column / 2 discuss
  author_id    BIGINT,
  title        VARCHAR(128),
  content      MEDIUMTEXT,
  cover_url    VARCHAR,
  tags         JSON,
  price        INT DEFAULT 0,       -- 0 免费 / 990 = ¥9.9 / 1290 = ¥12.9
  like_count   INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  collect_count INT DEFAULT 0,
  view_count   INT DEFAULT 0,
  share_count  INT DEFAULT 0,
  hot_score    DECIMAL(10,2),       -- 计算字段，见 11.4
  status       TINYINT DEFAULT 1,
  published_at DATETIME,
  created_at, updated_at
)

tree_hole (
  id         BIGINT PK,
  user_id    BIGINT,          -- 匿名化展示时替换成动物
  animal     VARCHAR(16),     -- "小鹿","狐狸","小熊"...
  emotion    VARCHAR(16),     -- 情绪标签（见 4 色体系）
  content    TEXT,
  like_count INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  created_at DATETIME
)
```

### 11.3 评论
```sql
comment (
  id          BIGINT PK,
  post_id     BIGINT,
  parent_id   BIGINT DEFAULT 0,   -- 二级评论 > 0
  user_id     BIGINT,
  content     TEXT,
  like_count  INT,
  created_at
)
```
二级嵌套即可（UI 不做三层）。`parent_id != 0` 时 push 通知被回复者。

### 11.4 Hot Score（社区 Feed 排序）
**Reddit 公式 + 时间衰减**（参考小红书）：
```
hot_score = log10(max(like*3 + comment*5 + collect*8 + view*0.1, 1))
          + (published_at_ts - 2026-01-01_ts) / 45000
          - penalty_if_reported * 3
每 30min 算一次，写回 post.hot_score，ORDER BY DESC
```

### 11.5 付费文章
- `price > 0` → 显示锁 + "解锁 ¥9.9"
- 购买后写 `post_purchase(user_id, post_id, amount, paid_at)`
- 作者（导师）分成 70%，平台 30%

### 11.6 树洞匿名动物
- 用户每次发树洞，服务端随机 pick 一个 `animal`
- 24h 内同 user 保持同一 animal，次日重置（参考一些树洞产品）

---

## Part 12. 个人主页 & 社交图谱

### 12.1 关注 / 被关注（见 10.5）
### 12.2 头像框 & 皮肤商店
```sql
cosmetic (
  id            VARCHAR(32) PK,   -- 'flame', 'ocean', 'classic_theme'…
  type          TINYINT,          -- 1 头像框 / 2 皮肤
  name          VARCHAR(32),
  price_coin    INT DEFAULT 0,    -- 金币价，0=默认解锁
  unlock_method VARCHAR(64),      -- 'default' / 'vip_pro_plus' / 'level>=15' / 'event_2026_spring'
  preview_url   VARCHAR
)

user_cosmetic (
  user_id     BIGINT,
  cosmetic_id VARCHAR(32),
  unlocked_at DATETIME,
  PK(user_id, cosmetic_id)
)
```
切换写 `user.avatar_frame` / `user.skin_id`。Pro+ VIP 解锁 `rainbow` 框。

### 12.3 动态（Moments）
- 用户所有行为（完成关卡、打卡、解锁成就、发帖）产生的可见记录
- 表 `user_moment(id, user_id, type, target_id, ext_json, visibility, created_at)`
- `visibility` = public / friends / self
- 个人主页拉 `user_moment WHERE user_id=? ORDER BY created_at DESC LIMIT 20`

### 12.4 好友推荐
算法：
```
candidates = 与我关注者重合度高 + 物种相近 + 同样活跃 - 已关注 - 已拉黑
score = 0.4*共同关注 + 0.3*物种相似度 + 0.2*能力互补 + 0.1*最近活跃
```
每日 Cron 预算，写 Redis `user:{id}:friend_rec`，TTL 24h。

---

## Part 13. VIP 会员

### 13.1 档位
| Tier | Code | 月价 | 年价 | 核心权益 |
|------|------|------|------|---------|
| 1 | Lite | ¥8 | ¥68 | 解锁雷达图部分、10次/日AI |
| 2 | Pro | ¥20 | ¥128 | 50次/日AI、雷达图全、建议、彩虹框以外头像框全开 |
| 3 | Pro+ | ¥35 | ¥198 | 无限AI、完全特权、专属彩虹头像框、免排队 |

### 13.2 权益校验中间件
所有 API 请求在 RBAC 之后加 `@require_vip(tier)` 装饰器：
```python
@require_vip(min_tier=2)
def get_full_radar(): ...
```
- 无权限 → 402 `PAYMENT_REQUIRED`
- 端上展示升级弹窗

### 13.3 开通流程
```
POST /vip/purchase {tier, duration_months}
→ 生成订单 order(status=waiting)
→ 对接支付（微信/支付宝 Mock）
→ 支付回调 → user.vip_tier = tier, vip_expire_at = max(now, old_expire) + months*30d
→ 发通知 + 发"VIP 欢迎礼包"（AI 次数 + 头像框）
```

### 13.4 到期处理
每日 Cron 扫 `vip_expire_at < NOW() AND vip_tier > 0` → 降级为 0 + 发到期通知 + 提示续费优惠券。

---

## Part 14. 工具模块

### 14.1 聊天翻译机 ChatTranslator
```
POST /tool/translator
body: { text, image_url?, relation_stage, style_preference:["温柔","幽默","高情商"] }
→ 调 AI (GPT-4 / 自研) 生成:
   subtext: "TA 其实在...",
   replies: [{style:"温柔", text:"..."}, ...]
→ 扣 VIP 次数配额
→ 写 translator_history(user_id, text, ai_result_json)
→ user_ability: listen += 0.75, mouth += 0.5
```
### 14.2 约会锦囊 DatePlanner
```
POST /tool/dateplan
body: { relation, other_tags:[...], scene, budget, time_slot }
→ AI 生成规划 JSON
→ 写 dateplan_history
→ user_ability: vibe += 1.0
```
### 14.3 避雷针 RedFlagDetector
#### 渣值计算（重要算法）
```
前端勾选的 20 项行为各有权重：
  红色 x 8 项： 14 pts
  黄色 x 8 项： 7  pts
  绿色 x 4 项： 3  pts

raw_score = Σ(选中行为权重)
capped    = min(raw_score, 100)

红绿灯档位：
  capped ≥ 60 → 🔴 红灯
  30 ≤ capped < 60 → 🟡 黄灯
  capped < 30 → 🟢 绿灯
```
#### 模式匹配
行为 → 操控模式的映射表 `redflag_pattern_map`：
| 模式 | 触发条件（命中 ≥ 2 项） |
|------|----------------------|
| PUA | ["总说你想多了","贬低我","忽冷忽热"] |
| 面包屑 | ["只聊暧昧不确定","许诺不兑现","从不主动约"] |
| Love Bombing | ["很快说爱你","很快冷下来","情绪起伏大"] |
| 回避型 | ["冷暴力消失","遇事回避","社交媒体不提我"] |
| 养鱼 | ["暧昧多人","只在深夜联系","从不带我见朋友"] |
| 情绪寄生 | ["有事才找我","只聊自己的烦恼","从不问我近况"] |

返回命中模式 + 对应话术/止损建议。

#### 能力奖励
一次完整报告生成 → `rescue_score += 2`（单日封顶 4）。

### 14.4 朋友圈助手 MomentsAssistant
三个子功能同前端 UI：
- 文案生成：GPT 按 {scene, style} 返回 3-4 条
- 人设诊断：4 题选择题 → 总分映射 S/A/B/C
- 发圈策略：从策略库按 target 查预设周计划

---

## Part 15. 成就系统

### 15.1 表
```sql
achievement (
  id            VARCHAR(32) PK,    -- 'streak_7', 'level_full'…
  name          VARCHAR(64),
  description   VARCHAR(128),
  icon          VARCHAR,
  category      VARCHAR(16),       -- 'streak','ability','social','vip','season'
  condition     JSON,              -- {"type":"streak","value":7}
  reward_xp     INT,
  reward_cosmetic VARCHAR,
  is_hidden     TINYINT,
  sort          INT
)

user_achievement (
  user_id        BIGINT,
  achievement_id VARCHAR(32),
  unlocked_at    DATETIME,
  PK(user_id, achievement_id)
)
```

### 15.2 成就触发时机
事件驱动（见 Part 18）：
```
on event 'checkin_done':
    if streak_days == 7 → unlock 'streak_7'
    if streak_days == 30 → unlock 'streak_30'
    if streak_days == 100 → unlock 'streak_100'
on event 'ability_updated':
    if all 6 dims >= 80 → unlock 'all_rounded'
    if any dim >= 95 → unlock 'master_{dim}'
on event 'level_pass':
    count += 1; at 10 → 'practice_10'; at 50 → 'practice_50'
on event 'post_liked':
    if post.like_count crosses 100 → unlock 'viral_author'
```

---

## Part 16. 搜索 / Feed 排序

### 16.1 搜索架构
- ES 索引三份：`scene_idx`, `post_idx`, `coach_idx`
- 查询时 `multi_match` 搜 `title^3, subtitle^2, tags^5, content^1`
- 加权：`function_score` = base × (1 + log(play_count)) × freshness

### 16.2 热搜词
```
hot_search_keyword (
  keyword    VARCHAR(32) PK,
  weight     INT,
  expire_at  DATETIME
)
```
每 15min Cron 从 `user_search_log` 聚合 TOP 10 写进去。

### 16.3 个人近期搜索
`user_search_log(user_id, keyword, created_at)`，前端按 user 拉最近 5 条。

---

## Part 17. 通知中心

### 17.1 表
```sql
notification (
  id          BIGINT PK,
  user_id     BIGINT,
  type        VARCHAR(32),   -- 'level_up', 'coach_booked', 'comment_reply'…
  title       VARCHAR(64),
  body        TEXT,
  link        VARCHAR(128),  -- foxsay://coach/chat/3
  is_read     TINYINT,
  priority    TINYINT,       -- 0 普通 / 1 重要 / 2 紧急
  created_at  DATETIME
)
```

### 17.2 触发源
| 事件 | 通知 | 优先级 |
|------|------|-------|
| 升级 | "恭喜升级至 Lv.N（恋爱学徒）" | 1 |
| 预约成功 | "{coach}老师已确认, HH:MM 开始..." | 1 |
| 导师回复 | "{coach}给你发了新消息" | 1 |
| 周报生成 | "本周恋商周报出炉！" | 0 |
| 成就解锁 | "连续 7 天，解锁「恒心初现」" | 0 |
| 被评论 | "{user} 回复了你的帖子" | 0 |
| 被关注 | "{user} 关注了你" | 0 |
| VIP 到期 | "你的 Pro 会员今天到期" | 1 |

### 17.3 推送通道
- 站内：存 `notification` + WebSocket 实时
- 手机 Push：APNs/FCM（需用户开通）

---

## Part 18. 事件总线与定时任务

### 18.1 Event 列表（写入消息队列）
```
user.signup
user.login
user.ability_updated
user.level_up
user.xp_changed

checkin.done
task.completed
scene.completed
level.passed

coach.booked
coach.message_sent
coach.session_completed

community.post_published
community.post_liked
community.comment_added

vip.purchased
vip.expired

tool.translator_used
tool.dateplan_generated
tool.redflag_reported
```
### 18.2 消费者
- **AbilityService**：订阅 `scene.completed / level.passed / tool.* / tree_hole.posted` → 按 Part 2 更新 `user_ability`
- **AchievementService**：订阅几乎所有 → 检查 `achievement.condition`
- **NotificationService**：订阅 `coach.* / level_up / achievement.*` 等
- **XPService**：订阅 `*.completed/liked` → 加 XP → 检查升级 → 发 `level_up`

### 18.3 Cron 列表
| 名称 | 频率 | 动作 |
|------|------|------|
| `daily_feed_refresh` | 每日 00:00 | 刷新今日场景池 / 日任务 / AI 建议 |
| `weekly_report` | 每周一 00:05 | 生成恋商周报、快照雷达 |
| `hot_score_refresh` | 每 30min | 重算社区帖子 hot_score |
| `scene_hot_rank` | 每日 01:00 | 7 日参与度 ZSet 刷新 |
| `vip_expire_scan` | 每日 02:00 | VIP 到期降级 |
| `coach_offline_scan` | 每 10min | 无心跳导师离线 |
| `search_hot_refresh` | 每 15min | 热搜榜 |
| `friend_rec_refresh` | 每日 03:00 | 好友推荐 |
| `achievement_retry` | 每 6h | 补偿扫描（防止事件丢失） |

---

## 附录 A. ER 图
```
user ──< user_ability
user ──< user_level_progress >── level
user ──< user_checkin
user ──< user_moment
user ──< user_achievement >── achievement
user ──< follow_rel >── user/coach
user ──< coach_booking >── coach
  coach_booking ──< coach_chat_msg
user ──< post >── comment
user ──< tree_hole
user ──< user_cosmetic >── cosmetic
user ──< notification
user ──< user_search_log
post ──< post_purchase
scene ──< scene_play (user)
scene ──< scene_rating (user)
content_tag_map (content_tag → ability_dim, weight)
ability_delta_rule (action_type × dim → delta)
```

---

## 附录 B. REST API 一览（节选）

### B.1 首页
```
GET  /home/greeting                    -> 问候 + 等级信息
GET  /home/today_scene                 -> 今日场景推荐（1-2 张）
GET  /home/ai_suggestions?n=2          -> AI 提升建议
GET  /home/task_list                   -> 今日任务
GET  /home/heatup/status               -> 今日是否已 check-in
POST /home/heatup/submit               -> 提交 heatup 问卷
```
### B.2 练习
```
GET  /scene                            -> 场景列表
GET  /scene/{id}                       -> 详情 + ai_script
POST /scene/{id}/start                 -> 开始一局（返回 session_id）
POST /scene/{id}/submit                -> 提交一轮对话
POST /scene/{id}/finish                -> 结束 + 打分
POST /scene/{id}/rate                  -> 用户打分

GET  /level?series=story&chapter=2
POST /level/{id}/play
POST /level/{id}/finish
```
### B.3 能力 & 雷达
```
GET  /ability/me                       -> 六维当前
GET  /ability/me/history?weeks=5       -> 五周趋势
GET  /ability/leaderboard?dim=heart    -> 单维排行榜（VIP）
```
### B.4 导师
```
GET  /coach                            -> 列表
GET  /coach/{id}                       -> 详情
POST /coach/{id}/book                  -> 预约
GET  /coach/bookings                   -> 我的预约
GET  /coach/chat/{booking_id}          -> 聊天记录
POST /coach/chat/{booking_id}/send     -> 发消息
POST /coach/chat/{booking_id}/rate     -> 咨询评分
```
### B.5 社区
```
GET  /post?type=column&tag=&sort=hot
GET  /post/{id}
POST /post
POST /post/{id}/like
POST /post/{id}/collect
POST /post/{id}/comment
POST /post/{id}/purchase
GET  /tree_hole
POST /tree_hole
```
### B.6 工具
```
POST /tool/translator
POST /tool/dateplan
POST /tool/redflag
POST /tool/moments/copy
POST /tool/moments/diagnose
```
### B.7 打卡/任务
```
POST /checkin/manual
POST /task/{id}/complete
GET  /checkin/calendar?month=2026-04
```
### B.8 VIP
```
GET  /vip/plans
POST /vip/purchase
GET  /vip/me
```
### B.9 个人中心
```
GET  /user/me
PATCH /user/me  (nickname / avatar / skin / frame)
GET  /user/me/moments
GET  /user/me/achievements
GET  /user/me/notifications
POST /user/me/notification/{id}/read
POST /follow     { target_id, target_type }
DELETE /follow   { target_id, target_type }
```
### B.10 搜索
```
GET /search?q=&type=scene
GET /search/hot
GET /search/history
```

---

## 最后：几个需要后端特别注意的全局一致性约束

1. **所有涉及 XP / 能力分的加法** 只能在 `XPService` / `AbilityService` 内单点计算，禁止散落在各业务服务。
2. **热门 / 评分 / 连续天数** 永远以 DB 为准；前端缓存仅用于展示，每次进入对应页刷新。
3. **幂等性**：`POST /xx/finish` 必须带 `session_id`，重复提交返回第一次结果。
4. **事务**：XP + 能力 + 成就检查必须在一个事务或 Saga 内，失败回滚。
5. **数据一致性**：每周 Cron `data_consistency_check`：对比 `post.like_count` 与 `post_like_log` 行数，超过阈值报警。
6. **风控**：每天 `user_action_log` 按 `(user_id, action_type)` 聚合，超过模板配额自动禁用 XP 发放（可补偿人工恢复）。

---

**END** · 本文档作为后端开发基线规范。后续如功能迭代，任何"新硬编码数字"都需补进本文档或 `config_system` 表，避免魔法值散落代码库。
