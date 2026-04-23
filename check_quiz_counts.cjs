const fs = require('fs');

const path = 'C:\\FoxSay\\src\\data\\quizBank.ts';
let txt = fs.readFileSync(path, 'utf8');
console.log("Length:", txt.length);
console.log("Q count:", (txt.match(/id:/g) || []).length);
