const fs = require('fs');
const path = require('path');

const BANK_PATH = path.join(__dirname, '..', 'src', 'data', 'quizBank.ts');
const STRICT = process.argv.includes('--strict');
const META_OPTION_RE = /高分点|迷惑点|判断标准|这次先围绕|它看似|它有礼貌|它能快速|它把压力|它从现场|它给对方|它听起来|它先照顾|它看起来|它有建议价值|它有诚意|多给一点解释|这样比较顾及|我有点不知道怎么绕|你要是方便的话，我们可以多说两句|暧昧本来就要有一点来回拉扯|如果她在意你，应该会继续给反应|不把话说重点|我也想知道你心里到底怎么想|我希望你能先看见我的委屈|先别把事情想得太严重|他可能只是安全感不太够|先给方向，她才不会一直困在里面|让她看到你还在等，也许会心软|至少不能错过这次难得的窗口|就拿.+这次来说也是这样/;
const OPTION_BREAKDOWN_RE = /选项拆解|[A-F]\s*[对错]：/;
const LETTERS = ['A', 'B', 'C', 'D'];

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

function len(text) {
  return Array.from(String(text || '').replace(/\s+/g, '')).length;
}

function sentenceParts(text) {
  const parts = [];
  let current = '';
  for (const char of String(text || '').replace(/\s+/g, ' ')) {
    current += char;
    if ('。！？!?'.includes(char)) {
      const trimmed = current.trim();
      if (len(trimmed) >= 8) parts.push(trimmed);
      current = '';
    }
  }
  const tail = current.trim();
  if (len(tail) >= 8) parts.push(tail);
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

function percent(value, total) {
  if (!total) return '0.0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

function topEntries(map, limit = 10) {
  return [...map.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, limit);
}

function audit(bank) {
  const categoryCounts = new Map();
  const scenarioMap = new Map();
  const baseScenarioByCategory = new Map();
  const promptMap = new Map();
  const optionMap = new Map();
  const optionMapByCategory = new Map();
  const statsByCategory = new Map();
  const answerPositionByCategory = new Map();
  const problems = [];
  let adjacentSameScenario = 0;
  let correctLongest = 0;
  let correctShortest = 0;
  let correctShortLeak = 0;
  let lengthLeak = 0;
  let wideSpread = 0;
  let repeatedSentence = 0;
  let maxRatio = 0;
  let metaOptionText = 0;
  let correctOptionExplain = 0;
  let missingWrongExplain = 0;
  let overallOptionBreakdown = 0;

  for (let i = 0; i < bank.length; i++) {
    const q = bank[i];
    categoryCounts.set(q.category, (categoryCounts.get(q.category) || 0) + 1);
    if (!scenarioMap.has(q.scenario)) scenarioMap.set(q.scenario, []);
    scenarioMap.get(q.scenario).push(q.id);
    const baseScenario = String(q.scenario || '').split('；')[0].trim();
    if (!baseScenarioByCategory.has(q.category)) baseScenarioByCategory.set(q.category, new Map());
    const categoryBaseScenarios = baseScenarioByCategory.get(q.category);
    if (!categoryBaseScenarios.has(baseScenario)) categoryBaseScenarios.set(baseScenario, []);
    categoryBaseScenarios.get(baseScenario).push(q.id);
    if (!promptMap.has(q.prompt)) promptMap.set(q.prompt, []);
    promptMap.get(q.prompt).push(q.id);
    if (i > 0 && bank[i - 1].scenario === q.scenario) adjacentSameScenario++;
    if (OPTION_BREAKDOWN_RE.test(q.overallExplain || '')) {
      overallOptionBreakdown++;
      problems.push(`${q.id}: overallExplain contains option breakdown`);
    }

    const correct = q.options.find(o => o.isCorrect);
    const correctIndex = q.options.findIndex(o => o.isCorrect);
    const wrong = q.options.filter(o => !o.isCorrect);
    const optionLens = q.options.map(o => len(o.text));
    const correctLen = len(correct?.text);
    const wrongLens = wrong.map(o => len(o.text));
    const maxLen = Math.max(...optionLens);
    const minLen = Math.min(...optionLens);
    const ratio = maxLen / Math.max(1, minLen);
    maxRatio = Math.max(maxRatio, ratio);
    const wrongMax = Math.max(...wrongLens);
    const wrongMin = Math.min(...wrongLens);

    if (!statsByCategory.has(q.category)) {
      statsByCategory.set(q.category, { total: 0, correctLongest: 0, lengthLeak: 0, wideSpread: 0 });
    }
    const cat = statsByCategory.get(q.category);
    cat.total++;
    if (!answerPositionByCategory.has(q.category)) answerPositionByCategory.set(q.category, [0, 0, 0, 0]);
    if (correctIndex >= 0) answerPositionByCategory.get(q.category)[correctIndex]++;

    if (correctLen === maxLen && optionLens.filter(n => n === maxLen).length === 1) {
      correctLongest++;
      cat.correctLongest++;
    }
    if (correctLen === minLen && optionLens.filter(n => n === minLen).length === 1) {
      correctShortest++;
    }
    if (wrongMin - correctLen >= 12 || wrongMin / Math.max(1, correctLen) >= 1.25) {
      correctShortLeak++;
      problems.push(`${q.id}: correct option too short (${correctLen} vs wrong min ${wrongMin})`);
    }
    if (correctLen - wrongMax >= 12 || correctLen / Math.max(1, wrongMax) >= 1.25) {
      lengthLeak++;
      cat.lengthLeak++;
      problems.push(`${q.id}: correct option length leaks (${correctLen} vs wrong max ${wrongMax})`);
    }
    if (ratio >= 1.8 || maxLen - minLen >= 35) {
      wideSpread++;
      cat.wideSpread++;
      problems.push(`${q.id}: option length spread too wide (${minLen}-${maxLen}, ratio ${ratio.toFixed(2)})`);
    }
    if (wrongMax - wrongMin >= 45) {
      problems.push(`${q.id}: wrong options are uneven (${wrongMin}-${wrongMax})`);
    }
    for (const option of q.options) {
      const text = option.text;
      if (META_OPTION_RE.test(text)) {
        metaOptionText++;
        problems.push(`${q.id}: option text contains meta explanation (${text.slice(0, 60)})`);
      }
      if (option.isCorrect && option.explain) {
        correctOptionExplain++;
        problems.push(`${q.id}: correct option explain should be empty`);
      }
      if (!option.isCorrect && len(option.explain) < 16) {
        missingWrongExplain++;
        problems.push(`${q.id}: wrong option explain missing or too short`);
      }
      if (hasRepeatedSentence(text)) {
        repeatedSentence++;
        problems.push(`${q.id}: repeated sentence in option (${text.slice(0, 60)})`);
      }
      if (!optionMap.has(text)) optionMap.set(text, []);
      optionMap.get(text).push(`${q.id}${option.isCorrect ? '*' : ''}`);
      const categoryOptionKey = `${q.category}\u0000${text}`;
      if (!optionMapByCategory.has(categoryOptionKey)) optionMapByCategory.set(categoryOptionKey, { category: q.category, text, ids: [] });
      optionMapByCategory.get(categoryOptionKey).ids.push(`${q.id}${option.isCorrect ? '*' : ''}`);
    }
  }

  const repeatedScenarios = topEntries(scenarioMap, 12).filter(([, ids]) => ids.length > 1);
  const repeatedPrompts = topEntries(promptMap, 12).filter(([, ids]) => ids.length > 1);
  const repeatedOptions = topEntries(optionMap, 12).filter(([, ids]) => ids.length > 1);
  const ambiguousBaseScenarioDuplicates = [...(baseScenarioByCategory.get('ambiguous') || new Map()).entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([text, ids]) => ({ count: ids.length, text, ids: ids.slice(0, 10) }));
  const ambiguousRepeatedOptions = [...optionMapByCategory.values()]
    .filter(entry => entry.category === 'ambiguous' && entry.ids.length > 1)
    .map(entry => ({ count: entry.ids.length, text: entry.text.slice(0, 80), ids: entry.ids.slice(0, 10) }))
    .sort((a, b) => b.count - a.count);
  const answerPositionSummary = Object.fromEntries([...answerPositionByCategory.entries()].map(([category, counts]) => [
    category,
    Object.fromEntries(LETTERS.map((letter, index) => [letter, counts[index] || 0])),
  ]));

  console.log('Quiz bank quality audit');
  console.log('questions:', bank.length);
  console.log('category counts:', Object.fromEntries(categoryCounts.entries()));
  console.log('adjacent same scenario:', adjacentSameScenario);
  console.log('unique scenarios:', scenarioMap.size);
  console.log('repeated scenario top:', repeatedScenarios.map(([text, ids]) => ({ count: ids.length, text, ids: ids.slice(0, 8) })));
  console.log('ambiguous base scenario duplicates:', ambiguousBaseScenarioDuplicates);
  console.log('repeated prompt top:', repeatedPrompts.map(([text, ids]) => ({ count: ids.length, text: text.slice(0, 80), ids: ids.slice(0, 8) })));
  console.log('repeated option top:', repeatedOptions.map(([text, ids]) => ({ count: ids.length, text: text.slice(0, 80), ids: ids.slice(0, 10) })));
  console.log('ambiguous repeated option top:', ambiguousRepeatedOptions.slice(0, 12));
  console.log('correct longest:', `${correctLongest}/${bank.length}`, percent(correctLongest, bank.length));
  console.log('correct shortest:', `${correctShortest}/${bank.length}`, percent(correctShortest, bank.length));
  console.log('correct short leak:', `${correctShortLeak}/${bank.length}`, percent(correctShortLeak, bank.length));
  console.log('length leak:', `${lengthLeak}/${bank.length}`, percent(lengthLeak, bank.length));
  console.log('wide option spread:', `${wideSpread}/${bank.length}`, percent(wideSpread, bank.length));
  console.log('repeated option sentence:', `${repeatedSentence}/${bank.length}`, percent(repeatedSentence, bank.length));
  console.log('meta option text:', metaOptionText);
  console.log('correct option explains:', correctOptionExplain);
  console.log('missing wrong explains:', missingWrongExplain);
  console.log('overall option breakdown:', overallOptionBreakdown);
  console.log('max option length ratio:', maxRatio.toFixed(2));
  console.log('correct positions by category:', answerPositionSummary);
  console.log('by category:', Object.fromEntries([...statsByCategory.entries()].map(([category, s]) => [category, {
    total: s.total,
    correctLongest: percent(s.correctLongest, s.total),
    lengthLeak: percent(s.lengthLeak, s.total),
    wideSpread: percent(s.wideSpread, s.total),
  }])));

  const gates = [];
  if (bank.length !== 400) gates.push(`expected 400 questions, got ${bank.length}`);
  for (const [category, count] of categoryCounts.entries()) {
    if (count !== 50) gates.push(`${category} expected 50, got ${count}`);
  }
  if (adjacentSameScenario > 0) gates.push(`adjacent repeated scenarios: ${adjacentSameScenario}`);
  if (ambiguousBaseScenarioDuplicates.length > 0) gates.push(`ambiguous base scenario duplicates: ${ambiguousBaseScenarioDuplicates.length}`);
  if (scenarioMap.size < 360) gates.push(`not enough unique scenarios: ${scenarioMap.size}`);
  if (repeatedSentence > 0) gates.push(`repeated option sentences: ${repeatedSentence}`);
  if (metaOptionText > 0) gates.push(`meta option text: ${metaOptionText}`);
  if (correctOptionExplain > 0) gates.push(`correct option explains: ${correctOptionExplain}`);
  if (missingWrongExplain > 0) gates.push(`missing wrong explains: ${missingWrongExplain}`);
  if (overallOptionBreakdown > 0) gates.push(`overall option breakdowns: ${overallOptionBreakdown}`);
  if (ambiguousRepeatedOptions.length > 0) gates.push(`ambiguous repeated options: ${ambiguousRepeatedOptions.length}`);
  for (const [category, counts] of answerPositionByCategory.entries()) {
    const total = counts.reduce((sum, value) => sum + value, 0);
    const max = Math.max(...counts);
    const min = Math.min(...counts);
    if (total >= 20 && (max / total > 0.8 || min === 0)) {
      gates.push(`${category} answer positions skewed: ${JSON.stringify(answerPositionSummary[category])}`);
    }
  }
  if (repeatedOptions.some(([, ids]) => ids.length >= 3)) gates.push('option text repeated 3+ times');

  if (problems.length) {
    console.log('problem samples:', problems.slice(0, 30));
  }
  if (STRICT && gates.length) {
    console.error('STRICT AUDIT FAILED');
    for (const gate of gates) console.error('-', gate);
    process.exit(1);
  }
  if (STRICT) console.log('STRICT AUDIT PASSED');
}

audit(loadBank());