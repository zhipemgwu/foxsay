/**
 * 生成 FoxSay 数据填写模板到桌面
 */
const fs = require('fs');
const path = require('path');

const dest = 'C:/Users/jay/Desktop/升级吧老实人/FoxSay数据填写';
fs.mkdirSync(dest, { recursive: true });

// ========== 角色卡模板 ==========
function roleTemplate(kid) {
  return {
    '_填写说明': '请填写下方所有字段，空字符串和空数组表示待填写',
    core: {
      kid,
      name: '',
      age: 0,
      gender: 'female 或 male',
      identities: ['身份1', '身份2'],
      one_line_summary: '一句话概括这个角色的核心特点'
    },
    background: {
      growth_experience: '成长经历',
      family_background: '家庭背景',
      education: '学历/职业',
      key_events: ['人生关键事件1', '人生关键事件2'],
      trauma_or_scar: '内心创伤或隐痛（可选）'
    },
    appearance: {
      overall_impression: '整体外貌印象（一句话）',
      physique: { height: '165cm', weight: '50kg', body_shape: '体型描述' },
      facial_features: { face_shape: '脸型', skin_tone: '肤色', eyes: '眼睛描述', nose: '鼻子', lips: '嘴唇' },
      hair: '发型描述',
      distinguishing_marks: '特殊标记（纹身/疤痕/痣，没有填「无」）'
    },
    personality: {
      core_traits: ['核心性格1', '核心性格2'],
      surface_traits: ['表面性格1', '表面性格2'],
      inner_traits: ['内在性格1', '内在性格2'],
      temperament: '气质描述',
      moral_bottom_line: '道德底线/绝不会做的事',
      biggest_fear: '最害怕的事',
      biggest_desire: '最渴望的事'
    },
    emotional_triggers: {
      anger_triggers: ['让TA生气的事1', '让TA生气的事2'],
      soft_triggers: ['让TA心软的事1', '让TA心软的事2'],
      vulnerability_triggers: ['让TA脆弱的事1', '让TA脆弱的事2']
    },
    communication: {
      speak_style: '说话风格描述',
      voice_tone: '语气描述',
      common_phrases: ['口头禅1', '口头禅2'],
      emoji_habit: 'emoji使用习惯',
      text_style: '发消息的风格（短句/长段/语音多等）',
      reply_speed: '回复速度习惯'
    },
    habitual_mannerisms: ['习惯性小动作1', '习惯性小动作2', '习惯性小动作3'],
    lifestyle: {
      daily_clothing: ['日常穿搭1', '日常穿搭2'],
      special_occasion_clothing: ['特殊场合穿搭'],
      accessories: ['配饰偏好'],
      hobbies: ['爱好1', '爱好2'],
      food_preference: '饮食偏好',
      living_environment: '居住环境描述'
    },
    relationships: {
      '_说明': '填写与其他角色的关系，ref_kid填对方的KID（如R002）',
      entries: [{ ref_kid: '', name: '对方名字', relation: '关系', attitude: '对对方的态度' }]
    },
    nsfw_settings: {
      '_说明': '可选项，不需要可以整个删掉或enabled改false',
      enabled: false,
      taboos: [],
      fetishes: [],
      complexes: []
    },
    ai_instruction: {
      '_说明': '控制AI扮演这个角色时的行为',
      do: ['要做的事1', '要做的事2'],
      dont: ['不要做的事1', '不要做的事2']
    }
  };
}

const roles = {};
for (let i = 1; i <= 20; i++) {
  const kid = 'R' + String(i).padStart(3, '0');
  roles[kid] = roleTemplate(kid);
}
const roleData = {
  '_使用说明': 'FoxSay 角色卡数据表。每个角色一个唯一KID（R001-R020）。填完后发给开发者更新到项目。不需要的角色可以删掉整个KID块。',
  '_KID规则': 'R + 三位数字。关卡通过KID引用角色。',
  roles
};
fs.writeFileSync(path.join(dest, '角色卡-role-cards.json'), JSON.stringify(roleData, null, 2), 'utf-8');
console.log('角色卡模板: 20个角色槽位 (R001-R020)');

// ========== 关卡模板 ==========
const storyChapters = [
  { id: 1, name: '初遇' }, { id: 2, name: '破冰' },
  { id: 3, name: '暧昧' }, { id: 4, name: '热恋' }, { id: 5, name: '考验' },
];
const challengeGroups = [
  { id: 1, name: '温柔的人' }, { id: 2, name: '疏离的人' },
  { id: 3, name: '闪耀的人' }, { id: 4, name: '脆弱的人' }, { id: 5, name: '危险的人' },
];

function levelTemplate(kid, chapterId, chapterName, levelIndex, mode) {
  return {
    '_填写说明': '请填写所有空字符串和空数组字段',
    meta: {
      kid,
      title: '',
      mode,
      chapter_id: chapterId,
      chapter_name: chapterName,
      level_index: levelIndex,
      difficulty: 'easy / medium / hard / expert',
      estimated_turns: 12,
      unlock_condition: levelIndex === 1 ? '无（首关免费）' : '通过上一关',
      vip_required: levelIndex >= 5
    },
    world: {
      era: '现代都市',
      city: '',
      season: '',
      world_rules: '现实世界，没有超自然元素',
      social_context: '',
      tone: ''
    },
    scene: {
      location: '',
      time_of_day: '',
      weather: '',
      atmosphere: '',
      sensory_details: { visual: '', audio: '', smell: '', touch: '' },
      props: []
    },
    story_node: {
      premise: '',
      player_objective: '',
      narrative_arc: '',
      key_plot_beats: [],
      branching_hints: { good_path: '', neutral_path: '', bad_path: '' }
    },
    characters: {
      '_说明': 'role_kid填角色卡的KID（如R001），可以有多个NPC',
      npc_list: [{
        role_kid: '',
        role_in_this_level: '',
        current_mood: '',
        current_status: '',
        attitude_toward_player: '',
        this_level_special_behavior: ''
      }],
      player_role: { identity: '', player_knows: '', player_doesnt_know: '' }
    },
    dialogue: {
      opening_message: '',
      opening_choices: [],
      system_narration_style: '第二人称（你），带有轻小说的画面感',
      max_turns: 20,
      min_turns_for_good_ending: 8
    },
    scoring: {
      dimensions: [
        { name: '自然度', weight: 0.3, description: '对话是否自然不做作' },
        { name: '情商', weight: 0.25, description: '是否能读懂对方的情绪和暗示' },
        { name: '吸引力', weight: 0.25, description: '是否展现了个人魅力和价值' },
        { name: '分寸感', weight: 0.2, description: '是否知道什么时候进什么时候退' }
      ],
      pass_score: 60,
      perfect_score_threshold: 90,
      fail_conditions: ['连续3次让对方不舒服', '使用侮辱性语言', '完全偏离剧情']
    },
    endings: {
      good: { title: '', description: '', reward: '' },
      neutral: { title: '', description: '', reward: '' },
      bad: { title: '', description: '', reward: '' }
    },
    tags: []
  };
}

// 剧情故事 30关
const storyLevels = {};
let si = 1;
for (const ch of storyChapters) {
  for (let lv = 1; lv <= 6; lv++) {
    const kid = 'LS' + String(si).padStart(3, '0');
    storyLevels[kid] = levelTemplate(kid, ch.id, ch.name, lv, 'story');
    si++;
  }
}
fs.writeFileSync(path.join(dest, '剧情关卡-story-levels.json'), JSON.stringify({
  '_使用说明': 'FoxSay 剧情故事关卡表（30关 = 5章×6关）。KID格式：LS+三位数字。',
  '_章节对应': 'LS001-LS006=初遇, LS007-LS012=破冰, LS013-LS018=暧昧, LS019-LS024=热恋, LS025-LS030=考验',
  levels: storyLevels
}, null, 2), 'utf-8');
console.log('剧情故事关卡: 30关 (LS001-LS030)');

// 人物邂逅 30关
const encLevels = {};
let ei = 1;
for (const g of challengeGroups) {
  for (let lv = 1; lv <= 6; lv++) {
    const kid = 'LE' + String(ei).padStart(3, '0');
    encLevels[kid] = levelTemplate(kid, g.id, g.name, lv, 'encounter');
    ei++;
  }
}
fs.writeFileSync(path.join(dest, '邂逅关卡-encounter-levels.json'), JSON.stringify({
  '_使用说明': 'FoxSay 人物邂逅关卡表（30关 = 5组×6关）。KID格式：LE+三位数字。',
  '_分组对应': 'LE001-LE006=温柔的人, LE007-LE012=疏离的人, LE013-LE018=闪耀的人, LE019-LE024=脆弱的人, LE025-LE030=危险的人',
  levels: encLevels
}, null, 2), 'utf-8');
console.log('人物邂逅关卡: 30关 (LE001-LE030)');

// 填写指南
const guide = `═══════════════════════════════════
  FoxSay 数据填写指南
═══════════════════════════════════

【文件清单】
  1. 角色卡-role-cards.json      → 20个角色槽位 (R001-R020)
  2. 剧情关卡-story-levels.json  → 30关 (LS001-LS030)
  3. 邂逅关卡-encounter-levels.json → 30关 (LE001-LE030)

【剧情故事 30关 对照表】
  章节1「初遇」: LS001(第1关) LS002(第2关) LS003(第3关) LS004(第4关) LS005(第5关) LS006(第6关)
  章节2「破冰」: LS007(第1关) LS008(第2关) LS009(第3关) LS010(第4关) LS011(第5关) LS012(第6关)
  章节3「暧昧」: LS013(第1关) LS014(第2关) LS015(第3关) LS016(第4关) LS017(第5关) LS018(第6关)
  章节4「热恋」: LS019(第1关) LS020(第2关) LS021(第3关) LS022(第4关) LS023(第5关) LS024(第6关)
  章节5「考验」: LS025(第1关) LS026(第2关) LS027(第3关) LS028(第4关) LS029(第5关) LS030(第6关)

【人物邂逅 30关 对照表】
  组1「温柔的人」: LE001-LE006
  组2「疏离的人」: LE007-LE012
  组3「闪耀的人」: LE013-LE018
  组4「脆弱的人」: LE019-LE024
  组5「危险的人」: LE025-LE030

【KID 命名规则】
  角色卡:   R + 三位数字  (R001, R002 ... R020)
  剧情关卡: LS + 三位数字 (LS001-LS030)
  邂逅关卡: LE + 三位数字 (LE001-LE030)

【关卡怎么引用角色卡】
  在关卡的 characters → npc_list 里的 role_kid 字段
  填对应角色的 KID，比如 "role_kid": "R001"
  一个关卡可以引用多个角色（多个NPC同时出场）
  一个角色可以被多个关卡引用（同一个人出现在不同关卡）

【填写技巧】
  - 不需要的角色/关卡槽位可以整个删掉
  - opening_message 是AI的开场白，写得越有画面感越好
  - emotional_triggers 决定AI什么时候发火/心软/脆弱，很关键
  - ai_instruction 的 do/dont 是硬性指令，越明确效果越好
  - 评分维度 scoring.dimensions 可以按关卡特点调整权重
  - JSON字符串里不要用中文引号 "" ，用「」代替
  - 填完发给我，我直接更新到项目里
`;
fs.writeFileSync(path.join(dest, '填写指南.txt'), guide, 'utf-8');
console.log('填写指南已生成');
console.log('\n全部文件已保存到: ' + dest);
