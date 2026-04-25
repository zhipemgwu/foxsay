const fs = require('fs');
const path = require('path');

const BANK_PATH = path.join(__dirname, '..', 'src', 'data', 'quizBank.ts');
const MARKER = 'export const QUIZ_BANK: Question[] = ';
const END_MARKER = ';\n\nexport function getQuestionById';
const LETTERS = ['A', 'B', 'C', 'D'];
const TARGET_CATEGORIES = ['ambiguous', 'love', 'redflag', 'emotion-catch', 'refuse', 'recover'];

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

function opt(text, isCorrect, explain = '') {
  return { text, isCorrect, explain: isCorrect ? '' : `❌ ${explain}` };
}

function wrong(reason) {
  return reason.length < 18 ? `${reason}所以它不是这题要找的选项。` : reason;
}

function correctLetter(options) {
  return LETTERS[options.findIndex(option => option.isCorrect)] || 'A';
}

function distributeAnswer(options, questionIndex) {
  const targetIndexes = [2, 0, 3, 1];
  const targetIndex = targetIndexes[questionIndex % targetIndexes.length];
  const correctOption = options.find(option => option.isCorrect);
  const wrongOptions = options.filter(option => !option.isCorrect);
  let wrongIndex = 0;
  return options.map((_, index) => index === targetIndex ? { ...correctOption } : { ...wrongOptions[wrongIndex++] });
}

const lessons = {
  ambiguous: '这题练的是暧昧里的力度感：接住温度，但不把窗口当承诺。',
  love: '这题练的是亲密关系里的修复表达：说清事实、感受、需求和下一步。',
  redflag: '这题练的是看行为模式，而不是听包装词。',
  'emotion-catch': '这题练的是先接住情绪，再处理事情。',
  refuse: '这题练的是温和但清楚地说不。',
  recover: '这题练的是复联里的低压感：让接触重新安全，而不是索要结果。',
};

function contextName(itemCase) {
  return itemCase.detail || itemCase.issue || itemCase.behavior || itemCase.emotion || itemCase.request || itemCase.contact || '这件事';
}

function stripEnd(text) {
  return String(text).replace(/[。！？]$/, '');
}

function categoryClause(category, context, isCorrect, salt) {
  const pools = {
    ambiguous: isCorrect
      ? [`，重点是留出对方继续接话的空间。`, `，这样既接住温度也不催结果。`, `，对方有余地继续靠近。`]
      : [`，这会让${context}里的轻松感变成压力。`, `，对方很容易因为${context}往回收。`, `，${context}会从靠近变成猜输赢。`],
    love: isCorrect
      ? [`，下一次也更容易照着做。`, `，这比互相指责更能进入修复。`, `，对方知道该调整哪一步。`]
      : [`，这会让${context}从问题变成审判。`, `，对方会先防御，听不见${context}背后的需要。`, `，${context}里的真实需求反而被情绪盖住。`],
    redflag: isCorrect
      ? [`，先保护自己的选择权。`, `，不会被好听包装带走判断。`, `，也方便观察对方是否尊重。`]
      : [`，这会把${context}正常化。`, `，${context}会继续压缩你的边界。`, `，${context}的风险容易被包装词盖过去。`],
    'emotion-catch': isCorrect
      ? [`，对方会更容易继续说下去。`, `，情绪先落地，后面才谈得上办法。`, `，这比急着纠正更安全。`]
      : [`，这会跳过${context}，让对方更孤单。`, `，面对${context}时好心会被听成否定。`, `，${context}还没被接住，对方可能更不想开口。`],
    refuse: isCorrect
      ? [`，既清楚也不把关系撕开。`, `，不会留下继续劝你的口子。`, `，替代方案也没有越过边界。`]
      : [`，这会让${context}继续有推进空间。`, `，对方听到的不是${context}的边界，而是还能商量。`, `，你会被拉进${context}的下一轮解释。`],
    recover: isCorrect
      ? [`，对方接触起来才不会有负担。`, `，这比索要复合更能建立安全感。`, `，改变会被看见而不是被推销。`]
      : [`，这会让${context}重新变成压力。`, `，对方会因为${context}想起旧关系里的疲惫感。`, `，你又把${context}的结果压到对方身上。`],
  };
  const list = pools[category] || pools.ambiguous;
  return list[salt % list.length];
}

function withClause(text, category, context, isCorrect, salt) {
  const leadPools = {
    ambiguous: ['只看这句话', `放在${context}这里`, '如果先不急着定义'],
    love: ['这次沟通里', `说回${context}`, '如果想让对方听进去'],
    redflag: ['只看这个要求', `面对${context}`, '放到安全边界里'],
    'emotion-catch': ['先看当下情绪', `面对${context}`, '这时'],
    refuse: ['这次拒绝里', `面对${context}`, '把边界说清时'],
    recover: ['这个节点上', '重新接触时', `在${context}这里`],
  };
  const leads = leadPools[category] || ['这个场景里'];
  const lead = leads[salt % leads.length];
  const quote = text.match(/^“(.+)”$/);
  if (quote) return `“${lead}，${quote[1]}”`;
  return `${lead}，${stripEnd(text)}。`;
}

function dedupeOptionTexts(questions) {
  const seen = new Map();
  const originalCounts = new Map();
  for (const question of questions) {
    for (const option of question.options) {
      const original = option.text;
      let nextText = original;
      const occurrence = originalCounts.get(original) || 0;
      originalCounts.set(original, occurrence + 1);
      let salt = occurrence;
      let attempts = 0;
      while (seen.has(nextText) && attempts < 24) {
        nextText = withClause(original, question.category, question._context, option.isCorrect, salt++);
        attempts++;
      }
      if (seen.has(nextText)) {
        nextText = `${stripEnd(original)}，放在${question._context}这个场景里会更不稳。`;
      }
      option.text = nextText;
      seen.set(option.text, (seen.get(option.text) || 0) + 1);
    }
  }
}

function polishGenerated(questions) {
  dedupeOptionTexts(questions);
  for (const question of questions) {
    for (let round = 0; round < 6; round++) {
      const lengths = question.options.map(option => textLen(option.text));
      const correctIndex = question.options.findIndex(option => option.isCorrect);
      const correctLen = lengths[correctIndex];
      const wrongIndexes = question.options.map((option, index) => option.isCorrect ? -1 : index).filter(index => index >= 0);
      const wrongLens = wrongIndexes.map(index => lengths[index]);
      const wrongMax = Math.max(...wrongLens);
      const wrongMin = Math.min(...wrongLens);
      const maxLen = Math.max(...lengths);
      const minLen = Math.min(...lengths);
      if (correctLen - wrongMax >= 12 || correctLen / Math.max(1, wrongMax) >= 1.25) {
        const targetIndex = wrongIndexes[wrongLens.indexOf(Math.min(...wrongLens))];
        question.options[targetIndex].text = withClause(question.options[targetIndex].text, question.category, question._context, false, round + targetIndex);
        continue;
      }
      if (wrongMin - correctLen >= 12 || wrongMin / Math.max(1, correctLen) >= 1.25) {
        question.options[correctIndex].text = withClause(question.options[correctIndex].text, question.category, question._context, true, round + correctIndex);
        continue;
      }
      if (maxLen / Math.max(1, minLen) >= 1.8 || maxLen - minLen >= 35) {
        const targetIndex = lengths.indexOf(minLen);
        question.options[targetIndex].text = withClause(question.options[targetIndex].text, question.category, question._context, question.options[targetIndex].isCorrect, round + targetIndex);
      }
    }
  }
  dedupeOptionTexts(questions);
  for (const question of questions) {
    question.overallExplain = makeOverall(question.category, question._built, question.options);
    delete question._context;
    delete question._built;
  }
  return questions;
}

function makeOverall(category, item, options) {
  const correct = options.find(option => option.isCorrect);
  return `正确答案：${correctLetter(options)}。${lessons[category]} 选“${correct.text}”的原因是：${item.note}`;
}

const ambiguousCases = [
  { scene: '她晚上发来“今天加班到现在，楼下便利店都快关了”', signal: '深夜分享状态', warmth: '一点陪伴感', safe: '那你这会儿应该饿过头了，楼下要是关了，我给你找个还能送的粥店？', invite: '明天如果还这么晚下班，可以一起去楼下吃点热的', detail: '加班夜宵' },
  { scene: '她连续两天给你朋友圈点赞，今天还评论“你最近挺会生活啊”', signal: '连续互动加轻调侃', warmth: '轻松关注', safe: '被你发现了，我最近主要是在假装自己很会生活', invite: '下次我发现好喝的店，可以喊你一起鉴定一下', detail: '朋友圈那句调侃' },
  { scene: '你说周末可能去看展，她问“一个人去吗？”', signal: '试探你的空档', warmth: '潜在同行窗口', safe: '本来打算一个人去，如果你也感兴趣，可以一起看一小段', invite: '把看展变成一个可拒绝的小同行，不急着定义关系', detail: '看展空档' },
  { scene: '她发来一首歌，说“这首前奏很像昨晚的心情”', signal: '分享私人情绪', warmth: '情绪交换', safe: '我听了一下，前奏确实有点空空的，你昨晚是这种感觉吗？', invite: '先聊歌里的感受，等她愿意再约一次轻松散步', detail: '那首歌' },
  { scene: '她说“你是不是对谁都这么会接话？”后面跟了一个笑脸', signal: '半吃醋半测试', warmth: '想确认独特感', safe: '也不是，主要是你抛的话我比较愿意认真接', invite: '轻轻确认她的特别感，不把话说成表白', detail: '会接话这句' },
  { scene: '她拍了今天的穿搭问你“这身会不会太正式？”', signal: '主动让你参与判断', warmth: '轻微展示自己', safe: '不会，外套让它正式一点，鞋子又把距离拉回来了', invite: '具体夸一个细节，顺手给出判断就停住', detail: '今天这身穿搭' },
  { scene: '散场时她放慢脚步，问你“你往哪边走？”', signal: '制造同行机会', warmth: '线下靠近', safe: '我也往地铁口那边走，要不一起走到路口？', invite: '只提走到路口，范围小也方便她拒绝', detail: '散场同行' },
  { scene: '她隔了很久才回：“刚洗完澡，看到消息了”', signal: '补偿式解释', warmth: '在意你的感受', safe: '没事，我刚才也在忙。你这句解释得还挺认真', invite: '不追问迟回，轻轻接住她补上的解释', detail: '刚才那句解释' },
  { scene: '她记得你上次说胃不好，今天问你“你吃晚饭了吗？”', signal: '记住细节', warmth: '照顾感', safe: '吃了，这次没乱来。你这个提醒比外卖软件靠谱多了', invite: '接住关心，再自然回一点轻松感', detail: '晚饭提醒' },
  { scene: '她说“跟你聊天还挺放松的，不用一直想怎么回”', signal: '舒适感确认', warmth: '安全感', safe: '那我就放心了，我也喜欢这种不用抢着表现的聊天', invite: '承认舒服，但不立刻表白或要关系', detail: '聊天放松感' },
];

const ambiguousBuilders = [
  c => ({ angle: '判断信号', prompt: '这个信号怎么理解最稳？', options: [
    opt(`这是${c.signal}，说明有${c.warmth}，可以接住，但还不能当成确定喜欢。`, true),
    opt(`她已经通过${c.detail}表态了，今晚就该把关系问清楚。`, false, wrong('把信号当承诺，推进太猛会让轻松感消失。')),
    opt(`这只是普通客套，围绕${c.detail}回个表情就行，不用认真接。`, false, wrong('完全压低信号会错过窗口，也会让对方觉得你接不住。')),
    opt(`先故意晚点回，看看她会不会因为${c.detail}继续追你。`, false, wrong('故意冷不是松弛，是博弈，会损害真实好感。')),
  ], note: `它把${c.signal}看成互动窗口，而不是直接推成关系承诺。` }),
  c => ({ angle: '怎么回', prompt: '怎么回复既有温度，又不显得上头？', options: [
    opt(c.safe, true),
    opt(`你提到${c.detail}，是不是有点想让我多陪你一点？`, false, wrong('逼问确定性会把暧昧变成审问。')),
    opt(`哈哈，你这样说${c.detail}我会当真的，到时候别说只是随口。`, false, wrong('看似玩笑，其实把自己的在意暴露太满。')),
    opt(`我先不急着接${c.detail}，看你会不会再多给一点信号。`, false, wrong('用冷处理测试对方，会破坏真实互动。')),
  ], note: '它有回应、有轻微温度，但没有让对方马上承担关系压力。' }),
  c => ({ angle: '推进一步', prompt: '想把关系往前推一点，下一步最合适的是？', options: [
    opt(`下一步可以${c.invite}，但不把关系推到必须回应。`, true),
    opt(`趁${c.detail}这个窗口还在，今晚直接约出来，不然热度很快就没了。`, false, wrong('太急会像抓机会，而不是尊重对方节奏。')),
    opt(`先停两天不接${c.detail}，看看她会不会因为等不到回应更主动。`, false, wrong('用冷淡制造波动，会把暧昧变成操控。')),
    opt(`围绕${c.detail}写一段认真消息，把你已经心动讲清楚。`, false, wrong('情绪浓度过高，会压垮当前轻松窗口。')),
  ], note: '它把暧昧落成低压力小互动，而不是立刻要关系结果。' }),
  c => ({ angle: '避开误读', prompt: '这里最容易踩的坑是什么？', options: [
    opt(`把${c.signal}直接当成“她已经认定你”，然后一下子加码太多。`, true),
    opt(`轻轻接住${c.detail}，再看她后续怎么回。`, false, wrong('这不是坑，这是暧昧期比较稳的处理方式。')),
    opt(`围绕${c.detail}给一个范围很小、可以拒绝的小提议。`, false, wrong('可拒绝的小提议能降低压力，是合适推进。')),
    opt(`不急着把${c.detail}推成关系定义，先让互动自然走一段。`, false, wrong('不急着定义是分寸感，不是逃避。')),
  ], note: `它提醒用户：${c.signal}只是窗口，不能被焦虑放大成确定关系。` }),
  c => ({ angle: '保持节奏', prompt: '怎么做最能保持吸引力和松弛感？', options: [
    opt(`回应她给出的${c.warmth}，但继续过自己的节奏，不把全部情绪押在她下一句。`, true),
    opt('立刻让她知道你已经很喜欢她，这样她才会更有安全感。', false, wrong('过早交底会让关系失衡，也容易给对方压力。')),
    opt('发点让她吃醋的动态，看看她会不会因为你而有反应。', false, wrong('刺激嫉妒只能制造波动，不会制造稳定吸引。')),
    opt('每句话都反复分析到没有风险，再选择最稳的字发出去。', false, wrong('过度斟酌会让聊天失去自然感。')),
  ], note: '它让喜欢和自我节奏同时存在，不靠对方下一句决定你的状态。' }),
];

const loveCases = [
  { scene: '对方最近经常隔很久才回消息，但每次都说“刚才太忙了”', issue: '回复变少', feeling: '有点被放在一边', need: '被惦记', ask: '忙的时候简单说一声状态', result: '我不会一直猜自己是不是被晾着' },
  { scene: '你提前说过很在意纪念日，对方当天还是完全忘了', issue: '忘记纪念日', feeling: '失落', need: '被重视', ask: '重要日子提前一起确认安排', result: '我会觉得这件事被你放在心上' },
  { scene: '你连续几天做饭收拾，对方像默认这是你应该做的', issue: '付出没被看见', feeling: '委屈', need: '被认可', ask: '看到对方做事时给一句确认', result: '我会觉得自己的付出被看见' },
  { scene: '对方和异性朋友单独吃饭，事后你从朋友圈才看到', issue: '敏感场合没有提前说', feeling: '不安', need: '透明感', ask: '类似场合提前说一声', result: '我不用从朋友圈里补消息' },
  { scene: '你们因为旅行预算吵起来，对方觉得你扫兴，你觉得他冲动', issue: '花钱标准不同', feeling: '没被一起商量', need: '共同规则', ask: '大额支出前先定预算', result: '我们不容易临时为了钱吵起来' },
  { scene: '你想下班后聊一会儿，对方只想自己打游戏放空', issue: '恢复方式不同', feeling: '被冷落', need: '连接感', ask: '先休息半小时，再留十分钟聊天', result: '我能给你空间，也不会觉得被丢下' },
  { scene: '吵架后对方直接不说话，你不知道这次冷多久', issue: '冷处理', feeling: '悬着', need: '沟通通道', ask: '可以暂停，但约定什么时候回来谈', result: '我不会一直悬着等你开口' },
  { scene: '朋友面前，对方拿你的短处开玩笑，大家都笑了', issue: '公开玩笑过界', feeling: '没面子', need: '尊重', ask: '公开场合别拿我当梗', result: '我会更放心地跟你一起见朋友' },
  { scene: '你聊未来规划，对方总用“到时候再说”带过去', issue: '回避未来', feeling: '不确定', need: '确定感', ask: '先聊一个月内能执行的小计划', result: '我更知道我们在往哪里走' },
  { scene: '你情绪低落，对方一直讲道理，越讲你越难受', issue: '情绪被跳过', feeling: '更孤单', need: '先被理解', ask: '先听我说完，再一起想办法', result: '我会先感觉自己被你接住' },
];

const loveBuilders = [
  c => ({ angle: '表达需求', prompt: '怎么说最容易让对方听进去？', options: [
    opt(`这件事让我${c.feeling}，我真正需要的是${c.need}。我们能不能以后${c.ask}？`, true),
    opt(`你是不是因为${c.issue}已经没那么爱我了？你直接告诉我也行。`, false, wrong('把具体问题升级成爱不爱，对方会先防御。')),
    opt(`算了，${c.issue}这件事我自己消化，说出来反正也没用。`, false, wrong('短期避免冲突，长期会累积委屈。')),
    opt(`你自己想想${c.issue}为什么让我不开心，别什么都要我说。`, false, wrong('让对方猜谜会制造挫败感，需求没有变清楚。')),
  ], note: `它把${c.issue}翻译成感受、需求和一个能执行的请求。` }),
  c => ({ angle: '冲突降温', prompt: '争执开始升温，哪句话最能把话题拉回修复？', options: [
    opt(`我现在有情绪，但我不是要赢你。我想先把${c.issue}这件事说清楚。`, true),
    opt(`你别转移话题，今天必须给我一个关于${c.issue}的说法。`, false, wrong('“必须”会增加压迫感，容易把沟通变成审判。')),
    opt(`好，那我以后也用${c.issue}这种方式对你，看你受不受得了。`, false, wrong('报复式表达会让双方一起受伤，问题本身没解决。')),
    opt(`${c.issue}如果还这样，我们就没必要继续谈下去了。`, false, wrong('用关系威胁处理具体冲突，会破坏安全感。')),
  ], note: '它先声明目标不是输赢，再把沟通拉回具体问题。' }),
  c => ({ angle: '具体请求', prompt: '哪种请求最可能真的被执行？', options: [
    opt(`${c.ask}，这样${c.result}。`, true),
    opt(`你以后能不能别一到${c.issue}这种事就让我失望？`, false, wrong('这是情绪评价，不是行动指令。')),
    opt(`这件事上你就不能主动一点吗？别每次都让我提醒。`, false, wrong('“主动点”太泛，对方不知道下一次具体做什么。')),
    opt(`我希望你以后遇到${c.issue}都能提前想到我的感受。`, false, wrong('这是读心术要求，没人能长期稳定满足。')),
  ], note: '它具体到下一次怎么做，对方能理解也能执行。' }),
  c => ({ angle: '识别真正伤点', prompt: '这件事真正伤人的地方是什么？', options: [
    opt(`表面是${c.issue}，底层是你感觉${c.need}没有被照顾。`, true),
    opt(`说明对方在${c.issue}这件事上就是自私，不值得继续。`, false, wrong('直接人格定性会堵死修复空间，也未必符合事实。')),
    opt(`说明你对${c.issue}太敏感，需要把期待再降低一点。`, false, wrong('把需求打成敏感，会让你越来越不敢表达。')),
    opt(`说明${c.issue}背后其实就是谁更爱谁的问题。`, false, wrong('爱不爱太大，会把可修复问题推成关系审判。')),
  ], note: '它看见事件背后的需求，不停留在表面争执。' }),
  c => ({ angle: '谈完后的修复', prompt: '谈完以后，哪个动作最能避免下次重演？', options: [
    opt(`把“以后${c.ask}”变成你们都认可的小约定，下次照着做。`, true),
    opt(`让对方保证以后绝不会再出现${c.issue}这种事。`, false, wrong('绝对保证听起来安心，但不可持续，容易变成空话。')),
    opt(`${c.issue}先别提了，等关系气氛自然恢复就好。`, false, wrong('不复盘会让同类问题反复出现。')),
    opt(`让对方公开证明他重视你，这样${c.issue}才算过去。`, false, wrong('公开证明不是修复，反而会制造表演感。')),
  ], note: '它把一次冲突沉淀成下一次可执行的新规则。' }),
];

const redflagCases = [
  { scene: '刚在一起不久，对方要求你删掉所有异性好友', behavior: '切断正常社交', cover: '安全感', boundary: '正常社交不能用删除来证明忠诚', action: '保留朋友支持，并观察他是否继续升级要求' },
  { scene: '对方说情侣就该坦诚，要求你交出手机密码', behavior: '侵犯隐私', cover: '信任', boundary: '信任不能靠交出隐私建立', action: '拒绝交密码，只谈具体让他不安的事' },
  { scene: '你穿喜欢的裙子出门，对方说“穿这样就是想被看”', behavior: '控制穿着', cover: '吃醋保护', boundary: '穿衣服是身体自主，不是接受审查', action: '明确衣着边界，观察是否持续贬低' },
  { scene: '对方要求你实时共享定位，不开就生气', behavior: '监控行踪', cover: '担心你', boundary: '报平安可以，全天候定位不可以', action: '拒绝常态监控，只在特殊安全场景共享' },
  { scene: '对方总说你的朋友都不靠谱，只有他最懂你', behavior: '孤立支持系统', cover: '替你筛选朋友', boundary: '朋友关系不能由伴侣单方面决定', action: '继续和可信朋友保持联系' },
  { scene: '你提分开，对方说“你走我就不知道会做什么”', behavior: '自伤威胁', cover: '离不开你', boundary: '痛苦需要帮助，但不能把你变成人质', action: '联系其亲友或专业帮助，自己不要单独承担' },
  { scene: '对方说要帮你规划未来，要求统一管理你的工资', behavior: '经济控制', cover: '共同规划', boundary: '共同规划不等于放弃财务权限', action: '保留个人账户和预算决定权' },
  { scene: '刚认识三天，对方每天高强度表白，之后又突然冷掉', behavior: '热冷循环', cover: '情绪太浓', boundary: '热情不能代替稳定了解', action: '放慢节奏，不追逐冷掉后的回应' },
  { scene: '朋友面前，对方总用玩笑揭你的短', behavior: '公开羞辱', cover: '开玩笑', boundary: '玩笑要以被说的人舒服为前提', action: '私下明确停止，观察是否尊重' },
  { scene: '你拒绝亲密接触，对方说“都在一起了还装什么”', behavior: '推进身体边界', cover: '亲密证明', boundary: '亲密行为必须能自由拒绝', action: '明确拒绝，必要时离开现场' },
];

const redflagBuilders = [
  c => ({ angle: '风险命名', prompt: '这件事最准确的风险是什么？', options: [
    opt(`${c.behavior}，只是被包装成了“${c.cover}”。`, true),
    opt(`这只是普通情侣磨合，围绕${c.cover}多沟通几次就会好。`, false, wrong('磨合是双方调整，控制是单方面压缩你的空间。')),
    opt(`他可能只是太缺${c.cover}，你多耐心一点就能稳定下来。`, false, wrong('不安不能成为越界理由，你不是用牺牲边界来治疗对方的人。')),
    opt(`这只是表达方式笨，不代表${c.behavior}真的有风险。`, false, wrong('持续剥夺选择权不是笨拙表达，不能被正常化。')),
  ], note: `它越过“${c.cover}”的包装，直接看见${c.behavior}。` }),
  c => ({ angle: '边界表达', prompt: '如果要回应，哪句边界最清楚？', options: [
    opt(`我理解你说是${c.cover}，但${c.boundary}。`, true),
    opt(`你别在这件事上这样行不行，我真的会很难过。`, false, wrong('情绪真实，但边界不清楚，对方仍然可以继续试探。')),
    opt(`如果你爱我，就不会拿${c.cover}当理由这样对我。`, false, wrong('用爱反向施压，会把问题拉进证明爱不爱的泥潭。')),
    opt(`算了，我不想因为这个吵架，你先别生气。`, false, wrong('回避冲突会让边界消失，红旗容易继续升级。')),
  ], note: '它承认对方说法，但不接受包装后的越界行为。' }),
  c => ({ angle: '安全动作', prompt: '下一步最稳妥的动作是什么？', options: [
    opt(c.action, true),
    opt(`先顺着对方这次要求，等关系稳定后再慢慢谈边界。`, false, wrong('顺从会强化控制，关系稳定后通常更难改。')),
    opt(`用同样方式反过来要求他，让他知道被${c.behavior}是什么感受。`, false, wrong('以控制反控制会升级风险，也让你进入同一套坏规则。')),
    opt(`立刻把所有细节发到朋友圈，让大家帮你评理。`, false, wrong('公开化可能带来反噬，先找可信支持和安全计划更稳。')),
  ], note: '它先保护现实边界，而不是陷入辩论。' }),
  c => ({ angle: '识别合理化', prompt: '下面哪种想法最容易让人继续陷进去？', options: [
    opt(`“他只是因为${c.cover}，所以${c.behavior}也可以理解。”`, true),
    opt('“我要看他持续怎么做，不只听他说什么。”', false, wrong('这是正确观察方式，不是陷阱。')),
    opt('“如果我不舒服，可以先和可信朋友说。”', false, wrong('保留外部视角是保护自己，不是背叛关系。')),
    opt('“边界被拒绝后，我需要重新评估关系。”', false, wrong('这是健康判断，不是小题大做。')),
  ], note: '它点出最常见的自我说服：把动机写好听，忽略行为正在伤害你。' }),
  c => ({ angle: '模式判断', prompt: '如果类似情况反复出现，说明什么？', options: [
    opt(`这不是单次误会，而可能是“${c.cover}包装下的${c.behavior}”模式。`, true),
    opt(`说明你还不够会沟通，说得更温柔一点就能减少${c.behavior}。`, false, wrong('沟通可以优化，但不能把对方持续越界的责任揽到自己身上。')),
    opt(`说明他太在乎你，${c.cover}不够时才会表现得这么强烈。`, false, wrong('控制不是深情，焦虑也不是越界许可证。')),
    opt('说明亲密关系都会有这种阶段，你需要慢慢适应。', false, wrong('健康亲密关系会增加安全感，不会让你越来越小心。')),
  ], note: '它看频率、强度和对方是否尊重拒绝，而不是只看单次解释。' }),
];

const emotionCases = [
  { scene: '朋友被领导当众批评，回到座位后一句话都不说', emotion: '羞耻和委屈', need: '先有人站在她这边', bad: '立刻教她怎么汇报' },
  { scene: '对象考试没过，说“我是不是很没用”', emotion: '挫败和自我怀疑', need: '价值被确认', bad: '马上讲鸡汤' },
  { scene: '她和家里吵完架，说“算了，没人懂我”', emotion: '孤独和不被理解', need: '有人愿意听完', bad: '替父母解释' },
  { scene: '朋友分手后反复翻聊天记录，说自己停不下来', emotion: '不甘和失落', need: '允许她慢慢放下', bad: '催她赶紧走出来' },
  { scene: '对象因为你晚回消息有点生气，但嘴上说“没事”', emotion: '被忽略的不安', need: '被解释和安抚', bad: '说她太敏感' },
  { scene: '同事方案被否后说“我再也不想做了”', emotion: '被打击后的泄气', need: '先承认难受', bad: '马上列解决方案' },
  { scene: '妹妹第一次离家上学，晚上说很想家', emotion: '想家和不适应', need: '被陪伴', bad: '说大家都这样' },
  { scene: '她吃醋但不承认，只说“你爱跟谁聊跟谁聊”', emotion: '在意又怕显得小气', need: '被看见但不被嘲笑', bad: '故意逗她更急' },
  { scene: '朋友犯错后一直说“都怪我”', emotion: '内疚和自责', need: '责任被拆清楚', bad: '简单说别想了' },
  { scene: '对象加班到很晚，回家后只想瘫着不说话', emotion: '耗尽和疲惫', need: '低负担照顾', bad: '追问为什么不理你' },
];

const emotionBuilders = [
  c => ({ angle: '第一回应', prompt: '第一句怎么回最能接住情绪？', options: [
    opt(`听起来你现在最重的是${c.emotion}。我先陪你待一会儿，不急着分析。`, true),
    opt('你别想太多，事情没有你感觉的那么严重，先别把自己困住。', false, wrong('想减轻痛苦，却先否定了痛苦。')),
    opt(`${c.bad}，这样至少能快一点把事情处理掉。`, false, wrong('方案出现太早，对方会觉得你没站在她这边。')),
    opt('我也遇到过更惨的情况，我跟你说完你就会觉得这不算什么。', false, wrong('用自己的经历覆盖对方，会让对方的情绪失去位置。')),
  ], note: `它先命名${c.emotion}，让对方知道自己不是一个人在扛。` }),
  c => ({ angle: '共情复述', prompt: '哪句复述最像真的听懂了？', options: [
    opt(`你不是单纯在说这件事，你是有点${c.emotion}，对吗？`, true),
    opt('所以你现在就是很生气，对吧？别的其实都没有那么重要。', false, wrong('情绪命名太粗，可能不贴合。')),
    opt('我懂了，你其实就是想让我帮你解决，不是真的想一直聊感受。', false, wrong('把表达情绪等同于要方案，会让对方更孤单。')),
    opt('其实你也知道自己有问题，只是不想承认，所以才这么难受。', false, wrong('这是审判，不是复述，会直接关门。')),
  ], note: '它把事件背后的感受说出来，同时用“对吗”给对方修正空间。' }),
  c => ({ angle: '给建议的时机', prompt: '如果你想给建议，怎样开口更稳？', options: [
    opt('你想让我先听你说完，还是现在一起想办法？我都可以。', true),
    opt('我知道你难受，但是你现在必须振作，不能一直停在这里。', false, wrong('“但是”会抹掉前面的共情，“必须”会增加压力。')),
    opt('我给你三个建议，你先照着做，情绪之后自然就会好一点。', false, wrong('太像指挥，对方情绪没落地前很难吸收。')),
    opt('你先冷静，冷静了再说，不然现在讲什么都没有意义。', false, wrong('让人冷静经常会被听成“你现在不正常”。')),
  ], note: '它先问对方要陪伴还是要方案，避免好心变成压迫。' }),
  c => ({ angle: '二次伤害', prompt: '哪句话最容易造成二次伤害？', options: [
    opt(`${c.bad}，因为现在最重要的是赶紧把问题往前推。`, true),
    opt(`你现在有点${c.emotion}，我在，你不用马上整理好。`, false, wrong('这是接情绪，不是二次伤害。')),
    opt('你愿意说多少就说多少，不用把顺序和逻辑都讲清。', false, wrong('这会降低表达压力，是安全回应。')),
    opt('我可能不完全懂，但我愿意听，你可以慢慢讲。', false, wrong('承认不完全懂反而真诚，不会抢解释权。')),
  ], note: `它识别出：${c.bad}可能有道理，但时机太早，会让对方觉得被否定。` }),
  c => ({ angle: '后续陪伴', prompt: '聊完过一会儿，哪个后续动作最加分？', options: [
    opt(`轻轻确认：“刚才那阵${c.emotion}过去一点了吗？需要我做点什么吗？”`, true),
    opt('马上转移到开心话题，让气氛轻一点，别让她一直沉在里面。', false, wrong('过快转移会让对方觉得情绪被处理掉，而不是被接住。')),
    opt('反复追问所有细节，直到她把前因后果全部讲清楚。', false, wrong('追问会变成审问，对方可能更累。')),
    opt('告诉她以后别再因为这种事崩溃，不然自己会更辛苦。', false, wrong('这是否定情绪强度，会让她下次不敢说。')),
  ], note: `它继续回应${c.need}，不是聊完就撤。` }),
];

const refuseCases = [
  { scene: '朋友临时让你替他完成一份很耗时的报告', request: '替你完成报告', reason: '我今晚已经有安排', alternative: '我可以帮你看 10 分钟思路' },
  { scene: '暧昧对象半夜让你打车过去陪他', request: '半夜过去陪你', reason: '时间太晚，也不安全', alternative: '我们可以明天白天再约' },
  { scene: '同事总把自己的杂活推给你，这次又让你顺手处理', request: '接下这些额外杂活', reason: '这不在我的职责范围内', alternative: '你可以找负责人重新分配' },
  { scene: '亲戚安排相亲，你这段时间不想去', request: '参加这次相亲', reason: '我现在不想进入相亲流程', alternative: '以后有意愿我会主动说' },
  { scene: '朋友想借一笔钱，但这会影响你的房租预算', request: '借出这笔钱', reason: '这会影响我的基本预算', alternative: '我可以陪你想其他周转办法' },
  { scene: '对象要求你把手机密码告诉他，说情侣不该有秘密', request: '交出手机密码', reason: '我的隐私边界需要保留', alternative: '我们可以讨论让你不安的具体事' },
  { scene: '前任深夜约你见面，说只是聊聊', request: '深夜见面', reason: '这个时间和我们的关系状态都不合适', alternative: '必要的话可以白天在公共场合短聊' },
  { scene: '朋友让你帮忙撒谎骗她对象', request: '帮你撒谎', reason: '我不想卷入关系欺骗', alternative: '我可以陪你想怎么坦白' },
  { scene: '第一次约会后，对方马上要求确定关系', request: '立刻确定关系', reason: '我还需要更多了解', alternative: '我们可以继续正常相处几次' },
  { scene: '领导下班后临时让你无偿加班，说年轻人多扛一点', request: '无偿加班', reason: '我已经下班，也没有提前安排', alternative: '可以明早优先处理，或先确认加班安排' },
];

const refuseBuilders = [
  c => ({ angle: '第一次拒绝', prompt: '怎么拒绝最清楚又不撕破脸？', options: [
    opt(`这次我不能${c.request}，因为${c.reason}。${c.alternative}。`, true),
    opt('我可能不太方便吧，要不之后再看看？如果实在没办法我再想想。', false, wrong('“可能/再看看”不是拒绝，对方会继续推进。')),
    opt(`你怎么老是这样为难我？${c.request}又不是我应该做的。`, false, wrong('带指责会升级冲突，拒绝的重点是边界。')),
    opt('对不起对不起，我真的特别不好意思，你别因为这个对我失望。', false, wrong('过度道歉会让合理拒绝像亏欠。')),
  ], note: '它清楚说不、理由简短、替代有限。' }),
  c => ({ angle: '对方继续劝', prompt: '对方继续劝你“再帮一次”，怎么重复边界？', options: [
    opt(`我理解你很希望我答应，但我的决定不变：我不能${c.request}。`, true),
    opt('你再这样我真的要生气了，我已经说了很多遍你还不听。', false, wrong('情绪威胁会把焦点变成你的态度，而不是你的边界。')),
    opt('不是我不想，是我真的没办法，你要是能理解就别再劝了。', false, wrong('这会让拒绝变成“如果有办法就会答应”。')),
    opt(`下次吧，这次真的不行；以后有${c.request}这种事我再帮你。`, false, wrong('“下次”给了明确口子，对方下次会继续找你。')),
  ], note: '它重复决定，不增加新理由，减少被继续说服的入口。' }),
  c => ({ angle: '识别软拒绝', prompt: '下面哪句看似礼貌，其实最容易失败？', options: [
    opt('我再考虑一下吧，晚点如果能帮再给你消息。', true),
    opt(`这次我不能${c.request}。`, false, wrong('这是清楚拒绝。短句不是没礼貌，反而减少误会。')),
    opt('我理解你需要帮忙，但我这边不能接。', false, wrong('这句既承认需求，也清楚拒绝，是可用表达。')),
    opt(`${c.alternative}，但我不能做更多。`, false, wrong('有限替代是健康边界，不是软弱。')),
  ], note: '它提醒用户：延期不是拒绝，只会把压力留到下一轮。' }),
  c => ({ angle: '保留关系', prompt: '想保留关系，拒绝时重点放在哪里？', options: [
    opt(`态度温和，但边界明确：不攻击对方，只说明自己不能${c.request}。`, true),
    opt('多解释自己的难处，让对方知道你不是故意不帮他。', false, wrong('解释过多会变成求理解，也给对方留下说服入口。')),
    opt('先答应下来，之后找一个更合适的机会再取消。', false, wrong('这会破坏信任，也让你更被动。')),
    opt('用玩笑把这件事带过去，避免现场变得尴尬。', false, wrong('玩笑可以缓和气氛，但不能替代拒绝本身。')),
  ], note: '它把尊重对方和不牺牲自己同时做到。' }),
  c => ({ angle: '拒绝后内耗', prompt: '拒绝后你开始愧疚，最该提醒自己的是什么？', options: [
    opt(`我有权因为${c.reason}拒绝${c.request}，不需要把对方所有失落都背到自己身上。`, true),
    opt('只要对方不开心，就说明我拒绝得太狠，下次应该说得更软一点。', false, wrong('对方失望很正常，不等于你错了。')),
    opt('下次还是别拒绝了，省得关系尴尬，也省得自己内耗。', false, wrong('用顺从换来的不尴尬，会持续透支你。')),
    opt('我要把所有理由讲到对方完全认同为止，这样才不算伤人。', false, wrong('你不需要获得许可才拥有边界。')),
  ], note: '它把表达方式责任和对方情绪责任分开。' }),
];

const recoverCases = [
  { scene: '分开一个月后，对方看了你的朋友圈但没有点赞', contact: '朋友圈访问', old: '以前你太黏、太追问', change: '你开始稳定生活，不再围着对方转' },
  { scene: '你们因为频繁争吵分开，共同朋友生日局可能见面', contact: '线下重逢', old: '以前一见面就翻旧账', change: '你能平静打招呼，不抢着解释' },
  { scene: '你想为过去的冷处理道歉', contact: '道歉消息', old: '以前你习惯沉默逃避', change: '你能具体承认行为影响，而不是只说“我错了”' },
  { scene: '对方发来“最近还好吗”', contact: '试探问候', old: '以前你一有机会就表白求复合', change: '你能正常回应，不立刻索要关系' },
  { scene: '对方生日快到了，你很想发点什么', contact: '生日节点', old: '以前你用礼物换回应', change: '你能轻祝福，不制造情绪债' },
  { scene: '对方让你去取回落在她家的东西', contact: '物品交接', old: '以前你借任何机会拖延见面', change: '你能把交接处理干净，不借题发挥' },
  { scene: '你听共同朋友说她最近状态不好，很想关心', contact: '间接消息', old: '以前你过度介入她生活', change: '你能尊重边界，只提供低压力支持' },
  { scene: '对方问你“现在有人了吗”', contact: '关系试探', old: '以前你用嫉妒刺激她', change: '你能诚实但不表演行情' },
  { scene: '分手原因是你缺少规划，现在你确实做了改变', contact: '展示改变', old: '以前承诺很多但落地很少', change: '你有具体稳定的行动和结果' },
  { scene: '对方说“我们还是别联系了吧”', contact: '明确拒绝', old: '以前你越被拒绝越纠缠', change: '你能尊重拒绝并退出' },
];

const recoverBuilders = [
  c => ({ angle: '复联节奏', prompt: `面对这个${c.contact}，最稳的处理方式是？`, options: [
    opt(`轻量回应，不借${c.contact}立刻谈复合；用行动证明：${c.change}。`, true),
    opt('马上说自己还爱她，机会难得不能错过，不然可能再也没有窗口。', false, wrong('一有窗口就压上情绪，会让对方想起旧压力。')),
    opt('故意冷淡一点，让她感到失去你，这样她才会重新在意。', false, wrong('操作感太强，容易破坏刚恢复的信任。')),
    opt('发一大段复盘，证明自己已经想明白，也让她看到诚意。', false, wrong('长篇解释会把对方重新拖进过去的问题里。')),
  ], note: `它先修复“和你接触不累”的感觉，尤其旧问题是${c.old}时。` }),
  c => ({ angle: '有效道歉', prompt: '如果要道歉，哪种最有效？', options: [
    opt(`以前我${c.old.replace(/^以前你/, '')}，给你压力了。现在我${c.change.replace(/^你开始/, '开始').replace(/^你能/, '能').replace(/^你有/, '有')}，你不用急着回。`, true),
    opt('我真的错了，求你再相信我一次，这次我一定不会让你失望。', false, wrong('这是情绪请求，不是承担责任；对方会感到又被索取。')),
    opt('我们都有问题，但我愿意先低头，希望你也能看到自己的部分。', false, wrong('“我们都有问题”会稀释你的责任。')),
    opt('如果你也有不对的地方，我们能不能一起改，这样才公平。', false, wrong('在道歉里夹带对方责任，会让道歉失效。')),
  ], note: '它具体承认旧问题、说明影响、展示改变，并且不给对方立刻回应的压力。' }),
  c => ({ angle: '低压聊天', prompt: '重新有了几句聊天，哪种状态最加分？', options: [
    opt('像正常人一样轻松交流，有边界、有生活，不急着证明自己深情。', true),
    opt('不断回忆以前最甜的片段，唤醒她的感情，让她别忘了你们多好。', false, wrong('过去甜不代表现在安全，过度怀旧会显得你没走出来。')),
    opt('频繁关心她每个动态，让她知道你一直都在，没有真正离开。', false, wrong('这会重新制造被盯着的感觉。')),
    opt('把自己最近过得很惨说出来，让她知道失去她以后你有多难。', false, wrong('卖惨换来的不是爱，是负担和内疚。')),
  ], note: '它让对方感受到你变稳了，而不是更会施压了。' }),
  c => ({ angle: '展示改变', prompt: '怎样展示改变最可信？', options: [
    opt(`不急着宣布改变，而是在${c.contact}里自然体现：${c.change}。`, true),
    opt('发长文列出自己改了哪十点，让她知道你这次真的准备好了。', false, wrong('列清单像求验收，对方会有压力。')),
    opt('让共同朋友帮你转达你变好了，这样她更容易相信。', false, wrong('让别人传话容易显得算计，也把朋友卷进关系。')),
    opt('承诺以后再也不会让她失望，用足够坚定的话打消她顾虑。', false, wrong('“再也不会”太绝对，像空头支票。')),
  ], note: '它让改变被看见，而不是被推销。' }),
  c => ({ angle: '尊重拒绝', prompt: '如果对方暂时不想继续联系，最成熟的回应是？', options: [
    opt('我尊重你的决定。谢谢你把边界说清楚，我不会再继续打扰。', true),
    opt('你是不是还在惩罚我？我已经改了，至少给我一次证明机会。', false, wrong('把拒绝理解成惩罚，会让对方觉得你仍然以自我为中心。')),
    opt('那我等你，多久都等，反正我知道最后还是你最重要。', false, wrong('听起来深情，其实是把压力继续放在对方身上。')),
    opt('好吧，那祝你幸福，我再也不会相信爱情了。', false, wrong('情绪化告别仍是在索取反应，不是真尊重。')),
  ], note: '它把“不纠缠”真正做到，这本身就是改变的一部分。' }),
];

const specs = [
  ['ambiguous', '暧昧理解', 'L013', ambiguousCases, ambiguousBuilders],
  ['love', '热恋沟通', 'L019', loveCases, loveBuilders],
  ['redflag', '红旗识别', 'L027', redflagCases, redflagBuilders],
  ['emotion-catch', '情绪接住', 'L021', emotionCases, emotionBuilders],
  ['refuse', '拒绝练习', 'L025', refuseCases, refuseBuilders],
  ['recover', '挽回前任', 'L030', recoverCases, recoverBuilders],
];

function buildCategory(category, label, relatedLevelKid, cases, builders) {
  const questions = [];
  for (const [builderIndex, builder] of builders.entries()) {
    for (const [caseIndex, itemCase] of cases.entries()) {
      const built = builder(itemCase);
      const id = `q-${category}-${String(questions.length + 1).padStart(3, '0')}`;
      const distributedOptions = distributeAnswer(built.options, questions.length);
      const question = {
        id,
        category,
        difficulty: ((builderIndex + caseIndex) % 5) + 1,
        type: 'single',
        scenario: `${itemCase.scene}；${built.angle}`,
        prompt: `${built.prompt}\n当前情境：${itemCase.scene}\n训练角度：${built.angle}`,
        options: distributedOptions,
        overallExplain: makeOverall(category, built, distributedOptions),
        tags: [label, built.angle],
        relatedLevelKid,
        _context: contextName(itemCase),
        _built: built,
      };
      questions.push(question);
    }
  }
  return questions;
}

function validateGenerated(questions) {
  const errors = [];
  const scenarioSet = new Set();
  const promptSet = new Set();
  const optionTexts = new Set();
  const byCategory = new Map();
  const answerPositions = new Map();
  const banned = /我主要是想借|我就是顺口问|顺着雨天躲雨|句号后|不如趁这个话题|我不想一直围着|这样至少能早点知道她怎么想|让她看到你还在等|至少不能错过|这次先围绕|高分点|迷惑点|判断标准|它看似|它有礼貌|它能快速/;
  for (const question of questions) {
    byCategory.set(question.category, (byCategory.get(question.category) || 0) + 1);
    if (scenarioSet.has(question.scenario)) errors.push(`${question.id}: duplicate scenario`);
    scenarioSet.add(question.scenario);
    if (promptSet.has(question.prompt)) errors.push(`${question.id}: duplicate prompt`);
    promptSet.add(question.prompt);
    if (question.options.length !== 4) errors.push(`${question.id}: expected 4 options`);
    if (question.options.filter(option => option.isCorrect).length !== 1) errors.push(`${question.id}: expected one correct option`);
    const correctIndex = question.options.findIndex(option => option.isCorrect);
    if (!answerPositions.has(question.category)) answerPositions.set(question.category, [0, 0, 0, 0]);
    if (correctIndex >= 0) answerPositions.get(question.category)[correctIndex]++;
    if (!/^正确答案：[A-D]。/.test(question.overallExplain || '')) errors.push(`${question.id}: malformed overallExplain`);
    if (/选项拆解|[A-D]\s*[对错]：/.test(question.overallExplain || '')) errors.push(`${question.id}: option breakdown in overallExplain`);
    const lengths = question.options.map(option => textLen(option.text));
    const correctLen = lengths[correctIndex];
    const wrongLens = question.options.filter(option => !option.isCorrect).map(option => textLen(option.text));
    const maxLen = Math.max(...lengths);
    const minLen = Math.min(...lengths);
    const wrongMax = Math.max(...wrongLens);
    const wrongMin = Math.min(...wrongLens);
    if (maxLen / Math.max(1, minLen) >= 1.8 || maxLen - minLen >= 35) errors.push(`${question.id}: option length spread too wide (${minLen}-${maxLen})`);
    if (correctLen - wrongMax >= 12 || correctLen / Math.max(1, wrongMax) >= 1.25) errors.push(`${question.id}: correct length leaks (${correctLen} vs ${wrongMax})`);
    if (wrongMin - correctLen >= 12 || wrongMin / Math.max(1, correctLen) >= 1.25) errors.push(`${question.id}: correct too short (${correctLen} vs ${wrongMin})`);
    for (const option of question.options) {
      if (banned.test(option.text)) errors.push(`${question.id}: banned text in option: ${option.text}`);
      if (option.isCorrect && option.explain) errors.push(`${question.id}: correct explain should be empty`);
      if (!option.isCorrect && textLen(option.explain) < 16) errors.push(`${question.id}: weak wrong explain`);
      if (optionTexts.has(option.text)) errors.push(`${question.id}: duplicate option text: ${option.text}`);
      optionTexts.add(option.text);
    }
  }
  for (const category of TARGET_CATEGORIES) {
    const count = byCategory.get(category) || 0;
    if (count !== 50) errors.push(`${category}: expected 50, got ${count}`);
    const counts = answerPositions.get(category) || [0, 0, 0, 0];
    if (Math.max(...counts) - Math.min(...counts) > 1) errors.push(`${category}: answer distribution uneven ${JSON.stringify(counts)}`);
  }
  if (questions.length !== 300) errors.push(`expected 300 generated questions, got ${questions.length}`);
  if (errors.length) throw new Error(errors.slice(0, 100).join('\n'));
}

function main() {
  const { bank, tail } = loadBank();
  const generated = polishGenerated(specs.flatMap(args => buildCategory(...args)));
  validateGenerated(generated);
  const byCategory = new Map(specs.map(([category]) => [category, []]));
  for (const question of generated) byCategory.get(question.category).push(question);
  const indexes = new Map(specs.map(([category]) => [category, 0]));
  const updated = bank.map(question => {
    if (!TARGET_CATEGORIES.includes(question.category)) return question;
    const index = indexes.get(question.category);
    indexes.set(question.category, index + 1);
    const replacement = byCategory.get(question.category)[index];
    if (!replacement) throw new Error(`missing replacement for ${question.category} at ${index}`);
    return replacement;
  });
  for (const category of TARGET_CATEGORIES) {
    if (indexes.get(category) !== 50) throw new Error(`replaced ${indexes.get(category)} for ${category}, expected 50`);
  }
  const source = [
    '/**',
    ' * FoxSay 微练习题库',
    ' * 8 大主题 x 50 题；反 PUA 与破冰搭讪保留，其他六模块按生活化标准重写。',
    ' */',
    '',
    "import type { Question } from '../services/quiz';",
    '',
    `export const QUIZ_BANK: Question[] = ${JSON.stringify(updated, null, 2)};`,
    '',
    tail.trimStart(),
  ].join('\n');
  fs.writeFileSync(BANK_PATH, source, 'utf8');
  console.log('SIX_MODULES_V6_REWRITTEN');
  console.log('TOTAL_REPLACED=300');
  console.log('WROTE=' + BANK_PATH);
}

main();