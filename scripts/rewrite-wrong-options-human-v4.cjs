const fs = require('fs');
const path = require('path');

const BANK_PATH = path.join(__dirname, '..', 'src', 'data', 'quizBank.ts');
const MARKER = 'export const QUIZ_BANK: Question[] = ';
const END_MARKER = ';\n\nexport function getQuestionById';
const LETTERS = ['A', 'B', 'C', 'D'];

const BANNED_TEMPLATES = /我有点不知道怎么绕|你要是方便的话，我们可以多说两句|暧昧本来就要有一点来回拉扯|如果她在意你，应该会继续给反应|不把话说重点|我也想知道你心里到底怎么想|我希望你能先看见我的委屈|先别把事情想得太严重|他可能只是安全感不太够|先给方向，她才不会一直困在里面|让她看到你还在等，也许会心软|至少不能错过这次难得的窗口|就拿.+这次来说也是这样/;

function loadBank() {
  const source = fs.readFileSync(BANK_PATH, 'utf8');
  const start = source.indexOf(MARKER);
  if (start < 0) throw new Error('QUIZ_BANK marker not found');
  const jsonStart = start + MARKER.length;
  const end = source.indexOf(END_MARKER, jsonStart);
  if (end < 0) throw new Error('QUIZ_BANK end marker not found');
  return { bank: JSON.parse(source.slice(jsonStart, end)), tail: source.slice(end + 2) };
}

function textLen(text) {
  return Array.from(String(text || '').replace(/\s+/g, '')).length;
}

function baseScene(question) {
  return String(question.scenario || '').split('；')[0].trim();
}

function angleOf(question) {
  return Array.isArray(question.tags) ? question.tags[1] || '' : '';
}

function shortScene(question) {
  const topic = topicOf(question);
  if (topic) return topic;
  return baseScene(question)
    .replace(/[“”"']/g, '')
    .replace(/^你们?/, '')
    .split(/[，。；]/)[0]
    .slice(0, 18);
}

function compactScene(question) {
  const topic = topicOf(question);
  if (topic) return topic;
  return baseScene(question)
    .replace(/[“”"']/g, '')
    .replace(/^你们?/, '')
    .slice(0, 28);
}

function topicOf(question) {
  const scene = baseScene(question);
  const specificRules = {
    ambiguous: [[/加班到现在|便利店都快关/, '深夜加班消息'], [/朋友圈点赞|挺会生活/, '朋友圈点赞评论'], [/一个人去吗/, '周末看展试探'], [/这首前奏|昨晚的心情/, '分享歌和心情'], [/对谁都这么会接话/, '半吃醋的调侃'], [/穿搭|太正式/, '穿搭询问'], [/往哪边走|放慢脚步/, '散场同行窗口'], [/刚洗完澡|看到消息/, '迟回后的解释'], [/吃晚饭了吗|胃不好/, '记得胃不好的关心'], [/聊天还挺放松/, '聊天放松感']],
    icebreak: [[/咖啡店|豆子/, '咖啡店豆子话题'], [/书店|旅行随笔/, '书店旅行书话题'], [/生日局|桌游/, '生日局桌游话题'], [/健身房|训练视频/, '健身房训练视频'], [/展览|夜景照片/, '展览夜景照片'], [/Livehouse|帆布袋/, 'Livehouse 周边'], [/微信群|橘猫|头像/, '微信头像橘猫'], [/共享办公|插座/, '共享办公插座'], [/羽毛球|球局/, '羽毛球新手局'], [/便利店|热饮|雨天/, '雨天便利店热饮']],
  };
  const specific = (specificRules[question.category] || []).find(([regex]) => regex.test(scene));
  if (specific) return specific[1];
  const rules = [
    [/咖啡店|豆子/, '咖啡店豆子话题'], [/书店|旅行随笔/, '书店旅行书话题'], [/生日局|桌游/, '生日局桌游话题'], [/健身房|训练视频/, '健身房训练视频'], [/展览|夜景照片/, '展览夜景照片'], [/Livehouse|帆布袋/, 'Livehouse 周边'], [/微信群|橘猫|头像/, '微信头像橘猫'], [/共享办公|插座/, '共享办公插座'], [/羽毛球|球局/, '羽毛球新手局'], [/便利店|热饮|雨天/, '雨天便利店热饮'],
    [/加班到现在|便利店都快关/, '深夜加班消息'], [/朋友圈点赞|挺会生活/, '朋友圈点赞评论'], [/一个人去吗/, '周末看展试探'], [/这首前奏|昨晚的心情/, '分享歌和心情'], [/对谁都这么会接话/, '半吃醋的调侃'], [/穿搭|太正式/, '穿搭询问'], [/往哪边走|放慢脚步/, '散场同行窗口'], [/刚洗完澡|看到消息/, '迟回后的解释'], [/吃晚饭了吗|胃不好/, '记得胃不好的关心'], [/聊天还挺放松/, '聊天放松感'],
    [/隔很久才回消息|刚才太忙/, '回复变少'], [/纪念日/, '忘记纪念日'], [/做饭收拾|应该做/, '家务付出被默认'], [/异性朋友单独吃饭/, '异性饭局没提前说'], [/旅行预算/, '旅行预算分歧'], [/打游戏放空/, '下班后想独处'], [/冷处理/, '吵架后的冷处理'], [/朋友面前|短处开玩笑/, '公开玩笑过界'], [/未来规划/, '未来规划回避'], [/一直讲道理/, '情绪低落被讲道理'],
    [/删掉所有异性好友/, '删除异性好友'], [/手机密码/, '索要手机密码'], [/穿喜欢的裙子|穿这样/, '控制穿着'], [/共享定位/, '实时共享定位'], [/朋友都不靠谱/, '否定朋友关系'], [/你走我就不知道/, '自伤威胁'], [/统一管理你的工资/, '经济控制'], [/高强度表白|突然冷掉/, '热冷循环'], [/玩笑揭你的短/, '公开羞辱'], [/拒绝亲密接触/, '推进身体边界'],
    [/领导当众批评/, '被领导当众批评'], [/考试没过/, '考试失利'], [/家里吵完架/, '和家里吵架'], [/分手后反复翻聊天记录/, '分手后翻聊天记录'], [/晚回消息有点生气/, '晚回消息引发不安'], [/方案被否/, '方案被否'], [/第一次离家上学/, '第一次离家想家'], [/吃醋但不承认/, '吃醋嘴硬'], [/犯错后一直说/, '犯错后自责'], [/加班到很晚/, '加班后耗尽'],
    [/完成一份很耗时的报告/, '替朋友写报告'], [/半夜让你打车过去/, '半夜过去陪伴'], [/杂活推给你/, '同事推杂活'], [/安排相亲/, '亲戚安排相亲'], [/借一笔钱|房租预算/, '朋友借钱'], [/交出手机密码/, '交手机密码'], [/前任深夜约你/, '前任深夜见面'], [/撒谎骗她对象/, '帮朋友撒谎'], [/第一次约会后/, '第一次约会后定关系'], [/无偿加班/, '无偿加班'],
    [/朋友圈但没有点赞/, '朋友圈访问'], [/共同朋友生日局/, '共同朋友生日局见面'], [/冷处理道歉/, '为冷处理道歉'], [/最近还好吗/, '前任试探问候'], [/生日快到了/, '前任生日节点'], [/取回落在她家的东西/, '物品交接'], [/状态不好/, '听说对方状态不好'], [/现在有人了吗/, '关系试探'], [/缺少规划/, '展示规划改变'], [/别联系了吧/, '明确拒绝联系'],
  ];
  const found = rules.find(([regex]) => regex.test(scene));
  return found ? found[1] : '';
}

function specialCorrectText(question) {
  const angle = angleOf(question);
  if (question.category !== 'emotion-catch' || angle !== '二次伤害') return '';
  const topic = topicOf(question);
  const lines = {
    '被领导当众批评': '别一直闷着了，先把汇报哪里出错想清楚，下次照我说的顺序来。',
    '考试失利': '一次没考好而已，先别哭了，赶紧把错题复盘出来才有用。',
    '和家里吵架': '家里人也是为你好，你先别这么敏感，回去好好道个歉。',
    '分手后翻聊天记录': '别翻了，越看越没意义，你现在就该删干净重新开始。',
    '晚回消息引发不安': '这点小事也要生气吗？你先控制一下情绪，别把关系弄复杂。',
    '方案被否': '方案被否就改方案啊，你难受也解决不了问题，先把下一版写出来。',
    '第一次离家想家': '大家都是这么过来的，你别想太多，多适应几天就好了。',
    '吃醋嘴硬': '你要是不承认吃醋，那我也没办法猜，你直接说清楚不就好了。',
    '犯错后自责': '知道错了就别一直说了，赶紧补救，比在这里内耗强。',
    '加班后耗尽': '累也没办法，成年人都这样，你先洗个澡早点睡，明天继续。',
  };
  return lines[topic] || `别一直陷在“${topic || '这件事'}”里了，先想想怎么补救。`;
}

function wrong(text, explain) {
  const finalExplain = textLen(explain) < 18 ? `${explain}它没有完成本题真正要训练的关键动作。` : explain;
  return { text, isCorrect: false, explain: `❌ ${finalExplain}` };
}

function withPeriod(text) {
  return /[。！？!?]$/.test(text) ? text : `${text}。`;
}

const icebreakContexts = [
  { re: /咖啡店|豆子/, place: '咖啡店', object: '那杯豆子', topic: '咖啡口味', contact: '豆子清单' },
  { re: /书店|旅行随笔/, place: '书店旅行区', object: '那本旅行随笔', topic: '旅行书', contact: '书单' },
  { re: /生日局|桌游/, place: '朋友生日局', object: '这局桌游', topic: '朋友局', contact: '下次桌游局' },
  { re: /健身房|训练视频/, place: '健身房拉伸区', object: '训练视频', topic: '健身入门', contact: '训练视频' },
  { re: /展览|夜景照片/, place: '展览现场', object: '那张夜景照片', topic: '展览', contact: '展览推荐' },
  { re: /Livehouse|帆布袋/, place: 'Livehouse 周边摊', object: '那个帆布袋', topic: '乐队周边', contact: '歌单' },
  { re: /微信群|橘猫|头像/, place: '微信群', object: '头像里的橘猫', topic: '猫和头像', contact: '猫片' },
  { re: /共享办公|插座/, place: '共享办公区', object: '插座位', topic: '临时办公', contact: '附近办公点' },
  { re: /羽毛球|球局/, place: '羽毛球新手局', object: '刚才那几个球', topic: '运动局', contact: '下次球局' },
  { re: /便利店|热饮|雨天/, place: '便利店门口', object: '那杯热饮', topic: '雨天躲雨', contact: '附近小店' },
];

function icebreakContext(question) {
  const scene = baseScene(question);
  return icebreakContexts.find(item => item.re.test(scene)) || { place: shortScene(question), object: '这个细节', topic: '刚才的话题', contact: '相关清单' };
}

function icebreakWrongs(question, angle) {
  const c = icebreakContext(question);
  if (angle === '上前第一句') return [
    wrong(c.place === '微信群' ? '刚才在群里看到你，感觉你挺有气质的，方便认识一下吗？' : `刚才在${c.place}看到你，感觉你挺有气质的，方便认识一下吗？`, '第一句直接落到“认识你”，目的感太强；这会让对方先防备，而不是顺着现场话题接话。'),
    wrong(c.place === '微信群' ? '你现在方便聊两句吗？我刚看到你头像挺有意思。' : `你也是一个人来${c.place}的吗？我想跟你聊两句。`, '开口就问对方是否方便私聊，会让陌生场景的安全感下降，缺少轻松的共同话题。'),
    wrong(c.place === '微信群' ? '我看你头像有一会儿了，感觉你挺会拍猫的。' : `我刚才注意你看${c.object}挺久的，感觉你应该很懂这个。`, '“注意你有一会儿”会让人有被盯着的感觉，重点从物件跑到对方身上了。'),
  ];
  if (angle === '对方回了一句后的接话') return [
    wrong(`那你平时还喜欢什么？可以多讲点，我挺想了解你的。`, '范围一下子放太大，刚破冰就像查户口，对方要花力气组织答案。'),
    wrong(`刚好我也对${c.topic}感兴趣，我们在${c.place}遇到也太有缘了。`, '“有缘”上升太快，会把轻聊天推成关系暗示，容易显得用力。'),
    wrong(`${c.place}你经常来吗？一般自己来还是和朋友一起来？`, '连续问行程和习惯会越过陌生人的舒适距离，像在收集私人信息。'),
  ];
  if (angle === '聊了两分钟后的收尾') return [
    wrong(`那加个微信吧，我觉得我们刚才聊${c.topic}还挺合拍的。`, '这句话直接要联系方式，缺少“之后为什么联系”的具体理由，对方会觉得前面聊天只是铺垫。'),
    wrong(`你把微信给我吧，我回头把${c.contact}发你。`, '语气像索取，主动权全在你这边；更好的方式是给对方选择，不是要对方交出来。'),
    wrong(`我还想继续聊${c.topic}，要不你先别急着走？`, '把继续聊天的压力丢给对方，她要负责拒绝你，现场会变紧。'),
  ];
  if (angle === '刚加微信第一句') return [
    wrong(c.place === '微信群' ? '终于加上你了，刚才在群里就觉得你挺特别。' : `终于加上你了，刚才在${c.place}就觉得你挺特别。`, '刚加微信就上情绪浓度，会像提前表白，容易让对方后撤。'),
    wrong(c.place === '微信群' ? '你到家了吗？虽然刚从群里认识，但我还是想关心一句。' : `你到家了吗？刚从${c.place}认识，我还是想问一句。`, '如果线下互动还很浅，这种关心会显得关系越级，不如先帮对方定位你是谁。'),
    wrong(c.place === '微信群' ? '可以发张自拍看看吗？我怕只看头像以后认不出你。' : `发张自拍看看？我怕下次在${c.place}附近认错人。`, '刚加微信就要照片，边界感很差，也容易被理解成冒犯。'),
  ];
  return [
    wrong(`你现在才回，我还以为刚才在${c.place}只是客气一下。`, '把迟回解释成不想理你，会让对方立刻背上解释压力。'),
    wrong(`没事，你忙吧，我就不打扰你聊${c.topic}了。`, '退得太快，像受伤式客气；它没有把聊天自然接回共同话题。'),
    wrong(`哈哈你不会已经忘了我是刚才在${c.place}聊${c.topic}的人吧？`, '想开玩笑缓和，但本质还是让对方为迟回负责，容易尴尬。'),
  ];
}

function ambiguousWrongs(question, angle) {
  const scene = compactScene(question);
  if (angle === '判断信号') return [
    wrong(`她在“${scene}”里已经给得很明显了，可以直接问她是不是对你有意思。`, '把一个互动窗口当成确定喜欢，推进过猛，会把暧昧里的轻松感压掉。'),
    wrong(`这更像普通社交，回个表情就好，别把“${scene}”想得太多。`, '完全压低信号会错过窗口，也会让对方觉得你接不住她释放的温度。'),
    wrong(`先晚一点回，让她因为“${scene}”这件事多惦记你一下。`, '故意冷不是松弛，而是博弈；它会损害真实好感。'),
  ];
  if (angle === '怎么回') return [
    wrong(`所以你这是在暗示我吗？要不你直接说是不是喜欢我。`, '逼问确定性会把暧昧变成审问，对方原本的轻松试探会被吓回去。'),
    wrong(`你这样说我会当真的，尤其刚聊到“${scene}”这种话题。`, '这句把自己的上头交给对方负责，会让她产生压力。'),
    wrong(`先别接太热，围绕“${scene}”回得冷一点，看看她会不会追。`, '冷处理会把互动变成测试，不是真正的吸引力。'),
  ];
  if (angle === '推进一步') return [
    wrong(`趁“${scene}”这个窗口还在，今晚就把她约出来。`, '太急会像抓机会，而不是尊重对方节奏；窗口需要轻推，不是硬拽。'),
    wrong(`先停两天不接这个话题，看她会不会因为“${scene}”主动找你。`, '用冷淡制造不确定，会让暧昧变成心理操作。'),
    wrong(`写一段认真消息，把你对她的好感和期待一次说清楚。`, '长篇表态太重，会把当前轻互动压成关系压力。'),
  ];
  if (angle === '避开误读') return [
    wrong(`顺着“${scene}”轻轻接一句，再看她后续怎么回。`, '这不是坑，而是稳妥处理；它有回应，也保留了回旋。'),
    wrong(`给一个和“${scene}”有关、对方可以拒绝的小提议。`, '可拒绝的小提议能降低压力，是合适推进，不是误读。'),
    wrong(`先不把“${scene}”上升成关系定义。`, '不急着定义是分寸感，不是错；真正的坑是把窗口当承诺。'),
  ];
  return [
    wrong(`马上告诉她你因为“${scene}”已经很心动，让她知道你的诚意。`, '过早交底会让关系失衡，也容易给对方压力。'),
    wrong(`发点让她吃醋的朋友圈，看看她会不会因为“${scene}”有反应。`, '刺激嫉妒只能制造波动，不会制造稳定吸引。'),
    wrong(`每句话都反复分析，确认“${scene}”没有风险再回。`, '过度斟酌会让聊天失去自然感，对方能感到紧绷。'),
  ];
}

function loveWrongs(question, angle) {
  const scene = compactScene(question);
  if (angle === '表达需求') return [
    wrong(`你是不是因为“${scene}”已经没那么在乎我了？`, '把具体事件升级成爱不爱，对方会先防御，很难进入修复。'),
    wrong(`算了，“${scene}”这件事我自己消化，说出来也没用。`, '短期避免冲突，长期会累积委屈，也没有给关系修复入口。'),
    wrong(`你自己想想“${scene}”为什么让我不开心。`, '让对方猜谜会制造挫败感，需求没有变得更清楚。'),
  ];
  if (angle === '冲突降温') return [
    wrong(`今天必须把“${scene}”说出一个结果，不然我过不去。`, '“必须”会增加压迫感，沟通容易变成审判。'),
    wrong(`好，那下次我也用“${scene}”这种方式对你，看你受不受得了。`, '报复式表达会让双方一起受伤，问题本身没有被解决。'),
    wrong(`如果“${scene}”还这样，我们就没必要继续谈了。`, '用关系威胁处理具体冲突，会破坏安全感。'),
  ];
  if (angle === '具体请求') return [
    wrong(`你以后能不能在“${scene}”这类事上成熟一点？`, '“成熟一点”是人格评价，不是行动请求，对方不知道下一次具体做什么。'),
    wrong(`你就不能因为“${scene}”主动一点吗？`, '“主动点”太泛，容易让对方觉得整个人被否定。'),
    wrong(`我希望你以后遇到“${scene}”都能提前想到我的感受。`, '这是读心术要求，没人能长期稳定满足。'),
  ];
  if (angle === '识别真正伤点') return [
    wrong(`说明对方在“${scene}”这件事上就是自私，不值得继续。`, '直接人格定性会堵死修复空间，也未必符合事实。'),
    wrong(`说明你对“${scene}”太敏感，需要降低期待。`, '把真实需求打成敏感，会让你越来越不敢表达。'),
    wrong(`说明“${scene}”背后其实就是谁更爱谁的问题。`, '爱不爱太大，会把可修复的问题推成关系审判。'),
  ];
  return [
    wrong(`让对方保证以后绝不会再出现“${scene}”这种事。`, '绝对保证听起来安心，但不可持续，容易变成空话。'),
    wrong(`“${scene}”先别提了，等关系气氛自然恢复。`, '不复盘会让同类问题反复出现。'),
    wrong(`让对方公开证明他重视你，这样“${scene}”才算过去。`, '公开证明不是修复，反而会制造表演感和对抗。'),
  ];
}

function redflagWrongs(question, angle) {
  const scene = compactScene(question);
  if (angle === '风险命名') return [
    wrong(`“${scene}”只是普通情侣磨合，过段时间自然会好。`, '磨合是双方调整，控制是单方面压缩你的空间，不能混为一谈。'),
    wrong(`他可能是在“${scene}”里太缺安全感，你多耐心一点就好。`, '不安不能成为越界理由，你不是用牺牲边界来治疗对方的人。'),
    wrong(`这只是“${scene}”里的表达方式笨，不必马上想太严重。`, '持续剥夺选择权不是笨拙表达，不能被正常化。'),
  ];
  if (angle === '边界表达') return [
    wrong(`你别在“${scene}”这件事上这样行不行，我真的会很难过。`, '情绪真实，但边界不清楚，对方仍然可以继续试探。'),
    wrong(`如果你爱我，就不会在“${scene}”这件事上这样对我。`, '用爱反向施压，会把问题拉进证明爱不爱的泥潭。'),
    wrong(`算了，“${scene}”我不想吵，先这样吧。`, '回避冲突会让边界消失，红旗容易继续升级。'),
  ];
  if (angle === '安全动作') return [
    wrong(`先顺着“${scene}”里的要求，等关系稳定后再慢慢谈。`, '顺从会强化控制，关系稳定后通常更难改。'),
    wrong(`用同样方式反过来处理“${scene}”，让他也感受一下。`, '以控制反控制会升级风险，也让你进入同一套坏规则。'),
    wrong(`把“${scene}”发到朋友圈让大家评理。`, '公开化可能带来反噬，先找可信支持和安全计划更稳。'),
  ];
  if (angle === '识别合理化') return [
    wrong(`我要看“${scene}”之后他持续怎么做，不只听他说什么。`, '这是正确观察方式，不是陷阱。'),
    wrong(`如果“${scene}”让我不舒服，我可以先和可信朋友说。`, '保留外部视角是保护自己，不是背叛关系。'),
    wrong(`边界在“${scene}”里被拒绝后，我需要重新评估关系。`, '这是健康判断，不是小题大做。'),
  ];
  return [
    wrong(`说明你在“${scene}”里还不够会沟通，说得更温柔就好。`, '沟通可以优化，但不能把对方持续越界的责任揽到自己身上。'),
    wrong(`说明他在“${scene}”里太在乎你，关系进入更深阶段。`, '控制不是深情，焦虑也不是越界许可证。'),
    wrong(`亲密关系都会有“${scene}”这种情况，你需要适应。`, '健康亲密关系会增加安全感，不会让你越来越小心。'),
  ];
}

function emotionWrongs(question, angle) {
  const scene = compactScene(question);
  if (angle === '二次伤害') return [
    wrong(`你现在因为“${scene}”难受是有原因的，我先听你说。`, '这是接住情绪，不是二次伤害；它先给对方一个安全位置。'),
    wrong(`你愿意说多少就说多少，不用把“${scene}”整理好再讲。`, '这会降低表达压力，是安全回应。'),
    wrong(`我可能不完全懂“${scene}”对你的影响，但我愿意听。`, '承认不完全懂反而真诚，不会抢走对方的解释权。'),
  ];
  if (angle === '第一回应') return [
    wrong(`你别把“${scene}”想太重，事情没你感觉的那么严重。`, '想减轻痛苦，却先否定了痛苦，对方会更孤单。'),
    wrong(`那下次遇到“${scene}”你应该提前准备一下。`, '方案出现太早，对方会觉得你没站在她这边。'),
    wrong(`我也经历过类似“${scene}”的事，而且比这个还麻烦。`, '用自己的经历覆盖对方，会让对方的情绪失去位置。'),
  ];
  if (angle === '共情复述') return [
    wrong(`所以你现在就是因为“${scene}”很生气，对吧？`, '情绪命名太粗，可能不贴合；错命名会让对方觉得你没听懂。'),
    wrong(`我懂了，你其实就是想让我帮你解决“${scene}”。`, '把表达情绪等同于要方案，会让对方更孤单。'),
    wrong(`其实“${scene}”里你也知道自己有问题，只是不想承认。`, '这是审判，不是复述，会直接关门。'),
  ];
  if (angle === '给建议的时机') return [
    wrong(`我知道“${scene}”让你难受，但是你现在必须振作。`, '“但是”会抹掉前面的共情，“必须”会增加压力。'),
    wrong(`我给你三个处理“${scene}”的办法，你照着做就行。`, '太像指挥，对方情绪没落地前很难吸收。'),
    wrong(`你先因为“${scene}”冷静一下，冷静了再说。`, '让人冷静经常会被听成“你现在不正常”。'),
  ];
  return [
    wrong(`马上转移“${scene}”这个话题，让气氛开心起来。`, '过快转移会让对方觉得情绪被处理掉，而不是被接住。'),
    wrong(`反复追问“${scene}”的细节，直到她全部讲清楚。`, '追问会变成审问，对方可能更累。'),
    wrong(`告诉她以后别再因为“${scene}”这种事崩溃。`, '这是否定情绪强度，会让她下次不敢说。'),
  ];
}

function refuseWrongs(question, angle) {
  const scene = compactScene(question);
  if (angle === '识别软拒绝') return [
    wrong(`这次我不能答应“${scene}”里的请求。`, '这是清楚拒绝。短句不是没礼貌，反而减少误会。'),
    wrong(`我理解你在“${scene}”里需要帮忙，但我这边不能接。`, '这句既承认需求，也清楚拒绝，是可用表达。'),
    wrong(`我最多只能帮“${scene}”里的小部分，但不能做更多。`, '有限替代是健康边界，不是软弱拒绝。'),
  ];
  if (angle === '第一次拒绝') return [
    wrong(`我可能不太方便处理“${scene}”，要不之后再看看？`, '“可能/再看看”不是拒绝，对方会继续推进。'),
    wrong(`你怎么老是在“${scene}”这种时候为难我？`, '带指责会升级冲突，拒绝的重点是边界。'),
    wrong(`对不起，“${scene}”我真的特别不好意思。`, '过度道歉会让合理拒绝像亏欠。'),
  ];
  if (angle === '对方继续劝') return [
    wrong(`你再因为“${scene}”这样劝我，我真的要生气了。`, '情绪威胁会把焦点变成你的态度，而不是你的边界。'),
    wrong(`不是我不想帮“${scene}”，是我真的没办法。`, '这会让拒绝变成“如果有办法就会答应”，对方可能继续帮你找办法。'),
    wrong(`“${scene}”这次不行，下次吧。`, '“下次”给了明确口子，对方下次会继续找你。'),
  ];
  if (angle === '保留关系') return [
    wrong(`多解释自己为什么处理不了“${scene}”，让对方知道你不是故意的。`, '解释过多会变成求理解，也给对方留下说服入口。'),
    wrong(`先答应“${scene}”，之后找机会再取消。`, '这会破坏信任，也让你更被动。'),
    wrong(`用玩笑把“${scene}”带过去，避免当场尴尬。`, '玩笑可以缓和气氛，但不能替代拒绝本身。'),
  ];
  return [
    wrong(`只要对方因为“${scene}”不开心，就说明我拒绝得太狠。`, '对方失望很正常，不等于你错了。'),
    wrong(`下次“${scene}”这种事还是别拒绝了，省得关系尴尬。`, '用顺从换来的不尴尬，会持续透支你。'),
    wrong(`我要把“${scene}”的理由讲到对方完全认同为止。`, '你不需要获得许可才拥有边界。'),
  ];
}

function recoverWrongs(question, angle) {
  const scene = compactScene(question);
  if (angle === '复联节奏') return [
    wrong(`借“${scene}”马上说自己还爱她，别错过这个窗口。`, '一有窗口就压上情绪，会让对方想起旧压力。'),
    wrong(`在“${scene}”里故意冷一点，让她感到你已经不一样了。`, '操作感太强，容易破坏刚恢复的一点信任。'),
    wrong(`围绕“${scene}”发一大段复盘，证明自己想明白了。`, '长篇解释会把对方重新拖进过去的问题里，负担太重。'),
  ];
  if (angle === '有效道歉') return [
    wrong(`我真的错了，求你因为“${scene}”再相信我一次。`, '这是情绪请求，不是承担责任；对方会感到又被索取。'),
    wrong(`我们都有问题，但“${scene}”这次我愿意先低头。`, '“我们都有问题”会稀释你的责任，对方听到的是你还在算账。'),
    wrong(`如果你在“${scene}”里也有不对，我们能不能一起改？`, '在道歉里夹带对方责任，会让道歉失效。'),
  ];
  if (angle === '低压聊天') return [
    wrong(`不断回忆“${scene}”之前那些很甜的片段，唤醒她的感情。`, '过去甜不代表现在安全，过度怀旧会显得你没走出来。'),
    wrong(`围绕“${scene}”频繁关心她每个动态，让她知道你一直在。`, '这会重新制造被盯着的感觉。'),
    wrong(`把自己最近过得很惨说出来，让“${scene}”变成她心软的理由。`, '卖惨换来的不是爱，是负担和内疚。'),
  ];
  if (angle === '展示改变') return [
    wrong(`发长文列出自己因为“${scene}”改了哪十点。`, '列清单像求验收，对方会有压力。'),
    wrong(`让共同朋友帮你转达，你已经为“${scene}”变好了。`, '让别人传话容易显得算计，也把朋友卷进关系。'),
    wrong(`承诺以后再也不会让“${scene}”重演。`, '“再也不会”太绝对，像空头支票，可信度反而低。'),
  ];
  return [
    wrong(`你是不是因为“${scene}”还在惩罚我？我已经改了。`, '把拒绝理解成惩罚，会让对方觉得你仍然以自我为中心。'),
    wrong(`那我就一直等你，等“${scene}”这件事过去。`, '听起来深情，其实是把压力继续放在对方身上。'),
    wrong(`好吧，那祝你幸福，经历“${scene}”以后我再也不会相信爱情了。`, '情绪化告别仍是在索取反应，不是真尊重。'),
  ];
}

const wrongFactories = {
  icebreak: icebreakWrongs,
  ambiguous: ambiguousWrongs,
  love: loveWrongs,
  redflag: redflagWrongs,
  'emotion-catch': emotionWrongs,
  refuse: refuseWrongs,
  recover: recoverWrongs,
};

function rewriteQuestion(question) {
  if (question.category === 'anti-pua') return question;
  const correctIndex = question.options.findIndex(option => option.isCorrect);
  if (correctIndex < 0) throw new Error(`${question.id}: correct option not found`);
  const factory = wrongFactories[question.category];
  if (!factory) return question;
  const wrongOptions = factory(question, angleOf(question));
  if (wrongOptions.length !== 3) throw new Error(`${question.id}: expected 3 wrong options`);
  const correctText = specialCorrectText(question);
  let wrongIndex = 0;
  const options = question.options.map((option, index) => {
    if (index === correctIndex) return { ...option, text: correctText || option.text, explain: '' };
    return wrongOptions[wrongIndex++];
  });
  return { ...question, options };
}

function uniqueVariant(question, text, occurrence) {
  const scene = shortScene(question) || '这个场景';
  if (/那你平时还喜欢什么/.test(text)) return `刚围绕“${scene}”聊了一句，就追问“那你平时还喜欢什么？可以多讲点吗？”`;
  if (/所以你这是在暗示我吗/.test(text)) return `听完“${scene}”就追问：“所以你这是在暗示我吗？要不你直接说是不是喜欢我。”`;
  if (/写一段认真消息/.test(text)) return `围绕“${scene}”写一段很认真的长消息，把好感和期待一次说清楚。`;
  if (/你到家了吗/.test(text)) return `刚聊完“${scene}”就问：“你到家了吗？我还是想确认一下。”`;
  if (/发张自拍看看/.test(text)) return `刚加微信就说：“发张自拍看看？我怕下次在${scene}认不出来。”`;
  if (/让对方保证以后绝不/.test(text)) return `让对方保证以后别再让“${scene}”这类事发生。`;
  if (/我真的错了，求你/.test(text)) return `围绕“${scene}”反复说“我真的错了，求你再相信我一次”。`;
  if (/我们都有问题/.test(text)) return `借“${scene}”说“我们都有问题，但我愿意先低头”。`;
  const suffixes = ['这次说得更具体一点。', '把这次场景也带进去。', '让话落到当前这件事上。'];
  return `${withPeriod(text)}${scene}里也是这个意思，${suffixes[occurrence % suffixes.length]}`;
}

function uniquifyOptions(bank) {
  const seen = new Map();
  return bank.map(question => {
    const options = question.options.map(option => {
      const count = seen.get(option.text) || 0;
      seen.set(option.text, count + 1);
      if (count === 0 || question.category === 'anti-pua') return option;
      return { ...option, text: uniqueVariant(question, option.text, count) };
    });
    return { ...question, options };
  });
}

function isSupportiveTone(question, option) {
  const angle = angleOf(question);
  const reverse = (question.category === 'redflag' && angle === '识别合理化')
    || (question.category === 'emotion-catch' && angle === '二次伤害')
    || (question.category === 'refuse' && angle === '识别软拒绝');
  return reverse ? !option.isCorrect : option.isCorrect;
}

function humanContinuation(question, option, round) {
  const scene = shortScene(question) || '这件事';
  const category = question.category;
  const isCorrect = isSupportiveTone(question, option);
  const ice = category === 'icebreak' ? icebreakContext(question) : null;
  const alreadyNamesScene = option.text.includes(scene) || option.text.includes(`“${scene}”`);
  const loveWrong = /算了|自己消化|说出来也没用|先别提|气氛自然恢复/.test(option.text)
    ? [`我怕说出来又变成吵架，只能先压下去。`, `反正提了也未必会被认真听见。`, `我不想再把自己弄得更委屈。`]
    : [`我现在说重一点，是想让你知道这事对我不是小事。`, `不然我会觉得自己一直在忍。`, `我怕轻轻带过之后又会重复发生。`];
  const refuseWrong = /怎么|老是|为难|烦|凭什么/.test(option.text)
    ? [`我现在就是不想再替你兜底。`, `你先自己想办法，别每次都把压力丢给我。`, `这次我不想再因为面子硬接下来。`]
    : [`我怕话说得太死，会让以后见面更尴尬。`, `先留一点余地，关系可能比较好看。`, `多解释一点，也许对方更容易接受。`];
  const recoverWrong = alreadyNamesScene
    ? [`我想让她知道我还在意这段关系。`, `不说清楚，我怕这次机会又滑过去。`, `我希望她能看见我这次是真的想挽回。`]
    : [`我想让她知道我还在意“${scene}”。`, `不说清楚，我怕这次窗口又错过。`, `我希望她能看见我这次是真的想挽回。`];
  const pools = {
    icebreak: isCorrect
      ? [`你不方便也没关系，我就是顺着${ice?.object || scene}问一句。`, `我不会一直打扰，先接这个${ice?.topic || '话题'}就好。`, `如果你赶时间，我们就先到这里。`]
      : [ice?.place === '微信群' ? `我主要是想趁刚加上的机会多了解你。` : `我主要是想借刚才这个话题多认识你一下。`, `你要是不赶时间，我们可以顺着${ice?.topic || '这个话题'}再聊几句。`, ice?.place === '微信群' ? `总觉得群里一句话没聊够。` : `我只是觉得聊到${ice?.topic || '这个话题'}挺难得。`],
    ambiguous: isCorrect
      ? [`我先接住这个温度，不急着要她表态。`, `比如先把话题落到一次轻松见面上。`, `让互动自然往前一点就够了。`]
      : [`我不想一直围着“${scene}”猜来猜去。`, `不如趁这个话题把态度问清楚。`, `这样至少能早点知道她怎么想。`],
    love: isCorrect
      ? [`我希望这次能落到下一次怎么做。`, `我想解决问题，不是跟你分输赢。`, `这样说更容易进入修复，而不是互相防御。`]
      : loveWrong,
    redflag: isCorrect
      ? [`如果对方继续推进，我会先保护自己的边界。`, `这不是小题大做，而是在看底线有没有被尊重。`, `我会看行为是否真的改变。`]
      : [`我怕自己一强硬，关系会因为“${scene}”直接僵掉。`, `先把气氛稳住，之后再慢慢看也许更好。`, `如果对方能改，这次也许不用说得太重。`],
    'emotion-catch': isCorrect
      ? [`她不用马上变好，我先把这阵情绪接住。`, `等她缓一点，我们再看下一步。`, `现在先让她知道自己不是一个人。`]
      : [`我这样说也是想让她赶紧从“${scene}”里出来。`, `先把事情处理掉，她可能就没那么难受。`, `我怕一直停在情绪里会更难受。`],
    refuse: isCorrect
      ? [`能帮到哪一步我说清楚，剩下的就不再接。`, `这样既保留礼貌，也不让边界变成谈判。`, `我不想把拒绝说得含含糊糊。`]
      : refuseWrong,
    recover: isCorrect
      ? [`这次我先把压力降下来，不急着要结果。`, `我会用稳定行动慢慢证明，而不是催她回来。`, `如果她不想继续聊，我也会停在这里。`]
      : recoverWrong,
  };
  const pool = pools[category] || [];
  for (let offset = 0; offset < pool.length; offset++) {
    const candidate = pool[(round + offset) % pool.length];
    if (!option.text.includes(candidate)) return candidate;
  }
  return '';
}

function balanceHumanQuestion(question) {
  if (question.category === 'anti-pua') return question;
  const options = question.options.map(option => ({ ...option }));
  for (let round = 0; round < 8; round++) {
    const lengths = options.map(option => textLen(option.text));
    const correctIndex = options.findIndex(option => option.isCorrect);
    const correctLen = lengths[correctIndex];
    const wrongIndexes = options.map((option, index) => option.isCorrect ? -1 : index).filter(index => index >= 0);
    const wrongLens = wrongIndexes.map(index => lengths[index]);
    const maxLen = Math.max(...lengths);
    const minLen = Math.min(...lengths);
    const wrongMax = Math.max(...wrongLens);
    const wrongMin = Math.min(...wrongLens);
    const correctUniqueLongest = correctLen === maxLen && lengths.filter(length => length === maxLen).length === 1;
    const pass = maxLen - minLen < 35
      && maxLen / Math.max(1, minLen) < 1.8
      && correctLen - wrongMax < 12
      && correctLen / Math.max(1, wrongMax) < 1.25
      && wrongMin - correctLen < 12
      && wrongMin / Math.max(1, correctLen) < 1.25
      && !correctUniqueLongest;
    if (pass) break;

    let target = lengths.indexOf(minLen);
    if (correctLen - wrongMax >= 12 || correctLen / Math.max(1, wrongMax) >= 1.25 || correctUniqueLongest) {
      target = wrongIndexes[wrongLens.indexOf(wrongMin)];
    } else if (wrongMin - correctLen >= 12 || wrongMin / Math.max(1, correctLen) >= 1.25) {
      target = correctIndex;
    }
    const addition = humanContinuation(question, options[target], round);
    if (!addition) break;
    options[target].text = `${withPeriod(options[target].text)}${addition}`;
  }
  return { ...question, options };
}

function sentenceParts(text) {
  const parts = [];
  let current = '';
  for (const char of String(text || '').replace(/\s+/g, ' ')) {
    current += char;
    if ('。！？!?'.includes(char)) {
      const trimmed = current.trim();
      if (textLen(trimmed) >= 8) parts.push(trimmed);
      current = '';
    }
  }
  const tail = current.trim();
  if (textLen(tail) >= 8) parts.push(tail);
  return parts;
}

function hasRepeatedSentence(text) {
  const seen = new Set();
  for (const part of sentenceParts(text)) {
    if (seen.has(part)) return true;
    seen.add(part);
  }
  return false;
}

function validate(bank) {
  const errors = [];
  const counts = new Map();
  const optionMap = new Map();
  for (const question of bank) {
    counts.set(question.category, (counts.get(question.category) || 0) + 1);
    if (question.options.filter(option => option.isCorrect).length !== 1) errors.push(`${question.id}: expected one correct option`);
    const correct = question.options.find(option => option.isCorrect);
    if (correct?.explain) errors.push(`${question.id}: correct explain should be empty`);
    for (const option of question.options) {
      if (BANNED_TEMPLATES.test(option.text)) errors.push(`${question.id}: banned template in option: ${option.text}`);
      if (hasRepeatedSentence(option.text)) errors.push(`${question.id}: repeated sentence in option: ${option.text}`);
      if (!option.isCorrect && textLen(option.explain) < 16) errors.push(`${question.id}: weak wrong explain`);
      const key = option.text;
      if (!optionMap.has(key)) optionMap.set(key, []);
      optionMap.get(key).push(question.id);
    }
  }
  for (const [category, count] of counts.entries()) {
    if (count !== 50) errors.push(`${category}: expected 50, got ${count}`);
  }
  for (const [text, owners] of optionMap.entries()) {
    if (owners.length >= 3) errors.push(`option repeated 3+: ${text.slice(0, 50)} (${owners.join(', ')})`);
  }
  if (bank.length !== 400) errors.push(`expected 400 questions, got ${bank.length}`);
  if (errors.length) throw new Error(errors.slice(0, 60).join('\n'));
}

function main() {
  const { bank, tail } = loadBank();
  const updated = uniquifyOptions(bank.map(rewriteQuestion)).map(balanceHumanQuestion);
  validate(updated);
  const source = [
    '/**',
    ' * FoxSay 微练习题库',
    ' * 8 大主题 x 50 题；错误选项已按当前场景重写，避免模板尾句和重复话术。',
    ' */',
    '',
    "import type { Question } from '../services/quiz';",
    '',
    `export const QUIZ_BANK: Question[] = ${JSON.stringify(updated, null, 2)};`,
    '',
    tail.trimStart(),
  ].join('\n');
  fs.writeFileSync(BANK_PATH, source, 'utf8');
  console.log('HUMAN_V4_WRONG_OPTIONS_REWRITTEN');
  console.log('TOTAL=' + updated.length);
  console.log('WROTE=' + BANK_PATH);
}

main();