/**
 * L026-L030 关卡卡（对应 R026-R030）
 */
const levels = {};

// ============ L026 — 大学社团招新 (顾小白 R026) ============
levels['L026'] = {
  meta: { kid: 'L026', title: '社团招新的小奶狗学弟', chapter_id: 7, chapter_name: '依恋·读懂你', level_index: 1, difficulty: 'easy', estimated_turns: 13, unlock_condition: '完成 L025', vip_required: false },
  world: { era: '现代都市', city: '杭州', season: '九月', world_rules: '大学校园', social_context: '社团招新大露天摆摊', tone: '活泼、心动、甜' },
  scene: {
    location: '大学食堂前广场社团招新摊',
    time_of_day: '下午3点',
    weather: '晴好',
    atmosphere: '人多热闹+各种社团喊招新',
    sensory_details: { visual: '他坐在"读书社"的摊位前，眼睛看到你瞬间亮了', audio: '喊招新声+欢笑', smell: '初秋空气+他身上淡淡的香皂味', touch: '他递给你的报名表温度' },
    props: ['他们社团招新的一堆书', '他紧张搓着的一支笔', '报名表上他写错3次的字']
  },
  story_node: {
    premise: '你路过读书社的招新摊位。坐在摊位前的男生一眼看见你，耳朵瞬间红了。他是那种会脸红的大一学弟。',
    player_objective: '跟一个明显对你有好感的年下小奶狗相处 —— 既不辜负也不过度承诺',
    narrative_arc: '他紧张搭话 → 你平常应对 → 他主动介绍社团 → 你顺着话题聊到他 → 留个联系方式',
    key_plot_beats: [
      '他看见你瞬间坐直',
      '他介绍社团的紧张',
      '他忽然说"你一定很喜欢书吧"',
      '聊到一本你们都喜欢的书',
      '他鼓足勇气加你微信',
      '他反复确认是否打错'
    ],
    branching_hints: {
      good_path: '温暖+鼓励+不吃他 → 他小心翼翼开始聊天',
      neutral_path: '正常填表+加社团 → 偶尔打招呼',
      bad_path: '吊他胃口/冷淡 → 他受挫然后远离'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R026', role_in_this_level: '招新的社团学弟', current_mood: '心动+紧张', current_status: '招新第一天就碰到心动的人', attitude_toward_player: '仰望+手足无措', this_level_special_behavior: '说话会卡壳+偶尔脸红+会直接说"我能加你微信吗"' }],
    player_role: { identity: '路过的学姐', player_knows: '他是读书社的学弟', player_doesnt_know: '他会在之后把你的微信截图给室友看一下午' }
  },
  dialogue: {
    opening_message: '你随便在几个招新摊前逛着。\n\n"读书社！喜欢读书的同学欢迎——"\n\n一个坐在摊位前的男生看见你走近，声音明显停了一下，然后整个人坐直了。\n\n"学、学姐好！我们是读书社……" 他努力维持镇定，但耳朵已经红透了。',
    opening_choices: ['「几点可以填表？」（正常）', '「你们社团都读什么书？」（感兴趣）', '「你是不是有点紧张？」（调皮）'],
    system_narration_style: '第二人称，甜、校园风',
    max_turns: 18,
    min_turns_for_good_ending: 8
  },
  scoring: {
    dimensions: [{ name: '温暖', weight: 0.35, description: '不嘲笑他的紧张' }, { name: '不吃', weight: 0.3, description: '不利用他的心动' }, { name: '真诚', weight: 0.2, description: '真聊内容' }, { name: '鼓励', weight: 0.15, description: '给他一点勇气' }],
    pass_score: 55,
    perfect_score_threshold: 90,
    fail_conditions: ['故意调戏他看他反应', '拿他的紧张发朋友圈', '给他暧昧信号又消失']
  },
  endings: {
    good: { title: '他的第一次勇敢', description: '"学姐……我能加你微信吗？" 他低着头递手机过来，手微微在抖。你刚扫完码他眼睛亮得像小狗。', reward: '解锁下一关 + "温柔学姐"成就' },
    neutral: { title: '填个表', description: '你加了社团群聊，偶尔在活动见', reward: '解锁下一关' },
    bad: { title: '戳痛了', description: '他被你几句话伤到，之后社团活动都躲着你', reward: '无' }
  },
  tags: ['学弟', '小奶狗', '校园', '甜']
};

// ============ L027 — 烘焙教室的相遇 (江月 R027) ============
levels['L027'] = {
  meta: { kid: 'L027', title: '烘焙教室的相遇', chapter_id: 7, chapter_name: '依恋·读懂你', level_index: 2, difficulty: 'easy', estimated_turns: 13, unlock_condition: '完成 L026', vip_required: false },
  world: { era: '现代都市', city: '成都', season: '春天', world_rules: '周末烘焙教室', social_context: '你报的烘焙体验课', tone: '温暖、治愈、安心' },
  scene: {
    location: '私房烘焙教室',
    time_of_day: '周六上午10点',
    weather: '晴',
    atmosphere: '黄油香+糖粉+暖色灯',
    sensory_details: { visual: '她穿卡其色围裙，头发扎起来，手上沾着面粉', audio: '搅拌器声+笑声', smell: '黄油+糖+刚烤的面包', touch: '面团的温度' },
    props: ['她手上的面团', '一盘没烤的曲奇', '她挂在脖子上的老式木质围裙绳']
  },
  story_node: {
    premise: '你为了散心报了一个烘焙体验课。老师是一个温柔得像邻家姐姐的女生——她的教学方式很有治愈感。',
    player_objective: '跟一个天然姐姐系的老师建立一段温暖自然的连接',
    narrative_arc: '你笨手笨脚 → 她耐心纠正 → 你们边做边聊 → 她看出你情绪不好 → 她的一句话让你感动',
    key_plot_beats: [
      '你手忙脚乱的瞬间',
      '她靠过来手把手教',
      '你们聊起为什么学烘焙',
      '她看出你其实有心事',
      '她没深问只是说"做饭做蛋糕对人有好处"',
      '下课时她送你一盒她做的饼干'
    ],
    branching_hints: {
      good_path: '放松接受她的照顾+真诚互动 → 她主动下次再约',
      neutral_path: '正常完成课程 → 成为常客',
      bad_path: '太拘谨或者想借机调情 → 她礼貌保持老师距离'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R027', role_in_this_level: '烘焙老师', current_mood: '平静温暖的周末状态', current_status: '教室里今天有6个学员', attitude_toward_player: '温和有耐心', this_level_special_behavior: '会观察学员的情绪+适时的一句话让人放松。不会深挖对方隐私' }],
    player_role: { identity: '烘焙体验学员', player_knows: '她是这家店的老师+老板', player_doesnt_know: '她其实开这家店是为了治愈自己的抑郁' }
  },
  dialogue: {
    opening_message: '你的面团发得不太好。\n\n你皱着眉看着那坨看起来很丑的面团，忍不住叹气。\n\n"没事的——" 一个温柔的声音从旁边响起。她走过来，也不嫌弃那团东西，手指轻轻按了按。\n\n"它就是需要多揉一会儿。人也是。" 她抬头笑了一下。"我们一起。"',
    opening_choices: ['（跟她一起揉）', '「老师，我是不是很笨？」', '「谢谢老师。」'],
    system_narration_style: '第二人称，治愈感+生活细节',
    max_turns: 18,
    min_turns_for_good_ending: 8
  },
  scoring: {
    dimensions: [{ name: '放松', weight: 0.35, description: '接受她的照顾' }, { name: '真诚', weight: 0.3, description: '不装坚强' }, { name: '尊重', weight: 0.2, description: '保持学员身份' }, { name: '温暖', weight: 0.15, description: '互相温暖' }],
    pass_score: 55,
    perfect_score_threshold: 90,
    fail_conditions: ['借机搭讪', '刻意表现', '过于拘谨不开口']
  },
  endings: {
    good: { title: '一盒饼干', description: '下课时她塞给你一个牛皮纸包："带回去吃。" —— 里面是她亲手加了烤杏仁的版本，不是课上的版本', reward: '解锁下一关 + "被看见"成就' },
    neutral: { title: '下周再来', description: '正常结束课程，你加了她店的企业微信', reward: '解锁下一关' },
    bad: { title: '学员而已', description: '她对你客客气气但没有更多', reward: '无' }
  },
  tags: ['烘焙', '姐姐', '治愈', '温暖']
};

// ============ L028 — 设计事务所的合作 (秦远 R028) ============
levels['L028'] = {
  meta: { kid: 'L028', title: '设计事务所的合作', chapter_id: 7, chapter_name: '依恋·读懂你', level_index: 3, difficulty: 'very_hard', estimated_turns: 18, unlock_condition: '完成 L027', vip_required: true },
  world: { era: '现代都市', city: '北京', season: '秋天', world_rules: '建筑设计事务所', social_context: '你们的团队跟他们事务所合作一个项目', tone: '克制、缓慢、深' },
  scene: {
    location: '他的工作室会议室',
    time_of_day: '傍晚6点',
    weather: '阴',
    atmosphere: '极简+安静+只有笔尖的声音',
    sensory_details: { visual: '他穿黑色高领+金属边眼镜，专注看图纸', audio: '笔尖+空调+远处办公室关门声', smell: '木+硫酸纸', touch: '图纸粗糙的质感' },
    props: ['他手里的图纸', '他办公桌上没拆的咖啡', '他从不接的手机']
  },
  story_node: {
    premise: '你们团队跟他的事务所合作一个建筑项目。今天开会到很晚，其他人都走了只剩你们俩在过图纸——他是典型的回避型依恋：极其专业，但情感上几乎不给任何反馈。这是本章最难的关卡（测试"依恋风格"字段效果）。',
    player_objective: '跟一个回避型依恋的人建立安全连接 —— 你越急他越远，你先退他才会慢慢靠近',
    narrative_arc: '专业讨论 → 你意识到他在退 → 你反而退一步给空间 → 他慢慢开口 → 一个微小的破冰瞬间',
    key_plot_beats: [
      '他的冷静克制',
      '你问一个越界的问题他立刻退开',
      '你识破+不追问',
      '你聊他的项目他慢慢多说了一点',
      '他主动问你一个问题',
      '他关灯前对你说一句不相关的话'
    ],
    branching_hints: {
      good_path: '给他空间+不粘人+让他先开口 → 他第一次主动发信息',
      neutral_path: '专业合作完美+情感零进展',
      bad_path: '追问/要求回应 → 他直接消失一周'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R028', role_in_this_level: '合作方主理人', current_mood: '封闭的专注', current_status: '连续加班两周', attitude_toward_player: '专业关系', this_level_special_behavior: '任何情感层面的追问会让他物理性退开。安全感在对他的"不追问"中慢慢建立。依恋风格：回避型，绝对不能skip情感递进阶段' }],
    player_role: { identity: '合作团队方', player_knows: '他专业强+不好相处', player_doesnt_know: '他父母都是精英但童年极度缺爱+他上一段长期关系因为他"无法在场"结束' }
  },
  dialogue: {
    opening_message: '其他人都走了。\n\n会议室只剩下你们俩和桌面上一堆图纸。\n\n他翻到第13版立面图，手指在某个位置停了一下，然后用他那种极轻极克制的声音说：\n\n"这里的比例——跟你们原始方案矛盾了。"\n\n他没抬头。眼镜挡着，你完全看不清他眼睛里在想什么。',
    opening_choices: ['「是团队上周修的，我再问一下。」（专业）', '「你怎么看这个改动？」（邀请他表达）', '「你累了吗？要不我们明天再过。」（给台阶）'],
    system_narration_style: '第二人称，极度克制+描写留白',
    max_turns: 26,
    min_turns_for_good_ending: 13
  },
  scoring: {
    dimensions: [{ name: '耐心', weight: 0.35, description: '不急不追问' }, { name: '空间', weight: 0.3, description: '给他情感空间' }, { name: '专业', weight: 0.2, description: '工作层面做到位' }, { name: '观察', weight: 0.15, description: '识别他的退让' }],
    pass_score: 75,
    perfect_score_threshold: 96,
    fail_conditions: ['要求他立刻回复', '质问"你为什么这么冷"', '情感攻击"你根本不在乎"']
  },
  endings: {
    good: { title: '他的主动', description: '几天后的周末他发了一条信息："那张图我重看了。你当时说的对。——周一再聊。" 这是他第一次主动联系', reward: '解锁下一关 + "读懂回避型"成就' },
    neutral: { title: '合作完成', description: '项目完美交付。他跟你恢复客套距离', reward: '解锁下一关' },
    bad: { title: '合作难以为继', description: '他申请换了对接人，之后两年再没联系', reward: '无' }
  },
  tags: ['回避型', '依恋风格', '建筑师', '克制', 'VIP']
};

// ============ L029 — 咨询室外的焦虑女孩 (江雨 R029) ============
levels['L029'] = {
  meta: { kid: 'L029', title: '咨询室外的她', chapter_id: 7, chapter_name: '依恋·读懂你', level_index: 4, difficulty: 'very_hard', estimated_turns: 17, unlock_condition: '完成 L028', vip_required: true },
  world: { era: '现代都市', city: '上海', season: '冬天', world_rules: '心理咨询中心', social_context: '你在做心理咨询，她是另一个来访者', tone: '敏感、脆弱、温柔' },
  scene: {
    location: '心理咨询中心等候区',
    time_of_day: '晚上7点',
    weather: '小雨',
    atmosphere: '温暖灯光+加湿器+沙发',
    sensory_details: { visual: '她抱着一本笔记本蜷在沙发上，眼睛微红', audio: '加湿器+远处谈话', smell: '松木香+纸张', touch: '沙发的柔软' },
    props: ['她手里紧握的笔记本', '桌上一杯没喝的茶', '她每5分钟看一次的手机']
  },
  story_node: {
    premise: '你去做心理咨询，提前到了。等候区另一个沙发上，一个女生抱着笔记本蜷着，明显刚哭过。她是另一个来访者。这是本章测试"焦虑型依恋"字段的关卡。',
    player_objective: '跟一个焦虑型依恋的人建立"稳定可预测"的安全感 —— 她需要的是稳定不是激情',
    narrative_arc: '你安静陪坐 → 她主动说一句 → 简短温柔对话 → 她问一个典型的焦虑型问题 → 你给出"稳定"的回答',
    key_plot_beats: [
      '她意外开口说话',
      '她紧张地反复确认你不烦她',
      '她说了一半收回去',
      '你温和说"没关系慢慢说"',
      '她开始真的放松',
      '分开时她要了你微信+反复问"我加你会不会打扰你"'
    ],
    branching_hints: {
      good_path: '稳定+明确+不忽冷忽热 → 她感到被接住',
      neutral_path: '礼貌安慰 → 她感谢但没有后续',
      bad_path: '忽冷忽热/承诺大于能给的 → 她立刻陷入她最大的恐惧'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R029', role_in_this_level: '另一个来访者', current_mood: '咨询结束后的情绪余波', current_status: '正在克服童年创伤', attitude_toward_player: '试探+渴望但害怕', this_level_special_behavior: '会反复确认"我是不是打扰你"。需要稳定而非浪漫。依恋风格：焦虑型' }],
    player_role: { identity: '另一个来访者', player_knows: '她也在做咨询', player_doesnt_know: '她童年被忽视所以现在渴望但恐惧亲密' }
  },
  dialogue: {
    opening_message: '咨询室外。等候区只有你们两个人。\n\n你坐下没多久，旁边那个女生——抱着笔记本蜷在沙发一角，眼睛微红——小声地开口：\n\n"不好意思……你也是来做咨询的吗？" 她说完立刻后悔了："对不起我是不是不该问——"',
    opening_choices: ['「是。没关系的，想聊可以聊聊。」', '「是。你想喝水吗？」（行动关心）', '（微笑点头然后给她空间）'],
    system_narration_style: '第二人称，温柔+大量内心细节',
    max_turns: 24,
    min_turns_for_good_ending: 12
  },
  scoring: {
    dimensions: [{ name: '稳定', weight: 0.4, description: '一致性不忽冷忽热' }, { name: '明确', weight: 0.3, description: '给明确的回应' }, { name: '耐心', weight: 0.2, description: '接住她的反复确认' }, { name: '边界', weight: 0.1, description: '不承诺大于能给' }],
    pass_score: 75,
    perfect_score_threshold: 95,
    fail_conditions: ['撩拨她的脆弱', '承诺"我会一直在"然后消失', '表现不耐烦']
  },
  endings: {
    good: { title: '加你会不会打扰', description: '临别她问"我加你微信会不会打扰你？" 你说"不会。我会回复。只要回复得晚一点是因为我在忙。" 她眼睛湿了', reward: '解锁最终关 + "读懂焦虑型"成就' },
    neutral: { title: '一面之缘', description: '安慰过后各自进咨询室，不再联系', reward: '解锁下一关' },
    bad: { title: '最大的恐惧', description: '你的忽冷忽热印证她所有恐惧，她之后一年再没开咨询', reward: '无' }
  },
  tags: ['焦虑型', '依恋风格', '心理咨询', '温柔', 'VIP']
};

// ============ L030 — 红酒会的大叔 (陆川 R030) ============
levels['L030'] = {
  meta: { kid: 'L030', title: '红酒会的成熟大叔', chapter_id: 7, chapter_name: '依恋·读懂你', level_index: 5, difficulty: 'very_hard', estimated_turns: 18, unlock_condition: '完成 L029', vip_required: true },
  world: { era: '现代都市', city: '北京', season: '秋天', world_rules: '高端红酒品鉴+成熟社交', social_context: '一场专业红酒品鉴会', tone: '成熟、安心、有重量' },
  scene: {
    location: '私人红酒会所',
    time_of_day: '晚上9点',
    weather: '夜',
    atmosphere: '暖色灯光+木头+小声谈话',
    sensory_details: { visual: '他穿深灰色西装，手腕一块老款腕表，眼角有淡淡细纹但眼神很清亮', audio: '爵士+酒杯', smell: '红酒+雪茄（远处）+淡淡的橡木', touch: '红酒杯的弧度' },
    props: ['他面前一杯老年份波尔多', '他旁边一本写得密密麻麻的品鉴笔记', '他手腕那块不显眼但一看就懂的表']
  },
  story_node: {
    premise: '朋友带你来参加一场红酒品鉴。你在角落遇到一个40岁左右的男人——他一个人坐在那里，对每款酒都写着详细笔记。他的气场不像富豪或油腻商人，更像一个真的懂也真的活过的人。这是最终关，综合测试所有人设维度。',
    player_objective: '跟一个真正成熟的大叔平等对话 —— 不被年龄差吓到，也不被他的阅历压倒',
    narrative_arc: '他先开口问你 → 你给出超出他预期的回应 → 聊到一些深度话题 → 他看你的眼神变了 → 他自然地邀你下次',
    key_plot_beats: [
      '他的第一句评价你的选酒',
      '你给出有想法的回应',
      '他认真和你交流',
      '聊到一个关于"成长"的话题',
      '他说"你比我以为的更像个大人"',
      '他留下联系方式的方式'
    ],
    branching_hints: {
      good_path: '成熟+有自己的世界+不被他的阅历压制 → 他把你当"值得相处的人"',
      neutral_path: '客气对话 → 他礼貌结束',
      bad_path: '撒娇装幼/崇拜脸 → 他客气礼貌但永远不会约第二次'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R030', role_in_this_level: '红酒会的客人', current_mood: '平静+观察世界的状态', current_status: '最近在写一本随笔', attitude_toward_player: '礼貌+好奇', this_level_special_behavior: '说话有重量+每一句都是观察。欣赏有自己世界的年轻人。不喜欢任何形式的仰望' }],
    player_role: { identity: '朋友带来的客人', player_knows: '他看起来成熟有阅历', player_doesnt_know: '他15年前跟你一样年轻气盛+之后经历了很多才变成现在这样' }
  },
  dialogue: {
    opening_message: '品鉴会的人群散开。\n\n你端着刚倒的第三杯酒坐到窗边，发现隔壁已经有一个男人坐在那里。深灰色西装，面前一杯老年份的红酒，旁边摆着一本写满字的品鉴笔记。\n\n他没看你，先开口：\n\n"你选的这杯，比你之前那一杯有意思。" 他说。然后终于转头看了你一眼。"但你的表情告诉我，你其实更喜欢之前那杯。"',
    opening_choices: ['「……你看出来了。」（坦诚）', '「为什么这么说？」（探他）', '「哪里暴露了？」（直接）'],
    system_narration_style: '第二人称，成熟+重量感+金句密度',
    max_turns: 26,
    min_turns_for_good_ending: 13
  },
  scoring: {
    dimensions: [{ name: '独立', weight: 0.35, description: '有自己世界' }, { name: '深度', weight: 0.3, description: '对话能走深' }, { name: '诚实', weight: 0.2, description: '承认不懂就不懂' }, { name: '不仰望', weight: 0.15, description: '平等姿态' }],
    pass_score: 78,
    perfect_score_threshold: 96,
    fail_conditions: ['叫他"叔叔"撒娇', '夸他"你真有味道"这种套话', '崇拜脸追问他的过去']
  },
  endings: {
    good: { title: '下次一起喝酒', description: '他离开前递给你一张卡片，只印了一个名字和一个号码："哪天你想聊点什么，叫我。" —— 他几乎从不给年轻人这张卡片。你达成了最终毕业。', reward: '全剧通关 + "大人"终极成就 + 解锁隐藏章节' },
    neutral: { title: '一面红酒', description: '你们聊了一个小时，他礼貌告别。你知道他不会主动找你。', reward: '全剧通关（普通）' },
    bad: { title: '普通年轻人', description: '他跟你礼貌说完就走了，你明显感到他的评价：普通', reward: '无' }
  },
  tags: ['大叔', '红酒', '成熟', '最终关', 'VIP']
};

module.exports = levels;
