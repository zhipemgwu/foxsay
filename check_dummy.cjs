const fs = require('fs');

const txt = fs.readFileSync('C:\\FoxSay\\src\\data\\quizBank.ts', 'utf8');
const ms = txt.match(/text:\s*['"]([^\n"']+)['"]/g) || [];
const uniqueResponses = Array.from(new Set(ms)).filter(x => x.includes('回应') || x.includes('敷衍'));
console.log(uniqueResponses.slice(0, 20).join('\n'));
console.log(`Total dummy found: ${uniqueResponses.length}`);
