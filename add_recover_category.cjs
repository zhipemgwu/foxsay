const fs = require('fs');
const quizPath = 'C:\\FoxSay\\src\\services\\quiz.ts';
let txt = fs.readFileSync(quizPath, 'utf8');

// Add to QuizCategory union type
txt = txt.replace(
  /\| 'refuse';\s*\/\/\s*拒绝(.*)/g, 
  "| 'refuse'        // 拒绝$1\n  | 'recover';      // 挽回练习"
);

// Add to CATEGORY_META object
txt = txt.replace(
  /'refuse':\s*{\s*label:\s*'拒绝练习',\s*emoji:\s*'🛡️',\s*color:\s*'#95E1D3',\s*desc:\s*'体面说不.*'\s*},/g,
  "'refuse':        { label: '拒绝练习',   emoji: '🛡️', color: '#95E1D3', desc: '体面说不 / 退出关系' },\n  'recover':       { label: '挽回练习',   emoji: '💔', color: '#5C4033', desc: '复联策略 / 二次吸引' },"
);

fs.writeFileSync(quizPath, txt, 'utf8');
