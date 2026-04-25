const fs = require('fs');
const path = require('path');

const BANK_PATH = path.join(__dirname, '..', 'src', 'data', 'quizBank.ts');
const MARKER = 'export const QUIZ_BANK: Question[] = ';
const END_MARKER = ';\n\nexport function getQuestionById';
const LETTERS = ['A', 'B', 'C', 'D'];

function opt(text, isCorrect, explain = '') {
  let finalExplain = isCorrect ? '' : explain;
  if (!isCorrect && len(finalExplain) < 18) {
    finalExplain = `${finalExplain}这不是本题要训练的关键动作。`;
  }
  return { text, isCorrect, explain: finalExplain };
}

function hash(input) {
  let value = 2166136261;
  for (let i = 0; i < input.length; i++) {
    value ^= input.charCodeAt(i);
    value = Math.imul(value, 16777619) >>> 0;
  }
  return value || 1;
}

function shuffle(items, seedText) {
  const arr = [...items];
  let seed = hash(seedText);
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rand() % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function len(text) {
  return Array.from(String(text || '').replace(/\s+/g, '')).length;
}

function loadBank() {
  const source = fs.readFileSync(BANK_PATH, 'utf8');
  const start = source.indexOf(MARKER);
  if (start < 0) throw new Error('QUIZ_BANK marker not found');
  const jsonStart = start + MARKER.length;
  const end = source.indexOf(END_MARKER, jsonStart);
  if (end < 0) throw new Error('QUIZ_BANK end marker not found');
  return {
    bank: JSON.parse(source.slice(jsonStart, end)),
    tail: source.slice(end + 2),
  };
}

function wrong(reason) {
  return `❌ ${reason}`;
}

const lessonByCategory = {
  icebreak: '这题练的是“低压力打开”。真正好的破冰不是把对方拉进你的目的里，而是从眼前共同场景切一个轻话题，让对方好接、好退、好继续。',
  ambiguous: '这题练的是暧昧里的力度感。高分回应会接住对方释放的温度，但不会马上逼关系定义，也不会用冷处理测试对方。',
  love: '这题练的是亲密关系里的修复表达。正确答案会把事实、感受、需求和一个能执行的小请求说清楚，而不是把问题推成爱不爱的大审判。',
  redflag: '这题练的是看行为模式。红旗不是看对方嘴上说多爱你，而是看他的行为有没有压缩你的自由、社交、隐私、身体边界或财务边界。',
  'emotion-catch': '这题练的是先接情绪，再处理事情。人在情绪里时，最先需要被看见和被站在同一边；方案要等对方有余力接住。',
  refuse: '这题练的是温和但清楚地说不。高分拒绝通常是：明确拒绝、简短原因、有限替代，不把边界说成亏欠，也不留继续推进的口子。',
  recover: '这题练的是复联里的低压感。真正的挽回不是用深情和复盘压回关系，而是让对方重新觉得和你接触安全、轻松、有空间。',
};

function makeOverall(category, correctLetter, correctText, note) {
  return `正确答案：${correctLetter}。${lessonByCategory[category]} 放到这道题里，最稳的是“${correctText}”${hasSentenceEnd(correctText) ? '' : '。'}${note}`;
}

function hasSentenceEnd(text) {
  return /[。！？!?][”"']?$/.test(String(text));
}

const wrongTailsByCategory = {
  icebreak: [
    '我就是想认识你一下，没有别的意思。',
    '我怕不直接一点就没机会了。',
    '你要是方便的话，我们可以多说两句。',
    '我有点不知道怎么绕，就直说了。',
  ],
  ambiguous: [
    '早点说开反而不用一直猜来猜去。',
    '暧昧本来就要有一点来回拉扯。',
    '如果她在意你，应该会继续给反应。',
    '不然一直轻轻带过也很难推进。',
  ],
  love: [
    '不把话说重点，对方可能根本意识不到。',
    '我也想知道你心里到底怎么想。',
    '这次我不想再假装自己没事。',
    '我希望你能先看见我的委屈。',
  ],
  redflag: [
    '先别把事情想得太严重，观察一下也行。',
    '亲密关系里有点占有欲也很正常。',
    '如果直接硬碰硬，也许更快看清态度。',
    '他可能只是安全感不太够。',
  ],
  'emotion-catch': [
    '先把问题解决掉，她应该会轻松一点。',
    '说得理性一点，反而能帮她稳住。',
    '换个话题也许能让气氛轻一点。',
    '先给方向，她才不会一直困在里面。',
  ],
  refuse: [
    '我不想让你觉得我完全不帮你。',
    '要不我晚点再给你一个准话。',
    '我怕拒绝太直接会伤关系。',
    '我可以再想想有没有别的办法。',
  ],
  recover: [
    '至少不能错过这次难得的窗口。',
    '让她看到你还在等，也许会心软。',
    '先把情绪铺出来，她才知道你还在乎。',
    '不主动一点，很可能就彻底没机会了。',
  ],
};

const correctTailsByCategory = {
  icebreak: ['我就是顺口问一句，不耽误你。', '你不方便的话也完全没关系。'],
  ambiguous: ['我先顺着聊，不急着下结论。', '这样有回应，也不会太压迫。'],
  love: [
    '我想解决问题，不是跟你分输赢。',
    '我希望下一次能有具体变化。',
    '这句话先把我的感受放出来，也给对方一个能做到的方向。',
    '我会把话说具体一点，不让对方只能猜我的情绪。',
    '这样讲不会把关系推到审判台上。',
  ],
  redflag: [
    '这条边界我会先放在这里。',
    '后面要看对方是否真的尊重。',
    '如果对方继续推进，我会优先保护自己。',
    '这不是小题大做，而是在看底线有没有被尊重。',
  ],
  'emotion-catch': [
    '你不用马上整理好，我先听你说。',
    '现在不用急着变好。',
    '我会先陪着你，不急着把事情讲明白。',
    '等你缓一点，我们再看下一步怎么办。',
  ],
  refuse: ['我能做的就到这里。', '这个决定不会因为多劝几句改变。'],
  recover: [
    '你不用马上回应。',
    '我会尊重你的节奏。',
    '这次我先把压力降下来，不急着要结果。',
    '我会用稳定行动慢慢证明，而不是靠一段话催你回来。',
    '如果你不想继续聊，我也会停在这里。',
  ],
};

function appendTail(option, category, qid, round) {
  const pool = option.isCorrect ? correctTailsByCategory[category] : wrongTailsByCategory[category];
  if (!pool || !pool.length) return option;
  const start = (qid.length + round) % pool.length;
  for (let offset = 0; offset < pool.length; offset++) {
    const tail = pool[(start + offset) % pool.length];
    if (!option.text.includes(tail)) {
      const separator = hasSentenceEnd(option.text) ? '' : '。';
      return { ...option, text: `${option.text}${separator}${tail}` };
    }
  }
  // If every available tail is already present, keep the option as-is to avoid repeated sentences.
  return option;
}

function balanceOptions(question) {
  let options = question.options.map(option => ({ ...option }));
  for (let round = 0; round < 16; round++) {
    const lengths = options.map(option => len(option.text));
    const correctIndex = options.findIndex(option => option.isCorrect);
    const correctLen = lengths[correctIndex];
    const wrongIndexes = options.map((option, index) => option.isCorrect ? -1 : index).filter(index => index >= 0);
    const wrongLens = wrongIndexes.map(index => lengths[index]);
    const maxLen = Math.max(...lengths);
    const minLen = Math.min(...lengths);
    const wrongMax = Math.max(...wrongLens);
    const wrongMin = Math.min(...wrongLens);
    const correctUniqueLongest = correctLen === maxLen && lengths.filter(length => length === maxLen).length === 1;
    const tooWide = maxLen - minLen >= 35 || maxLen / Math.max(1, minLen) >= 1.8;
    const correctLeaks = correctLen - wrongMax >= 12 || correctLen / Math.max(1, wrongMax) >= 1.25;
    const correctTooShort = wrongMin - correctLen >= 12 || wrongMin / Math.max(1, correctLen) >= 1.25;
    if (!tooWide && !correctLeaks && !correctTooShort && !correctUniqueLongest) break;

    let targetIndex = lengths.indexOf(minLen);
    if (correctUniqueLongest || correctLeaks) {
      targetIndex = wrongIndexes[wrongLens.indexOf(wrongMin)];
    } else if (correctTooShort) {
      targetIndex = correctIndex;
    }
    options[targetIndex] = appendTail(options[targetIndex], question.category, question.id, round);
  }
  return { ...question, options };
}

function stageScene(scene, angle) {
  const stageMap = {
    '上前第一句': '你还没开口，正在判断第一句话怎么说',
    '对方回了一句后的接话': '对方已经礼貌回应了一句，你准备继续接话',
    '聊了两分钟后的收尾': '你们短聊了两分钟，气氛还可以，准备自然收尾',
    '刚加微信第一句': '你们刚加上微信，你准备发第一条消息',
    '对方回复很慢': '她隔了几个小时才回，你准备把聊天接回来',
    '判断信号': '你先判断这句话到底算什么信号',
    '怎么回': '你准备回复这句话，但不想显得上头',
    '推进一步': '你想让互动往前走一点，但不想给压力',
    '避开误读': '你在复盘自己最容易误读的地方',
    '保持节奏': '你想保持吸引力，也不想被对方节奏牵着走',
    '表达需求': '你想把委屈说成对方听得懂的需求',
    '冲突降温': '争执开始升温，你想把话题拉回修复',
    '具体请求': '你准备提出一个对方真的能执行的小请求',
    '识别真正伤点': '你在复盘这件事真正伤到你的地方',
    '谈完后的修复': '你们已经谈完一次，你想避免下次重演',
    '风险命名': '你先给这件事的风险准确命名',
    '边界表达': '你准备回应对方，同时把边界说清楚',
    '安全动作': '你不想继续争辩，先决定下一步安全动作',
    '识别合理化': '你发现自己正在替对方找理由',
    '模式判断': '类似情况已经不止一次出现，你开始看模式',
    '第一回应': '对方情绪刚出来，你准备回第一句',
    '共情复述': '你想确认自己有没有真的听懂对方',
    '给建议的时机': '你想帮忙，但不确定现在能不能给建议',
    '二次伤害': '你在判断哪句话会让对方更受伤',
    '后续陪伴': '聊完过了一会儿，你想做一个后续确认',
    '第一次拒绝': '你第一次把拒绝说出口',
    '对方继续劝': '对方没有停，还在劝你再答应一次',
    '识别软拒绝': '你在判断哪句看似礼貌其实会失败',
    '保留关系': '你想保留关系，但不想牺牲边界',
    '拒绝后内耗': '拒绝后你开始愧疚，想稳住自己',
    '复联节奏': '你先判断这个窗口该不该接、怎么接',
    '有效道歉': '你准备为过去的问题道歉',
    '低压聊天': '你们重新有了几句聊天，你想保持低压',
    '展示改变': '你想让改变被看见，但不想像推销自己',
    '尊重拒绝': '对方暂时不想继续联系，你要回应这个边界',
  };
  return `${scene}；${stageMap[angle] || angle}`;
}

function sceneHint(question) {
  return String(question.scenario || question.prompt || question.id)
    .replace(/[“”"']/g, '')
    .split(/[，。；:：\n]/)[0]
    .slice(0, 16);
}

function placeHint(question) {
  const scene = String(question.scenario || '');
  if (/咖啡店/.test(scene)) return '咖啡店';
  if (/书店/.test(scene)) return '书店';
  if (/生日局/.test(scene)) return '生日局';
  if (/健身房/.test(scene)) return '健身房';
  if (/展览/.test(scene)) return '展览现场';
  if (/Livehouse/.test(scene)) return 'Livehouse';
  if (/微信群|微信/.test(scene)) return '微信';
  if (/共享办公/.test(scene)) return '共享办公区';
  if (/羽毛球/.test(scene)) return '球局';
  if (/便利店/.test(scene)) return '便利店门口';
  return sceneHint(question);
}

function duplicateVariant(question, text, occurrence, isCorrect) {
  const hint = placeHint(question) || '这里';
  if (isCorrect) {
    const tails = correctTailsByCategory[question.category] || correctTailsByCategory.icebreak;
    const localTail = occurrence >= tails.length ? `这次就按${hint}这个窗口轻轻处理。` : '';
    return addUniqueTextTail(text, tails, occurrence, localTail);
  }
  if (/气质挺特别/.test(text)) {
    if (hint === '微信') return '看你头像感觉挺有意思的，可以认识一下吗？';
    return `刚才在${hint}看到你，感觉你气质挺特别的，可以认识一下吗？`;
  }
  if (/你一个人吗/.test(text)) {
    if (hint === '微信') return '你现在方便聊两句吗？我刚看到你头像挺有意思。';
    return `你也是自己来${hint}的吗？方便聊两句吗？`;
  }
  if (/经常被人搭讪/.test(text)) return `在${hint}这种地方，你是不是经常被人搭话？`;
  if (/还挺有缘/.test(text)) return `能在${hint}碰到同一个话题，还挺有缘的吧。`;
  if (/平时都喜欢什么/.test(text)) return `那你平时在${hint}这类事情上都喜欢什么？可以多说点吗？`;
  if (/终于加上你了/.test(text)) {
    const variants = hint === '微信'
      ? ['终于加上你了，刚才在群里就觉得你挺特别。', '终于加上你了，刚才看你头像就觉得挺有记忆点。', '终于加上你了，刚才朋友介绍时我就想多聊两句。']
      : [`终于加上你了，刚才在${hint}就觉得你挺特别。`, `终于加上你了，刚才在${hint}那会儿就想多聊两句。`, `终于加上你了，刚才${hint}那段还挺有意思。`];
    return variants[occurrence % variants.length];
  }
  if (/你到家了吗/.test(text)) {
    const variants = [`你到家了吗？刚从${hint}认识，我也想先确认你安全。`, `你到家了吗？虽然刚认识，但我还是想问一句。`, `你到家了吗？我觉得关心一下也不算冒昧吧。`, `你到家了吗？刚加上微信，我想先问个安心。`, `你到家了吗？如果不方便回也没关系。`];
    return variants[occurrence % variants.length];
  }
  if (/发张自拍看看/.test(text)) {
    const variants = [`发张自拍看看？我怕把${hint}那位认错了。`, '发张自拍看看？不然我怕下次见面认不出来。', '发张自拍看看？我确认一下是不是本人。', '发张自拍看看？刚加微信我有点对不上。', '发张自拍看看？这样聊天比较有画面。'];
    return variants[occurrence % variants.length];
  }
  if (/你怎么现在才回/.test(text)) return `你怎么现在才回啊，我还以为${hint}那会儿你就不想理我了。`;
  if (/你别转移话题/.test(text)) {
    const variants = ['你别转移话题，今天必须给我一个说法。你总不能一直让我猜。', '你别转移话题，我现在就想听你把话讲清楚。', '你别转移话题，这件事不说清楚我过不去。'];
    return variants[occurrence % variants.length];
  }
  if (/边界被拒绝后/.test(text)) {
    const variants = ['“边界被拒绝后，我需要重新评估关系。”先别想太重，也许对方只是不会表达。', '“边界被拒绝后，我需要重新评估关系。”亲密关系里有点占有欲也正常。', '“边界被拒绝后，我需要重新评估关系。”再观察一下，不一定要马上下判断。', '“边界被拒绝后，我需要重新评估关系。”也可能只是这次沟通方式不太好。', '“边界被拒绝后，我需要重新评估关系。”先顺着一点，关系稳定后再说。'];
    return variants[occurrence % variants.length];
  }
  if (/我尊重你的决定/.test(text)) return `我尊重你的决定。你在${hint}这件事上把边界说清楚了，我不会再继续打扰。`;
  const tails = wrongTailsByCategory[question.category] || wrongTailsByCategory.icebreak;
  const localTail = occurrence >= tails.length ? `就拿${hint}这次来说也是这样。` : '';
  return addUniqueTextTail(text, tails, occurrence, localTail);
}

function addUniqueTextTail(text, tails, startIndex, fallbackTail = '') {
  let result = text;
  for (let offset = 0; offset < tails.length; offset++) {
    const tail = tails[(startIndex + offset) % tails.length];
    if (!result.includes(tail)) {
      result = `${result}${hasSentenceEnd(result) ? '' : '。'}${tail}`;
      break;
    }
  }
  if (fallbackTail && !result.includes(fallbackTail)) {
    result = `${result}${hasSentenceEnd(result) ? '' : '。'}${fallbackTail}`;
  }
  return result;
}

function uniquifyOptions(bank) {
  const seen = new Map();
  return bank.map(question => {
    const options = question.options.map(option => {
      const count = seen.get(option.text) || 0;
      seen.set(option.text, count + 1);
      if (question.category === 'anti-pua' || count === 0) return option;
      return { ...option, text: duplicateVariant(question, option.text, count, option.isCorrect) };
    });
    return { ...question, options };
  });
}

function finalizeQuestion(question) {
  if (question.category === 'anti-pua') return question;
  const correctIndex = question.options.findIndex(option => option.isCorrect);
  const correct = question.options[correctIndex];
  const { _note, ...cleanQuestion } = question;
  return {
    ...cleanQuestion,
    overallExplain: makeOverall(question.category, LETTERS[correctIndex], correct.text, _note || ''),
  };
}

function resolveExactRepeats(bank) {
  const seen = new Map();
  return bank.map(question => {
    const options = question.options.map(option => {
      const count = seen.get(option.text) || 0;
      seen.set(option.text, count + 1);
      if (question.category === 'anti-pua' || count < 2) return option;
      return { ...option, text: lightlyVariantText(option.text, count, question) };
    });
    return { ...question, options };
  });
}

function lightlyVariantText(text, occurrence, question) {
  const hint = placeHint(question) || '这件事';
  if (/你到家了吗？虽然刚认识/.test(text)) {
    return occurrence % 2 === 0 ? '你到家了吗？我们刚认识，我还是想问一句。' : '你到家了吗？刚加微信，我还是忍不住问一下。';
  }
  if (/边界被拒绝后/.test(text)) {
    return occurrence % 2 === 0
      ? '“边界不被尊重后，我需要重新评估关系。”亲密关系里有点占有欲也正常。'
      : '“边界被拒绝后，我需要重新想想关系。”再观察一下，不一定要马上下判断。';
  }
  const replacements = [
    ['这次', '这回'],
    ['以后', '之后'],
    ['真的', '确实'],
    ['应该', '大概会'],
    ['马上', '立刻'],
    ['一直', '总是'],
    ['对方', 'TA'],
    ['我想', '我会想'],
  ];
  for (let offset = 0; offset < replacements.length; offset++) {
    const [from, to] = replacements[(occurrence + offset) % replacements.length];
    if (text.includes(from)) return text.replace(from, to);
  }
  return `${text}${hasSentenceEnd(text) ? '' : '。'}按${hint}这次来说。`;
}

const icebreakCases = [
  { scene: '咖啡店排队，你前面的人点了一杯你没喝过的豆子，店员也在推荐同款', hook: '那杯豆子', topic: '咖啡口味', detail: '你平时也会试新豆子', contact: '咖啡清单' },
  { scene: '书店旅行区，你们先后拿起同一本小众旅行随笔，她翻到你刚看过的那页', hook: '这本旅行随笔', topic: '旅行书', detail: '你也在找轻一点的周末读物', contact: '书单' },
  { scene: '朋友生日局，她坐在餐桌边看大家玩桌游，手里一直拿着气泡水', hook: '这局桌游', topic: '朋友局', detail: '你也刚认识这桌人', contact: '下次局' },
  { scene: '健身房拉伸区，你发现她也在照着同一个训练视频做动作', hook: '这个训练视频', topic: '健身入门', detail: '你最近也在练肩颈放松', contact: '训练视频' },
  { scene: '展览现场，她在一张夜景照片前停了很久，你也刚好喜欢那张', hook: '这张夜景照片', topic: '展览', detail: '你刚才也在这张前面停了很久', contact: '展览推荐' },
  { scene: 'Livehouse 散场，你们都在周边摊前看同一款帆布袋', hook: '这个帆布袋', topic: '乐队周边', detail: '你也刚被今晚的安可打到', contact: '歌单' },
  { scene: '朋友把你们拉进同一个微信群，刚加微信后你看到她头像是一只橘猫', hook: '你头像里的橘猫', topic: '刚加微信', detail: '你也养过猫，知道猫很难拍清楚', contact: '猫片' },
  { scene: '共享办公区，她找插座找了半天，你旁边刚好空出一个位置', hook: '这个插座位', topic: '临时办公', detail: '你刚才也为了插座绕了一圈', contact: '附近办公点' },
  { scene: '羽毛球新手局换场休息，你们刚被分到同一组，她笑着说自己接球老慢半拍', hook: '刚才那几个球', topic: '运动局', detail: '你也不是高手，只是来出汗', contact: '下次球局' },
  { scene: '雨天便利店门口，你们都在等雨小一点，她手里拿着同款热饮', hook: '这杯热饮', topic: '雨天等雨', detail: '你也是临时躲雨进来的', contact: '附近小店' },
];

function icebreakOpenLine(c) {
  if (/橘猫/.test(c.hook)) return '你头像里这只橘猫是你养的吗？看起来像很会拆家的类型。';
  if (/插座/.test(c.hook)) return '我旁边这个位置有插座，如果你需要可以坐这边。';
  if (/几个球/.test(c.hook)) return '刚才那几个球你接得挺拼的，我也是来出汗的。';
  if (/热饮/.test(c.hook)) return '你也拿了这杯热饮啊，我刚才还在纠结要不要换这个口味。';
  if (/桌游/.test(c.hook)) return '我刚才也看这局看懵了，你知道他们现在玩到哪一步了吗？';
  if (/帆布袋/.test(c.hook)) return '这个帆布袋我也看了好久，你觉得这个图案会不会太高调？';
  if (/夜景照片/.test(c.hook)) return '这张夜景照片我也停了很久，你是被颜色吸引到的吗？';
  return `我刚才也在看${c.hook}，能问一句你怎么选的吗？我有点纠结。`;
}

function icebreakWechatLine(c) {
  if (/橘猫/.test(c.hook)) return '我是刚刚群里新加你的那个。你头像这只橘猫太有存在感了，是你家的吗？';
  if (/插座/.test(c.hook)) return '我是刚才共享办公区旁边那个。你后来找到合适插座位了吗？';
  if (/热饮/.test(c.hook)) return '我是刚才便利店门口一起等雨那个。后来雨小了吗？';
  return `刚才${c.hook}的话题还挺有意思，我是刚刚和你聊${c.topic}的那个。`;
}

function icebreakObservedLine(c) {
  if (/橘猫/.test(c.hook)) return '我看你头像有一会儿了，感觉你挺会拍猫的。';
  if (/插座/.test(c.hook)) return '我观察你找插座有一会儿了，感觉你挺会挑位置的。';
  return `我观察你有一会儿了，感觉你挺懂${c.topic}的。`;
}

const icebreakBuilders = [
  c => ({
    angle: '上前第一句',
    prompt: `想上前搭一句话，哪句最自然？\n当前情境：${c.scene}`,
    options: [
      opt(icebreakOpenLine(c), true),
      opt('你好，我觉得你气质挺特别的，可以认识一下吗？', false, wrong('第一句就把目的打满，对方会先判断你是不是来搭讪，而不是顺着场景聊天。')),
      opt('你一个人吗？方便聊两句吗？', false, wrong('问题太直接，也没有共同话题垫底，陌生场景里容易让人警觉。')),
      opt(icebreakObservedLine(c), false, wrong('“观察你有一会儿”会让人不舒服，重点应放在共同物件，不是盯着对方。')),
    ],
    note: `它对的地方是从${c.hook}切入，轻、具体、好接，也给对方保留退出空间。`,
  }),
  c => ({
    angle: '对方回了一句后的接话',
    prompt: `她简单回了你一句，你下一句怎么接，最不像硬聊？\n当前情境：${c.scene}`,
    options: [
      opt(`原来如此。我也在试着找适合自己的${c.topic}，你刚才这个选择还挺有参考感。`, true),
      opt('那你平时都喜欢什么？可以多说点吗？', false, wrong('范围太大，刚破冰就像查户口，对方需要额外组织答案。')),
      opt('哈哈，我们还挺有缘的吧。', false, wrong('上升太快，容易让轻松聊天变成关系暗示。')),
      opt('你是不是经常被人搭讪？', false, wrong('把焦点转到对方魅力和搭讪本身，会让对方开始防备。')),
    ],
    note: `它对的地方是顺着对方回答轻轻延展，不急着展示自己，也不突然把话题扩大。`,
  }),
  c => ({
    angle: '聊了两分钟后的收尾',
    prompt: `聊了两三分钟，她状态还不错，你想自然收尾并留下后续，哪句最好？\n当前情境：${c.scene}`,
    options: [
      opt(`我不耽误你了。今天聊${c.topic}还挺有意思，如果你愿意，我们可以之后交换一下${c.contact}。`, true),
      opt('那加个微信吧，我觉得我们挺聊得来的。', false, wrong('直接要联系方式但缺少后续理由，对方会觉得刚才聊天只是铺垫。')),
      opt('你要不把微信给我？我回头找你。', false, wrong('语气像索取，主动权和安全感都不够。')),
      opt('我还想继续跟你聊一会儿，可以吗？', false, wrong('把继续聊天的压力丢给对方，她要负责拒绝你。')),
    ],
    note: `它对的地方是先结束打扰，再给一个和${c.topic}相关的具体后续理由。`,
  }),
  c => ({
    angle: '刚加微信第一句',
    prompt: `刚加上微信，第一条消息怎么发比较自然？\n当前情境：${c.scene}`,
    options: [
      opt(icebreakWechatLine(c), true),
      opt('终于加上你了，刚才就觉得你很特别。', false, wrong('情绪浓度太高，刚加微信就像表白，会让对方有压力。')),
      opt('你到家了吗？', false, wrong('如果不是已经很熟，这句关心会显得关系越级。')),
      opt('发张自拍看看？我怕认错人。', false, wrong('刚加微信就要照片，很容易冒犯。')),
    ],
    note: `它对的地方是帮对方快速定位你是谁，并把话题落回刚才真实发生的互动。`,
  }),
  c => ({
    angle: '对方回复很慢',
    prompt: `刚加微信后她隔了几个小时才回，你怎么接最不尴尬？\n当前情境：${c.scene}`,
    options: [
      opt(`没事，我也刚忙完。刚才聊到${c.topic}，我后来还真去看了一下。`, true),
      opt('你怎么现在才回啊，我还以为你不想理我。', false, wrong('把对方放到解释位置，刚认识就制造负担。')),
      opt('没关系，你忙你的，我不打扰了。', false, wrong('太快退场，像受伤式客气，话题也断了。')),
      opt('哈哈你是不是忘了我是谁？', false, wrong('虽然想缓和，但容易让对方尴尬，还把压力放到她身上。')),
    ],
    note: '它对的地方是不给对方迟回压力，同时自然把聊天接回共同话题。',
  }),
];

const ambiguousCases = [
  { scene: '她晚上发来“今天加班到现在，楼下便利店都快关了”', signal: '深夜分享状态', warmth: '一点陪伴感', next: '顺手推荐夜宵或聊两句近况' },
  { scene: '她连续两天给你朋友圈点赞，今天还评论“你最近挺会生活啊”', signal: '社交媒体互动变多', warmth: '轻调侃', next: '顺着调侃聊生活方式' },
  { scene: '你说周末可能去看展，她问“一个人去吗？”', signal: '试探你的空档', warmth: '潜在邀约窗口', next: '给一个低压力同行选项' },
  { scene: '她发来一首歌，说“这首前奏很像昨晚的心情”', signal: '分享私人情绪', warmth: '情绪交换', next: '先接感受，不急着解读歌词' },
  { scene: '她说“你是不是对谁都这么会接话？”后面跟了一个笑脸', signal: '半吃醋半测试', warmth: '想确认独特感', next: '轻轻回应她的特别感' },
  { scene: '她拍了今天的穿搭问你“这身会不会太正式？”', signal: '主动让你参与判断', warmth: '轻微展示自己', next: '具体夸一个细节再给判断' },
  { scene: '散场时她放慢脚步，问你“你往哪边走？”', signal: '制造同行机会', warmth: '线下靠近', next: '自然提出走一段' },
  { scene: '她隔了很久才回：“刚洗完澡，看到消息了”', signal: '补偿式解释', warmth: '在意你的感受', next: '不追问迟回，轻松接住' },
  { scene: '她记得你上次说胃不好，今天问你“你吃晚饭了吗？”', signal: '记住细节', warmth: '照顾感', next: '接住关心并轻轻回馈' },
  { scene: '她说“跟你聊天还挺放松的，不用一直想怎么回”', signal: '舒适感确认', warmth: '安全感', next: '承认舒服但不立刻表白' },
];

const ambiguousBuilders = [
  c => ({
    angle: '判断信号',
    prompt: `这个信号怎么理解最稳？\n当前情境：${c.scene}`,
    options: [
      opt(`这是${c.signal}，说明有${c.warmth}，可以顺势接，但还不能当成确定喜欢。`, true),
      opt('她已经很明显喜欢你了，应该马上把关系说清楚。', false, wrong('把信号当承诺，推进太猛会让轻松感消失。')),
      opt('这只是普通聊天，别回太认真。', false, wrong('完全压低信号会错过窗口，也会让对方觉得你接不住。')),
      opt('她是在测试你，先冷一点看她会不会更主动。', false, wrong('故意冷不是松弛，是博弈，会损害真实好感。')),
    ],
    note: `它对的地方是把${c.signal}看成窗口，而不是把窗口误判成承诺。`,
  }),
  c => ({
    angle: '怎么回',
    prompt: `怎么回复既有温度，又不显得上头？\n当前情境：${c.scene}`,
    options: [
      opt(`那我就认真接一下这个信号了。${c.next}，但先不把话说太满。`, true),
      opt('所以你是不是有点喜欢我？你直接说就行。', false, wrong('逼问确定性会把暧昧变成审问。')),
      opt('哈哈别这样，我会当真的。', false, wrong('看似玩笑，其实把自己的在意暴露太满，容易让对方后撤。')),
      opt('你别撩我，我这个人很容易认真。', false, wrong('把压力丢给对方，等于让她为你的上头负责。')),
    ],
    note: '它对的地方是接住温度，但仍然保留轻松和回旋。',
  }),
  c => ({
    angle: '推进一步',
    prompt: `想把关系往前推一点，下一步最合适的是？\n当前情境：${c.scene}`,
    options: [
      opt(`给一个具体但可拒绝的小邀请，比如围绕这件事约一次轻松见面。`, true),
      opt('趁热打铁，今晚就约出来，不然窗口就没了。', false, wrong('太急会像抓机会，而不是尊重对方节奏。')),
      opt('先晾她两天，让她更在意你的反应。', false, wrong('用冷处理制造波动，会把暧昧变成操控。')),
      opt('写一段长消息告诉她你其实已经动心了。', false, wrong('情绪浓度过高，会压垮当前轻松窗口。')),
    ],
    note: '它对的地方是把暧昧落成低压力相处，而不是立刻要关系结果。',
  }),
  c => ({
    angle: '避开误读',
    prompt: `这里最容易踩的坑是什么？\n当前情境：${c.scene}`,
    options: [
      opt(`把${c.signal}直接当成“她已经认定你”，然后一下子加码太多。`, true),
      opt('轻轻接住她的话，再看她后续怎么回。', false, wrong('这不是坑，这是暧昧期比较稳的处理方式。')),
      opt('给对方一个可拒绝的小提议。', false, wrong('可拒绝的小提议能降低压力，反而是好的推进。')),
      opt('不急着把关系定义说死。', false, wrong('不急着定义是分寸感，不是逃避。')),
    ],
    note: `它对的地方是提醒用户：${c.signal}只是一个互动窗口，不能被焦虑放大。`,
  }),
  c => ({
    angle: '保持节奏',
    prompt: `怎么做最能保持吸引力和松弛感？\n当前情境：${c.scene}`,
    options: [
      opt(`回应她给出的${c.warmth}，但继续过自己的节奏，不把全部情绪押在她下一句。`, true),
      opt('立刻让她知道你已经很喜欢她，这样她才有安全感。', false, wrong('过早交底会让关系失衡，也容易给对方压力。')),
      opt('发朋友圈刺激她，让她吃点醋。', false, wrong('刺激嫉妒只能制造波动，不会制造稳定吸引。')),
      opt('把每句话都分析到确定没风险再回。', false, wrong('过度斟酌会让聊天失去自然感。')),
    ],
    note: '它对的地方是让喜欢和自我节奏同时存在，不靠对方反应决定自己的状态。',
  }),
];

const loveCases = [
  { scene: '对方最近经常隔很久才回消息，但每次都说“刚才太忙了”', issue: '回复变少', feeling: '有点被放在一边', need: '被惦记', ask: '忙的时候简单说一声状态' },
  { scene: '你提前说过很在意纪念日，对方当天还是完全忘了', issue: '忘记纪念日', feeling: '失落', need: '被重视', ask: '重要日子提前一起确认安排' },
  { scene: '你连续几天做饭收拾，对方像默认这是你应该做的', issue: '付出没被看见', feeling: '委屈', need: '被认可', ask: '看到对方做事时给一句确认' },
  { scene: '对方和异性朋友单独吃饭，事后你从朋友圈才看到', issue: '敏感场合没有提前说', feeling: '不安', need: '透明感', ask: '类似场合提前说一声' },
  { scene: '你们因为旅行预算吵起来，对方觉得你扫兴，你觉得他冲动', issue: '花钱标准不同', feeling: '没被一起商量', need: '共同规则', ask: '大额支出前先定预算' },
  { scene: '你想下班后聊一会儿，对方只想自己打游戏放空', issue: '恢复方式不同', feeling: '被冷落', need: '连接感', ask: '先休息半小时，再留十分钟聊天' },
  { scene: '吵架后对方直接不说话，你不知道这次冷多久', issue: '冷处理', feeling: '悬着', need: '沟通通道', ask: '可以暂停，但约定什么时候回来谈' },
  { scene: '朋友面前，对方拿你的短处开玩笑，大家都笑了', issue: '公开玩笑过界', feeling: '没面子', need: '尊重', ask: '公开场合别拿我当梗' },
  { scene: '你聊未来规划，对方总用“到时候再说”带过去', issue: '回避未来', feeling: '不确定', need: '确定感', ask: '先聊一个月内能执行的小计划' },
  { scene: '你情绪低落，对方一直讲道理，越讲你越难受', issue: '情绪被跳过', feeling: '更孤单', need: '先被理解', ask: '先听我说完，再一起想办法' },
];

const loveBuilders = [
  c => ({
    angle: '表达需求',
    prompt: `怎么说最容易让对方听进去？\n当前情境：${c.scene}`,
    options: [
      opt(`这件事让我${c.feeling}，我真正需要的是${c.need}。我们能不能以后${c.ask}？`, true),
      opt('你是不是已经没那么爱我了？', false, wrong('把具体问题升级成爱不爱，对方会先防御。')),
      opt('算了，我自己消化吧，说了也没用。', false, wrong('短期避免冲突，长期会积累委屈。')),
      opt('你自己想想我为什么不开心。', false, wrong('让对方猜谜会制造挫败感，不会让需求更清楚。')),
    ],
    note: `它对的地方是把${c.issue}翻译成感受、需求和可执行请求。`,
  }),
  c => ({
    angle: '冲突降温',
    prompt: `争执开始升温，哪句话最能把话题拉回修复？\n当前情境：${c.scene}`,
    options: [
      opt(`我现在有情绪，但我不是要赢你。我想先把${c.issue}这件事说清楚。`, true),
      opt('你别转移话题，今天必须给我一个说法。', false, wrong('“必须”会增加压迫感，容易把沟通变成审判。')),
      opt('好，那我以后也这样对你。', false, wrong('报复式表达会让双方一起受伤，问题本身没解决。')),
      opt('你要一直这样，我们就别谈了。', false, wrong('用关系威胁处理小冲突，会破坏安全感。')),
    ],
    note: '它对的地方是先说明目标不是输赢，再回到具体问题。',
  }),
  c => ({
    angle: '具体请求',
    prompt: `哪种请求最可能真的被执行？\n当前情境：${c.scene}`,
    options: [
      opt(`${c.ask}，这样我会更有${c.need}。`, true),
      opt('你以后能不能成熟一点？', false, wrong('“成熟一点”是人格评价，不是行动指令。')),
      opt('你就不能主动一点吗？', false, wrong('“主动点”太泛，对方不知道下一次具体做什么。')),
      opt('我希望你什么都能提前想到。', false, wrong('这是读心术要求，没人能长期满足。')),
    ],
    note: '它对的地方是让对方知道下一次具体做什么，而不是只知道自己又错了。',
  }),
  c => ({
    angle: '识别真正伤点',
    prompt: `这件事真正伤人的地方是什么？\n当前情境：${c.scene}`,
    options: [
      opt(`表面是${c.issue}，底层是你感觉${c.need}没有被照顾。`, true),
      opt('说明对方就是自私，不值得继续。', false, wrong('直接人格定性会堵死修复空间，也未必符合事实。')),
      opt('说明你太敏感，需要降低期待。', false, wrong('把需求打成敏感，会让你越来越不敢表达。')),
      opt('说明谁更爱谁的问题必须说清楚。', false, wrong('爱不爱太大，会把可修复的问题推成关系审判。')),
    ],
    note: '它对的地方是看见事件背后的需求，不停留在表面争执。',
  }),
  c => ({
    angle: '谈完后的修复',
    prompt: `谈完以后，哪个动作最能避免下次重演？\n当前情境：${c.scene}`,
    options: [
      opt(`把“以后${c.ask}”变成你们都认可的小约定，下次照着做。`, true),
      opt('让对方保证以后绝不再犯。', false, wrong('绝对保证听起来安心，但不可持续，容易变成空话。')),
      opt('暂时不提了，等关系自然恢复。', false, wrong('不复盘会让同类问题反复出现。')),
      opt('让对方发朋友圈证明重视你。', false, wrong('公开证明不是修复，反而会制造表演感。')),
    ],
    note: '它对的地方是把一次冲突沉淀成下一次可执行的新规则。',
  }),
];

const redflagCases = [
  { scene: '刚在一起不久，对方要求你删掉所有异性好友', behavior: '切断正常社交', cover: '安全感', boundary: '正常社交不能用删除来证明忠诚', action: '保留朋友支持并观察是否继续升级' },
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
  c => ({
    angle: '风险命名',
    prompt: `这件事最准确的风险是什么？\n当前情境：${c.scene}`,
    options: [
      opt(`${c.behavior}，只是被包装成了“${c.cover}”。`, true),
      opt('普通情侣磨合，过段时间就好了。', false, wrong('磨合是双方调整，控制是单方面压缩你的空间。')),
      opt('说明对方太缺爱，需要你更耐心。', false, wrong('缺爱不能成为越界理由，你不是治疗师。')),
      opt('只是表达方式笨，不必太认真。', false, wrong('持续剥夺选择权不是笨拙表达。')),
    ],
    note: `它对的地方是越过“${c.cover}”的包装，直接看见${c.behavior}。`,
  }),
  c => ({
    angle: '边界表达',
    prompt: `如果要回应，哪句边界最清楚？\n当前情境：${c.scene}`,
    options: [
      opt(`我理解你说是${c.cover}，但${c.boundary}。`, true),
      opt('你别这样行不行，我真的会很难受。', false, wrong('情绪真实，但边界不清楚，对方仍可继续试探。')),
      opt('如果你爱我，就不会这样对我。', false, wrong('用爱反向施压，会把问题拉进证明爱不爱的泥潭。')),
      opt('算了，我不想因为这个吵架。', false, wrong('回避冲突会让边界消失，红旗容易升级。')),
    ],
    note: '它对的地方是承认对方说法，但不接受包装后的越界行为。',
  }),
  c => ({
    angle: '安全动作',
    prompt: `下一步最稳妥的动作是什么？\n当前情境：${c.scene}`,
    options: [
      opt(c.action, true),
      opt('先顺着对方，等关系稳定后再慢慢改。', false, wrong('顺从会强化控制，关系稳定后通常更难改。')),
      opt('用同样方式反过来控制他，让他知道感受。', false, wrong('以控制反控制会升级风险，也让你进入同一套坏规则。')),
      opt('立刻把细节发到朋友圈，让大家评理。', false, wrong('公开化可能带来反噬，先找可信支持和安全计划更稳。')),
    ],
    note: '它对的地方是先保护现实边界，而不是陷入辩论。',
  }),
  c => ({
    angle: '识别合理化',
    prompt: `下面哪种想法最容易让人继续陷进去？\n当前情境：${c.scene}`,
    options: [
      opt(`“他只是因为${c.cover}，所以${c.behavior}也可以理解。”`, true),
      opt('“我要看他持续怎么做，不只听他说什么。”', false, wrong('这是正确观察方式，不是陷阱。')),
      opt('“如果我不舒服，可以先和可信朋友说。”', false, wrong('保留外部视角是保护自己，不是背叛关系。')),
      opt('“边界被拒绝后，我需要重新评估关系。”', false, wrong('这是健康判断，不是小题大做。')),
    ],
    note: '它对的地方是点出最常见的自我说服：把动机写好听，忽略行为正在伤害你。',
  }),
  c => ({
    angle: '模式判断',
    prompt: `如果类似情况反复出现，说明什么？\n当前情境：${c.scene}`,
    options: [
      opt(`这不是单次误会，而可能是“${c.cover}包装下的${c.behavior}”模式。`, true),
      opt('说明你还不够会沟通，说得更温柔就好。', false, wrong('沟通可以优化，但不能把对方持续越界的责任揽到自己身上。')),
      opt('说明对方太在乎你，关系进入深层阶段。', false, wrong('控制不是深情，焦虑也不是越界许可证。')),
      opt('说明亲密关系都这样，需要适应。', false, wrong('健康亲密关系会增加安全感，不会让你越来越小心。')),
    ],
    note: '它对的地方是看频率、强度和对方是否尊重拒绝，而不是只看单次解释。',
  }),
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
  c => ({
    angle: '第一回应',
    prompt: `第一句怎么回最能接住情绪？\n当前情境：${c.scene}`,
    options: [
      opt(`听起来你现在最重的是${c.emotion}。我先陪你待一会儿，不急着分析。`, true),
      opt('你别想太多，事情没你想得那么严重。', false, wrong('想减轻痛苦，却先否定了痛苦。')),
      opt(c.bad, false, wrong('方案出现太早，对方会觉得你没站在她这边。')),
      opt('我也遇到过更惨的，我跟你说。', false, wrong('用自己的经历覆盖对方，会让对方的情绪失去位置。')),
    ],
    note: `它对的地方是先命名${c.emotion}，让对方知道自己不是一个人在扛。`,
  }),
  c => ({
    angle: '共情复述',
    prompt: `哪句复述最像真的听懂了？\n当前情境：${c.scene}`,
    options: [
      opt(`你不是单纯在说这件事，你是有点${c.emotion}，对吗？`, true),
      opt('所以你现在就是很生气，对吧？', false, wrong('情绪命名太粗，可能不贴合。')),
      opt('我懂了，你其实就是想让我帮你解决。', false, wrong('把表达情绪等同于要方案，会让对方更孤单。')),
      opt('其实你也知道自己有问题，只是不想承认。', false, wrong('这是审判，不是复述，会直接关门。')),
    ],
    note: '它对的地方是把事件背后的感受说出来，同时用“对吗”给对方修正空间。',
  }),
  c => ({
    angle: '给建议的时机',
    prompt: `如果你想给建议，怎样开口更稳？\n当前情境：${c.scene}`,
    options: [
      opt('你想让我先听你说完，还是现在一起想办法？我都可以。', true),
      opt('我知道你难受，但是你现在必须振作。', false, wrong('“但是”会抹掉前面的共情，“必须”会增加压力。')),
      opt('我给你三个建议，你照着做就行。', false, wrong('太像指挥，对方情绪没落地前很难吸收。')),
      opt('你先冷静，冷静了再说。', false, wrong('让人冷静经常会被听成“你现在不正常”。')),
    ],
    note: '它对的地方是先问对方要陪伴还是要方案，避免好心变成压迫。',
  }),
  c => ({
    angle: '二次伤害',
    prompt: `哪句话最容易造成二次伤害？\n当前情境：${c.scene}`,
    options: [
      opt(c.bad, true),
      opt(`你现在有点${c.emotion}，我在。`, false, wrong('这是接情绪，不是二次伤害。')),
      opt('你愿意说多少就说多少，不用整理好再讲。', false, wrong('这会降低表达压力，是安全回应。')),
      opt('我可能不完全懂，但我愿意听。', false, wrong('承认不完全懂反而真诚，不会抢解释权。')),
    ],
    note: `它对的地方是识别出：${c.bad}可能有道理，但时机太早，会让对方觉得被否定。`,
  }),
  c => ({
    angle: '后续陪伴',
    prompt: `聊完过一会儿，哪个后续动作最加分？\n当前情境：${c.scene}`,
    options: [
      opt(`轻轻确认：“刚才那阵${c.emotion}过去一点了吗？需要我做点什么吗？”`, true),
      opt('马上转移话题，让气氛开心起来。', false, wrong('过快转移会让对方觉得情绪被处理掉，而不是被接住。')),
      opt('反复追问细节，直到她全部讲清楚。', false, wrong('追问会变成审问，对方可能更累。')),
      opt('告诉她以后别再因为这种事崩溃。', false, wrong('这是否定情绪强度，会让她下次不敢说。')),
    ],
    note: `它对的地方是继续回应${c.need}，不是聊完就撤。`,
  }),
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
  c => ({
    angle: '第一次拒绝',
    prompt: `怎么拒绝最清楚又不撕破脸？\n当前情境：${c.scene}`,
    options: [
      opt(`这次我不能${c.request}，因为${c.reason}。${c.alternative}。`, true),
      opt('我可能不太方便吧，要不之后再看看？', false, wrong('“可能/再看看”不是拒绝，对方会继续推进。')),
      opt('你怎么老是这样为难我？', false, wrong('带指责会升级冲突，拒绝的重点是边界。')),
      opt('对不起对不起，我真的特别不好意思。', false, wrong('过度道歉会让合理拒绝像亏欠。')),
    ],
    note: '它对的地方是清楚说不、理由简短、替代有限。',
  }),
  c => ({
    angle: '对方继续劝',
    prompt: `对方继续劝你“再帮一次”，怎么重复边界？\n当前情境：${c.scene}`,
    options: [
      opt(`我理解你很希望我答应，但我的决定不变：我不能${c.request}。`, true),
      opt('你再这样我真的要生气了。', false, wrong('情绪威胁会把焦点变成你的态度，而不是你的边界。')),
      opt('不是我不想，是我真的没办法。', false, wrong('这会让拒绝变成“如果有办法就会答应”，对方可能继续帮你找办法。')),
      opt('下次吧，这次真的不行。', false, wrong('“下次”给了明确口子，对方下次会继续找你。')),
    ],
    note: '它对的地方是重复决定，不增加新理由，减少被继续说服的入口。',
  }),
  c => ({
    angle: '识别软拒绝',
    prompt: `下面哪句看似礼貌，其实最容易失败？\n当前情境：${c.scene}`,
    options: [
      opt('我再考虑一下吧。', true),
      opt(`这次我不能${c.request}。`, false, wrong('这是清楚拒绝。短句不是没礼貌，反而减少误会。')),
      opt('我理解你需要帮忙，但我这边不能接。', false, wrong('这句既承认需求，也清楚拒绝，是可用表达。')),
      opt(`${c.alternative}，但我不能做更多。`, false, wrong('有限替代是健康边界，不是软弱。')),
    ],
    note: '它对的地方是提醒用户：延期不是拒绝，只会把压力留到下一轮。',
  }),
  c => ({
    angle: '保留关系',
    prompt: `想保留关系，拒绝时重点放在哪里？\n当前情境：${c.scene}`,
    options: [
      opt(`态度温和，但边界明确：不攻击对方，只说明自己不能${c.request}。`, true),
      opt('多解释自己的难处，让对方知道你不是故意的。', false, wrong('解释过多会变成求理解，也给对方留下说服入口。')),
      opt('先答应下来，之后找机会取消。', false, wrong('这会破坏信任，也让你更被动。')),
      opt('用玩笑带过去，避免尴尬。', false, wrong('玩笑可以缓和气氛，但不能替代拒绝本身。')),
    ],
    note: '它对的地方是把“尊重对方”和“不牺牲自己”同时做到。',
  }),
  c => ({
    angle: '拒绝后内耗',
    prompt: `拒绝后你开始愧疚，最该提醒自己的是什么？\n当前情境：${c.scene}`,
    options: [
      opt(`我有权因为${c.reason}拒绝${c.request}，不需要把对方所有失落都背到自己身上。`, true),
      opt('只要对方不开心，就说明我拒绝得太狠。', false, wrong('对方失望很正常，不等于你错了。')),
      opt('下次还是别拒绝了，省得关系尴尬。', false, wrong('用顺从换来的不尴尬，会持续透支你。')),
      opt('我要把理由讲到对方完全认同为止。', false, wrong('你不需要获得许可才拥有边界。')),
    ],
    note: '它对的地方是把表达方式责任和对方情绪责任分开。',
  }),
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
  c => ({
    angle: '复联节奏',
    prompt: `面对这个${c.contact}，最稳的处理方式是？\n当前情境：${c.scene}`,
    options: [
      opt(`轻量回应，不借${c.contact}立刻谈复合；用行动证明：${c.change}。`, true),
      opt('马上说自己还爱她，机会难得不能错过。', false, wrong('一有窗口就压上情绪，会让对方想起旧压力。')),
      opt('故意冷淡一点，让她感到失去你。', false, wrong('操作感太强，容易破坏刚恢复的信任。')),
      opt('发一大段复盘，证明自己已经想明白。', false, wrong('长篇解释会把对方重新拖进过去的问题里，负担太重。')),
    ],
    note: `它对的地方是先修复“和你接触不累”的感觉，尤其旧问题是${c.old}时。`,
  }),
  c => ({
    angle: '有效道歉',
    prompt: `如果要道歉，哪种最有效？\n当前情境：${c.scene}`,
    options: [
      opt(`我以前的问题是${c.old}，它给你造成了压力。我现在在做的是：${c.change}。你不用马上回应。`, true),
      opt('我真的错了，求你再相信我一次。', false, wrong('这是情绪请求，不是承担责任；对方会感到又被索取。')),
      opt('我们都有问题，但我愿意先低头。', false, wrong('“我们都有问题”会稀释你的责任，对方听到的是你还在算账。')),
      opt('如果你也有不对的地方，我们能不能一起改？', false, wrong('在道歉里夹带对方责任，会让道歉失效。')),
    ],
    note: '它对的地方是具体承认旧问题、说明影响、展示改变，并且不给对方立刻回应的压力。',
  }),
  c => ({
    angle: '低压聊天',
    prompt: `重新有了几句聊天，哪种状态最加分？\n当前情境：${c.scene}`,
    options: [
      opt('像正常人一样轻松交流，有边界、有生活，不急着证明自己深情。', true),
      opt('不断回忆以前最甜的片段，唤醒她的感情。', false, wrong('过去甜不代表现在安全，过度怀旧会显得你没走出来。')),
      opt('频繁关心她每个动态，让她知道你一直在。', false, wrong('这会重新制造被盯着的感觉。')),
      opt('把自己最近过得很惨说出来，让她心软。', false, wrong('卖惨换来的不是爱，是负担和内疚。')),
    ],
    note: '它对的地方是让对方感受到你变稳了，而不是更会施压了。',
  }),
  c => ({
    angle: '展示改变',
    prompt: `怎样展示改变最可信？\n当前情境：${c.scene}`,
    options: [
      opt(`不急着宣布改变，而是在${c.contact}里自然体现：${c.change}。`, true),
      opt('发长文列出自己改了哪十点。', false, wrong('列清单像求验收，对方会有压力。')),
      opt('让共同朋友帮你转达你变好了。', false, wrong('让别人传话容易显得算计，也把朋友卷进关系。')),
      opt('承诺以后再也不会让她失望。', false, wrong('“再也不会”太绝对，像空头支票，可信度反而低。')),
    ],
    note: '它对的地方是改变被看见，而不是被推销。',
  }),
  c => ({
    angle: '尊重拒绝',
    prompt: `如果对方暂时不想继续联系，最成熟的回应是？\n当前情境：${c.scene}`,
    options: [
      opt('我尊重你的决定。谢谢你把边界说清楚，我不会再继续打扰。', true),
      opt('你是不是还在惩罚我？我已经改了。', false, wrong('把拒绝理解成惩罚，会让对方觉得你仍然以自我为中心。')),
      opt('那我等你，多久都等。', false, wrong('听起来深情，其实是把压力继续放在对方身上。')),
      opt('好吧，那祝你幸福，我再也不会相信爱情了。', false, wrong('情绪化告别仍是在索取反应，不是真尊重。')),
    ],
    note: '它对的地方是把“不纠缠”真正做到，这本身就是改变的一部分。',
  }),
];

const categorySpecs = [
  ['icebreak', '破冰搭讪', 'L001', icebreakCases, icebreakBuilders],
  ['ambiguous', '暧昧理解', 'L013', ambiguousCases, ambiguousBuilders],
  ['love', '热恋沟通', 'L019', loveCases, loveBuilders],
  ['redflag', '红旗识别', 'L027', redflagCases, redflagBuilders],
  ['emotion-catch', '情绪接住', 'L021', emotionCases, emotionBuilders],
  ['refuse', '拒绝练习', 'L025', refuseCases, refuseBuilders],
  ['recover', '挽回前任', 'L030', recoverCases, recoverBuilders],
];

function buildCategory(category, label, relatedLevelKid, cases, builders) {
  const questions = [];
  for (let builderIndex = 0; builderIndex < builders.length; builderIndex++) {
    const builder = builders[builderIndex];
    for (let caseIndex = 0; caseIndex < cases.length; caseIndex++) {
      const id = `q-${category}-${String(questions.length + 1).padStart(3, '0')}`;
      const item = builder(cases[caseIndex]);
      const shuffled = shuffle(item.options, id);
      const correctIndex = shuffled.findIndex(option => option.isCorrect);
      const question = {
        id,
        category,
        difficulty: ((caseIndex + builderIndex) % 5) + 1,
        type: 'single',
        scenario: stageScene(cases[caseIndex].scene, item.angle),
        prompt: `${item.prompt}\n训练角度：${item.angle}`,
        options: shuffled,
        overallExplain: '',
        _note: item.note,
        tags: [label, item.angle],
        relatedLevelKid,
      };
      questions.push(balanceOptions(question));
    }
  }
  return questions;
}

function validate(bank) {
  const errors = [];
  const counts = new Map();
  const scenarios = new Set();
  const prompts = new Set();
  const optionTexts = new Map();
  let correctExplains = 0;
  let wrongExplains = 0;
  let lengthLeak = 0;
  let correctShortLeak = 0;
  let wideSpread = 0;
  let correctLongest = 0;
  let metaText = 0;
  const metaRe = /高分点|迷惑点|判断标准|它看似|这次先围绕|场景来判断|对方可能也更容易接受|先按这个方向试试/;

  for (const q of bank) {
    counts.set(q.category, (counts.get(q.category) || 0) + 1);
    if (scenarios.has(`${q.category}:${q.scenario}:${q.prompt}`)) errors.push(`${q.id}: duplicate scenario+prompt`);
    scenarios.add(`${q.category}:${q.scenario}:${q.prompt}`);
    if (prompts.has(q.prompt)) errors.push(`${q.id}: duplicate prompt`);
    prompts.add(q.prompt);
    if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(`${q.id}: expected 4 options`);
    if (q.options.filter(option => option.isCorrect).length !== 1) errors.push(`${q.id}: expected one correct option`);
    if (/选项拆解|[A-D]\s*[对错]：/.test(q.overallExplain || '')) errors.push(`${q.id}: option breakdown in overall`);
    const lengths = q.options.map(option => len(option.text));
    const correctIndex = q.options.findIndex(option => option.isCorrect);
    const correctLen = lengths[correctIndex];
    const wrongLens = q.options.filter(option => !option.isCorrect).map(option => len(option.text));
    const maxLen = Math.max(...lengths);
    const minLen = Math.min(...lengths);
    const wrongMax = Math.max(...wrongLens);
    const wrongMin = Math.min(...wrongLens);
    if (correctLen === maxLen && lengths.filter(length => length === maxLen).length === 1) correctLongest++;
    if (correctLen - wrongMax >= 12 || correctLen / Math.max(1, wrongMax) >= 1.25) {
      lengthLeak++;
      errors.push(`${q.id}: correct length leak (${correctLen} vs wrong max ${wrongMax})`);
    }
    if (wrongMin - correctLen >= 12 || wrongMin / Math.max(1, correctLen) >= 1.25) {
      correctShortLeak++;
      errors.push(`${q.id}: correct too short (${correctLen} vs wrong min ${wrongMin})`);
    }
    if (maxLen - minLen >= 35 || maxLen / Math.max(1, minLen) >= 1.8) {
      wideSpread++;
      errors.push(`${q.id}: option spread too wide (${minLen}-${maxLen})`);
    }
    for (const option of q.options) {
      if (option.isCorrect && option.explain) correctExplains++;
      if (!option.isCorrect && len(option.explain) >= 12) wrongExplains++;
      if (metaRe.test(option.text)) metaText++;
      if (!optionTexts.has(option.text)) optionTexts.set(option.text, []);
      optionTexts.get(option.text).push(q.id + (option.isCorrect ? '*' : ''));
    }
  }
  for (const [category, count] of counts.entries()) {
    if (count !== 50) errors.push(`${category}: expected 50, got ${count}`);
  }
  const repeatedOptions = [...optionTexts.entries()].filter(([, owners]) => owners.length > 2);
  if (bank.length !== 400) errors.push(`expected 400 questions, got ${bank.length}`);
  if (correctExplains) errors.push(`correct option explains: ${correctExplains}`);
  if (wrongExplains !== 1200) errors.push(`wrong option explains expected 1200, got ${wrongExplains}`);
  if (lengthLeak) errors.push(`length leaks: ${lengthLeak}`);
  if (correctShortLeak) errors.push(`correct short leaks: ${correctShortLeak}`);
  if (wideSpread) errors.push(`wide spreads: ${wideSpread}`);
  if (correctLongest / bank.length > 0.38) errors.push(`correct longest too high: ${correctLongest}/${bank.length}`);
  if (metaText) errors.push(`meta text in options: ${metaText}`);
  if (repeatedOptions.length) errors.push(`repeated options 3+: ${repeatedOptions.slice(0, 5).map(([text, ids]) => `${text.slice(0, 24)}(${ids.length})`).join('; ')}`);
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('HUMAN_V3_VALIDATION_PASSED');
  console.log('TOTAL=' + bank.length);
  console.log('COUNTS=' + JSON.stringify(Object.fromEntries(counts.entries())));
  console.log('CORRECT_LONGEST=' + correctLongest);
}

function main() {
  const { bank, tail } = loadBank();
  const anti = bank.filter(question => question.category === 'anti-pua');
  if (anti.length !== 50) throw new Error(`expected 50 anti-pua questions, got ${anti.length}`);
  const generated = categorySpecs.flatMap(args => buildCategory(...args));
  let updated = [...anti, ...generated];
  for (let pass = 0; pass < 3; pass++) {
    updated = uniquifyOptions(updated).map(balanceOptions);
  }
  updated = resolveExactRepeats(updated);
  updated = updated.map(finalizeQuestion);
  validate(updated);
  const source = [
    '/**',
    ' * FoxSay 微练习题库',
    ' * 8 大主题 x 50 题；反 PUA 保留生活化版本，其余模块重写为日常真实场景与自然回复。',
    ' */',
    '',
    "import type { Question } from '../services/quiz';",
    '',
    `export const QUIZ_BANK: Question[] = ${JSON.stringify(updated, null, 2)};`,
    '',
    tail.trimStart(),
  ].join('\n');
  fs.writeFileSync(BANK_PATH, source, 'utf8');
  console.log('WROTE=' + BANK_PATH);
}

main();