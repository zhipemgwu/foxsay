/**
 * L021-L025 关卡卡（对应 R021-R025）
 */
const levels = {};

// ============ L021 — 酒吧凌晨的搭讪 (夏未央 R021) ============
levels['L021'] = {
  meta: { kid: 'L021', title: '酒吧凌晨的搭讪', chapter_id: 6, chapter_name: '复杂·成年世界', level_index: 1, difficulty: 'hard', estimated_turns: 15, unlock_condition: '完成 L020', vip_required: true },
  world: { era: '现代都市', city: '深圳', season: '夏夜', world_rules: 'live house 文化+夜生活', social_context: '凌晨1点的独立酒吧', tone: '烟、酒、放松的防备' },
  scene: {
    location: '一家开在巷子里的威士忌吧',
    time_of_day: '凌晨1:20',
    weather: '外面下雨',
    atmosphere: '昏黄灯光+蓝调音乐+人声低',
    sensory_details: { visual: '她坐在吧台最角落，面前一杯威士忌只喝了半口', audio: 'Billie Holiday 的老唱片', smell: '烟+威士忌+她身上一丝淡淡的香水', touch: '吧台的木质纹理' },
    props: ['她面前的一杯纯威士忌', '她手边一本翻旧的书', '她眼底藏不住的疲惫']
  },
  story_node: {
    premise: '你凌晨躲雨进了一家小酒吧。吧台最远的角落里，一个女人独自喝着威士忌，面前摊着一本书，不像来social的。你在她旁边空位坐下。',
    player_objective: '在一个独自喝酒的女人身边，做到既不打扰也能让她开口 —— 这是最难的平衡',
    narrative_arc: '沉默共处 → 你点了同款酒 → 她主动说一句 → 低声对话 → 聊到各自心事 → 天亮前礼貌道别',
    key_plot_beats: [
      '她第一眼扫过你时的评估',
      '你点了跟她同款酒',
      '她意外地主动说"这是好品味"',
      '对话慢慢展开',
      '她聊到一个过去的人',
      '天快亮时她说"很久没有人跟我聊到这里了"'
    ],
    branching_hints: {
      good_path: '尊重她的独处+偶尔的金句碰撞 → 她留了电话',
      neutral_path: '礼貌安静喝完酒 → 各自散',
      bad_path: '一上来就搭讪 → 她不到一分钟走人'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R021', role_in_this_level: '酒吧里独自喝酒的女人', current_mood: '放空+一丝悲伤', current_status: '刚处理完一件麻烦事', attitude_toward_player: '默认所有男人都是来搭讪的', this_level_special_behavior: '会用沉默测试对方+欣赏懂得欣赏沉默的人' }],
    player_role: { identity: '躲雨进来的客人', player_knows: '她看起来像有故事的人', player_doesnt_know: '她是你不会再见第二次的那种女人 —— 除非你懂' }
  },
  dialogue: {
    opening_message: '雨把你淋了一半。你推门进来的瞬间，整个酒吧里只有吧台最里面一个位置有人。\n\n她坐在那里，手边摊着一本旧书，面前一杯琥珀色威士忌。没抬头。\n\n你走过去，在她旁边的高脚凳坐下，点了杯跟她一样的酒。\n\n她的目光从书页上挪开一瞬，扫了你一眼，然后又回到书上。',
    opening_choices: ['（安静等酒来，不说话）', '「这本书怎么样？」（问书）', '「这家店的音乐选得真好。」（聊氛围）'],
    system_narration_style: '第二人称，氛围感极重，多感官描写，对话留白',
    max_turns: 22,
    min_turns_for_good_ending: 11
  },
  scoring: {
    dimensions: [{ name: '沉稳', weight: 0.35, description: '不着急说话' }, { name: '质感', weight: 0.3, description: '话有内容' }, { name: '共感', weight: 0.2, description: '接得住她的情绪' }, { name: '不逾矩', weight: 0.15, description: '不轻佻' }],
    pass_score: 72,
    perfect_score_threshold: 93,
    fail_conditions: ['开场就夸她漂亮', '要求加微信', '问她是不是在等人']
  },
  endings: {
    good: { title: '留了电话', description: '"如果哪天你也想找人喝威士忌——" 她在餐巾纸上留了一串数字。"不保证我会接。"', reward: '解锁下一关 + "懂沉默的人"成就' },
    neutral: { title: '各自的夜', description: '你们各自喝完一杯酒，她点头致意，起身离开', reward: '解锁下一关' },
    bad: { title: '早走', description: '她合上书拿起包就走了，你连名字都没问到', reward: '无' }
  },
  tags: ['酒吧', '氛围感', '神秘女人', '克制', 'VIP']
};

// ============ L022 — 朋友聚会的前女友 (方楚 R022) ============
levels['L022'] = {
  meta: { kid: 'L022', title: '朋友聚会的前女友', chapter_id: 6, chapter_name: '复杂·成年世界', level_index: 2, difficulty: 'hard', estimated_turns: 15, unlock_condition: '完成 L021', vip_required: false },
  world: { era: '现代都市', city: '南京', season: '冬天', world_rules: '老朋友聚会+复杂关系网', social_context: '大学死党的饭局', tone: '尴尬、克制、情感复杂' },
  scene: {
    location: '朋友家客厅',
    time_of_day: '晚上9点',
    weather: '下雪',
    atmosphere: '暖气开着+背景音乐+酒过三巡',
    sensory_details: { visual: '她坐在沙发另一端低头玩手机', audio: '朋友们的笑声+火锅翻滚声', smell: '火锅+热红酒', touch: '热红酒杯的温度' },
    props: ['一桌吃到一半的火锅', '她手上没摘的一枚戒指（非婚戒）', '你俩之间空着的两个座位']
  },
  story_node: {
    premise: '大学死党聚会，你去之前不知道她也在——她是你死党前几年的前女友。当年她跟你死党分手的时候，你是唯一一个中立陪她聊了一整夜的人。从那以后你们再没联系。今晚她坐在沙发另一头。',
    player_objective: '在不打扰朋友关系的前提下，用成年人的方式跟她自然地聊天 —— 不越线也不冷淡',
    narrative_arc: '眼神碰上 → 简单问候 → 阳台透气的独处 → 聊近况 → 她说"那晚谢谢你" → 各自回归',
    key_plot_beats: [
      '重逢时的眼神',
      '她先打招呼还是你先',
      '一起去阳台透气的时刻',
      '她问你现在过得怎么样',
      '她说"那晚其实我没敢跟你道谢"',
      '分开时的那句"照顾好自己"'
    ],
    branching_hints: {
      good_path: '成熟处理+尊重彼此现在 → 她微信备注改成了你名字（不是"朋友前男友的朋友"）',
      neutral_path: '礼貌寒暄+各自回归 → 聚会结束就结束',
      bad_path: '想重提旧情/想打听你朋友情况 → 她客气远离'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R022', role_in_this_level: '朋友前女友', current_mood: '意外中藏着平静', current_status: '已经有新的人', attitude_toward_player: '感激+有距离感', this_level_special_behavior: '说话小心避开任何会让朋友尴尬的话题。对"当年"话题点到为止' }],
    player_role: { identity: '朋友+当年的中立听众', player_knows: '她是朋友前女友，当年你陪她聊过', player_doesnt_know: '她其实当年靠那一晚的对话才走出来' }
  },
  dialogue: {
    opening_message: '客厅里很热闹。朋友们都在喝酒聊天。\n\n你在阳台抽完烟推门进来，一抬头——\n\n她正好从走廊那头走过来，两个人在客厅门口意外对上眼。\n\n"……" 她愣了一下，然后微微笑了一下。"好久不见。"',
    opening_choices: ['「好久不见。」（简单回礼）', '「你也在？」（自然）', '（点头笑一下让开路）'],
    system_narration_style: '第二人称，克制感+场景感',
    max_turns: 20,
    min_turns_for_good_ending: 10
  },
  scoring: {
    dimensions: [{ name: '成熟', weight: 0.4, description: '成年人的分寸' }, { name: '尊重', weight: 0.3, description: '尊重她现在的生活' }, { name: '温度', weight: 0.2, description: '不冷淡也不越界' }, { name: '不打听', weight: 0.1, description: '不问旧事' }],
    pass_score: 70,
    perfect_score_threshold: 93,
    fail_conditions: ['重提旧事', '问她现在对某人怎么看', '暧昧举动']
  },
  endings: {
    good: { title: '谢谢你那晚', description: '走前她悄悄过来："那晚我没有真的谢你。谢谢你听完我说话。" —— 你俩相视微笑', reward: '解锁下一关 + "成年人"成就' },
    neutral: { title: '礼貌退出', description: '各自跟朋友道别，她走得比你早', reward: '解锁下一关' },
    bad: { title: '气氛尴尬', description: '你提了不该提的，朋友之后几年疏远了你', reward: '无' }
  },
  tags: ['前任', '朋友关系', '成熟', '克制']
};

// ============ L023 — 半年网恋终于下线 (林笙 R023) ============
levels['L023'] = {
  meta: { kid: 'L023', title: '半年网恋终于下线', chapter_id: 6, chapter_name: '复杂·成年世界', level_index: 3, difficulty: 'medium', estimated_turns: 15, unlock_condition: '完成 L022', vip_required: false },
  world: { era: '现代都市', city: '两个异地城市中间点：苏州', season: '春天', world_rules: '互联网时代网恋', social_context: '你们聊了半年，从没视频过，今天第一次见面', tone: '紧张、惊喜、现实感冲击' },
  scene: {
    location: '苏州平江路一家评价很好的书店咖啡馆',
    time_of_day: '下午3点',
    weather: '晴朗',
    atmosphere: '书香+咖啡香+轻音乐',
    sensory_details: { visual: '她站在门口看见你手里捧的那本她推荐的书', audio: '咖啡机+远处评弹', smell: '书+咖啡', touch: '手心出汗' },
    props: ['她推荐的那本书（你带着作信物）', '她送你的一个手工小挂件', '她手里紧紧捏的手机']
  },
  story_node: {
    premise: '你们在一个读书 APP 上认识，聊了整整半年，从没视频也没打过电话——只有文字。今天终于决定线下见面。你们约在两个城市中间点的苏州。',
    player_objective: '穿越半年文字想象，跟一个真实的人重新开始 —— 现实不如文字浪漫但真实有温度',
    narrative_arc: '紧张见面 → 确认是彼此 → 现实跟文字的落差 → 一起书店喝咖啡 → 去平江路散步 → 约第二次',
    key_plot_beats: [
      '她比你想象的矮一点/高一点',
      '前15分钟的尴尬',
      '你们说出第一个共同话题就破冰',
      '她跟文字里一样温柔',
      '傍晚散步时她忽然沉默',
      '她说"我怕现实让我们散了"'
    ],
    branching_hints: {
      good_path: '接受现实版本的她+不比较不失望 → 她当天晚上改了头像（第一次放真人照）',
      neutral_path: '见面礼貌友好但没擦出火花 → 逐渐聊少',
      bad_path: '失望溢于言表/想改天见 → 半年文字一夜清零'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R023', role_in_this_level: '网恋终于下线的人', current_mood: '极度紧张+期待', current_status: '半夜起床化了三次妆', attitude_toward_player: '既熟悉又陌生', this_level_special_behavior: '现实中她比文字里紧张+话少一些。文字里的那个她是她内心最真实的版本' }],
    player_role: { identity: '网恋半年的对方', player_knows: '她喜欢村上春树+讨厌香菜+写字好看', player_doesnt_know: '她出门前哭了一场因为怕你失望' }
  },
  dialogue: {
    opening_message: '你比约定时间早到了20分钟。咖啡馆二楼。\n\n你手里捧着那本《挪威的森林》——她说过如果相认看这本书。\n\n楼梯传来脚步声。你抬头。\n\n一个女生站在楼梯口，背着一个很轻的帆布包，眼神慌张地扫一圈——然后落在你手里的书上。\n\n她僵在那里。',
    opening_choices: ['（站起来朝她笑）', '「……是你吗？」（轻声）', '（举起书晃了一下）'],
    system_narration_style: '第二人称，紧张感+温柔细节',
    max_turns: 22,
    min_turns_for_good_ending: 11
  },
  scoring: {
    dimensions: [{ name: '接受', weight: 0.4, description: '接受现实版的她' }, { name: '温暖', weight: 0.3, description: '化解她的紧张' }, { name: '熟悉感', weight: 0.2, description: '延续半年文字积累' }, { name: '耐心', weight: 0.1, description: '给她呼吸时间' }],
    pass_score: 65,
    perfect_score_threshold: 92,
    fail_conditions: ['见面表现失望', '说"你跟我想的不太一样"', '频繁对比照片']
  },
  endings: {
    good: { title: '我怕现实', description: '傍晚平江路的桥上她说"我怕现实让我们散了" 你说"那就不要让它散"', reward: '解锁下一关 + "从文字到人"成就' },
    neutral: { title: '朋友以上', description: '回去后你们还聊但热度下降', reward: '解锁下一关' },
    bad: { title: '文字的幻觉', description: '分开后第二天她把你删了"其实见面之前那样挺好的"', reward: '无' }
  },
  tags: ['网恋', '线下', '想象vs现实', '温柔']
};

// ============ L024 — 前任闺蜜的咖啡 (林夕 R024) ============
levels['L024'] = {
  meta: { kid: 'L024', title: '前任闺蜜的咖啡', chapter_id: 6, chapter_name: '复杂·成年世界', level_index: 4, difficulty: 'very_hard', estimated_turns: 16, unlock_condition: '完成 L023', vip_required: true },
  world: { era: '现代都市', city: '北京', season: '冬天', world_rules: '复杂关系网+边界议题', social_context: '你前女友的闺蜜单独约你喝咖啡', tone: '危险、暧昧、道德感' },
  scene: {
    location: '三里屯一家咖啡店',
    time_of_day: '下午4点',
    weather: '阴',
    atmosphere: '咖啡馆人不多+她坐在窗边',
    sensory_details: { visual: '她穿很挑的浅驼色大衣+画了精致妆', audio: '低音量的 jazz', smell: '咖啡+她的香水', touch: '咖啡杯的温度' },
    props: ['她面前没动的一杯抹茶拿铁', '她手机上你前女友的头像', '她指尖无意识摩挲的戒指']
  },
  story_node: {
    premise: '你跟前女友和平分手半年。今天她的闺蜜——你前女友最好的朋友——突然发信息约你单独喝咖啡。"有事想跟你说"，她写。',
    player_objective: '在一个明显越界的邀请前，维护你的人品和前女友友情的双重底线',
    narrative_arc: '她看起来有事 → 聊着聊着偏向私人 → 她忽然说一句危险的话 → 你如何回应决定一切',
    key_plot_beats: [
      '她开场说是"有事想说"',
      '聊一些无关紧要的近况',
      '她问你"你们分手是不是因为……"',
      '她忽然说"其实我一直觉得你很不错"',
      '那一刻你的回答',
      '她如何离开'
    ],
    branching_hints: {
      good_path: '友好但明确拒绝+不伤害她 → 她最终尊重你+前任还是你的朋友',
      neutral_path: '含糊躲避 → 她记恨你然后把话传回你前任那里',
      bad_path: '接受暗示 → 你变成所有人眼里那种人+永久社死'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R024', role_in_this_level: '前女友的闺蜜', current_mood: '有备而来+假装随意', current_status: '对你有心思已经一阵子了', attitude_toward_player: '试探+暧昧', this_level_special_behavior: '说话带双关+会用前女友的事做试探。被明确拒绝会有保留体面的反应' }],
    player_role: { identity: '她闺蜜的前男友', player_knows: '你们和前女友和平分手', player_doesnt_know: '这场咖啡是她精心安排的+前女友其实还没忘你' }
  },
  dialogue: {
    opening_message: '她比约定时间早到，已经点好了咖啡。\n\n看见你进来，她笑着摆手。"这边。"\n\n浅驼色大衣+精致的妆，跟你以前在她们聚会上见到的"随便打扮"的她不太一样。\n\n"谢谢你来。" 她说，眼神里有一种你以前从没见过的东西。',
    opening_choices: ['「找我什么事？」（直接）', '「好久不见。」（正常寒暄）', '「XX最近怎么样？」（先提前任划线）'],
    system_narration_style: '第二人称，克制感+危险暧昧，警觉',
    max_turns: 22,
    min_turns_for_good_ending: 11
  },
  scoring: {
    dimensions: [{ name: '道德', weight: 0.45, description: '维护前女友友情' }, { name: '清晰', weight: 0.3, description: '边界清晰不含糊' }, { name: '得体', weight: 0.15, description: '不伤害她的体面' }, { name: '智慧', weight: 0.1, description: '识破暗示' }],
    pass_score: 75,
    perfect_score_threshold: 95,
    fail_conditions: ['接受她的暧昧暗示', '跟她传前女友的八卦', '说前女友坏话']
  },
  endings: {
    good: { title: '不会发生的事', description: '你直视她："我跟XX是朋友。你对她来说是好朋友。有些事情不会因为我们单身就可以发生。" 她沉默一下，然后笑了："是我唐突了。" —— 你守住了所有人的底线', reward: '解锁下一关 + "有原则的人"成就' },
    neutral: { title: '礼貌收场', description: '你含糊躲过去，她意识到没戏，喝完咖啡各自走', reward: '解锁下一关' },
    bad: { title: '永久污点', description: '你含糊给了希望，她把这件事用自己方式传回去，你在朋友圈永久被贴了"渣"', reward: '无' }
  },
  tags: ['前任闺蜜', '道德困境', '边界', '原则', 'VIP']
};

// ============ L025 — 慈善晚宴的认识 (纪雪 R025) ============
levels['L025'] = {
  meta: { kid: 'L025', title: '慈善晚宴的认识', chapter_id: 6, chapter_name: '复杂·成年世界', level_index: 5, difficulty: 'very_hard', estimated_turns: 16, unlock_condition: '完成 L024', vip_required: true },
  world: { era: '现代都市', city: '上海', season: '冬天', world_rules: '高净值人群+慈善社交圈', social_context: '一场拍卖晚宴', tone: '尊贵、克制、阶层感' },
  scene: {
    location: '外滩某酒店宴会厅',
    time_of_day: '晚上8点',
    weather: '夜',
    atmosphere: '水晶灯+礼服+香槟',
    sensory_details: { visual: '她穿墨绿色丝绸礼服+耳朵上的祖母绿', audio: '小提琴+高雅谈话', smell: '香槟+她淡淡的香水', touch: '香槟杯的冰' },
    props: ['她竞拍刚成功的一个画作', '她手腕上一块低调的古董表', '她眼底完全看不到情绪']
  },
  story_node: {
    premise: '你因为工作关系被邀请参加一场慈善晚宴。你走到角落透气时，一个气场极强的女人正独自站在窗边看拍卖结果。她看你的一眼，让你觉得她已经评估过你全部。',
    player_objective: '跟一个阶层感极强的成熟女人平等对话 —— 不能卑微也不能装',
    narrative_arc: '她先开口评估你 → 你不卑不亢 → 她罕见地好奇 → 聊到更深的话题 → 她递出一张名片',
    key_plot_beats: [
      '她的第一眼扫视',
      '她先问你一个有陷阱的问题',
      '你的回答跳出她的预判',
      '她稍稍正视你',
      '聊到慈善的本质',
      '她递出名片的方式'
    ],
    branching_hints: {
      good_path: '平等+有见识+不卑不亢 → 她把你放进"值得认识"名单',
      neutral_path: '客气应对 → 她礼貌结束对话',
      bad_path: '卑微讨好/借机攀附 → 她直接走人'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R025', role_in_this_level: '慈善晚宴的贵宾', current_mood: '晚宴末期的微倦', current_status: '今晚刚签了一个8位数的慈善捐赠', attitude_toward_player: '评估+默认不信任', this_level_special_behavior: '说话不多但每一句都在观察+厌恶卑微和假充气场的人' }],
    player_role: { identity: '因工作被带来的年轻人', player_knows: '她是这场晚宴的贵宾', player_doesnt_know: '她十年前跟你是一样的起点 —— 普通人' }
  },
  dialogue: {
    opening_message: '拍卖师的声音在大厅里回响。\n\n你端着香槟走到窗边透气，发现角落已经有一个女人站在那里。墨绿色丝绸礼服，耳朵上一点祖母绿。\n\n她没转头，只是平静说："拍卖这场你没举牌。"\n\n然后她转过来，眼睛从你身上扫过一遍。\n\n"第一次来？"',
    opening_choices: ['「是。你怎么看出来？」（直接问）', '「我不太习惯买不会看的东西。」（有态度）', '「是。您看起来很熟。」（尊敬）'],
    system_narration_style: '第二人称，克制+阶层感+细节富豪元素',
    max_turns: 22,
    min_turns_for_good_ending: 11
  },
  scoring: {
    dimensions: [{ name: '气场', weight: 0.35, description: '不被她压制' }, { name: '见识', weight: 0.3, description: '有独立见解' }, { name: '诚实', weight: 0.2, description: '承认不懂就不懂' }, { name: '尊重', weight: 0.15, description: '不卑不亢' }],
    pass_score: 78,
    perfect_score_threshold: 95,
    fail_conditions: ['卑微讨好', '装懂艺术品', '打听她的身家']
  },
  endings: {
    good: { title: '一张不印头衔的名片', description: '离场前她递给你一张纸片，只印了她名字和一个电话。"下周三有空就来我工作室喝杯茶。" —— 她几乎从不给陌生人时间', reward: '解锁最终关 + "被认可"成就' },
    neutral: { title: '晚宴一面', description: '她礼貌地跟你聊了几分钟就被其他宾客叫走', reward: '解锁下一关' },
    bad: { title: '浪费时间', description: '她听完你一句话后淡淡说"不好意思我去跟老朋友打个招呼"就走了', reward: '无' }
  },
  tags: ['富婆', '晚宴', '阶层感', '气场', 'VIP']
};

module.exports = levels;
