/**
 * FoxSay production quiz bank generator
 *
 * 目标：重做 8 大主题 x 50 题 = 400 题。
 * 每题 1 个正确答案 + 3 个“看起来合理但关键点错”的干扰项。
 * 输出仍为 single 题，保持现有前端兼容。
 */

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'src', 'data', 'quizBank.ts');

function opt(text, isCorrect, explain) {
  return { text, isCorrect, explain };
}

function hash(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h || 1;
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

function textLen(text) {
  return Array.from(String(text || '').replace(/\s+/g, '')).length;
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

const scenarioFrames = {
  'anti-pua': [
    scene => `${scene}，对方刚把问题推回你身上`,
    scene => `${scene}，你事后复盘这句话的操控点`,
    scene => `${scene}，对方继续要求你解释自己`,
    scene => `${scene}，你想守住边界但不把话说炸`,
    scene => `${scene}，你担心自己被他的定义带跑`,
  ],
  icebreak: [
    scene => `${scene}，你准备开第一句话`,
    scene => `${scene}，对方已经礼貌回应了一句`,
    scene => `${scene}，你在判断哪句话会显得油腻`,
    scene => `${scene}，聊天短暂打开后准备收尾`,
    scene => `${scene}，你想把分寸感拿稳`,
  ],
  ambiguous: [
    scene => `${scene}，你先判断信号强度`,
    scene => `${scene}，你要接住暧昧但不上头`,
    scene => `${scene}，你考虑把互动往前推一步`,
    scene => `${scene}，你在排查自己是否过度解读`,
    scene => `${scene}，你想保持松弛而不是被牵着走`,
  ],
  love: [
    scene => `${scene}，你要把委屈说成对方听得懂的需求`,
    scene => `${scene}，冲突开始升温`,
    scene => `${scene}，你想提出一个能执行的小请求`,
    scene => `${scene}，你在识别真正伤人的底层需求`,
    scene => `${scene}，你们谈完后准备做关系复盘`,
  ],
  redflag: [
    scene => `${scene}，你先给风险准确命名`,
    scene => `${scene}，你要决定下一步安全动作`,
    scene => `${scene}，你发现自己正在替对方找理由`,
    scene => `${scene}，你准备短句表达边界`,
    scene => `${scene}，类似情况已经不止一次出现`,
  ],
  'emotion-catch': [
    scene => `${scene}，你要开第一句接情绪`,
    scene => `${scene}，你正在复述对方没说出口的感受`,
    scene => `${scene}，你想给建议但不确定时机`,
    scene => `${scene}，你要识别哪句话会造成二次伤害`,
    scene => `${scene}，你准备做一个后续陪伴动作`,
  ],
  refuse: [
    scene => `${scene}，你要第一次把拒绝说清楚`,
    scene => `${scene}，对方继续劝你再帮一次`,
    scene => `${scene}，你在识别哪种拒绝最容易失败`,
    scene => `${scene}，你既想保留关系也不想让渡边界`,
    scene => `${scene}，拒绝之后你开始内耗`,
  ],
  recover: [
    scene => `${scene}，你先判断复联节奏`,
    scene => `${scene}，你准备为旧问题道歉`,
    scene => `${scene}，你们重新有了几句聊天`,
    scene => `${scene}，你想让改变被看见`,
    scene => `${scene}，对方暂时不想继续联系`,
  ],
};

const optionFillers = {
  'anti-pua': {
    correct: ['这样既没有自证，也没有把关系直接推向对立。', '这句话先稳住框架，再给后续沟通留下空间。', '它把问题按事实处理，不急着进入人格辩论。', '它先保护自己的判断，再决定是否继续谈。'],
    wrong: ['这样能让场面先稳住，不至于马上撕破脸。', '这句话有情绪表达，也给关系留了一点余地。', '它既有态度，也没有一上来把对方推到对立面。', '它像是在沟通，却没有真正切住对方刚才的越界点。', '它能缓和气氛，但会把关键边界说得不够清楚。', '它暂时不激化冲突，但也容易让问题继续留在原地。'],
  },
  icebreak: {
    correct: ['它把压力放在话题上，而不是放在对方身上。', '它给对方一个轻松接话口，也允许对方自然退出。', '它从现场细节出发，听起来更像自然闲聊。', '它不急着展示魅力，而是先让对方好接话。'],
    wrong: ['这样足够主动，对方不用猜你的交流意图。', '它有礼貌和热情，也保留了一点基本分寸。', '直接一点更节省时间，也更容易快速打开局面。', '它看似坦率，但会让第一次互动显得目的太满。', '它能快速表明兴趣，却缺少一个轻松的话题入口。'],
  },
  ambiguous: {
    correct: ['它接住温度但不索要承诺，给关系留下自然流动。', '它让对方感到被回应，同时不会被你逼着表态。', '它有推进感，但还保留了轻松和回旋。', '它把暧昧当窗口，不把窗口误读成承诺。'],
    wrong: ['这样能减少不确定感，让自己更快掌握主动。', '它有一点情绪张力，也能让暧昧升温得更快。', '它给自己留了退路，也避免把话说得太满。', '它看似有框架，但会把轻松互动变成心理博弈。', '它容易让关系升温过快，反而破坏对方的安全感。'],
  },
  love: {
    correct: ['它把情绪翻译成请求，关系才有机会一起往前走。', '它不审判人格，而是让对方知道下一次能怎么做。', '它把冲突落到可执行动作上，不停留在互相猜。', '它既表达感受，也给出了能被配合的方向。'],
    wrong: ['这样能保护自己的感受，不会继续被动吞下委屈。', '它把不舒服说出来了，也没有继续憋着。', '它能让对方感到事情不小，也许会更重视你的情绪。', '它有真实委屈，但容易把沟通推成输赢。', '它能表达痛感，却没有给关系一个具体修复入口。'],
  },
  redflag: {
    correct: ['它优先保护现实边界，而不是急着替对方解释动机。', '它看行为后果，不被“为你好”的包装带走。', '它先稳住现实安全，再决定怎么谈关系。', '它把判断放在行为模式上，而不是放在甜言蜜语上。'],
    wrong: ['这样更体谅对方，也不至于马上把关系推僵。', '它先照顾关系气氛，也给后面沟通留空间。', '它把冲突降下来，也给后续观察留了一点空间。', '它看起来成熟包容，但可能把控制行为正常化。', '它能减少当下争执，却没有保护你的现实边界。'],
  },
  'emotion-catch': {
    correct: ['它先让对方感到被听见，再决定要不要进入方案。', '它给情绪一个位置，不抢着把事情处理掉。', '它先承认对方的感受，再给后续支持留出口。', '它把陪伴放在解决前面，顺序更符合情绪恢复。'],
    wrong: ['这样是在帮对方尽快从情绪里出来。', '它有实际内容，也能让对方知道你在认真帮忙。', '它试图把事情说清楚，避免对方一直卡在感受里。', '它看似有效率，但会让对方觉得感受被跳过。', '它有建议价值，只是出现得太早，容易刺到人。'],
  },
  refuse: {
    correct: ['它温和但清楚，让对方知道哪里不能再推。', '它给有限替代，不把拒绝变成亏欠或谈判。', '它把决定说清楚，也保留了基本礼貌。', '它没有过度解释，所以不容易被继续说服。'],
    wrong: ['这样比较顾及对方面子，也能缓和当场尴尬。', '它留了一点余地，也保护了你们的关系。', '多给一点解释，能证明自己不是不重视对方。', '它听起来很客气，但会让对方以为还有商量空间。', '它能暂时减轻内疚，却会把边界拖得更模糊。'],
  },
  recover: {
    correct: ['它先恢复安全感，不把复联窗口变成索取现场。', '它用稳定行动降低压力，而不是急着证明深情。', '它让对方看到变化，而不是被要求立刻回应。', '它把复联当作重建信任，不当作情绪索取。'],
    wrong: ['这样能把态度表达清楚，不至于错过窗口。', '它有诚意和情绪浓度，也能让对方看见你还在乎。', '多讲一点变化，也能给对方更多安全感。', '它看似深情，但会让对方重新感到压力。', '它急着证明自己，反而削弱了改变的可信度。'],
  },
};

function frameScenario(category, scene, angleIndex) {
  const frames = scenarioFrames[category];
  if (!frames) return scene;
  return frames[angleIndex % frames.length](scene);
}

function appendFiller(category, q, option, optionIndex, round, usedFillers) {
  const pool = optionFillers[category]?.[option.isCorrect ? 'correct' : 'wrong'] || [
    option.isCorrect ? '它把关键判断说清楚，也给下一步留下空间。' : '它不是完全没道理，但会错过本题真正要练的点。',
  ];
  const sceneHint = q.scenario.replace(/[“”]/g, '').split('，')[0];
  const fallbackPool = option.isCorrect
    ? [`它把重点放回“${sceneHint}”这个具体场景里。`, '这句话不抢结论，先把当前判断稳住。', '它既能回应当下，也不给对方额外施压。']
    : [`这句也能回应“${sceneHint}”，但关键动作不够稳。`, '它有一定合理性，只是没有抓住本题的主轴。', '它能让话继续下去，却可能偏离真正要练的点。'];
  const candidates = [...pool, ...fallbackPool];
  const start = hash(`${q.id}-${optionIndex}-${round}`) % pool.length;
  let filler = '';
  for (let offset = 0; offset < candidates.length; offset++) {
    const candidate = candidates[(start + offset) % candidates.length];
    if (!option.text.includes(candidate) && !usedFillers.has(candidate)) {
      filler = candidate;
      break;
    }
  }
  if (!filler) return option.text;
  usedFillers.add(filler);
  return `${option.text} ${filler}`;
}

function appendMicroFiller(q, option, optionIndex, round) {
  const pool = option.isCorrect
    ? ['我会把话停在这里。', '先不继续加码。', '给对方一点空间。', '也把边界放清楚。', '不再额外自证。']
    : ['我会先留点余地。', '暂时不把话说满。', '先不继续升级。'];
  const start = hash(`${q.id}-micro-${optionIndex}-${round}`) % pool.length;
  let filler = '';
  for (let offset = 0; offset < pool.length; offset++) {
    const candidate = pool[(start + offset) % pool.length];
    if (!option.text.includes(candidate)) {
      filler = candidate;
      break;
    }
  }
  if (!filler) return option.text;
  return `${option.text} ${filler}`;
}

function balanceOptions(category, q) {
  const options = q.options.map(option => ({ ...option, text: option.text.trim() }));
  const additions = new Array(options.length).fill(0);
  const usedFillers = new Set();
  const add = (index, round, micro = false) => {
    if (index < 0 || additions[index] >= 3) return false;
    options[index] = {
      ...options[index],
      text: micro ? appendMicroFiller(q, options[index], index, round) : appendFiller(category, q, options[index], index, round, usedFillers),
    };
    additions[index]++;
    return true;
  };

  for (let round = 0; round < 12; round++) {
    const lengths = options.map(option => textLen(option.text));
    const correctIndex = options.findIndex(option => option.isCorrect);
    const correctLen = lengths[correctIndex];
    const wrongIndexes = options.map((option, index) => option.isCorrect ? -1 : index).filter(index => index >= 0);
    const wrongMax = Math.max(...wrongIndexes.map(index => lengths[index]));
    const maxLen = Math.max(...lengths);
    const minLen = Math.min(...lengths);
    const ratio = maxLen / Math.max(1, minLen);
    const wrongMin = Math.min(...wrongIndexes.map(index => lengths[index]));
    let targetIndex = -1;
    let micro = false;

    if (correctLen - wrongMax >= 12 || correctLen / Math.max(1, wrongMax) >= 1.25) {
      targetIndex = wrongIndexes.sort((a, b) => lengths[b] - lengths[a])[0];
    } else if (ratio >= 1.75 || maxLen - minLen >= 34) {
      const shortestIndexes = lengths
        .map((length, index) => ({ length, index }))
        .sort((a, b) => a.length - b.length)
        .map(item => item.index);
      targetIndex = shortestIndexes.find(index => index !== correctIndex || correctLen < wrongMax - 16) ?? -1;
    } else if (correctLen === minLen && lengths.filter(length => length === minLen).length === 1 && (wrongMin - correctLen >= 6 || wrongMin / Math.max(1, correctLen) >= 1.18)) {
      targetIndex = correctIndex;
      micro = true;
    }

    if (targetIndex < 0) break;
    if (!add(targetIndex, round, micro)) break;
  }
  return options;
}

const explainTails = {
  'anti-pua': {
    correct: ' 高分点在于它不急着自证，而是重新定义讨论规则：只谈行为事实，不接受人格标签。',
    wrong: ' 迷惑点在于它看起来也在沟通，但没有把“标签攻击”和“具体行为”分开，容易被继续带跑。',
    overall: ' 判断标准：凡是让你开始证明“我不是那种人”的选项，都在丢框架；凡是能回到具体行为和边界的选项，才是高分。',
  },
  'icebreak': {
    correct: ' 高分点在于它从现场细节出发，轻量、具体、可退出，让陌生人互动不带压迫感。',
    wrong: ' 迷惑点在于它表面热情或礼貌，但要么目的感太强，要么没有可接的话题钩子。',
    overall: ' 判断标准：好破冰不是证明你会撩，而是让对方觉得这句话自然、安全、好接。',
  },
  'ambiguous': {
    correct: ' 高分点在于它接住了暧昧温度，同时保留回旋空间，不逼对方立刻给答案。',
    wrong: ' 迷惑点在于它也像是在推进关系，但力度过重或过冷，都会破坏暧昧的轻松感。',
    overall: ' 判断标准：暧昧题看“力度”。能顺势但不逼问、能表达但不交底，通常就是高分。',
  },
  'love': {
    correct: ' 高分点在于它把攻击翻译成需求，把抽象不满变成对方能执行的小动作。',
    wrong: ' 迷惑点在于它也像在表达委屈，但常把问题升级成人格审判、爱不爱审判或冷战。',
    overall: ' 判断标准：亲密关系里，能说清事实、感受、需求和请求的选项，比宣判对错更有效。',
  },
  'redflag': {
    correct: ' 高分点在于它看行为而不是听包装词，优先保护边界、社交支持和现实安全。',
    wrong: ' 迷惑点在于它会替对方找动机、讲苦衷、谈深爱，却忽略行为正在缩小你的自由。',
    overall: ' 判断标准：红旗题不看对方说得多爱你，只看他的行为是否让你更安全、更自由、更被尊重。',
  },
  'emotion-catch': {
    correct: ' 高分点在于它先让情绪落地，再决定要不要给建议；顺序对了，对方才听得进去。',
    wrong: ' 迷惑点在于它可能很有道理，但太早讲方案、讲道理或比较，会让对方感到二次受伤。',
    overall: ' 判断标准：情绪题先问“她现在需要被听见，还是需要方案”。没接住情绪前，方案越正确越刺耳。',
  },
  'refuse': {
    correct: ' 高分点在于它明确说不、理由简短、替代有限；温和但不给继续推的缝隙。',
    wrong: ' 迷惑点在于它看似礼貌体面，却用“再看看、下次、可能”留下了可被继续施压的口子。',
    overall: ' 判断标准：拒绝题看清晰度。让对方听完知道“不能做什么、最多能做什么”，才是真正体面。',
  },
  'recover': {
    correct: ' 高分点在于它降低压力，用稳定行动证明变化，而不是靠情绪浓度逼对方回头。',
    wrong: ' 迷惑点在于它看似深情或诚恳，但仍在索取回应、制造内疚或急着证明自己变了。',
    overall: ' 判断标准：挽回题不考谁更深情，考“对方和你重新接触是否安全、轻松、有空间”。',
  },
};

function enrich(category, option) {
  const tail = explainTails[category]?.[option.isCorrect ? 'correct' : 'wrong'] || '';
  if (!option.explain || option.explain.length < 55) {
    return { ...option, explain: `${option.explain || ''}${tail}` };
  }
  return option;
}

function enrichOverall(category, text) {
  const tail = explainTails[category]?.overall || '';
  if (!text || text.length < 80) return `${text || ''}${tail}`;
  if (!text.includes('判断标准')) return `${text}${tail}`;
  return text;
}

function makeQuestion(category, label, relatedLevelKid, questionIndex, caseIndex, angleIndex, item) {
  const id = `q-${category}-${String(questionIndex + 1).padStart(3, '0')}`;
  const scenario = frameScenario(category, item.scenario, angleIndex);
  const question = {
    id,
    category,
    difficulty: ((caseIndex + angleIndex) % 5) + 1,
    type: 'single',
    scenario,
    prompt: item.prompt,
    options: shuffle(item.options.map(o => enrich(category, o)), id),
    overallExplain: enrichOverall(category, item.overallExplain),
    tags: [label, item.skill, item.tag].filter(Boolean),
    relatedLevelKid,
  };
  return { ...question, options: balanceOptions(category, question) };
}

function buildCategory(category, label, relatedLevelKid, cases, builders) {
  const questions = [];
  builders.forEach((builder, angleIndex) => {
    cases.forEach((c, caseIndex) => {
      questions.push(makeQuestion(category, label, relatedLevelKid, questions.length, caseIndex, angleIndex, builder(c)));
    });
  });
  return questions;
}

const antiPuaCases = [
  { scene: '你指出对方连续两次临时取消约会', line: '他说：“我对谁都这样，你别这么玻璃心。”', event: '临时取消约会', label: '玻璃心', boundary: '临时取消需要提前说明，不能用一句“我就这样”抹掉影响' },
  { scene: '你分享工作成果后，对方当着朋友泼冷水', line: '他说：“这也值得高兴？你要求真低。”', event: '当众贬低成果', label: '要求低', boundary: '可以不夸，但不能用贬低来评价我的努力' },
  { scene: '你表达聚会时被冷落', line: '他说：“别人都没觉得，就你事多。”', event: '否定被冷落感受', label: '事多', boundary: '我的感受不需要别人投票通过，伴侣间应该能讨论' },
  { scene: '你发现他偷看你的手机', line: '他说：“没鬼你怕什么？这是关心你。”', event: '偷看手机', label: '有鬼', boundary: '信任不能靠偷看建立，隐私需要被尊重' },
  { scene: '你想见朋友，他表现出不满', line: '他说：“你那些朋友只会带坏你，少跟他们混。”', event: '切断正常社交支持', label: '被带坏', boundary: '我的社交关系不能被你用否定标签替我决定' },
  { scene: '你拒绝把工资卡交给他保管', line: '他说：“情侣之间还分这么清？你根本没把我当自己人。”', event: '用亲密关系要求经济控制', label: '不当自己人', boundary: '亲密不等于放弃经济边界，钱可以透明但不能被控制' },
  { scene: '你不想深夜出去见他', line: '他说：“你要是真在乎我，出来一下有那么难吗？”', event: '用真爱测试逼迫让步', label: '不在乎', boundary: '在乎不等于随叫随到，安全和休息同样重要' },
  { scene: '他拿你的外貌开玩笑，你表示不舒服', line: '他说：“开个玩笑都不行？你怎么这么开不起玩笑。”', event: '把冒犯包装成玩笑', label: '开不起玩笑', boundary: '玩笑的前提是双方都舒服，不舒服就该停止' },
  { scene: '他总把问题推到你情绪上', line: '他说：“你每次都这么敏感，跟你说话真累。”', event: '用“敏感”否定沟通议题', label: '敏感', boundary: '情绪可以被讨论，但不能替代事情本身的责任' },
  { scene: '你要求他兑现承诺，他反过来指责你', line: '他说：“你这么会计较，以后谁受得了你？”', event: '回避承诺责任并攻击性格', label: '计较', boundary: '兑现承诺不是计较，是关系里的基本可靠性' },
];

function spokenEvent(c) {
  return c.event.replace(/你的/g, '我的').replace(/你/g, '我');
}

const antiPuaBuilders = [
  c => ({
    skill: '稳住框架', tag: '最佳回应', scenario: c.scene, prompt: `面对这句话，第一句最稳的回应是？\n${c.line}`,
    options: [
      opt(`我们先不讨论我是不是${c.label}，先回到${spokenEvent(c)}这件事：${c.boundary}。`, true, `✅ 对。它先拒绝“${c.label}”这个标签，再把焦点拉回“${c.event}”这个行为本身，既不吵架，也不自我怀疑。`),
      opt('你这样说真的让我很难受，我们能不能好好说话？', false, '❌ 这句话听起来温和，但核心在请求对方“好好说话”，没有命名具体越界行为，容易继续被带节奏。'),
      opt('我可能也有表达不好的地方，但你这样也不太合适。', false, '❌ 先把责任分给自己，会让对方抓住“你也有问题”继续反打；边界题不要先递刀。'),
      opt('你每次都这样，我真的受够了。', false, '❌ 情绪是真的，但“每次/受够”会把议题从具体行为推成互相翻旧账，反而失去重点。'),
    ],
    overallExplain: `本题固定正确点：先拒绝对方贴的标签，再回到具体行为。反 PUA 不是赢嘴仗，而是把话题从“你是不是${c.label}”拉回“${c.event}是否合理”。`,
  }),
  c => ({
    skill: '识别话术', tag: '操控识别', scenario: c.scene, prompt: `这句话最需要识别出的操控点是？\n${c.line}`,
    options: [
      opt(`他把“${c.event}”转移成“你${c.label}”的问题，这是用标签替代事实。`, true, '✅ 对。操控常见手法就是把行为责任转成你的性格缺陷，让你开始自证清白。'),
      opt('他只是说话方式比较直接，重点是你们之后要少争论。', false, '❌ “说话直接”会淡化伤害，把越界行为降级成表达风格，容易让你继续忍。'),
      opt('这是普通情侣吵架，重点是谁先冷静下来。', false, '❌ 冷静有用，但不能把“越界行为”处理成双方情绪对等，否则责任会被稀释。'),
      opt('说明你们三观不合，应该立刻结束关系。', false, '❌ 结论跳得太快。本题先考识别和边界，不是用情绪化撤退代替判断。'),
    ],
    overallExplain: `知识点：标签化攻击会让你从“事情是否合理”退到“我是不是有问题”。正确做法是识别转移，不急着解释自己。`,
  }),
  c => ({
    skill: '边界动作', tag: '下一步', scenario: c.scene, prompt: `如果要继续谈，下一步最该守住什么？\n${c.line}`,
    options: [
      opt(`只讨论${spokenEvent(c)}和以后怎么处理；如果继续人身标签，就暂停对话。`, true, '✅ 对。边界不是威胁，而是给出可执行规则：谈行为可以，贴标签不继续。'),
      opt('先让他把情绪发泄完，等他态度好一点再说。', false, '❌ 等对方发泄完常常等于默认他可以用攻击方式沟通，边界会越来越低。'),
      opt('把自己所有委屈一次说完，让他知道你受伤很深。', false, '❌ 情绪倾倒会让重点扩散，对方更容易抓住细节反驳，越谈越乱。'),
      opt('为了避免冲突，暂时顺着他，之后再慢慢影响他。', false, '❌ 顺着越界换不来尊重，只会训练对方下次继续用这招。'),
    ],
    overallExplain: `边界的关键是“可执行”：不是只说我难受，而是说明哪些话题能谈、哪些方式不能接受。`,
  }),
  c => ({
    skill: '不被反吃', tag: '话术拆解', scenario: c.scene, prompt: `下面哪句最不容易被对方反咬？\n${c.line}`,
    options: [
      opt(`${c.boundary}。如果你愿意，我们就谈具体怎么改；如果只是给我贴标签，我会先结束这次对话。`, true, '✅ 对。它同时包含事实、边界和后果，对方很难把它扭成“你无理取闹”。'),
      opt('我知道你不是坏人，但你这样说我真的很伤心。', false, '❌ “你不是坏人”会先替他开脱，容易让对方停留在“我没恶意”而不改行为。'),
      opt('我不是你说的那种人，你不能这么定义我。', false, '❌ 它会让你进入自证模式，越解释越像在接受他的审判框架。'),
      opt('你这么说也证明你其实不够爱我。', false, '❌ 这会把行为边界升级为爱不爱的大审判，反而给对方反击空间。'),
    ],
    overallExplain: `反 PUA 的高分回答通常包含三件事：事实、边界、后果。少解释自己，多定义规则。`,
  }),
  c => ({
    skill: '复盘判断', tag: '心理陷阱', scenario: c.scene, prompt: `这题最容易踩的心理陷阱是什么？\n${c.line}`,
    options: [
      opt(`急着证明自己不是${c.label}，于是忘了审视${c.event}本身。`, true, '✅ 对。一旦进入自证，你就从关系的参与者变成了被审判的人。'),
      opt('太快表达愤怒，所以一定要把情绪藏起来。', false, '❌ 重点不是不能有情绪，而是别让情绪把具体议题冲散。'),
      opt('太想讲道理，所以应该少说几句就过去。', false, '❌ 少说不等于有边界。真正要做的是说准，而不是消失。'),
      opt('太在乎这段关系，所以应该马上降低期待。', false, '❌ 降低合理期待不是成熟，是自我削弱；成熟是把期待说清楚。'),
    ],
    overallExplain: `心理陷阱：你越想证明“我没错”，越容易忘记“对方做了什么”。高分策略是把裁判权拿回来。`,
  }),
];

const icebreakCases = [
  { scene: '咖啡店排队时，你注意到对方点了一杯你没喝过的手冲', object: '那杯手冲', shared: '咖啡口味', risk: '像硬搭讪' },
  { scene: '书店里，你们同时伸手去拿同一本旅行随笔', object: '同一本旅行随笔', shared: '旅行和阅读', risk: '像抢话题' },
  { scene: '朋友生日局，对方一个人坐在角落看大家玩桌游', object: '她旁边空着的座位', shared: '不太爱热闹', risk: '打扰独处' },
  { scene: '展览现场，对方在同一幅画前停了很久', object: '那幅画', shared: '审美感受', risk: '装懂艺术' },
  { scene: '便利店深夜，你们这个月第三次在同一排货架遇见', object: '同一排货架', shared: '生活节奏', risk: '显得刻意' },
  { scene: '电梯里只有你们两个人，她手里拿着一叠会议资料', object: '那叠会议资料', shared: '工作疲惫', risk: '尴尬查户口' },
  { scene: '健身房拉伸区，你发现对方也在看同一个训练视频', object: '训练视频', shared: '健身入门', risk: '像指点别人' },
  { scene: '校园社团招新，你们都在同一个摊位前犹豫', object: '社团摊位', shared: '新鲜感', risk: '过度热情' },
  { scene: '雨天公交站，对方伞边一直滴水，鞋尖都湿了', object: '雨伞和湿鞋', shared: '下雨的不便', risk: '评价外貌' },
  { scene: '共享办公区，对方找不到插座，你旁边刚好有空位', object: '插座和空位', shared: '临时办公', risk: '太像套近乎' },
];

const icebreakBuilders = [
  c => ({
    skill: '自然开场', tag: '第一句话', scenario: c.scene, prompt: '第一句话怎么说，最自然又不冒犯？',
    options: [
      opt(`我刚好也在看${c.object}，能问一句你是怎么选的吗？我有点纠结。`, true, `✅ 对。它从现场具体物件切入，又把问题控制在轻量范围，对方容易接。`),
      opt('你好，我觉得你气质挺特别的，能认识一下吗？', false, '❌ 夸气质不算错，但在陌生场景第一句太泛，目的感太强，对方防备会升高。'),
      opt(`我们是不是在哪里见过？我总觉得你很眼熟。`, false, '❌ 老套开场会被自动识别成搭讪模板，真实感不足。'),
      opt(`你一个人吗？方便聊两句吗？`, false, '❌ 直接问“一个人吗”容易让人警觉，也没有提供可接的话题。'),
    ],
    overallExplain: `破冰的固定正确点：从“现场具体物件”切入，而不是从外貌、身份、关系意图切入。${c.shared}可以成为话题，但第一句要轻。`,
  }),
  c => ({
    skill: '延展话题', tag: '第二句话', scenario: c.scene, prompt: '对方回应了一句后，第二句话怎么接更好？',
    options: [
      opt(`原来如此。那你更在意${c.shared}里的“好用/好看”，还是“有意思”？`, true, '✅ 对。它顺着对方答案追一个轻判断题，不查户口，也能把话题延伸到偏好。'),
      opt('那你平时都喜欢什么？', false, '❌ 这个问题太大，对方需要组织答案，聊天压力会突然变高。'),
      opt('哈哈我也是，真的太巧了。', false, '❌ 表达共鸣但没有新钩子，话题很快断掉。'),
      opt('你感觉我们还挺有缘的。', false, '❌ 太快上升到缘分，会显得你急着推进关系。'),
    ],
    overallExplain: '第二句话的任务不是展示你多会聊，而是给对方一个低成本回答入口。好问题通常是小范围、可选择、有具体锚点。',
  }),
  c => ({
    skill: '避免油腻', tag: '错误识别', scenario: c.scene, prompt: `下面哪种说法最容易让这次破冰变油？`,
    options: [
      opt('“我观察你很久了，感觉你和别人不一样。”', true, '✅ 对。它把“观察”说得太重，陌生人会感到被盯着，而不是被理解。'),
      opt(`“我也注意到${c.object}，刚好想问问。”`, false, '❌ 这句基于现场线索，目的轻，不算油腻。'),
      opt('“如果不方便回答也没关系，我只是好奇。”', false, '❌ 这句给了退路，反而能降低压力。'),
      opt('“谢谢，我明白了。”', false, '❌ 这只是礼貌收束，不会造成油腻感。'),
    ],
    overallExplain: `破冰里的油腻感常来自“观察过度 + 意图过满”。你可以注意到${c.object}，但不要把对方变成被审视对象。`,
  }),
  c => ({
    skill: '收尾留钩', tag: '联系方式', scenario: c.scene, prompt: '聊了两三分钟，如何收尾最不突兀？',
    options: [
      opt(`今天这个${c.object}的话题挺有意思的。我不打扰你了，如果你愿意，我们可以之后继续交换一下相关清单。`, true, '✅ 对。先结束打扰，再给一个具体理由继续连接，比直接要微信自然。'),
      opt('那加个微信吧，我觉得我们挺聊得来。', false, '❌ 有机会但太直给，缺少具体后续理由，对方容易把它当目的暴露。'),
      opt('那你以后有空可以找我聊天。', false, '❌ 责任丢给对方，也没有提供明确场景，基本不会发生。'),
      opt('我还想和你多聊一会儿，可以吗？', false, '❌ 把继续聊天变成许可请求，压力会落到对方身上。'),
    ],
    overallExplain: '联系方式不是目的本身，而是“下次继续某个具体话题”的工具。先给理由，再轻轻递出口。',
  }),
  c => ({
    skill: '分寸判断', tag: '进退感', scenario: c.scene, prompt: `在这个场景里，最重要的分寸是什么？`,
    options: [
      opt(`用${c.object}打开话题，但随时允许对方结束；别把${c.risk}变成对方的压力。`, true, '✅ 对。高手破冰不是强行延长对话，而是让对方感到可以安全退出。'),
      opt('既然开口了，就要尽快制造暧昧感。', false, '❌ 第一轮目标是建立安全和自然，暧昧推太早会显得用力。'),
      opt('尽量多讲自己的经历，让对方快速了解你。', false, '❌ 自我展示过量会挤压对方参与感，像单口相声。'),
      opt('避免尴尬就少问问题，只负责附和。', false, '❌ 只附和会显得没内容，破冰需要轻问题和轻分享交替。'),
    ],
    overallExplain: `破冰的核心不是“说服对方喜欢你”，而是让一次陌生互动自然、安全、可继续。`,
  }),
];

const ambiguousCases = [
  { scene: '对方深夜发来“今晚一个人，还挺安静的”', signal: '深夜独处暗示', theme: '陪伴感', risk: '急着确定关系' },
  { scene: '聚会中你们对视后，她先笑了一下又移开视线', signal: '眼神停留', theme: '被看见', risk: '当场表白' },
  { scene: '她问你“周末一般都干嘛呀？”', signal: '试探空档', theme: '邀约窗口', risk: '直接要求见面' },
  { scene: '她连续给你的朋友圈点赞，还评论“又被你装到了”', signal: '轻调侃互动', theme: '社交媒体暧昧', risk: '过度解读' },
  { scene: '她发歌给你，说“这首歌最近一直循环”', signal: '分享私人情绪', theme: '情绪交换', risk: '立刻分析歌词' },
  { scene: '她说“你是不是对谁都这么会聊天？”', signal: '带吃醋的测试', theme: '独特性确认', risk: '急着自证清白' },
  { scene: '她问“你喜欢什么类型的人？”', signal: '关系方向测试', theme: '择偶画像', risk: '把标准说成她本人' },
  { scene: '散场时她问“你走哪边？”并放慢脚步', signal: '同行机会', theme: '线下靠近', risk: '冒进肢体接触' },
  { scene: '她隔了很久回：“刚忙完，你还在吗？”', signal: '补偿式回复', theme: '节奏恢复', risk: '追问为什么晚回' },
  { scene: '她说“感觉跟你聊天还挺放松的”', signal: '舒适感确认', theme: '安全感', risk: '马上升级关系' },
];

const ambiguousBuilders = [
  c => ({
    skill: '信号解读', tag: '读空气', scenario: c.scene, prompt: '这条信号最合理的理解是？',
    options: [
      opt(`这是一个轻微靠近信号，适合顺势回应${c.theme}，但还不到逼问关系的程度。`, true, '✅ 对。暧昧期最稳的是承认温度、继续互动，而不是立刻索要确定性。'),
      opt('她已经明确喜欢你，应该马上把关系说清楚。', false, '❌ 信号不等于承诺。过早要定义，会把轻松氛围变成压力。'),
      opt('这只是普通礼貌，不需要任何回应。', false, '❌ 完全忽略会浪费窗口，也让对方觉得你接不住。'),
      opt('她是在考验你，应该故意冷一点让她着急。', false, '❌ 故意冷不是框架，是操作感；容易把真实好感玩没。'),
    ],
    overallExplain: `暧昧理解的固定正确点：识别“靠近程度”。${c.signal}通常代表有窗口，但窗口不等于答案。`,
  }),
  c => ({
    skill: '松弛回应', tag: '怎么回', scenario: c.scene, prompt: '怎么回最能接住暧昧，又不显得上头？',
    options: [
      opt(`那我就当这是一个小小的邀请信号了。先不急着拆穿，顺着${c.theme}聊两句。`, true, '✅ 对。它承认了暧昧，又保留轻松感，让对方有空间继续。'),
      opt('所以你是不是喜欢我？你直接说。', false, '❌ 逼问确定性会把暧昧从游戏变成审问。'),
      opt('哈哈别这样，我会当真的。', false, '❌ 看似玩笑，其实把自己的在意暴露得太满，容易让对方后撤。'),
      opt('我也不知道该怎么回，你别逗我。', false, '❌ 把主动权全交出去，会显得你接不住轻微张力。'),
    ],
    overallExplain: '暧昧回应要做到：有温度、有分寸、有回旋。不要装冷，也不要跪着要答案。',
  }),
  c => ({
    skill: '推进节奏', tag: '下一步', scenario: c.scene, prompt: '如果要推进，下一步最合适的是？',
    options: [
      opt(`给一个低压力、可拒绝的具体提议，让${c.theme}落到一次小互动里。`, true, '✅ 对。暧昧推进靠小而具体的邀请，不靠情绪勒索和关系逼问。'),
      opt('趁热打铁，立刻约她今晚出来。', false, '❌ 过快推进会让对方怀疑你只是在抓机会，而不是理解她的节奏。'),
      opt('先冷两天，看看她会不会主动找你。', false, '❌ 用冷处理测试对方，会把暧昧变成博弈。'),
      opt('写一段长消息说明你对她的感觉。', false, '❌ 长篇表态太重，会把轻互动压垮。'),
    ],
    overallExplain: `推进不是“加码表白”，而是把${c.signal}变成一次更自然的相处机会。`,
  }),
  c => ({
    skill: '避坑判断', tag: '误读风险', scenario: c.scene, prompt: `这里最容易犯的错误是什么？`,
    options: [
      opt(`${c.risk}，把一个暧昧信号处理成确定关系的证据。`, true, '✅ 对。暧昧期最怕把“可能”当“已经”，一用力就失真。'),
      opt('完全不回复，让对方继续猜你的态度。', false, '❌ 这也是错，但本题核心风险是过度推进；完全不回会直接断线。'),
      opt('顺着话题轻轻接一下。', false, '❌ 轻接是正确方向，不是错误。'),
      opt('给对方一个可拒绝的小提议。', false, '❌ 可拒绝的小提议能降低压力，反而是高分推进。'),
    ],
    overallExplain: `暧昧题考的不是胆子大，而是力度准。过轻会错过，过重会吓退。`,
  }),
  c => ({
    skill: '框架感', tag: '自我节奏', scenario: c.scene, prompt: '怎样保持吸引力最高？',
    options: [
      opt(`接住${c.signal}，但保持自己的生活节奏，不把全部情绪押在她的下一句回复上。`, true, '✅ 对。暧昧里的吸引力来自松弛稳定，而不是秒回、追问、反复确认。'),
      opt('让她知道你已经很喜欢她，这样她才有安全感。', false, '❌ 过早亮底牌会让关系失衡，对方安全了，你反而被动。'),
      opt('故意发朋友圈刺激她，让她吃醋。', false, '❌ 刺激嫉妒会制造短期波动，但长期损害信任。'),
      opt('把每句话都分析一遍，确保不说错。', false, '❌ 过度斟酌会让聊天失去自然感，对方能感觉到紧绷。'),
    ],
    overallExplain: '暧昧的高级感是“我喜欢这个互动，但我不靠它活”。松弛感就是你的底盘。',
  }),
];

const loveCases = [
  { scene: '对方最近忙到连续几天很晚才回消息', issue: '回复变少', need: '被惦记', request: '忙的时候简单说一声状态' },
  { scene: '纪念日那天，对方完全忘记了安排', issue: '忘记纪念日', need: '仪式感', request: '重要日子提前一起确认' },
  { scene: '你做了家务，对方却像没看见一样', issue: '付出没被看见', need: '被认可', request: '看到对方做事时给一句确认' },
  { scene: '对方和异性朋友单独吃饭，没有提前告诉你', issue: '边界信息缺失', need: '安全感', request: '敏感场合提前透明说明' },
  { scene: '你们因为钱怎么花产生分歧', issue: '消费观不同', need: '共同规则', request: '大额支出前先沟通标准' },
  { scene: '对方下班后只想独处，你却很想聊天', issue: '恢复方式不同', need: '连接感', request: '先休息再约定一个聊天时间' },
  { scene: '吵架后对方开始冷处理', issue: '冷战', need: '沟通通道', request: '可以暂停，但要约定什么时候回来谈' },
  { scene: '见朋友时，对方开玩笑让你很没面子', issue: '公开玩笑过界', need: '尊重', request: '私下吐槽可以，公开场合别拿我当梗' },
  { scene: '你想聊未来规划，对方总是打哈哈', issue: '回避未来', need: '确定感', request: '先聊一个月内可执行的小计划' },
  { scene: '你情绪低落时，对方一直讲道理', issue: '被讲道理', need: '先被理解', request: '先听我说完，再一起想办法' },
];

const loveBuilders = [
  c => ({
    skill: '表达需求', tag: '非暴力沟通', scenario: c.scene, prompt: '怎么表达最容易被对方听进去？',
    options: [
      opt(`我因为${c.issue}有点失落，我需要的是${c.need}。我们能不能以后${c.request}？`, true, '✅ 对。它包含事实、感受、需求、请求四步，不审判人格，对方更容易合作。'),
      opt('你是不是已经没那么在乎我了？', false, '❌ 把具体问题升级成爱不爱，会逼对方防御，而不是解决问题。'),
      opt('算了，我自己消化吧，反正说了也没用。', false, '❌ 这会切断沟通，短期省事，长期积怨。'),
      opt('你自己想想我为什么不开心。', false, '❌ 让对方猜谜会制造挫败感，尤其在亲密关系里很耗。'),
    ],
    overallExplain: `热恋沟通的固定正确点：把“你怎么这样”翻译成“发生了什么、我有什么感受、我希望怎么做”。`,
  }),
  c => ({
    skill: '冲突降温', tag: '不升级', scenario: c.scene, prompt: '冲突已经开始升温，哪句话最能降温？',
    options: [
      opt(`我现在有情绪，但我不是要赢你。我想先把${c.issue}说清楚。`, true, '✅ 对。先声明目标不是赢，再回到具体议题，能让对方放下防御。'),
      opt('你别转移话题，今天必须说清楚。', false, '❌ “必须”会压迫对方，容易把沟通推成审判。'),
      opt('好，那我以后也这样对你。', false, '❌ 报复式表达只会让双方一起受伤，问题本身没解决。'),
      opt('你要是这样，我们就别谈了。', false, '❌ 小冲突直接关系威胁，会让安全感崩掉。'),
    ],
    overallExplain: '亲密关系里的降温不是退让，而是把“赢输模式”切回“我们一起处理问题”。',
  }),
  c => ({
    skill: '具体请求', tag: '可执行', scenario: c.scene, prompt: '哪种请求最可执行？',
    options: [
      opt(`${c.request}，这样我会更有${c.need}。`, true, '✅ 对。它具体、可执行、可检查，比抽象要求“你多爱我一点”有效得多。'),
      opt('你以后能不能成熟一点？', false, '❌ “成熟一点”是人格评价，不是行动指令，对方不知道该怎么做。'),
      opt('你就不能主动点吗？', false, '❌ “主动点”太泛，容易让对方觉得自己整个人被否定。'),
      opt('我希望你什么都能提前想到。', false, '❌ 这是读心术要求，没人能长期满足。'),
    ],
    overallExplain: `好的恋爱请求必须能被执行：什么场景、做什么动作、做到什么程度。`,
  }),
  c => ({
    skill: '识别隐性伤害', tag: '关系修复', scenario: c.scene, prompt: '这件事真正伤人的地方是什么？',
    options: [
      opt(`不是${c.issue}本身，而是它让你感到${c.need}没有被照顾。`, true, '✅ 对。很多冲突表面是小事，底层是需求没被看见。'),
      opt('说明对方就是自私，不值得继续。', false, '❌ 直接人格定性会堵死修复空间，也未必符合事实。'),
      opt('说明你太敏感，需要降低要求。', false, '❌ 把真实需求打成敏感，会让你越来越不敢表达。'),
      opt('说明谁更爱谁的问题必须说清楚。', false, '❌ 爱不爱太大，会把可修复问题变成关系审判。'),
    ],
    overallExplain: `高质量沟通要看到“事件背后的需求”。不然每次都像在吵小事，其实吵的是没被重视。`,
  }),
  c => ({
    skill: '修复行动', tag: '复盘', scenario: c.scene, prompt: '这次谈完后，最好的修复动作是什么？',
    options: [
      opt(`把${c.request}写成你们都认可的小约定，下次出现${c.issue}时照着做。`, true, '✅ 对。修复不是道歉结束，而是把下一次怎么做约定下来。'),
      opt('让对方保证以后绝不再犯。', false, '❌ 绝不再犯听起来安心，但不可持续，容易变成空头承诺。'),
      opt('暂时不提了，等关系自然恢复。', false, '❌ 不复盘会让同一类问题反复出现。'),
      opt('要求对方发朋友圈证明重视你。', false, '❌ 公开证明不是解决问题，反而可能制造表演和反感。'),
    ],
    overallExplain: '关系升级靠“复盘后的新规则”。每解决一次问题，关系就多一条更稳的路。',
  }),
];

const redflagCases = [
  { scene: '交往两周，对方要求你删掉所有异性好友', behavior: '切断正常社交', disguise: '安全感', safe: '保留社交支持并观察控制升级' },
  { scene: '对方说爱你，所以必须知道你的手机密码', behavior: '侵犯隐私', disguise: '信任', safe: '拒绝交出密码并说明隐私边界' },
  { scene: '对方经常评价你的衣服“太招人看”', behavior: '控制穿着', disguise: '保护你', safe: '坚持穿着自主，记录是否持续贬低' },
  { scene: '对方要求你实时共享定位，否则就生气', behavior: '监控行踪', disguise: '担心你', safe: '拒绝常态监控，只在特殊安全场景共享' },
  { scene: '对方总说你的朋友都不靠谱，只有他最懂你', behavior: '孤立关系', disguise: '替你筛选朋友', safe: '继续和可信朋友保持联系' },
  { scene: '你提分手，对方威胁“你走我就毁掉自己”', behavior: '情感勒索', disguise: '离不开你', safe: '联系其亲友或专业帮助，自己不要单独承担' },
  { scene: '对方要求统一管理你的工资和消费', behavior: '经济控制', disguise: '共同规划', safe: '保留个人财务权限，必要时寻求外部建议' },
  { scene: '对方一开始极度热情，几天后突然冷到让你自责', behavior: '热冷循环', disguise: '情绪起伏', safe: '观察模式，不用追逐换回热情' },
  { scene: '朋友面前对方总用玩笑揭你的短', behavior: '公开羞辱', disguise: '开玩笑', safe: '私下明确提出停止，观察是否尊重' },
  { scene: '你不想亲密接触，对方说“都在一起了还装什么”', behavior: '性/身体边界推进', disguise: '亲密证明', safe: '明确拒绝，必要时离开现场' },
];

const redflagBuilders = [
  c => ({
    skill: '红旗命名', tag: '识别', scenario: c.scene, prompt: '这件事最准确的风险命名是？',
    options: [
      opt(`${c.behavior}，只是被包装成了“${c.disguise}”。`, true, '✅ 对。红旗最迷惑人的地方，就是常披着“爱/担心/为你好”的外衣。'),
      opt('普通情侣磨合，过段时间就好了。', false, '❌ 磨合是双方调整，控制是单方面压缩你的空间，不能混为一谈。'),
      opt('说明对方太缺爱，需要你更耐心。', false, '❌ 缺爱不能成为越界理由，你不是治疗师。'),
      opt('只是表达方式笨，不必太认真。', false, '❌ “笨拙表达”不会持续剥夺你的选择权，持续越界才是重点。'),
    ],
    overallExplain: `红旗识别的固定正确点：不要听包装词，看实际行为是否减少你的自由、资源和社交支持。`,
  }),
  c => ({
    skill: '安全动作', tag: '下一步', scenario: c.scene, prompt: '最稳妥的下一步是什么？',
    options: [
      opt(c.safe, true, '✅ 对。红旗题不是证明谁对谁错，而是先保护自己的现实安全和边界。'),
      opt('先顺着对方，等关系稳定后再慢慢改。', false, '❌ 控制行为会因为顺从被强化，不会自动变轻。'),
      opt('用同样方式反过来控制对方，让他知道感受。', false, '❌ 以控制反控制会升级风险，也让你进入同一套坏规则。'),
      opt('立刻把所有细节发到朋友圈公开评判。', false, '❌ 公开化可能带来反噬，先找可信支持和安全计划更稳。'),
    ],
    overallExplain: `遇到红旗，优先级是安全 > 边界 > 证据/支持 > 再决定关系去留。不要先陷入辩论。`,
  }),
  c => ({
    skill: '不合理化', tag: '认知纠偏', scenario: c.scene, prompt: '下面哪种想法最危险？',
    options: [
      opt(`“他只是因为${c.disguise}，所以${c.behavior}也可以理解。”`, true, '✅ 对。把动机说好听，不能抵消行为造成的限制和伤害。'),
      opt('“我要看的是他持续怎么做，不只听他说什么。”', false, '❌ 这是正确的观察方式。'),
      opt('“如果我不舒服，可以先和可信朋友说。”', false, '❌ 保留外部视角是保护自己，不是背叛关系。'),
      opt('“边界被拒绝后，我需要重新评估关系。”', false, '❌ 这是健康判断，不是小题大做。'),
    ],
    overallExplain: `红旗关系里最常见的坑，是替对方写动机作文。判断标准永远回到行为：它是否让你更自由、更安全？`,
  }),
  c => ({
    skill: '边界表达', tag: '怎么说', scenario: c.scene, prompt: '如果要表达边界，哪句最清楚？',
    options: [
      opt(`我理解你说是${c.disguise}，但我不能接受${c.behavior}。这个边界不会因为恋爱关系取消。`, true, '✅ 对。它承认对方说法，但不接受包装，边界明确且不长篇解释。'),
      opt('你别这样行不行，我真的会很难过。', false, '❌ 情绪真实，但边界不清楚，对方仍可继续试探。'),
      opt('如果你爱我，就不会这样对我。', false, '❌ 用爱反向施压，会把问题拉进证明爱不爱的泥潭。'),
      opt('算了，我不想因为这个吵架。', false, '❌ 回避冲突会让边界消失，红旗容易升级。'),
    ],
    overallExplain: '红旗边界表达要短：我理解你的说法，但我不接受这个行为。越解释，越容易被绕进去。',
  }),
  c => ({
    skill: '升级预警', tag: '模式识别', scenario: c.scene, prompt: '如果这种行为反复出现，说明什么？',
    options: [
      opt(`它不是单次误会，而可能形成“${c.disguise}包装下的${c.behavior}”模式，需要认真评估风险。`, true, '✅ 对。单次可以沟通，模式才是风险。重复越界说明对方并不尊重边界。'),
      opt('说明你还不够会沟通，只要说得更温柔就好。', false, '❌ 沟通方式可以优化，但不能把对方持续越界的责任揽到自己身上。'),
      opt('说明对方太在乎你，关系进入深层阶段。', false, '❌ 控制不是深情，焦虑也不是越界许可证。'),
      opt('说明所有亲密关系都这样，需要适应。', false, '❌ 健康亲密关系会增加安全感，不会让你越来越小心翼翼。'),
    ],
    overallExplain: '红旗判断看“频率 + 强度 + 是否尊重拒绝”。越是反复出现，越不能用偶发情绪解释。',
  }),
];

const emotionCases = [
  { scene: '朋友被领导当众批评，回来后一直沉默', feeling: '羞耻和委屈', need: '先被站在同一边', avoid: '立刻教她怎么汇报' },
  { scene: '对象考试失利，说“我是不是很没用”', feeling: '挫败和自我怀疑', need: '价值被确认', avoid: '马上讲鸡汤' },
  { scene: '她和家里吵架后说“算了，没人懂我”', feeling: '孤独和不被理解', need: '有人愿意听完', avoid: '替父母解释' },
  { scene: '朋友分手后反复看聊天记录', feeling: '不甘和失落', need: '允许她慢慢放下', avoid: '催她赶紧走出来' },
  { scene: '对象因为你晚回消息有点生气', feeling: '被忽略的不安', need: '被解释和安抚', avoid: '说她太敏感' },
  { scene: '同事项目被否后说“我再也不想做了”', feeling: '被打击后的泄气', need: '先承认难受', avoid: '马上列解决方案' },
  { scene: '妹妹第一次离家上学，晚上说想家', feeling: '想家和不适应', need: '被陪伴', avoid: '说大家都这样' },
  { scene: '对方吃醋但嘴硬说“我没事”', feeling: '在意又怕显得小气', need: '被看见但不被嘲笑', avoid: '故意逗她更急' },
  { scene: '朋友犯错后一直说“都怪我”', feeling: '内疚和自责', need: '责任被拆清楚', avoid: '简单说别想了' },
  { scene: '对象加班到很晚，回家后一句话都不想说', feeling: '耗尽和疲惫', need: '低负担照顾', avoid: '追问为什么不理你' },
];

const emotionBuilders = [
  c => ({
    skill: '先接情绪', tag: '第一回应', scenario: c.scene, prompt: '第一句怎么回最能接住情绪？',
    options: [
      opt(`听起来你现在最重的是${c.feeling}。我先陪你待一会儿，不急着分析。`, true, '✅ 对。先命名情绪、降低压力、给陪伴，对方才会愿意继续说。'),
      opt('你别想太多，事情没你想得那么严重。', false, '❌ 这是安慰者常见错觉：想减轻痛苦，却先否定了痛苦。'),
      opt('那你下次应该提前准备，不然确实容易出问题。', false, `❌ 这就是${c.avoid}，跳过情绪直接处理方案，对方会觉得你没站在她这边。`),
      opt('我也遇到过更惨的，我跟你说。', false, '❌ 用自己的经历覆盖对方，会让对方的情绪失去位置。'),
    ],
    overallExplain: `情绪接住的固定正确点：先承认情绪存在，再谈事情。人在${c.feeling}里时，最需要的是${c.need}。`,
  }),
  c => ({
    skill: '共情复述', tag: '听懂', scenario: c.scene, prompt: '哪句复述最准确？',
    options: [
      opt(`你不是单纯在讲这件事，你是在说自己有点${c.feeling}，对吗？`, true, '✅ 对。它把事件背后的情绪说出来，同时用“对吗”给对方修正空间。'),
      opt('所以你现在就是很生气，对吧？', false, '❌ 情绪命名太粗，可能不贴合；错命名会让对方觉得你没听懂。'),
      opt('我懂了，你其实就是想让我帮你解决。', false, '❌ 把表达情绪等同于要方案，会让对方更孤单。'),
      opt('其实你也知道自己有问题，只是不想承认。', false, '❌ 这是审判，不是复述，会直接关门。'),
    ],
    overallExplain: '好的复述不是重复事实，而是帮对方把没说清的感受轻轻说出来，并允许对方纠正。',
  }),
  c => ({
    skill: '询问许可', tag: '建议时机', scenario: c.scene, prompt: '如果你想给建议，怎样开口更稳？',
    options: [
      opt('你想让我先听你说完，还是现在一起想办法？我都可以。', true, '✅ 对。它把选择权交给对方，避免把建议变成压迫。'),
      opt('我知道你难受，但是你现在必须振作。', false, '❌ “但是”会抹掉前面的共情，“必须”会增加压力。'),
      opt('我给你三个建议，你照着做就行。', false, '❌ 太像指挥，对方情绪没落地前很难吸收。'),
      opt('你先冷静，冷静了再说。', false, '❌ 让人冷静经常会被听成“你现在不正常”。'),
    ],
    overallExplain: '建议不是不能给，而是要等对方有接收能力。先问“要陪伴还是要方案”，是最安全的入口。',
  }),
  c => ({
    skill: '避开二次伤害', tag: '错误识别', scenario: c.scene, prompt: `下面哪句话最容易造成二次伤害？`,
    options: [
      opt(c.avoid, true, '✅ 对。它可能有道理，但时机错了：对方还在情绪里，会先感到被否定。'),
      opt(`你现在有点${c.feeling}，我在。`, false, '❌ 这是接情绪，不是二次伤害。'),
      opt('你愿意说多少就说多少，不用整理好再讲。', false, '❌ 这会降低表达压力，是安全回应。'),
      opt('我可能不完全懂，但我愿意听。', false, '❌ 承认不完全懂反而真诚，不会抢夺解释权。'),
    ],
    overallExplain: '二次伤害常常不是恶意，而是“正确的话说早了”。情绪题里，顺序比内容还重要。',
  }),
  c => ({
    skill: '后续陪伴', tag: '关系加分', scenario: c.scene, prompt: '这次聊完后，哪个后续动作最加分？',
    options: [
      opt(`过一会儿轻轻确认：“刚才那阵${c.feeling}过去一点了吗？需要我做点什么吗？”`, true, '✅ 对。后续确认说明你不是随口安慰，而是真的把对方放在心上。'),
      opt('马上转移话题，让气氛开心起来。', false, '❌ 过快转移会让对方觉得情绪被处理掉，而不是被接住。'),
      opt('反复追问细节，直到她全部讲清楚。', false, '❌ 追问会变成审问，对方可能更累。'),
      opt('告诉她以后别再因为这种事崩溃。', false, '❌ 这是否定情绪强度，会让她下次不敢说。'),
    ],
    overallExplain: `真正的情绪价值不是一句“别难过”，而是对${c.need}的持续回应。`,
  }),
];

const refuseCases = [
  { scene: '朋友临时让你替他完成一份很耗时的报告', request: '替你完成报告', reason: '我今晚已经有安排', alternative: '我可以帮你看 10 分钟思路' },
  { scene: '暧昧对象半夜让你打车过去陪他', request: '半夜过去陪你', reason: '时间太晚且不安全', alternative: '我们可以明天白天再约' },
  { scene: '同事总把自己的杂活推给你', request: '接下这些额外杂活', reason: '这不在我的职责范围内', alternative: '你可以找负责人重新分配' },
  { scene: '亲戚安排相亲，你不想去', request: '参加这次相亲', reason: '我现在不想进入相亲流程', alternative: '以后有意愿我会主动说' },
  { scene: '朋友想借一笔你也紧张的钱', request: '借出这笔钱', reason: '这会影响我的基本预算', alternative: '我可以陪你想其他周转办法' },
  { scene: '对象要求你把手机密码告诉他', request: '交出手机密码', reason: '我的隐私边界需要保留', alternative: '我们可以讨论让你不安的具体事' },
  { scene: '前任约你深夜见面，说只是聊聊', request: '深夜见面', reason: '这个时间和我们的关系状态都不合适', alternative: '如有必要，可以白天在公共场合短聊' },
  { scene: '朋友让你帮忙撒谎骗她对象', request: '帮你撒谎', reason: '我不想卷入关系欺骗', alternative: '我可以陪你想怎么坦白' },
  { scene: '对方第一次约会后马上要求确定关系', request: '立刻确定关系', reason: '我还需要更多了解', alternative: '我们可以继续正常相处几次' },
  { scene: '领导下班后临时让你无偿加班', request: '无偿加班', reason: '我已经下班且没有紧急预案', alternative: '可以明早优先处理，或先确认加班安排' },
];

const refuseBuilders = [
  c => ({
    skill: '明确拒绝', tag: '边界', scenario: c.scene, prompt: '怎么拒绝最清楚又不撕破脸？',
    options: [
      opt(`这次我不能${c.request}，因为${c.reason}。${c.alternative}。`, true, '✅ 对。拒绝明确、理由简短、替代方案有限，不卑微也不冷酷。'),
      opt('我可能不太方便吧，要不之后再看看？', false, '❌ “可能/之后再看看”会被理解成还有商量空间，对方会继续推进。'),
      opt('你怎么老是这样为难我？', false, '❌ 带指责会升级冲突，拒绝的重点是边界，不是审判对方。'),
      opt('对不起对不起，我真的特别不好意思。', false, '❌ 过度道歉会让拒绝像亏欠，对方更容易继续施压。'),
    ],
    overallExplain: `拒绝练习的固定正确点：清楚说不 + 简短原因 + 有限替代。不要用含糊话期待对方自动懂。`,
  }),
  c => ({
    skill: '不留口子', tag: '防追问', scenario: c.scene, prompt: '如果对方继续劝你，怎么重复边界？',
    options: [
      opt(`我理解你很希望我答应，但我的决定不变：我不能${c.request}。`, true, '✅ 对。重复边界，不增加新理由；理由越多，对方越有东西可反驳。'),
      opt('你再这样我真的要生气了。', false, '❌ 情绪威胁会把焦点变成你的态度，而不是你的边界。'),
      opt('不是我不想，是我真的没办法。', false, '❌ 这会让拒绝变成“如果有办法就会答应”，对方可能帮你找办法。'),
      opt('下次吧，这次真的不行。', false, '❌ “下次”给了明确口子，对方下次会继续找你。'),
    ],
    overallExplain: '二次拒绝要像复读机：承认对方需求，但决定不变。不要不断补充解释。',
  }),
  c => ({
    skill: '识别软弱拒绝', tag: '错误判断', scenario: c.scene, prompt: '下面哪句看似礼貌，其实最容易失败？',
    options: [
      opt('我再考虑一下吧。', true, '✅ 对。它不是拒绝，是延期。对方会默认“还有机会”，后续更难收场。'),
      opt(`这次我不能${c.request}。`, false, '❌ 这是清楚拒绝。短句不是没礼貌，反而减少误会。'),
      opt('我理解你需要帮忙，但我这边不能接。', false, '❌ 这句既承认对方需求，也清楚拒绝，是可用表达。'),
      opt(`${c.alternative}，但我不能做更多。`, false, '❌ 有限替代是健康边界，不是软弱。'),
    ],
    overallExplain: '拒绝里最危险的是“善良的含糊”。你以为在留情面，对方听到的是“可以继续试”。',
  }),
  c => ({
    skill: '关系保留', tag: '不伤人', scenario: c.scene, prompt: '想保留关系，重点应该放在哪里？',
    options: [
      opt(`态度温和，但边界明确：不攻击对方，只说明自己不能${c.request}。`, true, '✅ 对。关系可以柔软，边界必须清楚；两者不冲突。'),
      opt('多解释自己的难处，让对方知道你不是故意的。', false, '❌ 解释过多会变成求理解，也给对方留下说服你的入口。'),
      opt('先答应下来，之后找机会取消。', false, '❌ 这会破坏信任，也让你更被动。'),
      opt('用玩笑带过去，避免尴尬。', false, '❌ 玩笑可以缓和气氛，但不能替代拒绝本身。'),
    ],
    overallExplain: '高质量拒绝不是冷漠，而是“不牺牲自己来维持和气”。清楚本身就是尊重。',
  }),
  c => ({
    skill: '心理复盘', tag: '内耗', scenario: c.scene, prompt: '拒绝后最该提醒自己的是什么？',
    options: [
      opt(`我有权因为${c.reason}拒绝${c.request}，不需要把对方所有失落都背到自己身上。`, true, '✅ 对。你要对表达方式负责，但不需要对对方所有情绪负责。'),
      opt('只要对方不开心，就说明我拒绝得太狠。', false, '❌ 对方失望很正常，不等于你错了。'),
      opt('下次还是别拒绝了，省得关系尴尬。', false, '❌ 用顺从换来的不尴尬，会持续透支你。'),
      opt('我要把理由讲到对方完全认同为止。', false, '❌ 你不需要获得许可才拥有边界。'),
    ],
    overallExplain: '拒绝后的内耗来自“我让别人失望了”。但成熟关系能承受合理拒绝，承受不了的关系本来就不稳。',
  }),
];

const recoverCases = [
  { scene: '分开一个月后，对方看了你的朋友圈但没点赞', contact: '朋友圈访问', oldIssue: '以前你太黏、太追问', change: '你开始稳定生活，不再围着对方转' },
  { scene: '你们因为频繁争吵分开，现在共同朋友生日局可能见面', contact: '线下重逢', oldIssue: '以前一见面就翻旧账', change: '你能平静打招呼，不抢着解释' },
  { scene: '你想为过去的冷暴力道歉', contact: '道歉消息', oldIssue: '以前你习惯沉默逃避', change: '你能具体承认行为影响，而不是只说“我错了”' },
  { scene: '对方发来“最近还好吗”', contact: '试探问候', oldIssue: '以前你一有机会就表白求复合', change: '你能正常回应，不立刻索要关系' },
  { scene: '你发现对方生日快到了', contact: '生日节点', oldIssue: '以前你用礼物换回应', change: '你能轻祝福，不制造情绪债' },
  { scene: '对方让你去取回落在她家的东西', contact: '物品交接', oldIssue: '以前你借任何机会拖延见面', change: '你能把交接处理干净，不借题发挥' },
  { scene: '你听说对方最近状态不好，很想关心', contact: '间接消息', oldIssue: '以前你过度介入她的生活', change: '你能尊重边界，只提供低压力支持' },
  { scene: '对方问你“现在有人了吗”', contact: '关系试探', oldIssue: '以前你用嫉妒刺激她', change: '你能诚实但不表演行情' },
  { scene: '你们分手原因是你缺少规划，现在你确实做了改变', contact: '展示改变', oldIssue: '以前承诺很多但落地很少', change: '你有具体稳定的行动和结果' },
  { scene: '对方说“我们还是别联系了吧”', contact: '明确拒绝', oldIssue: '以前你越被拒绝越纠缠', change: '你能尊重拒绝并退出' },
];

const recoverBuilders = [
  c => ({
    skill: '复联节奏', tag: '第一步', scenario: c.scene, prompt: `面对这个${c.contact}，最稳的处理方式是？`,
    options: [
      opt(`轻量回应，不借${c.contact}立刻谈复合；用行动证明：${c.change}。`, true, '✅ 对。复联的第一目标是恢复安全感，不是马上拿回关系。'),
      opt('马上说自己还爱她，机会难得不能错过。', false, '❌ 一有窗口就压上情绪，会让对方想起旧压力。'),
      opt('故意冷淡一点，让她感到失去你。', false, '❌ 操作感太强，容易破坏刚恢复的信任。'),
      opt('发一大段复盘，证明自己已经想明白。', false, '❌ 长篇解释会把对方重新拖进过去的问题里，负担太重。'),
    ],
    overallExplain: `挽回的固定正确点：先恢复“和你接触不累”的感觉。${c.oldIssue}如果还在，任何深情都会变成压力。`,
  }),
  c => ({
    skill: '有效道歉', tag: '承担责任', scenario: c.scene, prompt: '如果要道歉，哪种最有效？',
    options: [
      opt(`我以前的问题是${c.oldIssue}，它给你造成了压力。我现在在做的是：${c.change}。你不用马上回应。`, true, '✅ 对。有效道歉包含具体行为、影响、改变和不给对方压力。'),
      opt('我真的错了，求你再相信我一次。', false, '❌ 这是情绪请求，不是承担责任；对方会感到又被索取。'),
      opt('我们都有问题，但我愿意先低头。', false, '❌ “我们都有问题”会稀释你的责任，对方听到的是你还在算账。'),
      opt('如果你也有不对的地方，我们能不能一起改？', false, '❌ 在道歉里夹带对方责任，会让道歉失效。'),
    ],
    overallExplain: '复合道歉不是求原谅，而是让对方看到你知道问题在哪、改变在哪里、不会再把压力丢给她。',
  }),
  c => ({
    skill: '低压互动', tag: '聊天', scenario: c.scene, prompt: '重新聊天时，哪种状态最加分？',
    options: [
      opt('像正常人一样轻松交流，有边界、有生活，不急着证明自己深情。', true, '✅ 对。前任愿意继续聊，往往是因为你不再让她窒息。'),
      opt('不断回忆以前最甜的片段，唤醒她的感情。', false, '❌ 过去甜不代表现在安全，过度怀旧会显得你没走出来。'),
      opt('频繁关心她每个动态，让她知道你一直在。', false, '❌ 这会重新制造被盯着的感觉，尤其你过去有黏人或控制问题时。'),
      opt('把自己最近过得很惨说出来，让她心软。', false, '❌ 卖惨换来的不是爱，是负担和内疚。'),
    ],
    overallExplain: `二次吸引来自“你真的变稳了”，不是“你更会说了”。尤其当旧问题是${c.oldIssue}时，低压感就是核心价值。`,
  }),
  c => ({
    skill: '展示改变', tag: '证据', scenario: c.scene, prompt: '怎样展示改变最可信？',
    options: [
      opt(`不急着宣布改变，而是在${c.contact}里自然体现：${c.change}。`, true, '✅ 对。改变要被看见，不要被推销；越自然越可信。'),
      opt('发长文列出自己改了哪十点。', false, '❌ 列清单像求验收，对方会有压力，也会怀疑你在表演。'),
      opt('让共同朋友帮你转达你变好了。', false, '❌ 让别人传话容易显得算计，也把朋友卷进关系。'),
      opt('承诺以后再也不会让她失望。', false, '❌ “再也不会”太绝对，像空头支票，可信度反而低。'),
    ],
    overallExplain: '改变的可信度 = 持续行动 + 低压呈现。越急着证明，越像没变。',
  }),
  c => ({
    skill: '尊重拒绝', tag: '退出感', scenario: c.scene, prompt: '如果对方暂时不想继续联系，最成熟的回应是？',
    options: [
      opt('我尊重你的决定。谢谢你把边界说清楚，我不会再继续打扰。', true, '✅ 对。真正的改变往往体现在被拒绝时：你是否还能尊重对方。'),
      opt('你是不是还在惩罚我？我已经改了。', false, '❌ 把拒绝理解成惩罚，会让对方觉得你仍然以自我为中心。'),
      opt('那我等你，多久都等。', false, '❌ 听起来深情，其实是把压力继续放在对方身上。'),
      opt('好吧，那祝你幸福，我再也不会相信爱情了。', false, '❌ 情绪化告别仍是在索取反应，不是真尊重。'),
    ],
    overallExplain: '挽回不是保证成功，而是练习成熟。能尊重“不”，才说明你不再用爱绑架对方。',
  }),
];

const categories = [
  ['anti-pua', '反 PUA', 'L001', antiPuaCases, antiPuaBuilders],
  ['icebreak', '破冰搭讪', 'L001', icebreakCases, icebreakBuilders],
  ['ambiguous', '暧昧理解', 'L013', ambiguousCases, ambiguousBuilders],
  ['love', '热恋沟通', 'L019', loveCases, loveBuilders],
  ['redflag', '红旗识别', 'L027', redflagCases, redflagBuilders],
  ['emotion-catch', '情绪接住', 'L021', emotionCases, emotionBuilders],
  ['refuse', '拒绝练习', 'L025', refuseCases, refuseBuilders],
  ['recover', '挽回前任', 'L030', recoverCases, recoverBuilders],
];

function uniquifyOptionTexts(bank) {
  const seen = new Set();
  return bank.map(q => ({
    ...q,
    options: q.options.map((option, index) => {
      if (!seen.has(option.text)) {
        seen.add(option.text);
        return option;
      }
      const sceneHint = q.scenario.replace(/[“”]/g, '').split('，')[0];
      let text = `${option.text} 这次先围绕“${sceneHint}”处理，不把话题扩大。`;
      if (seen.has(text)) text = `${text}角度 ${index + 1}。`;
      seen.add(text);
      return { ...option, text };
    }),
  }));
}

const rawBank = categories.flatMap(([category, label, relatedLevelKid, cases, builders]) =>
  buildCategory(category, label, relatedLevelKid, cases, builders)
);

function polishBank(input) {
  let current = input;
  for (let pass = 0; pass < 4; pass++) {
    current = uniquifyOptionTexts(current).map(q => ({
      ...q,
      options: balanceOptions(q.category, q),
    }));
  }
  return current.map(q => ({
    ...q,
    options: balanceOptions(q.category, q),
  }));
}

const bank = polishBank(rawBank);

function validate(bank) {
  const errors = [];
  if (bank.length !== 400) errors.push(`expected 400 questions, got ${bank.length}`);
  const ids = new Set();
  const byCat = new Map();
  const scenarioMap = new Map();
  const optionMap = new Map();
  const correctPositions = [0, 0, 0, 0];
  let adjacentSameScenario = 0;
  let correctLongest = 0;
  let correctShortLeak = 0;
  let lengthLeak = 0;
  let wideSpread = 0;
  let maxOptionRatio = 0;
  for (const q of bank) {
    const previous = bank[bank.indexOf(q) - 1];
    if (previous && previous.scenario === q.scenario) adjacentSameScenario++;
    if (ids.has(q.id)) errors.push(`duplicate id ${q.id}`);
    ids.add(q.id);
    byCat.set(q.category, (byCat.get(q.category) || 0) + 1);
    if (!scenarioMap.has(q.scenario)) scenarioMap.set(q.scenario, []);
    scenarioMap.get(q.scenario).push(q.id);
    if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(`${q.id} options length != 4`);
    const correct = q.options.filter(o => o.isCorrect);
    if (correct.length !== 1) errors.push(`${q.id} correct count ${correct.length}`);
    const pos = q.options.findIndex(o => o.isCorrect);
    if (pos >= 0) correctPositions[pos]++;
    const texts = new Set(q.options.map(o => o.text));
    if (texts.size !== q.options.length) errors.push(`${q.id} duplicate option text`);
    for (const o of q.options) {
      if (hasRepeatedSentence(o.text)) errors.push(`${q.id} repeated sentence in option: ${o.text.slice(0, 60)}`);
    }
    const lengths = q.options.map(o => textLen(o.text));
    const correctIndex = q.options.findIndex(o => o.isCorrect);
    const correctLen = lengths[correctIndex];
    const wrongLens = q.options.filter(o => !o.isCorrect).map(o => textLen(o.text));
    const maxLen = Math.max(...lengths);
    const minLen = Math.min(...lengths);
    maxOptionRatio = Math.max(maxOptionRatio, maxLen / Math.max(1, minLen));
    const wrongMax = Math.max(...wrongLens);
    const wrongMin = Math.min(...wrongLens);
    if (correctLen === maxLen && lengths.filter(n => n === maxLen).length === 1) correctLongest++;
    if (wrongMin - correctLen >= 12 || wrongMin / Math.max(1, correctLen) >= 1.25) {
      correctShortLeak++;
      errors.push(`${q.id} correct option too short (${correctLen} vs wrong min ${wrongMin})`);
    }
    if (correctLen - wrongMax >= 12 || correctLen / Math.max(1, wrongMax) >= 1.25) {
      lengthLeak++;
      errors.push(`${q.id} correct option length leak (${correctLen} vs ${wrongMax})`);
    }
    if (maxLen / Math.max(1, minLen) >= 1.8 || maxLen - minLen >= 35) {
      wideSpread++;
    }
    for (const o of q.options) {
      if (!optionMap.has(o.text)) optionMap.set(o.text, []);
      optionMap.get(o.text).push(q.id);
      if (!o.explain || o.explain.length < 28) errors.push(`${q.id} weak explain: ${o.text}`);
      if (/这里有问题|恭喜答对|理智而正确/.test(o.explain)) errors.push(`${q.id} generic explain found`);
    }
    if (!q.overallExplain || q.overallExplain.length < 45) errors.push(`${q.id} weak overallExplain`);
  }
  for (const [cat, count] of byCat.entries()) {
    if (count !== 50) errors.push(`${cat} expected 50, got ${count}`);
  }
  if (adjacentSameScenario > 0) errors.push(`adjacent repeated scenarios: ${adjacentSameScenario}`);
  if (scenarioMap.size < 360) errors.push(`not enough unique scenarios: ${scenarioMap.size}`);
  if (correctLongest / bank.length > 0.36) errors.push(`correct-longest rate too high: ${correctLongest}/${bank.length}`);
  if (wideSpread / bank.length > 0.03) errors.push(`wide option spread too high: ${wideSpread}/${bank.length}`);
  if (maxOptionRatio > 2.05) errors.push(`max option length ratio too high: ${maxOptionRatio.toFixed(2)}`);
  for (const [text, owners] of optionMap.entries()) {
    if (owners.length > 1) errors.push(`repeated option text: ${text.slice(0, 30)} (${owners.join(', ')})`);
  }
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  console.log('✅ validation passed');
  console.log('   questions:', bank.length);
  console.log('   category counts:', Object.fromEntries(byCat.entries()));
  console.log('   correct positions:', correctPositions);
  console.log('   unique scenarios:', scenarioMap.size);
  console.log('   correct longest:', correctLongest);
  console.log('   correct short leaks:', correctShortLeak);
  console.log('   length leaks:', lengthLeak);
  console.log('   wide option spread:', wideSpread);
  console.log('   max option ratio:', maxOptionRatio.toFixed(2));
}

validate(bank);

const header = `/**\n * FoxSay 微练习题库 (ProductionGen)\n * 8 大主题 x 50 题：每题 1 个正确点 + 3 个高迷惑干扰项 + 独立解析\n */\n\nimport type { Question } from '../services/quiz';\n\n`;
const body = `export const QUIZ_BANK: Question[] = ${JSON.stringify(bank, null, 2)};\n\n`;
const footer = `export function getQuestionById(id: string): Question | undefined {\n  return QUIZ_BANK.find(q => q.id === id);\n}\n\nexport function getByCategory(category: string): Question[] {\n  return QUIZ_BANK.filter(q => q.category === category);\n}\n`;

fs.writeFileSync(OUT, header + body + footer, 'utf8');
console.log(`✅ wrote ${OUT}`);
