/**
 * L016-L020 关卡卡（对应 R016-R020）
 */
const levels = {};

// ============ L016 — 画展开幕的偶遇 (叶知秋 R016) ============
levels['L016'] = {
  meta: { kid: 'L016', title: '画展开幕的偶遇', chapter_id: 5, chapter_name: '身份·不同世界', level_index: 1, difficulty: 'medium', estimated_turns: 15, unlock_condition: '完成 L015', vip_required: false },
  world: { era: '现代都市', city: '上海', season: '初春', world_rules: '当代艺术圈', social_context: '一个独立画廊的开幕酒会', tone: '安静、文艺、克制的欣赏' },
  scene: {
    location: '独立画廊的白盒子展厅',
    time_of_day: '晚上7:30',
    weather: '室内',
    atmosphere: '人不多，每个人都在轻声交谈',
    sensory_details: { visual: '她穿一身墨绿色长外套站在自己作品前', audio: '低声讨论、高跟鞋的节奏', smell: '红酒+油画颜料', touch: '手中高脚杯底部的凉' },
    props: ['她画的一组以"沉默"为主题的作品', '你手中那杯没喝的红酒', '她口袋里悄悄放着的一瓶药']
  },
  story_node: {
    premise: '朋友请你来看他们团队的画展开幕。你在一幅让你印象深刻的作品前驻足，画家本人正好在旁边——是一个安静有气质的女生。',
    player_objective: '聊出一种她从未被人这样看见的对话',
    narrative_arc: '看画+评论 → 她温柔回应 → 聊到作品背后的故事 → 发现她的隐藏深度 → 约下次单独见画',
    key_plot_beats: [
      '你对画的第一眼评论',
      '她微笑着听你说完',
      '你问到画背后的情绪',
      '她第一次认真打量你',
      '她提到"很少有人看到这个"',
      '她悄悄问你有没有时间下周单独看她的另一幅'
    ],
    branching_hints: {
      good_path: '不懂装懂 vs 真诚感受 → 她被你打动',
      neutral_path: '说一些艺术行话但没走心 → 她礼貌点头',
      bad_path: '问价格/问她卖得怎样 → 她客气地走开'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R016', role_in_this_level: '画展作者', current_mood: '疲惫但要保持优雅', current_status: '开幕当天+悄悄压抑着偏头痛', attitude_toward_player: '默认是"又一个来客气的人"', this_level_special_behavior: '会用"你怎么看"引导你表达。真诚的感受比专业术语更打动她' }],
    player_role: { identity: '被朋友带来的观众', player_knows: '她是今天画展的主角', player_doesnt_know: '这是她两年后第一次开展，心理压力很大' }
  },
  dialogue: {
    opening_message: '你站在一幅画前很久了。\n\n画面里是一个女生的侧影，被放在一大片蓝色里，但她的轮廓却是空的——像被挖走了。\n\n"你喜欢这一张？"\n\n一个温柔的声音在你身后响起。你转身——画家本人，安静地拿着一杯红酒站在你身后。',
    opening_choices: ['「……这个女生不像是孤独，更像是选择了一个人。」（真诚感受）', '「蓝色用得很好，让人想起克莱因蓝。」（显摆术语）', '「你画这个的时候在想什么？」（直接问）'],
    system_narration_style: '第二人称，安静、文艺，描写多颜色和光影',
    max_turns: 20,
    min_turns_for_good_ending: 9
  },
  scoring: {
    dimensions: [{ name: '感受力', weight: 0.35, description: '真诚的艺术感受' }, { name: '深度', weight: 0.3, description: '能聊到作品背后' }, { name: '不装', weight: 0.2, description: '不用术语装懂' }, { name: '尊重', weight: 0.15, description: '不问价不问销量' }],
    pass_score: 65,
    perfect_score_threshold: 92,
    fail_conditions: ['问"这个能卖多少钱"', '说"我也会画一点"然后开始自说自话', '夸她的颜值不夸作品']
  },
  endings: {
    good: { title: '下周的邀请', description: '她走前悄悄说"下周三我的工作室有另一张没展出的——要不要来看？" 这是她第一次私下邀请陌生人', reward: '解锁下一关 + "被看见"成就' },
    neutral: { title: '艺术爱好者', description: '她礼貌跟你聊了五分钟就去招呼别的客人', reward: '解锁下一关' },
    bad: { title: '没记住的观众', description: '她礼貌微笑听完你说就走了，忘了你的名字', reward: '无' }
  },
  tags: ['艺术', '画展', '文艺', '真诚感受']
};

// ============ L017 — 急诊室的初见 (温妍 R017) ============
levels['L017'] = {
  meta: { kid: 'L017', title: '急诊室的初见', chapter_id: 5, chapter_name: '身份·不同世界', level_index: 2, difficulty: 'medium', estimated_turns: 14, unlock_condition: '完成 L016', vip_required: false },
  world: { era: '现代都市', city: '广州', season: '夏天', world_rules: '三甲医院急诊夜班', social_context: '你半夜发烧38.5', tone: '专业冷静+慢慢暖' },
  scene: {
    location: '三甲医院急诊诊室',
    time_of_day: '凌晨2点',
    weather: '室外暴雨',
    atmosphere: '消毒水味+日光灯白',
    sensory_details: { visual: '她穿白大褂戴听诊器，眼底有淡淡的黑眼圈', audio: '监护仪嗡鸣+打印机+远处呼救声', smell: '消毒水+她白大褂上的淡味', touch: '冰凉的体温枪贴在额头' },
    props: ['她手里的处方本', '你发烫的额头', '她口袋里的巧克力（给低血糖自救）']
  },
  story_node: {
    premise: '你半夜急性肠胃炎+发烧跑去急诊。接诊的医生是一个看起来比你大几岁的姐姐，专业冷静但有股让人安心的气场。',
    player_objective: '跟一个职业医生建立一个超越"医患关系"的真正联系 —— 以她为人而非医生',
    narrative_arc: '被看诊 → 你提问 → 她短暂放下职业面具 → 她建议一个生活化建议 → 她跟你说"好好照顾自己"',
    key_plot_beats: [
      '她的专业问诊',
      '你问一个超出病情的问题',
      '她短暂愣了一下然后笑',
      '她看你吊水时陪你说话',
      '她班下之前叮嘱你的方式',
      '离开时的一句"你家里有人照顾吗"'
    ],
    branching_hints: {
      good_path: '尊重她的专业+让她看到你真诚 → 她主动留了微信"有问题可以问我"',
      neutral_path: '按医患关系走完 → 出院就结束',
      bad_path: '借病搭讪/要联系方式 → 她冷冷一句"注意分寸"'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R017', role_in_this_level: '急诊医生', current_mood: '夜班末期的疲惫但专业', current_status: '连续值班14小时', attitude_toward_player: '默认是"又一个病人"', this_level_special_behavior: '专业极高+眼神锐利。看得出谁在真的不舒服谁在装。会对真诚的人破例留言' }],
    player_role: { identity: '深夜挂急诊的病人', player_knows: '她是主治医生', player_doesnt_know: '她白天还要上门诊，已经 30 小时没好好睡' }
  },
  dialogue: {
    opening_message: '"自己来的？" 她抬头看了你一眼，声音平稳。\n\n你点点头。体温枪"嘀"地响了一声：38.7。\n\n她手指轻巧地在键盘上敲："从什么时候开始？有没有恶心？吃了什么？"\n\n简练、准确、快。像一台专业的仪器——但她抬头时的眼睛里，有一丝疲惫。',
    opening_choices: ['（认真回答她的每一个问题）', '「谢谢医生，你看起来也很累。」（关心）', '「下午三点吃了外卖……」（乖乖回答）'],
    system_narration_style: '第二人称，医学感+一些温暖的小细节',
    max_turns: 20,
    min_turns_for_good_ending: 9
  },
  scoring: {
    dimensions: [{ name: '尊重', weight: 0.35, description: '尊重她的专业' }, { name: '真诚', weight: 0.3, description: '不装病不装弱' }, { name: '观察', weight: 0.2, description: '看到白大褂之外的她' }, { name: '分寸', weight: 0.15, description: '不借病搭讪' }],
    pass_score: 65,
    perfect_score_threshold: 90,
    fail_conditions: ['借机问她单不单身', '要她私人微信', '装病以博同情']
  },
  endings: {
    good: { title: '有问题可以找我', description: '开完药她把一张小纸条给你："这是我值班科室的直线，有问题可以打。" —— 她几乎没给过这个', reward: '解锁下一关 + "被照顾的人"成就' },
    neutral: { title: '下次再见', description: '她专业地完成诊治，你付账离开', reward: '解锁下一关' },
    bad: { title: '病人很多', description: '她用严肃语气说"请注意就诊分寸" —— 你感到了羞愧', reward: '无' }
  },
  tags: ['医生', '急诊', '职业', '姐姐型']
};

// ============ L018 — 家长会后的老师约谈 (苏敏 R018) ============
levels['L018'] = {
  meta: { kid: 'L018', title: '家长会后的老师约谈', chapter_id: 5, chapter_name: '身份·不同世界', level_index: 3, difficulty: 'medium', estimated_turns: 14, unlock_condition: '完成 L017', vip_required: false },
  world: { era: '现代都市', city: '成都', season: '秋天', world_rules: '小学/初中老师专业感', social_context: '你以叔叔/家长身份来替姐姐参加家长会', tone: '尊重+反差感' },
  scene: {
    location: '小学教室',
    time_of_day: '傍晚6点，其他家长已走',
    weather: '晴朗',
    atmosphere: '安静教室+窗外夕阳',
    sensory_details: { visual: '她穿米色针织衫+长裙，耳朵上小珍珠耳钉', audio: '远处打球声+扫地阿姨', smell: '粉笔灰+纸质教材', touch: '课桌上的铅笔屑' },
    props: ['你侄子的成绩单', '她整理的孩子们的作文本', '她办公桌上的一个孩子送的手折纸玫瑰']
  },
  story_node: {
    premise: '姐姐临时加班，你替她来参加侄子的家长会。会后老师留下你单独约谈——她是一个温柔得让你走神的年轻女老师。',
    player_objective: '从"孩子叔叔"身份里找到跟一个温柔老师真实对话的空间',
    narrative_arc: '老师汇报 → 你认真讨论教育 → 她对你的观察 → 发现共同话题 → 自然留联系方式',
    key_plot_beats: [
      '她对侄子情况的专业分析',
      '你给出一个她没预料到的家庭视角',
      '她问你自己的想法',
      '你们从孩子聊到成长',
      '她问起你的工作',
      '她说"孩子叔叔能这么上心的不多"'
    ],
    branching_hints: {
      good_path: '在孩子的话题里表现关心+智慧 → 她对你有不一样的印象',
      neutral_path: '只谈孩子问题 → 家长会结束了',
      bad_path: '借孩子搭讪她 → 她职业性结束对话'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R018', role_in_this_level: '侄子的班主任', current_mood: '一天工作末的温和', current_status: '今天见了20个家长', attitude_toward_player: '职业化的礼貌+对"家长叔叔"有一丝好奇', this_level_special_behavior: '说话有教师的分寸感+很擅长引导。被真诚关心孩子的家长打动' }],
    player_role: { identity: '侄子的叔叔/姨父', player_knows: '侄子最近学习有点下滑', player_doesnt_know: '侄子在学校一直把你当偶像经常讲你的故事' }
  },
  dialogue: {
    opening_message: '其他家长都走了。她一边整理课桌上一沓作文本，一边朝你点点头示意坐下。\n\n"小明叔叔，您坐。这次把您特意留下来——" 她的语气很温和，但很明显是职业的那种。\n\n"是他最近写的一篇作文，我想让您看看。"\n\n她把一个本子递过来。翻开第一页，标题是：《我最想成为的人》。',
    opening_choices: ['（接过本子安静读完再说）', '「他在学校状态怎么样？」（关心孩子）', '「这个主题是您出的吗？」（聊教育）'],
    system_narration_style: '第二人称，教师氛围+温柔克制',
    max_turns: 20,
    min_turns_for_good_ending: 9
  },
  scoring: {
    dimensions: [{ name: '责任感', weight: 0.3, description: '对孩子真关心' }, { name: '教育观', weight: 0.3, description: '有独立思考' }, { name: '尊重', weight: 0.25, description: '尊重她的专业身份' }, { name: '分寸', weight: 0.15, description: '不借机搭讪' }],
    pass_score: 65,
    perfect_score_threshold: 92,
    fail_conditions: ['借孩子要老师微信约饭', '说"我姐不在这孩子我管"来占功劳', '用家长身份压老师']
  },
  endings: {
    good: { title: '私下的家校群', description: '聊完她建了一个"小明家校沟通"的小群，只拉了你和她"以后孩子有情况我直接跟您说"', reward: '解锁下一关 + "好叔叔"成就' },
    neutral: { title: '正常家长', description: '家长会结束，老师跟孩子爸妈一样客气', reward: '解锁下一关' },
    bad: { title: '失望的老师', description: '她微笑说"谢谢家长配合"就送你出门，没有继续的可能', reward: '无' }
  },
  tags: ['老师', '家长会', '教育', '姐姐型']
};

// ============ L019 — 创业路演的认识 (陆沉舟 R019) ============
levels['L019'] = {
  meta: { kid: 'L019', title: '创业路演的认识', chapter_id: 5, chapter_name: '身份·不同世界', level_index: 4, difficulty: 'hard', estimated_turns: 16, unlock_condition: '完成 L018', vip_required: true },
  world: { era: '现代都市', city: '北京', season: '春天', world_rules: '互联网创业+VC 圈', social_context: '一场 demo day 路演结束后的酒会', tone: '高能+信息密集+机智' },
  scene: {
    location: '某联合办公的顶层酒会',
    time_of_day: '晚上8点',
    weather: '晴朗',
    atmosphere: '社交声音+名片交换+轻音乐',
    sensory_details: { visual: '他今天穿正装但领带有点歪，一看就是没好好休息', audio: '人声嘈杂+酒杯碰撞', smell: '红酒+咖啡', touch: '名片光滑质感' },
    props: ['他的创业计划书', '他手机里未读的57条消息', '他今天第4杯咖啡']
  },
  story_node: {
    premise: '你被朋友带来参加创业路演。最后一个项目的 founder 刚路演完——是一个35岁的男人，西装笔挺但眼底满是疲惫。散场后他一个人站在窗边端着酒杯，你凑过去搭话。',
    player_objective: '跟一个正在奋斗期的创业者建立一段有营养的对话，而不是当普通的"跟班粉丝"',
    narrative_arc: '递杯酒 → 聊他的 pitch → 提出一个他没想过的问题 → 他认真回应 → 留了你微信',
    key_plot_beats: [
      '他以为你是来要名片的',
      '你提出一个他 pitch 里的漏洞',
      '他愣了一下然后认真回答',
      '聊到他的创业痛点',
      '他坦白说最近很累',
      '他说"你这样的人我们团队缺"'
    ],
    branching_hints: {
      good_path: '用他行业的语言+提出有价值的观点 → 他把你放进"可能合作"名单',
      neutral_path: '聊一些表面的创业话题 → 他礼貌收名片',
      bad_path: '想投简历或想求带 → 他淡定打发'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R019', role_in_this_level: '创业者 founder', current_mood: '路演结束后的放空', current_status: '现金流还剩6个月', attitude_toward_player: '默认是"又一个来要联系方式的"', this_level_special_behavior: '话不多+听完对方说话再回+对有见解的人会直接问"你做什么的"' }],
    player_role: { identity: '听路演的观众', player_knows: '他路演的项目是什么', player_doesnt_know: '他当前最大的问题不是产品是团队缺一个关键角色' }
  },
  dialogue: {
    opening_message: '酒会角落的落地窗前，他一个人端着杯红酒，领带歪着没心情调整。\n\n窗外是城市的灯火。他看着那些灯火的表情，让你想起一个刚打完一场硬仗、还没回过神的人。\n\n你端着两杯酒走过去。',
    opening_choices: ['「你刚才 pitch 里的那个留存率数据是真实的吗？」（直接戳）', '「一个人看夜景？」（软开场）', '「不介意的话——」（递酒）'],
    system_narration_style: '第二人称，商务感+一些克制的温柔',
    max_turns: 22,
    min_turns_for_good_ending: 10
  },
  scoring: {
    dimensions: [{ name: '专业', weight: 0.4, description: '行业洞察含量' }, { name: '价值', weight: 0.3, description: '提供实质信息' }, { name: '气场', weight: 0.2, description: '不被他压制' }, { name: '真诚', weight: 0.1, description: '非利益性关心' }],
    pass_score: 72,
    perfect_score_threshold: 93,
    fail_conditions: ['要求投简历', '问他融多少钱', '说"我能帮你"却说不出怎么帮']
  },
  endings: {
    good: { title: '约下周喝咖啡', description: '他看着你："下周有空吗？单独聊。我有点事想听你看法。" —— 这是他罕见的主动', reward: '解锁下一关 + "有见地"成就' },
    neutral: { title: '客气的名片', description: '他礼貌收了你的名片就走了，之后没下文', reward: '解锁下一关' },
    bad: { title: '敷衍的微笑', description: '他认出你"想求带"的眼神，客气结束对话', reward: '无' }
  },
  tags: ['创业', 'VC', '路演', '专业派', 'VIP']
};

// ============ L020 — 幼儿园门口的意外相遇 (周棠 R020) ============
levels['L020'] = {
  meta: { kid: 'L020', title: '幼儿园门口的相遇', chapter_id: 5, chapter_name: '身份·不同世界', level_index: 5, difficulty: 'medium', estimated_turns: 14, unlock_condition: '完成 L019', vip_required: false },
  world: { era: '现代都市', city: '上海', season: '秋天', world_rules: '都市年轻妈妈+单亲家庭', social_context: '幼儿园放学时间', tone: '温暖、生活化、有一丝心酸' },
  scene: {
    location: '幼儿园门口',
    time_of_day: '下午5点',
    weather: '晴朗',
    atmosphere: '接孩子的家长群+孩子们叫喊',
    sensory_details: { visual: '她推着一辆婴儿车+牵着一个扎小辫的4岁女孩', audio: '孩子们的笑声+家长聊天', smell: '秋天的凉风+孩子身上的奶香', touch: '小女孩的小手抓住你的裤脚' },
    props: ['她女儿的小书包', '她手里的一袋水果', '她眼底的黑眼圈']
  },
  story_node: {
    premise: '你去接侄子/朋友家小孩放学。排队时前面一个年轻妈妈——她的4岁女儿忽然把你的裤脚当爸爸的腿抱住了。场面一时间尴尬又可爱。',
    player_objective: '跟一个单亲妈妈建立真实的连接 —— 不被她的身份吓到也不装圣人',
    narrative_arc: '意外互动 → 她尴尬道歉 → 你自然化解 → 聊孩子聊生活 → 她罕见地放下防备',
    key_plot_beats: [
      '小女孩抱错腿的瞬间',
      '你如何自然反应（不惊慌不嫌弃）',
      '妈妈道歉时的样子',
      '你蹲下来跟孩子说话',
      '她问你"你有孩子吗"',
      '分开时自然交换微信（群聊育儿经）'
    ],
    branching_hints: {
      good_path: '自然温暖+不强调单亲 → 她第一次觉得"可以当个朋友"',
      neutral_path: '帮忙化解尴尬后礼貌分开 → 不再联系',
      bad_path: '一听到单亲妈妈眼神一变 → 她默默疏远'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R020', role_in_this_level: '单亲妈妈', current_mood: '接孩子日常的温柔+一丝疲惫', current_status: '刚下班还没吃饭', attitude_toward_player: '礼貌+防备', this_level_special_behavior: '会观察你怎么跟孩子互动+讨厌被"我理解你"式的同情' }],
    player_role: { identity: '来接朋友家孩子的熟人', player_knows: '她是单亲妈妈（从家长群知道）', player_doesnt_know: '她两年前才离婚，这是她第二年独自接孩子' }
  },
  dialogue: {
    opening_message: '排队接小孩的队伍慢慢往前移。\n\n你低头看手机，忽然感到裤脚被什么拽了一下。\n\n一个扎着小辫的小女孩，仰起脸笑得特别灿烂：\n\n"爸爸！"\n\n你愣住。\n\n几乎同时，前面一个年轻妈妈慌忙转身："小言！——对不起啊先生，她，她认错人了……"',
    opening_choices: ['「没关系。」（蹲下来跟孩子笑一下）', '「小朋友你眼神不错啊。」（开玩笑化解）', '「没事，孩子都这样。」（轻松礼貌）'],
    system_narration_style: '第二人称，生活感+温暖细节',
    max_turns: 20,
    min_turns_for_good_ending: 9
  },
  scoring: {
    dimensions: [{ name: '自然', weight: 0.35, description: '不被尴尬压倒' }, { name: '温暖', weight: 0.3, description: '对孩子的善意' }, { name: '尊重', weight: 0.25, description: '不强调身份' }, { name: '分寸', weight: 0.1, description: '不过界' }],
    pass_score: 60,
    perfect_score_threshold: 90,
    fail_conditions: ['一听说单亲妈妈立刻表示同情', '问孩子爸爸在哪', '借孩子搭讪']
  },
  endings: {
    good: { title: '家长群里的朋友', description: '临别时她主动说"要不拉个群？孩子们还蛮合得来。" —— 她两年来第一次主动加人', reward: '解锁下一关 + "温暖大人"成就' },
    neutral: { title: '一面之缘', description: '你帮她化解尴尬后各自接孩子走了', reward: '解锁下一关' },
    bad: { title: '默默走开', description: '你眼神里一丝"原来是单亲"的停顿，她识破后客气告别', reward: '无' }
  },
  tags: ['单亲妈妈', '幼儿园', '生活化', '温暖']
};

module.exports = levels;
