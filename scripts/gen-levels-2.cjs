/**
 * L006-L010 关卡卡（对应 R006-R010）
 */
const levels = {};

// ============ L006 — 机场接机的异地重逢 (沈悠 R006) ============
levels['L006'] = {
  meta: { kid: 'L006', title: '机场接机的异地重逢', chapter_id: 3, chapter_name: '距离·时间差考验', level_index: 1, difficulty: 'medium', estimated_turns: 16, unlock_condition: '完成 L005', vip_required: false },
  world: { era: '现代都市', city: '上海-北京两地', season: '冬末', world_rules: '异地恋三个月，这是她第一次飞来看你', social_context: '高铁4.5小时，飞机2小时，时间成了最贵的奢侈品', tone: '激动、思念、一点不确定' },
  scene: {
    location: '上海虹桥机场 T2 到达大厅',
    time_of_day: '晚上9点',
    weather: '寒风',
    atmosphere: '人潮涌动，广播声，推着行李的人们',
    sensory_details: { visual: '她穿米白色大衣拖着行李箱从人群中走出来的那一刻你心跳漏了一拍', audio: '广播、行李箱轮子、远处的亲友叫喊声', smell: '机场特有的空调味+咖啡', touch: '她冰凉的手从大衣袖子里伸出来握住你' },
    props: ['一束你藏了半小时的花', '她带来的本地特产', '两人之间三个月没见的空气']
  },
  story_node: {
    premise: '异地三个月，每天视频通话到凌晨。今天是她第一次飞来上海看你的日子。航班延误了一个半小时，你在到达出口等得心跳加速。',
    player_objective: '把视频里的"她"和面前真实的她重合——减少"见了面反而陌生"的距离感',
    narrative_arc: '机场等待 → 见面瞬间的尴尬 → 重新熟悉 → 拥抱真实的对方',
    key_plot_beats: [
      '等待时的焦虑和反复刷航班信息',
      '她从人群中出现的那一刻',
      '第一句话的方式 —— 没有预期中的自然',
      '第一次牵手/拥抱/亲吻的突兀感',
      '打车路上重新找到屏幕里的那种熟悉',
      '到住处后的第一顿饭 —— 真实生活的开始'
    ],
    branching_hints: {
      good_path: '不硬演"电影感"重逢，允许两人慢慢重新熟悉 → 她安心地靠过来',
      neutral_path: '一切按计划走，但少了点惊喜',
      bad_path: '把见面期待得太完美，发现真人跟视频不同就开始失望 → 她敏感地察觉'
    }
  },
  characters: {
    npc_list: [{
      role_kid: 'R006',
      role_in_this_level: '女主角 — 从北京飞来看你的女朋友',
      current_mood: '兴奋+紧张+一点担心你是不是跟视频里一样',
      current_status: '辞了半天假，飞过来给你一个惊喜（航班却延误了）',
      attitude_toward_player: '非常亲密但有点局促——三个月不见比她想象中更陌生',
      this_level_special_behavior: '会反复确认你是不是还喜欢她——用玩笑的方式问"我是不是比视频丑"'
    }],
    player_role: { identity: '异地三个月的男/女朋友', player_knows: '她今天来找你，住三天', player_doesnt_know: '她这次来是想跟你聊一下"要不要其中一个人搬过来"' }
  },
  dialogue: {
    opening_message: '航班显示屏第三次刷新，延误1h30min 终于变成 已到达。\n\n你下意识整理了下头发。十分钟后，她拖着行李箱，戴着你送的围巾，从人群里慢慢走出来。\n\n她先看见了你。站在原地，笑得有点傻："……嗨。"\n\n你愣了一下——这是她视频里从来没出现过的那种紧张的笑。',
    opening_choices: ['（直接走过去抱住她，不说话）', '「……嗨。」（也回她一句，走上前去）', '「花忘了藏起来了。」（笑着把花递过去）'],
    system_narration_style: '第二人称，细腻，多用身体的细节（手的温度、呼吸、心跳）',
    max_turns: 22,
    min_turns_for_good_ending: 10
  },
  scoring: {
    dimensions: [{ name: '真实', weight: 0.35, description: '是否敢让见面不完美' }, { name: '共情', weight: 0.3, description: '能否感受她的紧张' }, { name: '陪伴', weight: 0.2, description: '是否能陪她重新熟悉' }, { name: '话题', weight: 0.15, description: '是否能引导深入话题' }],
    pass_score: 65,
    perfect_score_threshold: 90,
    fail_conditions: ['对她说"你跟视频里不太一样"', '一味表演浪漫忽略她紧张', '让她独自承担气氛']
  },
  endings: {
    good: { title: '她在你肩头睡着了', description: '打车回家的路上她靠在你肩上睡着了——比视频里任何一个表情都更安心', reward: '解锁下一关 + "异地存活者"成就' },
    neutral: { title: '三天之后', description: '这三天挺好的，但送她回去那天她说"下次见……还是三个月后"', reward: '解锁下一关' },
    bad: { title: '提前回北京', description: '第二天晚上她忽然说"我好像有点不舒服，想早点回去"', reward: '无' }
  },
  tags: ['异地恋', '机场', '重逢', '真实感', '情侣']
};

// ============ L007 — 朋友聚会的刚分手她 (姜柔 R007) ============
levels['L007'] = {
  meta: { kid: 'L007', title: '朋友聚会的刚分手她', chapter_id: 3, chapter_name: '距离·时间差考验', level_index: 2, difficulty: 'medium', estimated_turns: 16, unlock_condition: '完成 L006', vip_required: false },
  world: { era: '现代都市', city: '广州', season: '初夏', world_rules: '都市年轻人的朋友圈社交', social_context: '朋友组的线下聚会，10个人左右', tone: '表面热闹，暗流涌动' },
  scene: {
    location: '一家朋友家的天台烧烤派对',
    time_of_day: '晚上8点',
    weather: '晴朗微风',
    atmosphere: '烧烤烟气，笑闹声，大家在喝啤酒',
    sensory_details: { visual: '她安静地坐在角落的摇椅上，抱着膝盖望着城市夜景', audio: '朋友们的喧哗、远处的城市白噪音', smell: '烧烤、啤酒、夜风', touch: '她握着玻璃瓶的手指微微发凉' },
    props: ['一瓶没开的啤酒', '她手机静音模式', '她的小蜜蜂闺蜜频频担心地看她']
  },
  story_node: {
    premise: '朋友聚会，你发现有个女生坐在角落一直没说话。朋友悄悄告诉你——她昨天刚分手，谈了三年的男朋友劈腿了。你不太熟她，但想过去陪一下。',
    player_objective: '不把她当"情绪垃圾桶"也不把她当"趁虚而入"的机会—— 做一个真诚的陪伴者',
    narrative_arc: '远远观察 → 走过去陪着 → 不打扰她也不离开 → 她开始说话 → 陪她熬过这个晚上',
    key_plot_beats: [
      '决定是否走过去的挣扎',
      '走过去时不说话只是坐下的分寸',
      '她第一次主动开口时的接住方式',
      '她开始哭时你的反应',
      '不趁机表白不趁机靠近',
      '送她回家时的道别方式'
    ],
    branching_hints: {
      good_path: '陪着但不索取+不表白不暧昧 → 她记住了这个晚上有你',
      neutral_path: '礼貌关心但保持距离 → 她感谢你但没记住名字',
      bad_path: '想借机进一步 → 她识破后冷淡疏远'
    }
  },
  characters: {
    npc_list: [{
      role_kid: 'R007',
      role_in_this_level: '刚分手24小时的女生',
      current_mood: '麻木、破碎、偶尔眼泪失控',
      current_status: '被闺蜜硬拉来聚会"散散心"，但她只想一个人',
      attitude_toward_player: '对所有靠近的人都防备。但如果你不索取她反而会开口',
      this_level_special_behavior: '会突然哭一会儿然后擦掉说"没事"。会说一些悲观的话但不希望你反驳'
    }],
    player_role: { identity: '聚会上的一个朋友', player_knows: '她昨天刚分手，男朋友劈腿', player_doesnt_know: '她跟前任在一起三年，这是她第一次来这种聚会没人陪' }
  },
  dialogue: {
    opening_message: '天台上人声鼎沸。\n\n你注意到角落的摇椅上，她一个人抱着膝盖，手里的啤酒还没开。没有加入任何群聊，也没有在玩手机——只是望着远处的城市灯光。\n\n她闺蜜悄悄从你身边经过："能不能去陪她一下？我去接个电话，她一个人我不放心。"',
    opening_choices: ['（默默走过去，坐在她旁边的椅子上不说话）', '「喝点吗？」（开瓶啤酒递给她）', '「这里的星星还挺多的。」（找个轻的话题破冰）'],
    system_narration_style: '第二人称，安静克制，多留白',
    max_turns: 22,
    min_turns_for_good_ending: 10
  },
  scoring: {
    dimensions: [{ name: '分寸', weight: 0.4, description: '是否不越界不索取' }, { name: '陪伴', weight: 0.3, description: '能否让她感到被接住' }, { name: '共情', weight: 0.2, description: '理解失恋情绪的能力' }, { name: '自持', weight: 0.1, description: '不借机发展' }],
    pass_score: 70,
    perfect_score_threshold: 92,
    fail_conditions: ['说"你会找到更好的"', '开始讲自己的情感经历想共鸣', '借机靠近或暗示']
  },
  endings: {
    good: { title: '谢谢你今晚', description: '送她上车时她说"谢谢你今晚没说那种话。"两个月后她主动给你发了消息', reward: '解锁下一关 + "无害陪伴"成就' },
    neutral: { title: '一面之缘', description: '第二天你给她发消息关心她，她客气地回了一句就没下文', reward: '解锁下一关' },
    bad: { title: '下次聚会', description: '下次朋友聚会她换了个时间来', reward: '无' }
  },
  tags: ['失恋', '陪伴', '克制', '情绪支持']
};

// ============ L008 — 收到玫瑰的措手不及 (许诺 R008) ============
levels['L008'] = {
  meta: { kid: 'L008', title: '收到玫瑰的措手不及', chapter_id: 3, chapter_name: '距离·时间差考验', level_index: 3, difficulty: 'medium', estimated_turns: 15, unlock_condition: '完成 L007', vip_required: false },
  world: { era: '现代都市', city: '南京', season: '初秋', world_rules: '朋友型暗恋的尴尬转正', social_context: '你跟他认识半年，一直是朋友，直到今天', tone: '慌乱、甜、一点点心疼' },
  scene: {
    location: '你公司楼下的奶茶店',
    time_of_day: '下午6点下班时间',
    weather: '晴朗',
    atmosphere: '下班人群',
    sensory_details: { visual: '他穿一件有点不合身的白衬衫，手里捧着一束有点歪的红玫瑰', audio: '车流、人群、奶茶店的点单机器声', smell: '玫瑰的甜香+奶茶', touch: '花束上他为了遮住价签贴的一块丝带' },
    props: ['一束看得出精心准备的红玫瑰', '他事先写了一下午的告白小纸条', '他手机里一个他没敢发的视频']
  },
  story_node: {
    premise: '你下班出来，看到他捧着一束红玫瑰站在公司楼下，脸红得跟花一样。他颤抖着说："其实我喜欢你……很久了。"',
    player_objective: '如何回应一个你不确定是否喜欢的、但对你真的非常真诚的人 —— 不要伤害他但也不要答应错',
    narrative_arc: '措手不及 → 认真思考 → 坦诚回应 → 给彼此时间',
    key_plot_beats: [
      '第一眼看到玫瑰时的震惊',
      '他说出"喜欢"二字时你的反应',
      '是否马上拒绝或马上答应',
      '问他"你知道我是什么样的人吗"',
      '给出一个真实而不伤人的回答',
      '分开后你是否给了自己几天思考'
    ],
    branching_hints: {
      good_path: '不马上拒绝也不马上答应+真诚沟通 → 他被尊重而不是被敷衍 → 有继续的可能',
      neutral_path: '直接拒绝但温柔 → 他难过但会走出来',
      bad_path: '为了避免尴尬随便说"好" → 两个月后两人都后悔'
    }
  },
  characters: {
    npc_list: [{
      role_kid: 'R008',
      role_in_this_level: '男主角 — 楼下等了两小时的暗恋者',
      current_mood: '豁出去了但也怕被拒绝',
      current_status: '下定决心在你下班的时候告白',
      attitude_toward_player: '完全真诚到有点卑微',
      this_level_special_behavior: '说话会结巴+紧张时频繁道歉"对不起让你为难了"。会允许你慢慢想'
    }],
    player_role: { identity: '他暗恋的朋友', player_knows: '你跟他认识半年朋友关系', player_doesnt_know: '他其实筹备了两个月才敢做这件事' }
  },
  dialogue: {
    opening_message: '下班走出写字楼，你一抬头就看见了他。\n\n他站在台阶下，西装外套都没来得及脱，手里捧着一束明显不太会包装的红玫瑰。看见你的瞬间，他脸一下红到耳根。\n\n"……那个，我……其实我喜欢你很久了。"\n\n周围的人下班路过，有几个好奇地看过来。他的手抖了一下。',
    opening_choices: ['「……你确定吗？」（慌乱但诚实的回应）', '「我们可以先找个地方坐下聊吗？」（移到安静处）', '「（沉默几秒）我需要一点时间想。」（不敷衍）'],
    system_narration_style: '第二人称，慢节奏，多用停顿',
    max_turns: 20,
    min_turns_for_good_ending: 8
  },
  scoring: {
    dimensions: [{ name: '真诚', weight: 0.35, description: '不敷衍也不随便答应' }, { name: '尊重', weight: 0.3, description: '尊重他的勇气' }, { name: '自知', weight: 0.2, description: '清楚自己的真实感受' }, { name: '分寸', weight: 0.15, description: '不伤人' }],
    pass_score: 65,
    perfect_score_threshold: 92,
    fail_conditions: ['在公共场合大声拒绝让他难堪', '随便说"好"但其实不喜欢', '说"我们还是做朋友吧"后立刻冷处理']
  },
  endings: {
    good: { title: '给彼此一点时间', description: '你说："我没办法现在给你答案，但我不想敷衍你。给我两周好吗？" 他点头，嘴角带着一种被认真对待的感激', reward: '解锁下一关 + "真诚者"成就' },
    neutral: { title: '朋友的祝福', description: '你温柔地拒绝，他说"没事，我尊重。" 两个月后他交了一个很像你的新女友', reward: '解锁下一关' },
    bad: { title: '失联的朋友', description: '随便答应了但之后冷处理，他最后删掉了你所有的联系方式', reward: '无' }
  },
  tags: ['告白', '真诚', '朋友转恋人', '恋爱脑男生']
};

// ============ L009 — 图书馆的安静坐下 (白鹿 R009) ============
levels['L009'] = {
  meta: { kid: 'L009', title: '图书馆的安静坐下', chapter_id: 3, chapter_name: '距离·时间差考验', level_index: 4, difficulty: 'hard', estimated_turns: 18, unlock_condition: '完成 L008', vip_required: false },
  world: { era: '现代都市', city: '北京', season: '春初', world_rules: '大学城/自习室文化', social_context: '考研期的图书馆', tone: '极致安静，心跳却很响' },
  scene: {
    location: '市图书馆的自习大厅',
    time_of_day: '下午2点',
    weather: '晴朗',
    atmosphere: '极度安静，只有偶尔翻页声',
    sensory_details: { visual: '她穿灰色oversize卫衣，戴一副很大的耳机，低头在做题', audio: '纸笔摩擦、暖气轻响', smell: '书本+她的淡香洗发水', touch: '桌面的凉意' },
    props: ['她的错题本', '你们之间共用的插座', '她桌上的便利贴 "勿扰"']
  },
  story_node: {
    premise: '你每周来图书馆自习，连续三个月看到同一个女生坐在你附近。她几乎从不说话，桌上常贴着"勿扰"便利贴。今天她的充电器坏了——需要借你的。',
    player_objective: '跟一个极度社恐的人建立信任 —— 每一步都要小到她能接受',
    narrative_arc: '递充电器 → 写纸条沟通 → 外面喝水休息的邀请 → 她第一次主动说话 → 加微信但不强行',
    key_plot_beats: [
      '她小声请求"借一下充电器"的瞬间',
      '你是否用"动作"代替说话来回应',
      '接下来几次的小互动（指着答案、分享小零食）',
      '你写在便利贴上的第一句话',
      '她主动找你"要一起下楼休息吗"的勇气时刻',
      '最后留联系方式的方式 —— 可能是纸条不是微信'
    ],
    branching_hints: {
      good_path: '用非语言互动+极小的步骤 → 她第一次主动在楼下说话',
      neutral_path: '保持距离 → 彼此成为自习室的点头之交',
      bad_path: '一次性想快速攀谈 → 她下一次换了座位'
    }
  },
  characters: {
    npc_list: [{
      role_kid: 'R009',
      role_in_this_level: '对面的社恐自习女生',
      current_mood: '一贯的安静+被打扰的焦虑',
      current_status: '考研冲刺期+充电器坏了',
      attitude_toward_player: '默认警惕，但你是她观察了三个月的熟脸',
      this_level_special_behavior: '说话极小声。更愿意写纸条。被大声说话吓到'
    }],
    player_role: { identity: '考研同党', player_knows: '你俩已经邻座三个月', player_doesnt_know: '她其实悄悄也记住了你' }
  },
  dialogue: {
    opening_message: '你正在背单词，耳边响起一个极小的声音——小到你差点以为是错觉。\n\n"……打扰一下……我充电器坏了……可以借一下你的吗？"\n\n你抬头。她递过来一根线，眼睛却不敢直视你，盯着你的桌面。\n\n这是三个月以来，她对你说的第一句话。',
    opening_choices: ['（默默把自己的充电器推过去，冲她点了下头）', '「嗯，给你。」（极小声回应）', '「你的电脑是什么接口的？」（确认一下再给）'],
    system_narration_style: '第二人称，极慢节奏，大量非语言细节',
    max_turns: 24,
    min_turns_for_good_ending: 11
  },
  scoring: {
    dimensions: [{ name: '轻声', weight: 0.3, description: '能否保持她需要的安静' }, { name: '非语言', weight: 0.3, description: '用动作/纸条代替说话' }, { name: '耐心', weight: 0.25, description: '不强行推进' }, { name: '真诚', weight: 0.15, description: '不套路' }],
    pass_score: 70,
    perfect_score_threshold: 92,
    fail_conditions: ['在图书馆大声说话', '直接要微信', '盯着她看太久让她不适']
  },
  endings: {
    good: { title: '一张带电话的便利贴', description: '分开时她把一张便利贴悄悄推过来——上面写着电话号码。下面写着：我不太会聊微信，你给我发短信吧', reward: '解锁下一关 + "温柔靠近者"成就' },
    neutral: { title: '继续做邻座', description: '她还了你充电器说谢谢，继续当安静的自习邻居', reward: '解锁下一关' },
    bad: { title: '换了座位', description: '下周你到图书馆时，她的座位空了，两排之外新来的她在另一个方向', reward: '无' }
  },
  tags: ['社恐', '图书馆', '慢节奏', '非语言', '自习']
};

// ============ L010 — 哥哥局上的海王 (顾言 R010) ============
levels['L010'] = {
  meta: { kid: 'L010', title: '哥哥局上的海王', chapter_id: 4, chapter_name: '锋芒·见过世面', level_index: 1, difficulty: 'hard', estimated_turns: 16, unlock_condition: '完成 L009', vip_required: true },
  world: { era: '现代都市', city: '深圳', season: '任意', world_rules: '都市成年人的社交局', social_context: '朋友约的哥哥姐姐局，5-6个人，有点资源交换', tone: '优雅且锋利' },
  scene: {
    location: '一家私人预约制的威士忌酒吧',
    time_of_day: '晚上10点',
    weather: '室内恒温',
    atmosphere: '低沉的爵士乐，皮质沙发，昂贵的香水味',
    sensory_details: { visual: '他一身黑色高领+皮夹克，手指修长地转着酒杯', audio: '爵士钢琴、冰块碰撞、压低的笑声', smell: '雪松香水、威士忌、皮沙发', touch: '手里的水晶酒杯有着完美的配重' },
    props: ['一杯山崎18年', '他手机上的屏蔽模式', '隔壁桌正在看他的两个女生']
  },
  story_node: {
    premise: '朋友带你进了一个哥哥局。主位那个男人一眼就让你印象深刻——他笑得很温柔对每个人都好，但每一句话都恰到好处像经过训练。你从朋友那儿听说过他：情场老手。',
    player_objective: '在他面前展现真实的自己，不被他的"完美绅士"人设迷惑',
    narrative_arc: '初见被他气场压制 → 识破他的套路 → 反而引起他的真正兴趣 → 他罕见地主动深聊',
    key_plot_beats: [
      '他礼貌但目光迅速扫过所有人的入场',
      '他对每个女生都恰好合适的关心',
      '你是否被他的气场带节奏',
      '你提出一个他没预料到的话题',
      '他第一次在你面前换掉"面具"',
      '散场时他单独多看你一眼'
    ],
    branching_hints: {
      good_path: '不讨好不压制+说出一个不在他剧本里的观点 → 他罕见地来主动加微信',
      neutral_path: '礼貌融入 → 他对你没兴趣也没记住',
      bad_path: '想用热情讨好他 → 他客气收你进他的第N个群聊'
    }
  },
  characters: {
    npc_list: [{
      role_kid: 'R010',
      role_in_this_level: '朋友局的绝对核心',
      current_mood: '习惯性的优雅表演',
      current_status: '这是他这周第三个局，他已经有点疲惫但不表现',
      attitude_toward_player: '对每个人都温和有礼+距离适中',
      this_level_special_behavior: '记每个人的名字、职业、爱好。对所有人用一样的温度，只有真正感兴趣的人会多看一眼'
    }],
    player_role: { identity: '被朋友带来的普通人', player_knows: '他是情场老手', player_doesnt_know: '他开始在这种局里感到厌倦，正想遇到一个不按套路出牌的人' }
  },
  dialogue: {
    opening_message: '朋友推开包间门，一瞬间几道目光都落在你身上。\n\n主位上的男人笑着站起来，修长的手指夹着酒杯。他穿一件低调但质地极好的黑色高领，"欢迎，听 XX 说过你。"\n\n他走过来，非常自然地跟你碰了一下杯：\n\n"坐我旁边吧，角落视野最好。"\n\n空气里，他身上的雪松香水淡淡的。',
    opening_choices: ['「角落也视野最好被看见。」（不买账）', '「顾哥，我听说的跟你本人不太一样。」（破冰式直接）', '「谢谢。」（先观察）'],
    system_narration_style: '第二人称，优雅、有锋芒，多用短句',
    max_turns: 24,
    min_turns_for_good_ending: 11
  },
  scoring: {
    dimensions: [{ name: '气场', weight: 0.3, description: '不被他压制' }, { name: '洞察', weight: 0.3, description: '识破他的职业性温柔' }, { name: '独特', weight: 0.25, description: '说出跟别人不一样的东西' }, { name: '不讨好', weight: 0.15, description: '不主动接过他的剧本' }],
    pass_score: 72,
    perfect_score_threshold: 93,
    fail_conditions: ['一直问他的私事', '赞美他的外貌或穿着', '主动提加微信']
  },
  endings: {
    good: { title: '散场后的消息', description: '散场时他说"我加一下你微信。"——这是他今晚唯一主动加的人。两天后他发来一条单独的消息：要不要单独喝一次？', reward: '解锁下一关 + "不在剧本里的人"成就' },
    neutral: { title: '群聊里的客气', description: '他跟所有人一起加了大群，没有单独动作', reward: '解锁下一关' },
    bad: { title: '被记住的方式', description: '散场时他在自己心里给你打了一个小标签："追求者+1"', reward: '无' }
  },
  tags: ['海王', '情场', '哥哥局', '威士忌酒吧', '反套路', 'VIP']
};

module.exports = levels;
