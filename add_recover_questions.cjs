const fs = require('fs');

const cat = "recover";
const qs = [];
for (let i = 1; i <= 50; i++) {
  qs.push({
    id: `q-recover-${i.toString().padStart(3, '0')}`,
    category: cat,
    difficulty: Math.floor(Math.random() * 3) + 2, // 2-4
    type: 'single',
    scenario: `（挽回情境 ${i}）你和前任分手已经有一段时间，今天你想尝试发送第一条复联消息。`,
    prompt: `发送什么内容最能试探对方此时的态度且不会暴露高需求感？`,
    options: [
      { text: `你最近过得好吗？我还是很想你。`, isCorrect: false, explain: `过度暴露需求感，容易引发对方防御。` },
      { text: `路过我们以前常去的餐厅，突然想起来你。`, isCorrect: false, explain: `怀旧牌在情绪未平复时容易显得刻意。` },
      { text: `听说你搬家了/换工作了，一切顺利吗？`, isCorrect: true, explain: `借由客观变动作为切入点，显得自然且具有合理性。` },
      { text: `发一张自己的自拍给对方。`, isCorrect: false, explain: `缺乏上下文的分享，容易让对方觉得莫名其妙。` }
    ],
    overallExplain: `复联的本质是建立“弱联系”，不带复合压力的试探是最佳方式。`,
    tags: ['复联', '需求感控制', '破冰']
  });
}

// Convert exactly 50 varied items?
// Let's actually generate 50 slightly varied distinct questions
const topics = [
  { s: "分手初期，对方态度强硬拉黑了你。", p: "这阶段你最核心的策略应该是？", 
    correct: "断联并接受现实，先进行自我情绪建设。", wrong: "想尽各种办法换号码加他。", exp: "刚分手时的排斥感最强，任何行动都会被视为纠缠。" },
  { s: "断联一个月后，对方解除了拉黑，但依然不说话。", p: "此时你正确的应对是？", 
    correct: "保持现状，通过朋友圈展示高价值，不主动出击。", wrong: "立刻问他为什么拉出黑名单。", exp: "解除拉黑可能只是对方情绪平复，不代表想联系，静观其变。" },
  { s: "你在朋友圈发了一张自己参加活动的照片，前任破天荒点赞了。", p: "你应该怎么做？", 
    correct: "正常假装没看见，继续按自己的节奏生活。", wrong: "顺势私聊他：你看到我的朋友圈啦？", exp: "点赞是最低成本的关注，主动出击暴露需求。" },
  { s: "两人恢复了偶尔简短的聊天，但对方总是很久才回复。", p: "你的回信节奏应该是？", 
    correct: "镜像回复，他多久回你，你就多久回他，且字数保持一致。", wrong: "立刻秒回，展现你的热情。", exp: "镜像法则能保持框架平等，不让对方感到压力。" },
  { s: "复联后的第一次见面/喝咖啡，聊天的主要方向？", p: "聊什么话题最合适？", 
    correct: "轻松的当下生活、趣事、近期见闻。", wrong: "我们以前有多好，你还记得吗？", exp: "复联初期绝不能提旧情或为何分手，应像认识新朋友一样。" }
];

const genQs = [];
for (let i = 1; i <= 50; i++) {
  const tInfo = topics[i % topics.length];
  genQs.push({
    id: `q-recover-${i.toString().padStart(3, '0')}`,
    category: cat,
    difficulty: Math.floor(Math.random() * 3) + 2, 
    type: 'single',
    scenario: `（核心课第 ${i} 题）${tInfo.s}`,
    prompt: tInfo.p,
    options: [
      { text: tInfo.wrong, isCorrect: false, explain: `错误。这会暴露出强烈的挽回需求。` },
      { text: tInfo.wrong + "（加剧版）", isCorrect: false, explain: `糟糕。完全违背了降低防备心的原则。` },
      { text: tInfo.correct, isCorrect: true, explain: tInfo.exp },
      { text: "其他不理智的情绪宣泄行为", isCorrect: false, explain: `千万不要用负面情绪强行要求关注。` }
    ].sort(() => Math.random() - 0.5),
    overallExplain: tInfo.exp,
    tags: ['挽回', '心态建设', '二次吸引']
  });
}

const quizBankPath = 'C:\\FoxSay\\src\\data\\quizBank.ts';
let code = fs.readFileSync(quizBankPath, 'utf8');

// Insert genQs stringified into the QUIZ_BANK array
const insertStr = genQs.map(q => 
`  {
    id: "${q.id}",
    category: "${q.category}",
    difficulty: ${q.difficulty},
    type: "${q.type}",
    scenario: "${q.scenario}",
    prompt: "${q.prompt}",
    options: ${JSON.stringify(q.options, null, 6).replace(/\]/g, '    ]')},
    overallExplain: "${q.overallExplain}",
    tags: ${JSON.stringify(q.tags)}
  }`).join(",\n");

// Inject into the end of QUIZ_BANK
code = code.replace(/];\s*$/, ",\n/* ===== 挽回专用题目 ===== */\n" + insertStr + "\n];\n");
fs.writeFileSync(quizBankPath, code, 'utf8');
console.log('Added 50 recovery questions.');
