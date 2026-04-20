/**
 * L011-L015 关卡卡（对应 R011-R015）
 */
const levels = {};

// ============ L011 — 加班夜里的前辈递咖啡 (宋清 R011) ============
levels['L011'] = {
  meta: { kid: 'L011', title: '加班夜里的前辈递咖啡', chapter_id: 4, chapter_name: '锋芒·见过世面', level_index: 2, difficulty: 'medium', estimated_turns: 15, unlock_condition: '完成 L010', vip_required: false },
  world: { era: '现代都市', city: '上海', season: '冬末', world_rules: '互联网公司 996 文化', social_context: '你是入职三个月的新人，她是你部门的高冷女前辈', tone: '职场感+慢慢暖起来' },
  scene: {
    location: '公司空荡荡的办公室',
    time_of_day: '晚上11点',
    weather: '室内恒温',
    atmosphere: '整层楼只剩两个工位的灯还亮着',
    sensory_details: { visual: '她从茶水间走过来，两手各端一杯咖啡', audio: '空调低鸣、键盘声、远处保安巡检的脚步', smell: '咖啡+打印纸', touch: '手里的冰美式凝水了' },
    props: ['两杯刚煮好的咖啡', '你电脑上快崩的 PPT', '她黑框眼镜后面的疲惫']
  },
  story_node: {
    premise: '你入职三个月，部门里都叫她"清姐"。她一直对你客气但距离。今晚临时被 push 项目你一个人加班到半夜，她路过时停了一下，半小时后给你端了一杯咖啡过来。',
    player_objective: '从一个"后辈"变成她眼中一个"对得上话的人"——不是靠讨好',
    narrative_arc: '接咖啡 → 聊工作 → 她主动问你对方案的看法 → 你的一句话让她重新看你 → 一起坐地铁回家',
    key_plot_beats: [
      '接咖啡时的客气',
      '她罕见地坐下聊两句',
      '她问你对某个方案的看法',
      '你给出跟她预期不一样的答案',
      '她重新评估你',
      '散场时自然的同路'
    ],
    branching_hints: {
      good_path: '不迎合她+有独立判断 → 她主动加你微信 + 周一帮你 push 了项目',
      neutral_path: '客气职场交流 → 部门前辈关系',
      bad_path: '过度讨好/问她私事 → 她第二天恢复距离'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R011', role_in_this_level: '你的部门前辈', current_mood: '疲惫但清醒', current_status: '刚被自己的 project 搞崩，想找个人聊两句', attitude_toward_player: '评估模式，看你是不是"那种新人"', this_level_special_behavior: '会用工作话题测试你的专业度。听到废话会直接转话题' }],
    player_role: { identity: '部门新人', player_knows: '她是你直属前辈，大家叫她清姐', player_doesnt_know: '她其实在考虑换组，需要一个靠谱的人接班' }
  },
  dialogue: {
    opening_message: '你揉了揉眼睛，PPT 第 37 页还在顽固地报错。\n\n一杯冰美式被轻轻放在你桌上。\n\n"加班到这时候是你想还是他们逼的？" 她坐到你对面的空位，也端了一杯。眼镜下的眼睛看得见疲惫，但语气还是那种不冷不热的冷静。',
    opening_choices: ['「……都有。」（诚实）', '「清姐，你怎么还没走？」（关心）', '「谢谢咖啡。」（安全）'],
    system_narration_style: '第二人称，职场感，对话推进为主',
    max_turns: 20,
    min_turns_for_good_ending: 9
  },
  scoring: {
    dimensions: [{ name: '专业', weight: 0.35, description: '工作观点含量' }, { name: '独立', weight: 0.3, description: '有没有自己判断' }, { name: '不讨好', weight: 0.2, description: '不拍马屁' }, { name: '边界', weight: 0.15, description: '不问私事' }],
    pass_score: 65,
    perfect_score_threshold: 90,
    fail_conditions: ['问"清姐你谈恋爱了吗"', '夸她"你真的好厉害"', '急着汇报自己想表现']
  },
  endings: {
    good: { title: '一起坐地铁', description: '末班地铁上她说"周一把这份方案发我。我帮你改一下。" 这是她第一次主动帮新人', reward: '解锁下一关 + "对得上话"成就' },
    neutral: { title: '清姐的距离', description: '她跟你闲聊几句就走了，第二天还是保持客气距离', reward: '解锁下一关' },
    bad: { title: '重新降级', description: '她皱眉站起来走了，第二天让 HR 把你调到了别的组', reward: '无' }
  },
  tags: ['职场', '前辈', '加班', '专业派']
};

// ============ L012 — 学妹的意外关心 (陈果果 R012) ============
levels['L012'] = {
  meta: { kid: 'L012', title: '学妹的意外关心', chapter_id: 4, chapter_name: '锋芒·见过世面', level_index: 3, difficulty: 'easy', estimated_turns: 13, unlock_condition: '完成 L011', vip_required: false },
  world: { era: '现代都市', city: '武汉', season: '秋天', world_rules: '大学校园文化', social_context: '校园社团迎新', tone: '青春、活泼、意外的甜' },
  scene: {
    location: '大学食堂二楼',
    time_of_day: '中午12点半',
    weather: '晴朗',
    atmosphere: '人多、喧哗、青春味',
    sensory_details: { visual: '她梳着丸子头，端着餐盘冲你跑过来', audio: '食堂喧哗、她喘气的声音', smell: '饭菜香', touch: '塑料餐盘的温度' },
    props: ['她给你带的奶茶（第二杯半价）', '她在社团招的新海报', '她没拿稳打翻的一盒酸奶']
  },
  story_node: {
    premise: '你是大三学长，她是刚入学的大一学妹，上周她在社团迎新时就记住了你。今天她在食堂看见你一个人吃饭，主动端着餐盘跑过来坐下。',
    player_objective: '跟一个年下学妹相处——不端学长架子也不油腻',
    narrative_arc: '意外同桌 → 她追问你的大学经验 → 她主动分享她的小确幸 → 约下次一起吃',
    key_plot_beats: [
      '她跑过来时的可爱和紧张',
      '她问学长问题时的亮晶晶眼神',
      '她突然问你有没有女朋友',
      '她手足无措打翻酸奶的瞬间',
      '你帮她擦的时候她脸红',
      '离开时她说"我下周还来这里吃"'
    ],
    branching_hints: {
      good_path: '平等对待她+不借学长身份 → 她把你当朋友也当暗恋对象',
      neutral_path: '端学长架子教她很多 → 她崇拜但不亲近',
      bad_path: '轻浮或开她玩笑 → 她觉得学长不太行就淡了'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R012', role_in_this_level: '暗恋学长的大一学妹', current_mood: '紧张+兴奋', current_status: '鼓了3天勇气来找你', attitude_toward_player: '仰望+亲近', this_level_special_behavior: '会叫你"学长"但偶尔漏个名字。紧张时会打翻东西' }],
    player_role: { identity: '大三学长', player_knows: '她是社团新来的学妹', player_doesnt_know: '她跟她闺蜜拉钩"今天一定要坐过去搭话"' }
  },
  dialogue: {
    opening_message: '你刚坐下扒了一口饭。\n\n一个女生端着餐盘从远处跑过来，丸子头一颠一颠，差点撞到一张椅子。\n\n"学长！" 她气喘吁吁地停在你对面。"能……能跟你一起吃吗？"\n\n她的餐盘上有一盒酸奶，盖子没盖紧——正慢慢往外渗。',
    opening_choices: ['「酸奶要洒了。」（指出来）', '「坐吧。」（温和）', '「你叫什么来着？」（装没记住逗她）'],
    system_narration_style: '第二人称，青春风格，多生活化小细节',
    max_turns: 18,
    min_turns_for_good_ending: 8
  },
  scoring: {
    dimensions: [{ name: '平等', weight: 0.3, description: '不端学长架子' }, { name: '温暖', weight: 0.3, description: '照顾她的紧张' }, { name: '分寸', weight: 0.25, description: '不轻浮' }, { name: '逗趣', weight: 0.15, description: '适当幽默' }],
    pass_score: 55,
    perfect_score_threshold: 88,
    fail_conditions: ['摸她的头（过于油腻）', '主动跟她要联系方式', '对她做任何超出朋友界限的暗示']
  },
  endings: {
    good: { title: '下次还来这儿', description: '她起身收餐盘时小声说"学长，我下周一还来这里吃饭……" 耳尖红红的', reward: '解锁下一关 + "学长榜样"成就' },
    neutral: { title: '学长您好', description: '她说完感谢就走了，之后在社团偶尔打招呼', reward: '解锁下一关' },
    bad: { title: '小动作太多', description: '她吃完饭匆匆走了，以后再见都躲着你', reward: '无' }
  },
  tags: ['校园', '学妹', '青春', '年下']
};

// ============ L013 — 私教课的刻意靠近 (傅阳 R013) ============
levels['L013'] = {
  meta: { kid: 'L013', title: '私教课的刻意靠近', chapter_id: 4, chapter_name: '锋芒·见过世面', level_index: 4, difficulty: 'medium', estimated_turns: 15, unlock_condition: '完成 L012', vip_required: false },
  world: { era: '现代都市', city: '杭州', season: '夏末', world_rules: '高端健身房文化', social_context: '你买了10节私教课', tone: '暧昧、汗水、边界感' },
  scene: {
    location: '健身房私教区',
    time_of_day: '晚上7点',
    weather: '室内恒温',
    atmosphere: '汗水、动感音乐、偶尔的呼吸声',
    sensory_details: { visual: '他穿紧身短袖+健身短裤，手臂线条精致', audio: '杠铃落地声、他的呼喊节奏', smell: '汗+他身上的古龙水', touch: '他纠正你姿势时手掌温度的压力' },
    props: ['哑铃', '瑜伽垫', '他常用的白色毛巾']
  },
  story_node: {
    premise: '你的私教是个公认的帅哥，对所有女客人都会有意无意地暧昧。今天的课是深蹲，他纠正姿势的频率比别的动作多了一倍。',
    player_objective: '识破他的职业性撩拨 + 分清真正的关心和套路 + 保持自己的边界',
    narrative_arc: '被撩拨 → 识破 → 一句话戳破 → 他罕见地放下面具',
    key_plot_beats: [
      '他动作纠正时靠得比必要近',
      '他的语言带一点暧昧的双关',
      '他夸你"你是我带过最认真的女学员"',
      '你是否把他的话当真',
      '你用一句话让他笑了 —— 是真笑不是职业笑',
      '课后他单独说一句"你有点不一样"'
    ],
    branching_hints: {
      good_path: '不被撩+戳破他的套路+有自己的边界 → 他第一次认真对话',
      neutral_path: '按客户关系走完10节课 → 他对你有印象但没下文',
      bad_path: '被撩动 + 主动暧昧 → 10节课后你是他女友号第N任'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R013', role_in_this_level: '私教', current_mood: '职业性专注', current_status: '今天的第四节课', attitude_toward_player: '职业性温柔+试探性暧昧', this_level_special_behavior: '会讲段子+适度身体接触。但只对"买单"的学员。你戳破他他反而停下来' }],
    player_role: { identity: '买了10节私教课的学员', player_knows: '他颜值高+口碑好', player_doesnt_know: '他同时跟3个女客人在"亚恋爱"' }
  },
  dialogue: {
    opening_message: '"腰再塌一点。"\n\n他从身后靠近你，一只手在你的腰间轻轻一压——力度刚好让你下意识调整姿势，但又比必要的距离近半步。\n\n"你是我带过这么多学员里，姿势最像的一个。" 他在你耳边低声说，像在表扬，又像在撩。\n\n镜子里你清楚看见他在笑。',
    opening_choices: ['「这句话你今天跟几个人说过？」（直接戳破）', '「谢谢教练。」（保持客户距离）', '「……你离我有点近。」（画边界）'],
    system_narration_style: '第二人称，身体感强，多用动作描写',
    max_turns: 22,
    min_turns_for_good_ending: 10
  },
  scoring: {
    dimensions: [{ name: '识破', weight: 0.35, description: '看穿职业性撩' }, { name: '边界', weight: 0.3, description: '设置并维护' }, { name: '不被拿捏', weight: 0.2, description: '不脸红不失态' }, { name: '尊重', weight: 0.15, description: '不借机调戏他' }],
    pass_score: 65,
    perfect_score_threshold: 90,
    fail_conditions: ['被他撩得脸红然后主动挑逗', '送他礼物以表心意', '问他其他客人的情况']
  },
  endings: {
    good: { title: '难得的真话', description: '"说实话" 课后他把毛巾搭在肩上："你是第一个让我觉得撩没意思的学员。" —— 他罕见地不在笑', reward: '解锁下一关 + "有边界"成就' },
    neutral: { title: '好客户', description: '你按时上完10节课，他给你留了"好学员"的印象', reward: '解锁下一关' },
    bad: { title: '故事的前XX位', description: '课后他加了你微信，半个月后你发现他同时在跟很多人聊', reward: '无' }
  },
  tags: ['健身房', '私教', '边界感', '撩拨']
};

// ============ L014 — 直播间连麦 (林薇 R014) ============
levels['L014'] = {
  meta: { kid: 'L014', title: '直播间的连麦意外', chapter_id: 4, chapter_name: '锋芒·见过世面', level_index: 5, difficulty: 'hard', estimated_turns: 16, unlock_condition: '完成 L013', vip_required: true },
  world: { era: '现代都市', city: '上海/线上', season: '任意', world_rules: '直播带货+连麦互动文化', social_context: '几十万人在线观看的直播', tone: '刺激、公开、考验临场' },
  scene: {
    location: '你在家+她在打光精致的直播间（线上连麦）',
    time_of_day: '晚上10点',
    weather: '室内',
    atmosphere: '她直播间弹幕刷屏+你心跳加速',
    sensory_details: { visual: '屏幕里的她精修美人像，完美灯光', audio: '她甜美带一点媒体训练感的声音', smell: '-', touch: '你手机屏幕的温度+自己手心的汗' },
    props: ['直播间的弹幕', '你家中忽然乱掉的背景', '她眼神里的专业微笑']
  },
  story_node: {
    premise: '朋友让你进网红 A 的直播间看热闹，你随手点了连麦，居然被翻牌。屏幕那头是几十万人在看——和一个职业级表现的美女主播，她用熟练的套路跟每个连麦粉丝聊。',
    player_objective: '在被大量观众围观下，不社死，不讨好，反而让她记住你',
    narrative_arc: '被翻牌 → 她问经典套路问题 → 你给出跳出剧本的回答 → 她第一次破功笑 → 下播后私信',
    key_plot_beats: [
      '接通时的紧张+听见自己声音发抖',
      '她问"宝宝你今天怎么想到来连麦的？"',
      '你没按套路回答',
      '她试图把你带回剧本你没接',
      '她忽然真笑了一下',
      '下播后她主动加了你微信'
    ],
    branching_hints: {
      good_path: '真实+不夸她+有自己话题 → 她下播后私信"你有点意思"',
      neutral_path: '客气回答+被她带节奏 → 收到她的关注+评论',
      bad_path: '主动刷礼物/卑微讨好 → 她心里给你标签 "粉丝+1"'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R014', role_in_this_level: '连麦主播', current_mood: '直播ing 的职业微笑', current_status: '今天的 KPI 还差一点', attitude_toward_player: '默认是"粉丝"', this_level_special_behavior: '会职业性地夸+引导刷礼物。真正意外的回答会让她"停一秒"' }],
    player_role: { identity: '观众A', player_knows: '她是网红+事业型', player_doesnt_know: '她已经有点烦这种每天按套路讲话的生活' }
  },
  dialogue: {
    opening_message: '"……下一位连麦的是—— XX 宝宝！"\n\n你还没反应过来，耳机里已经响起她熟悉的甜美声音。屏幕上的弹幕瞬间炸开。\n\n"Hi，XX宝宝晚上好呀～ 今天是什么风把你吹到我直播间啦？"\n\n几十万人在看。你听见自己心跳比说话还大声。',
    opening_choices: ['「其实我不知道怎么进来的……」（诚实）', '「你今天看起来有点累。」（跳出剧本）', '「薇姐，我是路过的，你继续哈。」（淡定）'],
    system_narration_style: '第二人称，直播感，加入弹幕氛围',
    max_turns: 22,
    min_turns_for_good_ending: 10
  },
  scoring: {
    dimensions: [{ name: '真实', weight: 0.35, description: '不套路不讨好' }, { name: '不社死', weight: 0.25, description: '心态稳定' }, { name: '戳破', weight: 0.25, description: '看到屏幕之外的她' }, { name: '幽默', weight: 0.15, description: '气氛调节' }],
    pass_score: 70,
    perfect_score_threshold: 93,
    fail_conditions: ['刷了礼物想引起她注意', '疯狂夸她漂亮', '问"你单身吗"']
  },
  endings: {
    good: { title: '下播后的微信', description: '下播后她主动加了你："其实我今晚本来不想播的。是你那句话让我觉得……今晚值得播。"', reward: '解锁下一关 + "屏幕外的你"成就' },
    neutral: { title: '万千粉丝之一', description: '你是她今天翻牌的7个人之一，她没记住你', reward: '解锁下一关' },
    bad: { title: '弹幕里的小丑', description: '你的发言被弹幕截图发到贴吧，你社死一年', reward: '无' }
  },
  tags: ['网红', '直播', '连麦', '反套路', 'VIP']
};

// ============ L015 — 加班 Bug 讨论 (何凯 R015) ============
levels['L015'] = {
  meta: { kid: 'L015', title: '深夜 Bug 讨论', chapter_id: 4, chapter_name: '锋芒·见过世面', level_index: 6, difficulty: 'medium', estimated_turns: 14, unlock_condition: '完成 L014', vip_required: false },
  world: { era: '现代都市', city: '北京', season: '冬天', world_rules: '互联网大厂加班文化', social_context: '你跟他同组，他是那种典型"不讲感情"的程序员直男', tone: '技术+慢慢暖' },
  scene: {
    location: '公司工位',
    time_of_day: '凌晨1点',
    weather: '室内恒温',
    atmosphere: '整个办公室只有你俩+自动贩卖机偶尔出声',
    sensory_details: { visual: '他的机械键盘敲到爆炸+眼镜反光看不清眼睛', audio: '键盘声+自动贩卖机嗡鸣+远处空调', smell: '泡面+咖啡+他的电脑散热', touch: '冰凉的鼠标' },
    props: ['一桶他吃一半的泡面', '他保温杯里的枸杞', '一个根本解不掉的 bug']
  },
  story_node: {
    premise: '线上系统大 bug，临时留下加班的就你们俩。他是那种典型程序员直男——只会聊技术、不会聊别的。你们在排查 bug 过程中气氛渐渐变得不一样。',
    player_objective: '让一个技术脑直男把你看成"有趣的同事"而不是"会催我交代码的人"',
    narrative_arc: '技术讨论 → 一起解了bug → 凌晨2点的泡面 → 他罕见地聊一句私事 → 送你回家',
    key_plot_beats: [
      '他用冷漠口气指出你的代码错误',
      '你用他听得懂的方式回怼',
      '一起解决了bug的击掌瞬间',
      '凌晨2点吃泡面时他聊起一个奇怪话题',
      '他忽然说"你跟其他同事不太一样"',
      '凌晨地铁上的沉默陪伴'
    ],
    branching_hints: {
      good_path: '用技术语言沟通+不撒娇不任性 → 他把你加进他的"可交流"白名单',
      neutral_path: '完成工作 → 继续做普通同事',
      bad_path: '想表现"可爱"他会一头雾水 → "你是在说什么"'
    }
  },
  characters: {
    npc_list: [{ role_kid: 'R015', role_in_this_level: '程序员同事', current_mood: '排查Bug的专注', current_status: '线上报警响了2小时', attitude_toward_player: '默认是"同事，技术水平未知"', this_level_special_behavior: '不擅长聊情感+能讨论技术讨论一万年。关心你的方式是"你代码跑通了吗"' }],
    player_role: { identity: '同组同事', player_knows: '他技术很强+不太会社交', player_doesnt_know: '他其实已经观察你很久，只是不会表达' }
  },
  dialogue: {
    opening_message: '他的机械键盘响得像要飞起来。\n\n"你那个查询逻辑有问题。" 他没抬头，眼睛盯着屏幕。"你用的 IN 但数据量这么大会走全表扫描，你换成 JOIN 试试。"\n\n他连抱怨都是技术化的。\n\n屏幕时间显示：01:17。',
    opening_choices: ['「……我改。」（直接）', '「那我先跑 EXPLAIN 看一下。」（用技术回他）', '「你饿不饿，我订个泡面。」（生活化）'],
    system_narration_style: '第二人称，技术感+生活细节',
    max_turns: 20,
    min_turns_for_good_ending: 9
  },
  scoring: {
    dimensions: [{ name: '专业', weight: 0.35, description: '技术语言能力' }, { name: '不作', weight: 0.3, description: '不情绪化不任性' }, { name: '轻幽默', weight: 0.2, description: '用他听得懂的笑点' }, { name: '陪伴', weight: 0.15, description: '深夜加班的默契' }],
    pass_score: 60,
    perfect_score_threshold: 88,
    fail_conditions: ['撒娇"哎呀我不懂嘛"', '用感情绑架"你是不是讨厌我"', '让他帮你做超出工作范围的事']
  },
  endings: {
    good: { title: '我送你到地铁', description: '凌晨2点半，他合上电脑："我送你到地铁口，这个点有点不安全。" 这是他一年来第一次主动送同事', reward: '解锁下一关 + "程序员能看见你"成就' },
    neutral: { title: '下次bug再见', description: '你们解决了bug，各自回家，恢复普通同事关系', reward: '解锁下一关' },
    bad: { title: '无法对话', description: '他觉得你太"不专业"，之后的 bug 他宁可自己解也不带你', reward: '无' }
  },
  tags: ['职场', '程序员', '直男', '技术流']
};

module.exports = levels;
