const fs = require('fs');
const path = require('path');

const BANK_PATH = path.join(__dirname, '..', 'src', 'data', 'quizBank.ts');
const MARKER = 'export const QUIZ_BANK: Question[] = ';
const END_MARKER = ';\n\nexport function getQuestionById';
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const metaTailStarters = [
  ' 它有礼貌',
  ' 它看似',
  ' 它能快速',
  ' 它把压力',
  ' 它从现场',
  ' 它给对方',
  ' 它听起来',
  ' 它先照顾',
  ' 它有一点',
  ' 它看起来',
  ' 它有建议价值',
  ' 它能缓和',
  ' 它能表达',
  ' 它能让对方',
  ' 它有实际内容',
  ' 它把不舒服',
  ' 它把冲突',
  ' 它试图',
  ' 它留了一点',
  ' 它给自己',
  ' 它能让对方',
  ' 它有诚意',
  ' 它能表达',
  ' 它有真实委屈',
  ' 它有实际内容',
  ' 多给一点解释',
  ' 它有真实',
  ' 它有情绪',
  ' 它试图',
  ' 它留了一点',
  ' 这样比较顾及',
  ' 多讲一点',
  ' 这样更体谅',
  ' 这样能减少',
  ' 这样是在帮',
  ' 这样更体谅',
  ' 这样能保护',
  ' 这样能保护',
  ' 这样足够主动',
  ' 直接一点',
  ' 这句也能回应',
  ' 这次先围绕',
  ' 高分点',
  ' 迷惑点',
  ' 判断标准',
];

const categoryLessons = {
  'anti-pua': '这题练的是反操控的基本功：先稳住现实感，再把话题拉回事实、感受和边界。正确答案没有急着讨好，也没有把冲突升级成互骂，而是拒绝对方给你的标签或审判规则。真正有效的反 PUA 不是赢一句嘴，而是让你重新拿回判断权和行动权。',
  icebreak: '这题练的是低压力破冰。正确答案从现场细节切入，让对方可以轻松接话，也可以自然退出。好的开场不是展示你多会撩，而是把陌生互动变得安全、具体、自然，让对方觉得这句话不是冲着她整个人来的，而只是顺着当下场景聊一下。',
  ambiguous: '这题练的是暧昧里的力度感。正确答案接住了信号，但没有把一个窗口当成承诺。暧昧期最容易错在两边：要么完全装不懂，错过升温；要么急着逼问关系，把轻松互动变成压力。高分回应会顺势推进，同时保留回旋。',
  love: '这题练的是亲密关系里的可执行沟通。正确答案没有把问题升级成“你爱不爱我”，而是把事实、感受、需求和请求说清楚。热恋沟通的关键不是谁讲赢，而是让对方知道下一次具体可以怎么做，这样关系才有修复路径。',
  redflag: '这题练的是看行为，而不是听包装。正确答案没有被“爱你、担心你、为你好”这类词带走，而是看这件事是否减少你的自由、安全、资源或社交支持。红旗识别的核心是：如果一个行为让你越来越小心、孤立或失去选择权，就不能只按甜言蜜语理解。',
  'emotion-catch': '这题练的是先接情绪，再处理事情。正确答案先让对方感到被听见，而不是马上讲道理、给方案或比较谁更惨。人在情绪里时，最先需要的是情绪被放到一个安全位置；等对方缓下来，建议才有机会被接住。',
  refuse: '这题练的是温和但清楚地说不。正确答案一般包含三个部分：明确拒绝、简短原因、有限替代。拒绝最怕含糊，因为含糊会让对方以为还有继续推进的空间。真正体面的拒绝不是把自己说到亏欠，而是让边界清楚、关系也尽量保留。',
  recover: '这题练的是复联里的低压感。正确答案不会一有窗口就表白、复盘、求原谅，而是先恢复“和你接触不累”的感觉。挽回不是靠情绪浓度压回关系，而是让对方看见你更稳定、更尊重边界，也不再把旧压力重新丢给她。',
};

const categoryWrongExplains = {
  'anti-pua': [
    '错在用退让、自证或补偿换取对方停止施压，短期像缓和，长期会强化对方的操控规则。',
    '错在把重点从具体边界推成互相攻击，对方更容易转移话题，你也更难守住原本的问题。',
    '错在接受了对方设定的审判或测试规则，看似折中，实际把判断权交了出去。',
  ],
  icebreak: [
    '错在目的感太强，第一句话就把压力放到对方身上，对方容易进入防备状态。',
    '错在话题太泛或太老套，对方不知道从哪里接，也很容易把它识别成模板搭讪。',
    '错在没有给出具体场景钩子，聊天会变成尴尬的许可请求，而不是自然互动。',
  ],
  ambiguous: [
    '错在把暧昧信号当成确定承诺，推进过猛会让轻松感消失。',
    '错在故意变冷或测试对方，把互动从自然升温变成心理博弈。',
    '错在完全不接信号，表面安全，实际会浪费对方释放出来的窗口。',
  ],
  love: [
    '错在把具体事件升级成爱不爱、在不在乎，对方会先防御，很难进入修复。',
    '错在让对方猜你的情绪或用冷处理表达失望，问题没有变得更清楚。',
    '错在只宣泄痛感，却没有给出下一次可以执行的具体动作。',
  ],
  redflag: [
    '错在替对方找动机，把控制、监控或羞辱解释成爱和担心。',
    '错在先照顾关系气氛，却没有保护现实边界，风险会被正常化。',
    '错在用反控制或公开对抗处理风险，容易升级局面，也不利于保护自己。',
  ],
  'emotion-catch': [
    '错在太快讲道理或给方案，对方还没被听见，就会先感到被否定。',
    '错在用安慰压低情绪强度，听起来像在说“你不该这么难受”。',
    '错在把焦点抢到自己或第三方身上，对方原本的感受没有位置。',
  ],
  refuse: [
    '错在说得太含糊，对方会以为还有商量空间，于是继续推进。',
    '错在过度道歉或解释，把合理拒绝说成自己亏欠对方。',
    '错在用指责代替边界，场面会升级，但拒绝本身反而不够清楚。',
  ],
  recover: [
    '错在一有窗口就索要回应，会让对方重新感到压力。',
    '错在用深情、卖惨或长篇复盘证明自己，实际是在把情绪负担丢回去。',
    '错在用冷淡、刺激或博弈制造波动，短期有反应，长期会伤害信任。',
  ],
};

const naturalTails = {
  'anti-pua': [
    '我只是想让关系先稳住。',
    '我不想把问题闹得太难看。',
    '先把情绪压下来也许更好。',
    '我也会再想想自己有没有问题。',
    '至少别让这次沟通彻底崩掉。',
    '我希望你能看到我不是故意对抗。',
  ],
  icebreak: [
    '不方便也没关系，我就是刚好好奇。',
    '你可以简单说一句，我不耽误你。',
    '我问得有点突然，别有压力。',
    '如果你赶时间，也完全没关系。',
    '我就是顺口问一句，不会一直打扰。',
    '你随便回一句就行，我不查户口。',
    '我只是觉得这个点还挺有意思。',
    '你不想聊的话我也能理解。',
  ],
  ambiguous: [
    '不然一直猜来猜去也挺累的。',
    '至少能早点知道她到底怎么想。',
    '保持一点神秘感也许更有吸引力。',
    '先别接太满，看看她会不会更主动。',
    '暧昧本来就需要一点拉扯感。',
    '早点把话挑明反而能省掉很多误会。',
  ],
  love: [
    '我想解决问题，不是跟你分输赢。',
    '我们可以先把这件事说清楚。',
    '我需要的是下一次能有变化。',
    '这件事对我来说不是小题大做。',
    '我希望你能先看见我的委屈。',
    '不然我会觉得自己一直在忍。',
    '这次我不想再假装没事了。',
    '我也想知道你心里到底怎么想。',
  ],
  redflag: [
    '先别把事情想得太严重。',
    '也许等关系稳定后就会好一点。',
    '他可能只是安全感不太够。',
    '直接硬碰硬也许能更快看清态度。',
    '亲密关系里有点占有欲也很正常。',
    '先观察一阵子，不用马上定性。',
  ],
  'emotion-catch': [
    '先把问题解决掉，她应该会轻松一点。',
    '让她看到事情没那么糟，会更快好起来。',
    '换个话题也许能让气氛轻一点。',
    '说得理性一点，反而能帮她稳住。',
    '现在拖太久，情绪可能会越来越重。',
    '先给方向，她才不会一直困在里面。',
  ],
  refuse: [
    '先别把话说死，给彼此留点余地。',
    '这样比较不伤关系，也不至于尴尬。',
    '多解释一点，对方可能会更能接受。',
    '只要态度够诚恳，晚点再拒绝也可以。',
    '先缓一缓，等对方情绪过去再说。',
    '给个模糊答复，场面会好看一点。',
  ],
  recover: [
    '也许能让她重新感受到你的在意。',
    '至少不能错过这次难得的窗口。',
    '先把情绪铺出来，她才知道你还在乎。',
    '不主动一点，很可能就彻底没机会了。',
    '让她看到你还在等，也许会心软。',
    '这次应该把遗憾一次说清楚。',
  ],
};

const correctNaturalTails = {
  'anti-pua': [
    '我先不进入自证模式。',
    '这件事需要回到事实本身。',
    '我会把边界先说清楚。',
  ],
  icebreak: [
    '不方便也没关系，我就是顺口问问。',
    '你简单说一句就行，我不耽误你。',
    '我只是刚好被这个细节吸引到了。',
  ],
  ambiguous: [
    '先顺着这个节奏聊，不急着下结论。',
    '这样有回应，也不会把压力给满。',
    '让关系自然往前一点就够了。',
  ],
  love: [
    '我想解决问题，不是跟你分输赢。',
    '我希望这次能落到下一步怎么做。',
    '这样说比较容易让关系进入修复。',
  ],
  redflag: [
    '后面要看对方是否尊重这条边界。',
    '这件事不能只按“爱不爱”来理解。',
    '如果反复出现，就需要认真评估风险。',
  ],
  'emotion-catch': [
    '你不用马上整理好再说。',
    '我先听你讲完，再一起想办法。',
    '现在不用急着变好。',
  ],
  refuse: [
    '我能做的就到这里。',
    '这个决定不会因为多劝几句改变。',
    '我不想把话说得含糊。',
  ],
  recover: [
    '你不用马上回应。',
    '我会尊重你的节奏。',
    '这次我不把压力丢给你。',
  ],
};

const sharedNaturalTails = [
  '先留一点余地，场面会更好看。',
  '至少当下不会把关系推得太僵。',
  '这样听起来也不会太冲。',
  '先按这个方向试试也未必不行。',
  '对方可能也更容易接受一点。',
];

const legacyAutoTails = [
  '我不想靠让步换平静。',
  '这件事需要回到事实本身。',
  '我希望我们别用标签压人。',
  '我现在先把边界说清楚。',
  '我先不把话说满，顺着聊聊就好。',
  '如果你只是随口一说，我也不会多想。',
  '这个节奏我觉得刚刚好。',
  '先轻松一点，不急着下结论。',
  '我会先看行为，而不是只听说法。',
  '这件事我需要保留自己的判断。',
  '如果它反复出现，我会重新评估。',
  '我不会把边界交出去换安心。',
  '你不用马上整理好再说。',
  '我先听你讲完，再一起想办法。',
  '现在不用急着变好。',
  '我在这儿，先陪你缓一缓。',
  '我能做的就到这里。',
  '这个决定不会因为多劝几句改变。',
  '我希望你能理解，但不理解也没关系。',
  '我不想把话说得含糊。',
  '我不会把压力丢给你。',
  '你不用马上回应。',
  '我会尊重你的节奏。',
  '这次我先把边界放清楚。',
  '我不想把这件事绕到别的地方。',
  '我们可以晚点再把细节说清楚。',
  '我现在先按自己的判断处理。',
  '这件事不用马上给出最终结论。',
  '我希望这句话先停在这个范围里。',
  '如果继续聊，也应该回到具体事情。',
  '我不想靠猜测来推进这次沟通。',
  '我会保留自己的感受和判断。',
  '这不是我想回避，而是我想把话说准。',
  '如果你愿意，我们之后可以再谈。',
  '现在直接一点反而能省掉很多误会。',
];

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

function textLen(text) {
  return Array.from(String(text || '').replace(/\s+/g, '')).length;
}

function stripOptionText(text) {
  let next = String(text || '').trim().replace(/\s+/g, ' ');
  const removableStarters = [
    ...metaTailStarters,
    ...Object.values(naturalTails).flat(),
    ...sharedNaturalTails,
    ...legacyAutoTails,
  ];
  next = next.replace(/([。！？!?])\s*(它|这样|多给一点|多讲一点|直接一点|高分点|迷惑点|判断标准|这次先围绕)[^。！？!?]*(?:[。！？!?]|$).*/, '$1');
  for (const starter of removableStarters) {
    const cleanStarter = starter.trim();
    const index = next.indexOf(cleanStarter);
    if (index > 0) next = next.slice(0, index).trim();
  }
  return next;
}

function classifyWrong(text, category, originalExplain) {
  const explain = String(originalExplain || '');
  const source = `${text} ${explain}`;
  if (/直接|马上|必须|立刻|确定|逼问|表白|求复合|深情|长消息|长篇|机会难得/.test(source)) return 0;
  if (/冷|测试|刺激|故意|博弈|比较|反击|你才|凭什么|恶心|可笑|控制狂|低级|懒得/.test(source)) return 1;
  if (/算了|可能|好吧|对不起|以后|我会|不问|不说|顺着|答应|考虑|看看|下次|退一步/.test(source)) return 2;
  return Math.abs(hash(source)) % 3;
}

function wrongExplainFor(q, option, optionIndex) {
  const current = String(option.explain || '').trim();
  if (current && !/^✅/.test(current)) return current;
  const pool = categoryWrongExplains[q.category] || categoryWrongExplains['anti-pua'];
  const kind = classifyWrong(option.text, q.category, current);
  return `❌ ${pool[kind % pool.length]}`;
}

function hash(input) {
  let value = 2166136261;
  for (let i = 0; i < input.length; i++) {
    value ^= input.charCodeAt(i);
    value = Math.imul(value, 16777619) >>> 0;
  }
  return value || 1;
}

function makeOverall(q, correctLetter, correctText) {
  const lesson = categoryLessons[q.category] || categoryLessons['anti-pua'];
  const cleanScenario = String(q.scenario || '').replace(/，你(先|要|准备|想).+$/, '');
  const answerEnd = /[。！？!?]$/.test(String(correctText).trim()) ? '' : '。';
  return `正确答案：${correctLetter}。${lesson} 放到这道题里，最稳的回应是“${correctText}”${answerEnd}它对的地方在于：既回应了当前场景${cleanScenario ? `“${cleanScenario}”` : ''}里的真实问题，又没有把自己推到讨好、自证、审判或表演的位置。`;
}

function appendNaturalTail(q, options, index, usedTails) {
  const tailMap = options[index].isCorrect ? correctNaturalTails : naturalTails;
  const tails = tailMap[q.category] || tailMap['anti-pua'];
  const seed = hash(`${q.id}-${index}-${options[index].text}`);
  for (let offset = 0; offset < tails.length; offset++) {
    const tail = tails[(seed + offset) % tails.length];
    if (!usedTails.has(tail) && !options[index].text.includes(tail)) {
      options[index].text = `${options[index].text}${tail}`;
      usedTails.add(tail);
      return true;
    }
  }
  return false;
}

function balanceOptionLengths(q, options) {
  const usedTails = new Set();
  for (let round = 0; round < 14; round++) {
    const lengths = options.map(option => textLen(option.text));
    const correctIndex = options.findIndex(option => option.isCorrect);
    const correctLen = lengths[correctIndex];
    const wrongIndexes = options.map((option, index) => option.isCorrect ? -1 : index).filter(index => index >= 0);
    const wrongLens = wrongIndexes.map(index => lengths[index]);
    const maxLen = Math.max(...lengths);
    const minLen = Math.min(...lengths);
    const wrongMax = Math.max(...wrongLens);
    const wrongMin = Math.min(...wrongLens);
    const ratio = maxLen / Math.max(1, minLen);
    const correctIsUniqueLongest = correctLen === maxLen && lengths.filter(length => length === maxLen).length === 1;

    if (
      maxLen - minLen < 34 &&
      ratio < 1.78 &&
      correctLen - wrongMax < 12 &&
      correctLen / Math.max(1, wrongMax) < 1.25 &&
      wrongMin - correctLen < 12 &&
      wrongMin / Math.max(1, correctLen) < 1.25 &&
      !correctIsUniqueLongest
    ) {
      break;
    }

    let target = lengths.indexOf(minLen);
    if (correctIsUniqueLongest || correctLen - wrongMax >= 12 || correctLen / Math.max(1, wrongMax) >= 1.25) {
      target = wrongIndexes[wrongLens.indexOf(wrongMin)];
    } else if (wrongMin - correctLen >= 12 || wrongMin / Math.max(1, correctLen) >= 1.25) {
      target = correctIndex;
    }

    if (!appendNaturalTail(q, options, target, usedTails)) break;
  }
  return options;
}

function sceneHint(q) {
  return String(q.scenario || q.prompt || q.id)
    .replace(/[“”"']/g, '')
    .split(/[，。；:：\n]/)[0]
    .slice(0, 18);
}

function makeDuplicateVariant(q, text, occurrence) {
  const hint = sceneHint(q) || '这个场景';
  const softeners = ['刚才', '这会儿', '现在', '在这里', '这次'];
  const soft = softeners[occurrence % softeners.length];
  if (/气质挺特别/.test(text)) return `${soft}在${hint}注意到你，感觉你气质挺特别的，方便认识一下吗？`;
  if (/在哪里见过|很眼熟|有点眼熟/.test(text)) return `我们是不是在${hint}附近见过？我总觉得你有点眼熟。`;
  if (/你一个人吗/.test(text)) return `你也是来${hint}这边的吗？如果方便的话，可以聊两句吗？`;
  if (/如果不方便回答/.test(text)) return `如果不方便聊${hint}也没关系，我只是有点好奇。`;
  if (/我观察你很久/.test(text)) return `我刚才在${hint}注意你有一会儿了，感觉你和别人不太一样。`;
  if (/先冷两天/.test(text)) return `先晾两天，看看她会不会因为${hint}主动找你。`;
  if (/趁热打铁/.test(text)) return `趁这个窗口还在，直接约她今晚出来，把${hint}往前推一步。`;
  if (/让她知道你已经很喜欢/.test(text)) return `把自己已经很喜欢她说清楚，让${hint}里的不确定感少一点。`;
  if (/你先冷静/.test(text)) return `你先冷静一下，等${hint}这阵情绪过去了再说。`;
  if (/现在必须振作/.test(text)) return `我知道你难受，但${hint}已经这样了，你现在必须振作。`;
  if (/想让我先听你说完/.test(text)) return `你想让我先听你说完，还是先一起处理${hint}这件事？我都可以。`;
  if (/我尊重你的决定/.test(text)) return `我尊重你的决定。谢谢你在${hint}这件事上把边界说清楚，我不会再继续打扰。`;
  return `${text}${soft}先按${hint}这个场景来判断。`;
}

function uniquifyOptionTexts(bank) {
  const seen = new Map();
  for (const q of bank) {
    q.options = q.options.map(option => {
      const count = seen.get(option.text) || 0;
      seen.set(option.text, count + 1);
      if (count === 0) return option;
      return {
        ...option,
        text: makeDuplicateVariant(q, option.text, count),
      };
    });
  }
  return bank;
}

function normalizeQuestion(q) {
  if (!Array.isArray(q.options) || q.options.length === 0) return q;
  const options = q.options.map((option, optionIndex) => ({
    ...option,
    text: stripOptionText(option.text),
    explain: option.isCorrect ? '' : wrongExplainFor(q, option, optionIndex),
  }));
  balanceOptionLengths(q, options);
  const correctIndex = options.findIndex(option => option.isCorrect);
  const correctLetter = LETTERS[correctIndex] || 'A';
  return {
    ...q,
    options,
    overallExplain: makeOverall(q, correctLetter, options[correctIndex]?.text || ''),
  };
}

function validate(bank) {
  const errors = [];
  const byCategory = new Map();
  const scenarios = new Set();
  const prompts = new Set();
  let correctExplains = 0;
  let missingWrongExplains = 0;
  let metaOptions = 0;
  let optionSpread = 0;
  let lengthLeak = 0;
  let correctShortLeak = 0;

  for (const q of bank) {
    byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1);
    if (scenarios.has(q.scenario)) errors.push(`${q.id}: duplicate scenario`);
    if (prompts.has(q.prompt)) errors.push(`${q.id}: duplicate prompt`);
    scenarios.add(q.scenario);
    prompts.add(q.prompt);
    const correct = q.options.filter(option => option.isCorrect);
    if (correct.length !== 1) errors.push(`${q.id}: expected one correct option`);
    if (/选项拆解|[A-F]\s*[对错]：/.test(q.overallExplain || '')) errors.push(`${q.id}: overallExplain still contains option breakdown`);
    const lengths = q.options.map(option => textLen(option.text));
    const correctIndex = q.options.findIndex(option => option.isCorrect);
    const correctLen = lengths[correctIndex];
    const wrongLens = q.options.filter(option => !option.isCorrect).map(option => textLen(option.text));
    const maxLen = Math.max(...lengths);
    const minLen = Math.min(...lengths);
    const wrongMax = Math.max(...wrongLens);
    const wrongMin = Math.min(...wrongLens);
    if (maxLen - minLen >= 40 || maxLen / Math.max(1, minLen) >= 1.9) optionSpread++;
    if (correctLen - wrongMax >= 14 || correctLen / Math.max(1, wrongMax) >= 1.28) lengthLeak++;
    if (wrongMin - correctLen >= 14 || wrongMin / Math.max(1, correctLen) >= 1.28) correctShortLeak++;
    for (const option of q.options) {
      if (metaTailStarters.some(starter => option.text.includes(starter.trim()))) metaOptions++;
      if (metaTailStarters.some(starter => option.text.includes(starter.trim()))) {
        errors.push(`${q.id}: meta option sample: ${option.text.slice(0, 90)}`);
      }
      if (option.isCorrect && option.explain) correctExplains++;
      if (!option.isCorrect && textLen(option.explain) < 16) missingWrongExplains++;
    }
  }

  for (const [category, count] of byCategory.entries()) {
    if (count !== 50) errors.push(`${category}: expected 50, got ${count}`);
  }
  if (bank.length !== 400) errors.push(`expected 400 questions, got ${bank.length}`);
  if (metaOptions) errors.push(`meta text in options: ${metaOptions}`);
  if (correctExplains) errors.push(`correct option explains should be empty: ${correctExplains}`);
  if (missingWrongExplains) errors.push(`missing wrong option explains: ${missingWrongExplains}`);
  if (optionSpread) errors.push(`option spreads too wide: ${optionSpread}`);
  if (lengthLeak) errors.push(`correct length leaks: ${lengthLeak}`);
  if (correctShortLeak) errors.push(`correct short leaks: ${correctShortLeak}`);
  if (errors.length) throw new Error(errors.join('\n'));

  console.log('SPEC_V2_VALIDATION_PASSED');
  console.log('TOTAL=' + bank.length);
  console.log('BY=' + JSON.stringify(Object.fromEntries(byCategory.entries())));
}

function main() {
  const { bank, tail } = loadBank();
  const updated = uniquifyOptionTexts(bank.map(normalizeQuestion)).map(q => ({
    ...q,
    options: balanceOptionLengths(q, q.options),
  }));
  validate(updated);
  const source = [
    '/**',
    ' * FoxSay 微练习题库',
    ' * 8 大主题 x 50 题；选项保持生活化，错误项解析放在选项下方，知识点解析只讲正确答案。',
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