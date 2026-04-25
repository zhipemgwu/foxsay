const fs = require('fs');
const path = require('path');

const BANK_PATH = path.join(__dirname, '..', 'src', 'data', 'quizBank.ts');
const OUT_DIR = 'C:\\Users\\jay\\Desktop\\升级吧老实人\\FoxSay微练习题目';

const CATEGORY_META = {
  'anti-pua': { name: '反PUA', file: '01-反PUA.md' },
  icebreak: { name: '破冰搭讪', file: '02-破冰搭讪.md' },
  ambiguous: { name: '暧昧理解', file: '03-暧昧理解.md' },
  love: { name: '热恋沟通', file: '04-热恋沟通.md' },
  redflag: { name: '红旗识别', file: '05-红旗识别.md' },
  'emotion-catch': { name: '情绪接住', file: '06-情绪接住.md' },
  refuse: { name: '拒绝练习', file: '07-拒绝练习.md' },
  recover: { name: '挽回前任', file: '08-挽回前任.md' },
};

const CATEGORY_ORDER = Object.keys(CATEGORY_META);
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function loadBank() {
  const source = fs.readFileSync(BANK_PATH, 'utf8');
  const marker = 'export const QUIZ_BANK: Question[] = ';
  const start = source.indexOf(marker);
  if (start < 0) throw new Error('QUIZ_BANK marker not found');

  const jsonStart = start + marker.length;
  const end = source.indexOf(';\n\nexport function getQuestionById', jsonStart);
  if (end < 0) throw new Error('QUIZ_BANK end marker not found');

  return JSON.parse(source.slice(jsonStart, end));
}

function groupByCategory(bank) {
  const grouped = new Map(CATEGORY_ORDER.map(category => [category, []]));
  for (const question of bank) {
    if (!grouped.has(question.category)) grouped.set(question.category, []);
    grouped.get(question.category).push(question);
  }
  return grouped;
}

function correctLetters(question) {
  return question.options
    .map((option, index) => (option.isCorrect ? LETTERS[index] : null))
    .filter(Boolean)
    .join('、');
}

function formatQuestion(question, index) {
  const optionLines = question.options
    .map((option, optionIndex) => `${LETTERS[optionIndex]}. ${option.text}`)
    .join('\n');
  const explainLines = question.options
    .map((option, optionIndex) => ({ option, optionIndex }))
    .filter(({ option }) => !option.isCorrect && option.explain)
    .map(({ option, optionIndex }) => `${LETTERS[optionIndex]}. ${option.explain}`)
    .join('\n\n');
  const tags = Array.isArray(question.tags) ? question.tags.join('、') : '';

  return [
    `### ${String(index + 1).padStart(3, '0')}. ${question.id}`,
    '',
    `- 分类：${CATEGORY_META[question.category]?.name || question.category}（${question.category}）`,
    `- 难度：${question.difficulty}`,
    `- 题型：${question.type}`,
    `- 关联关卡：${question.relatedLevelKid || '无'}`,
    `- 标签：${tags || '无'}`,
    '',
    `**场景**：${question.scenario}`,
    '',
    '**题干**：',
    '',
    question.prompt,
    '',
    '**选项**：',
    '',
    optionLines,
    '',
    `**正确答案**：${correctLetters(question)}`,
    '',
    '**错误选项解析**：',
    '',
    explainLines || '无',
    '',
    '**整体解析**：',
    '',
    question.overallExplain,
    '',
    '---',
    '',
  ].join('\n');
}

function formatCategory(category, questions) {
  const meta = CATEGORY_META[category] || { name: category };
  return [
    `# FoxSay 微练习题库 - ${meta.name}`,
    '',
    `- 分类代码：${category}`,
    `- 题目数量：${questions.length}`,
    `- 来源文件：C:\\FoxSay\\src\\data\\quizBank.ts`,
    '',
    ...questions.map((question, index) => formatQuestion(question, index)),
  ].join('\n');
}

function formatFullMarkdown(bank, grouped) {
  const categorySummary = CATEGORY_ORDER
    .map(category => `- ${CATEGORY_META[category].name}（${category}）：${grouped.get(category)?.length || 0} 题`)
    .join('\n');

  const categorySections = CATEGORY_ORDER
    .map(category => {
      const questions = grouped.get(category) || [];
      return [
        `## ${CATEGORY_META[category].name}（${category}）`,
        '',
        ...questions.map((question, index) => formatQuestion(question, index)),
      ].join('\n');
    })
    .join('\n');

  return [
    '# FoxSay 微练习题库 - 完整 400 题',
    '',
    `- 来源文件：C:\\FoxSay\\src\\data\\quizBank.ts`,
    `- 题目总数：${bank.length}`,
    '- 内容：题干、选项、正确答案、错误选项解析、整体解析、标签、关联关卡',
    '',
    '## 分类统计',
    '',
    categorySummary,
    '',
    categorySections,
  ].join('\n');
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function main() {
  const bank = loadBank();
  const grouped = groupByCategory(bank);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const fullJsonPath = path.join(OUT_DIR, 'FoxSay微练习题库-完整400题.json');
  const fullMdPath = path.join(OUT_DIR, 'FoxSay微练习题库-完整400题.md');
  const readmePath = path.join(OUT_DIR, 'README.md');

  writeJson(fullJsonPath, {
    source: 'C:\\FoxSay\\src\\data\\quizBank.ts',
    total: bank.length,
    categories: Object.fromEntries([...grouped.entries()].map(([category, questions]) => [category, questions.length])),
    questions: bank,
  });
  fs.writeFileSync(fullMdPath, formatFullMarkdown(bank, grouped), 'utf8');

  const categoryFiles = [];
  for (const category of CATEGORY_ORDER) {
    const questions = grouped.get(category) || [];
    const meta = CATEGORY_META[category];
    const mdPath = path.join(OUT_DIR, meta.file);
    const jsonPath = path.join(OUT_DIR, meta.file.replace(/\.md$/, '.json'));
    fs.writeFileSync(mdPath, formatCategory(category, questions), 'utf8');
    writeJson(jsonPath, questions);
    categoryFiles.push(meta.file, meta.file.replace(/\.md$/, '.json'));
  }

  fs.writeFileSync(
    readmePath,
    [
      '# FoxSay 微练习题目导出',
      '',
      '题库源码位置：`C:\\FoxSay\\src\\data\\quizBank.ts`',
      '',
      '本文件夹包含：',
      '',
      '- `FoxSay微练习题库-完整400题.md`：适合人工审阅的完整题库。',
      '- `FoxSay微练习题库-完整400题.json`：适合程序处理或再次导入的完整题库。',
      '- `01-反PUA.md` 到 `08-挽回前任.md`：按主题拆分的阅读版。',
      '- `01-反PUA.json` 到 `08-挽回前任.json`：按主题拆分的数据版。',
      '',
      `导出题目总数：${bank.length}`,
      '',
    ].join('\n'),
    'utf8',
  );

  console.log(`EXPORTED_DIR=${OUT_DIR}`);
  console.log(`TOTAL=${bank.length}`);
  console.log(`FILES=${3 + categoryFiles.length}`);
  console.log(`FULL_JSON=${fullJsonPath}`);
  console.log(`FULL_MARKDOWN=${fullMdPath}`);
}

main();