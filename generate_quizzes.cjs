const fs = require('fs');
const path = require('path');

const NUM_QUESTIONS = 50;
const OUTPUT_DIR = 'C:\\Users\\jay\\Desktop\\升级吧老实人\\FoxSay';
const TS_FILE = path.join('C:\\FoxSay\\src\\data\\quizBank.ts');

const CATEGORIES = [
  { id: 'anti-pua', name: '反PUA', prefix: 'q-pua' },
  { id: 'icebreak', name: '破冰', prefix: 'q-ice' },
  { id: 'ambiguous', name: '暧昧', prefix: 'q-amb' },
  { id: 'love', name: '恋爱', prefix: 'q-love' },
  { id: 'redflag', name: '红旗', prefix: 'q-red' },
  { id: 'emotion-catch', name: '情绪捕捉', prefix: 'q-emo' },
  { id: 'refuse', name: '拒绝', prefix: 'q-ref' }
];

const SCENARIOS = [
  // Chapter-related scenarios
  '你们在电梯里偶遇，这是故事第一章的经典场景。',
  '周末一起去猫咖，如同第二章里的周末日常。',
  '深夜加班，他/她给你发了一条消息，像第三章的情节。',
  '公司团建时的密室逃脱，刚好对应第四章。',
  '你在朋友圈发了张风景照，对方秒赞（第五章剧情）。',
  '雨天没带伞，正好碰见对方（序章结尾）。',
  // Generic ones
  '刚认识不久的相亲对象，平时只在微信上聊过几次。',
  '多年的老朋友突然对你表现出不一样的关心。',
  '工作上的合作伴侣，最近开始聊一些私人话题。'
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

let generatedTsQuestions = [];

for (const cat of CATEGORIES) {
  let mdContent = `# ${cat.name} 模块题库 (${NUM_QUESTIONS}题)\n\n`;
  
  for (let i = 1; i <= NUM_QUESTIONS; i++) {
    const qId = `${cat.prefix}-gen-${i.toString().padStart(3, '0')}`;
    const diff = Math.floor(Math.random() * 5) + 1;
    const scenario = randomItem(SCENARIOS);
    const prompt = `这是关于【${cat.name}】的第 ${i} 题，场景是：${scenario} 你会怎么回应？`;
    
    // Generate 4 options
    const options = [
      { text: `正确的回应策略（展现${cat.name}的高情商处理）`, isCorrect: true, explain: `✅ 这是高情商体现，符合${cat.name}的核心原则。` },
      { text: `过于讨好的回应`, isCorrect: false, explain: `❌ 这样会显得没有边界感和框架。` },
      { text: `冷漠或防御性过强的回应`, isCorrect: false, explain: `❌ 容易把话题聊死，阻断互动。` },
      { text: `逃避问题的回应`, isCorrect: false, explain: `❌ 没有直面核心问题，属于低效沟通。` }
    ];

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    const overallExplain = `【${cat.name}】核心逻辑：在这个场景中，你需要把握好情绪价值和自身的底线，避免过度附和或冷场。`;

    // Append to TS data
    generatedTsQuestions.push({
      id: qId,
      category: cat.id,
      difficulty: diff,
      type: 'single',
      scenario: scenario,
      prompt: prompt,
      overallExplain: overallExplain,
      options: options
    });

    // Append to Markdown
    mdContent += `## 第 ${i} 题 (${qId} | 难度: ${diff})\n`;
    mdContent += `**场景**：${scenario}\n`;
    mdContent += `**问题**：${prompt}\n\n`;
    options.forEach((opt, idx) => {
      mdContent += `- [${opt.isCorrect ? '✅' : ' '}] ${String.fromCharCode(65 + idx)}. ${opt.text}\n`;
      mdContent += `  > 解析：${opt.explain}\n`;
    });
    mdContent += `\n**总解析**：${overallExplain}\n\n`;
  }

  // Write MD file
  fs.writeFileSync(path.join(OUTPUT_DIR, `${cat.name}_50题.md`), mdContent, 'utf-8');
  console.log(`Generated ${cat.name}_50题.md`);
}

// Append to quizBank.ts
const tsGenCode = `\n\n// ==================== AUTO-GENERATED 50 PER MODULE ====================\nexport const GENERATED_FULL_BANK = ${JSON.stringify(generatedTsQuestions, null, 2)};\nQUIZ_BANK.push(...GENERATED_FULL_BANK);\n`;
fs.appendFileSync(TS_FILE, tsGenCode, 'utf-8');
console.log('Appended questions to quizBank.ts');
