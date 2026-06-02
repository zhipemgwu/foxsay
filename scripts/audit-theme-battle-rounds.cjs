const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const esbuild = require('esbuild');

const sourcePath = path.join(__dirname, '..', 'src', 'data', 'themeBattleChallenges.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const compiled = esbuild.transformSync(source, { loader: 'ts', format: 'cjs', platform: 'node' }).code;

const moduleBox = { exports: {} };
vm.runInNewContext(compiled, {
  module: moduleBox,
  exports: moduleBox.exports,
  require,
  console,
}, { filename: 'themeBattleChallenges.cjs' });

const challenges = moduleBox.exports.THEME_BATTLE_CHALLENGES;

const chatNodeMerges = {
  'ambiguous-late-night-1': 'ambiguous-late-night-2',
  'emotion-tired-1': 'emotion-tired-2',
  'emotion-silent-1': 'emotion-silent-2',
  'refuse-persistent-1': 'refuse-persistent-2',
  'refuse-exit-date-1': 'refuse-exit-date-2',
  'recover-first-message-1': 'recover-first-message-2',
  'recover-past-question-1': 'recover-past-question-2',
  'love-cold-war-1': 'love-cold-war-2',
};

function getPlayableCount(challenge) {
  const nodeIds = new Set(challenge.nodes.map(node => node.id));
  const consumedIds = new Set();
  let count = 0;

  for (const node of challenge.nodes) {
    if (consumedIds.has(node.id)) continue;
    const replyNodeId = chatNodeMerges[node.id];
    if (replyNodeId && nodeIds.has(replyNodeId)) consumedIds.add(replyNodeId);
    count += 1;
  }

  return count;
}

const rows = challenges.map(challenge => ({
  category: challenge.category,
  id: challenge.id,
  playable: getPlayableCount(challenge),
  raw: challenge.nodes.length,
}));

const lengthStats = new Map();
for (const challenge of challenges) {
  for (const node of challenge.nodes) {
    const correctOption = node.options.find(option => option.isCorrect);
    const wrongOptions = node.options.filter(option => !option.isCorrect);
    if (!correctOption || wrongOptions.length === 0) continue;

    const correctLength = correctOption.text.length;
    const wrongLengths = wrongOptions.map(option => option.text.length);
    const isCorrectLongest = wrongLengths.every(length => correctLength > length);
    const stats = lengthStats.get(challenge.category) || { total: 0, correctLongest: 0 };
    stats.total += 1;
    if (isCorrectLongest) stats.correctLongest += 1;
    lengthStats.set(challenge.category, stats);
  }
}

const shortRows = rows.filter(row => row.playable < 6);
console.log(`total=${rows.length} short=${shortRows.length}`);

for (const row of shortRows) {
  console.log(`${row.category} ${row.id} playable=${row.playable} raw=${row.raw}`);
}

const categoryCounts = new Map();
for (const row of rows) {
  if (!categoryCounts.has(row.category)) categoryCounts.set(row.category, []);
  categoryCounts.get(row.category).push(row.playable);
}

for (const [category, counts] of Array.from(categoryCounts.entries()).sort()) {
  const sum = counts.reduce((total, count) => total + count, 0);
  console.log(`${category} min=${Math.min(...counts)} max=${Math.max(...counts)} avg=${(sum / counts.length).toFixed(1)}`);
}

for (const [category, stats] of Array.from(lengthStats.entries()).sort()) {
  console.log(`${category} correctLongest=${stats.correctLongest}/${stats.total} ratio=${(stats.correctLongest / stats.total).toFixed(2)}`);
}

if (shortRows.length > 0) {
  process.exitCode = 1;
}
