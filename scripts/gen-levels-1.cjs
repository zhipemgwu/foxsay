/**
 * L001-L005 关卡卡（对应 R001-R005）
 * 每个关卡 = 该角色在故事中的第一次遭遇/核心场景
 */
const levels = {};

// ============ L001 — 咖啡馆的意外重逢 (苏晚 R001) ============
levels['L001'] = {
  meta: { kid: 'L001', title: '咖啡馆的意外重逢', chapter_id: 1, chapter_name: '初遇·冷系御姐', level_index: 1, difficulty: 'easy', estimated_turns: 12, unlock_condition: '无（首关免费）', vip_required: false },
  world: { era: '现代都市', city: '上海', season: '夏末秋初', world_rules: '现实世界，没有超自然元素，人物遵循正常社会规则。', social_context: '都市白领日常场景，咖啡馆、地铁、商场是常见空间。', tone: '轻松浪漫中带一丝距离感' },
  scene: {
    location: '一家装修复古的独立咖啡馆，木质桌椅，暖黄灯光，窗外下着小雨',
    time_of_day: '下午3点',
    weather: '小雨',
    atmosphere: '安静温馨，只有轻柔的爵士乐和咖啡机的声音',
    sensory_details: {
      visual: '暖黄灯光透过雨滴模糊的玻璃窗，木质书架上摆着几本旧书',
      audio: '爵士乐、咖啡机蒸汽声、窗外雨声',
      smell: '浓郁的咖啡香混合着雨后泥土的气息',
      touch: '手指触碰温热的陶瓷杯壁'
    },
    props: ['一杯冒着热气的拿铁', '一本被翻开的小说', '窗边的空位']
  },
  story_node: {
    premise: '你为了躲雨走进这家咖啡馆，发现吧台边坐着一个气质出众的女生。她似乎正在为什么事情烦恼，面前的咖啡已经凉了。',
    player_objective: '自然地搭上话，不要显得刻意或者油腻',
    narrative_arc: '陌生人 → 短暂交谈 → 产生好感 → 交换联系方式',
    key_plot_beats: [
      '进门时目光交汇的第一个瞬间',
      '找到一个自然的搭话理由（比如询问座位、点单推荐）',
      '在对话中发现一个共同兴趣点',
      '对方开始主动延续话题（好感信号）',
      '一个小意外打断对话（制造紧张感）',
      '临别时的联系方式交换'
    ],
    branching_hints: {
      good_path: '自然大方，不卑不亢 → 对方产生兴趣，主动给联系方式',
      neutral_path: '中规中矩，没有亮点 → 礼貌交换联系方式但对方不太上心',
      bad_path: '太刻意或油腻 → 对方找借口离开'
    }
  },
  characters: {
    npc_list: [{
      role_kid: 'R001',
      role_in_this_level: '女主角 — 坐在吧台边的神秘女生',
      current_mood: '有点烦躁，但对新鲜事物保持好奇',
      current_status: '刚和闺蜜吵了一架，来咖啡馆散心',
      attitude_toward_player: '初始冷淡、观察型。如果玩家表现自然有趣，会逐渐放下防备',
      this_level_special_behavior: '会先用犀利的话试探玩家，如果玩家不怯场，她会露出第一个真诚的微笑'
    }],
    player_role: { identity: '普通上班族，26岁，为躲雨误入这家咖啡馆', player_knows: '你只知道面前这个女生看起来心情不太好', player_doesnt_know: '你不知道她是外企高级策划，也不知道她的冷淡是创伤后的自我保护' }
  },
  dialogue: {
    opening_message: '你推开咖啡馆的门，带着一身雨水的凉意走了进来。环顾四周，只剩吧台边有一个空位——旁边坐着一个气场很足的长发女生，面前的咖啡似乎已经放了很久。\n\n她抬头扫了你一眼，然后继续看着窗外的雨。',
    opening_choices: ['「这里有人吗？」（礼貌询问空位）', '「外面雨好大，你的咖啡都凉了。」（试探性搭话）', '（默默坐到稍远的位置，不打扰她）'],
    system_narration_style: '第二人称（你），带有轻小说的画面感。描写简洁有氛围感，不要长篇大论。',
    max_turns: 20,
    min_turns_for_good_ending: 8
  },
  scoring: {
    dimensions: [
      { name: '自然度', weight: 0.3, description: '对话是否自然不做作' },
      { name: '情商', weight: 0.25, description: '是否能读懂对方的情绪和暗示' },
      { name: '吸引力', weight: 0.25, description: '是否展现了个人魅力和价值' },
      { name: '分寸感', weight: 0.2, description: '是否知道什么时候进、什么时候退' }
    ],
    pass_score: 60,
    perfect_score_threshold: 90,
    fail_conditions: ['连续3次让对方感到不舒服', '使用侮辱性或骚扰性语言', '完全偏离剧情场景']
  },
  endings: {
    good: { title: '雨后初晴', description: '她冲你笑了一下，掏出手机 —— "加个微信吧，以后下雨的时候……你知道在哪找我。"', reward: '解锁下一关 + 获得"怦然心动"成就' },
    neutral: { title: '擦肩而过', description: '她礼貌地点了点头，收拾东西准备离开。走到门口时回头看了你一眼 —— 但那一眼很快消失在雨幕里。', reward: '解锁下一关' },
    bad: { title: '咖啡的冷漠', description: '她放下咖啡杯，起身付账，离开前没有再看你一眼。', reward: '无，需重新挑战' }
  },
  tags: ['初遇', '搭讪', '咖啡馆', '雨天', '御姐', '冷淡']
};

// ============ L002 — 深夜书店的慢热靠近 (陆沉 R002) ============
levels['L002'] = {
  meta: { kid: 'L002', title: '深夜书店的慢热靠近', chapter_id: 1, chapter_name: '初遇·慢热文艺', level_index: 2, difficulty: 'medium', estimated_turns: 15, unlock_condition: '完成 L001 或 购买单关', vip_required: false },
  world: { era: '现代都市', city: '北京', season: '深秋', world_rules: '现实世界，都市独居青年日常。', social_context: '24小时独立书店是城市里为数不多的夜晚避难所', tone: '安静、文艺、缓慢升温' },
  scene: {
    location: '一家24小时的独立书店，灯光昏黄，书架很高',
    time_of_day: '凌晨1点',
    weather: '晴朗微凉',
    atmosphere: '几乎无人，只有翻书声和暖气的嗡鸣',
    sensory_details: {
      visual: '昏黄的吊灯，旧书的发黄书脊，角落里的一盏小台灯',
      audio: '书页翻动声、远处店员轻微的整理声、空调的低鸣',
      smell: '旧书的木质气味、淡淡的咖啡香',
      touch: '书页粗糙的质感、毛衣袖口蹭过书脊的微弱摩擦'
    },
    props: ['同一本《百年孤独》的最后一本', '角落的单人沙发', '你们之间的三格书架']
  },
  story_node: {
    premise: '你深夜失眠来逛书店，看中了一本《百年孤独》，伸手时却碰到了另一只同时伸过来的手——是一个戴眼镜的安静男生。这本是店里最后一本。',
    player_objective: '在这个沉默的人身上找到一条进入他世界的缝隙',
    narrative_arc: '抢书→互相让→坐下聊→发现共同兴趣→加联系方式',
    key_plot_beats: [
      '同时抢到同一本书的瞬间尴尬',
      '一方礼貌让步后的意外对话',
      '对"你为什么喜欢这本书"的回答判断品味',
      '从书聊到人生的一段深度对话',
      '店员打烊提醒打破沉浸',
      '留下联系方式的方式（豆瓣？微信？）'
    ],
    branching_hints: {
      good_path: '先让书、再聊作者作品的深层理解 → 对方觉得"终于遇到一个懂的人"',
      neutral_path: '聊一些表面的书评 → 对方客气但不主动',
      bad_path: '用俗套话搭讪或者强行表现博学 → 对方婉拒对话'
    }
  },
  characters: {
    npc_list: [{
      role_kid: 'R002',
      role_in_this_level: '男主角 — 深夜书店的文艺青年',
      current_mood: '惯常的沉默，但今晚有一丝说话的欲望',
      current_status: '刚结束一个失败的约会，一个人来书店静心',
      attitude_toward_player: '初始冷淡、会长时间沉默观察你。如果你言之有物他会慢慢开口',
      this_level_special_behavior: '回答会比问题迟一拍，但每一句都有内容。被问到私事会转移话题而不是拒绝'
    }],
    player_role: { identity: '深夜失眠来逛书店的你', player_knows: '他看起来是个文艺青年', player_doesnt_know: '他是一位小有名气的文学刊编辑，经历过一段被背叛的长期感情' }
  },
  dialogue: {
    opening_message: '书架最底层只剩一本《百年孤独》。你蹲下身正要拿——另一只手同时从另一侧伸了过来。\n\n你抬头，对上一双戴着金丝眼镜的眼睛。他的手在你碰到书脊的半秒前停住，没有抢，也没有收回。\n\n"……" 他没说话，但眼神在问：你要？',
    opening_choices: ['「你先拿吧。」（礼貌退让）', '「你也喜欢马尔克斯？」（转向聊书）', '「要不我们猜拳？」（开玩笑破冰）'],
    system_narration_style: '第二人称，节奏慢，善用留白和沉默的描写',
    max_turns: 22,
    min_turns_for_good_ending: 10
  },
  scoring: {
    dimensions: [
      { name: '耐心', weight: 0.3, description: '是否愿意等他开口而不急于填满沉默' },
      { name: '品味', weight: 0.3, description: '对文学/艺术话题的理解深度' },
      { name: '真诚', weight: 0.25, description: '是否避免了套路和表演' },
      { name: '分寸', weight: 0.15, description: '是否尊重他的边界' }
    ],
    pass_score: 65,
    perfect_score_threshold: 92,
    fail_conditions: ['用营销号话术套路他', '连续打断他的沉默', '强行展示优越感']
  },
  endings: {
    good: { title: '凌晨两点的豆瓣', description: '他从口袋里掏出手机："加一下豆瓣吧，微信我不怎么用。" —— 这是他给所有人中最高的待遇', reward: '解锁下一关 + "懂我的人"成就' },
    neutral: { title: '夜色中的背影', description: '他把书让给你，点头道了晚安，走进夜色。你看着他的背影，忽然觉得错过了什么', reward: '解锁下一关' },
    bad: { title: '无声的拒绝', description: '他把书让给你，然后转身走向另一个书架，直到打烊没再回头。', reward: '无' }
  },
  tags: ['文艺', '慢热', '书店', '深夜', '高情商', '智性恋']
};

// ============ L003 — 夜店里的危险游戏 (林悦 R003) ============
levels['L003'] = {
  meta: { kid: 'L003', title: '夜店里的危险游戏', chapter_id: 2, chapter_name: '试炼·情场高手', level_index: 1, difficulty: 'hard', estimated_turns: 18, unlock_condition: '完成 L001 和 L002', vip_required: true },
  world: { era: '现代都市', city: '成都', season: '夏夜', world_rules: '都市夜场文化，规则模糊但情商为王', social_context: '九眼桥夜店圈，玩得转的人比你想的多', tone: '暧昧、危险、刺激' },
  scene: {
    location: '一家网红夜店的卡座区，震耳的电子乐，闪烁的紫红色灯光',
    time_of_day: '晚上11:30',
    weather: '闷热',
    atmosphere: '人声嘈杂，香水混着酒精味，每一眼都可能是陷阱',
    sensory_details: {
      visual: '紫红激光在空气中切出立体图案，她的指甲油是暗红色的',
      audio: '低频蹦迪节拍震动胸腔，周围一切声音都模糊成一团',
      smell: '香槟、香水、汗味、电子烟的混合气味',
      touch: '高脚杯凝结的冷凝水顺着指缝滑下'
    },
    props: ['两杯 Long Island', '她手机里滚动弹出的三个"宝宝"', '卡座上的小袋子']
  },
  story_node: {
    premise: '朋友临时放鸽子，你一个人在卡座喝闷酒。隔壁卡座的女生主动端着酒过来坐到你旁边——一看就不是省油的灯。',
    player_objective: '既不被她套路玩弄，也不错过真正的机会 —— 读懂她的游戏',
    narrative_arc: '被搭讪 → 识破套路 → 反客为主 → 她真正感兴趣',
    key_plot_beats: [
      '她主动坐过来时的试探话',
      '她的手机不断弹出其他人的消息',
      '她用故事测试你的反应',
      '你是否表现出"和其他舔狗一样"的行为',
      '她说出一句真心话的瞬间',
      '临别她选择给真号还是小号'
    ],
    branching_hints: {
      good_path: '识破但不拆穿，玩她的游戏而不被她玩 → 她给了真的微信',
      neutral_path: '礼貌周旋，没踩坑但也没亮点 → 她给了一个微信（营业号）',
      bad_path: '太热情想证明自己 → 她笑着收你进鱼塘，三天不回消息'
    }
  },
  characters: {
    npc_list: [{
      role_kid: 'R003',
      role_in_this_level: '女主角 — 主动搭讪的酷系女生',
      current_mood: '无聊，想找个有趣的玩具',
      current_status: '同时跟几个男生在暧昧，今晚想挑一个新的',
      attitude_toward_player: '职业性的热情，眼神却冷静在评估',
      this_level_special_behavior: '会故意让手机消息弹在你面前，看你的反应。真正感兴趣的人她反而会慢半拍'
    }],
    player_role: { identity: '今晚被朋友放鸽子一个人喝酒的你', player_knows: '她一看就是情场老手', player_doesnt_know: '她内心其实也想遇到一个不把她当"鱼塘鱼"的人' }
  },
  dialogue: {
    opening_message: '紫红色的灯光扫过你的脸。一个穿小黑裙的女生端着两杯酒，笑眯眯地坐到你旁边——动作熟练得像做过一百次。\n\n"一个人喝酒很无聊吧？我刚好也是。"\n\n她手机的屏幕在桌面上亮了一下：**大哥哥** 发来消息。她没看。',
    opening_choices: ['「你手机响了。」（直接戳破）', '「你这招对多少人用过？」（不动声色调侃）', '「谢谢，不过我更想知道你为什么坐这儿。」（反客为主）'],
    system_narration_style: '第二人称，节奏快，突出气氛的危险和紫红色美学',
    max_turns: 25,
    min_turns_for_good_ending: 12
  },
  scoring: {
    dimensions: [
      { name: '识破力', weight: 0.3, description: '能否看穿她的套路' },
      { name: '反控场', weight: 0.3, description: '能否把控话题节奏' },
      { name: '不卑不亢', weight: 0.25, description: '是否不被气场压制' },
      { name: '真诚', weight: 0.15, description: '关键时刻能否流露真诚' }
    ],
    pass_score: 70,
    perfect_score_threshold: 93,
    fail_conditions: ['请她喝了三杯以上但她都没碰', '问出"你真的喜欢我吗"这种问题', '把真实住址说给她']
  },
  endings: {
    good: { title: '真的微信', description: '她把手机递给你："我昨晚刚删了三个人的备注。现在还剩两个，加一下吧。" 这是她的真号', reward: '解锁下一关 + "玩家"成就' },
    neutral: { title: '鱼塘 +1', description: '她甜甜地加了你微信，把你的备注存成了 **新的小哥哥**', reward: '解锁下一关' },
    bad: { title: '第二天已读不回', description: '她跟你喝到凌晨3点，加了微信，第二天起就再也没回过', reward: '无' }
  },
  tags: ['夜店', '情场', '套路', '鱼塘', '智斗', 'VIP']
};

// ============ L004 — 健身房的钢铁翻译 (赵岚 R004) ============
levels['L004'] = {
  meta: { kid: 'L004', title: '健身房的钢铁翻译', chapter_id: 2, chapter_name: '试炼·情场高手', level_index: 2, difficulty: 'medium', estimated_turns: 14, unlock_condition: '完成 L003', vip_required: false },
  world: { era: '现代都市', city: '深圳', season: '任意', world_rules: '健身房文化，硬核派不屑于废话', social_context: '高端健身房晚上8点高峰', tone: '硬核、直接、意外有戏' },
  scene: {
    location: '大型商业健身房的自由力量区',
    time_of_day: '晚上8点',
    weather: '室内恒温',
    atmosphere: '金属碰撞声+各种呼喝+汗味',
    sensory_details: { visual: '她穿黑色健身长裤做100kg硬拉动作标准得像教科书', audio: '杠铃片撞击地面的巨响、她的呼吸节奏', smell: '汗+护手粉', touch: '金属杠铃的冰凉感' },
    props: ['一根奥杠', '一排100kg+杠铃片', '她水壶上贴的格斗俱乐部贴纸']
  },
  story_node: {
    premise: '你在健身房做硬拉，姿势不太标准。正看着她做完一组漂亮的100kg硬拉，她走过来，面无表情："你后背圆了，回家吧再这样练腰完蛋。"',
    player_objective: '跟一个钢铁直女建立真实连接 —— 不要用俗套',
    narrative_arc: '被指出错误 → 虚心接受 → 聊训练 → 发现共同爱好 → 约训',
    key_plot_beats: [
      '被她纠正动作时的反应',
      '聊训练细节时是否被认可',
      '对她"不谈恋爱"宣言的回应',
      '一起组练时的默契',
      '她关心你卧推时的护杠瞬间',
      '约下次一起练的方式'
    ],
    branching_hints: {
      good_path: '虚心学+硬核讨论+尊重她的边界 → 她第一次主动加微信约练',
      neutral_path: '客气但没亮点 → 她偶尔点个头',
      bad_path: '用"妹子练这么猛啊"式油腻话 → 她冷冷一句"你还是回去练卷腹吧"'
    }
  },
  characters: {
    npc_list: [{
      role_kid: 'R004',
      role_in_this_level: '女主角 — 健身房里的硬核大姐大',
      current_mood: '训练专注期',
      current_status: '比赛备赛最后两周',
      attitude_toward_player: '默认对所有男生不屑。对硬核有要求的人会认可',
      this_level_special_behavior: '不会讲客气话，不会用"应该"，会直接说"这样错"。但认可你之后会非常慷慨地分享经验'
    }],
    player_role: { identity: '健身半年的普通上班族', player_knows: '她看起来是个狠人', player_doesnt_know: '她是业余级别力量举选手，备战全国赛' }
  },
  dialogue: {
    opening_message: '你刚做完第三组硬拉，腰有点发酸。\n\n"你后背圆了。" \n\n一个声音从旁边传来。你抬头，看见刚才做100kg硬拉的那个女生，面无表情地看着你的杠铃，像在评判一份糟糕的作业。\n\n"再这样练，腰椎早晚废。"',
    opening_choices: ['「啊……哪里不对？」（虚心请教）', '「你硬拉多少？」（直接聊技术）', '「那你能教我吗？」（直接求教）'],
    system_narration_style: '第二人称，硬核向，多用动作细节代替心理描写',
    max_turns: 20,
    min_turns_for_good_ending: 9
  },
  scoring: {
    dimensions: [{ name: '专业', weight: 0.35, description: '健身/训练知识含量' }, { name: '虚心', weight: 0.25, description: '是否能被指出错误还虚心' }, { name: '直接', weight: 0.25, description: '是否不废话不客套' }, { name: '分寸', weight: 0.15, description: '不油腻' }],
    pass_score: 65,
    perfect_score_threshold: 90,
    fail_conditions: ['调戏身材', '问"你为什么练这么壮"', '说一些低情商的直男话']
  },
  endings: {
    good: { title: '队友', description: '"我周二周四这个点在。" 她说。"组个训？有人护杠效率高。" —— 这是她的最高评价', reward: '解锁下一关 + "硬核玩家"成就' },
    neutral: { title: '点头之交', description: '她纠正完你的姿势就走了，偶尔碰到还会点个头', reward: '解锁下一关' },
    bad: { title: '从此不见', description: '她听完你说的话，冷笑一声："你还是回去练卷腹吧。" 此后健身房永远错开时段', reward: '无' }
  },
  tags: ['健身房', '钢铁直女', '硬核', '反套路']
};

// ============ L005 — 妈妈安排的相亲局 (周宁 R005) ============
levels['L005'] = {
  meta: { kid: 'L005', title: '妈妈安排的相亲局', chapter_id: 2, chapter_name: '试炼·情场高手', level_index: 3, difficulty: 'easy', estimated_turns: 14, unlock_condition: '完成 L004', vip_required: false },
  world: { era: '现代都市', city: '杭州', season: '春天', world_rules: '现实的中国式相亲文化', social_context: '28岁前后的中产家庭相亲圈', tone: '尴尬中带真诚，慢慢破冰' },
  scene: {
    location: '一家安静的中餐厅包间',
    time_of_day: '中午12点半',
    weather: '晴朗',
    atmosphere: '两家长辈在邻桌等消息，你们单独一桌',
    sensory_details: { visual: '她穿简约米色连衣裙，化了淡妆，手里转着茶杯', audio: '包间外偶尔传来长辈的笑声', smell: '茶香、炒菜香', touch: '冰凉的陶瓷茶杯' },
    props: ['两份还没翻开的菜单', '她妈妈在包里的电话', '两人中间的一个尴尬的沉默']
  },
  story_node: {
    premise: '你的母亲跟阿姨是老同事，周末约了这场相亲。你们都是被推来的——但她看起来比你还紧张，又比你成熟。',
    player_objective: '把一次尴尬的相亲变成真正的了解',
    narrative_arc: '尴尬寒暄 → 放下压力聊真心 → 发现彼此不错 → 决定自己约一次',
    key_plot_beats: [
      '开场的尴尬寒暄',
      '一方主动打破"相亲模式"的瞬间',
      '聊到各自的真实生活和顾虑',
      '发现共同话题（工作/爱好/对婚姻的看法）',
      '双方家长来"查岗"时如何应对',
      '决定不要让家长安排第二次 —— 自己约'
    ],
    branching_hints: {
      good_path: '主动打破相亲模式+真诚交流 → 两人决定之后自己约不用家长掺和',
      neutral_path: '按相亲流程走完 → 回家后家长问你觉得怎么样',
      bad_path: '表现出傲慢或者太强的条件交换意识 → 她回家说不合适'
    }
  },
  characters: {
    npc_list: [{
      role_kid: 'R005',
      role_in_this_level: '相亲对象 — 温柔但紧张的女生',
      current_mood: '紧张又有点无奈',
      current_status: '被妈妈推来相亲的第 4 次',
      attitude_toward_player: '客气但保留，在观察你是不是"那种"相亲男',
      this_level_special_behavior: '会用"你呢？"反客为主，善用反问来了解你。不喜欢被当成"条件匹配对象"'
    }],
    player_role: { identity: '28岁被妈妈催婚推来的你', player_knows: '对方是阿姨朋友家的女儿，28岁，做会计', player_doesnt_know: '她已经相亲过4个，对"条件派"已经厌烦了' }
  },
  dialogue: {
    opening_message: '包间门被服务员轻轻合上。\n\n对面坐着的女生抿了一口茶，抬头朝你礼貌地笑了笑。她的手指不自觉地转着茶杯。\n\n"阿姨说你……也是第一次相亲？"\n\n门外隐约传来你妈的笑声。',
    opening_choices: ['「其实我们都很尴尬吧？」（主动打破气氛）', '「第一次……但看起来你好像有经验？」（幽默开场）', '「你想先点菜还是先聊？」（安全但无聊）'],
    system_narration_style: '第二人称，生活化，多细节（茶杯、菜单、长辈脚步声）',
    max_turns: 20,
    min_turns_for_good_ending: 9
  },
  scoring: {
    dimensions: [{ name: '真诚', weight: 0.35, description: '跳出相亲模式的程度' }, { name: '共情', weight: 0.3, description: '能否理解她的尴尬和压力' }, { name: '价值观', weight: 0.2, description: '对婚姻的真实想法' }, { name: '幽默', weight: 0.15, description: '气氛调节' }],
    pass_score: 60,
    perfect_score_threshold: 88,
    fail_conditions: ['列自己的条件列表', '问她"你打算什么时候要孩子"', '贬低她的工作或家庭']
  },
  endings: {
    good: { title: '私下再约', description: '走出餐厅时她悄悄跟你说："下周末有空吗？这次我们自己约不用她们掺和。"', reward: '解锁下一关 + "真诚派"成就' },
    neutral: { title: '友好的结束', description: '相亲结束，双方礼貌交换了微信，但谁都没有先发消息', reward: '解锁下一关' },
    bad: { title: '下一位下一位', description: '她回家告诉妈妈："这个不太合适。"', reward: '无' }
  },
  tags: ['相亲', '真诚', '生活化', '温柔']
};

module.exports = levels;
