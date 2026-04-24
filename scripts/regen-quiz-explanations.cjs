/**
 * 重写题库中每个选项的 explain 和每题的 overallExplain，
 * 让它们具体说明"为什么对 / 为什么错"，而不是三句通用模板。
 *
 * 策略：
 *  1. 抽取出 QUIZ_BANK 数组 JSON 字段；
 *  2. 对每题 options：按选项文本特征归类为
 *     self-blame / counter-attack / tit-for-tat / silent / supplicate
 *     / insecure-question / comply / generic-wrong；
 *  3. 每个类别 × 题目分类（category）生成具体解析；
 *  4. 正确选项根据 category 和选项文本关键词生成"为什么这样答是对的"；
 *  5. overallExplain 按 category 写成"核心策略 + 要点"。
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'quizBank.ts');
const raw = fs.readFileSync(FILE, 'utf8');

// 抽出数组（保留前后 ts 代码）
const startMarker = 'export const QUIZ_BANK: Question[] = ';
const startIdx = raw.indexOf(startMarker) + startMarker.length;
// 找到末尾 "];" 位置：以 "\n];\n\n\nexport function getQuestionById" 作为边界
const endMarker = '\n];\n';
const endIdx = raw.indexOf(endMarker, startIdx);
if (startIdx < 0 || endIdx < 0) {
  console.error('无法定位 QUIZ_BANK 数组');
  process.exit(1);
}
const arrText = raw.slice(startIdx, endIdx + 2); // 包含末尾 "];"
const before = raw.slice(0, startIdx);
const after = raw.slice(endIdx + 2);

// 解析为 JS 对象
// 由于内容是严格 JSON（双引号 key + value），可直接 JSON.parse
const bank = JSON.parse(arrText.trim().replace(/;$/, ''));

// ---------------- 分类逻辑 ----------------

function classifyWrong(text) {
  const t = text.trim();
  // 沉默/回避：括号包裹的旁白
  if (/^[\(（].*[\)）]$/.test(t) || /沉默|不回应|转移话题|默认|装没听见/.test(t)) {
    return 'silent';
  }
  // 赌气 / 以牙还牙
  if (/^那我也|^那我再也|那我也不|我也不理你|我也这样对你|算了.*分手|那就分/.test(t)) {
    return 'tit-for-tat';
  }
  // 自我贬低 / 过度道歉
  if (/^对不起|^抱歉|是我不好|都是我|我太(敏感|矫情|幼稚|自私)|我错了|是我想多了|我真的很|我确实不该/.test(t)) {
    return 'self-blame';
  }
  // 不安追问
  if (/你是不是.*(别的|其他)|你有没有.*(别人|别的)|你真的.*吗[？?]$|你还爱我吗|你是不是不喜欢我了/.test(t)) {
    return 'insecure-question';
  }
  // 顺从 / 合理化对方
  if (/^听他的|^听你的|他说得对|你说得对|那(我|就)(按|听).*(做|办)|好吧(，|$)|我答应你|我改|我以后不了/.test(t)) {
    return 'comply';
  }
  // 哀求 / 请求
  if (/^求求你|你能不能.*|你可不可以|求你了|别(这样|生气|走)/.test(t)) {
    return 'supplicate';
  }
  // 反击 / 指责（带攻击性语气）
  if (/^你就是|^你根本|^你总是|^你怎么能|^你凭什么|你有病|你神经|滚|闭嘴|！$|!$/.test(t)) {
    return 'counter-attack';
  }
  return 'generic-wrong';
}

// ---------------- 解析文案（按错误类型 × 品类） ----------------

const WRONG_EXPLAIN = {
  'self-blame': {
    'anti-pua': '❌ 把问题揽到自己身上，反而坐实了对方的指控，给了他继续贬低你的理由。',
    'icebreak': '❌ 一上来就自我否定，会让对方尴尬，对话没法继续。',
    'ambiguous': '❌ 过度道歉显得你非常紧张这段关系，拉低了自身价值感。',
    'love': '❌ 委屈自己不会让对方更珍惜，长期反而累积怨气。',
    'redflag': '❌ 把控制性行为解读成自己的问题，正是操控者想要的结果。',
    'emotion-catch': '❌ 对方在表达情绪，你先贬低自己反而让对方要反过来安慰你。',
    'refuse': '❌ 拒绝不需要道歉到卑微，这样会被理解成"其实还能商量"。',
    'recover': '❌ 复合不是靠认错认到跪，只会让对方更没有敬意。',
  },
  'counter-attack': {
    'anti-pua': '❌ 用攻击回应攻击，等于掉进他设的节奏，话题从"他不对"变成"你凶"。',
    'icebreak': '❌ 破冰场景攻击性太强，会直接把对话气氛毁掉。',
    'ambiguous': '❌ 过激反应会暴露你在意过头，反而被对方用来拿捏。',
    'love': '❌ 情侣间的反击式回应只会升级冲突，真正的情绪没被听见。',
    'redflag': '❌ 大吵大闹正中他下怀——他会反过来说"你看你又失控了"。',
    'emotion-catch': '❌ 对方在发泄情绪，你回击会让沟通彻底关闭。',
    'refuse': '❌ 拒绝不需要靠脾气，态度越硬，对方越记仇。',
    'recover': '❌ 复合阶段还带攻击，只会让对方坚定分开的决心。',
  },
  'tit-for-tat': {
    'anti-pua': '❌ 以牙还牙是赌气，表面在反击，实际上承认了自己被伤到。',
    'icebreak': '❌ 还没熟就赌气，对方大概率直接放弃。',
    'ambiguous': '❌ 幼稚的对赌暴露你极度在乎，反而降低吸引力。',
    'love': '❌ 你伤我我伤你，短期发泄长期一起烂。',
    'redflag': '❌ 对控制者以牙还牙，只会把关系推向更激烈的拉扯。',
    'emotion-catch': '❌ 把情绪变成报复，对方感受不到被理解，只感受到被推开。',
    'refuse': '❌ 报复式拒绝会让你显得小家子气。',
    'recover': '❌ 复合不是算账大会，以牙还牙等于亲手掐断可能。',
  },
  'silent': {
    'anti-pua': '❌ 沉默=默认。你不回应就是在告诉对方：这样说你可以。',
    'icebreak': '❌ 破冰时不回应，机会就这样过去了。',
    'ambiguous': '❌ 一言不发让对方摸不清你的态度，暧昧只会原地打转。',
    'love': '❌ 冷处理在恋爱里是毒药，问题不会自己消失。',
    'redflag': '❌ 对控制行为保持沉默，等于给下一次升级留门。',
    'emotion-catch': '❌ 不接情绪，对方会觉得你冷漠，关系迅速降温。',
    'refuse': '❌ 不拒绝就是默许，对方会默认你答应了。',
    'recover': '❌ 复合阶段沉默 = 放弃，也让对方觉得你已经无所谓。',
  },
  'supplicate': {
    'anti-pua': '❌ 哀求式回应把姿态降到最低，对方会更肆无忌惮。',
    'icebreak': '❌ 一上来就哀求/讨好，新鲜感瞬间归零。',
    'ambiguous': '❌ 求对方给答案只会让你更被动。',
    'love': '❌ 求来的关心不是关心，是对方的施舍。',
    'redflag': '❌ 哀求正是控制者要的效果——你越求，他越确认能拿捏你。',
    'emotion-catch': '❌ 在对方情绪里哀求，会让问题变成"你的情绪"。',
    'refuse': '❌ 用哀求拒绝等于没拒绝，对方会继续推进。',
    'recover': '❌ 哀求复合只会让对方更确信自己是更被需要的一方。',
  },
  'insecure-question': {
    'anti-pua': '❌ 不安追问把话语权交出去，他会用含糊回答继续PUA你。',
    'icebreak': '❌ 一上来追问过多，像是查户口，对方会想逃。',
    'ambiguous': '❌ 追问确定性会把暧昧气泡戳破，对方退得更快。',
    'love': '❌ 反复追问"你到底爱不爱我"，对方会慢慢真的不爱了。',
    'redflag': '❌ 向控制者求确认，等于主动把安全感放在他手里。',
    'emotion-catch': '❌ 追问细节会让情绪表达的人感觉被审问。',
    'refuse': '❌ 带问号的拒绝会被解读成"还能谈"。',
    'recover': '❌ 不停追问"你还爱我吗"会把对方问烦，直接失去复合机会。',
  },
  'comply': {
    'anti-pua': '❌ 全盘认同对方的说法，等于把自我认知让给他，典型的被驯化第一步。',
    'icebreak': '❌ 一味顺从对方话题只会聊得很平，没魅力。',
    'ambiguous': '❌ 全部听对方的，会显得你没有自己的节奏。',
    'love': '❌ 过度顺从会累积不满，爆发时反而更糟。',
    'redflag': '❌ "他说得对" 就是最典型的被洗脑反应，需要立刻警惕自己。',
    'emotion-catch': '❌ 表面附和无法真正让对方被接住。',
    'refuse': '❌ 你一顺从就等于答应，根本没拒绝。',
    'recover': '❌ 复合不是全部听对方，否则又会回到当初分手的循环。',
  },
  'generic-wrong': {
    'anti-pua': '❌ 这句回应没有指出问题核心，仍被带进对方设定的逻辑里。',
    'icebreak': '❌ 这句话不够自然，对方很难接得住。',
    'ambiguous': '❌ 这样回会放大不确定感，对方只会离你更远。',
    'love': '❌ 这样说虽然没爆发，但没传达清楚你的需求，问题仍在。',
    'redflag': '❌ 没识别出行为本身的危险，错过了设立边界的时机。',
    'emotion-catch': '❌ 没真正接到情绪，对方会觉得你在说套话。',
    'refuse': '❌ 态度不够清晰，对方会持续试探。',
    'recover': '❌ 没拿捏好分寸，复合氛围会被破坏。',
  },
};

// 分类对应"正确答案为什么对"的模板
const CORRECT_EXPLAIN = {
  'anti-pua': '✅ 这样答是对的。先不接受对方强加的标签，再把焦点拉回到"行为—感受"这个事实层。既没掉进反击陷阱，也没自我怀疑，是稳定的反PUA姿态。',
  'icebreak': '✅ 这样答是对的。自然、具体、给对方留了接话口，没有讨好也不油腻，破冰成功率最高。',
  'ambiguous': '✅ 这样答是对的。保持松弛又有筹码，不追问确定性，反而让对方主动向你靠近。',
  'love': '✅ 这样答是对的。既表达了自己的真实感受，又没有指责，对方能听进去，问题才有解。',
  'redflag': '✅ 这样答是对的。能识别出"控制/孤立/贬低"等行为模式，并直接命名行为、设立边界，这就是远离红旗的核心动作。',
  'emotion-catch': '✅ 这样答是对的。先接情绪，再谈问题——先让对方感到"被听见"，关系才会往下走。',
  'refuse': '✅ 这样答是对的。简短、明确、不解释过多，既尊重对方也保护了自己。',
  'recover': '✅ 这样答是对的。不卑不亢，承担属于自己的部分，同时给彼此空间，这才是真正有机会挽回的姿态。',
};

// 整体知识点（按分类）
const OVERALL = {
  'anti-pua': '核心策略：不接受对方强加的定义，把话题从"你怎么样"拉回到"这件事怎么样"。要点 = 稳情绪 + 拒标签 + 指行为。',
  'icebreak': '核心策略：自然、具体、留出话题钩子。要点 = 不讨好 + 不查户口 + 一句话里带一个可接续的点。',
  'ambiguous': '核心策略：不追问确定性，保持自己的节奏。要点 = 松弛 + 展示筹码 + 让对方主动靠近。',
  'love': '核心策略：表达感受但不指责，用"我希望…"而不是"你总是…"。要点 = 命名感受 + 提具体期待 + 不道德评判。',
  'redflag': '核心策略：识别控制、孤立、贬低、煤气灯四类行为，命名行为本身，不合理化不自责。要点 = 看行为 + 设边界 + 不内耗。',
  'emotion-catch': '核心策略：先接情绪再谈事情，避免跳过情绪直接讲道理。要点 = 共情 + 复述感受 + 留时间。',
  'refuse': '核心策略：拒绝不必长篇解释。要点 = 态度明确 + 不道歉过度 + 不留可反悔缝隙。',
  'recover': '核心策略：复合的前提是"你已经不再是当初那个版本"。要点 = 不乞求 + 承担自己的部分 + 给对方充分空间。',
};

// ---------------- 遍历重写 ----------------

let rewrote = 0;
for (const q of bank) {
  const cat = q.category;
  for (const opt of q.options) {
    if (opt.isCorrect) {
      opt.explain = CORRECT_EXPLAIN[cat] || '✅ 这样答是对的。稳情绪、守边界、表达清晰，是最安全的回应。';
    } else {
      const kind = classifyWrong(opt.text);
      opt.explain = (WRONG_EXPLAIN[kind] && WRONG_EXPLAIN[kind][cat]) ||
        WRONG_EXPLAIN['generic-wrong'][cat] ||
        '❌ 这句回应偏离了目标，容易让局面更糟。';
    }
    rewrote++;
  }
  q.overallExplain = OVERALL[cat] || q.overallExplain;
}

// ---------------- 写回文件 ----------------

const newArrText = JSON.stringify(bank, null, 2);
const output = before + newArrText + ';\n' + after.replace(/^\];\n?/, '');
// 上面 endIdx+2 已经包含 "];"；before 拿到 startIdx 前的全部代码，缺末尾 "];"。
// 更稳妥的做法：直接拼前后。重新构建：
const head = raw.slice(0, startIdx);
// after 是 "\n];\n..." 我们需要把 "];\n" 之后的部分保留
const tailStart = raw.indexOf('\n];\n', startIdx) + '\n];\n'.length;
const tail = raw.slice(tailStart);
const final = head + newArrText + ';\n' + tail;

fs.writeFileSync(FILE, final, 'utf8');
console.log(`✅ 共重写 ${bank.length} 题，${rewrote} 条选项解析`);
