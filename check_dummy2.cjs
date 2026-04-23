const fs = require('fs');
const txt = fs.readFileSync('C:\\FoxSay\\src\\data\\quizBank.ts', 'utf8');
const ms = txt.match(/text:\s*['"`]([^'"`]+)['"`]/g) || [];
console.log(ms.slice(0, 20).join('\n'));
